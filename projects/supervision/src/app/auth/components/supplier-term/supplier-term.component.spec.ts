import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierTermComponent } from './supplier-term.component';

describe('SupplierTermComponent', () => {
  let component: SupplierTermComponent;
  let fixture: ComponentFixture<SupplierTermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierTermComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
