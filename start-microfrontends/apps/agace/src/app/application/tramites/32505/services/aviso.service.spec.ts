import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AvisoService } from './aviso.service';
import { CatalogoLista, AvisoTablaDatos, DatosSolicitante } from '../models/avios-model';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';
import { Tramite32505Store, Solicitud32505State } from '../../../estados/tramites/trimite32505.store';

describe('AvisoService', () => {
  let service: AvisoService;
  let httpMock: HttpTestingController;
  let mockTramiteStore: any;

  beforeEach(() => {
    const tramiteStoreMock = {
      setAdace: jest.fn(),
      setPais: jest.fn(),
      setAnio: jest.fn(),
      setTipoBusqueda: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AvisoService,
        { provide: Tramite32505Store, useValue: tramiteStoreMock }
      ],
    });
    service = TestBed.inject(AvisoService);
    httpMock = TestBed.inject(HttpTestingController);
    mockTramiteStore = TestBed.inject(Tramite32505Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('actualizarEstadoFormulario', () => {
    it('should call all store setter methods with correct data', () => {
      const mockDatos: Solicitud32505State = {
        adace: 'ADACE001',
        pais: 'México',
        anio: '2024',
        tipoBusqueda: 'Manual',
        tipoBusquedaAviso: '',
        folioTipo: '',
        confirmidad: '',
        numeroSerie: '',
        numeroNIV: '',
        anoModelo: '',
        marca: '',
        modelo: '',
        tipoVariante: '',
        cilindros: '',
        puertas: '',
        combustible: '',
        propiedad: '',
        nombreTitulo: '',
        paisEmitio: '',
        provinciaEmision: '',
        procedencia: '',
        vehiculoImportado: '',
        exportacion: '',
        aduanaImportacion: '',
        patenteImportacion: '',
        pedimentoImportacion: '',
        valorAduana: '',
        kilometraje: '',
        montoIGI: '',
        formaPagoIGI: '',
        montoDTA: '',
        montoIVA: '',
        valorDolares: '',
        folioCFDI: '',
        folioVenta: '',
        valorVenta: '',
        datosSolicitante: {
          rfc: '',
          denominacion: '',
          actividadEconomica: '',
          correoElectronico: '',
          pais: '',
          codigoPostal: '',
          entidadFederativa: '',
          municipio: '',
          localidad: '',
          colonia: '',
          calle: '',
          nExt: '',
          nInt: '',
          lada: '',
          telefono: '',
          adace: ''
        }
      };

      service.actualizarEstadoFormulario(mockDatos);

      expect(mockTramiteStore.setAdace).toHaveBeenCalledWith('ADACE001');
      expect(mockTramiteStore.setPais).toHaveBeenCalledWith('México');
      expect(mockTramiteStore.setAnio).toHaveBeenCalledWith('2024');
      expect(mockTramiteStore.setTipoBusqueda).toHaveBeenCalledWith('Manual');
      expect(mockTramiteStore.setAdace).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.setPais).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.setAnio).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.setTipoBusqueda).toHaveBeenCalledTimes(1);
    });

    it('should handle empty values in DATOS parameter', () => {
      const mockDatos: Solicitud32505State = {
        adace: '',
        pais: '',
        anio: '',
        tipoBusqueda: '',
        tipoBusquedaAviso: '',
        folioTipo: '',
        confirmidad: '',
        numeroSerie: '',
        numeroNIV: '',
        anoModelo: '',
        marca: '',
        modelo: '',
        tipoVariante: '',
        cilindros: '',
        puertas: '',
        combustible: '',
        propiedad: '',
        nombreTitulo: '',
        paisEmitio: '',
        provinciaEmision: '',
        procedencia: '',
        vehiculoImportado: '',
        exportacion: '',
        aduanaImportacion: '',
        patenteImportacion: '',
        pedimentoImportacion: '',
        valorAduana: '',
        kilometraje: '',
        montoIGI: '',
        formaPagoIGI: '',
        montoDTA: '',
        montoIVA: '',
        valorDolares: '',
        folioCFDI: '',
        folioVenta: '',
        valorVenta: '',
        datosSolicitante: {
          rfc: '',
          denominacion: '',
          actividadEconomica: '',
          correoElectronico: '',
          pais: '',
          codigoPostal: '',
          entidadFederativa: '',
          municipio: '',
          localidad: '',
          colonia: '',
          calle: '',
          nExt: '',
          nInt: '',
          lada: '',
          telefono: '',
          adace: ''
        }
      };

      service.actualizarEstadoFormulario(mockDatos);

      expect(mockTramiteStore.setAdace).toHaveBeenCalledWith('');
      expect(mockTramiteStore.setPais).toHaveBeenCalledWith('');
      expect(mockTramiteStore.setAnio).toHaveBeenCalledWith('');
      expect(mockTramiteStore.setTipoBusqueda).toHaveBeenCalledWith('');
    });

    it('should handle null/undefined values gracefully', () => {
      const mockDatos: any = {
        adace: null,
        pais: undefined,
        anio: null,
        tipoBusqueda: undefined
      };

      service.actualizarEstadoFormulario(mockDatos);

     
      expect(mockTramiteStore.setAdace).toHaveBeenCalledWith(null);
      expect(mockTramiteStore.setPais).toHaveBeenCalledWith(undefined);
      expect(mockTramiteStore.setAnio).toHaveBeenCalledWith(null);
      expect(mockTramiteStore.setTipoBusqueda).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getDatosConsulta', () => {
    it('should fetch consulta data from correct endpoint', () => {
      const mockResponse: Solicitud32505State = {
        adace: 'ADACE001',
        pais: 'México',
        anio: '2024',
        tipoBusqueda: 'Manual',
        tipoBusquedaAviso: 'Datos del vehiculo',
        folioTipo: 'FOLIO001',
        confirmidad: '',
        numeroSerie: 'SERIE123',
        numeroNIV: 'NIV123456789',
        anoModelo: '2023',
        marca: 'Toyota',
        modelo: 'Corolla',
        tipoVariante: 'Sedan',
        cilindros: '4',
        puertas: '4',
        combustible: 'Gasolina',
        propiedad: 'Particular',
        nombreTitulo: 'Juan Pérez',
        paisEmitio: 'USA',
        provinciaEmision: 'California',
        procedencia: 'Importación',
        vehiculoImportado: 'Si',
        exportacion: 'No',
        aduanaImportacion: 'Tijuana',
        patenteImportacion: 'PAT001',
        pedimentoImportacion: 'PED001',
        valorAduana: '25000',
        kilometraje: '50000',
        montoIGI: '5000',
        formaPagoIGI: 'Efectivo',
        montoDTA: '1000',
        montoIVA: '4000',
        valorDolares: '20000',
        folioCFDI: 'CFDI001',
        folioVenta: 'VENTA001',
        valorVenta: '30000',
        datosSolicitante: {
          rfc: 'CURP123456',
          denominacion: 'Juan Pérez García',
          actividadEconomica: 'Comercio',
          correoElectronico: 'juan.perez@email.com',
          pais: 'México',
          codigoPostal: '12345',
          entidadFederativa: 'Baja California',
          municipio: 'Tijuana',
          localidad: 'Centro',
          colonia: 'Zona Centro',
          calle: 'Calle Principal',
          nExt: '123',
          nInt: 'A',
          lada: '664',
          telefono: '1234567',
          adace: 'ADACE001'
        }
      };

     
      service.getDatosConsulta().subscribe((data) => {
       
        expect(data).toEqual(mockResponse);
        expect(data.adace).toBe('ADACE001');
        expect(data.pais).toBe('México');
        expect(data.anio).toBe('2024');
        expect(data.tipoBusqueda).toBe('Manual');
      });

      const req = httpMock.expectOne('assets/json/32505/consulta_32505.json');
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe('assets/json/32505/consulta_32505.json');
      req.flush(mockResponse);
    });

    it('should return Observable<Solicitud32505State>', () => {
      const mockResponse: Solicitud32505State = {
        adace: 'TEST',
        pais: 'TEST',
        anio: 'TEST',
        tipoBusqueda: 'TEST',
        tipoBusquedaAviso: '',
        folioTipo: '',
        confirmidad: '',
        numeroSerie: '',
        numeroNIV: '',
        anoModelo: '',
        marca: '',
        modelo: '',
        tipoVariante: '',
        cilindros: '',
        puertas: '',
        combustible: '',
        propiedad: '',
        nombreTitulo: '',
        paisEmitio: '',
        provinciaEmision: '',
        procedencia: '',
        vehiculoImportado: '',
        exportacion: '',
        aduanaImportacion: '',
        patenteImportacion: '',
        pedimentoImportacion: '',
        valorAduana: '',
        kilometraje: '',
        montoIGI: '',
        formaPagoIGI: '',
        montoDTA: '',
        montoIVA: '',
        valorDolares: '',
        folioCFDI: '',
        folioVenta: '',
        valorVenta: '',
        datosSolicitante: {
          rfc: '',
          denominacion: '',
          actividadEconomica: '',
          correoElectronico: '',
          pais: '',
          codigoPostal: '',
          entidadFederativa: '',
          municipio: '',
          localidad: '',
          colonia: '',
          calle: '',
          nExt: '',
          nInt: '',
          lada: '',
          telefono: '',
          adace: ''
        }
      };

     
      const result = service.getDatosConsulta();

     
      expect(result).toBeDefined();
      result.subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('assets/json/32505/consulta_32505.json');
      req.flush(mockResponse);
    });

    it('should handle HTTP errors gracefully', () => {
     
      service.getDatosConsulta().subscribe({
        next: () => fail('Should have failed with error'),
        error: (error) => {
         
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne('assets/json/32505/consulta_32505.json');
      req.flush('File not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('obtenerDatosSolicitante', () => {
    it('should fetch datos solicitante from correct endpoint', () => {
      const mockResponse: DatosSolicitante = {
        rfc: 'CURP123456',
        denominacion: 'Juan Pérez García',
        actividadEconomica: 'Comercio',
        correoElectronico: 'juan.perez@email.com',
        pais: 'México',
        codigoPostal: '12345',
        entidadFederativa: 'Baja California',
        municipio: 'Tijuana',
        localidad: 'Centro',
        colonia: 'Zona Centro',
        calle: 'Calle Principal',
        nExt: '123',
        nInt: 'A',
        lada: '664',
        telefono: '1234567',
        adace: 'ADACE001'
      };

     
      service.obtenerDatosSolicitante().subscribe((data) => {
       
        expect(data).toEqual(mockResponse);
        expect(data.rfc).toBe('CURP123456');
        expect(data.denominacion).toBe('Juan Pérez García');
        expect(data.correoElectronico).toBe('juan.perez@email.com');
      });

      const req = httpMock.expectOne('assets/json/32505/datosSolicitante.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  it('should fetch aviso table data', () => {
    const mockData: AvisoTablaDatos = {
      datos: []
    };

    service.obtenerAvisoTabla().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32505/aviso-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch aduana data', () => {
    const mockData: CatalogoLista = { datos: [{ id: 1, descripcion: 'Aduana 1' }] };

    service.obtenerAduana().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32505/aduana.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch combustible data', () => {
    const mockData: CatalogoLista = { datos: [{ id: 1, descripcion: 'Gasolina' }] };

    service.obtenerCombustible().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32505/combustible.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch cilindros data', () => {
    const mockData: CatalogoLista = { datos: [{ id: 1, descripcion: '4 Cilindros' }] };

    service.obtenerCilindros().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32505/cilindros.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch pais issued data', () => {
    const mockData: CatalogoLista = { datos: [{ id: 1, descripcion: 'USA' }] };

    service.obtenerPaisIssued().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32505/pais-issued.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch pais data', () => {
    const mockData: CatalogoLista = { datos: [{ id: 1, descripcion: 'México' }] };

    service.obtenerPais().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32505/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch years data', () => {
    const mockData: CatalogoLista = { datos: [{ id: 1, descripcion: '2023' }] };

    service.obtenerAnio().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32505/years.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch fraccion arancelaria catalog data', () => {
    const mockData: RespuestaCatalogos = { code: 1, message: 'Fracción 1', data: [{ id: 1, descripcion: 'Fracción 1' }] };

    service.getFraccionArancelariaCatalogo().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32502/fraccion-arancelaria-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch fraccion regla catalog data', () => {
    const mockData: RespuestaCatalogos = { code: 1, message: 'Fracción 1', data: [{ id: 1, descripcion: 'Fracción 1' }] };

    service.getFraccionReglaCatalogo().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32502/fraccion-regla-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch tipo documento data', () => {
    const mockData: RespuestaCatalogos = { code: 1, message: 'Fracción 1', data: [{ id: 1, descripcion: 'Fracción 1' }] };

    service.getTipoDocumento().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/32502/tipoDocumento.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});