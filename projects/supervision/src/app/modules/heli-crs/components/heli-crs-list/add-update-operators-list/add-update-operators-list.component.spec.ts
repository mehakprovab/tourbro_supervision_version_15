import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateOperatorsListComponent } from './add-update-operators-list.component';

describe('AddUpdateOperatorsListComponent', () => {
  let component: AddUpdateOperatorsListComponent;
  let fixture: ComponentFixture<AddUpdateOperatorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateOperatorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateOperatorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
