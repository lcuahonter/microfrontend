import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CamCertificadoService } from './cam-certificado.service';
import { CamState, camCertificadoStore } from '../estados/cam-certificado.store';
import { camCertificadoQuery } from '../estados/cam-certificado.query';
import { JSONResponse, ENVIRONMENT } from '@ng-mf/data-access-user';
import { PROC_110211 } from '../servers/api-route';

describe('CamCertificadoService', () => {
  let service: CamCertificadoService;
  let httpMock: HttpTestingController;
  let mockStore: jest.Mocked<camCertificadoStore>;
  let mockQuery: jest.Mocked<camCertificadoQuery>;

  const mockCamState: CamState = {
    // Agregar propiedades simuladas basadas en la interfaz CamState
  } as CamState;

  const mockJSONResponse: JSONResponse = {
    // Agregar propiedades simuladas basadas en la interfaz JSONResponse
  } as JSONResponse;

  beforeEach(() => {
    const storeMock = {
      setEstadoCompleto: jest.fn(() => of()),
    } as any;

    const queryMock = {
      selectCam$: of(mockCamState)
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CamCertificadoService,
        { provide: camCertificadoStore, useValue: storeMock },
        { provide: camCertificadoQuery, useValue: queryMock }
      ]
    });

    service = TestBed.inject(CamCertificadoService);
    httpMock = TestBed.inject(HttpTestingController);
    mockStore = TestBed.inject(camCertificadoStore) as jest.Mocked<camCertificadoStore>;
    mockQuery = TestBed.inject(camCertificadoQuery) as jest.Mocked<camCertificadoQuery>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update form state in store', () => {
    service.actualizarEstadoFormulario(mockCamState);

    expect(mockStore.setEstadoCompleto).toHaveBeenCalledWith(mockCamState);
  });

  it('should fetch catalog by ID', () => {
    const catalogId = 123;
    const expectedUrl = `${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${catalogId}`;

    service.getCatalogoById(catalogId).subscribe(data => {
      expect(data).toEqual(mockJSONResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockJSONResponse);
  });

  it('should return observable from query', () => {
    service.getAllState().subscribe(data => {
      expect(data).toEqual(mockCamState);
    });
  });

  it('should perform POST request to search merchandise', () => {
    const searchBody = { criteria: 'test' };

    service.buscarMercanciasCert(searchBody).subscribe(data => {
      expect(data).toEqual(mockJSONResponse);
    });

    const req = httpMock.expectOne(PROC_110211.BUSCAR);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(searchBody);
    req.flush(mockJSONResponse);
  });

  it('should build merchandise array with correct structure', () => {
    const inputArray = [
      {
        fraccionArancelaria: '123456',
        cantidad: 10,
        valorMercancia: 100.50,
        umc: 'kg',
        tipoFactura: 'A',
        numeroFactura: 'F001',
        complementoDescripcion: 'Test description',
        fechaFactura: '2024-01-01'
      }
    ];

    const result = service.buildMercanciaSeleccionadas(inputArray);

    expect(result).toEqual([
      {
        fraccionArancelaria: '123456',
        cantidad: 10,
        unidadDeMedida: 'kg',
        valorMercancia: 100.50,
        tipoDeFactura: 'A',
        numeroFactura: 'F001',
        complementoDescripcion: 'Test description',
        fechaFactura: '2024-01-01'
      }
    ]);
  });

  it('should handle empty array', () => {
    const result = service.buildMercanciaSeleccionadas([]);
    expect(result).toEqual([]);
  });

  it('should handle array with multiple items', () => {
    const inputArray = [
      {
        fraccionArancelaria: '123456',
        cantidad: 10,
        valorMercancia: 100.50,
        umc: 'kg'
      },
      {
        fraccionArancelaria: '789012',
        cantidad: 5,
        valorMercancia: 50.25,
        umc: 'pcs'
      }
    ];

    const result = service.buildMercanciaSeleccionadas(inputArray);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(expect.objectContaining({
      fraccionArancelaria: '123456',
      cantidad: 10,
      unidadDeMedida: 'kg',
      valorMercancia: 100.50
    }));
    expect(result[1]).toEqual(expect.objectContaining({
      fraccionArancelaria: '789012',
      cantidad: 5,
      unidadDeMedida: 'pcs',
      valorMercancia: 50.25
    }));
  });

  it('should perform POST request to save data', () => {
    const saveBody = { data: 'test data' };

    service.guardarDatosPost(saveBody).subscribe(data => {
      expect(data).toEqual(mockJSONResponse);
    });

    const req = httpMock.expectOne(PROC_110211.GUARDAR);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(saveBody);
    req.flush(mockJSONResponse);
  });

  it('should fetch data to display by solicitud ID', () => {
    const idSolicitud = 12345;
    const expectedUrl = `${PROC_110211.MOSTRAR}?idSolicitud=${idSolicitud}`;

    service.getMostrarDatos(idSolicitud).subscribe(data => {
      expect(data).toEqual(mockJSONResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockJSONResponse);
  });

  it('should call all store methods when setting display data', () => {
    const mockDatos = {
      listaMercanciasSeleccionadas: [
        { fraccionArancelaria: '123456', cantidad: 10 }
      ]
    };

    // Add spy methods to mock store
    mockStore.setMercanciaTabla = jest.fn();
    mockStore.setFormCertificado = jest.fn();
    mockStore.setFormDatosCertificado = jest.fn();
    mockStore.setFormDatosDelDestinatario = jest.fn();
    mockStore.setFormDestinatario = jest.fn();
    mockStore.setGrupoRepresentativoNombreExportador = jest.fn();

    service.setMostrarDatos(mockDatos);

    expect(mockStore.setMercanciaTabla).toHaveBeenCalled();
    expect(mockStore.setFormCertificado).toHaveBeenCalled();
    expect(mockStore.setFormDatosCertificado).toHaveBeenCalled();
    expect(mockStore.setFormDatosDelDestinatario).toHaveBeenCalled();
    expect(mockStore.setFormDestinatario).toHaveBeenCalled();
    expect(mockStore.setGrupoRepresentativoNombreExportador).toHaveBeenCalled();
  });

  it('should update destinatario data correctly', () => {
    const mockData = {
      destinatario: {
        destinatarioDomicilio: {
          ciudad: 'Mexico City',
          calle: 'Main Street',
          numExterior: '123',
          lada: '55',
          telefono: '12345678',
          fax: '87654321'
        }
      }
    } as any;

    const result = service.actualizarDestinatario(mockData);

    expect(result).toEqual({
      paisDestin: '',
      ciudad: 'Mexico City',
      calle: 'Main Street',
      numeroLetra: '123',
      lada: '55',
      telefono: '12345678',
      fax: '87654321',
      correoElectronico: 'Main Street'
    });
  });

  it('should update grupo representativo data correctly', () => {
    const mockData = {
      certificadoOrigen: { lugarRegistro: 'Mexico' },
      representanteLegal: {
        nombre: 'John Doe',
        razonSocial: 'Company Inc',
        puesto: 'Manager',
        correoElectronico: 'john@company.com',
        representanteLegalDomicilio: {
          lada: '55',
          telefono: '12345678',
          fax: '87654321'
        }
      }
    } as any;

    const result = service.actualizarGrupoRepresentativo(mockData);

    expect(result).toEqual({
      lugar: 'Mexico',
      nombreExportador: 'John Doe',
      empresa: 'Company Inc',
      cargo: 'Manager',
      lada: '55',
      telefono: '12345678',
      fax: '87654321',
      correoElectronico: 'john@company.com'
    });
  });

  it('should update mercancia selection data correctly', () => {
    const mockData = [
      {
        fraccionArancelaria: '123456',
        cantidad: 10,
        complementoDescripcion: 'Test product',
        fechaFactura: '2024-01-01',
        numeroFactura: 'F001',
        tipoDeFactura: 'A',
        unidadDeMedida: 'kg',
        valorMercancia: 100.50
      }
    ];

    const result = service.actualizarSeleccionMercaniaDatos(mockData);

    expect(result).toEqual([
      {
        id: 0,
        fraccionArancelaria: '123456',
        cantidad: 10,
        complementoDescripcion: 'Test product',
        fechaFinalInput: '2024-01-01',
        numeroFactura: 'F001',
        tipoFactura: 'A',
        umc: 'kg',
        valorMercancia: 100.50
      }
    ]);
  });

  it('should handle null/undefined data in actualizarSeleccionMercaniaDatos', () => {
    const result1 = service.actualizarSeleccionMercaniaDatos(null as any);
    const result2 = service.actualizarSeleccionMercaniaDatos(undefined as any);

    expect(result1).toEqual([]);
    expect(result2).toEqual([]);
  });

  it('should update destinatario del destinatario data correctly', () => {
    const mockData = {
      destinatario: {
        nombre: 'Jane',
        apellidoMaterno: 'Smith',
        apellidoPaterno: 'Doe',
        rfcExtranjero: 'RFC123',
        razonSocial: 'Business LLC'
      }
    } as any;

    const result = service.actualizarDatosDelDestinatario(mockData);

    expect(result).toEqual({
      nombres: 'Jane',
      primerApellido: 'Smith',
      segundoApellido: 'Doe',
      numeroDeRegistroFiscal: 'RFC123',
      razonSocial: 'Business LLC'
    });
  });

  it('should update form certificado data correctly', () => {
    const mockData = {
      blnTercerOperador: true,
      clavePaisSeleccionado: 'MX',
      tratadoAcuerdo: { idTratadoAcuerdoSeleccionado: '001' },
      datosMercancia: {
        claveFraccionArancelaria: '123456',
        numeroRegistroProductos: 'REG001',
        nombreComercial: 'Product Name',
        fechInicio: '2024-01-01',
        fechFin: '2024-12-31'
      },
      tercerOperador: {
        nombre: 'John',
        apellidoPaterno: 'Doe',
        apellidoMaterno: 'Smith',
        rfcExtranjero: 'RFC456',
        razonSocial: 'Operator Inc',
        cvePaisOrigen: 'US',
        correoElectronico: 'john@operator.com',
        tercerOperadorDomicilio: {
          calle: 'Street 123',
          numExterior: '456',
          ciudad: 'City',
          lada: '55',
          telefono: '87654321',
          fax: '12345678'
        }
      }
    } as any;

    const result = service.actualizarformCertificado(mockData);

    expect(result).toEqual({
      si: true,
      entidadFederativa: '001',
      bloque: 'MX',
      fraccionArancelariaForm: '123456',
      registroProductoForm: 'REG001',
      nombreComercialForm: 'Product Name',
      fechaInicioInput: '2024-01-01',
      fechaFinalInput: '2024-12-31',
      nombres: 'John',
      primerApellido: 'Doe',
      segundoApellido: 'Smith',
      numeroDeRegistroFiscal: 'RFC456',
      razonSocial: 'Operator Inc',
      pais: 'US',
      calle: 'Street 123',
      numeroLetra: '456',
      ciudad: 'City',
      lada: '55',
      telefono: '87654321',
      fax: '12345678',
      correo: 'john@operator.com'
    });
  });

  it('should update datos certificado data correctly', () => {
    const mockData = {
      certificadoOrigen: {
        observaciones: 'Test observations',
        lenguaje: { clave: 'ES' }
      },
      entidadFederativa: [{ cveEntidad: 'DF' }],
      unidadAdministrativaRepresentacionFederal: { cveEntidad: 'FEDERAL01' }
    } as any;

    const result = service.actualizarDatosCertificado(mockData);

    expect(result).toEqual({
      observacionesDates: 'Test observations',
      idiomaDates: 'ES',
      precisaDates: '',
      EntidadFederativaDates: 'DF',
      representacionFederalDates: 'FEDERAL01',
      presenta: ''
    });
  });

});