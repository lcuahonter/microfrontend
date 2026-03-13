import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PermisoSanitarioMedicosUsoPersonalService } from './permiso-sanitario-medicos-uso-personal.service';
import { Tramite260213State } from '../estados/tramite260213Store.store';

describe('PermisoSanitarioMedicosUsoPersonalService', () => {
  let service: PermisoSanitarioMedicosUsoPersonalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PermisoSanitarioMedicosUsoPersonalService],
    });

    service = TestBed.inject(PermisoSanitarioMedicosUsoPersonalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch registro de toma muestras de mercancías data', () => {
    const mockResponse: Tramite260213State = {
      destinatarioFinalTablaDatos: [],
      facturadorTablaDatos: [],
      proveedorTablaDatos: [],
      fabricanteTablaDatos: [],
      datosSolicitudFormState: {} as any,
      mercanciaForm: {} as any,
      opcionConfigDatos: [],
      scianConfigDatos: [],
      tablaMercanciasConfigDatos: [],
      seleccionadoopcionDatos: [],
      seleccionadoScianDatos: [],
      seleccionadoTablaMercanciasDatos: [],
      opcionesColapsableState: false,
      pagoDerechos: {} as any,
      tabSeleccionado: 1,
    };

    service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/260213/respuestaDeActualizacionDe.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});