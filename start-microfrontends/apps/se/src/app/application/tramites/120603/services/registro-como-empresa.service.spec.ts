import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { RegistroComoEmpresaService } from './registro-como-empresa.service';

describe('RegistroComoEmpresaService', () => {
  let service: RegistroComoEmpresaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Agregue HttpClientModule aquí


    });
    
    service = TestBed.inject(RegistroComoEmpresaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
