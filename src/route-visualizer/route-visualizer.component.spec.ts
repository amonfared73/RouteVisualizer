import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteVisualizerComponent } from './route-visualizer.component';

describe('RouteVisualizerComponent', () => {
  let component: RouteVisualizerComponent;
  let fixture: ComponentFixture<RouteVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteVisualizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
