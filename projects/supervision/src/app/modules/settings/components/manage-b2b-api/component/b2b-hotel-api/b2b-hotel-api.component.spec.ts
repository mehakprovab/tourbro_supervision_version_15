import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bHotelApiComponent } from './b2b-hotel-api.component';

describe('B2bHotelApiComponent', () => {
  let component: B2bHotelApiComponent;
  let fixture: ComponentFixture<B2bHotelApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bHotelApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bHotelApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
