import { TestBed } from '@angular/core/testing';

import { Shared2603MostrarService } from './shared2603-mostrar.service';

describe('Shared2603MostrarService', () => {
  let service: Shared2603MostrarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Shared2603MostrarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
