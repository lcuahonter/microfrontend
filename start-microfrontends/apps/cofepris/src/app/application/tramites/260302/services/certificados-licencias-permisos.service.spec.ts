import { CertificadosLicenciasPermisosService } from './certificados-licencias-permisos.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('CertificadosLicenciasPermisosService', () => {
  let service: CertificadosLicenciasPermisosService;
  let httpMock: jest.Mocked<HttpClient>;
  let storeMock: any;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    storeMock = {};
    [
      'setDenominacionRazon',
      'setCodigoPostal',
      'setEstado',
      'setMunicipio',
      'setLocalidad',
      'setColonia',
      'setCalleYNumero',
      'setCorreoElecronico',
      'setLada',
      'setTelefono',
      'setClaveScianModal',
      'setAvisoDeFuncionamiento',
      'setClave',
      'setDescripcion',
      'setAvisoCheckbox',
      'setLicenciaSanitaria',
      'setRegimen',
      'setRegimenDestinara',
      'setAduanasEntradas',
      'setNumeroPermiso',
      'setLosDatosNo',
      'setLosDatosYes',
      'setNombreORazon',
      'setClasificacion',
      'setEspecificarClasificacionProducto',
      'setDenominacionEspecifica',
      'setDenominacionDistintiva',
      'setDenominacionComun',
      'setTipoDeProducto',
      'setEstadoFisico',
      'setFraccionArancelaria',
      'setDescripcionFraccion',
      'setCantidadUMT',
      'setUMT',
      'setCantidadUMC',
      'setUMC',
      'setPresentacion',
      'setNumeroRegistro',
      'setFechaCaducidad',
      'setCumplimiento',
      'setRfc',
      'setNombre',
      'setApellidoPaterno',
      'setApellidoMaterno',
      'setDci',
      'setMarcaComercialODenominacionDistintiva',
      'setDescripcionDeLaFraccion',
      'setNumeroCas',
      'setCantidadDeLotes',
      'setKgOrPorLote',
      'setPais',
      'setPaisDeProcedencia',
      'setDetallarUso',
      'setNumeroDePiezas',
      'setDescripcionDelNumeroDePiezas',
      'setNumeroDeRegistro',
      'setClaveDeReferencia',
      'setCadenaDaLaDependencia',
      'setBanco',
      'setLaveDePago',
      'setFechaDePago',
      'setImporteDePago',
      'setTipoDocumento',
      'setTercerosRelacionadosDenominacionSocial',
      'setTercerosRelacionadosTerceroNombre',
      'setTercerosRelacionadosNacional',
      'setTercerosRelacionadosExtranjero',
      'setTercerosRelacionadosFisica',
      'setTercerosRelacionadosMoral',
      'setTercerosRelacionadosNoContribuyente',
      'setTercerosRelacionadosRfc',
      'setTercerosRelacionadosCurp',
      'setTercerosRelacionadosRazonSocial',
      'setTercerosRelacionadosPais',
      'setTercerosRelacionadosEstado',
      'setTercerosRelacionadosCodigoPostal',
      'setTercerosRelacionadosCalle',
      'setTercerosRelacionadosNumeroExterior',
      'setTercerosRelacionadosNumeroInterior',
      'setTercerosRelacionadosLada',
      'setTercerosRelacionadosTelefono',
      'setTercerosRelacionadosCorreoElectronico',
      'setManifiestos',
      'setTercerosNacionalidad',
      'setTipoPersona',
    ].forEach((method) => {
      storeMock[method] = jest.fn();
    });

    service = new CertificadosLicenciasPermisosService(httpMock, storeMock);
  });

  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('Métodos de obtención de catálogos', () => {
    const endpoints = [
      {
        method: 'getEstadoDatos',
        url: 'assets/json/260302/estado-catalog.json',
        type: 'EstadoCatalogResponse',
      },
      {
        method: 'getScianDatos',
        url: 'assets/json/260302/scian-tabla.json',
        type: 'ScianDatos[]',
      },
      {
        method: 'getClaveDatos',
        url: 'assets/json/260302/clave-catalog.json',
        type: 'EstadoCatalogResponse',
      },
      {
        method: 'getRegimenDatos',
        url: 'assets/json/260302/regimen-catalog.json',
        type: 'EstadoCatalogResponse',
      },
      {
        method: 'getMercanciasDatos',
        url: 'assets/json/260302/mercancias-tabla.json',
        type: 'MercanciasDatos[]',
      },
      {
        method: 'getTipoDeProductoDatos',
        url: 'assets/json/260302/tipo-de-producto-catalog.json',
        type: 'EstadoCatalogResponse',
      },
      {
        method: 'getPaisDeProcedenciaDatos',
        url: 'assets/json/260302/pais-de-procedencia-catalog.json',
        type: 'EstadoCatalogResponse',
      },
      {
        method: 'getFabricanteDatos',
        url: 'assets/json/260302/fabricante-tabla.json',
        type: 'Fabricante[]',
      },
      {
        method: 'getFacturadorDatos',
        url: 'assets/json/260302/facturador-tabla.json',
        type: 'Fabricante[]',
      },
      {
        method: 'getProveedorDatos',
        url: 'assets/json/260302/proveedor-tabla.json',
        type: 'Fabricante[]',
      },
      {
        method: 'getCertificadoDatos',
        url: 'assets/json/260302/certificado-analitico-tabla.json',
        type: 'Fabricante[]',
      },
      {
        method: 'getOtrosDatos',
        url: 'assets/json/260302/otros-tabla.json',
        type: 'Otros[]',
      },
      {
        method: 'getBancoDatos',
        url: 'assets/json/260302/banco-catalog.json',
        type: 'JSONResponse',
      },
      {
        method: 'getTipoDeDocumentoDatos',
        url: 'assets/json/260302/tipo-de-documento.json',
        type: 'JSONResponse',
      },
      {
        method: 'getFormularioData',
        url: 'assets/json/260302/inicializar-formulario.json',
        type: 'Solicitud260302State',
      },
    ];

    endpoints.forEach(({ method, url }) => {
      it(`debe obtener datos correctamente para ${method}`, (done) => {
        const mockResponse = { test: 'ok' };
        httpMock.get.mockReturnValueOnce(of(mockResponse));
        (service as any)[method]().subscribe((resp: any) => {
          expect(resp).toEqual(mockResponse);
          expect(httpMock.get).toHaveBeenCalledWith(url);
          done();
        });
      });

      it(`debe propagar error si ocurre en ${method}`, (done) => {
        const error = new Error('fail');
        httpMock.get.mockReturnValueOnce(throwError(() => error));
        (service as any)[method]().subscribe({
          next: () => {},
          error: (err: any) => {
            expect(err).toBe(error);
            done();
          },
        });
      });
    });
  });

  it('debe actualizar correctamente el estado del formulario en el store', () => {
    const mockData: any = {
      denominacionRazon: 'Empresa XYZ',
      codigoPostal: '12345',
      estado: 'Estado1',
      municipio: 'Municipio1',
      localidad: 'Localidad1',
      colonia: 'Colonia1',
      calleYNumero: 'Calle 123',
      correoElecronico: 'email@test.com',
      lada: '55',
      telefono: '5555555555',
      claveScianModal: 'ABC123',
      avisoDeFuncionamiento: 'Sí',
      clave: 'Clave123',
      descripcion: 'Descripción',
      avisoCheckbox: true,
      licenciaSanitaria: 'Licencia123',
      regimen: 'Regimen1',
      regimenDestinara: 'Destinara1',
      aduana: 'Aduana1',
      numeroPermiso: 'Permiso123',
      manifiestos: 'Manifiesto1',
      losDatosNo: false,
      nombreORazon: 'Nombre Razon',
      clasificacion: 'Clasificación',
      especificarClasificacionProducto: 'Detalle Clasificación',
      denominacionEspecifica: 'Denominación Específica',
      denominacionDistintiva: 'Distintiva',
      denominacionComun: 'Común',
      tipoDeProducto: 'Tipo1',
      estadoFisico: 'Físico',
      fraccionArancelaria: '1234.56',
      descripcionFraccion: 'Descripción Fracción',
      cantidadUMT: '100',
      UMT: 'KG',
      cantidadUMC: '50',
      UMC: 'L',
      presentacion: 'Caja',
      numeroRegistro: 'Registro123',
      fechaCaducidad: '2025-12-31',
      cumplimiento: 'Cumple',
      rfc: 'RFC123456',
      nombre: 'Juan',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'López',
      dci: 'DCI1',
      marcaComercialODenominacionDistintiva: 'Marca123',
      descripcionDeLaFraccion: 'Desc Fracción',
      numeroCas: 'CAS123',
      cantidadDeLotes: '10',
      kgOrPorLote: '100KG',
      pais: 'México',
      paisDeProcedencia: 'USA',
      detallarUso: 'Uso específico',
      numeroDePiezas: '20',
      descripcionDelNumeroDePiezas: '20 piezas',
      numeroDeRegistro: 'Reg123',
      claveDeReferencia: 'ClaveRef123',
      cadenaDaLaDependencia: 'CadenaDependencia',
      banco: 'Banco1',
      laveDePago: 'ClavePago123',
      fechaDePago: '2025-06-30',
      importeDePago: '5000',
      tipoDocumento: 'Documento1',
      tercerosRelacionadosDenominacionSocial: 'TerceroSocial',
      tercerosRelacionadosTerceroNombre: 'TerceroNombre',
      tercerosNacionalidad: 'Mexicana',
      tipoPersona: 'Moral',
      tercerosRelacionadosRfc: 'RFC987654',
      tercerosRelacionadosCurp: 'CURP987654',
      tercerosRelacionadosRazonSocial: 'RazonSocial3',
      tercerosRelacionadosPais: 'México',
      tercerosRelacionadosEstado: 'Estado3',
      tercerosRelacionadosCodigoPostal: '54321',
      tercerosRelacionadosCalle: 'Calle Secundaria',
      tercerosRelacionadosNumeroExterior: '12',
      tercerosRelacionadosNumeroInterior: 'A',
      tercerosRelacionadosLada: '33',
      tercerosRelacionadosTelefono: '3333333333',
      tercerosRelacionadosCorreoElectronico: 'tercero@test.com',
    };

    service.actualizarEstadoFormulario(mockData);

    expect(storeMock.setDenominacionRazon).toHaveBeenCalledWith('Empresa XYZ');
    expect(storeMock.setCodigoPostal).toHaveBeenCalledWith('12345');
    expect(storeMock.setCorreoElecronico).toHaveBeenCalledWith(
      'email@test.com'
    );
    expect(storeMock.setFraccionArancelaria).toHaveBeenCalledWith('1234.56');
    expect(storeMock.setClaveDeReferencia).toHaveBeenCalledWith('ClaveRef123');
    expect(storeMock.setImporteDePago).toHaveBeenCalledWith('5000');
    expect(
      storeMock.setTercerosRelacionadosDenominacionSocial
    ).toHaveBeenCalledWith('TerceroSocial');
  });

  it('debe propagar el error si getFormularioData falla', (done) => {
    const error = new Error('Network Error');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getFormularioData().subscribe({
      next: () => {},
      error: (err) => {
        expect(err).toBe(error);
        done();
      },
    });
  });

  it('debe obtener datos correctamente para getPaisDatos', (done) => {
    const mockResponse = [{ id: 1, nombre: 'México' }];
    httpMock.get.mockReturnValueOnce(of(mockResponse));
    service.getPaisDatos().subscribe((resp) => {
      expect(resp).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/260302/pais.json');
      done();
    });
  });

  it('debe propagar error si ocurre en getPaisDatos', (done) => {
    const error = new Error('fail');
    httpMock.get.mockReturnValueOnce(throwError(() => error));
    service.getPaisDatos().subscribe({
      next: () => {},
      error: (err) => {
        expect(err).toBe(error);
        done();
      },
    });
  });

  it('debe manejar actualizarEstadoFormulario con todos los campos null/undefined', () => {
    const mockData: any = {
      denominacionRazon: null,
      codigoPostal: undefined,
      estado: '',
      municipio: null,
      localidad: undefined,
      colonia: '',
      calleYNumero: null,
      correoElecronico: undefined,
      lada: '',
      telefono: null,
      claveScianModal: undefined,
      avisoDeFuncionamiento: '',
      clave: null,
      descripcion: undefined,
      avisoCheckbox: false,
      licenciaSanitaria: '',
      regimen: null,
      regimenDestinara: undefined,
      aduana: '',
      numeroPermiso: null,
      manifiestos: undefined,
      losDatosNo: '',
      nombreORazon: null,
      clasificacion: undefined,
      especificarClasificacionProducto: '',
      denominacionEspecifica: null,
      denominacionDistintiva: undefined,
      denominacionComun: '',
      tipoDeProducto: null,
      estadoFisico: undefined,
      fraccionArancelaria: '',
      descripcionFraccion: null,
      cantidadUMT: undefined,
      UMT: '',
      cantidadUMC: null,
      UMC: undefined,
      presentacion: '',
      numeroRegistro: null,
      fechaCaducidad: undefined,
      cumplimiento: '',
      rfc: null,
      nombre: undefined,
      apellidoPaterno: '',
      apellidoMaterno: null,
      dci: undefined,
      marcaComercialODenominacionDistintiva: '',
      descripcionDeLaFraccion: null,
      numeroCas: undefined,
      cantidadDeLotes: '',
      kgOrPorLote: null,
      pais: undefined,
      paisDeProcedencia: '',
      detallarUso: null,
      numeroDePiezas: undefined,
      descripcionDelNumeroDePiezas: '',
      numeroDeRegistro: null,
      claveDeReferencia: undefined,
      cadenaDaLaDependencia: '',
      banco: null,
      laveDePago: undefined,
      fechaDePago: '',
      importeDePago: null,
      tipoDocumento: undefined,
      tercerosRelacionadosDenominacionSocial: '',
      tercerosRelacionadosTerceroNombre: null,
      tercerosNacionalidad: undefined,
      tipoPersona: '',
      tercerosRelacionadosRfc: null,
      tercerosRelacionadosCurp: undefined,
      tercerosRelacionadosRazonSocial: '',
      tercerosRelacionadosPais: null,
      tercerosRelacionadosEstado: undefined,
      tercerosRelacionadosCodigoPostal: '',
      tercerosRelacionadosCalle: null,
      tercerosRelacionadosNumeroExterior: undefined,
      tercerosRelacionadosNumeroInterior: '',
      tercerosRelacionadosLada: null,
      tercerosRelacionadosTelefono: undefined,
      tercerosRelacionadosCorreoElectronico: '',
    };

    expect(() => service.actualizarEstadoFormulario(mockData)).not.toThrow();
    expect(storeMock.setDenominacionRazon).toHaveBeenCalledWith(null);
    expect(storeMock.setCodigoPostal).toHaveBeenCalledWith(undefined);
    expect(storeMock.setAvisoCheckbox).toHaveBeenCalledWith(false);
  });

  it('debe crear el servicio sin errores con dependencias válidas', () => {
    expect(service).toBeDefined();
    expect(service.getEstadoDatos).toBeDefined();
    expect(service.actualizarEstadoFormulario).toBeDefined();
  });
});
