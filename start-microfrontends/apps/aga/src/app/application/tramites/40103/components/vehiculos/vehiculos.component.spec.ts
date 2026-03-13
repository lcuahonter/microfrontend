import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { VehiculosComponent } from './vehiculos.component';
import { Tramite40103Store, Tramite40103State } from '../../estados/tramite40103.store';
import { Tramite40103Query } from '../../estados/tramite40103.query';
import { modificarTerrestreService } from '../services/modificacar-terrestre.service';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';

jest.mock('bootstrap', () => ({
	Modal: jest.fn().mockImplementation(() => ({
		show: jest.fn(),
		hide: jest.fn()
	}))
}));

const DATOS_UNIDAD_TABLA = {
	estado: 'Activo',
	colorVehiculo: 'Rojo',
	vinVehiculo: 'VIN123456789',
	marca: 'Toyota',
	modelo: 'Corolla',
	ano: '2022',
	paisEmisor: 'México',
	numeroPlaca: 'ABC123',
	tipoDeVehiculo: 'Camioneta',
	numeroEconomico: 'NE123',
	capacidad: '1000kg',
	tipoArrastre: 'Remolque',
	colorUnidad: 'Rojo',
};

describe('VehiculosComponent', () => {
	it('should remove vehiculo row by VIN, ID, and placa+marca', () => {
		component.vehiculosTablaConfig = {
			encabezadas: [],
			datos: [
				{
					idDeVehiculo: '1',
					numero: 'VIN123',
					tipoDeVehiculo: 'Camioneta',
					numeroPlaca: 'ABC123',
					paisEmisor: 'México',
					estado: 'CDMX',
					marca: 'Toyota',
					modelo: 'Corolla',
					ano: '2022',
					transponder: 'T1',
					colorVehiculo: 'Rojo',
					numuroEconomico: 'NE123',
					numero2daPlaca: 'DEF456',
					estado2daPlaca: 'JAL',
					paisEmisor2daPlaca: 'México',
					descripcion: 'desc1',
					datos: []
				},
				{
					idDeVehiculo: '2',
					numero: 'VIN456',
					tipoDeVehiculo: 'Camioneta',
					numeroPlaca: 'DEF456',
					paisEmisor: 'México',
					estado: 'CDMX',
					marca: 'Nissan',
					modelo: 'Sentra',
					ano: '2021',
					transponder: 'T2',
					colorVehiculo: 'Azul',
					numuroEconomico: 'NE456',
					numero2daPlaca: 'GHI789',
					estado2daPlaca: 'NLE',
					paisEmisor2daPlaca: 'México',
					descripcion: 'desc2',
					datos: []
				},
				{
					idDeVehiculo: '3',
					numero: 'VIN789',
					tipoDeVehiculo: 'Camioneta',
					numeroPlaca: 'ABC123',
					paisEmisor: 'México',
					estado: 'CDMX',
					marca: 'Toyota',
					modelo: 'Yaris',
					ano: '2023',
					transponder: 'T3',
					colorVehiculo: 'Verde',
					numuroEconomico: 'NE789',
					numero2daPlaca: 'JKL012',
					estado2daPlaca: 'GRO',
					paisEmisor2daPlaca: 'México',
					descripcion: 'desc3',
					datos: []
				}
			]
		};

		component.selectedVehiculoIndex = 0;
		component.eliminarVehiculoRow();

		expect(component.vehiculosTablaConfig.datos.length).toBe(1);
		expect(component.vehiculosTablaConfig.datos[0].idDeVehiculo).toBe('2');
		expect(component.selectedVehiculoIndex).toBeNull();
	});
	let component: VehiculosComponent;
	let fixture: ComponentFixture<VehiculosComponent>;
		let mockStore: any;
		let mockQuery: any;
		let mockConsultaioQuery: any;
		let mockModificarService: any;
		let mockValidacionesService: any;
		let mockModal: any;

		beforeEach(async () => {
			mockModal = { show: jest.fn(), hide: jest.fn() };
			(Modal as any).mockReturnValue(mockModal);

			mockStore = { update: jest.fn(), setDatosVehiculo: jest.fn(), setDatosUnidad: jest.fn() };
			mockQuery = { selectSolicitud$: of({}) };
			mockConsultaioQuery = { selectConsultaioState$: of({ readonly: false }) };
			const observableMock = { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) };
			mockModificarService = { 
				obtenerPedimentoTabla: jest.fn().mockReturnValue(observableMock), 
				obtenerTipoDeVehiculo: jest.fn().mockReturnValue(observableMock),
				obtenerTipoArrastre: jest.fn().mockReturnValue(observableMock),
				obtenerAno: jest.fn().mockReturnValue(observableMock),
				obtenerPaisEmisor: jest.fn().mockReturnValue(observableMock),
				obtenerColorVehiculo: jest.fn().mockReturnValue(observableMock),
				someObservable: observableMock
			};
			mockValidacionesService = { isValid: jest.fn().mockReturnValue(true) };

			await TestBed.configureTestingModule({
				declarations: [],
				imports: [ReactiveFormsModule],
				providers: [
					FormBuilder,
					{ provide: Tramite40103Store, useValue: mockStore },
					{ provide: Tramite40103Query, useValue: mockQuery },
					{ provide: modificarTerrestreService, useValue: mockModificarService },
					{ provide: ValidacionesFormularioService, useValue: mockValidacionesService },
					{ provide: 'ConsultaioQuery', useValue: mockConsultaioQuery }
				],
				schemas: [NO_ERRORS_SCHEMA]
			}).compileComponents();

			fixture = TestBed.createComponent(VehiculosComponent);
			component = fixture.componentInstance;
			component.colorVehiculoCatalogo = [
				{ id: 1, descripcion: 'Rojo', clave: 'R' },
				{ id: 2, descripcion: 'Azul', clave: 'A' }
			];
				(component as any).vehiculoModalInstance = {
					show: jest.fn(),
					hide: jest.fn(),
					dispose: jest.fn(),
					toggle: jest.fn(),
					handleUpdate: jest.fn()
				};
			if (component.vehiculoModalInstance) {
				component.vehiculoModalInstance.dispose = jest.fn();
			}
				(component as any).unidadModalInstance = {
					show: jest.fn(),
					hide: jest.fn(),
					dispose: jest.fn(),
					toggle: jest.fn(),
					handleUpdate: jest.fn()
				};
			if (component.unidadModalInstance) {
				component.unidadModalInstance.dispose = jest.fn();
			}
			component.vehiculoModal = { nativeElement: document.createElement('div') } as ElementRef;
			component.unidadModal = { nativeElement: document.createElement('div') } as ElementRef;
			component.closeModal = { nativeElement: { click: jest.fn() } } as ElementRef;
			component.closeUnidadModal = { nativeElement: { click: jest.fn() } } as ElementRef;
			component.tramiteState = {} as Tramite40103State;
		});

	afterEach(() => {
		jest.clearAllMocks();
		if ((component as any).vehiculoModalInstance) {
			(component as any).vehiculoModalInstance.dispose = jest.fn();
		}
		if ((component as any).unidadModalInstance) {
			(component as any).unidadModalInstance.dispose = jest.fn();
		}
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize forms', () => {
		component.ngOnInit();
		expect(component.vehiculoFormulario).toBeDefined();
		expect(component.unidadFormulario).toBeDefined();
	});

	it('should handle iniciarEdicionVehiculo with null index', () => {
		component.vehiculoFormulario = component.fb.group({
			idDeVehiculo: [null], numero: [''], tipoDeVehiculo: [''], numeroPlaca: [''], paisEmisor: [''], estado: [''], marca: [''], modelo: [''], ano: [''], transponder: [''], colorVehiculo: [''], numuroEconomico: [''], numero2daPlaca: [''], estado2daPlaca: [''], paisEmisor2daPlaca: [''], descripcion: ['']
		});
		jest.spyOn(component, 'limpiarDatosVehiculo');
		jest.spyOn(component, 'abrirModalPedimento');
		component.iniciarEdicionVehiculo(null);
		expect(component.limpiarDatosVehiculo).toHaveBeenCalled();
		expect(component.abrirModalPedimento).toHaveBeenCalled();
		expect(component.editIndex).toBeNull();
	});

	it('should handle iniciarEdicionVehiculo with valid index', () => {
		component.vehiculoFormulario = component.fb.group({
			idDeVehiculo: [null], numero: [''], tipoDeVehiculo: [''], numeroPlaca: [''], paisEmisor: [''], estado: [''], marca: [''], modelo: [''], ano: [''], transponder: [''], colorVehiculo: [''], numuroEconomico: [''], numero2daPlaca: [''], estado2daPlaca: [''], paisEmisor2daPlaca: [''], descripcion: ['']
		});

		component.tipoDeVehiculoCatalogo = [{ id: 2, descripcion: 'Camioneta', clave: 'C' }];
		component.paisEmisorCatalogo = [{ id: 1, descripcion: 'México', clave: 'M' }];
		component.anoCatalogo = [{ id: 2022, descripcion: '2022', clave: '2022' }];
		component.colorVehiculoCatalogo = [{ id: 1, descripcion: 'Rojo', clave: 'R' }];
			jest.spyOn(component, 'abrirModalPedimento');
			component.iniciarEdicionVehiculo(0);
			expect(component.editIndex).toBeNull(); 
			expect(component.abrirModalPedimento).toHaveBeenCalled();
	});

	it('should handle iniciarEdicionUnidad with null index', () => {
		component.unidadFormulario = component.fb.group({
			idDeVehiculoUnidad: [null], vinVehiculo: [''], tipoDeUnidadArrastre: [''], numeroEconomico: [''], numeroPlaca: [''], paisEmisor: [''], estado: [''], colorVehiculo: [''], numero2daPlaca: [''], estado2daPlaca: [''], paisEmisor2daPlaca: [''], descripcion: ['']
		});
		jest.spyOn(component, 'limpiarDatosUnidad');
		jest.spyOn(component, 'abrirModalPedimentoUnidad');
		component.iniciarEdicionUnidad(null);
		expect(component.limpiarDatosUnidad).toHaveBeenCalled();
		expect(component.abrirModalPedimentoUnidad).toHaveBeenCalled();
		expect(component.editUnidadIndex).toBeNull();
	});

	it('should handle iniciarEdicionUnidad with valid index', () => {
		component.unidadFormulario = component.fb.group({
			idDeVehiculoUnidad: [null], vinVehiculo: [''], tipoDeUnidadArrastre: [''], numeroEconomico: [''], numeroPlaca: [''], paisEmisor: [''], estado: [''], colorVehiculo: [''], numero2daPlaca: [''], estado2daPlaca: [''], paisEmisor2daPlaca: [''], descripcion: ['']
		});
		component.unidadesTablaConfig = {
			encabezadas: [],
			datos: [{
				idDeVehiculo: '1',
				vinVehiculo: 'VIN123',
				tipoDeUnidadArrastre: 'Remolque',
				numeroEconomico: 'NE123',
				numeroPlaca: 'ABC123',
				paisEmisor: 'México',
				estado: 'CDMX'
			}]
		};
		component.tipoArrastreCatalogo = [{ id: 3, descripcion: 'Remolque', clave: 'R' }];
		component.paisEmisorCatalogo = [{ id: 1, descripcion: 'México', clave: 'M' }];
		component.colorVehiculoCatalogo = [{ id: 1, descripcion: 'Rojo', clave: 'R' }];
		jest.spyOn(component, 'abrirModalPedimentoUnidad');
			component.iniciarEdicionUnidad(0);
					expect(component.editUnidadIndex).toBe(0);
			expect(component.abrirModalPedimentoUnidad).toHaveBeenCalled();
	});

	it('should remove vehiculo row with eliminarVehiculoRow', () => {
			component.selectedVehiculoIndex = 0;
			component.eliminarVehiculoRow();
			expect(component.vehiculosTablaConfig.datos.length).toBe(0);
			expect(component.selectedVehiculoIndex).toBeNull();
	});

	it('should remove unidad row with eliminarUnidadRow', () => {
		component.unidadesTablaConfig = {
			encabezadas: [],
				datos: [{
					idDeVehiculo: '1',
					vinVehiculo: 'VIN123',
					tipoDeUnidadArrastre: 'Remolque',
					numeroEconomico: 'NE123',
					numeroPlaca: 'ABC123',
					paisEmisor: 'México',
					estado: 'CDMX'
				}, {
					idDeVehiculo: '2',
					vinVehiculo: 'VIN456',
					tipoDeUnidadArrastre: 'Remolque',
					numeroEconomico: 'NE456',
					numeroPlaca: 'DEF456',
					paisEmisor: 'México',
					estado: 'CDMX'
				}]
	};
		component.selectedUnidadIndex = 0;
		component.eliminarUnidadRow();
		expect(component.unidadesTablaConfig.datos.length).toBe(1);
		expect(component.selectedUnidadIndex).toBeNull();
	});

	it('should get tipo vehiculo descripcion', () => {
		component.tipoDeVehiculoCatalogo = [{ id: 2, descripcion: 'Camioneta', clave: 'C' }];
		const item = { tipoDeVehiculo: 'Camioneta' };
		const desc = (component as any).obtenerTipoVehiculoDescripcion(item);
		expect(desc).toBe('Camioneta');
	});

	it('should get pais emisor descripcion', () => {
		component.paisEmisorCatalogo = [{ id: 1, descripcion: 'México', clave: 'M' }];
		const item = { paisEmisor: 'México' };
		const desc = (component as any).obtenerPaisEmisorDescripcion(item);
		expect(desc).toBe('México');
	});

	it('should get año descripcion', () => {
		component.anoCatalogo = [{ id: 2022, descripcion: '2022', clave: '2022' }];
		const item = { ano: '2022' };
		const desc = (component as any).obtenerAnoDescripcion(item);
		expect(desc).toBe('2022');
	});

	it('should get color vehiculo descripcion', () => {
		component.colorVehiculoCatalogo = [{ id: 1, descripcion: 'Rojo', clave: 'R' }];
		const item = { colorVehiculo: 'Rojo' };
		const desc = (component as any).obtenerColorVehiculoDescripcion(item);
		expect(desc).toBe('Rojo');
	});

	it('should get pais emisor 2da placa descripcion', () => {
		component.paisEmisorCatalogo = [{ id: 1, descripcion: 'México', clave: 'M' }];
		const item = { paisEmisor2daPlaca: 'México' };
		const desc = (component as any).obtenerPaisEmisor2daPlacaDescripcion(item);
		expect(desc).toBe('México');
	});

	it('should open vehiculo modal', () => {
		component.abrirModalPedimento();
		expect(mockModal.show).toHaveBeenCalled();
	});

	it('should open unidad modal', () => {
		component.abrirModalPedimentoUnidad();
		expect(mockModal.show).toHaveBeenCalled();
	});

	it('should clean vehiculo form', () => {
		component.vehiculoFormulario = component.fb.group({ numero: ['test'] });
		component.limpiarDatosVehiculo();
		expect(component.vehiculoFormulario.pristine).toBeTruthy();
	});

	it('should clean unidad form', () => {
		component.unidadFormulario = component.fb.group({ vinVehiculo: ['test'] });
		component.limpiarDatosUnidad();
		expect(component.unidadFormulario.pristine).toBeTruthy();
	});

	it('should call isValid', () => {
		const form = component.fb.group({ numero: ['test'] });
		expect(component.isValid(form, 'numero')).toBe(true);
	});

	it('should set selected tab', () => {
		const tab = component.seleccionarPestana('parquevehicular');
		expect(component.selectedTab).toBe('Parque vehicular');
		expect(component.activeTab).toBe('parquevehicular');
		expect(tab).toBe('parquevehicular');
	});

	it('should handle eliminarPedimento', () => {
		component.vehiculosTablaConfig = {
			encabezadas: [],
			datos: [{
				numero: 'test',
				tipoDeVehiculo: 'Camioneta',
				idDeVehiculo: 'ID123',
				numeroPlaca: 'ABC123',
				paisEmisor: 'México',
				estado: 'CDMX',
				marca: 'Toyota'
			}]
		} as any;
		component.editIndex = 1;
		component.vehiculoFormulario = component.fb.group({ numero: ['test'] });
		component.eliminarPedimento();
		expect(component.vehiculosTablaConfig.datos).toEqual([]);
		expect(component.editIndex).toBeNull();
	});

	it('should handle eliminarUnidadPedimento', () => {
		component.unidadesTablaConfig = { encabezadas: [], datos: [{ vinVehiculo: 'test' }] } as any;
		component.editUnidadIndex = 1;
		component.unidadFormulario = component.fb.group({ vinVehiculo: ['test'] });
		component.eliminarUnidadPedimento();
		expect(component.unidadesTablaConfig.datos).toEqual([]);
		expect(component.editUnidadIndex).toBeNull();
	});

	it('should call setValoresStore and update store', () => {
	const form = component.fb.group({ testField: ['value'] });
	component.setValoresStore(form, 'testField', 'setDatosVehiculo' as keyof Tramite40103Store);
	expect(mockStore.setDatosVehiculo).toHaveBeenCalledWith('value');
	});

	it('should initialize forms with inicializarFormulario', () => {
	component.inicializarFormulario();
	expect(component.vehiculoFormulario).toBeDefined();
	expect(component.unidadFormulario).toBeDefined();
	});

	it('should add a new vehiculo with agregarDatosVehiculo', () => {
	component.vehiculoFormulario = component.fb.group({ idDeVehiculo: [1], numero: ['123'], tipoDeVehiculo: ['Camioneta'] });
	component.vehiculosTablaConfig = { encabezadas: [], datos: [] };
	component.editIndex = null;
	component.agregarDatosVehiculo();
	expect(component.vehiculosTablaConfig.datos.length).toBe(1);
	});

	it('should add a new unidad with agregarDatosUnidad', () => {
	component.unidadFormulario = component.fb.group({ idDeVehiculo: [1], vinVehiculo: ['VIN123'] });
	component.unidadesTablaConfig = { encabezadas: [], datos: [] };
	component.editUnidadIndex = null;
	component.agregarDatosUnidad();
	expect(component.unidadesTablaConfig.datos.length).toBe(1);
	});

	it('should clean vehiculo form with limpiarDatosVehiculo', () => {
	component.vehiculoFormulario = component.fb.group({ idDeVehiculo: [1], numero: ['test'] });
	component.limpiarDatosVehiculo();
	expect(component.vehiculoFormulario.pristine).toBeTruthy();
	});

	it('should clean unidad form with limpiarDatosUnidad', () => {
	component.unidadFormulario = component.fb.group({ vinVehiculo: ['test'] });
	component.limpiarDatosUnidad();
	expect(component.unidadFormulario.pristine).toBeTruthy();
	});
});
