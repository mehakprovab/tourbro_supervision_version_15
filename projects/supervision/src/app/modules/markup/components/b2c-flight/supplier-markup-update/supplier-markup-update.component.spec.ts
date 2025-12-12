import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMarkupUpdateComponent } from './supplier-markup-update.component';

describe('SupplierMarkupUpdateComponent', () => {
  let component: SupplierMarkupUpdateComponent;
  let fixture: ComponentFixture<SupplierMarkupUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierMarkupUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMarkupUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
