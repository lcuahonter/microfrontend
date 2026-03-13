import { TestBed } from '@angular/core/testing';
import { ConsultaDatosService } from './consulta-datos.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TramiteStore } from '../estados/tramite290101.store';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { TramiteState } from '../estados/tramite290101.store';

describe('ConsultaDatosService', () => {
  let service: ConsultaDatosService;
  let httpMock: HttpTestingController;
  let tramiteStore: {
    setSolicitudTramite: jest.Mock;
    setRegionTramite: jest.Mock;
    setBeneficiosTramite: jest.Mock;
    setBodegasTramite: jest.Mock;
    setCafExportTramite: jest.Mock;
    setRegionesTabla: jest.Mock;
    setBeneficiosTabla: jest.Mock;
    setBodegasTabla: jest.Mock;
  };
  let seccionStore: SeccionLibStore;

  beforeEach(() => {
    tramiteStore = {
      setSolicitudTramite: jest.fn(),
      setRegionTramite: jest.fn(),
      setBeneficiosTramite: jest.fn(),
      setBodegasTramite: jest.fn(),
      setCafExportTramite: jest.fn(),
      setRegionesTabla: jest.fn(),
      setBeneficiosTabla: jest.fn(),
      setBodegasTabla: jest.fn(),
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

  it('should update solicitud in store', () => {
    const solicitud = { foo: 'bar' } as any;
    service.updateSolicitud(solicitud);
    expect(tramiteStore.setSolicitudTramite).toHaveBeenCalledWith(solicitud);
  });

  it('should update region in store', () => {
    const region = { bar: 'baz' } as any;
    service.updateRegion(region);
    expect(tramiteStore.setRegionTramite).toHaveBeenCalledWith(region);
  });

  it('should update beneficios in store', () => {
    const beneficios = { baz: 'qux' } as any;
    service.updateBeneficios(beneficios);
    expect(tramiteStore.setBeneficiosTramite).toHaveBeenCalledWith(beneficios);
  });

  it('should update bodegas in store', () => {
    const bodegas = { qux: 'quux' } as any;
    service.updateBodegas(bodegas);
    expect(tramiteStore.setBodegasTramite).toHaveBeenCalledWith(bodegas);
  });

  it('should update cafe export in store', () => {
    const cafeExport = { corge: 'grault' } as any;
    service.updateCafeExport(cafeExport);
    expect(tramiteStore.setCafExportTramite).toHaveBeenCalledWith(cafeExport);
  });

  it('should update full formulario state in store', () => {
    const datos: TramiteState = {
      SolicitudState: { a: 1 } as any,
      RegionFormatState: { b: 2 } as any,
      BeneficiosFormaState: { c: 3 } as any,
      BodegasFormaState: { d: 4 } as any,
      CafeExportFormState: { e: 5 } as any,
      regionesTabla: [{ x: 1 }] as any,
      beneficiosTabla: [{ y: 2 }] as any,
      bodegasTabla: [{ z: 3 }] as any
    } as any;
    service.actualizarEstadoFormulario(datos);
    expect(tramiteStore.setSolicitudTramite).toHaveBeenCalledWith(datos.SolicitudState);
    expect(tramiteStore.setRegionTramite).toHaveBeenCalledWith(datos.RegionFormatState);
    expect(tramiteStore.setBeneficiosTramite).toHaveBeenCalledWith(datos.BeneficiosFormaState);
    expect(tramiteStore.setBodegasTramite).toHaveBeenCalledWith(datos.BodegasFormaState);
    expect(tramiteStore.setCafExportTramite).toHaveBeenCalledWith(datos.CafeExportFormState);
    expect(tramiteStore.setRegionesTabla).toHaveBeenCalledWith(datos.regionesTabla);
    expect(tramiteStore.setBeneficiosTabla).toHaveBeenCalledWith(datos.beneficiosTabla);
    expect(tramiteStore.setBodegasTabla).toHaveBeenCalledWith(datos.bodegasTabla);
  });

  it('should get datos de la solicitud from JSON', () => {
    const mockData = {
      SolicitudState: { a: 1 },
      RegionFormatState: { b: 2 },
      BeneficiosFormaState: { c: 3 },
      BodegasFormaState: { d: 4 },
      CafeExportFormState: { e: 5 },
      regionesTabla: [{ x: 1 }],
      beneficiosTabla: [{ y: 2 }],
      bodegasTabla: [{ z: 3 }]
    } as unknown as TramiteState;
    let result: TramiteState | undefined;
    service.getDatosDeLaSolicitudData().subscribe(data => (result = data));

    const req = httpMock.expectOne('assets/json/290101/consulta-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(result).toEqual(mockData);
  });
});