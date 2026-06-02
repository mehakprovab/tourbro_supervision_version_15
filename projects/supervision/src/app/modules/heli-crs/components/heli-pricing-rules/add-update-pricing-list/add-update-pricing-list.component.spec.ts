import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePricingListComponent } from './add-update-pricing-list.component';

describe('AddUpdatePricingListComponent', () => {
  let component: AddUpdatePricingListComponent;
  let fixture: ComponentFixture<AddUpdatePricingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdatePricingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdatePricingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
