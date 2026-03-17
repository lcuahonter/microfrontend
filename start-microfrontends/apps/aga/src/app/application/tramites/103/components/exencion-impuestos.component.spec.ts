import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { ExencionImpuestosComponent } from './exencion-impuestos.component';
import { ExencionImpuestosService } from '../services/exencion-impuestos.service';
import { Tramite103Store } from '../estados/tramite103.store';
import { Tramite103Query } from '../estados/tramite103.query';
import { ValidacionesFormularioService, REGEX_PATRON_DECIMAL_12_3 } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MercanciaTableService } from '../services/mercancia-table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

(global as any).bootstrap = {
  Modal: class {
    show() {}
    hide() {}
  }
};

describe('ExencionImpuestosComponent - Full Coverage', () => {
  let component: ExencionImpuestosComponent;
  let fixture: ComponentFixture<ExencionImpuestosComponent>;
  let mockStore: any;
  let mockService: any;

  const mockCatalogData = [
    { id: 1, descripcion: 'Opción 1' },
    { id: 2, descripcion: 'Opción 2' }
  ];

  const mockSolicitudState = {
    manifesto: 'TEST123',
    aduana: 1,
    organismoPublico: 'si',
    destinoMercancia: 1,
    personaMoral: 'no',
    nombre: 'Test Company',
    calle: 'Test Street',
    numeroExterior: '123',
    numeroInterior: '456',
    telefono: '1234567890',
    correoElectronico: 'test@test.com',
    pais: 1,
    codigoPostal: '12345',
    estado: 'Test State',
    colonia: 'Test Colony',
    tipoDeMercancia: 'Test Type',
    usoEspecifico: 'Test Use',
    condicionMercancia: 1,
    unidadMedida: 1,
    vehiculo: false,
    ano: 2023,
    cantidad: 10,
    marca: 'Test Brand',
    modelo: 'Test Model',
    serie: 'TEST123'
  };

  beforeEach(async () => {
    mockService = {
      getOpcionesAduana: jest.fn().mockReturnValue(of(mockCatalogData)),
      getDestinoMercancia: jest.fn().mockReturnValue(of({ data: mockCatalogData })),
      getCondicionMercancia: jest.fn().mockReturnValue(of({ data: mockCatalogData })),
      getUnidadMedida: jest.fn().mockReturnValue(of({ data: mockCatalogData })),
      getAno: jest.fn().mockReturnValue(of({ data: mockCatalogData })),
      getPais: jest.fn().mockReturnValue(of({ data: mockCatalogData }))
    };

    mockStore = {
      setAduana: jest.fn(),
      setDestinoMercancia: jest.fn(),
      setCondicionMercancia: jest.fn(),
      setUnidadMedida: jest.fn(),
      setAno: jest.fn(),
      setPais: jest.fn(),
      setOrganismoPublico: jest.fn(),
      setVehiculo: jest.fn(),
      setValorSeleccionado: jest.fn(),
      setPersonaMoral: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ExencionImpuestosComponent
      ],
      providers: [
        FormBuilder,
        { provide: ExencionImpuestosService, useValue: mockService },
        { provide: Tramite103Store, useValue: mockStore },
        { provide: Tramite103Query, useValue: { selectSolicitud$: of(mockSolicitudState) } },
        { provide: ValidacionesFormularioService, useValue: { validarCampo: jest.fn() } },
        { provide: ConsultaioQuery, useValue: { selectConsultaioState$: of({ readonly: false }) } },
        { provide: MercanciaTableService, useValue: { 
          getTable: jest.fn().mockReturnValue(of({
            mercanciaTable: {
              tableHeader: ['Tipo', 'Cantidad', 'Unidad'],
              tableBody: [{ tbodyData: ['Tipo 1', '10', 'KG'] }]
            }
          }))
        }},
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExencionImpuestosComponent);
    component = fixture.componentInstance;

    component.modalElement = { nativeElement: document.createElement('div') } as any;
    component.confirmarModalElement = { nativeElement: document.createElement('div') } as any;
    component.confirmarModalVehiculoElement = { nativeElement: document.createElement('div') } as any;
    component.closeModal = { nativeElement: document.createElement('button') } as any;
    component.closeConfirmarModal = { nativeElement: document.createElement('button') } as any;
    component.confirmarModalAgregarElement = { nativeElement: document.createElement('div') } as any;

    fixture.detectChanges();
  });

  describe('Component Creation and Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize default values', () => {
      expect(component.filasPendientesEliminar).toEqual([]);
      expect(component.filaSeleccionada).toBe(null);
      expect(component.filasSeleccionadas).toEqual([]);
      expect(component.filaEditando).toBe(null);
      expect(component.opcionDeshabilitado).toBe(true);
      expect(component.envioIntentado).toBe(false);
      expect(component.mercanciaBodyData).toEqual([]);
      expect(component.datosDelMercancia).toEqual([]);
    });

    it('should call service methods on init', () => {
      component.ngOnInit();
      expect(mockService.getOpcionesAduana).toHaveBeenCalled();
      expect(mockService.getDestinoMercancia).toHaveBeenCalled();
      expect(mockService.getCondicionMercancia).toHaveBeenCalled();
      expect(mockService.getUnidadMedida).toHaveBeenCalled();
      expect(mockService.getAno).toHaveBeenCalled();
      expect(mockService.getPais).toHaveBeenCalled();
    });
  });

  describe('Static Methods', () => {
    describe('obtenerDescripcion', () => {
      it('should return value when catalog is undefined', () => {
        expect(ExencionImpuestosComponent.obtenerDescripcion(undefined, 'test')).toBe('test');
      });

      it('should return value when catalog is empty', () => {
        expect(ExencionImpuestosComponent.obtenerDescripcion([], 'test')).toBe('test');
      });

      it('should find by id', () => {
        const catalog = [{ id: 1, descripcion: 'Test' }];
        expect(ExencionImpuestosComponent.obtenerDescripcion(catalog, 1)).toBe('Test');
      });

      it('should find by string id', () => {
        const catalog = [{ id: 1, descripcion: 'Test' }];
        expect(ExencionImpuestosComponent.obtenerDescripcion(catalog, '1')).toBe('Test');
      });

      it('should find by description', () => {
        const catalog = [{ id: 1, descripcion: 'Test' }];
        expect(ExencionImpuestosComponent.obtenerDescripcion(catalog, 'Test')).toBe('Test');
      });

      it('should return original value when not found', () => {
        const catalog = [{ id: 1, descripcion: 'Test' }];
        expect(ExencionImpuestosComponent.obtenerDescripcion(catalog, 'NotFound')).toBe('NotFound');
      });
    });
  });

  describe('Row Management', () => {
    beforeEach(() => {
      component.mercanciaBodyData = [
        { tbodyData: ['item1'] },
        { tbodyData: ['item2'] },
        { tbodyData: ['item3'] }
      ];
    });

    it('should prepare rows for deletion', () => {
      component.filasSeleccionadas = [1, 2];
      component.prepararEliminarFila();
      expect(component.filasPendientesEliminar).toEqual([1, 2]);
    });

    it('should select row', () => {
      const row = component.mercanciaBodyData[1];
      component.seleccionarFila(row);
      expect(component.filaSeleccionada).toBe(1);
    });

    it('should handle multiple selection', () => {
      const rows = [component.mercanciaBodyData[0], component.mercanciaBodyData[2]];
      component.manejarSeleccionMultiple(rows);
      expect(component.filasSeleccionadas).toEqual([0, 2]);
    });

    it('should delete multiple rows when valid indices', () => {
      component.filasPendientesEliminar = [1, 2];
      component.filasSeleccionadas = [1, 2];
      const originalLength = component.mercanciaBodyData.length;
      
      const eliminarFilaSpy = jest.spyOn(component, 'eliminarFila').mockImplementation((index) => {
        if (index !== null && index >= 0 && index < component.mercanciaBodyData.length) {
          component.mercanciaBodyData.splice(index, 1);
        }
      });
      
      component.eliminarMercancias();
      expect(eliminarFilaSpy).toHaveBeenCalledWith(2);
      expect(eliminarFilaSpy).toHaveBeenCalledWith(1);
      expect(component.filasSeleccionadas).toEqual([]);
      expect(component.filaSeleccionada).toBe(null);
      expect(component.filasPendientesEliminar).toEqual([]);
    });

    it('should not delete when no rows selected', () => {
      component.filasPendientesEliminar = [];
      const eliminarFilaSpy = jest.spyOn(component, 'eliminarFila');
      component.eliminarMercancias();
      expect(eliminarFilaSpy).not.toHaveBeenCalled();
      expect(component.filasPendientesEliminar).toEqual([]);
    });

    it('should handle invalid indices in multiple deletion', () => {
      component.filasPendientesEliminar = [-1, 10, 1];
      component.filasSeleccionadas = [-1, 10, 1];
      const eliminarFilaSpy = jest.spyOn(component, 'eliminarFila').mockImplementation((index) => {
        if (index !== null && index >= 0 && index < component.mercanciaBodyData.length) {
          component.mercanciaBodyData.splice(index, 1);
        }
      });
      component.eliminarMercancias();
      expect(eliminarFilaSpy).toHaveBeenCalledWith(1);
      expect(component.filasSeleccionadas).toEqual([]);
      expect(component.filasPendientesEliminar).toEqual([]);
    });

    it('should edit row when valid index', () => {
      const abrirDialogoSpy = jest.spyOn(component, 'abrirDialogoMercancias').mockImplementation();
      component.editarFila(0);
      expect(component.filaEditando).toBe(0);
      expect(abrirDialogoSpy).toHaveBeenCalled();
    });
  });

  describe('Store Integration', () => {
    it('should call store methods for selections', () => {
      component.aduanaSeleccion();
      expect(mockStore.setAduana).toHaveBeenCalled();

      component.destinoMercanciaSeleccion();
      expect(mockStore.setDestinoMercancia).toHaveBeenCalled();

      component.condicionMercanciaSeleccion();
      expect(mockStore.setCondicionMercancia).toHaveBeenCalled();

      component.unidadMedidaSeleccion();
      expect(mockStore.setUnidadMedida).toHaveBeenCalled();

      component.anoSeleccion();
      expect(mockStore.setAno).toHaveBeenCalled();

      component.paisSeleccion();
      expect(mockStore.setPais).toHaveBeenCalled();

      component.organismoPublico();
      expect(mockStore.setOrganismoPublico).toHaveBeenCalled();

      component.vehiculo();
      expect(mockStore.setVehiculo).toHaveBeenCalled();
    });
  });

  describe('Form Getters', () => {
    it('should return form groups', () => {
      expect(component.exencionImpuestos).toBeTruthy();
      expect(component.importadorExportador).toBeTruthy();
      expect(component.datosMercancia).toBeTruthy();
    });
  });

  describe('Modal Operations', () => {
    it('should handle modal operations', () => {
      const cerrarSpy = jest.spyOn(component, 'cerrarModalManual').mockImplementation();
      component.agregarMercanciasAceptar();
      expect(cerrarSpy).toHaveBeenCalled();
    });

    it('should clear form', () => {
      const resetSpy = jest.spyOn(component.agregarMercanciasForm, 'reset');
      component.limpiarAgregarMercanciasForm();
      expect(resetSpy).toHaveBeenCalled();
      expect(component.envioIntentado).toBe(false);
    });

    it('should cancel form', () => {
      const limpiarSpy = jest.spyOn(component, 'limpiarAgregarMercanciasForm').mockImplementation();
      const cerrarSpy = jest.spyOn(component, 'cerrarModal').mockImplementation();
      
      component.cancelarAgregarMercanciasForm();
      expect(limpiarSpy).toHaveBeenCalled();
      expect(cerrarSpy).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should handle form validation', () => {
      const fb = TestBed.inject(FormBuilder);
        // Inicializa el formulario con todos los campos requeridos y sus validadores
        component.agregarMercanciasForm = fb.group({
          datosMercancia: fb.group({
            tipoDeMercancia: ['Test', [Validators.required]],
            usoEspecifico: ['Test', [Validators.required]],
            cantidad: [1, [Validators.required, Validators.pattern(REGEX_PATRON_DECIMAL_12_3), Validators.min(1)]],
            condicionMercancia: ['Test', [Validators.required]],
            unidadMedida: ['Test', [Validators.required]],
            vehiculo: [false, []],
            ano: ['2023', []],
            marca: ['Test', []],
            modelo: ['Test', []],
            serie: ['Test', []]
          })
        });
        // Establece los valores para todos los campos requeridos
        component.agregarMercanciasForm.patchValue({
          datosMercancia: {
            tipoDeMercancia: 'Test',
            usoEspecifico: 'Test',
            cantidad: 1,
            condicionMercancia: 'Test',
            unidadMedida: 'Test',
            vehiculo: false,
            ano: '2023',
            marca: 'Test',
            modelo: 'Test',
            serie: 'Test'
          }
        });
  // Ejecuta la validación y verifica que la bandera se establezca correctamente.
  // NOTA: Si el formulario es válido y se agrega la mercancía, 'envioIntentado' se restablece a false después de limpiar el formulario.
  component.agregarMercanciasConfirm();
  expect(component.envioIntentado).toBe(false);
    });

    it('should validate form fields when form is invalid', () => {
      const markTouchedSpy = jest.spyOn(component.tramiteForm, 'markAllAsTouched');
      Object.defineProperty(component.tramiteForm, 'invalid', {
        get: jest.fn(() => true)
      });
      component.validarDestinatarioFormulario();
      expect(markTouchedSpy).toHaveBeenCalled();
    });

    it('should not call markAllAsTouched when form is valid', () => {
      const markTouchedSpy = jest.spyOn(component.tramiteForm, 'markAllAsTouched');
      Object.defineProperty(component.tramiteForm, 'invalid', {
        get: jest.fn(() => false)
      });
      component.validarDestinatarioFormulario();
      expect(markTouchedSpy).not.toHaveBeenCalled();
    });
  });

  describe('Utility Methods', () => {
    it('should handle vehicle modal operations', () => {
      expect(() => component.abrirModalVehiculoSeguro()).not.toThrow();
      expect(() => component.confirmarVehiculo()).not.toThrow();
      expect(() => component.cancelarVehiculo()).not.toThrow();
    });

    it('should handle merchandise operations', () => {
      expect(() => component.abrirDialogoMercancias()).not.toThrow();
      expect(() => component.cerrarModal()).not.toThrow();
      expect(() => component.agregarMercancias()).not.toThrow();
      expect(() => component.obtenerMercancia()).not.toThrow();
    });

    it('should handle radio changes', () => {
      mockStore.setValorSeleccionado = jest.fn();
      expect(() => component.cambiarRadio('si')).not.toThrow();
      expect(() => component.personaMoral()).not.toThrow();
    });

    it('should handle confirmation modal', () => {
      expect(() => component.agregarConfirmarModal()).not.toThrow();
    });

    it('should set store values', () => {
      const formBuilder = TestBed.inject(FormBuilder);
      const testForm = formBuilder.group({ testField: ['value'] });
      component.setValoresStore(testForm, 'testField', 'setAduana');
      expect(mockStore.setAduana).toHaveBeenCalled();
    });
  });

  describe('Lifecycle', () => {
    it('should cleanup on destroy', () => {
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined values gracefully', () => {
      component.filasSeleccionadas = [];
      component.prepararEliminarFila();
      expect(component.filasPendientesEliminar).toEqual([]);

      component.editarFila(null);
      expect(component.filaEditando).toBe(null);

      const nonExistentRow = { tbodyData: ['nonexistent'] };
      component.seleccionarFila(nonExistentRow);
      expect(component.filaSeleccionada).toBe(-1);
    });

    it('should handle empty arrays', () => {
      component.mercanciaBodyData = [];
      component.manejarSeleccionMultiple([]);
      expect(component.filasSeleccionadas).toEqual([]);
      expect(component.filaSeleccionada).toBe(null);
    });

    it('should handle modal instance not existing', () => {
      component['confirmarModalAgregarInstance'] = null;
      expect(() => component.cerrarModalManual()).not.toThrow();
    });
  });

  describe('Row Operations Coverage', () => {
    beforeEach(() => {
      component.mercanciaBodyData = [
        { tbodyData: ['item1'] },
        { tbodyData: ['item2'] },
        { tbodyData: ['item3'] }
      ];
      component.getMercanciaTableData = {
        mercanciaTable: {
          tableHeader: [],
          tableBody: [...component.mercanciaBodyData]
        }
      };
    });

    it('should eliminate row at index 0', () => {
      component.eliminarFila(0);
      expect(component.mercanciaBodyData.length).toBe(2);
      expect(component.mercanciaBodyData[0].tbodyData[0]).toBe('item2');
    });

    it('should eliminate row at middle index', () => {
      component.eliminarFila(1);
      expect(component.mercanciaBodyData.length).toBe(2);
      expect(component.mercanciaBodyData[0].tbodyData[0]).toBe('item1');
      expect(component.mercanciaBodyData[1].tbodyData[0]).toBe('item3');
    });

    it('should clear selection when deleting selected row', () => {
      component.filaSeleccionada = 1;
      component.eliminarFila(1);
      expect(component.filaSeleccionada).toBe(null);
    });

    it('should handle out of bounds deletion gracefully', () => {
      const originalLength = component.mercanciaBodyData.length;
      component.eliminarFila(10);
      expect(component.mercanciaBodyData.length).toBe(originalLength);
    });
  });
});