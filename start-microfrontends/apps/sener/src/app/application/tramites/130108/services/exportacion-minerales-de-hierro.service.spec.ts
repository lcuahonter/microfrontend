import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExportacionMineralesDeHierroService } from './exportacion-minerales-de-hierro.service';
import { Catalogo } from '@ng-mf/data-access-user';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';

describe('ExportacionMineralesDeHierroService', () => {
  let service: ExportacionMineralesDeHierroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportacionMineralesDeHierroService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(ExportacionMineralesDeHierroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the list of countries from "pais-procedencia.json"', () => {
    const mockPaises: Catalogo[] = [
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
      expect(paises).toEqual(mockPaises);
    });

    const req = httpMock.expectOne('/assets/json/130108/pais-procenia.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockPaises);
  });

  it('should fetch countries by block from "paises-por-bloque.json"', () => {
    const mockPaisesBloque: Catalogo[] = [
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
      expect(paises).toEqual(mockPaisesBloque);
    });

    const req = httpMock.expectOne('/assets/json/130108/paises-por-bloque.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockPaisesBloque);
  });

  it('should fetch the list of states from "estado.json"', () => {
    const mockEstados: Catalogo[] = [
      { id: 1, descripcion: 'SINALOA' }
    ];

    service.getEstado().subscribe((estados) => {
      expect(estados).toEqual(mockEstados);
    });

    const req = httpMock.expectOne('/assets/json/130108/estado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockEstados);
  });

  it('should fetch the list of federal representations from "representacion-federal.json"', () => {
    const mockRepresentaciones: Catalogo[] = [
      { id: 1, descripcion: 'SECRETARIA DE ENERGIA (oficina central)' }
    ];

    service.getRepresentacionFederal().subscribe((representaciones) => {
      expect(representaciones).toEqual(mockRepresentaciones);
    });

    const req = httpMock.expectOne('/assets/json/130108/representacion-federal.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockRepresentaciones);
  });

  it('should fetch the solicitation options from "solicitude-options.json"', () => {
    const mockSolicitudeOptions: ProductoResponse = {
      options: [
        { label: 'Inicial', value: 'Inicial' }
      ],
      defaultSelect: 'Inicial'
    };

    service.getSolicitudeOptions().subscribe((options) => {
      expect(options).toEqual(mockSolicitudeOptions);
    });

    const req = httpMock.expectOne('assets/json/130108/solicitude-options.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockSolicitudeOptions);
  });

  it('should fetch the product options from "producto-otions.json"', () => {
    const mockProductoOptions: ProductoResponse = {
      options: [
        { label: 'NuevoLargo plazo (5 años)', value: 'Largo plazo (5 años)' },
        { label: 'Corto plazo (60 días o 1 año)', value: 'Corto plazo (60 días o 1 año)' }
      ],
      defaultSelect: 'NuevoLargo plazo (5 años)'
    };

    service.getProductoOptions().subscribe((options) => {
      expect(options).toEqual(mockProductoOptions);
    });

    const req = httpMock.expectOne('assets/json/130108/producto-otions.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductoOptions);
  });
});
