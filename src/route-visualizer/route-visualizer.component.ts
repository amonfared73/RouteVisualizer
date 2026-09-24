import { Component, ElementRef, EventEmitter, inject, Input, Output, PLATFORM_ID, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Connector, Rect, RouteVisualizerLabels, WarehouseRouteNode } from './models';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-route-visualizer',
  imports: [CommonModule],
  templateUrl: './route-visualizer.component.html',
  styleUrl: './route-visualizer.component.css'
})
export class RouteVisualizerComponent {
  @Input() routes: WarehouseRouteNode[] = [];
  @Input() title = 'Route Visualization';
  @Input() cardsPerRow = 5;
  /** true = every second row flows right-to-left (snake layout) */
  @Input() serpentine = true;
  /** true = right-to-left layout (Persian/Arabic): grid flows R→L, text aligned right */
  @Input() rtl = false;
  /** true = render digits as Persian numerals (۱۲۳) */
  @Input() persianDigits = false;
  /** caption overrides for the card fields */
  @Input() labels: RouteVisualizerLabels = {};

  /** emits the FULL route object of the clicked card */
  @Output() nodeClick = new EventEmitter<WarehouseRouteNode>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLElement>;
  @ViewChildren('card') cardEls!: QueryList<ElementRef<HTMLElement>>;

  cards: { node: WarehouseRouteNode; row: number; col: number }[] = [];
  connectors: Connector[] = [];
  svgWidth = 0;
  svgHeight = 0;

  private readonly jog = 16;          // horizontal jog outside the row when wrapping
  private resizeObserver?: ResizeObserver;
  private frame = 0;
  private platformId = inject(PLATFORM_ID);

  private static readonly faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  private readonly defaultLabels: Required<RouteVisualizerLabels> = {
    order: 'order',
    productNumber: 'productNumber',
    productName: 'productName',
    amount: 'amount',
    cost: 'computationalCost',
    stops: 'stops',
    empty: 'No route nodes to display.',
  };

  /** merged labels (defaults + user overrides) */
  get lbl(): Required<RouteVisualizerLabels> {
    return { ...this.defaultLabels, ...this.labels };
  }

  /** converts ASCII digits to Persian numerals when persianDigits is on */
  fmt(value: number | string): string {
    const s = String(value);
    if (!this.persianDigits) return s;
    return s.replace(/[0-9]/g, d => RouteVisualizerComponent.faDigits[+d]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['routes'] || changes['cardsPerRow'] || changes['serpentine']) {
      this.rebuild();
      // let the new grid render before measuring card positions
      Promise.resolve().then(() => this.redraw());
    } else if (changes['rtl']) {
      // the grid flow flips with direction → re-measure once the new layout exists
      Promise.resolve().then(() => this.scheduleRedraw());
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cardEls.changes.subscribe(() => this.scheduleRedraw());
    this.resizeObserver = new ResizeObserver(() => this.scheduleRedraw());
    this.resizeObserver.observe(this.canvasRef.nativeElement);
    this.redraw();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    cancelAnimationFrame(this.frame);
  }

  onCardClick(node: WarehouseRouteNode): void {
    this.nodeClick.emit(node);
  }

  // ---------- layout ----------

  private rebuild(): void {
    const perRow = Math.max(1, this.cardsPerRow || 5);
    const sorted = [...(this.routes ?? [])].sort((a, b) => a.order - b.order);

    this.cards = sorted.map((node, i) => {
      const row = Math.floor(i / perRow);
      let col = i % perRow;
      if (this.serpentine && row % 2 === 1) col = perRow - 1 - col;
      return { node, row, col };
    });
    this.connectors = [];
  }

  private scheduleRedraw(): void {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.redraw());
  }

  private redraw(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const origin = canvas.getBoundingClientRect();
    this.svgWidth = canvas.clientWidth;
    this.svgHeight = canvas.clientHeight;

    const rects: Rect[] = this.cardEls.map(el => {
      const r = el.nativeElement.getBoundingClientRect();
      return {
        left: r.left - origin.left, right: r.right - origin.left,
        top: r.top - origin.top, bottom: r.bottom - origin.top,
        cx: r.left - origin.left + r.width / 2,
        cy: r.top - origin.top + r.height / 2,
      };
    });

    this.connectors = [];
    for (let i = 0; i < rects.length - 1; i++) {
      // the pill on a line shows the cost of the node the arrow leads TO
      const cost = this.cards[i + 1]?.node.computationalCost ?? 0;
      this.connectors.push(this.connect(rects[i], rects[i + 1], cost));
    }
  }

  private connect(a: Rect, b: Rect, cost: number): Connector {
    const pts: Array<[number, number]> = [];
    const sameRow = Math.abs(a.cy - b.cy) < Math.max(1, (a.bottom - a.top) * 0.25);

    if (sameRow) {
      // same row → straight horizontal arrow in the flow direction
      if (b.cx > a.cx) pts.push([a.right, a.cy], [b.left, b.cy]);
      else             pts.push([a.left, a.cy], [b.right, b.cy]);
    } else if (Math.abs(a.cx - b.cx) < 1) {
      // target sits directly below (serpentine wrap) → straight vertical arrow
      pts.push([a.cx, a.bottom], [b.cx, b.top]);
    } else {
      // row change → leave the row, travel through the gap, drop into the next card
      const gapY = (a.bottom + b.top) / 2;
      if (b.cx < a.cx) {
        pts.push([a.right, a.cy], [a.right + this.jog, a.cy], [a.right + this.jog, gapY],
                 [b.cx, gapY], [b.cx, b.top]);
      } else {
        pts.push([a.left, a.cy], [a.left - this.jog, a.cy], [a.left - this.jog, gapY],
                 [b.cx, gapY], [b.cx, b.top]);
      }
    }

    // find the longest segment
    let best = { len: -1, x: pts[0][0], y: pts[0][1] };
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
      const len = Math.hypot(x2 - x1, y2 - y1);
      if (len > best.len) best = { len, x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    }

    // on short same-row hops the pill would cover the whole line → lift it above the line
    const pillOffset = sameRow ? 18 : 0;

    return {
      d: pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' '),
      labelX: best.x,
      labelY: best.y - pillOffset,
      cost,
    };
  }
}
