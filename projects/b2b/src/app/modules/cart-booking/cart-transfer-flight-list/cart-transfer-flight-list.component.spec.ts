import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartTransferFlightListComponent } from './cart-transfer-flight-list.component';

describe('CartTransferFlightListComponent', () => {
  let component: CartTransferFlightListComponent;
  let fixture: ComponentFixture<CartTransferFlightListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartTransferFlightListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartTransferFlightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
