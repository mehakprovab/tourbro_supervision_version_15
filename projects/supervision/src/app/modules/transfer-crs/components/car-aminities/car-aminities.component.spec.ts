import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAminitiesComponent } from './car-aminities.component';

describe('CarAminitiesComponent', () => {
  let component: CarAminitiesComponent;
  let fixture: ComponentFixture<CarAminitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarAminitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAminitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
