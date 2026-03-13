import { TestBed } from '@angular/core/testing';
import { SagarpaService } from './sagarpa.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Solicitud220502State, Solicitud220502Store } from '../../../220502/estados/tramites220502.store';

describe('SagarpaService', () => {
  let service: SagarpaService;
  let httpMock: HttpTestingController;
  let storeSpy: jest.Mocked<Solicitud220502Store>;

  beforeEach(() => {
    const storeMock: Partial<Solicitud220502Store> = {
      setNombre: jest.fn(),
      setPrimerapellido: jest.fn(),
      setSegundoapellido: jest.fn(),
      setMercancia: jest.fn(),
      setTipocontenedor: jest.fn(),
      setCertificadosAutorizados: jest.fn(),
      setHoraDeInspeccion: jest.fn(),
      setAduanaDeIngreso: jest.fn(),
      setFechaInspeccion: jest.fn(),
      setSanidadAgropecuaria: jest.fn(),
      setPuntoDeInspeccion: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SagarpaService,
        { provide: Solicitud220502Store, useValue: storeMock }
      ]
    });

    service = TestBed.inject(SagarpaService);
    httpMock = TestBed.inject(HttpTestingController);
    storeSpy = TestBed.inject(Solicitud220502Store) as jest.Mocked<Solicitud220502Store>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch medio de transporte', () => {
    const mockData = { catalogo: [{ clave: '1', valor: 'Aéreo' }] };

    service.getMediodetransporte().subscribe((res) => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/220501/medio-transporte.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch registro toma muestras mercancias data', () => {
    const mockData = { solicitud220501State: {}, solicitud220502State: {} };

    service.getRegistroTomaMuestrasMercanciasData().subscribe((res) => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/220501/registro_toma_muestras_mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should update store using actualizarEstadoFormulario', () => {
    const state: Solicitud220502State = {
      nombre: 'Juan',
      primerapellido: 'Pérez',
      segundoapellido: 'Gómez',
      mercancia: 'Mangos',
      tipocontenedor: 1,
      certificadosAutorizados: 1,
      horaDeInspeccion: 1,
      aduanaDeIngreso: 1,
      fechaInspeccion: '2025-01-01',
      sanidadAgropecuaria: 1,
      puntoDeInspeccion: 1
    } as unknown as Solicitud220502State;

    service.actualizarEstadoFormulario(state);

    expect(storeSpy.setNombre).toHaveBeenCalledWith(state.nombre);
    expect(storeSpy.setPrimerapellido).toHaveBeenCalledWith(state.primerapellido);
    expect(storeSpy.setSegundoapellido).toHaveBeenCalledWith(state.segundoapellido);
    expect(storeSpy.setMercancia).toHaveBeenCalledWith(state.mercancia);
    expect(storeSpy.setTipocontenedor).toHaveBeenCalledWith(state.tipocontenedor);
    expect(storeSpy.setCertificadosAutorizados).toHaveBeenCalledWith(state.certificadosAutorizados);
    expect(storeSpy.setHoraDeInspeccion).toHaveBeenCalledWith(state.horaDeInspeccion);
    expect(storeSpy.setAduanaDeIngreso).toHaveBeenCalledWith(state.aduanaDeIngreso);
    expect(storeSpy.setFechaInspeccion).toHaveBeenCalledWith(state.fechaInspeccion);
    expect(storeSpy.setSanidadAgropecuaria).toHaveBeenCalledWith(state.sanidadAgropecuaria);
    expect(storeSpy.setPuntoDeInspeccion).toHaveBeenCalledWith(state.puntoDeInspeccion);
  });
});
