import { TestBed } from '@angular/core/testing';
import { ValidarInicialmenteCertificadoService } from './validar-inicialmente-certificado.service';
import { HttpClient } from '@angular/common/http';
import { Tramite110222Store } from '../estados/tramite110222.store';
import { HttpCoreService } from '@ng-mf/data-access-user';
import { Tramite110222Query } from '../estados/tramite110222.query';
import { of, throwError } from 'rxjs';

describe('ValidarInicialmenteCertificadoService', () => {
	let service: ValidarInicialmenteCertificadoService;
	let http: any;
	let store: any;
	let httpService: any;
	let query: any;

	beforeEach(() => {
		http = { get: jest.fn() };
		store = { update: jest.fn() };
		httpService = { get: jest.fn(), post: jest.fn() };
		query = { selectTramite$: of('tramite') };
		TestBed.configureTestingModule({
			providers: [
				ValidarInicialmenteCertificadoService,
				{ provide: HttpClient, useValue: http },
				{ provide: Tramite110222Store, useValue: store },
				{ provide: HttpCoreService, useValue: httpService },
				{ provide: Tramite110222Query, useValue: query }
			]
		});
		service = TestBed.inject(ValidarInicialmenteCertificadoService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('getRegistroTomaMuestrasMercanciasData should call http.get', () => {
		http.get.mockReturnValue(of({ foo: 'bar' }));
		service.getRegistroTomaMuestrasMercanciasData().subscribe(res => {
			expect(res).toEqual({ foo: 'bar' });
		});
		expect(http.get).toHaveBeenCalledWith('assets/json/110222/datos-prefill.json');
	});

	it('actualizarEstadoFormulario should call store.update', () => {
		service.actualizarEstadoFormulario({ foo: 'bar' } as any);
		expect(store.update).toHaveBeenCalled();
	});

	it('getTipoFactura should call httpService.get', () => {
		httpService.get.mockReturnValue(of({ ok: true }));
		service.getTipoFactura().subscribe(res => {
			expect(res).toEqual({ ok: true });
		});
		expect(httpService.get).toHaveBeenCalled();
	});

	it('guardarDatosPost should call httpService.post', () => {
		httpService.post.mockReturnValue(of({ ok: true }));
		service.guardarDatosPost({ foo: 'bar' }).subscribe(res => {
			expect(res).toEqual({ ok: true });
		});
		expect(httpService.post).toHaveBeenCalled();
	});

	it('getAllState should return query.selectTramite$', () => {
		service.getAllState().subscribe(res => {
			expect(res).toBe('tramite');
		});
	});

	it('buscarMercanciasCert should call httpService.post', () => {
		httpService.post.mockReturnValue(of({ ok: true }));
		service.buscarMercanciasCert({ foo: 'bar' }).subscribe(res => {
			expect(res).toEqual({ ok: true });
		});
		expect(httpService.post).toHaveBeenCalled();
	});

// Removed duplicate/erroneous nested describe and it blocks, and duplicate imports.
			it('buscarMercanciasCert returns observable', (done) => {
				const mock = { ok: true };
				httpService.post.mockReturnValue(of(mock));
				service.buscarMercanciasCert({ a: 1 }).subscribe((res) => {
					expect(res).toEqual(mock);
					done();
				});
			});

			it('buildMercanciaSeleccionadas maps array', () => {
				const arr = [{ id: 1, fraccionArancelaria: 'a', nombreTecnico: 'b', nombreComercial: 'c', numeroDeRegistrodeProductos: 'd', fechaExpedicion: 'e', fechaVencimiento: 'f', tipoFactura: 'g', numFactura: 'h', complementoDescripcion: 'i', fechaFactura: 'j', cantidad: 'k', umc: 'l', unidadMedidaMasaBruta: 'm', valorMercancia: 'n' }];
				const res = service.buildMercanciaSeleccionadas(arr);
				expect(res.length).toBe(1);
				expect(res[0]).toHaveProperty('id', 1);
			});

			it('agregarProductores returns observable', (done) => {
				const mock = { ok: true };
				httpService.post.mockReturnValue(of(mock));
				service.agregarProductores({ rfc_solicitante: 'x' }).subscribe((res) => {
					expect(res).toEqual(mock);
					done();
				});
			});

			it('obtenerProductorPorExportador returns observable', (done) => {
				const mock = { ok: true };
				http.get.mockReturnValue(of(mock));
				service.obtenerProductorPorExportador('rfc').subscribe((res) => {
					expect(res).toEqual(mock);
					done();
				});
			});

			it('buildCertificado returns object', () => {
				const item: any = { formCertificado: {}, mercanciaTabla: [] };
				const res = service.buildCertificado(item);
				expect(res).toHaveProperty('tratado_acuerdo');
				expect(res).toHaveProperty('mercancias_seleccionadas');
			});

			it('buildDatosCertificado returns object', () => {
				const data: any = { formDatosCertificado: {} };
				const res = service.buildDatosCertificado(data);
				expect(res).toHaveProperty('observaciones');
			});

			it('obtenerCadenaOriginal returns observable', (done) => {
				http.post.mockReturnValue(of({ data: 'cadena' }));
				service.obtenerCadenaOriginal('1', { foo: 'bar' } as any).subscribe((res) => {
					expect(res).toEqual({ data: 'cadena' });
					done();
				});
			});

			it('obtenerCadenaOriginal handles error', (done) => {
				http.post.mockReturnValue(throwError(() => new Error('fail')));
				service.obtenerCadenaOriginal('1', { foo: 'bar' } as any).subscribe({
					error: (err) => {
						expect(err).toBeInstanceOf(Error);
						done();
					},
				});
			});

			it('reverseMapFormDatosCertificado returns mapped object', () => {
				const data = { datos_del_certificado: { observaciones: 'a', idioma: 1, precisa: 'b', presenta: 'c', representacion_federal: { entidad_federativa: 2, representacion_federal: 3 } } };
				const res = service.reverseMapFormDatosCertificado(data);
				expect(res).toHaveProperty('observacionesDates', 'a');
			});

			it('reverseMapFormCertificado returns mapped object', () => {
				const data = { certificado: { tratado_acuerdo: 'a', pais_bloque: 'b', fraccion_arancelaria: 'c', nombre_comercial: 'd', fecha_inicio: 'e', fecha_fin: 'f', registro_producto: 'g' } };
				const res = service.reverseMapFormCertificado(data);
				expect(res).toHaveProperty('entidadFederativa', 'a');
			});

			it('reverseMapMercanciaTabla returns mapped array', () => {
				const data = { certificado: { mercancias_seleccionadas: [{ id: 1, fraccion_arancelaria: 'a', nombre_Technico: 'b', nombre_comercial: 'c', registro_producto: 'd', fechaExpedicion: 'e', fechaVencimiento: 'f', tipo_factura: 'g', num_factura: 'h', complemento_descripcion: 'i', fecha_factura: 'j', cantidad: 'k', umc: 'l', unidad_medida: 'm', valor_mercancia: 'n' }] } };
				const res = service.reverseMapMercanciaTabla(data);
				expect(res.length).toBe(1);
				expect(res[0]).toHaveProperty('id', 1);
			});

			it('reverseMapFormDatosDelDestinatario returns mapped object', () => {
				const data = { destinatario: { nombre: 'a', primer_apellido: 'b', segundo_apellido: 'c', numero_registro_fiscal: 'd', razon_social: 'e' } };
				const res = service.reverseMapFormDatosDelDestinatario(data);
				expect(res).toHaveProperty('nombres', 'a');
			});

			it('reverseMapFormDestinatario returns mapped object', () => {
				const data = { destinatario: { domicilio: { ciudad_poblacion_estado_provincia: 'a', calle: 'b', numero_exterior: 'c', lada: 'd', telefono: 'e', fax: 'f', paisDestin: 'g', lugar: 'h' }, }, solicitante: { correo_electronico: 'i' } };
				const res = service.reverseMapFormDestinatario(data);
				expect(res).toHaveProperty('ciudad', 'a');
				expect(res).toHaveProperty('correoElectronico', 'i');
			});

			it('reverseMapMedioDeTransporte returns catalogo', () => {
				const data = { destinatario: { medio_transporte: 'clave' } };
				const res = service.reverseMapMedioDeTransporte(data);
				expect(res).toHaveProperty('clave', 'clave');
			});

			it('reverseMapRepresentanteLegalForm returns mapped object', () => {
				const data = { destinatario: { generalesRepresentanteLegal: { lugar: 'a', nombre: 'b', razonSocial: 'c', empresa: 'd', puesto: 'e', registroFiscal: 'f', telefono: 'g', correoElectronico: 'h', fax: 'i' } } };
				const res = service.reverseMapRepresentanteLegalForm(data);
				expect(res).toHaveProperty('lugar', 'a');
			});

			it('getMostrarSolicitud returns observable', (done) => {
				const mock = { ok: true };
				httpService.get.mockReturnValue(of(mock));
				service.getMostrarSolicitud('id').subscribe((res) => {
					expect(res).toEqual(mock);
					done();
				});
			});

			it('reverseBuildSolicitud110222 returns mapped object', () => {
				const built = {};
				const res = service.reverseBuildSolicitud110222(built);
				expect(res).toHaveProperty('formDatosCertificado');
				expect(res).toHaveProperty('formCertificado');
				expect(res).toHaveProperty('mercanciaTabla');
				expect(res).toHaveProperty('formDatosDelDestinatario');
				expect(res).toHaveProperty('formDestinatario');
				expect(res).toHaveProperty('representanteLegalForm');
			});
		});
