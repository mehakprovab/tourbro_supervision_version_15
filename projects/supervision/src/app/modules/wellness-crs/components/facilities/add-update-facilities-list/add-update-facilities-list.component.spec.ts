import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateFacilitiesListComponent } from './add-update-facilities-list.component';

describe('AddUpdateFacilitiesListComponent', () => {
  let component: AddUpdateFacilitiesListComponent;
  let fixture: ComponentFixture<AddUpdateFacilitiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateFacilitiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateFacilitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
