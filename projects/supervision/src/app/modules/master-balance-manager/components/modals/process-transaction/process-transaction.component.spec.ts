import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTransactionComponent } from './process-transaction.component';

describe('ProcessTransactionComponent', () => {
  let component: ProcessTransactionComponent;
  let fixture: ComponentFixture<ProcessTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
