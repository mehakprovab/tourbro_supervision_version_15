import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedInUsersComponent } from './logged-in-users.component';

describe('LoggedInUsersComponent', () => {
  let component: LoggedInUsersComponent;
  let fixture: ComponentFixture<LoggedInUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggedInUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedInUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
