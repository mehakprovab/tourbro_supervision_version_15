import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCustomerFaqComponent } from './add-update-customer-faq.component';

describe('AddUpdateCustomerFaqComponent', () => {
  let component: AddUpdateCustomerFaqComponent;
  let fixture: ComponentFixture<AddUpdateCustomerFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateCustomerFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateCustomerFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
