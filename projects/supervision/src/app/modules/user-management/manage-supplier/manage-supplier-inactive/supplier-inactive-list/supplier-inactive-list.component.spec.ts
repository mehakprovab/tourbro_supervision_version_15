import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInactiveListComponent } from './supplier-inactive-list.component';

describe('SupplierInactiveListComponent', () => {
  let component: SupplierInactiveListComponent;
  let fixture: ComponentFixture<SupplierInactiveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierInactiveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierInactiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
