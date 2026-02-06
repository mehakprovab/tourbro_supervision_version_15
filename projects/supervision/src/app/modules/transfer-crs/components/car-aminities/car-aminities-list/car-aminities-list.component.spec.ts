import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAminitiesListComponent } from './car-aminities-list.component';

describe('CarAminitiesListComponent', () => {
  let component: CarAminitiesListComponent;
  let fixture: ComponentFixture<CarAminitiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarAminitiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAminitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
