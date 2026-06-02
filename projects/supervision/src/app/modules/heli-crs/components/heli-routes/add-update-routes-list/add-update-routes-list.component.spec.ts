import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateRoutesListComponent } from './add-update-routes-list.component';

describe('AddUpdateRoutesListComponent', () => {
  let component: AddUpdateRoutesListComponent;
  let fixture: ComponentFixture<AddUpdateRoutesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateRoutesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateRoutesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
