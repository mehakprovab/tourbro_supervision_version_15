import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAllApiComponent } from './manage-all-api.component';

describe('ManageAllApiComponent', () => {
  let component: ManageAllApiComponent;
  let fixture: ComponentFixture<ManageAllApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAllApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAllApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
