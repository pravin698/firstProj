import { TestBed } from '@angular/core/testing';

import { StateServiceService } from './state-service.service';

describe('StateServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateServiceService = TestBed.get(StateServiceService);
    expect(service).toBeTruthy();
  });
});
