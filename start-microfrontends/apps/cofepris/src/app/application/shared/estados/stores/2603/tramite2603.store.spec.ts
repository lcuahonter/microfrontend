import { Solicitud2603State, Tramite2603Store, createInitialState } from './tramite2603.store';

describe('Tramite2603Store', () => {
  let store: Tramite2603Store;

  beforeEach(() => {
    store = new Tramite2603Store();
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
    });
  });

  describe('Store methods', () => {
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

    it('should update municipio via setMuncipio', () => {
      store.setMuncipio('TestMunicipio');
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

    it('should update calle via setCalle', () => {
      store.setCalle('TestCalle');
      expect(store.getValue().calleYNumero).toBe('TestCalle');
    });

    it('should update correo via setCorreo', () => {
      store.setCorreo('test@email.com');
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

    it('should update claveScianModal', () => {
      store.setClaveScianModal('SCIAN123');
      expect(store.getValue().claveScianModal).toBe('SCIAN123');
    });

    it('should update claveScian via setClaveDescripcionModal', () => {
      store.setClaveDescripcionModal('CLAVE123');
      expect(store.getValue().claveScian).toBe('CLAVE123');
    });

    it('should update avisoCheckbox', () => {
      store.setAvisoCheckbox(true);
      expect(store.getValue().avisoCheckbox).toBe(true);
    });

    it('should update licenciaSanitaria', () => {
      store.setLicenciaSanitaria('LIC123');
      expect(store.getValue().licenciaSanitaria).toBe('LIC123');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      store.setDenominacionRazon('');
      expect(store.getValue().denominacionRazon).toBe('');
    });

    it('should handle null values', () => {
      store.setEstado(null as any);
      expect(store.getValue().estado).toBe(null);
    });

    it('should handle undefined values', () => {
      store.setCodigoPostal(undefined as any);
      expect(store.getValue().codigoPostal).toBe(undefined);
    });
  });
});

describe('Solicitud2603State interface', () => {
	it('should create a valid state object', () => {
		const state: Solicitud2603State = {
			denominacionRazon: 'Test',
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
			especifique: 'Especifique',
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
		expect(state.avisoCheckbox).toBe(true);
	});
});
