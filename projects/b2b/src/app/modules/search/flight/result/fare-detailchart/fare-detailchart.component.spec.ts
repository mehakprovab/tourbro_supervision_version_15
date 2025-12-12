import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareDetailchartComponent } from './fare-detailchart.component';

describe('FareDetailchartComponent', () => {
  let component: FareDetailchartComponent;
  let fixture: ComponentFixture<FareDetailchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FareDetailchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FareDetailchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
