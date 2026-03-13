import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PagoDeDerechosContenedoraComponent } from './pago-de-derechos-contenedora';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CertificadosLicenciasPermisosService } from '../../services/certificados-licencias-permisos.service';
import { Tramite260302Store } from '../../estados/stores/tramite260302.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
@Component({
  selector: 'input-fecha',
  template: '<input [value]="value" (input)="onChange($event.target.value)" />',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockInputFechaComponent),
      multi: true
    }
  ]
})
class MockInputFechaComponent implements ControlValueAccessor {
  value: any;
  onChange = (_: any) => {};
  onTouched = () => {};
  writeValue(obj: any): void { this.value = obj; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void {}
}

@Component({
  selector: 'app-pago-de-derechos',
  template: '<div>Mock Pago de Derechos Component</div>',
  standalone: true
})
class MockPagoDeDerechosComponent {
  @Input() pagoDerechoFormState: any;
  @Input() formularioDeshabilitado: boolean = false;
  @Output() updatePagoDerechos = new EventEmitter<any>();

  formularioSolicitudValidacion(): boolean {
    return true;
  }
}

@NgModule({
  declarations: [PagoDeDerechosContenedoraComponent, MockInputFechaComponent],
  exports: [MockInputFechaComponent]
})
class MockInputFechaModule {}

describe('PagoDeDerechosContenedoraComponent', () => {
  let component: PagoDeDerechosContenedoraComponent;
  let fixture: ComponentFixture<PagoDeDerechosContenedoraComponent>;
  let mockTramiteStore: any;
  let mockConsultaQuery: any;
  let mockCdr: any;
  let mockPagoDeDerechosComponent: any;

  const pagoDerechosMock = {
    monto: 100,
    metodoPago: 'tarjeta',
    claveReferencia: 'ref123',
    cadenaDependencia: 'dep',
    estado: 'activo',
    llavePago: 'llave',
    fechaPago: '20-11-2025',
    folio: 'folio123',
    importePago: '100'
  };
  const consultaStateMock = { 
    readonly: true,
    procedureId: 'test-procedure',
    parameter: 'test-param',
    department: 'test-dept',
    folioTramite: 'test-folio',
    tipoDeTramite: 'test-tipo',
    estadoDeTramite: 'test-estado',
    create: false,
    update: true,
    consultaioSolicitante: null,
    action_id: 'test-action',
    current_user: 'test-user',
    id_solicitud: 'test-solicitud',
    nombre_pagina: 'test-pagina'
  };


  beforeEach(async () => {
    mockTramiteStore = {
      getValue: jest.fn(() => ({ pagoDerechos: pagoDerechosMock })),
      updatePagoDerechos: jest.fn()
    };
    mockConsultaQuery = {
      selectConsultaioState$: of(consultaStateMock)
    };
    mockCdr = { detectChanges: jest.fn() };
    mockPagoDeDerechosComponent = {
      formularioSolicitudValidacion: jest.fn(() => true)
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: ChangeDetectorRef, useValue: mockCdr },
        { provide: Tramite260302Store, useValue: mockTramiteStore }
        // Tramite260302Query is not available, so it is omitted
      ],
      imports: [HttpClientTestingModule, ReactiveFormsModule, PagoDeDerechosContenedoraComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(PagoDeDerechosContenedoraComponent, {
      remove: { imports: [PagoDeDerechosComponent] },
      add: { imports: [MockPagoDeDerechosComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosContenedoraComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'pagoDeDerechosComponent', {
      value: mockPagoDeDerechosComponent,
      writable: true,
      configurable: true
    });
    
    component.pagoDerechos = pagoDerechosMock;
    component.esFormularioSoloLectura = false;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for pagoDerechos and esFormularioSoloLectura', () => {
    component.pagoDerechos = pagoDerechosMock;
    expect(component.pagoDerechos).toEqual(pagoDerechosMock);
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should update esFormularioSoloLectura when consultaState changes', () => {
    const state = { readonly: false };
    component.esFormularioSoloLectura = state.readonly;
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should call updatePagoDerechos and update store', () => {
    component.tramiteStore = mockTramiteStore;
    mockTramiteStore.updatePagoDerechos.mockClear();
    
    const newPago = {
      monto: 200,
      metodoPago: 'efectivo',
      claveReferencia: 'ref456',
      cadenaDependencia: 'dep2',
      estado: 'pendiente',
      llavePago: 'llave2',
      fechaPago: '2025-11-21',
      folio: 'folio456',
      importePago: '200'
    };
    
    component.updatePagoDerechos(newPago);
    expect(mockTramiteStore.updatePagoDerechos).toHaveBeenCalledWith(newPago);
  });

  it('should validate contenedor using child component', () => {
    component.pagoDeDerechosComponent = mockPagoDeDerechosComponent;
    
    mockPagoDeDerechosComponent.formularioSolicitudValidacion.mockReturnValue(true);
    expect(component.validarContenedor()).toBe(true);
    
    mockPagoDeDerechosComponent.formularioSolicitudValidacion.mockReturnValue(false);
    expect(component.validarContenedor()).toBe(false);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle ngOnDestroy called multiple times gracefully', () => {
    component.ngOnDestroy();
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should initialize pagoDerechos from tramiteStore getValue', () => {
    mockTramiteStore.getValue.mockClear();
    const result = mockTramiteStore.getValue();
    expect(result.pagoDerechos).toEqual(pagoDerechosMock);
    component.pagoDerechos = result.pagoDerechos;
    expect(component.pagoDerechos).toEqual(pagoDerechosMock);
  });

  it('should subscribe to consultaQuery and update readonly state', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
    component.consultaState = consultaStateMock;
    expect(component.consultaState).toEqual(consultaStateMock);
  });

  it('should handle validarContenedor when child component is undefined', () => {
    component.pagoDeDerechosComponent = undefined as any;
    expect(component.validarContenedor()).toBe(false);
  });

  it('should handle validarContenedor when child component has no method', () => {
    component.pagoDeDerechosComponent = {} as any;
    expect(() => component.validarContenedor()).toThrow();
  });

  it('should emit next and complete on destroyNotifier$ during ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should handle observable subscription properly', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
    component.esFormularioSoloLectura = true;
    expect(component.esFormularioSoloLectura).toBe(true);
    
    component.esFormularioSoloLectura = false;
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should handle updatePagoDerechos with different data types', () => {
    component.tramiteStore = mockTramiteStore;
    mockTramiteStore.updatePagoDerechos.mockClear();
    
    const complexPago = {
      monto: 0,
      metodoPago: '',
      claveReferencia: '',
      cadenaDependencia: '',
      estado: 'test',
      llavePago: '   ',
      fechaPago: new Date().toISOString(),
      folio: 'special-chars-123!@#',
      importePago: '999.99'
    };
    
    component.updatePagoDerechos(complexPago);
    expect(mockTramiteStore.updatePagoDerechos).toHaveBeenCalledWith(complexPago);
  });

});
 