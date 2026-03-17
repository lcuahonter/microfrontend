import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite130102Store } from '../../../estados/tramites/tramite130102.store';
import { FormGroup, FormControl } from '@angular/forms';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Solicitud130102State } from '../../../estados/tramites/tramite130102.store';
import { FormularioRegistroService } from './octava-temporal.service';

describe('FormularioRegistroService (Jest)', () => {
  let service: FormularioRegistroService;
  let httpMock: HttpTestingController;

  const mockStore = {
    setCriterioDictamen: jest.fn(),
    setFraccion: jest.fn(),
    setDescripcion: jest.fn(),
    setFraccionArancelaria: jest.fn(),
    setUnidadMedida: jest.fn(),
    setcantidad: jest.fn(),
    setValorFacturaUSD: jest.fn(),
    setCantidad_partidas: jest.fn(),
    setFraccionArancelariaTIGIE: jest.fn(),
    setFraccionArancelariaTIGIE_TIGIE: jest.fn(),
    setdescripcion_partidas: jest.fn(),
    setvalorPartidaUSD: jest.fn(),
    setFraccionArancelariaProsec: jest.fn(),
    setsolicitudMercancia: jest.fn(),
    setEntidad: jest.fn(),
    setRepresentacion: jest.fn(),
    setBloque: jest.fn(),
    setDescripcionJustificacion: jest.fn(),
    setObservaciones: jest.fn(),
    setProducto: jest.fn(),
    setSolicitude: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormularioRegistroService,
        { provide: Tramite130102Store, useValue: mockStore }
      ]
    });

    service = TestBed.inject(FormularioRegistroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería registrar y validar formularios correctamente', () => {
    const form = new FormGroup({
      name: new FormControl('')
    });

    service.registrarFormulario('testForm', form);
    expect(service['formularios'].get('testForm')).toBe(form);

    form.get('name')?.setErrors({ required: true });
    const isValid = service.validarTodosFormularios();
    expect(isValid).toBe(false);
  });

  it('debería obtener el JSON de entidades federativas', () => {
    service.getEntidadesFederativas().subscribe((data) => {
      expect(data.length).toBe(2);
    });

    const req = httpMock.expectOne('assets/json/130102/entidad_federativa.json');
    expect(req.request.method).toBe('GET');
    req.flush([
      { id: 1, descripcion: 'Entidad 1' },
      { id: 2, descripcion: 'Entidad 2' }
    ] as Catalogo[]);
  });

  it('debería obtener los datos de solicitud', () => {
    const mockData = { fraccion: 'ABCD' } as Solicitud130102State;

    service.getSolicitudData().subscribe(data => {
      expect(data.fraccion).toBe('ABCD');
    });

    const req = httpMock.expectOne('assets/json/130102/solicitude_data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería llamar a los setters del store en actualizarEstadoFormulario', () => {
    const mockState: Solicitud130102State = {
      criterioDictamen: 'a',
      fraccion: 'b',
      descripcion: 'c',
      fraccionArancelaria: 'd',
      unidadMedida: 'e',
      cantidad: 1,
      valorFacturaUSD: '100',
      cantidadPartidas: 5,
      fraccionArancelariaTIGIE: 'f',
      fraccionArancelariaTIGIE_TIGIE: 'g',
      descripcionPartidas: 'h',
      valorPartidaUSD: 250,
      fraccionArancelariaProsec: 'i',
      solicitudMercancia: 'j',
      entidad: 'k',
      representacion: 'l',
      bloque: 'm',
      descripcionJustificacion: 'n',
      observaciones: 'o',
      productos: 'y',
      solicitud: 'p',
      cantidadTotal: 10,
      valorTotalUSD: '500'
    };

    service.actualizarEstadoFormulario(mockState);

    expect(mockStore.setFraccion).toHaveBeenCalledWith('b');
    expect(mockStore.setdescripcion_partidas).toHaveBeenCalledWith('h');
    expect(mockStore.setSolicitude).toHaveBeenCalledWith('p');
  });
});
