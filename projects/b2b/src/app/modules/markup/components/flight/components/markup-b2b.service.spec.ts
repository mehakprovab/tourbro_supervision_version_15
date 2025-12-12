import { TestBed } from '@angular/core/testing';

import { MarkupB2bService } from './markup-b2b.service';

describe('MarkupB2bService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarkupB2bService = TestBed.get(MarkupB2bService);
    expect(service).toBeTruthy();
  });
});
