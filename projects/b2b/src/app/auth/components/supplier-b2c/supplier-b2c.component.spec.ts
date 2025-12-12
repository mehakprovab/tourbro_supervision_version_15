import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierB2cComponent } from './supplier-b2c.component';

describe('SupplierB2cComponent', () => {
  let component: SupplierB2cComponent;
  let fixture: ComponentFixture<SupplierB2cComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierB2cComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierB2cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
