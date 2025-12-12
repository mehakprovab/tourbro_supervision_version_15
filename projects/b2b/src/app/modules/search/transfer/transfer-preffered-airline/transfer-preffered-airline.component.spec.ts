import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPrefferedAirlineComponent } from './transfer-preffered-airline.component';

describe('TransferPrefferedAirlineComponent', () => {
  let component: TransferPrefferedAirlineComponent;
  let fixture: ComponentFixture<TransferPrefferedAirlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferPrefferedAirlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferPrefferedAirlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
