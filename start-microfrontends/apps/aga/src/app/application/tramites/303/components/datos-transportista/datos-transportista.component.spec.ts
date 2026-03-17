import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { DatosTransportistaComponent } from './datos-transportista.component';
import { Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';
import { Transportista } from '@libs/shared/data-access-user/src/core/models/303/secciones.model';

describe('DatosTransportistaComponent', () => {
	let component: DatosTransportistaComponent;
	let fixture: ComponentFixture<DatosTransportistaComponent>;
	let mockTramite303State: Partial<Tramite303StoreService>;
	let mockTramite303Query: Partial<Tramite303Query>;
	let mockRouter: Partial<Router>;

	const mockTransportista: Transportista = {
		idPersonaTransportista: '1',
		tipoPersona: 'Física',
		nacionalidad: 'Mexicana',
		esExtranjero: false,
		esNacional: true,
		rfc: 'RFC123',
		rfcExtranjero: '',
		nombre: 'Juan Pérez',
		transportista: 'Transporte S.A.',
		taxId: 'TAX123',
		denominacionRazonSocial: 'Transporte S.A.',
		apellidoPaterno: 'Pérez',
		apellidoMaterno: 'García'
	};

		const mockTramiteConsultado = {
			indice: 1,
			cumplimiento: '',
			autorizar: '',
			listado: '',
			certificados: '',
			art17: '',
			buzon: '',
			cuentaImmex: '',
			tipoFigura: '',
			listaFiguras: [],
			listaTransportistas: [mockTransportista]
		};

	beforeEach(async () => {
		mockTramite303State = {
			setListaTransportistas: jest.fn()
		};
		mockTramite303Query = {
			selectSolicitud$: of(mockTramiteConsultado)
		};
		mockRouter = {
			navigate: jest.fn()
		};

		await TestBed.configureTestingModule({
			declarations: [DatosTransportistaComponent],
			providers: [
				{ provide: Tramite303StoreService, useValue: mockTramite303State },
				{ provide: Tramite303Query, useValue: mockTramite303Query },
				{ provide: Router, useValue: mockRouter }
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(DatosTransportistaComponent);
		component = fixture.componentInstance;
	});

	it('debería crear el componente correctamente', () => {
		expect(component).toBeTruthy();
	});

	describe('ngOnInit', () => {
		it('debería cargar la lista de transportistas desde el estado del trámite', () => {
			component.ngOnInit();
			expect(component.personasTrasportistas).toEqual([mockTransportista]);
			expect(component.tramiteConsultado).toEqual(mockTramiteConsultado);
		});
	});

	describe('agregarTransportista', () => {
		it('debería navegar a la página de registro de transportista', () => {
			component.agregarTransportista();
			expect(mockRouter.navigate).toHaveBeenCalledWith(['aga/despacho-mercancias/registro-trasportista']);
		});
	});

	describe('modificarTransportista', () => {
		it('debería navegar a la página de registro de transportista', () => {
			component.modificarTransportista();
			expect(mockRouter.navigate).toHaveBeenCalledWith(['aga/despacho-mercancias/registro-trasportista']);
		});
	});

	describe('eliminarTransportista', () => {
		beforeEach(() => {
			component.personasTrasportistas = [
				mockTransportista,
				{ ...mockTransportista, idPersonaTransportista: '2', nombre: 'María López' }
			];
			component.trasportistasSeleccionados = [mockTransportista];
		});

		it('debería eliminar el transportista seleccionado de la lista', () => {
			component.eliminarTransportista();
			expect(component.personasTrasportistas.length).toBe(1);
			expect(component.personasTrasportistas[0].idPersonaTransportista).toBe('2');
			expect(component.trasportistasSeleccionados.length).toBe(0);
			expect(mockTramite303State.setListaTransportistas).toHaveBeenCalledWith(component.personasTrasportistas);
		});

		it('no debería eliminar nada si no hay seleccionados', () => {
			component.trasportistasSeleccionados = [];
			const listaInicial = [...component.personasTrasportistas];
			component.eliminarTransportista();
			expect(component.personasTrasportistas).toEqual(listaInicial);
			expect(mockTramite303State.setListaTransportistas).toHaveBeenCalledWith(listaInicial);
		});
	});

	describe('ngOnDestroy', () => {
		it('debería completar el subject destroyNotifier para evitar fugas de memoria', () => {
			const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
			const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
			component.ngOnDestroy();
			expect(spyNext).toHaveBeenCalled();
			expect(spyComplete).toHaveBeenCalled();
		});
	});
});