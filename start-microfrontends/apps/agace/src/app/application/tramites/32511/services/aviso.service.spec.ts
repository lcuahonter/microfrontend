import { TestBed } from '@angular/core/testing';

import { AvisoService } from './aviso.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('AvisoService', () => {
  let service: AvisoService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AvisoService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with HttpClient', () => {
    expect((service as any).http).toBe(http);
  });

  it('obtenerDocumentosSeleccionados should call http.get with correct URL', () => {
    const spy = jest.spyOn(http, 'get').mockReturnValue({} as any);
    service.obtenerDocumentosSeleccionados();
    expect(spy).toHaveBeenCalledWith('assets/json/32511/documentos-seleccionados.json');
  });

  it('getEntidadFederativaCatalogo should call http.get with correct URL', () => {
    const spy = jest.spyOn(http, 'get').mockReturnValue({} as any);
    service.getEntidadFederativaCatalogo();
    expect(spy).toHaveBeenCalledWith('assets/json/32511/entidad-federativa.json');
  });

  it('getAlcaldiaMunicipioCatalogo should call http.get with correct URL', () => {
    const spy = jest.spyOn(http, 'get').mockReturnValue({} as any);
    service.getAlcaldiaMunicipioCatalogo();
    expect(spy).toHaveBeenCalledWith('assets/json/32511/alcaldia-municipio.json');
  });

  it('getColoniaCatalogo should call http.get with correct URL', () => {
    const spy = jest.spyOn(http, 'get').mockReturnValue({} as any);
    service.getColoniaCatalogo();
    expect(spy).toHaveBeenCalledWith('assets/json/32511/colonia.json');
  });

  it('getAvisosDatos should call http.get with correct URL', () => {
    const spy = jest.spyOn(http, 'get').mockReturnValue({} as any);
    service.getAvisosDatos();
    expect(spy).toHaveBeenCalledWith('assets/json/10303/avisos-datos.json');
  });
});