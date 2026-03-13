
import { TestBed } from '@angular/core/testing';
import { RegistroTrasportistaComponent } from './registro-trasportista.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';
import { TransportistaService } from '../../../../core/services/303/transportista.service';
import { of } from 'rxjs';

describe('RegistroTrasportistaComponent', () => {
	let component: RegistroTrasportistaComponent;

	let transportistaServiceSpy: jest.Mocked<TransportistaService>;
	let tramite303StateSpy: jest.Mocked<Tramite303StoreService>;
	let tramite303QuerySpy: Partial<Tramite303Query>;
	let routerSpy: jest.Mocked<Router>;

	beforeEach(() => {

			transportistaServiceSpy = {
				buscarFisicaPorRFC: jest.fn(),
				buscarMoralPorRFC: jest.fn(),
			} as any;
			tramite303StateSpy = {
				setListaTransportistas: jest.fn(),
				trasportistaModificar: jest.fn(),
			} as any;
					tramite303QuerySpy = {
						selectSolicitud$: of({
							indice: 1,
							cumplimiento: '',
							autorizar: '',
							listado: '',
							certificados: '',
							art17: '',
							buzon: '',
							cuentaImmex: '',
							checkboxImportacion1: false,
							checkboxImportacion2: false,
							tipoFigura: '',
							listaFiguras: [],
							mostrarCheckboxesImmex: false,
							mostrarSelectImmex: true,
							listaTransportistas: [],
							transportistaModificar: undefined,
							immex: '',
							padron: '',
							controlInventarios: '',
							listaInventarios: [],
							contabilidad: '',
							lugarRadicacion: '',
							interposicion: '',
							checkboxManifiesto1: false,
							checkboxManifiesto2: false,
							ingresoInforme: '',
						})
					};
			routerSpy = {
				navigate: jest.fn()
			} as any;

		TestBed.configureTestingModule({
			imports: [RegistroTrasportistaComponent],
			providers: [
				FormBuilder,
				{ provide: TransportistaService, useValue: transportistaServiceSpy },
				{ provide: Tramite303StoreService, useValue: tramite303StateSpy },
				{ provide: Tramite303Query, useValue: tramite303QuerySpy },
				{ provide: Router, useValue: routerSpy },
			],
		});
		component = TestBed.createComponent(RegistroTrasportistaComponent).componentInstance;
	});

	it('debería crear el componente correctamente', () => {
		expect(component).toBeTruthy();
		expect(component.FormTrasportista).toBeDefined();
	});

	it('debería inicializar el formulario con valores por defecto', () => {
		expect(component.FormTrasportista.get('nacionalidad')?.value).toBe('nacional');
		expect(component.FormTrasportista.get('tipoPersona')?.value).toBe('fisica');
	});

	it('debería limpiar el formulario', () => {
		component.FormTrasportista.patchValue({ rfc: 'ABC123', nombre: 'Juan' });
		component.limpiarFormulario();
		expect(component.FormTrasportista.get('rfc')?.value).toBeNull();
		expect(component.FormTrasportista.get('nombre')?.value).toBeNull();
	});

		it('debería llamar a ngOnDestroy y completar el notifier', () => {
			const spy = jest.spyOn(component['destroyNotifier$'], 'next');
			const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
			component.ngOnDestroy();
			expect(spy).toHaveBeenCalled();
			expect(spyComplete).toHaveBeenCalled();
		});

	// Puedes agregar más pruebas para guardar, buscar, editar, notificaciones, etc.
});
