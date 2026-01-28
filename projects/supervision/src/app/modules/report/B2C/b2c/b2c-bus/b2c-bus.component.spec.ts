import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cBusComponent } from './b2c-bus.component';

describe('B2cBusComponent', () => {
  let component: B2cBusComponent;
  let fixture: ComponentFixture<B2cBusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cBusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
