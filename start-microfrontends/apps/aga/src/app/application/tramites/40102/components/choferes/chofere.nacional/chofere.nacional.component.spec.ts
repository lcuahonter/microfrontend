import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TemplateRef } from '@angular/core';
import { of, Subject } from 'rxjs';
import { ChofereNacionalComponent } from './chofere.nacional.component';
import { Chofer40102Service } from '../../../estados/chofer40102.service';
import { Chofer40102Query } from '../../../estados/chofer40102.query';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DatosDelChoferNacional } from '../../../models/registro-muestras-mercancias.model';
import { Choferesnacionales40102State } from '../../../estados/chofer40102.store';

describe('ChofereNacionalComponent', () => {
  let component: ChofereNacionalComponent;
  let fixture: ComponentFixture<ChofereNacionalComponent>;
  const bsModalServiceMock = {
    show: jest.fn()
  } as unknown as jest.Mocked<BsModalService>;

  let mockchofer40102Service: jest.Mocked<Chofer40102Service>;
  let mockchofer40102Query: jest.Mocked<Chofer40102Query>;
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

    const chofer40102ServiceMock = {
      updateDatosDelChoferNacional: jest.fn()
    } as unknown as jest.Mocked<Chofer40102Service>;

    const chofer40102QueryMock = {
      selectSolicitud$: of({ datosDelChoferNacionalAlta: mockChoferList })
    } as unknown as jest.Mocked<Chofer40102Query>;

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
        { provide: Chofer40102Service, useValue: chofer40102ServiceMock },
        { provide: Chofer40102Query, useValue: chofer40102QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChofereNacionalComponent);
    component = fixture.componentInstance;
    mockchofer40102Service = TestBed.inject(Chofer40102Service) as jest.Mocked<Chofer40102Service>;
    mockchofer40102Query = TestBed.inject(Chofer40102Query) as jest.Mocked<Chofer40102Query>;
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
        mockchofer40102Service,
        mockchofer40102Query,
        mockConsultaioQuery
      );

      testComponent.ngOnInit();

      expect(testComponent.isReadonly).toBe(true);
      expect(testComponent.datosConsulta).toEqual(readonlyState);
    });

    it('should handle empty chofer data', () => {
      mockchofer40102Query.selectSolicitud$ = of({ datosDelChoferNacionalAlta: null } as unknown as Choferesnacionales40102State);
      
      component.ngOnInit();
      
      expect(component.datosDelChoferNacional).toEqual([]);
    });
  });

  describe('onChofereNationalSelected', () => {
    it('should update selected choferes', () => {
      const selectedChoferes = [mockChoferData];
      
      component.onChofereNationalSelected(selectedChoferes);
      
      expect(component.datosDelChoferNacionalSelected).toEqual(selectedChoferes);
    });

    it('should handle empty selection', () => {
      component.onChofereNationalSelected([]);
      
      expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });
  });

  describe('addNewRow', () => {
    it('should reset datosChofere and open modal', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
      const openModalSpy = jest.spyOn(component, 'openModal').mockImplementation();
      
      component.addNewRow(mockTemplate);
      
      expect(component.datosChofere).toEqual({} as DatosDelChoferNacional);
      expect(openModalSpy).toHaveBeenCalledWith(mockTemplate);
    });
  });

  describe('editSelectedRow', () => {
    it('should edit selected row when row is selected', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
      component.datosDelChoferNacionalSelected = [mockChoferData];
      const openModalSpy = jest.spyOn(component, 'openModal').mockImplementation();
      
      component.editSelectedRow(mockTemplate);
      
      expect(component.datosChofere).toEqual(mockChoferData);
      expect(openModalSpy).toHaveBeenCalledWith(mockTemplate);
    });

    it('should show warning when no row is selected', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
      component.datosDelChoferNacionalSelected = [];
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const openModalSpy = jest.spyOn(component, 'openModal').mockImplementation();
      
      component.editSelectedRow(mockTemplate);
      
      expect(consoleSpy).toHaveBeenCalledWith('No rows selected for editing.');
      expect(openModalSpy).not.toHaveBeenCalled();
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

  describe('openModal', () => {
    it('should open modal with correct configuration', () => {
      bsModalServiceMock.show.mockReturnValue(mockModalRef);

      const mockTemplate = {} as TemplateRef<unknown>;
      const testComponent = new ChofereNacionalComponent(
        bsModalServiceMock,
        mockchofer40102Service,
        mockchofer40102Query,
        mockConsultaioQuery
      );

      testComponent.openModal(mockTemplate);
      
      expect(bsModalServiceMock.show).toHaveBeenCalledWith(mockTemplate, {
        class: 'modal-fullscreen'
      });
      expect(testComponent.modalRef).toBe(mockModalRef);
    });
  });

  describe('cancelModal', () => {
    it('should hide modal and reset reference', () => {
      component.modalRef = mockModalRef;
      
      component.cancelModal();
      
      expect(mockModalRef.hide).toHaveBeenCalled();
      expect(component.modalRef).toBeNull();
    });

    it('should handle null modal reference', () => {
      component.modalRef = null;
      
      expect(() => component.cancelModal()).not.toThrow();
      expect(component.modalRef).toBeNull();
    });
  });

  describe('addModal', () => {
    beforeEach(() => {
      component.datosDelChoferNacional = [...mockChoferList];
      component.datosDelChoferNacionalSelected = [mockChoferData];
      component.modalRef = mockModalRef;
      jest.spyOn(component, 'cancelModal').mockImplementation();
    });

    it('should add new chofer data and update service', () => {
      const newChofer: DatosDelChoferNacional = {
        id: '3',
        nombre: 'Carlos López',
        licencia: 'GHI789',
        telefono: '555-9012'
      } as unknown as DatosDelChoferNacional;

      component.addModal(newChofer);
      
      expect(component.datosDelChoferNacional).toContain(newChofer);
      expect(component.datosDelChoferNacional.length).toBe(3);
      expect(component.datosDelChoferNacionalSelected).toEqual([]);
      expect(mockchofer40102Service.updateDatosDelChoferNacional).toHaveBeenCalledWith(
        component.datosDelChoferNacional
      );
      expect(component.cancelModal).toHaveBeenCalled();
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

      component.addModal(newChofer);
      expect(component.datosDelChoferNacional).toContain(newChofer);
      
      component.onChofereNationalSelected([newChofer]);
      expect(component.datosDelChoferNacionalSelected).toContain(newChofer);
      
      component.deleteSelectedRow();
      expect(component.datosDelChoferNacional).not.toContain(newChofer);
      expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });
  });
});
