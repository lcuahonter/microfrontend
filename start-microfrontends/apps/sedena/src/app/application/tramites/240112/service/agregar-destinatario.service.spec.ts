import { TestBed } from '@angular/core/testing';

import { AgregarDestinatarioService } from './agregar-destinatario.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgregarDestinatarioService', () => {
  let service: AgregarDestinatarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AgregarDestinatarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
