import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSupplierNewlistingComponent } from './manage-supplier-newlisting.component';

describe('ManageSupplierNewlistingComponent', () => {
  let component: ManageSupplierNewlistingComponent;
  let fixture: ComponentFixture<ManageSupplierNewlistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSupplierNewlistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSupplierNewlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
