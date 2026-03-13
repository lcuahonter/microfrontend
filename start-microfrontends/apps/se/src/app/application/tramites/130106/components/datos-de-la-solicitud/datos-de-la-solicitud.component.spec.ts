import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { Tramite130106Store } from '../../../../estados/tramites/tramite130106.store';
import { Tramite130106Query } from '../../../../estados/queries/tramite130106.query';
import { Solocitud130106Service } from '../../service/service130106.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosDeLaSolicitudComponent', () => {
	let component: DatosDeLaSolicitudComponent;
	let store: Tramite130106Store;
	let query: Tramite130106Query;
	let service: Solocitud130106Service;
	let consultaioQuery: ConsultaioQuery;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, HttpClientTestingModule],
			providers: [FormBuilder, Tramite130106Store, Tramite130106Query, Solocitud130106Service, ConsultaioQuery]
		});
		store = TestBed.inject(Tramite130106Store);
		query = TestBed.inject(Tramite130106Query);
		service = TestBed.inject(Solocitud130106Service);
		consultaioQuery = TestBed.inject(ConsultaioQuery);
		component = new DatosDeLaSolicitudComponent(
			TestBed.inject(FormBuilder),
			store,
			query,
			service,
			consultaioQuery
		);
		component['seccionState'] = {} as any;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize forms', () => {
		component.inicializarFormularios();
		expect(component.formDelTramite).toBeTruthy();
		expect(component.mercanciaForm).toBeTruthy();
		expect(component.partidasDelaMercanciaForm).toBeTruthy();
		expect(component.modificarPartidasDelaMercanciaForm).toBeTruthy();
		expect(component.paisForm).toBeTruthy();
		expect(component.frmRepresentacionForm).toBeTruthy();
	});

	it('should call guardarDatosFormulario', () => {
		const spy = jest.spyOn(component, 'inicializarFormularios');
		component.guardarDatosFormulario();
		expect(spy).toHaveBeenCalled();
	});

	it('should call suscribirseAEstadoDeSolicitud', () => {
		const spy = jest.spyOn(component['tramite130106Query'].selectSolicitud$, 'pipe').mockReturnValue({ subscribe: jest.fn() } as any);
		component.suscribirseAEstadoDeSolicitud();
		expect(spy).toHaveBeenCalled();
	});

	it('should call formularioTotalCount', () => {
		component.formularioTotalCount('1', '2');
		expect(component.formForTotalCount).toBeTruthy();
	});

	it('should call opcionesDeBusqueda', () => {
		jest.spyOn(component['solocitud130106Service'], 'getSolicitudeOptions').mockReturnValue(of({ options: [{ value: 'A', label: 'A' }], defaultSelect: 'A', defaultProducto: 'A' }));
		jest.spyOn(component['solocitud130106Service'], 'getProductoOptions').mockReturnValue(of({ options: [{ value: 'B', label: 'B' }], defaultSelect: 'B', defaultProducto: 'B' }));
		component.opcionesDeBusqueda();
		expect(component.opcionesSolicitud.length).toBeGreaterThan(0);
		expect(component.productoOpciones.length).toBeGreaterThan(0);
	});

	it('should handle manejarlaFilaSeleccionada', () => {
		component.manejarlaFilaSeleccionada([{ id: '1' } as any]);
		expect(component.filaSeleccionada.length).toBe(1);
	});

	it('should handle onModificarPartidaSeleccionada', () => {
		component.modificarPartidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
			cantidadPartidasDeLaMercancia: [''],
			descripcionPartidasDeLaMercancia: [''],
			valorPartidaUSDPartidasDeLaMercancia: ['']
		});
		component.onModificarPartidaSeleccionada({ cantidad: '1', descripcion: 'desc', totalUSD: '2' } as any);
		expect(component.modificarPartidasDelaMercanciaForm.value.cantidadPartidasDeLaMercancia).toBe('1');
	});

	it('should handle onPartidaModificada', () => {
		component.tableBodyData = [{ id: '1', cantidad: '1', totalUSD: '2' } as any];
		component.onPartidaModificada({ id: '1', cantidad: '2', totalUSD: '3' } as any);
		expect(component.tableBodyData[0].cantidad).toBe('2');
	});

	it('should calculate importe unitario', () => {
		expect(component.calcularImporteUnitario('2', '6')).toBe('3.000');
		expect(component.calcularImporteUnitario('0', '6')).toBe('0');
	});

	it('should validate and send form', () => {
		component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({
			cantidadPartidasDeLaMercancia: ['1'],
			valorPartidaUSDPartidasDeLaMercancia: ['1'],
			descripcionPartidasDeLaMercancia: ['desc']
		});
		component['seccionState'] = { cantidadPartidasDeLaMercancia: '1', valorPartidaUSDPartidasDeLaMercancia: '1', fraccion: '1', descripcion: 'desc' } as any;
		component.unidadCatalogo = [{ clave: '1', descripcion: 'desc' } as any];
		component.tableBodyData = [];
		component.mercanciaForm = TestBed.inject(FormBuilder).group({ fraccion: ['1'] });
		component.formForTotalCount = TestBed.inject(FormBuilder).group({ cantidadTotal: [''], valorTotalUSD: [''] });
		component.validarYEnviarFormulario();
		expect(component.tableBodyData.length).toBeGreaterThan(0);
	});

	it('should handle navegarParaModificarPartida', () => {
		component.filaSeleccionada = [{ id: '1' } as any];
		component.navegarParaModificarPartida();
		expect(component.filaSeleccionada.length).toBe(1);
	});

	it('should fetchEntidadFederativa', () => {
		jest.spyOn(component['solocitud130106Service'], 'getEntidadFederativa').mockReturnValue(of([{ clave: '1', id: 1, descripcion: 'desc' }]));
		component.fetchEntidadFederativa();
		expect(component.entidadFederativa.length).toBeGreaterThan(0);
	});

	it('should fetchRepresentacionFederal', () => {
		jest.spyOn(component['solocitud130106Service'], 'getRepresentacionFederal').mockReturnValue(of([{ clave: '1', id: 1, descripcion: 'desc' }]));
		component.fetchRepresentacionFederal();
		expect(component.representacionFederal.length).toBeGreaterThan(0);
	});

	it('should listaDePaisesDisponibles', () => {
		jest.spyOn(component['solocitud130106Service'], 'getBloque').mockReturnValue(of([{ id: 1, clave: '1', descripcion: 'A' }]));
		component.listaDePaisesDisponibles();
		expect(component.elementosDeBloque.length).toBeGreaterThan(0);
	});

	it('should fetchPaisesPorBloque', () => {
		jest.spyOn(component['solocitud130106Service'], 'getPaisesPorBloque').mockReturnValue(of([{ id: 1, clave: '1', descripcion: 'A' }]));
		component.fetchPaisesPorBloque(1);
		expect(component.paisesPorBloque.length).toBeGreaterThan(0);
	});

	it('should enCambioDeBloque', () => {
		jest.spyOn(component, 'fetchPaisesPorBloque');
		component.enCambioDeBloque(1);
		expect(component.fetchPaisesPorBloque).toHaveBeenCalledWith(1);
	});

	it('should setValoresStore', () => {
		component.formDelTramite = TestBed.inject(FormBuilder).group({ regimen: [''], clasificacion: [''] });
		component.mercanciaForm = TestBed.inject(FormBuilder).group({ unidadMedida: [''], fraccion: ['1'] });
		component.setValoresStore({ form: component.formDelTramite, campo: 'regimen' });
		component.setValoresStore({ form: component.formDelTramite, campo: 'clasificacion' });
		component.setValoresStore({ form: component.mercanciaForm, campo: 'fraccion' });
		expect(component.formDelTramite.get('clasificacion')?.value).toBe('');
	});

	it('should disable modificar', () => {
		component.filaSeleccionada = [];
		expect(component.disabledModificar()).toBe(true);
		component.filaSeleccionada = [{ id: '1' } as any];
		expect(component.disabledModificar()).toBe(false);
	});

	it('should validateNumeroTresDecimales', () => {
		const control = { value: '1.123' } as any;
		expect(DatosDeLaSolicitudComponent.validarNumeroTresDecimales(control)).toBeNull();
		expect(DatosDeLaSolicitudComponent.validarNumeroTresDecimales({ value: 'abc' } as any)).toEqual({ noEsNumero: true });
	});

	it('should validarSinCaracterAnguloDerecho', () => {
		expect(DatosDeLaSolicitudComponent.validarSinCaracterAnguloDerecho({ value: 'test' } as any)).toBeNull();
		expect(DatosDeLaSolicitudComponent.validarSinCaracterAnguloDerecho({ value: '›' } as any)).toEqual({ validarSinCaracterAnguloDerecho: true });
	});

	it('should validarCatorceEnterosTresDecimales', () => {
		expect(DatosDeLaSolicitudComponent.validarCatorceEnterosTresDecimales({ value: '12345678901234.123' } as any)).toBeNull();
		expect(DatosDeLaSolicitudComponent.validarCatorceEnterosTresDecimales({ value: 'abc' } as any)).toEqual({ noEsNumero: true });
	});

	it('should validarYCargarArchivo', () => {
		component.mercanciaForm = TestBed.inject(FormBuilder).group({ cantidad: ['1'], valorFacturaUSD: ['1'], fraccion: ['1'] });
		component.partidasDelaMercanciaForm = TestBed.inject(FormBuilder).group({ cantidadPartidasDeLaMercancia: ['1'], valorPartidaUSDPartidasDeLaMercancia: ['1'], descripcionPartidasDeLaMercancia: ['desc'] });
		component.formForTotalCount = TestBed.inject(FormBuilder).group({ cantidadTotal: [''], valorTotalUSD: [''] });
		component.partidasDeLaMercanciaComponent = { abrirCargarArchivoModalReal: jest.fn() } as any;
		component.validarYCargarArchivo();
		expect(component.mostrarErroresMercancia).toBe(false);
	});

	it('should handle onPartidasEliminadas', () => {
		component.tableBodyData = [{ id: '1', cantidad: '1', totalUSD: '2' } as any];
		component.onPartidasEliminadas(['1']);
		expect(component.tableBodyData.length).toBe(0);
	});

	it('should getRegimenes', () => {
		jest.spyOn(component['solocitud130106Service'], 'getRegimenes').mockReturnValue(of([{ clave: '1', id: 1, descripcion: 'desc' }]));
		jest.spyOn(component, 'getClasificacionRegimen');
		component.getRegimenes();
		expect(component.catalogoRegimenes.length).toBeGreaterThan(0);
		expect(component.getClasificacionRegimen).toHaveBeenCalled();
	});

	it('should getClasificacionRegimen', () => {
		jest.spyOn(component['solocitud130106Service'], 'getClasificacionRegimen').mockReturnValue(of([{ clave: '1', id: 1, descripcion: 'desc' }]));
		component.catalogoRegimenes = [{ clave: '1' } as any];
		component.getClasificacionRegimen();
		expect(component.catalogoClasificacionRegimen.length).toBeGreaterThan(0);
	});

	it('should getFraccionArancelaria', () => {
		jest.spyOn(component['solocitud130106Service'], 'getFraccionesArancelarias').mockReturnValue(of([{ clave: '1', id: 1, descripcion: 'desc' }]));
		component.getFraccionArancelaria();
		expect(component.fraccionCatalogo.length).toBeGreaterThan(0);
	});

	it('should getUMTCatalogo', () => {
		jest.spyOn(component.solocitud130106Service, 'getUMTCatalogo').mockReturnValue(of([{ clave: '1', id: 1, descripcion: 'desc' }]));
		component.mercanciaForm = TestBed.inject(FormBuilder).group({ unidadMedida: [''] });
		component.getUMTCatalogo('1');
		expect(component.unidadCatalogo.length).toBeGreaterThan(0);
	});

	it('should call ngOnDestroy', () => {
		const spy = jest.spyOn(component.destroyed$, 'next');
		component.ngOnDestroy();
		expect(spy).toHaveBeenCalled();
	});
});
