import { Tramite260302Query } from './tramite260302.query';
import { Tramite260302Store } from '../../estados/stores/tramite260302.store';
import { of } from 'rxjs';
import { Solicitud260302State } from '../../estados/stores/tramite260302.store';

describe('Tramite260302Query', () => {
	let store: Tramite260302Store;
	let query: Tramite260302Query;
	let mockState: any;

	beforeEach(() => {
		mockState = {
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
		store = {
			_select: jest.fn((fn) => {
				if (typeof fn === 'function') {
					return of(fn(mockState));
				}
				return of(mockState);
			}),
		} as any;
		query = new Tramite260302Query(store);
	});

	describe('Query initialization', () => {
		it('should be created successfully', () => {
			expect(query).toBeTruthy();
			expect(query).toBeInstanceOf(Tramite260302Query);
		});

		it('should have store dependency injected', () => {
			expect((query as any).store).toBe(store);
		});
	});

	describe('selectSolicitud$ observable', () => {
		it('should return the complete state', (done) => {
			query.selectSolicitud$.subscribe(result => {
				expect(result).toEqual(mockState);
				done();
			});
		});

		it('should call store.select with correct selector function', () => {
			query.selectSolicitud$.subscribe();
			expect(store._select).toHaveBeenCalled();
		});

		it('should handle empty state', (done) => {
			mockState = {};
			store._select = jest.fn((fn) => {
				if (typeof fn === 'function') {
					return of(fn(mockState));
				}
				return of(mockState);
			});
			const newQuery = new Tramite260302Query(store);
			newQuery.selectSolicitud$.subscribe(result => {
				expect(result).toEqual({});
				done();
			});
		});

		it('should handle null state', (done) => {
			mockState = null;
			store._select = jest.fn((fn) => {
				if (typeof fn === 'function') {
					return of(fn(mockState));
				}
				return of(mockState);
			});
			const newQuery = new Tramite260302Query(store);
			newQuery.selectSolicitud$.subscribe(result => {
				expect(result).toBe(null);
				done();
			});
		});
	});

	describe('Query behavior with different states', () => {
		it('should handle state with all properties populated', (done) => {
			const fullState = {
				denominacionRazon: 'Full Company',
				codigoPostal: '54321',
				estado: 'Full State',
				municipio: 'Full Municipality',
				localidad: 'Full Locality',
				colonia: 'Full Colony',
				calleYNumero: 'Full Street',
				correoElecronico: 'full@test.com',
				lada: '55',
				telefono: '1234567890',
				avisoCheckbox: true,
				manifiestos: true,
				scianTabla: [],
				pagoDerechos: null,
				claveScianModal: null,
				avisoDeFuncionamiento: null,
				claveScian: null,
			} as unknown as Solicitud260302State;

			store._select = jest.fn((fn) => of(fn(fullState)));
			const newQuery = new Tramite260302Query(store);
			newQuery.selectSolicitud$.subscribe(result => {
				expect(result).toEqual(fullState);
				done();
			});
		});

		it('should handle state updates reactively', (done) => {
			const { Subject } = require('rxjs');
			const stateSubject = new Subject();
			const firstState: Solicitud260302State = {
				idSolicitud: 1,
				denominacionRazon: 'first',
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
				fechaCaducidad: '31-12-2025',
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
			const updatedState = { ...firstState, denominacionRazon: 'updated' };
			store._select = jest.fn(() => stateSubject.asObservable());
			const newQuery = new Tramite260302Query(store);
			let emissionCount = 0;
			newQuery.selectSolicitud$.subscribe(result => {
				emissionCount++;
				if (emissionCount === 1) {
					expect(result.denominacionRazon).toBe('first');
					stateSubject.next(updatedState);
				} else if (emissionCount === 2) {
					expect(result.denominacionRazon).toBe('updated');
					done();
				}
			});
			stateSubject.next(firstState);
		});
	});
});
