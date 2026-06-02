import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTherapyListComponent } from './add-update-therapy-list.component';

describe('AddUpdateTherapyListComponent', () => {
  let component: AddUpdateTherapyListComponent;
  let fixture: ComponentFixture<AddUpdateTherapyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateTherapyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateTherapyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
