import { TestBed } from '@angular/core/testing';
import { SolicitudDeRegistroTplService } from './solicitud-de-registro-tpl.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Tramite120101Store } from '../../../estados/tramites/tramite120101.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { InsumosTabla } from '../models/insumos.model';

describe('SolicitudDeRegistroTplService', () => {
  let service: SolicitudDeRegistroTplService;
  let httpMock: HttpTestingController;
  let store: Tramite120101Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SolicitudDeRegistroTplService,
        { provide: Tramite120101Store, useClass: Tramite120101Store },
      ],
    });
    service = TestBed.inject(SolicitudDeRegistroTplService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Tramite120101Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch clasificacion regimen data', () => {
    const mockData: Catalogo[] = [{ id: 1, descripcion: 'Example' }];

    service.getClasificacionRegimenData().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'assets/json/120101/clasificacion-del-regimen.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should set and get tablaInsumosTemp', () => {
    const insumos: InsumosTabla[] = [
      {
        DescripcionDelInsumo: 'Desc',
        FraccionArancelaria: '123',
        PaisDeOrigen: 'México',
      },
    ];

    service.establecerTablaInsumos(insumos);
    const result = service.obtenerTablaInsumos();
    expect(result).toEqual(insumos);
  });

  it('should call setDynamicFieldValue from store', () => {
  jest.spyOn(store, 'setDynamicFieldValue');
  service.actualizarEstadoFormulario('pais', 'México');
  expect(store.setDynamicFieldValue).toHaveBeenCalledWith('pais', 'México');
});

it('should fetch pais data', () => {
  const mockData: Catalogo[] = [{ id: 2, descripcion: 'México' }];
  service.getPaisData().subscribe((data) => {
    expect(data).toEqual(mockData);
  });
  const req = httpMock.expectOne('assets/json/120101/pais.json');
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
});

it('should fetch estados data (Catalogo)', () => {
  const mockData: Catalogo = { id: 5, descripcion: 'CDMX' };
  service.getEstadosDatos().subscribe((data) => {
    expect(data).toEqual(mockData);
  });
  const req = httpMock.expectOne('assets/json/120101/estados.json');
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
});

it('should fetch representacion federal data', () => {
  const mockData: Catalogo = { id: 3, descripcion: 'Representación' };
  service.getRepresentacionFederalDatos().subscribe((data) => {
    expect(data).toEqual(mockData);
  });
  const req = httpMock.expectOne('assets/json/120101/representacion-federal.json');
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
});

it('should fetch insumos tabla data', () => {
  const mockData: InsumosTabla[] = [
    {
      DescripcionDelInsumo: 'Textil',
      FraccionArancelaria: '5201.00.00',
      PaisDeOrigen: 'Colombia',
    },
  ];
  service.obtenerDatosTablaInsumos().subscribe((data) => {
    expect(data).toEqual(mockData);
  });
  const req = httpMock.expectOne('assets/json/120101/insumos-tabla.json');
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
});

it('should fetch datos fraccion arancelaria', () => {
  const mockData: Catalogo[] = [{ id: 9, descripcion: 'Fracción X' }];
  service.obtenerDatosFraccionArancelaria().subscribe((data) => {
    expect(data).toEqual(mockData);
  });
  const req = httpMock.expectOne('assets/json/120101/pais.json');
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
});

it('should fetch datos estados (array)', () => {
  const mockData: Catalogo[] = [{ id: 10, descripcion: 'Estado Y' }];
  service.obtenerDatosEstados().subscribe((data) => {
    expect(data).toEqual(mockData);
  });
  const req = httpMock.expectOne('assets/json/120101/estados.json');
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
});

it('should fetch indicar data for radio options', () => {
  const mockData = [
    { label: 'Sí', value: '1' },
    { label: 'No', value: '0' },
  ];
  service.obtenerIndicarData().subscribe((data) => {
    expect(data).toEqual(mockData);
  });
  const req = httpMock.expectOne('assets/json/120101/proceso-productivo.json');
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
});

});
