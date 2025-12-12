import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateThemeTypeComponent } from './update-theme-type.component';

describe('UpdateThemeTypeComponent', () => {
  let component: UpdateThemeTypeComponent;
  let fixture: ComponentFixture<UpdateThemeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateThemeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateThemeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
