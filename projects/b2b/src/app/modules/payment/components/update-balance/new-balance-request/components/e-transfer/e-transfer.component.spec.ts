import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ETransferComponent } from './e-transfer.component';

describe('ETransferComponent', () => {
  let component: ETransferComponent;
  let fixture: ComponentFixture<ETransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ETransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ETransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
