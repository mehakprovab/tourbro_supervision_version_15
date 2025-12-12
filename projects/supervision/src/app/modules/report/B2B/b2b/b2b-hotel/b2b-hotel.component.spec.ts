import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bHotelComponent } from './b2b-hotel.component';

describe('B2bHotelComponent', () => {
  let component: B2bHotelComponent;
  let fixture: ComponentFixture<B2bHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
