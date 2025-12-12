import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyCustomerFaqComponent } from './add-or-modify-customer-faq.component';

describe('AddOrModifyCustomerFaqComponent', () => {
  let component: AddOrModifyCustomerFaqComponent;
  let fixture: ComponentFixture<AddOrModifyCustomerFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyCustomerFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyCustomerFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
