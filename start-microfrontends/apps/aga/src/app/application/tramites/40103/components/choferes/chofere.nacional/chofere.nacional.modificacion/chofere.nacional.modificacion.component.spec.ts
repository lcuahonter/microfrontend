import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateRef, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { of, Subject, throwError } from 'rxjs';
import { ChofereNacionalModificacionComponent } from './chofere.nacional.modificacion.component';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Chofer40103Query } from '../../../../estados/chofer40103.query';
import { Chofer40103Service } from '../../../../estados/chofer40103.service';
import { DatosDeChoferesNacionalDialogComponent } from '../data.de.choferes.dialog/data.de.choferes.nacional.dialog.component';
import { DatosDelChoferNacional } from '../../../../models/registro-muestras-mercancias.model';
import { CHOFERES_NACIONALES_ALTA } from '../../../../enum/choferes.enum';
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
  selector: 'app-datos-de-choferes-nacional-dialog',
  template: '<div>Mock DatosDeChoferesNacionalDialogComponent</div>',
  inputs: ['datosChofer', 'isReadonly'],
  outputs: ['saved', 'cancelled'],
  standalone: true
})
class MockDatosDeChoferesNacionalDialogComponent {
  datosChofer: any;
  isReadonly: boolean = false;
  saved = new Subject<any>();
  cancelled = new Subject<void>();
}

describe('ChofereNacionalModificacionComponent', () => {
  let component: ChofereNacionalModificacionComponent;
  let fixture: ComponentFixture<ChofereNacionalModificacionComponent>;
  let mockBsModalService: jest.Mocked<BsModalService>;
  let mockChofer40103Service: jest.Mocked<Chofer40103Service>;
  let mockChofer40103Query: jest.Mocked<Chofer40103Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockBsModalRef: jest.Mocked<BsModalRef>;

  const mockDatosDelChoferNacional: DatosDelChoferNacional[] = [
    {
      id: '1',
      curp: 'ABCD123456HDFRNN09',
      rfc: 'ABCD123456ABC',
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: 'García',
      numeroDeGafete: '12345',
      vigenciaGafete: '2025-12-31',
      calle: 'Insurgentes Sur',
      numeroExterior: '123',
      numeroInterior: 'A',
      pais: 'México',
      estado: 'Ciudad de México',
      municipioAlcaldia: 'Benito Juárez',
      colonia: 'Del Valle',
      paisDeResidencia: 'México',
      ciudad: 'CDMX',
      localidad: 'Del Valle',
      codigoPostal: '03100',
      correoElectronico: 'juan@test.com',
      telefono: '5551234567'
    },
    {
      id: '2',
      curp: 'EFGH789012MDFXYZ34',
      rfc: 'EFGH789012DEF',
      nombre: 'María',
      primerApellido: 'López',
      segundoApellido: 'Martínez',
      numeroDeGafete: '67890',
      vigenciaGafete: '2024-11-30',
      calle: 'Reforma',
      numeroExterior: '456',
      numeroInterior: 'B',
      pais: 'México',
      estado: 'Jalisco',
      municipioAlcaldia: 'Guadalajara',
      colonia: 'Centro',
      paisDeResidencia: 'México',
      ciudad: 'Guadalajara',
      localidad: 'Centro',
      codigoPostal: '44100',
      correoElectronico: 'maria@test.com',
      telefono: '3331234567'
    }
  ];

  const mockConsultaioState: ConsultaioState = {
    readonly: false,
    update: true,
  }as ConsultaioState;

  const mockSolicitudState = {
    datosDelChoferNacionalModification: mockDatosDelChoferNacional
  };

  beforeEach(async () => {
    mockBsModalRef = {
      hide: jest.fn(),
      onHide: new Subject(),
      onHidden: new Subject()
    } as unknown as jest.Mocked<BsModalRef>;

    mockBsModalService = {
      show: jest.fn().mockReturnValue(mockBsModalRef),
      hide: jest.fn(),
      onShow: new Subject(),
      onShown: new Subject(),
      onHide: new Subject(),
      onHidden: new Subject()
    } as unknown as jest.Mocked<BsModalService>;

    mockChofer40103Service = {
      updateDatosDelChoferNacionalModification: jest.fn()
    } as unknown as jest.Mocked<Chofer40103Service>;

    mockChofer40103Query = {
      selectSolicitud$: of(mockSolicitudState)
    } as unknown as jest.Mocked<Chofer40103Query>;

    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    } as unknown as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      imports: [ChofereNacionalModificacionComponent],
      providers: [
        { provide: BsModalService, useValue: mockBsModalService },
        { provide: Chofer40103Service, useValue: mockChofer40103Service },
        { provide: Chofer40103Query, useValue: mockChofer40103Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(ChofereNacionalModificacionComponent, {
      remove: {
        imports: [TablaDinamicaComponent, DatosDeChoferesNacionalDialogComponent]
      },
      add: {
        imports: [MockTablaDinamicaComponent, MockDatosDeChoferesNacionalDialogComponent]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChofereNacionalModificacionComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
    fixture.destroy();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be a standalone component', () => {
      expect(component).toBeInstanceOf(ChofereNacionalModificacionComponent);
    });

    it('should initialize with correct default values', () => {
      expect(component.tipoSeleccionTabla).toBe(TablaSeleccion.CHECKBOX);
      expect(component.ConfiguracionColumna).toBe(CHOFERES_NACIONALES_ALTA);
      expect(component.datosDelChoferNacional).toEqual([]);
      expect(component.datosDelChoferNacionalSelected).toEqual([]);
      expect(component.datosConsulta).toEqual({} as ConsultaioState);
      expect(component.datosChofere).toEqual({} as DatosDelChoferNacional);
      expect(component.isReadonly).toBe(false);
      expect(component.destroy$).toBeInstanceOf(Subject);
    });

  });

  describe('ngOnInit', () => {
    it('should subscribe to chofer40103Query.selectSolicitud$ and update datosDelChoferNacional', () => {
      component.ngOnInit();

      expect(component.datosDelChoferNacional).toEqual(mockDatosDelChoferNacional);
    });

    it('should handle empty datosDelChoferNacionalModification', () => {
      const emptyState = { datosDelChoferNacionalModification: null } as unknown as any;
      mockChofer40103Query.selectSolicitud$ = of(emptyState);

      component.ngOnInit();

      expect(component.datosDelChoferNacional).toEqual([]);
    });

    it('should handle undefined datosDelChoferNacionalModification', () => {
      const undefinedState = {};
      mockChofer40103Query.selectSolicitud$ = of(undefinedState as unknown as any);

      component.ngOnInit();

      expect(component.datosDelChoferNacional).toEqual([]);
    });

    it('should subscribe to consultaioQuery.selectConsultaioState$ and update readonly state', () => {
      const readonlyState = { ...mockConsultaioState, readonly: true };
      mockConsultaioQuery.selectConsultaioState$ = of(readonlyState);

      component.ngOnInit();

      expect(component.datosConsulta).toEqual(readonlyState);
      expect(component.isReadonly).toBe(true);
    });

    it('should not update readonly state when readonly is false', () => {
      const nonReadonlyState = { ...mockConsultaioState, readonly: false };
      mockConsultaioQuery.selectConsultaioState$ = of(nonReadonlyState);

      component.ngOnInit();

      expect(component.isReadonly).toBe(false);
    });

    it('should handle null consultaioState', () => {
      mockConsultaioQuery.selectConsultaioState$ = of(null as any);

      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle observable errors gracefully', () => {
      mockChofer40103Query.selectSolicitud$ = throwError(() => new Error('Query error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => component.ngOnInit()).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should use takeUntil for subscription cleanup', () => {
      const destroySpy = jest.spyOn(component.destroy$, 'next');

      component.ngOnInit();
      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });

  describe('onChofereNationalSelected', () => {
    it('should update datosDelChoferNacionalSelected with provided data', () => {
      const selectedData = [mockDatosDelChoferNacional[0]];

      component.onChofereNationalSelected(selectedData);

      expect(component.datosDelChoferNacionalSelected).toEqual(selectedData);
    });

    it('should handle empty selection', () => {
      component.onChofereNationalSelected([]);

      expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });

    it('should handle multiple selections', () => {
      component.onChofereNationalSelected(mockDatosDelChoferNacional);

      expect(component.datosDelChoferNacionalSelected).toEqual(mockDatosDelChoferNacional);
    });

    it('should replace previous selection', () => {
      component.datosDelChoferNacionalSelected = [mockDatosDelChoferNacional[0]];
      const newSelection = [mockDatosDelChoferNacional[1]];

      component.onChofereNationalSelected(newSelection);

      expect(component.datosDelChoferNacionalSelected).toEqual(newSelection);
    });
  });

  describe('addNewRow', () => {
    let mockTemplate: TemplateRef<unknown>;

    beforeEach(() => {
      mockTemplate = {} as TemplateRef<unknown>;
      jest.spyOn(component, 'abrirModal').mockImplementation();
    });

    it('should initialize datosChofere as empty object', () => {
  component.addNewRow(mockTemplate);

      expect(component.datosChofere).toEqual({} as DatosDelChoferNacional);
    });

    it('should call openModal with provided template', () => {
  component.addNewRow(mockTemplate);
  expect(component.abrirModal).toHaveBeenCalledWith(mockTemplate);
    });

    it('should reset datosChofere if it had previous data', () => {
  component.datosChofere = mockDatosDelChoferNacional[0];
  component.addNewRow(mockTemplate);
  expect(component.datosChofere).toEqual({} as DatosDelChoferNacional);
    });
  });

  describe('editSelectedRow', () => {
    let mockTemplate: TemplateRef<unknown>;
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      mockTemplate = {} as TemplateRef<unknown>;
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(component, 'abrirModal').mockImplementation();
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should warn and return early when no rows are selected', () => {
      component.datosDelChoferNacionalSelected = [];

  component.editSelectedRow(mockTemplate);
  expect(consoleWarnSpy).toHaveBeenCalledWith('No rows selected for editing.');
  expect(component.abrirModal).not.toHaveBeenCalled();
    });

    it('should set datosChofere to first selected item and open modal', () => {
      component.datosDelChoferNacionalSelected = mockDatosDelChoferNacional;

  component.editSelectedRow(mockTemplate);
  expect(component.datosChofere).toEqual(mockDatosDelChoferNacional[0]);
  expect(component.abrirModal).toHaveBeenCalledWith(mockTemplate);
    });

    it('should handle single selection', () => {
      component.datosDelChoferNacionalSelected = [mockDatosDelChoferNacional[1]];

  component.editSelectedRow(mockTemplate);
  expect(component.datosChofere).toEqual(mockDatosDelChoferNacional[1]);
    });

    it('should use first item when multiple items are selected', () => {
      component.datosDelChoferNacionalSelected = mockDatosDelChoferNacional;

  component.editSelectedRow(mockTemplate);
  expect(component.datosChofere).toEqual(mockDatosDelChoferNacional[0]);
    });
  });

  describe('deleteSelectedRow', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      component.datosDelChoferNacional = [...mockDatosDelChoferNacional];
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should warn when no rows are selected', () => {
      component.datosDelChoferNacionalSelected = [];

  component.deleteSelectedRow();
  expect(consoleWarnSpy).toHaveBeenCalledWith('No rows selected for deletion.');
  expect(component.datosDelChoferNacional).toEqual(mockDatosDelChoferNacional);
    });

    it('should remove selected rows from datosDelChoferNacional', () => {
      component.datosDelChoferNacionalSelected = [mockDatosDelChoferNacional[0]];

  component.deleteSelectedRow();
  expect(component.datosDelChoferNacional).toEqual([mockDatosDelChoferNacional[1]]);
  expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });

    it('should remove multiple selected rows', () => {
      component.datosDelChoferNacionalSelected = mockDatosDelChoferNacional;

  component.deleteSelectedRow();
  expect(component.datosDelChoferNacional).toEqual([]);
  expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });

    it('should handle partial selection removal', () => {
      const additionalData = {
        ...mockDatosDelChoferNacional[0],
        curp: 'IJKL345678HDFABC56',
        nombre: 'Carlos'
      };
      component.datosDelChoferNacional = [...mockDatosDelChoferNacional, additionalData];
      component.datosDelChoferNacionalSelected = [mockDatosDelChoferNacional[0]];

  component.deleteSelectedRow();
  expect(component.datosDelChoferNacional).toEqual([mockDatosDelChoferNacional[1], additionalData]);
    });

    it('should reset selected array after deletion', () => {
      component.datosDelChoferNacionalSelected = [mockDatosDelChoferNacional[0]];

  component.deleteSelectedRow();
  expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });
  });

  describe('cancelModal', () => {
    beforeEach(() => {
      component.modalRef = mockBsModalRef;
    });

    it('should call hide on modalRef when modalRef exists', () => {
  component.cancelarModal();
  expect(mockBsModalRef.hide).toHaveBeenCalled();
  expect(component.modalRef).toBeNull();
    });

    it('should handle null modalRef gracefully', () => {
  component.modalRef = null;
  expect(() => component.cancelarModal()).not.toThrow();
  expect(component.modalRef).toBeNull();
    });

    it('should handle undefined modalRef gracefully', () => {
  component.modalRef = undefined as any;
  expect(() => component.cancelarModal()).not.toThrow();
  expect(component.modalRef).toBeNull();
    });
  });

  describe('addModal', () => {
    let mockModalComponent: jest.Mocked<MockDatosDeChoferesNacionalDialogComponent>;

    beforeEach(() => {
      mockModalComponent = {
        datosChofer: {},
        isReadonly: false,
        saved: new Subject(),
        cancelled: new Subject()
      } as jest.Mocked<MockDatosDeChoferesNacionalDialogComponent>;
      
      component.modalComponent = mockModalComponent as any;
      component.modalRef = mockBsModalRef;
      component.datosDelChoferNacional = [...mockDatosDelChoferNacional];
      jest.spyOn(component, 'cancelarModal').mockImplementation();
    });

    it('should add new data to datosDelChoferNacional when modalComponent exists', () => {
      const newData = {
        ...mockDatosDelChoferNacional[0],
        curp: 'NEW123456HDFXYZ78',
        nombre: 'Nuevo'
      };

  component.agregarModal(newData);
  expect(component.datosDelChoferNacional).toContain(newData);
  expect(component.datosDelChoferNacional.length).toBe(3);
    });

    it('should reset datosDelChoferNacionalSelected', () => {
      component.datosDelChoferNacionalSelected = [mockDatosDelChoferNacional[0]];
      const newData = mockDatosDelChoferNacional[0];

  component.agregarModal(newData);
  expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });

    it('should call chofer40103Service.updateDatosDelChoferNacionalModification', () => {
      const newData = mockDatosDelChoferNacional[0];

      component.agregarModal(newData);
      expect(mockChofer40103Service.updateDatosDelChoferNacionalModification)
        .toHaveBeenCalledWith(component.datosDelChoferNacional);
    });

    it('should call cancelModal', () => {
      const newData = mockDatosDelChoferNacional[0];

  component.agregarModal(newData);
  expect(component.cancelarModal).toHaveBeenCalled();
    });

    it('should not add data when modalComponent is null', () => {
      component.modalComponent = null as any;
      const originalLength = component.datosDelChoferNacional.length;
      const newData = mockDatosDelChoferNacional[0];

      component.agregarModal(newData);
      expect(component.datosDelChoferNacional.length).toBe(originalLength);
      expect(mockChofer40103Service.updateDatosDelChoferNacionalModification)
        .not.toHaveBeenCalled();
      expect(component.cancelarModal).toHaveBeenCalled();
    });

    it('should not add data when modalComponent is undefined', () => {
      component.modalComponent = undefined as any;
      const originalLength = component.datosDelChoferNacional.length;
      const newData = mockDatosDelChoferNacional[0];

  component.agregarModal(newData);
  expect(component.datosDelChoferNacional.length).toBe(originalLength);
  expect(component.cancelarModal).toHaveBeenCalled();
    });

    it('should handle adding duplicate data', () => {
      const duplicateData = mockDatosDelChoferNacional[0];

      component.agregarModal(duplicateData);
      expect(component.datosDelChoferNacional.filter(item => 
        item.curp === duplicateData.curp
      ).length).toBe(2);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      const nextSpy = jest.spyOn(component.destroy$, 'next');
      const completeSpy = jest.spyOn(component.destroy$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should handle multiple destroy calls', () => {
      const nextSpy = jest.spyOn(component.destroy$, 'next');

      component.ngOnDestroy();
      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly from initialization to destruction', () => {
      component.ngOnInit();
      
      expect(component.datosDelChoferNacional).toEqual(mockDatosDelChoferNacional);
      
      component.onChofereNationalSelected([mockDatosDelChoferNacional[0]]);
      expect(component.datosDelChoferNacionalSelected.length).toBe(1);
      
      component.deleteSelectedRow();
      expect(component.datosDelChoferNacional.length).toBe(1);
      
      component.ngOnDestroy();
    });

    it('should handle readonly mode correctly', () => {
      const readonlyState = { ...mockConsultaioState, readonly: true };
      mockConsultaioQuery.selectConsultaioState$ = of(readonlyState);

      component.ngOnInit();

      expect(component.isReadonly).toBe(true);
      expect(component.datosConsulta.readonly).toBe(true);
    });

    it('should handle modal workflow correctly', () => {
      const mockTemplate = {} as TemplateRef<unknown>;
      
      component.addNewRow(mockTemplate);
      expect(component.datosChofere).toEqual({});
      
      const newData = mockDatosDelChoferNacional[0];
      component.modalComponent = {
        saved: new Subject(),
        cancelled: new Subject()
      } as any;
      
      component.agregarModal(newData);
      expect(component.datosDelChoferNacional).toContain(newData);
    });
  });

  describe('Edge Cases', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, index) => ({
        ...mockDatosDelChoferNacional[0],
        curp: `LARGE${index.toString().padStart(6, '0')}HDFXYZ78`,
        nombre: `Usuario${index}`
      }));

      component.datosDelChoferNacional = largeDataset;
      component.datosDelChoferNacionalSelected = largeDataset.slice(0, 100);

      const startTime = performance.now();
      component.deleteSelectedRow();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(component.datosDelChoferNacional.length).toBe(900);
    });

    it('should handle special characters in chofer data', () => {
      const specialData = {
        ...mockDatosDelChoferNacional[0],
        nombre: 'José María',
        primerApellido: 'Ñoño',
        segundoApellido: 'Güerez'
      };

      component.modalComponent = { saved: new Subject() } as any;
      component.agregarModal(specialData);

      expect(component.datosDelChoferNacional).toContain(specialData);
    });

    it('should handle concurrent operations', () => {
      component.ngOnInit();
      
      component.onChofereNationalSelected([mockDatosDelChoferNacional[0]]);
      component.deleteSelectedRow();
      component.onChofereNationalSelected([]);
      
      expect(component.datosDelChoferNacionalSelected).toEqual([]);
    });
  });

  describe('Observable Error Handling', () => {
    it('should handle chofer40103Query observable errors', () => {
      mockChofer40103Query.selectSolicitud$ = throwError(() => new Error('Query error'));
      
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should handle consultaioQuery observable errors', () => {
      mockConsultaioQuery.selectConsultaioState$ = throwError(() => new Error('Consultaio error'));
      
      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('should continue working after observable errors', () => {
      mockChofer40103Query.selectSolicitud$ = throwError(() => new Error('Query error'));
      
      component.ngOnInit();
      
      component.onChofereNationalSelected([mockDatosDelChoferNacional[0]]);
      expect(component.datosDelChoferNacionalSelected.length).toBe(1);
    });
  });
});