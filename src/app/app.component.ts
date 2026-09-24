import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteVisualizerComponent } from '../route-visualizer/route-visualizer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouteVisualizerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-test-app';
}
