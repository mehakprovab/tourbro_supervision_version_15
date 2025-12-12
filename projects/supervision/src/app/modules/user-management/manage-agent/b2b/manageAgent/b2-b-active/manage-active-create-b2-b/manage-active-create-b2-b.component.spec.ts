import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageActiveCreateB2BComponent } from './manage-active-create-b2-b.component';

describe('ManageActiveCreateB2BComponent', () => {
  let component: ManageActiveCreateB2BComponent;
  let fixture: ComponentFixture<ManageActiveCreateB2BComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageActiveCreateB2BComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageActiveCreateB2BComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
