import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundableComponent } from './refundable.component';

describe('RefundableComponent', () => {
  let component: RefundableComponent;
  let fixture: ComponentFixture<RefundableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
