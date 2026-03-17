import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CertificadoComponent } from './certificado.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';
import { Tramite110222Query } from '../../estados/tramite110222.query';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
import { Tramite110222Store } from '../../estados/tramite110222.store';
import { of, Subject } from 'rxjs';

class MockToastrService {
	error = jest.fn();
}
class MockTramite110222Query {
	selectTramite$ = of({ idSolicitud: 1 });
}
class MockValidarInicialmenteCertificadoService {
	getAllState = jest.fn(() => of({ foo: 'bar' }));
	guardarDatosPost = jest.fn(() => of({ datos: { idSolicitud: 2 }, id: 1, descripcion: 'ok', codigo: '200', data: {} }));
}
class MockTramite110222Store {
	setIdSolicitud = jest.fn();
}

describe('CertificadoComponent', () => {
	let component: CertificadoComponent;
	let fixture: ComponentFixture<CertificadoComponent>;
	let toastr: MockToastrService;
	let tramiteQuery: MockTramite110222Query;
	let validarService: MockValidarInicialmenteCertificadoService;
	let tramiteStore: MockTramite110222Store;

	beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [WizardComponent],
				declarations: [CertificadoComponent, PasoUnoComponent],
				schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
				providers: [
				{ provide: ToastrService, useClass: MockToastrService },
				{ provide: TOAST_CONFIG, useValue: {
					maxOpened: 0,
					autoDismiss: false,
					iconClasses: { error: '', info: '', success: '', warning: '' },
					newestOnTop: true,
					preventDuplicates: false,
					countDuplicates: false,
					resetTimeoutOnDuplicate: false,
					includeTitleDuplicates: false,
					positionClass: 'toast-top-right',
					timeOut: 5000,
					closeButton: false,
					extendedTimeOut: 1000,
					progressBar: false,
					progressAnimation: 'decreasing',
					enableHtml: false,
					toastClass: 'ngx-toastr',
					titleClass: 'toast-title',
					messageClass: 'toast-message',
					easing: 'ease-in',
					easeTime: 300,
					tapToDismiss: true,
					onActivateTick: false
				} },
				{ provide: Tramite110222Query, useClass: MockTramite110222Query },
				{ provide: ValidarInicialmenteCertificadoService, useClass: MockValidarInicialmenteCertificadoService },
				{ provide: Tramite110222Store, useClass: MockTramite110222Store }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(CertificadoComponent);
		component = fixture.componentInstance;
		toastr = TestBed.inject(ToastrService) as any;
		tramiteQuery = TestBed.inject(Tramite110222Query) as any;
		validarService = TestBed.inject(ValidarInicialmenteCertificadoService) as any;
		tramiteStore = TestBed.inject(Tramite110222Store) as any;
		component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
		component.pasoUnoComponent = { validarFormularios: jest.fn(() => true) } as any;
		component.solicitudState = { idSolicitud: 1 } as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('obtenerDatosDelStore should call guardar', () => {
		const spy = jest.spyOn(component, 'guardar').mockResolvedValue({} as any);
		component.obtenerDatosDelStore();
		expect(validarService.getAllState).toHaveBeenCalled();
	});

	it('getValorIndice should handle cont and call validarTodosFormulariosPasoUno', () => {
		const spy = jest.spyOn<any, any>(component as any, 'validarTodosFormulariosPasoUno').mockReturnValue(true);
		component.indice = 1;
		component.getValorIndice({ accion: 'cont', valor: 2 });
		expect(spy).toHaveBeenCalled();
	});

	it('getValorIndice should set esFormaValido if invalid', () => {
		jest.spyOn<any, any>(component as any, 'validarTodosFormulariosPasoUno').mockReturnValue(false);
		component.indice = 1;
		component.getValorIndice({ accion: 'cont', valor: 2 });
		expect(component.esFormaValido).toBe(true);
	});

	it('getValorIndice should call pasoNavegarPor for valid valor', () => {
		const spy = jest.spyOn(component, 'pasoNavegarPor');
		component.indice = 2;
		component.getValorIndice({ accion: 'cont', valor: 2 });
		expect(spy).toHaveBeenCalledWith({ accion: 'cont', valor: 2 });
	});

	it('pasoNavegarPor should call wizardComponent.siguiente for cont', () => {
		const spy = jest.spyOn(component.wizardComponent, 'siguiente');
		component.pasoNavegarPor({ accion: 'cont', valor: 2 });
		expect(component.indice).toBe(2);
		expect(component.datosPasos.indice).toBe(2);
		expect(spy).toHaveBeenCalled();
	});

	it('pasoNavegarPor should call wizardComponent.atras for not cont', () => {
		const spy = jest.spyOn(component.wizardComponent, 'atras');
		component.pasoNavegarPor({ accion: 'atras', valor: 2 });
		expect(spy).toHaveBeenCalled();
	});

	it('validarTodosFormulariosPasoUno should return true if no pasoUnoComponent', () => {
		component.pasoUnoComponent = undefined as any;
		expect((component as any).validarTodosFormulariosPasoUno()).toBe(true);
	});

	it('validarTodosFormulariosPasoUno should return false if invalid', () => {
		component.pasoUnoComponent = { validarFormularios: jest.fn(() => false) } as any;
		expect((component as any).validarTodosFormulariosPasoUno()).toBe(false);
	});

	it('validarTodosFormulariosPasoUno should return true if valid', () => {
		component.pasoUnoComponent = { validarFormularios: jest.fn(() => true) } as any;
		expect((component as any).validarTodosFormulariosPasoUno()).toBe(true);
	});

	it('guardar should resolve and call setIdSolicitud and pasoNavegarPor', async () => {
		const pasoSpy = jest.spyOn(component, 'pasoNavegarPor');
		const setIdSpy = jest.spyOn(tramiteStore, 'setIdSolicitud');
		const result = await component.guardar({
			formCertificado: {},
			mercanciaTabla: [],
			formDatosDelDestinatario: {},
			formDestinatario: {},
			formExportor: {},
			formDatosCertificado: {},
		} as any);
		expect(pasoSpy).toHaveBeenCalled();
		expect(setIdSpy).toHaveBeenCalledWith(2);
		expect(result).toBeDefined();
	});

});
