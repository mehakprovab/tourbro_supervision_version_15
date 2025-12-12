import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAirlinePartnerComponent } from './list-airline-partner.component';

describe('ListAirlinePartnerComponent', () => {
  let component: ListAirlinePartnerComponent;
  let fixture: ComponentFixture<ListAirlinePartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAirlinePartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAirlinePartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
