import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartTransferPrefferedAirlineComponent } from './cart-transfer-preffered-airline.component';

describe('CartTransferPrefferedAirlineComponent', () => {
  let component: CartTransferPrefferedAirlineComponent;
  let fixture: ComponentFixture<CartTransferPrefferedAirlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartTransferPrefferedAirlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartTransferPrefferedAirlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
