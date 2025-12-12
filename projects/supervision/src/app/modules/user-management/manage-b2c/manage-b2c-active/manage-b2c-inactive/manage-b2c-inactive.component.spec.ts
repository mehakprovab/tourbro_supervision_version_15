import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageB2cInactiveComponent } from './manage-b2c-inactive.component';

describe('ManageB2cInactiveComponent', () => {
  let component: ManageB2cInactiveComponent;
  let fixture: ComponentFixture<ManageB2cInactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageB2cInactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageB2cInactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
