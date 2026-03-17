import { Solicitud260302State, Tramite260302Store, createInitialState } from './tramite260302.store';

describe('Tramite260302Store', () => {
  let store: Tramite260302Store;

  beforeEach(() => {
    store = new Tramite260302Store();
  });

  describe('Store initialization', () => {
    it('should create store with initial state', () => {
      expect(store).toBeTruthy();
      expect(store.getValue()).toEqual(createInitialState());
    });

    it('should have correct initial values', () => {
      const initialState = store.getValue();
      expect(initialState.denominacionRazon).toBe('');
      expect(initialState.avisoCheckbox).toBe(false);
      expect(initialState.scianTabla).toEqual([]);
      expect(initialState.manifiestos).toBe(false);
    });
  });

  describe('Store setter methods', () => {
    it('should update denominacionRazon', () => {
      store.setDenominacionRazon('Test Empresa');
      expect(store.getValue().denominacionRazon).toBe('Test Empresa');
    });

    it('should update codigoPostal', () => {
      store.setCodigoPostal('12345');
      expect(store.getValue().codigoPostal).toBe('12345');
    });

    it('should update estado', () => {
      store.setEstado('TestState');
      expect(store.getValue().estado).toBe('TestState');
    });

    it('should update municipio via setMunicipio', () => {
      store.setMunicipio('TestMunicipio');
      expect(store.getValue().municipio).toBe('TestMunicipio');
    });

    it('should update localidad', () => {
      store.setLocalidad('TestLocalidad');
      expect(store.getValue().localidad).toBe('TestLocalidad');
    });

    it('should update colonia', () => {
      store.setColonia('TestColonia');
      expect(store.getValue().colonia).toBe('TestColonia');
    });

    it('should update calleYNumero via setCalleYNumero', () => {
      store.setCalleYNumero('TestCalle');
      expect(store.getValue().calleYNumero).toBe('TestCalle');
    });

    it('should update correoElecronico via setCorreoElecronico', () => {
      store.setCorreoElecronico('test@email.com');
      expect(store.getValue().correoElecronico).toBe('test@email.com');
    });

    it('should update lada', () => {
      store.setLada('55');
      expect(store.getValue().lada).toBe('55');
    });

    it('should update telefono', () => {
      store.setTelefono('1234567890');
      expect(store.getValue().telefono).toBe('1234567890');
    });

    it('should update avisoCheckbox', () => {
      store.setAvisoCheckbox(true);
      expect(store.getValue().avisoCheckbox).toBe(true);
      store.setAvisoCheckbox(false);
      expect(store.getValue().avisoCheckbox).toBe(false);
    });

    it('should update manifiestos', () => {
      store.setManifiestos(true);
      expect(store.getValue().manifiestos).toBe(true);
      store.setManifiestos(false);
      expect(store.getValue().manifiestos).toBe(false);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle empty strings', () => {
      store.setDenominacionRazon('');
      expect(store.getValue().denominacionRazon).toBe('');
    });

    it('should handle null values gracefully', () => {
      store.setEstado(null as any);
      expect(store.getValue().estado).toBe(null);
    });

    it('should handle undefined values gracefully', () => {
      store.setCodigoPostal(undefined as any);
      expect(store.getValue().codigoPostal).toBe(undefined);
    });

    it('should handle special characters', () => {
      store.setCorreoElecronico('test@email.com');
      expect(store.getValue().correoElecronico).toBe('test@email.com');
    });
  });

  describe('Store state persistence', () => {
    it('should maintain state after multiple updates', () => {
      store.setDenominacionRazon('Empresa Test');
      store.setCodigoPostal('54321');
      store.setAvisoCheckbox(true);
      
      const state = store.getValue();
      expect(state.denominacionRazon).toBe('Empresa Test');
      expect(state.codigoPostal).toBe('54321');
      expect(state.avisoCheckbox).toBe(true);
    });
  });
});

describe('Solicitud260302State interface', () => {
	it('should create a valid state object', () => {
    const state: Solicitud260302State = {
      idSolicitud: 1,
      denominacionRazon: 'Test',
      pagoDerechos: {} as any,
      codigoPostal: '12345',
      estado: 'TestState',
      municipio: 'TestMunicipio',
      localidad: 'TestLocalidad',
      colonia: 'TestColonia',
      calleYNumero: 'TestCalle',
      correoElecronico: 'test@test.com',
      lada: '55',
      telefono: '1234567890',
      claveScianModal: 'SCIAN',
      avisoDeFuncionamiento: 'Yes',
      claveScian: 'SCIAN',
      descripcion: 'Desc',
      avisoCheckbox: true,
      licenciaSanitaria: 'Lic',
      regimen: 'Reg',
      regimenDestinara: 'Dest',
      aduana: 'Aduana',
      numeroPermiso: 'Permiso',
      losDatosNo: 'DatosNo',
      nombreORazon: 'NombreRazon',
      clasificacion: 'Clasificacion',
      clave: 'Clave',
      especificarClasificacionProducto: 'Especificar',
      denominacionEspecifica: 'DenomEspecifica',
      denominacionDistintiva: 'DenomDistintiva',
      denominacionComun: 'DenomComun',
      tipoDeProducto: 'TipoProducto',
      estadoFisico: 'Fisico',
      fraccionArancelaria: 'Fraccion',
      descripcionFraccion: 'DescFraccion',
      cantidadUMT: 'CantidadUMT',
      UMT: 'UMT',
      cantidadUMC: 'CantidadUMC',
      UMC: 'UMC',
      presentacion: 'Presentacion',
      numeroRegistro: 'NumRegistro',
      fechaCaducidad: '2025-12-31',
      cumplimiento: 'Cumplimiento',
      rfc: 'RFC',
      nombre: 'Nombre',
      apellidoPaterno: 'Paterno',
      apellidoMaterno: 'Materno',
      dci: 'DCI',
      marcaComercialODenominacionDistintiva: 'MarcaComercial',
      descripcionDeLaFraccion: 'DescFraccion',
      numeroCas: 'NumCas',
      cantidadDeLotes: 'Lotes',
      kgOrPorLote: 'KgPorLote',
      pais: 'Pais',
      paisDeProcedencia: 'PaisProcedencia',
      detallarUso: 'Uso',
      numeroDePiezas: 'NumPiezas',
      descripcionDelNumeroDePiezas: 'DescNumPiezas',
      numeroDeRegistro: 'NumRegistro2',
      claveDeReferencia: 'ClaveRef',
      cadenaDaLaDependencia: 'CadenaDep',
      banco: 'Banco',
      laveDePago: 'ClavePago',
      fechaDePago: '2025-11-20',
      importeDePago: '1000',
      tipoDocumento: 'Doc',
      tercerosRelacionadosDenominacionSocial: 'TerceroDenom',
      tercerosRelacionadosTerceroNombre: 'TerceroNombre',
      tercerosNacionalidad: 'Nacionalidad',
      tipoPersona: 'Fisica',
      tercerosRelacionadosRfc: 'TerceroRFC',
      tercerosRelacionadosCurp: 'TerceroCURP',
      tercerosRelacionadosRazonSocial: 'TerceroRazon',
      tercerosRelacionadosPais: 'TerceroPais',
      tercerosRelacionadosEstado: 'TerceroEstado',
      tercerosRelacionadosCodigoPostal: 'TerceroCP',
      tercerosRelacionadosCalle: 'TerceroCalle',
      tercerosRelacionadosNumeroExterior: 'TerceroNumExt',
      tercerosRelacionadosNumeroInterior: 'TerceroNumInt',
      tercerosRelacionadosLada: 'TerceroLada',
      tercerosRelacionadosTelefono: 'TerceroTel',
      tercerosRelacionadosCorreoElectronico: 'TerceroEmail',
      scianTabla: [],
      datosPersonalesNombre: 'DatosNombre',
      datosPersonalesPrimerApellido: 'DatosApellido1',
      datosPersonalesSegundoApellido: 'DatosApellido2',
      tercerosRelacionadosMunicipio: 'TerceroMunicipio',
      tercerosRelacionadosLocalidad: 'TerceroLocalidad',
      tercerosRelacionadosColonia: 'TerceroColonia',
      manifiestos: true,
    };
		expect(state.denominacionRazon).toBe('Test');
		expect(state.pagoDerechos).toBeDefined();
	});
});
