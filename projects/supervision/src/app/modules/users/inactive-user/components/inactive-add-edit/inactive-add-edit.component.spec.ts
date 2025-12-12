import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveAddEditComponent } from './inactive-add-edit.component';

describe('InactiveAddEditComponent', () => {
  let component: InactiveAddEditComponent;
  let fixture: ComponentFixture<InactiveAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactiveAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
