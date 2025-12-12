import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferFlightListComponent } from './transfer-flight-list.component';

describe('TransferFlightListComponent', () => {
  let component: TransferFlightListComponent;
  let fixture: ComponentFixture<TransferFlightListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferFlightListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferFlightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
