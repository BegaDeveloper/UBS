import { TestBed } from '@angular/core/testing';

import { BanksResolver } from './banks.resolver';

describe('BanksResolver', () => {
  let resolver: BanksResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BanksResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
