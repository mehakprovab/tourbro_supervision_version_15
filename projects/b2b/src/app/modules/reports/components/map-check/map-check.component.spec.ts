import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCheckComponent } from './map-check.component';

describe('MapCheckComponent', () => {
  let component: MapCheckComponent;
  let fixture: ComponentFixture<MapCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
