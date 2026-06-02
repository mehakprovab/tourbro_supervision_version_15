import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeliTermsandconditionsComponent } from './heli-termsandconditions.component';

describe('HeliTermsandconditionsComponent', () => {
  let component: HeliTermsandconditionsComponent;
  let fixture: ComponentFixture<HeliTermsandconditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeliTermsandconditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeliTermsandconditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
