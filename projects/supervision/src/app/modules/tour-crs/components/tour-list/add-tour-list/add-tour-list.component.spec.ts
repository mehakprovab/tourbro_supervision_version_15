import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTourListComponent } from './add-tour-list.component';

describe('AddTourListComponent', () => {
  let component: AddTourListComponent;
  let fixture: ComponentFixture<AddTourListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTourListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
