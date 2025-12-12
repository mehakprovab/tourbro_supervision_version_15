import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateAirlinePartnerComponent } from './add-update-airline-partner.component';

describe('AddUpdateAirlinePartnerComponent', () => {
  let component: AddUpdateAirlinePartnerComponent;
  let fixture: ComponentFixture<AddUpdateAirlinePartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateAirlinePartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateAirlinePartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
