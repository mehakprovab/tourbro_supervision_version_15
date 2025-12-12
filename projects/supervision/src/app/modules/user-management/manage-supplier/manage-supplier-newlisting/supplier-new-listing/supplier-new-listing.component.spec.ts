import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierNewListingComponent } from './supplier-new-listing.component';

describe('SupplierNewListingComponent', () => {
  let component: SupplierNewListingComponent;
  let fixture: ComponentFixture<SupplierNewListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierNewListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierNewListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
