import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferFaresummaryComponent } from './transfer-faresummary.component';

describe('TransferFaresummaryComponent', () => {
  let component: TransferFaresummaryComponent;
  let fixture: ComponentFixture<TransferFaresummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferFaresummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferFaresummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
