import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSupplierInactiveComponent } from './manage-supplier-inactive.component';

describe('ManageSupplierInactiveComponent', () => {
  let component: ManageSupplierInactiveComponent;
  let fixture: ComponentFixture<ManageSupplierInactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSupplierInactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSupplierInactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
