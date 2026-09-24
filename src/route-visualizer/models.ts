export interface RouteVisualizerLabels {
    order?: string;
    productNumber?: string;
    productName?: string;
    amount?: string;
    cost?: string;    // tooltip of the pill on the connector lines
    stops?: string;   // the counter in the header, e.g. "ایستگاه"
    empty?: string;   // shown when the list is empty
}

export interface WarehouseRouteNode {
    order: number;             // visiting order of the node (from the dijkstra plan)
    productNumber: string;     // product code to put/pick
    productName: string;
    amount: number;            // quantity to put/pick
    nodeName: string;          // warehouse location: zone / floor / shelf ...
    computationalCost: number; // unit cost/effort of reaching this node
}

export interface Rect { left: number; top: number; right: number; bottom: number; cx: number; cy: number; }
export interface Connector { d: string; labelX: number; labelY: number; cost: number; }