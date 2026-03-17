import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConsultaService } from './consulta.service';
import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { ColumnasTabla, Destinatario, ListaClave, Mercancia, Asociados } from '../models/consulta.model';
import { Solicitud260704State, Tramite260704Store } from '../estados/Tramite260704.store';

describe('ConsultaService', () => {
  let service: ConsultaService;
  let httpMock: HttpTestingController;
  let tramiteStoreMock: any;

  beforeEach(() => {
    tramiteStoreMock = {
      setTipoOperacion: jest.fn(),
      setJustificacion: jest.fn(),
      setEstablecimiento: jest.fn(),
      setRazonSocial: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setMunicipio: jest.fn(),
      setLocalidad: jest.fn(),
      setColonia: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setScian: jest.fn(),
      setScianDatos: jest.fn(),
      setClaveScian: jest.fn(),
      setDescripcionScian: jest.fn(),
      setAvisoDeFuncionamiento: jest.fn(),
      setLicenciaSanitaria: jest.fn(),
      setRegimen: jest.fn(),
      setAduana: jest.fn(),
      setImmex: jest.fn(),
      setAno: jest.fn(),
      setMercancia: jest.fn(),
      setClasificacionProducto: jest.fn(),
      setEspecificarClasificacionProducto: jest.fn(),
      setDenominacionProducto: jest.fn(),
      setMarca: jest.fn(),
      setTipoProducto: jest.fn(),
      setEspecifique: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescripcionFraccionArancelaria: jest.fn(),
      setCantidadUMT: jest.fn(),
      setUMT: jest.fn(),
      setCantidadUMC: jest.fn(),
      setUMC: jest.fn(),
      setClaveLote: jest.fn(),
      setListaClave: jest.fn(),
      setManfestosYDeclaraciones: jest.fn(),
      setHacerlosPublicos: jest.fn(),
      setRFC: jest.fn(),
      setClaveDeReferencia: jest.fn(),
      setCadenaDependecia: jest.fn(),
      setBanco: jest.fn(),
      setLiaveDePago: jest.fn(),
      setImporteDePago: jest.fn(),
      setDestinatario: jest.fn(),
      setFabricante: jest.fn(),
      setTipoPersona: jest.fn(),
      setNombre: jest.fn(),
      setPrimerApellido: jest.fn(),
      setSegundoApellido: jest.fn(),
      setDenominacion: jest.fn(),
      setPais: jest.fn(),
      setEstados: jest.fn(),
      setCodigoDeZip: jest.fn(),
      setCamino: jest.fn(),
      setNumeroExterior: jest.fn(),
      setNumeroInterior: jest.fn(),
      setLadaDeTerceros: jest.fn(),
      setFon: jest.fn(),
      setEmail: jest.fn(),
      setFechaPago: jest.fn(),
      setNombreRazon: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite260704Store, useValue: tramiteStoreMock }
      ]
    });
    service = TestBed.inject(ConsultaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update store in actualizarEstadoFormulario', () => {
    const datos: Solicitud260704State = {
      mercanciasDatos: [],
      destinatarioDatos: [],
      tipoOperacion: 'tipo',
      justificacion: 'just',
      establecimiento: 'est',
      razonSocial: 'razon',
      correoElectronico: 'correo',
      codigoPostal: 'cp',
      estado: 'edo',
      municipio: 'mun',
      localidad: 'loc',
      colonia: 'col',
      calle: 'calle',
      lada: 'lada',
      telefono: 'tel',
      scian: true,
      scianDatos: true,
      claveScian: 'clave',
      descripcionScian: 'desc',
      avisoDeFuncionamiento: true,
      licenciaSanitaria: 'lic',
      regimen: 'reg',
      aduana: 'adu',
      immex: 'immex',
      ano: '2024',
      mercancia: 'merc',
      clasificacionProducto: 'clas',
      especificarClasificacionProducto: 'esp',
      denominacionProducto: 'den',
      marca: 'marca',
      tipoProducto: 'tipoProd',
      especifique: 'espq',
      fraccionArancelaria: 'frac',
      descripcionFraccionArancelaria: 'descFrac',
      cantidadUMT: '10',
      umt: 'umt',
      cantidadUMC: '5',
      umc: 'umc',
      claveLote: 'cll',
      listaClave: 'lcl',
      manfestosYDeclaraciones: true,
      hacerlosPublicos: 'si',
      rfc: 'RFC',
      claveDeReferencia: 'ref',
      cadenaDependecia: 'cad',
      banco: 'banco',
      liaveDePago: 'llave',
      importeDePago: '1000',
      destinatario: 'dest',
      fabricante: 'fab',
      tipoPersona: 'fisica',
      nombre: 'nombre',
      primerApellido: 'paterno',
      segundoApellido: 'materno',
      denominacion: 'denom',
      pais: 'pais',
      estados: 'estados',
      codigoDeZip: 'zip',
      camino: 'camino',
      numeroExterior: 'ext',
      numeroInterior: 'int',
      ladaDeTerceros: 'ladaT',
      fon: 'fon',
      email: 'mail',
      fechaPago: '2024-01-01',
      nombreRazon: 'nombreRazon',
      apellidoPaterno: 'apPaterno',
      apellidoMaterno: 'apMaterno'
    };
    service.actualizarEstadoFormulario(datos);
    expect(tramiteStoreMock.setTipoOperacion).toHaveBeenCalledWith('tipo');
    expect(tramiteStoreMock.setJustificacion).toHaveBeenCalledWith('just');
    expect(tramiteStoreMock.setNombreRazon).toHaveBeenCalledWith('nombreRazon');
    expect(tramiteStoreMock.setApellidoPaterno).toHaveBeenCalledWith('apPaterno');
    expect(tramiteStoreMock.setApellidoMaterno).toHaveBeenCalledWith('apMaterno');
    // ...you can add more expects for other setters if desired
  });

  it('should fetch datos estado', () => {
    const mockResponse: Catalogo[] = [{ id: 1, descripcion: 'Estado Test' }];
    service.obtenerDatosEstado().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/260704/estado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch datos clave', () => {
    const mockResponse: Catalogo[] = [{ id: 1, descripcion: 'Clave Test' }];
    service.obtenerDatosClave().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/260704/clave.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch tabla scian', () => {
    const mockResponse: ColumnasTabla[] = [{ claveScian: '123', descripcionScian: 'SCIAN Test' }];
    service.obtenerTablaScian().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/260704/clave-scian.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error in obtenerTablaScian', () => {
    service.obtenerTablaScian().subscribe({
      error: (err) => expect(err).toBeTruthy()
    });
    const req = httpMock.expectOne('assets/json/260704/clave-scian.json');
    req.error(new ErrorEvent('Network error'));
  });

  it('should fetch tabla mercancias', () => {
    const mockResponse: Mercancia[] = [{
      clasificaionProductos: 'Producto Test',
      especificarProducto: 1,
      nombreProductoEspecifico: 'Nombre Test',
      marca: 'Marca Test',
      tipoProducto: 1,
      fraccionArancelaria: '123',
      descripcionFraccionArancelaria: 'Descripción Test',
      cantidadUMT: '10',
      umt: 'UMT Test',
      cantidadUMC: '5',
      umc: 1,
      paisDeOrigen: 'México',
      paisDeProcedencia: 'USA',
      usoEspecifico: 'Uso Test'
    }];
    service.obtenerTablaMercancias().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/260704/mercancia-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error in obtenerTablaMercancias', () => {
    service.obtenerTablaMercancias().subscribe({
      error: (err) => expect(err).toBeTruthy()
    });
    const req = httpMock.expectOne('assets/json/260704/mercancia-tabla.json');
    req.error(new ErrorEvent('Network error'));
  });

  it('should fetch tabla lista clave', () => {
    const mockResponse: ListaClave[] = [{ claveDeLosLotes: '123', fechaDeFabricacion: '2025-01-01', fechaDeCaducidad: '2025-12-31' }];
    service.obtenerTablaListaClave().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/260704/lista-clave-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error in obtenerTablaListaClave', () => {
    service.obtenerTablaListaClave().subscribe({
      error: (err) => expect(err).toBeTruthy()
    });
    const req = httpMock.expectOne('assets/json/260704/lista-clave-tabla.json');
    req.error(new ErrorEvent('Network error'));
  });

  it('should fetch tabla tramites', () => {
    const mockResponse: Asociados[] = [{ folioTramite: '12345', tipoTramite: 'Tipo Test', estatus: 'Activo', fechaRegistro: '2025-04-10' }];
    service.obtenerTablaTramites().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/260704/asociados-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error in obtenerTablaTramites', () => {
    service.obtenerTablaTramites().subscribe({
      error: (err) => expect(err).toBeTruthy()
    });
    const req = httpMock.expectOne('assets/json/260704/asociados-tabla.json');
    req.error(new ErrorEvent('Network error'));
  });

  it('should fetch tabla terceros', () => {
    const mockResponse: Destinatario[] = [{
      nombre: 'Destinatario Test',
      rfc: 'RFC123',
      curp: 'CURP123',
      telefono: '1234567890',
      correoElectronico: 'test@test.com',
      calle: 'Calle Test',
      numeroExterior: '123',
      numeroInterior: '456',
      pais: 'México',
      colonia: 'Colonia Test',
      municipio: 'Municipio Test',
      localidad: 'Localidad Test',
      estado: 'Estado Test',
      estado2: 'Estado2 Test',
      codigo: '12345'
    }];
    service.obtenerTablaTerceros().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/260704/terceros-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error in obtenerTablaTerceros', () => {
    service.obtenerTablaTerceros().subscribe({
      error: (err) => expect(err).toBeTruthy()
    });
    const req = httpMock.expectOne('assets/json/260704/terceros-tabla.json');
    req.error(new ErrorEvent('Network error'));
  });

  it('should fetch datos banco', () => {
    const mockResponse: Catalogo[] = [{ id: 1, descripcion: 'Banco Test' }];
    service.obtenerDatosBanco().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/260704/banco.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch descripcion scian', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      message: 'Success',
      data: [{ id: 1, descripcion: 'SCIAN Test' }],
    };
    service.getDescripcionScian().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/260601/descripcion-scian.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});