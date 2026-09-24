import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteVisualizerComponent } from '../route-visualizer/route-visualizer.component';
import { WarehouseRouteNode } from '../route-visualizer/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouteVisualizerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-test-app';


  routes: WarehouseRouteNode[] = [
    { order: 1, productNumber: 'PRD-1042', productName: 'Steel Bolt M8', amount: 120, nodeName: 'Zone A / Floor 1', computationalCost: 12 },
    { order: 2, productNumber: 'PRD-2087', productName: 'Bearing 6204', amount: 40, nodeName: 'Zone A / Shelf 3', computationalCost: 8 },
    { order: 3, productNumber: 'PRD-3310', productName: 'Hydraulic Hose', amount: 15, nodeName: 'Zone B / Floor 2', computationalCost: 15 },
    { order: 4, productNumber: 'PRD-4155', productName: 'Oil Filter F-22', amount: 65, nodeName: 'Zone B / Shelf 1', computationalCost: 5 },
    { order: 5, productNumber: 'PRD-5023', productName: 'Drive Belt B7', amount: 30, nodeName: 'Zone C / Floor 1', computationalCost: 9 },
    { order: 6, productNumber: 'PRD-6011', productName: 'Air Valve V-9', amount: 22, nodeName: 'Zone C / Shelf 4', computationalCost: 7 },
    { order: 7, productNumber: 'PRD-1042', productName: 'Steel Bolt M8', amount: 120, nodeName: 'Zone A / Floor 1', computationalCost: 12 },
    { order: 8, productNumber: 'PRD-2087', productName: 'Bearing 6204', amount: 40, nodeName: 'Zone A / Shelf 3', computationalCost: 8 },
    { order: 9, productNumber: 'PRD-3310', productName: 'Hydraulic Hose', amount: 15, nodeName: 'Zone B / Floor 2', computationalCost: 15 },
    { order: 10, productNumber: 'PRD-4155', productName: 'Oil Filter F-22', amount: 65, nodeName: 'Zone B / Shelf 1', computationalCost: 5 },
    { order: 11, productNumber: 'PRD-5023', productName: 'Drive Belt B7', amount: 30, nodeName: 'Zone C / Floor 1', computationalCost: 9 },
    { order: 12, productNumber: 'PRD-6011', productName: 'Air Valve V-9', amount: 22, nodeName: 'Zone C / Shelf 4', computationalCost: 7 },
    { order: 13, productNumber: 'PRD-1042', productName: 'Steel Bolt M8', amount: 120, nodeName: 'Zone A / Floor 1', computationalCost: 12 },
    { order: 14, productNumber: 'PRD-2087', productName: 'Bearing 6204', amount: 40, nodeName: 'Zone A / Shelf 3', computationalCost: 8 },
    { order: 15, productNumber: 'PRD-3310', productName: 'Hydraulic Hose', amount: 15, nodeName: 'Zone B / Floor 2', computationalCost: 15 },
    { order: 16, productNumber: 'PRD-4155', productName: 'Oil Filter F-22', amount: 65, nodeName: 'Zone B / Shelf 1', computationalCost: 5 },
    { order: 17, productNumber: 'PRD-5023', productName: 'Drive Belt B7', amount: 30, nodeName: 'Zone C / Floor 1', computationalCost: 9 },
    { order: 18, productNumber: 'PRD-6011', productName: 'Air Valve V-9', amount: 22, nodeName: 'Zone C / Shelf 4', computationalCost: 7 },
    { order: 19, productNumber: 'PRD-4155', productName: 'Oil Filter F-22', amount: 65, nodeName: 'Zone B / Shelf 1', computationalCost: 5 },
    { order: 20, productNumber: 'PRD-5023', productName: 'Drive Belt B7', amount: 30, nodeName: 'Zone C / Floor 1', computationalCost: 9 },
    { order: 21, productNumber: 'PRD-6011', productName: 'Air Valve V-9', amount: 22, nodeName: 'Zone C / Shelf 4', computationalCost: 7 },
  ];

  selectedNode: WarehouseRouteNode | null = null;

  onNodeClicked(node: WarehouseRouteNode): void {
    this.selectedNode = node;               // the full object, emitted by the card
    console.log('Route node clicked:', node);
  }

}
