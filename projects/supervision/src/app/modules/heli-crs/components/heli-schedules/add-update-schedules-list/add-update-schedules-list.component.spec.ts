import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSchedulesListComponent } from './add-update-schedules-list.component';

describe('AddUpdateSchedulesListComponent', () => {
  let component: AddUpdateSchedulesListComponent;
  let fixture: ComponentFixture<AddUpdateSchedulesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSchedulesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSchedulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
