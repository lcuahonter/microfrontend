import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChofereNacionalRetiradaComponent } from './chofere.nacional.retirada.component';

describe('ChofereNacionalRetiradaComponent', () => {
	let component: ChofereNacionalRetiradaComponent;
	let fixture: ComponentFixture<ChofereNacionalRetiradaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
      imports: [ChofereNacionalRetiradaComponent, HttpClientTestingModule],
			declarations: [],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(ChofereNacionalRetiradaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	it('should call ngOnDestroy without error', () => {
		expect(() => component.ngOnDestroy()).not.toThrow();
	});

	it('should have default properties', () => {
		expect(component).toBeDefined();
	});

		it('should initialize and subscribe on ngOnInit', () => {
			component.datosDelChoferNacional = [];
			expect(() => component.ngOnInit()).not.toThrow();
		});

		it('should clean up on destroy', () => {
			const nextSpy = jest.spyOn(component.destroyed$, 'next');
			const completeSpy = jest.spyOn(component.destroyed$, 'complete');
			component.ngOnDestroy();
			expect(nextSpy).toHaveBeenCalled();
			expect(completeSpy).toHaveBeenCalled();
		});

		it('should select choferes', () => {
			const mockChoferes = [
				{ id: 1, nombre: 'A', telefono: '5555555555', correoElectronico: 'test1@email.com' },
				{ id: 2, nombre: 'B', telefono: '5555555556', correoElectronico: 'test2@email.com' }
			];
			component.onChofereNationalSelected(mockChoferes as any);
			expect(component.datosDelChoferNacionalSelected).toEqual(mockChoferes);
		});

		it('should add new row and open modal', () => {
			const template = {} as any;
			const abrirModalSpy = jest.spyOn(component, 'abrirModal');
			component.agregarNuevaFila(template);
			expect(component.datosChofere).toEqual({});
			expect(abrirModalSpy).toHaveBeenCalledWith(template);
		});

		it('should edit selected row and open modal', () => {
			const template = {} as any;
		component.datosDelChoferNacionalSelected = [{ id: 1, nombre: 'A', telefono: '5555555555', correoElectronico: 'test1@email.com' } as any];
			const abrirModalSpy = jest.spyOn(component, 'abrirModal');
			component.editSelectedRow(template);
		expect(component.datosChofere).toEqual({ id: 1, nombre: 'A', telefono: '5555555555', correoElectronico: 'test1@email.com' });
			expect(abrirModalSpy).toHaveBeenCalledWith(template);
		});

		it('should not edit if no row selected', () => {
			const template = {} as any;
			const abrirModalSpy = jest.spyOn(component, 'abrirModal');
			component.datosDelChoferNacionalSelected = [];
			component.editSelectedRow(template);
			expect(abrirModalSpy).not.toHaveBeenCalled();
		});

		it('should delete selected rows', () => {
					  const mockData1 = { id: 1, nombre: 'A', telefono: '5555555555', correoElectronico: 'test1@email.com' };
					  const mockData2 = { id: 2, nombre: 'B', telefono: '5555555556', correoElectronico: 'test2@email.com' };
					  component.datosDelChoferNacional = [mockData1, mockData2];
					  component.datosDelChoferNacionalSelected = [mockData1];
					  component.eliminarFilaSeleccionada();
					  expect(component.datosDelChoferNacional).toEqual([mockData2]);
					  expect(component.datosDelChoferNacionalSelected).toEqual([]);
		});

		it('should not delete if no row selected', () => {
			component.datosDelChoferNacional = [
				{ id: 1, nombre: 'A', telefono: '5555555555', correoElectronico: 'test1@email.com' },
				{ id: 2, nombre: 'B', telefono: '5555555556', correoElectronico: 'test2@email.com' }
			] as any;
			component.datosDelChoferNacionalSelected = [];
			component.eliminarFilaSeleccionada();
			expect(component.datosDelChoferNacional).toEqual([
				{ id: 1, nombre: 'A', telefono: '5555555555', correoElectronico: 'test1@email.com' },
				{ id: 2, nombre: 'B', telefono: '5555555556', correoElectronico: 'test2@email.com' }
			]);
		});

		it('should open modal', () => {
			const template = {} as any;
			const showSpy = jest.fn();
			Object.defineProperty(component, 'bsModalService', {
				value: { show: showSpy },
			});
			component.abrirModal(template);
			expect(showSpy).toHaveBeenCalledWith(template, { class: 'modal-fullscreen' });
		});

		it('should cancel modal', () => {
			const hideSpy = jest.fn();
			component.modalRef = { hide: hideSpy } as any;
			component.cancelarModal();
			expect(hideSpy).toHaveBeenCalled();
			expect(component.modalRef).toBeNull();
		});

		it('should add new chofer and update service', () => {
			component.datosDelChoferNacional = [];
			component.datosDelChoferNacionalSelected = [];
			component.modalComponent = {} as any;
			component.chofer40103Service = { updateDatosDelChoferNacionalRetirada: jest.fn() } as any;
		const data = { id: 1, nombre: 'A', telefono: '5555555555', correoElectronico: 'test1@email.com' } as any;
			const cancelarModalSpy = jest.spyOn(component, 'cancelarModal');
			component.agregarModal(data);
			expect(component.datosDelChoferNacional).toContain(data);
			expect(component.chofer40103Service.updateDatosDelChoferNacionalRetirada).toHaveBeenCalledWith(component.datosDelChoferNacional);
			expect(component.datosDelChoferNacionalSelected).toEqual([]);
			expect(cancelarModalSpy).toHaveBeenCalled();
		});
});
