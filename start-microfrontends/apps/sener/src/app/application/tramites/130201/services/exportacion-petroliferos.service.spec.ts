import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExportacionPetroliferosService } from './exportacion-petroliferos.service';
import { Catalogo } from '@ng-mf/data-access-user';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';

describe('ExportacionPetroliferosService', () => {
  let service: ExportacionPetroliferosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportacionPetroliferosService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(ExportacionPetroliferosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener la lista de países desde "pais-procedencia.json"', () => {
    const MOCKPAISES: Catalogo[] = [
      { id: 1, descripcion: 'SGP' },
      { id: 2, descripcion: 'TLC JAPON' },
      { id: 3, descripcion: 'TLC PERU' },
      { id: 4, descripcion: 'CAM' },
      { id: 5, descripcion: 'T-MEC' },
      { id: 6, descripcion: 'ALADI' },
      { id: 7, descripcion: 'TLC MEX-CR' },
      { id: 8, descripcion: 'TLC MEX-NIC' },
      { id: 9, descripcion: 'OMC' },
      { id: 10, descripcion: 'UNILATERAL' },
      { id: 11, descripcion: 'TLC MEX-CHILE' },
      { id: 12, descripcion: 'TLC MEX-ISRAEL' }
    ];

    service.getListaDePaisesDisponibles().subscribe((paises) => {
      expect(paises).toEqual(MOCKPAISES);
    });

    const REQ = httpMock.expectOne('/assets/json/130201/pais-procenia.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCKPAISES);
  });

  it('debería obtener los países por bloque desde "paises-por-bloque.json"', () => {
    const MOCKPAISESBLOQUE: Catalogo[] = [
      { id: 1, descripcion: 'URUGUAY (REPUBLICA ORIENTAL DE)' },
      { id: 2, descripcion: 'ARGENTINA (REPUBLICA)' },
      { id: 3, descripcion: 'CUBA (REPUBLICA DE)' },
      { id: 4, descripcion: 'ECUADOR (REPUBLICA DEL)' },
      { id: 5, descripcion: 'PANAMA (REPUBLICA DE)' },
      { id: 6, descripcion: 'PARAGUAY (REPUBLICA DEL)' },
      { id: 7, descripcion: 'PERU (REPUBLICA DEL)' },
      { id: 8, descripcion: 'BRASIL (REPUBLICA TEDE RAMA DE)' }
    ];

    service.getPaisesPorBloque(1).subscribe((paises) => {
      expect(paises).toEqual(MOCKPAISESBLOQUE);
    });

    const REQ = httpMock.expectOne('/assets/json/130201/paises-por-bloque.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCKPAISESBLOQUE);
  });

  it('debería obtener la lista de estados desde "estado.json"', () => {
    const MOCKESTADOS: Catalogo[] = [
      { id: 1, descripcion: 'SINALOA' }
    ];

    service.getEstado().subscribe((estados) => {
      expect(estados).toEqual(MOCKESTADOS);
    });

    const REQ = httpMock.expectOne('/assets/json/130201/estado.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCKESTADOS);
  });

  it('debería obtener la lista de representaciones federales desde "representacion-federal.json"', () => {
    const MOCKREPRESENTACIONES: Catalogo[] = [
      { id: 1, descripcion: 'SECRETARIA DE ENERGIA (oficina central)' }
    ];

    service.getRepresentacionFederal().subscribe((representaciones) => {
      expect(representaciones).toEqual(MOCKREPRESENTACIONES);
    });

    const REQ = httpMock.expectOne('/assets/json/130201/representacion-federal.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCKREPRESENTACIONES);
  });

  it('debería obtener las opciones de solicitud desde "solicitude-options.json"', () => {
    const MOCKSOLICITUDEOPTIONS: ProductoResponse = {
      options: [
        { label: 'Inicial', value: 'Inicial' }
      ],
      defaultSelect: 'Inicial'
    };

    service.getSolicitudeOptions().subscribe((options) => {
      expect(options).toEqual(MOCKSOLICITUDEOPTIONS);
    });

    const REQ = httpMock.expectOne('assets/json/130201/solicitude-options.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCKSOLICITUDEOPTIONS);
  });

  it('debería obtener las opciones de producto desde "producto-otions.json"', () => {
    const MOCKPRODUCTOOPTIONS: ProductoResponse = {
      options: [
        { label: 'NuevoLargo plazo (5 años)', value: 'Largo plazo (5 años)' },
        { label: 'Corto plazo (60 días o 1 año)', value: 'Corto plazo (60 días o 1 año)' }
      ],
      defaultSelect: 'NuevoLargo plazo (5 años)'
    };

    service.getProductoOptions().subscribe((options) => {
      expect(options).toEqual(MOCKPRODUCTOOPTIONS);
    });

    const REQ = httpMock.expectOne('assets/json/130201/plazo-options.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCKPRODUCTOOPTIONS);
  });
});
