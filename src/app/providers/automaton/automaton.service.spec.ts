import { TestBed } from '@angular/core/testing';

import { AutomatonService } from './automaton.service';

describe('AutomatonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutomatonService = TestBed.get(AutomatonService);
    expect(service).toBeTruthy();
  });
});
