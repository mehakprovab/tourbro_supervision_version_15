import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePackageTypeListComponent } from './add-update-package-type-list.component';

describe('AddUpdatePackageTypeListComponent', () => {
  let component: AddUpdatePackageTypeListComponent;
  let fixture: ComponentFixture<AddUpdatePackageTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdatePackageTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdatePackageTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
