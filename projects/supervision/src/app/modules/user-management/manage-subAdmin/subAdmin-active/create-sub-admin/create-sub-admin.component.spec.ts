import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubAdminComponent } from './create-sub-admin.component';

describe('CreateSubAdminComponent', () => {
  let component: CreateSubAdminComponent;
  let fixture: ComponentFixture<CreateSubAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
