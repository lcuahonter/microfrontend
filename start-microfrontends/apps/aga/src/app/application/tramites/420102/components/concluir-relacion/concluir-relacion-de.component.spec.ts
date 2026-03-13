// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';

import { ConcluirRelacionComponent } from './concluir-relacion-de.component';
import { ConcluirRelacionService } from '../../services/concluir-relacion.service';
import { Tramite420102Store } from '../../estados/tramite420102.store';
import { Tramite420102Query } from '../../estados/tramite420102.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

// Mock services
class MockConcluirRelacionService {
  obtenerTablerList(fileName: string) {
    return observableOf([
      { id: 1, nombre: 'Test Data 1' },
      { id: 2, nombre: 'Test Data 2' }
    ]);
  }
}

class MockTramite420102Store {
  establecerRfc(rfc: string) {
    // Mock implementation
  }
}

class MockTramite420102Query {
  selectSolicitud$ = observableOf({
    rfc: 'TEST123456789',
    fechaInicial: '2024-01-01',
    fechaFinal: '2024-12-31',
    tableDatos: [
      { id: 1, dato: 'Test 1' },
      { id: 2, dato: 'Test 2' }
    ]
  });
}

class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({ readonly: false });
}

describe('ConcluirRelacionComponent', () => {
  let component: ConcluirRelacionComponent;
  let fixture: ComponentFixture<ConcluirRelacionComponent>;
  let mockConcluirRelacionService: MockConcluirRelacionService;
  let mockTramite420102Store: MockTramite420102Store;
  let mockTramite420102Query: MockTramite420102Query;
  let mockConsultaioQuery: MockConsultaioQuery;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConcluirRelacionComponent, // Import the standalone component
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: ConcluirRelacionService, useClass: MockConcluirRelacionService },
        { provide: Tramite420102Store, useClass: MockTramite420102Store },
        { provide: Tramite420102Query, useClass: MockTramite420102Query },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ConcluirRelacionComponent);
    component = fixture.componentInstance;
    
    // Get service instances
    mockConcluirRelacionService = TestBed.inject(ConcluirRelacionService) as any;
    mockTramite420102Store = TestBed.inject(Tramite420102Store) as any;
    mockTramite420102Query = TestBed.inject(Tramite420102Query) as any;
    mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.solicitudState).toBeDefined();
    expect(component.datosTabla).toBeDefined();
    expect(component.concluirFormulario).toBeDefined();
  });

  it('should initialize form state when readonly is false', () => {
    mockConsultaioQuery.selectConsultaioState$ = observableOf({ readonly: false });
    component.esFormularioSoloLectura = false;
    
    jest.spyOn(component, 'crearDesistimientoForm').mockImplementation(() => {});
    component.inicializarEstadoFormulario();
    
    expect(component.crearDesistimientoForm).toHaveBeenCalled();
  });

  it('should initialize form state when readonly is true', () => {
    component.esFormularioSoloLectura = true;
    component.ngOnInit();
    
    jest.spyOn(component, 'guardarDatosFormulario').mockImplementation(() => {});
    component.inicializarEstadoFormulario();
    
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should save form data and disable form when readonly', () => {
    component.ngOnInit();
    component.esFormularioSoloLectura = true;
    
    component.guardarDatosFormulario();
    
    expect(component.concluirFormulario.disabled).toBeTruthy();
  });

  it('should save form data and enable form when not readonly', () => {
    component.ngOnInit();
    component.esFormularioSoloLectura = false;
    
    component.guardarDatosFormulario();
    
    expect(component.concluirFormulario.enabled).toBeTruthy();
  });

  it('should create form with correct initial values', () => {
    component.ngOnInit();
    
    expect(component.concluirFormulario).toBeDefined();
    expect(component.concluirFormulario.get('rfc')?.value).toBe('TEST123456789');
    expect(component.concluirFormulario.get('fechaInicial')?.value).toBe('2024-01-01');
    expect(component.concluirFormulario.get('fechaFinal')?.value).toBe('2024-12-31');
  });

  it('should submit form and get table data when form is valid', () => {
    component.ngOnInit();
    jest.spyOn(mockConcluirRelacionService, 'obtenerTablerList').mockReturnValue(observableOf([
      { id: 1, nombre: 'Test Data 1' },
      { id: 2, nombre: 'Test Data 2' }
    ]));
    
    component.concluirFormularioSubmit();
    
    expect(mockConcluirRelacionService.obtenerTablerList).toHaveBeenCalledWith('concluir-relacion-Tablea.json');
    expect(component.datosTabla).toEqual([
      { id: 1, nombre: 'Test Data 1' },
      { id: 2, nombre: 'Test Data 2' }
    ]);
  });

  it('should not submit form when form is invalid', () => {
    component.ngOnInit();
    component.concluirFormulario.get('rfc')?.setValue('');
    component.concluirFormulario.get('rfc')?.setErrors({ required: true });
    
    jest.spyOn(mockConcluirRelacionService, 'obtenerTablerList');
    
    component.concluirFormularioSubmit();
    
    expect(mockConcluirRelacionService.obtenerTablerList).not.toHaveBeenCalled();
  });

  it('should search RFC and update store', () => {
    component.ngOnInit();
    component.concluirFormulario.get('rfc')?.setValue('NEW_RFC_123');
    
    jest.spyOn(mockTramite420102Store, 'establecerRfc');
    jest.spyOn(mockConcluirRelacionService, 'obtenerTablerList').mockReturnValue(observableOf([
      { id: 1, nombre: 'Test Data 1' },
      { id: 2, nombre: 'Test Data 2' }
    ]));
    
    component.buscarRFC();
    
    expect(mockTramite420102Store.establecerRfc).toHaveBeenCalledWith('NEW_RFC_123');
    expect(mockConcluirRelacionService.obtenerTablerList).toHaveBeenCalledWith('concluir-relacion-Tablea.json');
  });

  it('should not search RFC when form is invalid', () => {
    component.ngOnInit();
    component.concluirFormulario.get('rfc')?.setValue('');
    component.concluirFormulario.get('rfc')?.setErrors({ required: true });
    
    jest.spyOn(mockConcluirRelacionService, 'obtenerTablerList');
    
    component.buscarRFC();
    
    expect(mockConcluirRelacionService.obtenerTablerList).not.toHaveBeenCalled();
  });

  it('should change fecha inicio', () => {
    component.ngOnInit();
    const newDate = '2024-06-15';
    
    component.cambiarFechaInicio(newDate);
    
    expect(component.concluirFormulario.get('fechaInicial')?.value).toBe(newDate);
  });

  it('should change fecha final', () => {
    component.ngOnInit();
    const newDate = '2024-12-15';
    
    component.cambiarFechaFinal(newDate);
    
    expect(component.concluirFormulario.get('fechaFinal')?.value).toBe(newDate);
  });

  it('should unsubscribe on destroy', () => {
    jest.spyOn(component['destroyNotifier$'], 'next');
    jest.spyOn(component['destroyNotifier$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroyNotifier$'].next).toHaveBeenCalled();
    expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
  });

  it('should handle solicitud state update from ngOnInit subscription', () => {
    const mockData = {
      rfc: 'UPDATED_RFC',
      fechaInicial: '2024-02-01',
      fechaFinal: '2024-11-30',
      tableDatos: [{ id: 3, dato: 'Updated Test' }]
    };
    
    mockTramite420102Query.selectSolicitud$ = observableOf(mockData);
    
    component.ngOnInit();
    
    expect(component.solicitudState).toEqual(mockData);
    expect(component.datosTabla).toEqual(mockData.tableDatos);
  });
});