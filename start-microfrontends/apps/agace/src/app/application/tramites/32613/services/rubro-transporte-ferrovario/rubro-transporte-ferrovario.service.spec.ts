import { TestBed } from '@angular/core/testing';
import { RubroTransporteFerrovarioService } from './rubro-transporte-ferrovario.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RubroTransporteFerrovarioService', () => {
  let service: RubroTransporteFerrovarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RubroTransporteFerrovarioService);
  });

  it('debería crear', () => {
    expect(service).toBeTruthy();
  });
});
