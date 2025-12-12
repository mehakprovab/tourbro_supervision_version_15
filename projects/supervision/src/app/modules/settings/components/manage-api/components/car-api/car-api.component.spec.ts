import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarApiComponent } from './car-api.component';

describe('CarApiComponent', () => {
  let component: CarApiComponent;
  let fixture: ComponentFixture<CarApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
