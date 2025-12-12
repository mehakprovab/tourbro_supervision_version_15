import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cTourComponent } from './b2c-tour.component';

describe('B2cTourComponent', () => {
  let component: B2cTourComponent;
  let fixture: ComponentFixture<B2cTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
