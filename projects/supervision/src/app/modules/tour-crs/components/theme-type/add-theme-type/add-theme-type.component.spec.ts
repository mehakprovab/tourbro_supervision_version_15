import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThemeTypeComponent } from './add-theme-type.component';

describe('AddThemeTypeComponent', () => {
  let component: AddThemeTypeComponent;
  let fixture: ComponentFixture<AddThemeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddThemeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddThemeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
