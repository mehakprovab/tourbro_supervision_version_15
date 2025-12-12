import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersConfirmComponent } from './transfers-confirm.component';

describe('TransfersConfirmComponent', () => {
  let component: TransfersConfirmComponent;
  let fixture: ComponentFixture<TransfersConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfersConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
