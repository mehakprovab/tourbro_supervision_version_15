import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cTransferComponent } from './b2c-transfer.component';

describe('B2cTransferComponent', () => {
  let component: B2cTransferComponent;
  let fixture: ComponentFixture<B2cTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
