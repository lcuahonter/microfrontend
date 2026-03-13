import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { DatosComponent } from './datos.component';
import { Solocitud130106Service } from '../../service/service130106.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosComponent', () => {
	let component: DatosComponent;
	let solocitud130106Service: Solocitud130106Service;
	let consultaQuery: ConsultaioQuery;

	beforeEach(() => {
		TestBed.configureTestingModule({
      imports:[require('@angular/common/http/testing').HttpClientTestingModule],
			providers: [Solocitud130106Service, ConsultaioQuery]
		});
		solocitud130106Service = TestBed.inject(Solocitud130106Service);
		consultaQuery = TestBed.inject(ConsultaioQuery);
		component = new DatosComponent(solocitud130106Service, consultaQuery);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set indice on seleccionaTab', () => {
		component.seleccionaTab(2);
		expect(component.indice).toBe(2);
	});

	it('should set esDatosRespuesta true if consultaState.update is false in ngOnInit', () => {
		const subject = new Subject<any>();
		consultaQuery.selectConsultaioState$ = subject.asObservable();
		component.consultaState = { update: false } as any;
		component.ngOnInit();
		subject.next({ update: false });
		expect(component.esDatosRespuesta).toBe(true);
	});

	it('should call guardarDatosFormulario if consultaState.update is true in ngOnInit', () => {
		const subject = new Subject<any>();
		consultaQuery.selectConsultaioState$ = subject.asObservable();
		component.consultaState = { update: true } as any;
		const spy = jest.spyOn(component, 'guardarDatosFormulario');
		component.ngOnInit();
		subject.next({ update: true });
		expect(spy).toHaveBeenCalled();
	});

	it('should set esDatosRespuesta true and call actualizarEstadoFormulario in guardarDatosFormulario', () => {
		jest.spyOn(solocitud130106Service, 'getRegistroTomaMuestrasMercanciasData').mockReturnValue(of({
			idSolicitud: 1,
			regimen: '',
			clasificacion: '',
			solicitudDescripcion: '',
			producto: '',
			fraccion: '',
			cantidad: '',
			valorFacturaUSD: '',
			unidadMedida: '',
			cantidadPartidasDeLaMercancia: '',
			descripcionPartidasDeLaMercancia: '',
			valorPartidaUSDPartidasDeLaMercancia: '',
			cantidadTotal: '',
			valorTotalUSD: '',
			bloque: '',
			usoEspecifico: '',
			justificacionImportacionExportacion: '',
			observaciones: '',
			entidad: '',
			representacion: '',
			filaSeleccionada: [],
			tableBodyData: [],
			mostrarTabla: false,
			defaultSelect: '',
			defaultProducto: '',
			readonly: false,
			fechasSeleccionadas: [],
			solicitud: '',
			factura: '',
			umt: '',
			mercanciaCantidad: '',
			mercanciaFactura: '',
			descripcion: '',
			especifico: '',
			justificacion: '',
			disponible: '',
			seleccionado: '',
			selectRangoDias: [],
			valorPartidaUSD: 0,
		}));
		const spy = jest.spyOn(solocitud130106Service, 'actualizarEstadoFormulario');
		component.guardarDatosFormulario();
		expect(component.esDatosRespuesta).toBe(true);
		expect(spy).toHaveBeenCalled();
	});
});