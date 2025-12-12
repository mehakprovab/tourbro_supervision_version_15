import { TestBed } from '@angular/core/testing';

import { DomainLogoService } from './domain-logo.service';

describe('DomainLogoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DomainLogoService = TestBed.get(DomainLogoService);
    expect(service).toBeTruthy();
  });
});
