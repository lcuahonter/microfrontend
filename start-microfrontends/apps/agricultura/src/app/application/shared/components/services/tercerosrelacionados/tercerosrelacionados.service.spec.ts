import { TestBed } from '@angular/core/testing';

import { TercerosrelacionadosService } from './tercerosrelacionados.service';

describe('TercerosrelacionadosService', () => {
  let service: TercerosrelacionadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TercerosrelacionadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
