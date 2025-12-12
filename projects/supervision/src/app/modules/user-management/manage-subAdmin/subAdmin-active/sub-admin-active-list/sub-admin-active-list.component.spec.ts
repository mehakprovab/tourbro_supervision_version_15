import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAdminActiveListComponent } from './sub-admin-active-list.component';

describe('SubAdminActiveListComponent', () => {
  let component: SubAdminActiveListComponent;
  let fixture: ComponentFixture<SubAdminActiveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAdminActiveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAdminActiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
