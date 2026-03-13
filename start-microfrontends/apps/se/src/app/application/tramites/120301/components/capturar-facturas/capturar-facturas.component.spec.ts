import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { CapturarFacturasComponent } from './capturar-facturas.component';
import { ElegibilidadTextilesService } from '../../services/elegibilidad-textiles/elegibilidad-textiles.service';
import { HttpClient } from '@angular/common/http';
import { ElegibilidadDeTextilesStore } from '../../estados/elegibilidad-de-textiles.store';
import { ElegibilidadDeTextilesQuery } from '../../queries/elegibilidad-de-textiles.query';
import { SeccionLibStore, SeccionLibQuery } from '@ng-mf/data-access-user';
import { CapturarColumns } from '../../models/elegibilidad-de-textiles.model';

describe('CapturarFacturasComponent', () => {
  let component: CapturarFacturasComponent;
  let fixture: ComponentFixture<CapturarFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CapturarFacturasComponent
      ],
      providers: [
        FormBuilder,
        { provide: ElegibilidadTextilesService, useValue: { 
          obtenerMenuDesplegable: jest.fn().mockReturnValue(observableOf([])),
          metodo1: jest.fn().mockReturnValue(observableOf({})) 
        } },
        { provide: HttpClient, useValue: {} },
        { provide: ElegibilidadDeTextilesStore, useValue: {} },
        { provide: ElegibilidadDeTextilesQuery, useValue: { selectTextile$: observableOf({ capturarColumns: [] }) } },
        { provide: SeccionLibStore, useValue: { 
          establecerFormaValida: jest.fn().mockReturnValue(observableOf({}))
        } },
        { provide: SeccionLibQuery, useValue: { selectSeccionState$: observableOf({}) } },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CapturarFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe validar formulario', () => {
    expect(component.facturaForm).toBeDefined();
  });

  it('debe ejecutar ngOnInit', () => {
    const spy = jest.spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debe ejecutar continuar()', async () => {
    component.facturaForm.patchValue({
      numeroFactura: '123',
      cantidadTotal: '100',
      valorDolares: '200'
    });
    component.continuar();
    expect(component.facturas).toBeDefined();
  });

  it('debe ejecutar ngOnDestroy()', async () => {
    component['destroyNotifier$'] = { next: jest.fn(), complete: jest.fn() } as any;
    component.ngOnDestroy();
    expect(component['destroyNotifier$'].next).toHaveBeenCalled();
    expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
  });

  describe('Comprehensive Method Testing', () => {
    
    const createTestFactura = (overrides: Partial<CapturarColumns> = {}): CapturarColumns => ({
      numeroDeLaFactura: 'F001',
      razonSocial: 'Test Company',
      domicilio: 'Test Address',
      fechaExpedicionFactura: '2025-01-01',
      cantidadTotal: '100',
      cantidadDisponible: '100',
      unidadMedida: 'KG',
      valorDolares: '200',
      taxId: 'TAX123',
      calle: 'Test Street',
      ciudad: 'Test City',
      cp: '12345',
      pais: 'Mexico',
      idExpedicion: 1,
      idFacturaExpedicion: 1,
      ...overrides
    });
    
    it('debe ejecutar onFechaExpedicionFacturaChange() correctamente', () => {
      const fechaTest = '2025-01-01';
      const control = component.facturaForm.get('fechaExpedicionFactura');
      jest.spyOn(control!, 'setValue');
      jest.spyOn(control!, 'markAsDirty');
      jest.spyOn(control!, 'markAsTouched');
      
      component.onFechaExpedicionFacturaChange(fechaTest);
      
      expect(control!.setValue).toHaveBeenCalledWith(fechaTest);
      expect(control!.markAsDirty).toHaveBeenCalled();
      expect(control!.markAsTouched).toHaveBeenCalled();
    });

    it('debe ejecutar limpiarFacturaForm() correctamente', () => {
      component.facturaForm.patchValue({
        numeroFactura: 'test',
        cantidadTotal: '100',
        valorDolares: '200'
      });
      
      component.showFechaExpedicionFactura = true;
      component.modalMode = 'modificar';
      
      component.limpiarFacturaForm();
      
      expect(component.facturaForm.get('numeroFactura')?.value).toBe(null);
      expect(component.showFechaExpedicionFactura).toBe(false);
    });

    it('debe ejecutar abrirModalAgregar() correctamente', () => {
      component.abrirModalAgregar();
      
      expect(component.modalMode).toBe('agregar');
      expect(component.indiceSeleccionado).toBe(null);
      expect(component.facturaForm.get('domicilio')?.value).toBe('5th Avenue 123 New York NY México 12345');
      expect(component.facturaForm.get('pais')?.value).toBe('ESTADOS UNIDOS DE AMERICA');
    });

    it('debe ejecutar abrirModalModificar() correctamente', () => {
      const facturaTest = createTestFactura();
      
      component.facturas = [facturaTest];
      component.indiceSeleccionado = 0;
      component['poblarFacturaForm'] = jest.fn();
      
      component.abrirModalModificar();
      
      expect(component.modalMode).toBe('modificar');
      expect(component['poblarFacturaForm']).toHaveBeenCalledWith(facturaTest);
    });

    it('debe ejecutar poblarFacturaForm() correctamente', () => {
      const facturaTest = createTestFactura();
      
      component['poblarFacturaForm'](facturaTest);
      
      expect(component.facturaForm.get('numeroFactura')?.value).toBe('F001');
      expect(component.facturaForm.get('cantidadTotal')?.value).toBe('100');
      expect(component.facturaForm.get('valorDolares')?.value).toBe('200');
    });

    it('debe ejecutar guardarFactura() con formulario válido', () => {
      component.facturaForm = {
        valid: true,
        controls: {
          numeroFactura: { 
            value: 'F001',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          },
          cantidadTotal: { 
            value: '100',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          },
          valorDolares: { 
            value: '200',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          },
          unidadDeMedida: { 
            value: 'kg',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          },
          razonSocial: { 
            value: 'Test Company',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          },
          domicilio: { 
            value: 'Test Address',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          },
          calle: { 
            value: 'Test Street',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          },
          ciudad: { 
            value: 'Test City',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          },
          cp: { 
            value: '12345',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          },
          pais: { 
            value: 'Test Country',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          },
          fechaExpedicionFactura: { 
            value: '2023-01-01',
            markAsTouched: jest.fn(),
            markAsDirty: jest.fn(),
            invalid: false
          }
        },
        get: jest.fn((field) => ({
          value: field === 'numeroFactura' ? 'F001' : 'testValue',
          invalid: false
        })),
        getRawValue: jest.fn(() => ({
          numeroFactura: 'F001',
          razonSocial: 'Test Company',
          cantidadTotal: '100',
          valorDolares: '200',
          fechaExpedicionFactura: '2023-01-01',
          unidadDeMedida: 'kg',
          domicilio: 'Test Address',
          calle: 'Test Street',
          ciudad: 'Test City',
          cp: '12345',
          pais: 'Test Country',
          taxId: '123456789',
          idExpedicion: '1'
        })),
        markAllAsTouched: jest.fn(),
        updateValueAndValidity: jest.fn()
      } as any;
      
      component.modalMode = 'agregar';
      component.facturas = [];
      
      component.guardarFactura();
      
      expect(component.facturas.length).toBe(1);
      expect(component.facturas[0].numeroDeLaFactura).toBe('F001');
    });

    it('debe ejecutar eliminarSeleccionados() correctamente', () => {
      const factura1 = createTestFactura({ numeroDeLaFactura: 'F001' });
      const factura2 = createTestFactura({ numeroDeLaFactura: 'F002' });
      
      component.facturas = [factura1, factura2];
      component.selectedRows = [factura1];
      
      component.eliminarSeleccionados();
      
      expect(component.facturas.length).toBe(1);
      expect(component.facturas[0].numeroDeLaFactura).toBe('F002');
    });

    it('debe retornar correctamente puedeModificar getter', () => {
      component.selectedRows = [];
      component.indiceSeleccionado = null;
      expect(component.puedeModificar).toBe(false);
      
      const factura1 = createTestFactura();
      component.selectedRows = [factura1];
      component.indiceSeleccionado = 0;
      expect(component.puedeModificar).toBe(true);
    });

    it('debe retornar correctamente puedeEliminar getter', () => {
      component.selectedRows = [];
      component.indiceSeleccionado = null;
      expect(component.puedeEliminar).toBe(false);
      
      const factura1 = createTestFactura();
      component.selectedRows = [factura1];
      component.indiceSeleccionado = 0;
      expect(component.puedeEliminar).toBe(true);
    });

    it('debe manejar onFilasSeleccionadas correctamente', () => {
      const factura1 = createTestFactura();
      
      component.facturas = [factura1];
      component.onFilasSeleccionadas([factura1]);
      
      expect(component.selectedRows).toEqual([factura1]);
      expect(component.indiceSeleccionado).toBe(0);
    });

    it('debe manejar onSeleccionEliminar correctamente', () => {
      const factura1 = createTestFactura();
      
      component.onSeleccionEliminar([factura1]);
      
      expect(component.seleccionadasParaEliminar).toEqual([factura1]);
    });

    it('debe manejar getter formGroup correctamente', () => {
      expect(component.formGroup).toBe(component.facturaForm);
    });

  });
});
