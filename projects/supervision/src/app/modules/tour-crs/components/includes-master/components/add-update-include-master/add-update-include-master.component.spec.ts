import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateIncludeMasterComponent } from './add-update-include-master.component';

describe('AddUpdateIncludeMasterComponent', () => {
  let component: AddUpdateIncludeMasterComponent;
  let fixture: ComponentFixture<AddUpdateIncludeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateIncludeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateIncludeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
