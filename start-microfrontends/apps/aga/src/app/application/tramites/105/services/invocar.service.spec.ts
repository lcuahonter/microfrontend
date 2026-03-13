import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InvoCarService } from './invocar.service';
import { Tramite105Store } from '../../105/estados/tramite105.store';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Solicitud105State } from '../../105/estados/tramite105.store';

describe('InvoCarService', () => {
  let service: InvoCarService;
  let httpMock: HttpTestingController;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      setImportacion: jest.fn(),
      setExportacion: jest.fn(),
      setDepositoFiscalGas: jest.fn(),
      setDepositoFiscalVehiculos: jest.fn(),
      setDistribucionGas: jest.fn(),
      setServiciosTerceros: jest.fn(),
      setIndustriaAutomotriz: jest.fn(),
      setDomicilio: jest.fn(),
      setUbicacion: jest.fn(),
      setPais: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEntidadFederativa: jest.fn(),
      setMunicipioDelegacion: jest.fn(),
      setlocalidad: jest.fn(),
      setColonia: jest.fn(),
      setEntidadFederativaDos: jest.fn(),
      setCalle: jest.fn(),
      setNumeroExterior: jest.fn(),
      setNumeroInterior: jest.fn(),
      setUbicacionDescripcion: jest.fn(),
      setAduana: jest.fn(),
      setFraccionarancelaria: jest.fn(),
      setProcedimientoCargaDescarga: jest.fn(),
      setSistemasMedicionUbicacion: jest.fn(),
      setMotivoNoDespachoAduana: jest.fn(),
      setOperaciones: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite105Store, useValue: mockStore }
      ]
    });

    service = TestBed.inject(InvoCarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener el catálogo de países correctamente', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{ id: 1, descripcion: 'México' }],
      message: ''
    };
    service.getPais().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/105/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener el catálogo de entidades federativas correctamente', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{ id: 1, descripcion: 'CDMX' }],
      message: ''
    };
    service.getEntidadFederativa().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/105/entidadfederativa.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener el catálogo de colonias correctamente', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{ id: 1, descripcion: 'Centro' }],
      message: ''
    };
    service.getColonia().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/105/colonia.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener las fechas seleccionadas correctamente', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [{ id: 1, descripcion: '2024-01-01' }], message: '' };
    service.getFechasSeleccionadas().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/105/fechasSeleccionadas.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener las opciones de fracción arancelaria correctamente', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{ id: 1, descripcion: 'Fracción 1' }],
      message: ''
    };
    service.getFraccionArancelariaOptions().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/105/fracciónarancelaria-options.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener el catálogo de municipios o delegaciones correctamente', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{ id: 1, descripcion: 'Benito Juárez' }],
      message: ''
    };
    service.getMunicipioDelegacion().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/105/municipiodelegacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería obtener el catálogo de aduanas correctamente', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200, data: [{ id: 1, descripcion: 'Aduana 1' }],
      message: ''
    };
    service.getAduana().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/105/aduana.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería actualizar el estado del formulario correctamente', () => {
    const datos: Solicitud105State = {
       importacion: true,
      exportacion: true,
      depositoFiscalGas: true,
      depositoFiscalVehiculos: true,
      distribucionGas: 'distribucion',
      serviciosTerceros: 'servicios',
      industriaAutomotriz: 'industria',
      domicilio: true,
      ubicacion: true,
      pais: 'México',
      codigoPostal: '12345',
      entidadFederativa: 'CDMX',
      municipioDelegacion: 'Benito Juárez',
      localidad: 'localidad',
      colonia: 'colonia',
      entidadFederativaDos: 'CDMX',
      calle: 'calle',
      numeroExterior: '10',
      numeroInterior: '2',
      ubicacionDescripcion: 'desc',
      aduana: 'aduana',
      fraccionarancelaria: 'fraccion',
      procedimientoCargaDescarga: 'procedimiento',
      sistemasMedicionUbicacion: 'sistemas',
      motivoNoDespachoAduana: 'motivo',
      operaciones: 'operaciones'
    };
    service.actualizarEstadoFormulario(datos);
    expect(mockStore.setImportacion).toHaveBeenCalledWith(true);
    expect(mockStore.setExportacion).toHaveBeenCalledWith(true);
    expect(mockStore.setDepositoFiscalGas).toHaveBeenCalledWith(true);
    expect(mockStore.setDepositoFiscalVehiculos).toHaveBeenCalledWith(true);
    expect(mockStore.setDistribucionGas).toHaveBeenCalledWith('distribucion');
    expect(mockStore.setServiciosTerceros).toHaveBeenCalledWith('servicios');
    expect(mockStore.setIndustriaAutomotriz).toHaveBeenCalledWith('industria');
    expect(mockStore.setDomicilio).toHaveBeenCalledWith(true);
    expect(mockStore.setUbicacion).toHaveBeenCalledWith(true);
    expect(mockStore.setPais).toHaveBeenCalledWith('México');
    expect(mockStore.setCodigoPostal).toHaveBeenCalledWith('12345');
    expect(mockStore.setEntidadFederativa).toHaveBeenCalledWith('CDMX');
    expect(mockStore.setMunicipioDelegacion).toHaveBeenCalledWith('Benito Juárez');
    expect(mockStore.setlocalidad).toHaveBeenCalledWith('localidad');
    expect(mockStore.setColonia).toHaveBeenCalledWith('colonia');
    expect(mockStore.setEntidadFederativaDos).toHaveBeenCalledWith('CDMX');
    expect(mockStore.setCalle).toHaveBeenCalledWith('calle');
    expect(mockStore.setNumeroExterior).toHaveBeenCalledWith('10');
    expect(mockStore.setNumeroInterior).toHaveBeenCalledWith('2');
    expect(mockStore.setUbicacionDescripcion).toHaveBeenCalledWith('desc');
    expect(mockStore.setAduana).toHaveBeenCalledWith('aduana');
    expect(mockStore.setFraccionarancelaria).toHaveBeenCalledWith('fraccion');
    expect(mockStore.setProcedimientoCargaDescarga).toHaveBeenCalledWith('procedimiento');
    expect(mockStore.setSistemasMedicionUbicacion).toHaveBeenCalledWith('sistemas');
    expect(mockStore.setMotivoNoDespachoAduana).toHaveBeenCalledWith('motivo');
    expect(mockStore.setOperaciones).toHaveBeenCalledWith('operaciones');
  });

  it('debería obtener los datos del registro de toma de muestras de mercancías correctamente', () => {
    const mockResponse: Solicitud105State = {
      importacion: true,
      exportacion: true,
      depositoFiscalGas: true,
      depositoFiscalVehiculos: true,
      distribucionGas: 'distribucion',
      serviciosTerceros: 'servicios',
      industriaAutomotriz: 'industria',
      domicilio: true,
      ubicacion: true,
      pais: 'México',
      codigoPostal: '12345',
      entidadFederativa: 'CDMX',
      municipioDelegacion: 'Benito Juárez',
      localidad: 'localidad',
      colonia: 'colonia',
      entidadFederativaDos: 'CDMX',
      calle: 'calle',
      numeroExterior: '10',
      numeroInterior: '2',
      ubicacionDescripcion: 'desc',
      aduana: 'aduana',
      fraccionarancelaria: 'fraccion',
      procedimientoCargaDescarga: 'procedimiento',
      sistemasMedicionUbicacion: 'sistemas',
      motivoNoDespachoAduana: 'motivo',
      operaciones: 'operaciones'
    };
    service.getRegistroTomaMuestrasMercanciasData().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/105/registro_toma_muestras_mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});