import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RenunciaDeDerechosAlServicio } from './renuncia-de-derechos-al.service';
import { PermisoFormInterface } from '../model/renuncia-de-derechos.model';

describe('RenunciaDeDerechosAlServicio', () => {
  let service: RenunciaDeDerechosAlServicio;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RenunciaDeDerechosAlServicio]
    });

    service = TestBed.inject(RenunciaDeDerechosAlServicio);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería buscar la descripción del cupo del archivo JSON', () => {
    const mockResponse: PermisoFormInterface = {
      folioTramite: '12345',
      tipoDeSolicitud: 'Importación',
      regimen: 'Regular',
      clasificacionDelRegimen: 'Especial',
      periodoDeVigencia: '2025-12-31',
      unidadDeMedida: 'Kilogramos',
      fraccionArancelaria: 'ABC123',
      cantidadAutorizada: '100',
      valorAutorizado: '5000',
      nico: 'NICO-01',
      descripcionNico: 'Descripción NICO',
      acotacion: 'Acotación de prueba',
      permisoValidoDesde: '2025-01-01',
      permisoValidoHasta: '2025-12-31',
      motivoRenunciaDeDerechos: '', 
      controlar: true 
    };
    

    service.getDescripcionDelCupo().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/140111/renuncia-de-derechos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
