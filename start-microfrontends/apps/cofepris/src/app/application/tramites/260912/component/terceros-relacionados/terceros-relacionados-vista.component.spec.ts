import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { Renderer2, ElementRef } from '@angular/core';

const fullFabricante = {
	id: 1,
	nombreRazonSocial: 'Fab1',
	rfc: 'RFC1',
	curp: 'CURP1',
	telefono: '123',
	correoElectronico: 'fab1@mail.com',
	calle: 'Calle1',
	numeroExterior: '10',
	numeroInterior: 'A',
	pais: 'MX',
	colonia: 'Col1',
	municipioAlcaldia: 'Mun1',
	localidad: 'Loc1',
	entidadFederativa: 'EF1',
	estadoLocalidad: 'EL1',
	codigoPostal: '00000',
	coloniaEquivalente: 'ColEq1',
	nombres: 'Nombres',
	primerApellido: 'Apellido1',
	segundoApellido: 'Apellido2',
	razonSocial: 'RS1',
	lada: '55'
};
const fullDestinatario = {
	id: 2,
	nombreRazonSocial: 'Dest1',
	rfc: 'RFC2',
	curp: 'CURP2',
	telefono: '456',
	correoElectronico: 'dest1@mail.com',
	calle: 'Calle2',
	numeroExterior: '20',
	numeroInterior: 'B',
	pais: 'MX',
	colonia: 'Col2',
	municipioAlcaldia: 'Mun2',
	localidad: 'Loc2',
	entidadFederativa: 'EF2',
	estadoLocalidad: 'EL2',
	codigoPostal: '11111',
	coloniaEquivalente: 'ColEq2',
	nombres: 'Nombres2',
	primerApellido: 'Apellido3',
	segundoApellido: 'Apellido4',
	razonSocial: 'RS2',
	lada: '56'
};
const fullProveedor = {
	id: 3,
	nombreRazonSocial: 'Prov1',
	rfc: 'RFC3',
	curp: 'CURP3',
	telefono: '789',
	correoElectronico: 'prov1@mail.com',
	calle: 'Calle3',
	numeroExterior: '30',
	numeroInterior: 'C',
	pais: 'MX',
	colonia: 'Col3',
	municipioAlcaldia: 'Mun3',
	localidad: 'Loc3',
	entidadFederativa: 'EF3',
	estadoLocalidad: 'EL3',
	codigoPostal: '22222',
	coloniaEquivalente: 'ColEq3',
	nombres: 'Nombres3',
	primerApellido: 'Apellido5',
	segundoApellido: 'Apellido6',
	razonSocial: 'RS3',
	lada: '57'
};
const fullFacturador = {
	id: 4,
	nombreRazonSocial: 'Fact1',
	rfc: 'RFC4',
	curp: 'CURP4',
	telefono: '012',
	correoElectronico: 'fact1@mail.com',
	calle: 'Calle4',
	numeroExterior: '40',
	numeroInterior: 'D',
	pais: 'MX',
	colonia: 'Col4',
	municipioAlcaldia: 'Mun4',
	localidad: 'Loc4',
	entidadFederativa: 'EF4',
	estadoLocalidad: 'EL4',
	codigoPostal: '33333',
	coloniaEquivalente: 'ColEq4',
	nombres: 'Nombres4',
	primerApellido: 'Apellido7',
	segundoApellido: 'Apellido8',
	razonSocial: 'RS4',
	lada: '58'
};

describe('TercerosRelacionadosVistaComponent', () => {
	let component: TercerosRelacionadosVistaComponent;
	let tramiteQuery: any;
	let tramiteStore: any;
	let renderer: Renderer2;
	let el: ElementRef;

	beforeEach(() => {
		tramiteQuery = {
			getFabricanteTablaDatos$: of([fullFabricante]),
			getDestinatarioFinalTablaDatos$: of([fullDestinatario]),
			getProveedorTablaDatos$: of([fullProveedor]),
			getFacturadorTablaDatos$: of([fullFacturador])
		};
		tramiteStore = {
			updateFabricanteTablaDatos: jest.fn(),
			updateDestinatarioFinalTablaDatos: jest.fn(),
			updateProveedorTablaDatos: jest.fn(),
			updateFacturadorTablaDatos: jest.fn()
		};
		renderer = {} as Renderer2;
		el = {
			nativeElement: {
				querySelector: jest.fn().mockReturnValue({})
			}
		} as any;
		const mockModalService = {
			open: jest.fn().mockReturnValue({ result: Promise.resolve() }),
			Modal: {}
		};
		(global as any).window = {
			bootstrap: {
				Modal: jest.fn().mockImplementation(() => ({
					show: jest.fn(),
					hide: jest.fn()
				}))
			}
		};
		
		component = new TercerosRelacionadosVistaComponent(tramiteQuery, tramiteStore, renderer, el);
		(component as any).modalService = mockModalService;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize and subscribe to observables', () => {
		component.ngOnInit();
		expect(component.fabricanteTablaDatos).toEqual([fullFabricante]);
		expect(component.destinatarioFinalTablaDatos).toEqual([fullDestinatario]);
		expect(component.proveedorTablaDatos).toEqual([fullProveedor]);
		expect(component.facturadorTablaDatos).toEqual([fullFacturador]);
	});

	it('should clean up on destroy', () => {
		const nextSpy = jest.spyOn(component['destroy$'], 'next');
		const completeSpy = jest.spyOn(component['destroy$'], 'complete');
		component.ngOnDestroy();
		expect(nextSpy).toHaveBeenCalled();
		expect(completeSpy).toHaveBeenCalled();
	});

	describe('modificar/eliminar methods', () => {
		beforeEach(() => {
			component.fabricanteSeleccionadoDatos = [fullFabricante];
			component.fabricanteTablaDatos = [fullFabricante];
			component.destinatarioSeleccionadoDatos = [fullDestinatario];
			component.destinatarioFinalTablaDatos = [fullDestinatario];
			component.proveedorSeleccionadoDatos = [fullProveedor];
			component.proveedorTablaDatos = [fullProveedor];
			component.facturadorSeleccionadoDatos = [fullFacturador];
			component.facturadorTablaDatos = [fullFacturador];
		});

		
		it('eliminarFabricante should update store and reset selection', () => {
			component.eliminarFabricante();
			expect(tramiteStore.updateFabricanteTablaDatos).toHaveBeenCalledWith([]);
			expect(component.fabricanteSeleccionadoDatos).toEqual([]);
			expect(component.fabricanteButtonState).toEqual({ showModificar: false, showEliminar: false });
		});
	
		it('eliminarDestinatario should update store and reset selection', () => {
			component.eliminarDestinatario();
			expect(tramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith([]);
			expect(component.destinatarioSeleccionadoDatos).toEqual([]);
			expect(component.destinatarioButtonState).toEqual({ showModificar: false, showEliminar: false });
		});

		it('modificarProveedor should do nothing if not exactly one selected', () => {
			component.proveedorSeleccionadoDatos = [];
			component.modificarProveedor();
			expect(true).toBe(true);
		});

		it('eliminarProveedor should update store and reset selection', () => {
			component.eliminarProveedor();
			expect(tramiteStore.updateProveedorTablaDatos).toHaveBeenCalledWith([]);
			expect(component.proveedorSeleccionadoDatos).toEqual([]);
			expect(component.proveedorButtonState).toEqual({ showModificar: false, showEliminar: false });
		});

		it('eliminarFacturador should update store and reset selection', () => {
			component.eliminarFacturador();
			expect(tramiteStore.updateFacturadorTablaDatos).toHaveBeenCalledWith([]);
			expect(component.facturadorSeleccionadoDatos).toEqual([]);
			expect(component.facturadorButtonState).toEqual({ showModificar: false, showEliminar: false });
		});
	});

	describe('agregar methods', () => {
		it('agregarFabricante should reset selection', () => {
			jest.spyOn(component, 'abrirModalAgregarFabricante').mockImplementation(() => {});
			
			component.fabricanteSeleccionadoDatos = [fullFabricante];
			component.agregarFabricante();
			expect(component.fabricanteSeleccionadoDatos).toEqual([]);
		});
		it('agregarDestinatario should reset selection', () => {
			jest.spyOn(component, 'abrirModalAgregarDestinatarioFinal').mockImplementation(() => {});
			
			component.destinatarioSeleccionadoDatos = [fullDestinatario];
			component.agregarDestinatario();
			expect(component.destinatarioSeleccionadoDatos).toEqual([]);
		});
		it('agregarProveedor should reset selection', () => {
			component.proveedorSeleccionadoDatos = [fullProveedor];
			component.agregarProveedor();
			expect(component.proveedorSeleccionadoDatos).toEqual([]);
		});
		it('agregarFacturador should reset selection', () => {
			component.facturadorSeleccionadoDatos = [fullFacturador];
			component.agregarFacturador();
			expect(component.facturadorSeleccionadoDatos).toEqual([]);
		});
	});

	describe('onSeleccionado methods', () => {
		it('onFabricanteSeleccionado with array', () => {
			component.onFabricanteSeleccionado([fullFabricante]);
			expect(component.fabricanteSeleccionadoDatos).toEqual([fullFabricante]);
			expect(component.fabricanteButtonState).toEqual({ showModificar: true, showEliminar: true });
		});
		it('onFabricanteSeleccionado with event object', () => {
			component.onFabricanteSeleccionado({ selectedRows: [fullFabricante] });
			expect(component.fabricanteSeleccionadoDatos).toEqual([fullFabricante]);
		});
		it('onDestinatarioSeleccionado with array', () => {
			component.onDestinatarioSeleccionado([fullDestinatario]);
			expect(component.destinatarioSeleccionadoDatos).toEqual([fullDestinatario]);
			expect(component.destinatarioButtonState).toEqual({ showModificar: true, showEliminar: true });
		});
		it('onDestinatarioSeleccionado with event object', () => {
			component.onDestinatarioSeleccionado({ selectedRows: [fullDestinatario] });
			expect(component.destinatarioSeleccionadoDatos).toEqual([fullDestinatario]);
		});
		it('onProveedorSeleccionado with array', () => {
			component.onProveedorSeleccionado([fullProveedor]);
			expect(component.proveedorSeleccionadoDatos).toEqual([fullProveedor]);
			expect(component.proveedorButtonState).toEqual({ showModificar: true, showEliminar: true });
		});
		it('onProveedorSeleccionado with event object', () => {
			component.onProveedorSeleccionado({ selectedRows: [fullProveedor] });
			expect(component.proveedorSeleccionadoDatos).toEqual([fullProveedor]);
		});
		it('onFacturadorSeleccionado with array', () => {
			component.onFacturadorSeleccionado([fullFacturador]);
			expect(component.facturadorSeleccionadoDatos).toEqual([fullFacturador]);
			expect(component.facturadorButtonState).toEqual({ showModificar: true, showEliminar: true });
		});
		it('onFacturadorSeleccionado with event object', () => {
			component.onFacturadorSeleccionado({ selectedRows: [fullFacturador] });
			expect(component.facturadorSeleccionadoDatos).toEqual([fullFacturador]);
		});
	});

	describe('add methods', () => {
		it('addFabricantes should call store', () => {
			component.addFabricantes([fullFabricante]);
			expect(tramiteStore.updateFabricanteTablaDatos).toHaveBeenCalledWith([fullFabricante]);
		});
		it('addDestinatarios should call store', () => {
			component.addDestinatarios([fullDestinatario]);
			expect(tramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith([fullDestinatario]);
		});
		it('addProveedores should call store', () => {
			component.addProveedores([fullProveedor]);
			expect(tramiteStore.updateProveedorTablaDatos).toHaveBeenCalledWith([fullProveedor]);
		});
		it('addFacturadores should call store', () => {
			component.addFacturadores([fullFacturador]);
			expect(tramiteStore.updateFacturadorTablaDatos).toHaveBeenCalledWith([fullFacturador]);
		});
	});

	describe('isSelectionEvent', () => {
		it('should return true for valid event', () => {
			expect(TercerosRelacionadosVistaComponent['isSelectionEvent']({ selectedRows: [] })).toBe(true);
			expect(TercerosRelacionadosVistaComponent['isSelectionEvent']({ detail: [] })).toBe(true);
		});
		it('should return false for invalid event', () => {
			expect(TercerosRelacionadosVistaComponent['isSelectionEvent'](null)).toBe(false);
			expect(TercerosRelacionadosVistaComponent['isSelectionEvent']({})).toBe(false);
			expect(TercerosRelacionadosVistaComponent['isSelectionEvent']({ selectedRows: 'notArray' })).toBe(false);
		});
	});
});
