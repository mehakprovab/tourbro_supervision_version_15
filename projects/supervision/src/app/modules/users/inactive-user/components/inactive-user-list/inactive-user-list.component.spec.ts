import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveUserListComponent } from './inactive-user-list.component';

describe('InactiveUserListComponent', () => {
  let component: InactiveUserListComponent;
  let fixture: ComponentFixture<InactiveUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
