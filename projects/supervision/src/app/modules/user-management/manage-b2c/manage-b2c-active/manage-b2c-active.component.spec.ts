import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageB2cActiveComponent } from './manage-b2c-active.component';

describe('ManageB2cActiveComponent', () => {
  let component: ManageB2cActiveComponent;
  let fixture: ComponentFixture<ManageB2cActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageB2cActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageB2cActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
