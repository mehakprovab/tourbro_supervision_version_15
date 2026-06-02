import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateHelipadsListComponent } from './add-update-helipads-list.component';

describe('AddUpdateHelipadsListComponent', () => {
  let component: AddUpdateHelipadsListComponent;
  let fixture: ComponentFixture<AddUpdateHelipadsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateHelipadsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateHelipadsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
