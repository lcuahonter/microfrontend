import { TestBed } from '@angular/core/testing';
import { ConsultaDatosService } from './consulta-datos.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TramiteStore } from '../estados/tramite32516Store.store';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { TramiteState } from '../estados/tramite32516Store.store';

describe('ConsultaDatosService', () => {
  let service: ConsultaDatosService;
  let httpMock: HttpTestingController;
  let tramiteStore: { setSolicitudTramite: jest.Mock; setMercanciaTramite: jest.Mock; update: jest.Mock };
  let seccionStore: SeccionLibStore;

  beforeEach(() => {
    tramiteStore = {
      setSolicitudTramite: jest.fn(),
      setMercanciaTramite: jest.fn(),
      update: jest.fn()
    };
    seccionStore = {} as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConsultaDatosService,
        { provide: TramiteStore, useValue: tramiteStore },
        { provide: SeccionLibStore, useValue: seccionStore }
      ]
    });

    service = TestBed.inject(ConsultaDatosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update full formulario state in store', () => {
    const datos: TramiteState = {
      descripcionGenerica1: 'Test 1',
      descripcionGenerica2: 'Test 2',
      descripcionGenerica3: 'Test 3',
      capacidadAlmacenamiento: true,
      cantidadBienes: false,
      tableDatos: []
    };
    service.actualizarEstadoFormulario(datos);
    expect(tramiteStore.update).toHaveBeenCalled();
  });

  it('should get datos de la solicitud from JSON', () => {
    const mockData: TramiteState = {
      descripcionGenerica1: 'Test 1',
      descripcionGenerica2: 'Test 2',
      descripcionGenerica3: 'Test 3',
      capacidadAlmacenamiento: true,
      cantidadBienes: false,
      tableDatos: []
    };
    let result: TramiteState | undefined;
    service.getDatosDeLaSolicitudData().subscribe(data => (result = data));

    const req = httpMock.expectOne('assets/json/32516/consulta-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(result).toEqual(mockData);
  });
});