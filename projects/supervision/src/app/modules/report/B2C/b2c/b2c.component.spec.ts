import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cComponent } from './b2c.component';

describe('B2cComponent', () => {
  let component: B2cComponent;
  let fixture: ComponentFixture<B2cComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
