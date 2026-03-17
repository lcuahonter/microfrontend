import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateRef, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, Subject, throwError } from 'rxjs';
import { ChofereRetiradaDeChoferesComponent } from './chofere.retirada.de.choferes.component';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Chofer40103Query } from '../../../../estados/chofer40103.query';
import { Chofer40103Service } from '../../../../estados/chofer40103.service';
import { Choferesnacionales40103State } from '../../../../estados/chofer40103.store';
import { DatosDeChoferesExtranjerosDialogComponent } from '../dialog/data.de.choferes.extranjeros.dialog.component';
import { ChoferesExtranjeros } from '../../../../models/registro-muestras-mercancias.model';
import { CHOFERES_EXTRANJEROS_TABLA } from '../../../../enum/choferes.enum';

@Component({
  selector: 'app-tabla-dinamica',
  template: '<div>Mock TablaDinamicaComponent</div>',
  inputs: ['configuracionColumna', 'data', 'tipoSeleccion', 'isReadonly'],
  outputs: ['seleccionadosChange'],
  standalone: true
})
class MockTablaDinamicaComponent {
  configuracionColumna: any;
  data: any;
  tipoSeleccion: any;
  isReadonly: boolean = false;
  seleccionadosChange = new Subject<any>();
}

@Component({
  selector: 'app-datos-de-choferes-extranjeros-dialog',
  template: '<div>Mock DatosDeChoferesExtranjerosDialogComponent</div>',
  inputs: ['datosChofer', 'isReadonly'],
  outputs: ['saved', 'cancelled'],
  standalone: true
})
class MockDatosDeChoferesExtranjerosDialogComponent {
  datosChofer: any;
  isReadonly: boolean = false;
  saved = new Subject<any>();
  cancelled = new Subject<void>();
}

describe('ChofereRetiradaDeChoferesComponent', () => {
  let component: ChofereRetiradaDeChoferesComponent;
  let fixture: ComponentFixture<ChofereRetiradaDeChoferesComponent>;
  let mockBsModalService: jest.Mocked<BsModalService>;
  let mockChofer40103Service: jest.Mocked<Chofer40103Service>;
  let mockChofer40103Query: jest.Mocked<Chofer40103Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockModalRef: jest.Mocked<BsModalRef>;

  const mockChoferesExtranjeros: ChoferesExtranjeros[] = [
    {
      numero: '001',
      primerApellido: 'Doe',
      segundoApellido: 'Smith',
      nacionalidad: 'Estadounidense',
      numeroDeGafete: 'G12345',
      vigenciaGafete: '2025-12-31',
      numeroDelSeguroSocial: '12345678901',
      numberDeIdeFiscal: 'ABC123456XYZ1',
      pais: 'USA',
      codigoPostal: '12345',
      estado: 'California',
      calle: 'Main Street',
      numeroExterior: '123',
      numeroInterior: 'A',
      paisDeResidencia: 'USA',
      ciudad: 'Los Angeles',
      correoElectronico: 'john.doe@example.com',
      telefono: '555-1234'
    },
    {
      numero: '002',
      primerApellido: 'Garcia',
      segundoApellido: 'Lopez',
      nacionalidad: 'Mexicana',
      numeroDeGafete: 'G67890',
      vigenciaGafete: '2024-11-30',
      numeroDelSeguroSocial: '98765432109',
      numberDeIdeFiscal: 'XYZ789012ABC3',
      pais: 'Mexico',
      codigoPostal: '03100',
      estado: 'CDMX',
      calle: 'Insurgentes',
      numeroExterior: '456',
      numeroInterior: 'B',
      paisDeResidencia: 'Mexico',
      ciudad: 'Mexico City',
      correoElectronico: 'maria.garcia@example.com',
      telefono: '555-5678'
    }
  ];

  const mockConsultaioState: ConsultaioState = {
    readonly: false,
    update: true,
    procedureId: 'P001',
    parameter: 'test-param',
    department: 'AGA',
    folioTramite: 'F12345',
  } as unknown as ConsultaioState;

  const mockSolicitudState: Choferesnacionales40103State = {
    nombre: 'Test',
    primerApellido: 'User',
    segundoApellido: 'Example',
    datosDelChoferNacionalAlta: [],
    datosDelChoferNacionalModification: [],
    datosDelChoferNacionalRetirada: [],
    datosDelChoferExtranjerosAlta: [],
    datosDelChoferExtranjerosModification: [],
    datosDelChoferExtranjerosRetirada: mockChoferesExtranjeros
  };

  beforeEach(async () => {
    mockModalRef = {
      hide: jest.fn(),
      onHidden: jest.fn(),
      onHide: jest.fn()
    } as any;

    mockBsModalService = {
      show: jest.fn().mockReturnValue(mockModalRef),
      hide: jest.fn(),
      config: {}
    } as any;

    mockChofer40103Service = {
      updateDatosDelChoferExtranjeroRetirada: jest.fn()
    } as any;

    mockChofer40103Query = {
      selectSolicitud$: of(mockSolicitudState)
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ChofereRetiradaDeChoferesComponent,
        MockTablaDinamicaComponent,
        MockDatosDeChoferesExtranjerosDialogComponent
      ],
      declarations: [],
      providers: [
        { provide: BsModalService, useValue: mockBsModalService },
        { provide: Chofer40103Service, useValue: mockChofer40103Service },
        { provide: Chofer40103Query, useValue: mockChofer40103Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(ChofereRetiradaDeChoferesComponent, {
      remove: {
        imports: [TablaDinamicaComponent, DatosDeChoferesExtranjerosDialogComponent]
      },
      add: {
        imports: [MockTablaDinamicaComponent, MockDatosDeChoferesExtranjerosDialogComponent]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChofereRetiradaDeChoferesComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.tipoSeleccionTabla).toBe(TablaSeleccion.CHECKBOX);
      expect(component.ConfiguracionColumna).toBe(CHOFERES_EXTRANJEROS_TABLA);
      expect(component.datosDelChoferExtranjeros).toEqual([]);
      expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
      expect(component.datosChofere).toEqual({});
      expect(component.isReadonly).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should subscribe to chofer40103Query and update datosDelChoferExtranjeros', () => {
      component.ngOnInit();

      expect(component.datosDelChoferExtranjeros).toEqual(mockChoferesExtranjeros);
    });

    it('should subscribe to consultaioQuery and update readonly state when readonly is true', () => {
      const mockState: ConsultaioState = { readonly: true } as ConsultaioState;
      mockConsultaioQuery.selectConsultaioState$ = of(mockState);

      component.ngOnInit();

      expect(component.datosConsulta).toEqual(mockState);
      expect(component.isReadonly).toBe(true);
    });

    it('should handle empty datosDelChoferExtranjerosRetirada', () => {
      mockChofer40103Query.selectSolicitud$ = of({
        datosDelChoferExtranjerosRetirada: undefined
      } as unknown as Choferesnacionales40103State);

      component.ngOnInit();

      expect(component.datosDelChoferExtranjeros).toEqual([]);
    });

    it('should not update when consultaioState readonly is false', () => {
      mockConsultaioQuery.selectConsultaioState$ = of({
        readonly: false
      }as unknown as ConsultaioState);

      component.ngOnInit();

      expect(component.datosConsulta).toBeUndefined();
      expect(component.isReadonly).toBe(false);
    });

    it('should concatenate existing data with new data from query', () => {
  component.datosDelChoferExtranjeros = [mockChoferesExtranjeros[0], { ...mockChoferesExtranjeros[0] }];
  const newChofer = { ...mockChoferesExtranjeros[0] };
      mockChofer40103Query.selectSolicitud$ = of({
        datosDelChoferExtranjerosRetirada: [newChofer]
      } as unknown as Choferesnacionales40103State);
      component.ngOnInit();
      expect(component.datosDelChoferExtranjeros).toHaveLength(2);
  expect(component.datosDelChoferExtranjeros).toContainEqual(newChofer);
    });
  });

  describe('Row Selection', () => {
    it('should update datosDelChoferExtranjerosSelected when onChofereNationalSelected is called', () => {
      const selectedChoferes = [mockChoferesExtranjeros[0]];

      component.onChofereNationalSelected(selectedChoferes);

      expect(component.datosDelChoferExtranjerosSelected).toEqual(selectedChoferes);
    });

    it('should handle empty selection', () => {
      component.datosDelChoferExtranjerosSelected = mockChoferesExtranjeros;

      component.onChofereNationalSelected([]);

      expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
    });

    it('should handle multiple selections', () => {
      const multipleSelection = [
        mockChoferesExtranjeros[0],
        { ...mockChoferesExtranjeros[0] }
      ];

      component.onChofereNationalSelected(multipleSelection);

      expect(component.datosDelChoferExtranjerosSelected).toEqual(multipleSelection);
    });
  });

  describe('Add New Row', () => {
    it('should initialize empty datosChofere and open modal', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
      jest.spyOn(component, 'abrirModal');

      component.addNewRow(mockTemplate);

      expect(component.datosChofere).toEqual({});
      expect(component.abrirModal).toHaveBeenCalledWith(mockTemplate);
    });

    it('should reset datosChofere even if it had previous data', () => {
      component.datosChofere = mockChoferesExtranjeros[0];
      const mockTemplate = {} as TemplateRef<unknown>;
      jest.spyOn(component, 'abrirModal');

      component.addNewRow(mockTemplate);

      expect(component.datosChofere).toEqual({});
    });
  });

  describe('Edit Selected Row', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation();
    });

    it('should set datosChofere to selected item and open modal when row is selected', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
      component.datosDelChoferExtranjerosSelected = [mockChoferesExtranjeros[0]];
      jest.spyOn(component, 'abrirModal');

      component.editSelectedRow(mockTemplate);

      expect(component.datosChofere).toEqual(mockChoferesExtranjeros[0]);
      expect(component.abrirModal).toHaveBeenCalledWith(mockTemplate);
    });

    it('should show warning and return early when no row is selected', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
      component.datosDelChoferExtranjerosSelected = [];
      jest.spyOn(component, 'abrirModal');

      component.editSelectedRow(mockTemplate);

      expect(console.warn).toHaveBeenCalledWith('No rows selected for editing.');
      expect(component.abrirModal).not.toHaveBeenCalled();
      expect(component.datosChofere).toEqual({});
    });

    it('should use first selected item when multiple rows are selected', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
  const secondChofer = { ...mockChoferesExtranjeros[0] };
      component.datosDelChoferExtranjerosSelected = [mockChoferesExtranjeros[0], secondChofer];
      jest.spyOn(component, 'abrirModal');

      component.editSelectedRow(mockTemplate);

      expect(component.datosChofere).toEqual(mockChoferesExtranjeros[0]);
    });
  });

  describe('Delete Selected Row', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation();
    });

    it('should show warning when no rows are selected for deletion', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      component.datosDelChoferExtranjerosSelected = [];
      component.deleteSelectedRow();
      expect(warnSpy).toHaveBeenCalledWith('No rows selected for deletion.');
      warnSpy.mockRestore();
    });

    it('should only remove selected items and keep unselected ones', () => {
  const additionalChofer = { ...mockChoferesExtranjeros[0] };
      component.datosDelChoferExtranjeros = [mockChoferesExtranjeros[0], additionalChofer];
      component.datosDelChoferExtranjerosSelected = [mockChoferesExtranjeros[0]];

      component.deleteSelectedRow();

      expect(component.datosDelChoferExtranjeros).toEqual([additionalChofer]);
      expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
    });

    it('should handle deletion of multiple selected items', () => {
  const secondChofer = { ...mockChoferesExtranjeros[0] };
  const thirdChofer = { ...mockChoferesExtranjeros[0] };
      component.datosDelChoferExtranjeros = [mockChoferesExtranjeros[0], secondChofer, thirdChofer];
      component.datosDelChoferExtranjerosSelected = [mockChoferesExtranjeros[0], secondChofer];

      component.deleteSelectedRow();

      expect(component.datosDelChoferExtranjeros).toEqual([thirdChofer]);
      expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
    });
  });

  describe('Modal Management', () => {

    it('should close modal and clear reference', () => {
      component.modalRef = mockModalRef;

      component.cancelModal();

      expect(mockModalRef.hide).toHaveBeenCalled();
      expect(component.modalRef).toBeNull();
    });

    it('should handle cancelModal when modalRef is null', () => {
      component.modalRef = null;

      expect(() => component.cancelModal()).not.toThrow();
      expect(component.modalRef).toBeNull();
    });

    it('should handle cancelModal when modalRef is undefined', () => {
      component.modalRef = undefined as any;

      expect(() => component.cancelModal()).not.toThrow();
    });
  });

  describe('Add Modal', () => {
    it('should add data to datosDelChoferExtranjeros and close modal', () => {
      const newChofer = mockChoferesExtranjeros[0];
      component.datosDelChoferExtranjeros = [];
      component.datosDelChoferExtranjerosSelected = [newChofer];
      jest.spyOn(component, 'cancelModal');

      component.agregarModal(newChofer);

      expect(component.datosDelChoferExtranjeros).toContain(newChofer);
      expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
      expect(component.cancelModal).toHaveBeenCalled();
    });

    it('should maintain existing data when adding new chofer', () => {
  const existingChofer = mockChoferesExtranjeros[0];
  const newChofer = mockChoferesExtranjeros[1];
  component.datosDelChoferExtranjeros = [existingChofer];

  component.agregarModal(newChofer);

  expect(component.datosDelChoferExtranjeros).toEqual([existingChofer, newChofer]);
    });

    it('should clear selection even if it was empty', () => {
      component.chofer40103Service = { updateDatosDelChoferExtranjeroRetirada: jest.fn() } as any;
      component.datosDelChoferExtranjerosSelected = [];
      component.datosDelChoferExtranjeros = [{ numero: '1' }];
      component.agregarModal({ numero: '2' });
      expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
      expect(component.chofer40103Service.updateDatosDelChoferExtranjeroRetirada).toHaveBeenCalledWith(component.datosDelChoferExtranjeros);
    });
  });

  describe('Component Lifecycle', () => {
    it('should unsubscribe from observables when component is destroyed', () => {
      const destroySpy = jest.spyOn(component.destroy$, 'next');
      const completeSpy = jest.spyOn(component.destroy$, 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalledWith(true);
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should use takeUntil with destroy$ in ngOnInit subscriptions', () => {
      const takeUntilSpy = jest.spyOn(require('rxjs'), 'takeUntil');

      component.ngOnInit();

      expect(takeUntilSpy).toHaveBeenCalledWith(component.destroy$);
    });
  });

  describe('Integration Tests', () => {
    it('should maintain data integrity during multiple operations', () => {
      component.chofer40103Service = { updateDatosDelChoferExtranjeroRetirada: jest.fn() } as any;
  const firstChofer = mockChoferesExtranjeros[0];
  const secondChofer = mockChoferesExtranjeros[1];
      component.agregarModal(firstChofer);
      component.agregarModal(secondChofer);
      expect(component.datosDelChoferExtranjeros).toHaveLength(2);
      component.onChofereNationalSelected([firstChofer]);
      component.deleteSelectedRow();
      expect(component.datosDelChoferExtranjeros).toEqual([secondChofer]);
      expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
    });
    it('should handle complete workflow: add, select, edit, delete', () => {
      component.chofer40103Service = { updateDatosDelChoferExtranjeroRetirada: jest.fn() } as any;
      const mockTemplate = {} as TemplateRef<unknown>;
      component.addNewRow(mockTemplate);
      component.agregarModal(mockChoferesExtranjeros[0]);
      expect(component.datosDelChoferExtranjeros).toContain(mockChoferesExtranjeros[0]);
      component.onChofereNationalSelected([mockChoferesExtranjeros[0]]);
      expect(component.datosDelChoferExtranjerosSelected).toEqual([mockChoferesExtranjeros[0]]);
      component.editSelectedRow(mockTemplate);
      expect(component.datosChofere).toEqual(mockChoferesExtranjeros[0]);
      component.deleteSelectedRow();
      expect(component.datosDelChoferExtranjeros).toEqual([]);
      expect(component.datosDelChoferExtranjerosSelected).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined data from observables gracefully', () => {
      mockChofer40103Query.selectSolicitud$ = of(null as any);
      mockConsultaioQuery.selectConsultaioState$ = of(null as any);

      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle empty arrays in operations', () => {
      component.datosDelChoferExtranjeros = [];
      component.datosDelChoferExtranjerosSelected = [];

      expect(() => component.deleteSelectedRow()).not.toThrow();
      expect(() => component.onChofereNationalSelected([])).not.toThrow();
    });

    it('should preserve object references correctly', () => {
      const originalChofer = mockChoferesExtranjeros[0];
      component.datosDelChoferExtranjeros = [originalChofer];
      component.onChofereNationalSelected([originalChofer]);

      expect(component.datosDelChoferExtranjerosSelected[0]).toBe(originalChofer);
    });
  });
});