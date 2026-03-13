import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TemplateRef } from '@angular/core';
import { of, Subject } from 'rxjs';
import { ChofereNacionalComponent } from './chofere.nacional.component';
import { Chofer40103Service } from '../../../estados/chofer40103.service';
import { Chofer40103Query } from '../../../estados/chofer40103.query';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DatosDelChoferNacional } from '../../../models/registro-muestras-mercancias.model';
import { Choferesnacionales40103State } from '../../../estados/chofer40103.store';

describe('ChofereNacionalComponent', () => {
  let component: ChofereNacionalComponent;
  let fixture: ComponentFixture<ChofereNacionalComponent>;
  const bsModalServiceMock = {
    show: jest.fn()
  } as unknown as jest.Mocked<BsModalService>;

  let mockChofer40103Service: jest.Mocked<Chofer40103Service>;
  let mockChofer40103Query: jest.Mocked<Chofer40103Query>;
  let mockConsultaioQuery: ConsultaioQuery = {
    selectConsultaioState$: of({
      readonly: true,
      update: true,
    } as ConsultaioState),
  } as ConsultaioQuery;
  let mockModalRef: jest.Mocked<BsModalRef>;

  const mockChoferData: DatosDelChoferNacional = {
    id: '1',
    nombre: 'Juan Pérez',
    licencia: 'ABC123',
    telefono: '555-1234'
  } as unknown as DatosDelChoferNacional;

  const mockChoferList: DatosDelChoferNacional[] = [
    mockChoferData,
    {
      id: '2',
      nombre: 'María García',
      licencia: 'DEF456',
      telefono: '555-5678'
    } as unknown as DatosDelChoferNacional
  ];

  beforeEach(async () => {

    const chofer40103ServiceMock = {
      updateDatosDelChoferNacional: jest.fn()
    } as unknown as jest.Mocked<Chofer40103Service>;

    const chofer40103QueryMock = {
      selectSolicitud$: of({ datosDelChoferNacionalAlta: mockChoferList })
    } as unknown as jest.Mocked<Chofer40103Query>;

    const consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false })
    } as unknown as jest.Mocked<ConsultaioQuery>;

    const modalRefMock = {
      hide: jest.fn()
    } as unknown as jest.Mocked<BsModalRef>;

    await TestBed.configureTestingModule({
      imports: [ChofereNacionalComponent],
      providers: [
        { provide: BsModalService, useValue: bsModalServiceMock },
        { provide: Chofer40103Service, useValue: chofer40103ServiceMock },
        { provide: Chofer40103Query, useValue: chofer40103QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChofereNacionalComponent);
    component = fixture.componentInstance;
    mockChofer40103Service = TestBed.inject(Chofer40103Service) as jest.Mocked<Chofer40103Service>;
    mockChofer40103Query = TestBed.inject(Chofer40103Query) as jest.Mocked<Chofer40103Query>;
    mockModalRef = modalRefMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component with chofer data', () => {
      component.ngOnInit();
      
      expect(component.datosDelChoferNacional).toEqual(mockChoferList);
      expect(component.isReadonly).toBe(false);
    });

    it('should set readonly mode when consultaio state is readonly', () => {
      const readonlyState = { readonly: true, update: true } as unknown as ConsultaioState;
      mockConsultaioQuery.select = jest.fn().mockReturnValue(of(readonlyState));

      const testComponent = new ChofereNacionalComponent(
        bsModalServiceMock,
        mockChofer40103Service,
        mockChofer40103Query,
        mockConsultaioQuery
      );

      testComponent.ngOnInit();

      expect(testComponent.isReadonly).toBe(true);
      expect(testComponent.datosConsulta).toEqual(readonlyState);
    });

    it('should handle empty chofer data', () => {
      mockChofer40103Query.selectSolicitud$ = of({ datosDelChoferNacionalAlta: null } as unknown as Choferesnacionales40103State);

      component.ngOnInit();

      expect(component.datosDelChoferNacional).toEqual([]);
    });
  });

  describe('onChofereNationalSelected', () => {
    it('should update selected choferes', () => {
      const selected = [
        { id: '1', nombre: 'Juan Pérez', licencia: 'ABC123', telefono: '555-1234', correoElectronico: 'juan.perez@email.com' },
        { id: '2', nombre: 'María García', licencia: 'DEF456', telefono: '555-5678', correoElectronico: 'maria.garcia@email.com' }
      ];
      component.onChofereNationalSelected(selected);
      expect(component.datosDelChoferNacionalSelected).toEqual(selected);
    });
    it('should handle empty selection', () => {
      component.onChofereNationalSelected([]);
      expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });
  });

  describe('addNewRow', () => {
    it('should reset datosChofere and open modal', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
      const abrirModalSpy = jest.spyOn(component, 'abrirModal').mockImplementation();
      component.addNewRow(mockTemplate);
      expect(component.datosChofere).toEqual({} as DatosDelChoferNacional);
      expect(abrirModalSpy).toHaveBeenCalledWith(mockTemplate);
    });
  });

  describe('editSelectedRow', () => {
    it('should edit selected row when row is selected', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
      component.datosDelChoferNacionalSelected = [mockChoferData];
      const abrirModalSpy = jest.spyOn(component, 'abrirModal').mockImplementation();
      component.editSelectedRow(mockTemplate);
      expect(component.datosChofere).toEqual(mockChoferData);
      expect(abrirModalSpy).toHaveBeenCalledWith(mockTemplate);
    });

    it('should show warning when no row is selected', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
      component.datosDelChoferNacionalSelected = [];
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const abrirModalSpy = jest.spyOn(component, 'abrirModal').mockImplementation();
      component.editSelectedRow(mockTemplate);
      expect(consoleSpy).toHaveBeenCalledWith('No rows selected for editing.');
      expect(abrirModalSpy).not.toHaveBeenCalled();
    });
  });

  describe('deleteSelectedRow', () => {
    beforeEach(() => {
      component.datosDelChoferNacional = [...mockChoferList];
    });

    it('should delete selected rows', () => {
      component.datosDelChoferNacionalSelected = [mockChoferData];
      
      component.deleteSelectedRow();
      
      expect(component.datosDelChoferNacional).toEqual([mockChoferList[1]]);
      expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });

    it('should delete multiple selected rows', () => {
      component.datosDelChoferNacionalSelected = mockChoferList;
      
      component.deleteSelectedRow();
      
      expect(component.datosDelChoferNacional).toEqual([]);
      expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });

    it('should show warning when no row is selected', () => {
      component.datosDelChoferNacionalSelected = [];
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const originalData = [...component.datosDelChoferNacional];
      
      component.deleteSelectedRow();
      
      expect(consoleSpy).toHaveBeenCalledWith('No rows selected for deletion.');
      expect(component.datosDelChoferNacional).toEqual(originalData);
    });
  });

  describe('abrirModal', () => {
    it('should open modal with correct configuration', () => {
      bsModalServiceMock.show.mockReturnValue(mockModalRef);
      const mockTemplate = {} as TemplateRef<unknown>;
      const testComponent = new ChofereNacionalComponent(
        bsModalServiceMock,
        mockChofer40103Service,
        mockChofer40103Query,
        mockConsultaioQuery
      );
      testComponent.abrirModal(mockTemplate);
      expect(bsModalServiceMock.show).toHaveBeenCalledWith(mockTemplate, {
        class: 'modal-fullscreen'
      });
      expect(testComponent.modalRef).toBe(mockModalRef);
    });
  });

  describe('cancelarModal', () => {
    it('should hide modal and reset reference', () => {
      component.modalRef = mockModalRef;
      component.cancelarModal();
      expect(mockModalRef.hide).toHaveBeenCalled();
      expect(component.modalRef).toBeNull();
    });

    it('should handle null modal reference', () => {
      component.modalRef = null;
      expect(() => component.cancelarModal()).not.toThrow();
      expect(component.modalRef).toBeNull();
    });
  });

  describe('agregarModal', () => {
    beforeEach(() => {
      component.datosDelChoferNacional = [...mockChoferList];
      component.datosDelChoferNacionalSelected = [mockChoferData];
      component.modalRef = mockModalRef;
      jest.spyOn(component, 'cancelarModal').mockImplementation();
    });

    it('should add new chofer data and update service', () => {
      const newChofer: DatosDelChoferNacional = {
        id: '3',
        nombre: 'Carlos López',
        licencia: 'GHI789',
        telefono: '555-9012'
      } as unknown as DatosDelChoferNacional;
      component.agregarModal(newChofer);
      expect(component.datosDelChoferNacional).toContain(newChofer);
      expect(component.datosDelChoferNacional.length).toBe(3);
      expect(component.datosDelChoferNacionalSelected).toEqual([]);
      expect(mockChofer40103Service.updateDatosDelChoferNacional).toHaveBeenCalledWith(component.datosDelChoferNacional);
      expect(component.cancelarModal).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy subject', () => {
      const nextSpy = jest.spyOn(component.destroy$, 'next');
      const completeSpy = jest.spyOn(component.destroy$, 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalledWith(true);
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Component Properties', () => {
    it('should have correct initial values', () => {
      expect(component.datosDelChoferNacional).toEqual([]);
      expect(component.datosDelChoferNacionalSelected).toEqual([]);
      expect(component.datosChofere).toEqual({} as DatosDelChoferNacional);
      expect(component.isReadonly).toBe(false);
      expect(component.destroy$).toBeInstanceOf(Subject);
    });

    it('should have correct table configuration', () => {
      expect(component.tipoSeleccionTabla).toBeDefined();
      expect(component.ConfiguracionColumna).toBeDefined();
      expect(Array.isArray(component.ConfiguracionColumna)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow: add, select, edit, delete', () => {
      component.ngOnInit();
      
      const newChofer: DatosDelChoferNacional = {
        id: '3',
        nombre: 'Test Chofer',
        licencia: 'TEST123',
        telefono: '555-0000'
      } as unknown as DatosDelChoferNacional;

  component.agregarModal(newChofer);
  expect(component.datosDelChoferNacional).toContain(newChofer);
  component.onChofereNationalSelected([newChofer]);
  expect(component.datosDelChoferNacionalSelected).toContain(newChofer);
  component.deleteSelectedRow();
  expect(component.datosDelChoferNacional).not.toContain(newChofer);
  expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });
  });
});
