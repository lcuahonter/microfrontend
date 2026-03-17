import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ChofereModificationDeChoferesComponent } from './chofere.modification.de.choferes.component';
import { Chofer40103Service } from '../../../../estados/chofer40103.service';
import { Chofer40103Query } from '../../../../estados/chofer40103.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { of } from 'rxjs';

describe('ChofereModificationDeChoferesComponent', () => {
	let component: ChofereModificationDeChoferesComponent;
	let fixture: ComponentFixture<ChofereModificationDeChoferesComponent>;
	let mockBsModalService: any;
	let mockChofer40103Service: any;
	let mockChofer40103Query: any;
	let mockConsultaioQuery: any;

	beforeEach(async () => {
		mockBsModalService = { show: jest.fn().mockReturnValue({ hide: jest.fn(), setClass: jest.fn() }) };
		mockChofer40103Service = { updateDatosDelChoferExtranjeroModification: jest.fn() };
		mockChofer40103Query = { selectSolicitud$: of({ datosDelChoferExtranjerosModification: [{ numero: '1', nombre: 'A' }] }) };
		mockConsultaioQuery = { selectConsultaioState$: of({ readonly: true }) };

		await TestBed.configureTestingModule({
			imports: [ChofereModificationDeChoferesComponent],
			providers: [
				{ provide: BsModalService, useValue: mockBsModalService },
				{ provide: Chofer40103Service, useValue: mockChofer40103Service },
				{ provide: Chofer40103Query, useValue: mockChofer40103Query },
				{ provide: ConsultaioQuery, useValue: mockConsultaioQuery }
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(ChofereModificationDeChoferesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

		it('should create the component', () => {
			expect(component).toBeTruthy();
		});

		it('should initialize and subscribe on ngOnInit and set readonly', () => {
			mockConsultaioQuery.selectConsultaioState$ = of({ readonly: true });
			component.datosDelChoferExtranjeros = [];
			component.ngOnInit();
			expect(component.datosDelChoferExtranjeros).toEqual([{ numero: '1', nombre: 'A' }]);
			expect(component.isReadonly).toBe(false);
		});

		it('should select choferes', () => {
			const mockChoferes = [{ numero: '1' }, { numero: '2' }];
			component.onChofereNationalSelected(mockChoferes as any);
			expect(component.datosDelChoferExtranjerosSelected).toEqual(mockChoferes);
		});

		it('should add new row and open modal', () => {
			const template = {} as TemplateRef<unknown>;
			const abrirModalSpy = jest.spyOn(component, 'abrirModal');
			component.addNewRow(template);
			expect(component.datosChofere).toEqual({});
			expect(abrirModalSpy).toHaveBeenCalledWith(template);
		});

		it('should edit selected row and open modal', () => {
			const template = {} as TemplateRef<unknown>;
			component.datosDelChoferExtranjerosSelected = [{ numero: '1' } as any];
			const abrirModalSpy = jest.spyOn(component, 'abrirModal');
			component.editSelectedRow(template);
			expect(component.datosChofere).toEqual({ numero: '1' });
			expect(abrirModalSpy).toHaveBeenCalledWith(template);
		});

		it('should not edit if no row selected', () => {
			const template = {} as TemplateRef<unknown>;
			const abrirModalSpy = jest.spyOn(component, 'abrirModal');
			const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
			component.datosDelChoferExtranjerosSelected = [];
			component.editSelectedRow(template);
			expect(abrirModalSpy).not.toHaveBeenCalled();
			expect(warnSpy).toHaveBeenCalledWith('No rows selected for editing.');
		});

		it('should delete selected rows', () => {
			const mockData1 = { numero: '1' };
			const mockData2 = { numero: '2' };
			component.datosDelChoferExtranjeros = [mockData1, mockData2];
			component.datosDelChoferExtranjerosSelected = [mockData1];
			component.deleteSelectedRow();
			expect(component.datosDelChoferExtranjeros).toEqual([mockData2]);
			expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
		});

		it('should not delete if no row selected', () => {
			const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
			component.datosDelChoferExtranjerosSelected = [];
			component.deleteSelectedRow();
			expect(warnSpy).toHaveBeenCalledWith('No rows selected for deletion.');
		});

		it('should open modal', () => {
			const template = {} as TemplateRef<unknown>;
			component['bsModalService'] = mockBsModalService;
			component.abrirModal(template);
			expect(mockBsModalService.show).toHaveBeenCalledWith(template, { class: 'modal-fullscreen' });
		});

		it('should cancel modal', () => {
			const hideSpy = jest.fn();
			component.modalRef = { hide: hideSpy, setClass: jest.fn() } as BsModalRef;
			component.cancelModal();
			expect(hideSpy).toHaveBeenCalled();
			expect(component.modalRef).toBeNull();
		});

		it('should add new chofer if not exists', () => {
			component.datosDelChoferExtranjeros = [{ numero: '1', nombre: 'A' }] as any;
			const newChofer = { numero: '2', nombre: 'B' } as any;
			component.datosDelChoferExtranjerosSelected = [{ numero: '1', nombre: 'A' }] as any;
			component.modalRef = { hide: jest.fn(), setClass: jest.fn() } as BsModalRef;
			component.agregarModal(newChofer);
			expect(component.datosDelChoferExtranjeros).toContain(newChofer);
			expect(mockChofer40103Service.updateDatosDelChoferExtranjeroModification).toHaveBeenCalledWith(component.datosDelChoferExtranjeros);
			expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
			expect(component.modalRef).toBeNull();
		});

		it('should update existing chofer', () => {
			component.datosDelChoferExtranjeros = [{ numero: '1', nombre: 'A' }] as any;
			const updatedChofer = { numero: '1', nombre: 'B' } as any;
			component.modalRef = { hide: jest.fn(), setClass: jest.fn() } as BsModalRef;
			component.agregarModal(updatedChofer);
			expect(component.datosDelChoferExtranjeros[0]).toEqual(updatedChofer);
		});

		it('should clean up on destroy', () => {
			const nextSpy = jest.spyOn(component.destroy$, 'next');
			const completeSpy = jest.spyOn(component.destroy$, 'complete');
			component.ngOnDestroy();
			expect(nextSpy).toHaveBeenCalledWith(true);
			expect(completeSpy).toHaveBeenCalled();
		});

	it('should add new row and open modal', () => {
		const template = {} as TemplateRef<unknown>;
		const abrirModalSpy = jest.spyOn(component, 'abrirModal');
		component.addNewRow(template);
		expect(component.datosChofere).toEqual({});
		expect(abrirModalSpy).toHaveBeenCalledWith(template);
	});

	it('should edit selected row and open modal', () => {
		const template = {} as TemplateRef<unknown>;
		component.datosDelChoferExtranjerosSelected = [{ numero: '1' } as any];
		const abrirModalSpy = jest.spyOn(component, 'abrirModal');
		component.editSelectedRow(template);
		expect(component.datosChofere).toEqual({ numero: '1' });
		expect(abrirModalSpy).toHaveBeenCalledWith(template);
	});

	it('should not edit if no row selected', () => {
		const template = {} as TemplateRef<unknown>;
		const abrirModalSpy = jest.spyOn(component, 'abrirModal');
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
		component.datosDelChoferExtranjerosSelected = [];
		component.editSelectedRow(template);
		expect(abrirModalSpy).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith('No rows selected for editing.');
	});

	it('should delete selected rows', () => {
					  const mockData1 = { numero: '1' };
					  const mockData2 = { numero: '2' };
					  component.datosDelChoferExtranjeros = [mockData1, mockData2];
					  component.datosDelChoferExtranjerosSelected = [mockData1];
					  component.deleteSelectedRow();
					  expect(component.datosDelChoferExtranjeros).toEqual([mockData2]);
					  expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
	});

	it('should not delete if no row selected', () => {
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
		component.datosDelChoferExtranjerosSelected = [];
		component.deleteSelectedRow();
		expect(warnSpy).toHaveBeenCalledWith('No rows selected for deletion.');
	});

	it('should open modal', () => {
		const template = {} as TemplateRef<unknown>;
		component['bsModalService'] = mockBsModalService;
		component.abrirModal(template);
		expect(mockBsModalService.show).toHaveBeenCalledWith(template, { class: 'modal-fullscreen' });
	});

	it('should cancel modal', () => {
		const hideSpy = jest.fn();
		component.modalRef = { hide: hideSpy, setClass: jest.fn() } as BsModalRef;
		component.cancelModal();
		expect(hideSpy).toHaveBeenCalled();
		expect(component.modalRef).toBeNull();
	});

	it('should add new chofer or update existing', () => {
		component.datosDelChoferExtranjeros = [{ numero: '1', nombre: 'A' }] as any;
		const newChofer = { numero: '2', nombre: 'B' } as any;
		component.datosDelChoferExtranjerosSelected = [{ numero: '1', nombre: 'A' }] as any;
		component.modalRef = { hide: jest.fn(), setClass: jest.fn() } as BsModalRef;
		component.agregarModal(newChofer);
		expect(component.datosDelChoferExtranjeros).toContain(newChofer);
		expect(mockChofer40103Service.updateDatosDelChoferExtranjeroModification).toHaveBeenCalledWith(component.datosDelChoferExtranjeros);
		expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
		expect(component.modalRef).toBeNull();
	});

	it('should update existing chofer', () => {
		component.datosDelChoferExtranjeros = [{ numero: '1', nombre: 'A' }] as any;
		const updatedChofer = { numero: '1', nombre: 'B' } as any;
		component.modalRef = { hide: jest.fn(), setClass: jest.fn() } as BsModalRef;
		component.agregarModal(updatedChofer);
		expect(component.datosDelChoferExtranjeros[0]).toEqual(updatedChofer);
	});

	it('should clean up on destroy', () => {
		const nextSpy = jest.spyOn(component.destroy$, 'next');
		const completeSpy = jest.spyOn(component.destroy$, 'complete');
		component.ngOnDestroy();
		expect(nextSpy).toHaveBeenCalledWith(true);
		expect(completeSpy).toHaveBeenCalled();
	});
});
