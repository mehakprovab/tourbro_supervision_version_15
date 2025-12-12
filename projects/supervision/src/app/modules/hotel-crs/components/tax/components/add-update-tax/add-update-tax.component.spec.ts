import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTaxComponent } from './add-update-tax.component';

describe('AddUpdateTaxComponent', () => {
  let component: AddUpdateTaxComponent;
  let fixture: ComponentFixture<AddUpdateTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
