import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { DespachoMercanciasSolicitudComponent } from './despacho-mercancias-solicitud.component';
import { Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';
import { TransportistaService } from '../../../../core/services/303/transportista.service';
import { ControlInventario } from '../../../../core/models/303/control-inventario.model';

describe('DespachoMercanciasSolicitudComponent', () => {
	let component: DespachoMercanciasSolicitudComponent;
	let fixture: ComponentFixture<DespachoMercanciasSolicitudComponent>;
	let mockTramite303State: Partial<Tramite303StoreService>;
	let mockTramite303Query: Partial<Tramite303Query>;
	let mockTransportistaService: Partial<TransportistaService>;

	const mockInventario: ControlInventario = {
		id: 'inv1',
		nombreSistema: 'Sistema X',
		lugarRadicacion: 'CDMX',
		esSistemaControl: true
	};

			const mockTramiteConsultado = {
				indice: 1,
				tipoFigura: '',
				lugarRadicacion: '',
				mostrarCheckboxesImmex: false,
				mostrarSelectImmex: true,
				listaInventarios: [mockInventario],
				cumplimiento: 'a', autorizar: 'a', listado: 'a', certificados: 'a', art17: 'a', buzon: 'a', cuentaImmex: 'a', checkboxImportacion1: false, checkboxImportacion2: false, immex: '1', padron: '1', controlInventarios: 'a', contabilidad: 'a', interposicion: 'a', checkboxManifiesto1: false, checkboxManifiesto2: false, ingresoInforme: ''
			};

	beforeEach(async () => {
		mockTramite303State = {
			setSelectImmex: jest.fn(),
			setCheckboxesImmex: jest.fn(),
			setListaInventarios: jest.fn()
		};
		mockTramite303Query = {
			selectSolicitud$: of(mockTramiteConsultado)
		};
		mockTransportistaService = {
			obtenerDatosImmex: jest.fn().mockReturnValue(of([]))
		};

		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [DespachoMercanciasSolicitudComponent],
			providers: [
				FormBuilder,
				{ provide: Tramite303StoreService, useValue: mockTramite303State },
				{ provide: Tramite303Query, useValue: mockTramite303Query },
				{ provide: TransportistaService, useValue: mockTransportistaService }
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
		})
		.overrideTemplate(DespachoMercanciasSolicitudComponent, '')
		.compileComponents();

		fixture = TestBed.createComponent(DespachoMercanciasSolicitudComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('debería crear el componente correctamente', () => {
		expect(component).toBeTruthy();
	});

	it('debería inicializar el formulario y cargar inventarios', () => {
		component.ngOnInit();
		expect(component.listaControlInventarios).toEqual([mockInventario]);
		expect(component.formInventario).toBeDefined();
	});

	it('debería mostrar notificación al agregar inventario inválido', () => {
		component.formInventario.patchValue({ nombreSistema: '', lugarRadicacion: '', esSistemaControl: false });
		component.agregarInventario();
		expect(component.nuevaNotificacion).toBeDefined();
		expect(component.nuevaNotificacion.mensaje).toContain('No hay información para guardar');
	});

	it('debería agregar un inventario correctamente', () => {
		component.formInventario.patchValue({ nombreSistema: 'Nuevo', lugarRadicacion: 'CDMX', esSistemaControl: true });
		component.listaControlInventarios = [];
		component.agregarInventario();
		expect(component.listaControlInventarios.length).toBe(1);
		expect(component.nuevaNotificacion.mensaje).toContain('Datos guardados correctamente');
		expect(mockTramite303State.setListaInventarios).toHaveBeenCalled();
	});

	it('debería modificar un inventario correctamente', () => {
		component.listaControlInventarios = [mockInventario];
		component.inventarioEnEdicion = mockInventario;
		component.formInventario.patchValue({ nombreSistema: 'Modificado', lugarRadicacion: 'CDMX', esSistemaControl: false });
		component.agregarInventario();
		expect(component.listaControlInventarios[0].nombreSistema).toBe('Modificado');
		expect(component.nuevaNotificacion.mensaje).toContain('Inventario modificado correctamente');
	});

	it('debería mostrar notificación si no hay inventarios seleccionados para modificar', () => {
		component.listaControlInventariosSeleccionados = [];
		component.modificarInventario();
		expect(component.nuevaNotificacion.mensaje).toContain('No hay inventarios seleccionados para modificar');
	});

	it('debería mostrar notificación si hay más de un inventario seleccionado para modificar', () => {
		component.listaControlInventariosSeleccionados = [mockInventario, { ...mockInventario, id: 'inv2' }];
		component.modificarInventario();
		expect(component.nuevaNotificacion.mensaje).toContain('Solo se puede modificar un inventario a la vez');
	});

	it('debería preparar el formulario para modificar inventario', () => {
		component.listaControlInventariosSeleccionados = [mockInventario];
		component.modificarInventario();
		expect(component.inventarioEnEdicion).toEqual(mockInventario);
		expect(component.formInventario.get('nombreSistema')?.value).toBe(mockInventario.nombreSistema);
	});

	it('debería mostrar notificación si no hay inventarios seleccionados para eliminar', () => {
		component.listaControlInventariosSeleccionados = [];
		component.eliminarInventario();
		expect(component.nuevaNotificacion.mensaje).toContain('No hay inventarios seleccionados para eliminar');
	});

	it('debería eliminar inventario correctamente', () => {
		component.listaControlInventarios = [mockInventario, { ...mockInventario, id: 'inv2' }];
		component.listaControlInventariosSeleccionados = [mockInventario];
		component.eliminarInventario();
		expect(component.listaControlInventarios.length).toBe(1);
		expect(component.listaControlInventarios[0].id).toBe('inv2');
		expect(component.listaControlInventariosSeleccionados.length).toBe(0);
		expect(mockTramite303State.setListaInventarios).toHaveBeenCalled();
	});

	it('debería completar el subject destroyNotifier en ngOnDestroy', () => {
		const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
		const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
		component.ngOnDestroy();
		expect(spyNext).toHaveBeenCalled();
		expect(spyComplete).toHaveBeenCalled();
	});
});
