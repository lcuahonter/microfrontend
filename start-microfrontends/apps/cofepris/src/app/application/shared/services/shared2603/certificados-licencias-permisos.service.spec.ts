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
        'setEspecifique',
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
        { method: 'getEstadoDatos', url: 'assets/json/2603/estado-catalog.json', type: 'EstadoCatalogResponse' },
        { method: 'getScianDatos', url: 'assets/json/2603/scian-tabla.json', type: 'ScianDatos[]' },
        { method: 'getClaveDatos', url: 'assets/json/2603/clave-catalog.json', type: 'EstadoCatalogResponse' },
        { method: 'getRegimenDatos', url: 'assets/json/2603/regimen-catalog.json', type: 'EstadoCatalogResponse' },
        { method: 'getMercanciasDatos', url: 'assets/json/2603/mercancias-tabla.json', type: 'MercanciasDatos[]' },
        { method: 'getTipoDeProductoDatos', url: 'assets/json/2603/tipo-de-producto-catalog.json', type: 'EstadoCatalogResponse' },
        { method: 'getPaisDeProcedenciaDatos', url: 'assets/json/2603/pais-de-procedencia-catalog.json', type: 'EstadoCatalogResponse' },
        { method: 'getFabricanteDatos', url: 'assets/json/2603/fabricante-tabla.json', type: 'Fabricante[]' },
        { method: 'getFacturadorDatos', url: 'assets/json/2603/facturador-tabla.json', type: 'Fabricante[]' },
        { method: 'getProveedorDatos', url: 'assets/json/2603/proveedor-tabla.json', type: 'Fabricante[]' },
        { method: 'getCertificadoDatos', url: 'assets/json/2603/certificado-analitico-tabla.json', type: 'Fabricante[]' },
        { method: 'getOtrosDatos', url: 'assets/json/2603/otros-tabla.json', type: 'Otros[]' },
        { method: 'getBancoDatos', url: 'assets/json/2603/banco-catalog.json', type: 'JSONResponse' },
        { method: 'getTipoDeDocumentoDatos', url: 'assets/json/2603/tipo-de-documento.json', type: 'JSONResponse' },
        { method: 'getFormularioData', url: 'assets/json/2603/inicializar-formulario.json', type: 'Solicitud2603State' },
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

        it('debe obtener datos correctamente para getClaveCatalogDatos', (done) => {
          const mockResponse = { clave: 'test' };
          httpMock.get.mockReturnValueOnce(of(mockResponse));
          service.getClaveCatalogDatos().subscribe((resp) => {
            expect(resp).toEqual(mockResponse);
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/2603/clasificacion-del-producto.json');
            done();
          });
        });
    });

    it('debe llamar a todos los métodos del store con los datos correctos', () => {
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
        clave: 'ABC123',
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
        const keyMethodMap = {
          denominacionRazon: 'setDenominacionRazon',
          codigoPostal: 'setCodigoPostal',
          estado: 'setEstado',
          municipio: 'setMunicipio',
          localidad: 'setLocalidad',
          colonia: 'setColonia',
          calleYNumero: 'setCalleYNumero',
          correoElecronico: 'setCorreoElecronico',
          lada: 'setLada',
          telefono: 'setTelefono',
          claveScianModal: 'setClaveScianModal',
          avisoDeFuncionamiento: 'setAvisoDeFuncionamiento',
          clave: 'setClave',
          descripcion: 'setDescripcion',
          avisoCheckbox: 'setAvisoCheckbox',
          licenciaSanitaria: 'setLicenciaSanitaria',
          regimen: 'setRegimen',
          regimenDestinara: 'setRegimenDestinara',
          aduana: 'setAduanasEntradas',
          numeroPermiso: 'setNumeroPermiso',
          manifiestos: 'setManifiestos',
          losDatosNo: 'setLosDatosNo',
          nombreORazon: 'setNombreORazon',
          clasificacion: 'setClasificacion',
          especificarClasificacionProducto: 'setEspecificarClasificacionProducto',
          denominacionEspecifica: 'setDenominacionEspecifica',
          denominacionDistintiva: 'setDenominacionDistintiva',
          denominacionComun: 'setDenominacionComun',
          tipoDeProducto: 'setTipoDeProducto',
          especifique: 'setEspecifique',
          estadoFisico: 'setEstadoFisico',
          fraccionArancelaria: 'setFraccionArancelaria',
          descripcionFraccion: 'setDescripcionFraccion',
          cantidadUMT: 'setCantidadUMT',
          UMT: 'setUMT',
          cantidadUMC: 'setCantidadUMC',
          UMC: 'setUMC',
          presentacion: 'setPresentacion',
          numeroRegistro: 'setNumeroRegistro',
          fechaCaducidad: 'setFechaCaducidad',
          cumplimiento: 'setCumplimiento',
          rfc: 'setRfc',
          nombre: 'setNombre',
          apellidoPaterno: 'setApellidoPaterno',
          apellidoMaterno: 'setApellidoMaterno',
          dci: 'setDci',
          marcaComercialODenominacionDistintiva: 'setMarcaComercialODenominacionDistintiva',
          descripcionDeLaFraccion: 'setDescripcionDeLaFraccion',
          numeroCas: 'setNumeroCas',
          cantidadDeLotes: 'setCantidadDeLotes',
          kgOrPorLote: 'setKgOrPorLote',
          pais: 'setPais',
          paisDeProcedencia: 'setPaisDeProcedencia',
          detallarUso: 'setDetallarUso',
          numeroDePiezas: 'setNumeroDePiezas',
          descripcionDelNumeroDePiezas: 'setDescripcionDelNumeroDePiezas',
          numeroDeRegistro: 'setNumeroDeRegistro',
          claveDeReferencia: 'setClaveDeReferencia',
          cadenaDaLaDependencia: 'setCadenaDaLaDependencia',
          banco: 'setBanco',
          laveDePago: 'setLaveDePago',
          fechaDePago: 'setFechaDePago',
          importeDePago: 'setImporteDePago',
          tipoDocumento: 'setTipoDocumento',
          tercerosRelacionadosDenominacionSocial: 'setTercerosRelacionadosDenominacionSocial',
          tercerosRelacionadosTerceroNombre: 'setTercerosRelacionadosTerceroNombre',
          tercerosNacionalidad: 'setTercerosNacionalidad',
          tipoPersona: 'setTipoPersona',
          tercerosRelacionadosRfc: 'setTercerosRelacionadosRfc',
          tercerosRelacionadosCurp: 'setTercerosRelacionadosCurp',
          tercerosRelacionadosRazonSocial: 'setTercerosRelacionadosRazonSocial',
          tercerosRelacionadosPais: 'setTercerosRelacionadosPais',
          tercerosRelacionadosEstado: 'setTercerosRelacionadosEstado',
          tercerosRelacionadosCodigoPostal: 'setTercerosRelacionadosCodigoPostal',
          tercerosRelacionadosCalle: 'setTercerosRelacionadosCalle',
          tercerosRelacionadosNumeroExterior: 'setTercerosRelacionadosNumeroExterior',
          tercerosRelacionadosNumeroInterior: 'setTercerosRelacionadosNumeroInterior',
          tercerosRelacionadosLada: 'setTercerosRelacionadosLada',
          tercerosRelacionadosTelefono: 'setTercerosRelacionadosTelefono',
          tercerosRelacionadosCorreoElectronico: 'setTercerosRelacionadosCorreoElectronico',
        };
        Object.entries(keyMethodMap).forEach(([key, method]) => {
          expect(storeMock[method]).toHaveBeenCalledWith(mockData[key]);
        });
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
      expect(httpMock.get).toHaveBeenCalledWith('assets/json/2603/pais.json');
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

    it('debe cubrir la línea 332: getPaisDatos error branch', (done) => {
      const error = new Error('Test error for coverage');
      httpMock.get.mockReturnValueOnce(throwError(() => error));
      service.getPaisDatos().subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
      });
    });
    describe('CertificadosLicenciasPermisosService - Coverage Additions', () => {
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
        'setEspecifique',
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

    const catalogMethods = [
      { method: 'getEstadoDatos', url: 'assets/json/2603/estado-catalog.json' },
      { method: 'getScianDatos', url: 'assets/json/2603/scian-tabla.json' },
      { method: 'getClaveDatos', url: 'assets/json/2603/clave-catalog.json' },
      { method: 'getRegimenDatos', url: 'assets/json/2603/regimen-catalog.json' },
      { method: 'getMercanciasDatos', url: 'assets/json/2603/mercancias-tabla.json' },
      { method: 'getTipoDeProductoDatos', url: 'assets/json/2603/tipo-de-producto-catalog.json' },
      { method: 'getPaisDeProcedenciaDatos', url: 'assets/json/2603/pais-de-procedencia-catalog.json' },
      { method: 'getFabricanteDatos', url: 'assets/json/2603/fabricante-tabla.json' },
      { method: 'getFacturadorDatos', url: 'assets/json/2603/facturador-tabla.json' },
      { method: 'getProveedorDatos', url: 'assets/json/2603/proveedor-tabla.json' },
      { method: 'getCertificadoDatos', url: 'assets/json/2603/certificado-analitico-tabla.json' },
      { method: 'getOtrosDatos', url: 'assets/json/2603/otros-tabla.json' },
      { method: 'getBancoDatos', url: 'assets/json/2603/banco-catalog.json' },
      { method: 'getTipoDeDocumentoDatos', url: 'assets/json/2603/tipo-de-documento.json' },
      { method: 'getClaveCatalogDatos', url: 'assets/json/2603/clasificacion-del-producto.json' },
      { method: 'getFormularioData', url: 'assets/json/2603/inicializar-formulario.json' },
      { method: 'getPaisDatos', url: 'assets/json/2603/pais.json' },
    ];
    catalogMethods.forEach(({ method, url }) => {
      it(`should fetch ${method} successfully`, (done) => {
        httpMock.get.mockReturnValueOnce(of({ result: 'ok' }));
        (service as any)[method]().subscribe((resp: any) => {
          expect(resp).toEqual({ result: 'ok' });
          expect(httpMock.get).toHaveBeenCalledWith(url);
          done();
        });
      });
      it(`should handle error in ${method}`, (done) => {
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

    it('should call all store setters with full data', () => {
      const setters = [
        'setDenominacionRazon', 'setCodigoPostal', 'setEstado', 'setMunicipio', 'setLocalidad', 'setColonia', 'setCalleYNumero', 'setCorreoElecronico',
        'setLada', 'setTelefono', 'setClaveScianModal', 'setAvisoDeFuncionamiento', 'setClaveScian', 'setDescripcion', 'setAvisoCheckbox', 'setLicenciaSanitaria',
        'setRegimen', 'setRegimenDestinara', 'setAduanasEntradas', 'setNumeroPermiso', 'setLosDatosNo', 'setNombreORazon', 'setClasificacion', 'setClave',
        'setEspecificarClasificacionProducto', 'setDenominacionEspecifica', 'setDenominacionDistintiva', 'setDenominacionComun', 'setTipoDeProducto', 'setEspecifique',
        'setEstadoFisico', 'setFraccionArancelaria', 'setDescripcionFraccion', 'setCantidadUMT', 'setUMT', 'setCantidadUMC', 'setUMC', 'setPresentacion',
        'setNumeroRegistro', 'setFechaCaducidad', 'setCumplimiento', 'setRfc', 'setNombre', 'setApellidoPaterno', 'setApellidoMaterno', 'setDci',
        'setMarcaComercialODenominacionDistintiva', 'setDescripcionDeLaFraccion', 'setNumeroCas', 'setCantidadDeLotes', 'setKgOrPorLote', 'setPais',
        'setPaisDeProcedencia', 'setDetallarUso', 'setNumeroDePiezas', 'setDescripcionDelNumeroDePiezas', 'setNumeroDeRegistro', 'setClaveDeReferencia',
        'setCadenaDaLaDependencia', 'setBanco', 'setLaveDePago', 'setFechaDePago', 'setImporteDePago', 'setTipoDocumento', 'setTercerosRelacionadosDenominacionSocial',
        'setTercerosRelacionadosTerceroNombre', 'setTercerosNacionalidad', 'setTipoPersona', 'setTercerosRelacionadosRfc', 'setTercerosRelacionadosCurp',
        'setTercerosRelacionadosRazonSocial', 'setTercerosRelacionadosPais', 'setTercerosRelacionadosEstado', 'setTercerosRelacionadosCodigoPostal',
        'setTercerosRelacionadosCalle', 'setTercerosRelacionadosNumeroExterior', 'setTercerosRelacionadosNumeroInterior', 'setTercerosRelacionadosLada',
        'setTercerosRelacionadosTelefono', 'setTercerosRelacionadosCorreoElectronico', 'setManifiestos'
      ];
      const fullState = {
        denominacionRazon: 'test',
        codigoPostal: 'test',
        estado: 'test',
        municipio: 'test',
        localidad: 'test',
        colonia: 'test',
        calleYNumero: 'test',
        correoElecronico: 'test',
        lada: 'test',
        telefono: 'test',
        claveScianModal: 'test',
        avisoDeFuncionamiento: 'test',
        clave: 'test',
        claveScian: 'test',
        descripcion: 'test',
        avisoCheckbox: true,
        licenciaSanitaria: 'test',
        regimen: 'test',
        regimenDestinara: 'test',
        aduana: 'test',
        numeroPermiso: 'test',
        losDatosNo: 'test',
        nombreORazon: 'test',
        clasificacion: 'test',
        especificarClasificacionProducto: 'test',
        denominacionEspecifica: 'test',
        denominacionDistintiva: 'test',
        denominacionComun: 'test',
        tipoDeProducto: 'test',
        especifique: 'test',
        estadoFisico: 'test',
        fraccionArancelaria: 'test',
        descripcionFraccion: 'test',
        cantidadUMT: 'test',
        UMT: 'test',
        cantidadUMC: 'test',
        UMC: 'test',
        presentacion: 'test',
        numeroRegistro: 'test',
        fechaCaducidad: 'test',
        cumplimiento: 'test',
        rfc: 'test',
        nombre: 'test',
        apellidoPaterno: 'test',
        apellidoMaterno: 'test',
        dci: 'test',
        marcaComercialODenominacionDistintiva: 'test',
        descripcionDeLaFraccion: 'test',
        numeroCas: 'test',
        cantidadDeLotes: 'test',
        kgOrPorLote: 'test',
        pais: 'test',
        paisDeProcedencia: 'test',
        detallarUso: 'test',
        numeroDePiezas: 'test',
        descripcionDelNumeroDePiezas: 'test',
        numeroDeRegistro: 'test',
        claveDeReferencia: 'test',
        cadenaDaLaDependencia: 'test',
        banco: 'test',
        laveDePago: 'test',
        fechaDePago: 'test',
        importeDePago: 'test',
        tipoDocumento: 'test',
        tercerosRelacionadosDenominacionSocial: 'test',
        tercerosRelacionadosTerceroNombre: 'test',
        tercerosNacionalidad: 'test',
        tipoPersona: 'test',
        tercerosRelacionadosRfc: 'test',
        tercerosRelacionadosCurp: 'test',
        tercerosRelacionadosRazonSocial: 'test',
        tercerosRelacionadosPais: 'test',
        tercerosRelacionadosEstado: 'test',
        tercerosRelacionadosCodigoPostal: 'test',
        tercerosRelacionadosCalle: 'test',
        tercerosRelacionadosNumeroExterior: 'test',
        tercerosRelacionadosNumeroInterior: 'test',
        tercerosRelacionadosLada: 'test',
        tercerosRelacionadosTelefono: 'test',
        tercerosRelacionadosCorreoElectronico: 'test',
        scianTabla: [],
        datosPersonalesNombre: 'test',
        datosPersonalesPrimerApellido: 'test',
        datosPersonalesSegundoApellido: 'test',
        tercerosRelacionadosMunicipio: 'test',
        tercerosRelacionadosLocalidad: 'test',
        tercerosRelacionadosColonia: 'test',
        manifiestos: true
      };
      service.actualizarEstadoFormulario(fullState);
      setters.forEach((key) => {
        if (typeof storeMock[key] === 'function' && storeMock[key]._isMockFunction) {
          expect(storeMock[key]).toHaveBeenCalled();
        }
      });
    });

    const emptyState = {
      denominacionRazon: '',
      codigoPostal: '',
      estado: '',
      municipio: '',
      localidad: '',
      colonia: '',
      calleYNumero: '',
      correoElecronico: '',
      lada: '',
      telefono: '',
      claveScianModal: '',
      avisoDeFuncionamiento: '',
      clave: '',
      claveScian: '',
      descripcion: '',
      avisoCheckbox: false,
      licenciaSanitaria: '',
      regimen: '',
      regimenDestinara: '',
      aduana: '',
      numeroPermiso: '',
      losDatosNo: '',
      nombreORazon: '',
      clasificacion: '',
      especificarClasificacionProducto: '',
      denominacionEspecifica: '',
      denominacionDistintiva: '',
      denominacionComun: '',
      tipoDeProducto: '',
      especifique: '',
      estadoFisico: '',
      fraccionArancelaria: '',
      descripcionFraccion: '',
      cantidadUMT: '',
      UMT: '',
      cantidadUMC: '',
      UMC: '',
      presentacion: '',
      numeroRegistro: '',
      fechaCaducidad: '',
      cumplimiento: '',
      rfc: '',
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      dci: '',
      marcaComercialODenominacionDistintiva: '',
      descripcionDeLaFraccion: '',
      numeroCas: '',
      cantidadDeLotes: '',
      kgOrPorLote: '',
      pais: '',
      paisDeProcedencia: '',
      detallarUso: '',
      numeroDePiezas: '',
      descripcionDelNumeroDePiezas: '',
      numeroDeRegistro: '',
      claveDeReferencia: '',
      cadenaDaLaDependencia: '',
      banco: '',
      laveDePago: '',
      fechaDePago: '',
      importeDePago: '',
      tipoDocumento: '',
      tercerosRelacionadosDenominacionSocial: '',
      tercerosRelacionadosTerceroNombre: '',
      tercerosNacionalidad: '',
      tipoPersona: '',
      tercerosRelacionadosRfc: '',
      tercerosRelacionadosCurp: '',
      tercerosRelacionadosRazonSocial: '',
      tercerosRelacionadosPais: '',
      tercerosRelacionadosEstado: '',
      tercerosRelacionadosCodigoPostal: '',
      tercerosRelacionadosCalle: '',
      tercerosRelacionadosNumeroExterior: '',
      tercerosRelacionadosNumeroInterior: '',
      tercerosRelacionadosLada: '',
      tercerosRelacionadosTelefono: '',
      tercerosRelacionadosCorreoElectronico: '',
      scianTabla: [],
      datosPersonalesNombre: '',
      datosPersonalesPrimerApellido: '',
      datosPersonalesSegundoApellido: '',
      tercerosRelacionadosMunicipio: '',
      tercerosRelacionadosLocalidad: '',
      tercerosRelacionadosColonia: '',
      manifiestos: false,
    };

    it('should call all store setters with empty data', () => {
      const setters = [
        'setDenominacionRazon', 'setCodigoPostal', 'setEstado', 'setMunicipio', 'setLocalidad', 'setColonia', 'setCalleYNumero', 'setCorreoElecronico',
        'setLada', 'setTelefono', 'setClaveScianModal', 'setAvisoDeFuncionamiento', 'setClaveScian', 'setDescripcion', 'setAvisoCheckbox', 'setLicenciaSanitaria',
        'setRegimen', 'setRegimenDestinara', 'setAduanasEntradas', 'setNumeroPermiso', 'setLosDatosNo', 'setNombreORazon', 'setClasificacion', 'setClave',
        'setEspecificarClasificacionProducto', 'setDenominacionEspecifica', 'setDenominacionDistintiva', 'setDenominacionComun', 'setTipoDeProducto', 'setEspecifique',
        'setEstadoFisico', 'setFraccionArancelaria', 'setDescripcionFraccion', 'setCantidadUMT', 'setUMT', 'setCantidadUMC', 'setUMC', 'setPresentacion',
        'setNumeroRegistro', 'setFechaCaducidad', 'setCumplimiento', 'setRfc', 'setNombre', 'setApellidoPaterno', 'setApellidoMaterno', 'setDci',
        'setMarcaComercialODenominacionDistintiva', 'setDescripcionDeLaFraccion', 'setNumeroCas', 'setCantidadDeLotes', 'setKgOrPorLote', 'setPais',
        'setPaisDeProcedencia', 'setDetallarUso', 'setNumeroDePiezas', 'setDescripcionDelNumeroDePiezas', 'setNumeroDeRegistro', 'setClaveDeReferencia',
        'setCadenaDaLaDependencia', 'setBanco', 'setLaveDePago', 'setFechaDePago', 'setImporteDePago', 'setTipoDocumento', 'setTercerosRelacionadosDenominacionSocial',
        'setTercerosRelacionadosTerceroNombre', 'setTercerosNacionalidad', 'setTipoPersona', 'setTercerosRelacionadosRfc', 'setTercerosRelacionadosCurp',
        'setTercerosRelacionadosRazonSocial', 'setTercerosRelacionadosPais', 'setTercerosRelacionadosEstado', 'setTercerosRelacionadosCodigoPostal',
        'setTercerosRelacionadosCalle', 'setTercerosRelacionadosNumeroExterior', 'setTercerosRelacionadosNumeroInterior', 'setTercerosRelacionadosLada',
        'setTercerosRelacionadosTelefono', 'setTercerosRelacionadosCorreoElectronico', 'setManifiestos'
      ];
      service.actualizarEstadoFormulario(emptyState);
      setters.forEach((key) => {
        if (typeof storeMock[key] === 'function' && storeMock[key]._isMockFunction) {
          expect(storeMock[key]).toHaveBeenCalled();
        }
      });
    });

    it('should call all store setters with partial data', () => {
      const partialState = {
        ...emptyState,
        denominacionRazon: 'partial',
        rfc: 'partial',
      };
      service.actualizarEstadoFormulario(partialState);
      expect(storeMock.setDenominacionRazon).toHaveBeenCalledWith('partial');
      expect(storeMock.setRfc).toHaveBeenCalledWith('partial');
    });
  });
  describe('actualizarEstadoFormulario - Complete 100% Coverage', () => {    
    it('should call all store setters with complete state data', () => {
      const completeState: any = {
        denominacionRazon: 'Test Company',
        codigoPostal: '12345', 
        estado: 'CDMX',
        municipio: 'Test Municipality',
        localidad: 'Test Locality',
        colonia: 'Test Colony',
        calleYNumero: 'Test Street 123',
        correoElecronico: 'test@example.com',
        lada: '55',
        telefono: '5555555555',
        claveScianModal: 'SCIAN123',
        avisoDeFuncionamiento: 'Yes',
        clave: 'CLAVE123',
        claveScian: 'SCIAN456',
        descripcion: 'Test Description',
        avisoCheckbox: true,
        licenciaSanitaria: 'LS123',
        regimen: 'Test Regimen',
        regimenDestinara: 'Destination Regimen',
        aduana: 'Test Customs',
        numeroPermiso: 'PERMIT123',
        manifiestos: 'Test Manifests',
        losDatosNo: 'No Data',
        nombreORazon: 'Test Name or Reason',
        clasificacion: 'Test Classification',
        especificarClasificacionProducto: 'Product Classification Details',
        denominacionEspecifica: 'Specific Denomination',
        denominacionDistintiva: 'Distinctive Denomination',
        denominacionComun: 'Common Denomination',
        tipoDeProducto: 'Product Type',
        especifique: 'Specify Details',
        estadoFisico: 'Physical State',
        fraccionArancelaria: '1234.56.78',
        descripcionFraccion: 'Fraction Description',
        cantidadUMT: '100',
        UMT: 'KG',
        cantidadUMC: '50', 
        UMC: 'L',
        presentacion: 'Box Presentation',
        numeroRegistro: 'REG123',
        fechaCaducidad: '2025-12-31',
        cumplimiento: 'Compliance Details',
        rfc: 'RFC123456789',
        nombre: 'John',
        apellidoPaterno: 'Doe',
        apellidoMaterno: 'Smith',
        dci: 'DCI123',
        marcaComercialODenominacionDistintiva: 'Brand Name',
        descripcionDeLaFraccion: 'Detailed Fraction Description',
        numeroCas: 'CAS123456',
        cantidadDeLotes: '10',
        kgOrPorLote: '100KG per lot',
        pais: 'Mexico',
        paisDeProcedencia: 'USA',
        detallarUso: 'Detailed Usage',
        numeroDePiezas: '20',
        descripcionDelNumeroDePiezas: '20 pieces',
        numeroDeRegistro: 'REGISTRO123',
        claveDeReferencia: 'REF123',
        cadenaDaLaDependencia: 'Dependency Chain',
        banco: 'Test Bank',
        laveDePago: 'PAY123',
        fechaDePago: '2025-06-30',
        importeDePago: '5000.00',
        tipoDocumento: 'Document Type',
        tercerosRelacionadosDenominacionSocial: 'Third Party Social',
        tercerosRelacionadosTerceroNombre: 'Third Party Name',
        tercerosNacionalidad: 'Mexican',
        tipoPersona: 'Moral',
        tercerosRelacionadosRfc: 'THIRD123',
        tercerosRelacionadosCurp: 'CURP123',
        tercerosRelacionadosRazonSocial: 'Social Reason',
        tercerosRelacionadosPais: 'Mexico',
        tercerosRelacionadosEstado: 'State',
        tercerosRelacionadosCodigoPostal: '54321',
        tercerosRelacionadosCalle: 'Third Party Street',
        tercerosRelacionadosNumeroExterior: '456',
        tercerosRelacionadosNumeroInterior: 'B',
        tercerosRelacionadosLada: '33',
        tercerosRelacionadosTelefono: '3333333333',
        tercerosRelacionadosCorreoElectronico: 'third@example.com'
      };
      
      service.actualizarEstadoFormulario(completeState);
      
      expect(storeMock.setDenominacionRazon).toHaveBeenCalledWith('Test Company');
      expect(storeMock.setCodigoPostal).toHaveBeenCalledWith('12345');
      expect(storeMock.setEstado).toHaveBeenCalledWith('CDMX');
      expect(storeMock.setMunicipio).toHaveBeenCalledWith('Test Municipality');
      expect(storeMock.setLocalidad).toHaveBeenCalledWith('Test Locality');
      expect(storeMock.setColonia).toHaveBeenCalledWith('Test Colony');
      expect(storeMock.setCalleYNumero).toHaveBeenCalledWith('Test Street 123');
      expect(storeMock.setCorreoElecronico).toHaveBeenCalledWith('test@example.com');
      expect(storeMock.setLada).toHaveBeenCalledWith('55');
      expect(storeMock.setTelefono).toHaveBeenCalledWith('5555555555');
      expect(storeMock.setClaveScianModal).toHaveBeenCalledWith('SCIAN123');
      expect(storeMock.setAvisoDeFuncionamiento).toHaveBeenCalledWith('Yes');
      expect(storeMock.setClave).toHaveBeenCalledWith('CLAVE123');
      expect(storeMock.setDescripcion).toHaveBeenCalledWith('Test Description');
      expect(storeMock.setAvisoCheckbox).toHaveBeenCalledWith(true);
      expect(storeMock.setLicenciaSanitaria).toHaveBeenCalledWith('LS123');
      expect(storeMock.setRegimen).toHaveBeenCalledWith('Test Regimen');
      expect(storeMock.setRegimenDestinara).toHaveBeenCalledWith('Destination Regimen');
      expect(storeMock.setAduanasEntradas).toHaveBeenCalledWith('Test Customs');
      expect(storeMock.setNumeroPermiso).toHaveBeenCalledWith('PERMIT123');
      expect(storeMock.setManifiestos).toHaveBeenCalledWith('Test Manifests');
      expect(storeMock.setLosDatosNo).toHaveBeenCalledWith('No Data');
      expect(storeMock.setNombreORazon).toHaveBeenCalledWith('Test Name or Reason');
      expect(storeMock.setClasificacion).toHaveBeenCalledWith('Test Classification');
      expect(storeMock.setEspecificarClasificacionProducto).toHaveBeenCalledWith('Product Classification Details');
      expect(storeMock.setDenominacionEspecifica).toHaveBeenCalledWith('Specific Denomination');
      expect(storeMock.setDenominacionDistintiva).toHaveBeenCalledWith('Distinctive Denomination');
      expect(storeMock.setDenominacionComun).toHaveBeenCalledWith('Common Denomination');
      expect(storeMock.setTipoDeProducto).toHaveBeenCalledWith('Product Type');
      expect(storeMock.setEspecifique).toHaveBeenCalledWith('Specify Details');
      expect(storeMock.setEstadoFisico).toHaveBeenCalledWith('Physical State');
      expect(storeMock.setFraccionArancelaria).toHaveBeenCalledWith('1234.56.78');
      expect(storeMock.setDescripcionFraccion).toHaveBeenCalledWith('Fraction Description');
      expect(storeMock.setCantidadUMT).toHaveBeenCalledWith('100');
      expect(storeMock.setUMT).toHaveBeenCalledWith('KG');
      expect(storeMock.setCantidadUMC).toHaveBeenCalledWith('50');
      expect(storeMock.setUMC).toHaveBeenCalledWith('L');
      expect(storeMock.setPresentacion).toHaveBeenCalledWith('Box Presentation');
      expect(storeMock.setNumeroRegistro).toHaveBeenCalledWith('REG123');
      expect(storeMock.setFechaCaducidad).toHaveBeenCalledWith('2025-12-31');
      expect(storeMock.setCumplimiento).toHaveBeenCalledWith('Compliance Details');
      expect(storeMock.setRfc).toHaveBeenCalledWith('RFC123456789');
      expect(storeMock.setNombre).toHaveBeenCalledWith('John');
      expect(storeMock.setApellidoPaterno).toHaveBeenCalledWith('Doe');
      expect(storeMock.setApellidoMaterno).toHaveBeenCalledWith('Smith');
      expect(storeMock.setDci).toHaveBeenCalledWith('DCI123');
      expect(storeMock.setMarcaComercialODenominacionDistintiva).toHaveBeenCalledWith('Brand Name');
      expect(storeMock.setDescripcionDeLaFraccion).toHaveBeenCalledWith('Detailed Fraction Description');
      expect(storeMock.setNumeroCas).toHaveBeenCalledWith('CAS123456');
      expect(storeMock.setCantidadDeLotes).toHaveBeenCalledWith('10');
      expect(storeMock.setKgOrPorLote).toHaveBeenCalledWith('100KG per lot');
      expect(storeMock.setPais).toHaveBeenCalledWith('Mexico');
      expect(storeMock.setPaisDeProcedencia).toHaveBeenCalledWith('USA');
      expect(storeMock.setDetallarUso).toHaveBeenCalledWith('Detailed Usage');
      expect(storeMock.setNumeroDePiezas).toHaveBeenCalledWith('20');
      expect(storeMock.setDescripcionDelNumeroDePiezas).toHaveBeenCalledWith('20 pieces');
      expect(storeMock.setNumeroDeRegistro).toHaveBeenCalledWith('REGISTRO123');
      expect(storeMock.setClaveDeReferencia).toHaveBeenCalledWith('REF123');
      expect(storeMock.setCadenaDaLaDependencia).toHaveBeenCalledWith('Dependency Chain');
      expect(storeMock.setBanco).toHaveBeenCalledWith('Test Bank');
      expect(storeMock.setLaveDePago).toHaveBeenCalledWith('PAY123');
      expect(storeMock.setFechaDePago).toHaveBeenCalledWith('2025-06-30');
      expect(storeMock.setImporteDePago).toHaveBeenCalledWith('5000.00');
      expect(storeMock.setTipoDocumento).toHaveBeenCalledWith('Document Type');
      expect(storeMock.setTercerosRelacionadosDenominacionSocial).toHaveBeenCalledWith('Third Party Social');
      expect(storeMock.setTercerosRelacionadosTerceroNombre).toHaveBeenCalledWith('Third Party Name');
      expect(storeMock.setTercerosNacionalidad).toHaveBeenCalledWith('Mexican');
      expect(storeMock.setTipoPersona).toHaveBeenCalledWith('Moral');
      expect(storeMock.setTercerosRelacionadosRfc).toHaveBeenCalledWith('THIRD123');
      expect(storeMock.setTercerosRelacionadosCurp).toHaveBeenCalledWith('CURP123');
      expect(storeMock.setTercerosRelacionadosRazonSocial).toHaveBeenCalledWith('Social Reason');
      expect(storeMock.setTercerosRelacionadosPais).toHaveBeenCalledWith('Mexico');
      expect(storeMock.setTercerosRelacionadosEstado).toHaveBeenCalledWith('State');
      expect(storeMock.setTercerosRelacionadosCodigoPostal).toHaveBeenCalledWith('54321');
      expect(storeMock.setTercerosRelacionadosCalle).toHaveBeenCalledWith('Third Party Street');
      expect(storeMock.setTercerosRelacionadosNumeroExterior).toHaveBeenCalledWith('456');
      expect(storeMock.setTercerosRelacionadosNumeroInterior).toHaveBeenCalledWith('B');
      expect(storeMock.setTercerosRelacionadosLada).toHaveBeenCalledWith('33');
      expect(storeMock.setTercerosRelacionadosTelefono).toHaveBeenCalledWith('3333333333');
      expect(storeMock.setTercerosRelacionadosCorreoElectronico).toHaveBeenCalledWith('third@example.com');
    });

    it('should handle edge cases and null/undefined values', () => {
      const edgeCaseState: any = {
        denominacionRazon: '',
        codigoPostal: null,
        estado: undefined,
        municipio: 0,
        localidad: false,
        colonia: [],
        calleYNumero: {},
        correoElecronico: '',
        lada: null,
        telefono: undefined,
        claveScianModal: '',
        avisoDeFuncionamiento: null,
        clave: undefined,
        claveScian: '',
        descripcion: null,
        avisoCheckbox: false,
        licenciaSanitaria: undefined,
        regimen: '',
        regimenDestinara: null,
        aduana: undefined,
        numeroPermiso: '',
        manifiestos: null,  
        losDatosNo: undefined,
        nombreORazon: '',
        clasificacion: null,
        especificarClasificacionProducto: undefined,
        denominacionEspecifica: '',
        denominacionDistintiva: null,
        denominacionComun: undefined,
        tipoDeProducto: '',
        especifique: null,
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
        tercerosRelacionadosCorreoElectronico: ''
      };
      
      expect(() => service.actualizarEstadoFormulario(edgeCaseState)).not.toThrow();
      expect(storeMock.setDenominacionRazon).toHaveBeenCalledWith('');
      expect(storeMock.setCodigoPostal).toHaveBeenCalledWith(null);
      expect(storeMock.setEstado).toHaveBeenCalledWith(undefined);
      expect(storeMock.setMunicipio).toHaveBeenCalledWith(0);
      expect(storeMock.setLocalidad).toHaveBeenCalledWith(false);
      expect(storeMock.setColonia).toHaveBeenCalledWith([]);
      expect(storeMock.setCalleYNumero).toHaveBeenCalledWith({});
      expect(storeMock.setAvisoCheckbox).toHaveBeenCalledWith(false);
    });

    it('should handle minimal state object', () => {
      const minimalState: any = {
        denominacionRazon: 'Minimal'
      };
      
      expect(() => service.actualizarEstadoFormulario(minimalState)).not.toThrow();
      expect(storeMock.setDenominacionRazon).toHaveBeenCalledWith('Minimal');
    });
  });
});
