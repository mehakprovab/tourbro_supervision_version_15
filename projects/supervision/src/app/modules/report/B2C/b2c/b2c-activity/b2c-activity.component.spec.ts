import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cActivityComponent } from './b2c-activity.component';

describe('B2cActivityComponent', () => {
  let component: B2cActivityComponent;
  let fixture: ComponentFixture<B2cActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
