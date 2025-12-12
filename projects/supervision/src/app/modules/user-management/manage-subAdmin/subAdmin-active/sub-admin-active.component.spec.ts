import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAdminActiveComponent } from './sub-admin-active.component';

describe('SubAdminActiveComponent', () => {
  let component: SubAdminActiveComponent;
  let fixture: ComponentFixture<SubAdminActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAdminActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAdminActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
