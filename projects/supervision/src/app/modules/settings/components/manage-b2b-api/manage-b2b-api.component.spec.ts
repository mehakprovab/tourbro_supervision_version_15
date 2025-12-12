import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageB2bApiComponent } from './manage-b2b-api.component';

describe('ManageB2bApiComponent', () => {
  let component: ManageB2bApiComponent;
  let fixture: ComponentFixture<ManageB2bApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageB2bApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageB2bApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
