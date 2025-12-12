import { TestBed } from '@angular/core/testing';

import { ManagePaymentGatwayService } from './manage-payment-gatway.service';

describe('ManagePaymentGatwayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagePaymentGatwayService = TestBed.get(ManagePaymentGatwayService);
    expect(service).toBeTruthy();
  });
});
