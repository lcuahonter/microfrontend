import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { of, Subject } from 'rxjs';

import { DatosComponent } from './datos.component';
import { Solocitud221601Service } from '../../service/service221601.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

// Mock components for the template
@Component({ selector: 'solicitante', template: '' })
class MockSolicitanteComponent {}

@Component({ selector: 'app-datos-de-la-solicitud', template: '' })
class MockDatosDeLaSolicitudComponent {}

@Component({ selector: 'app-movilizacion', template: '' })
class MockMovilizacionComponent {}

@Component({ selector: 'app-terceros', template: '' })
class MockTercerosComponent {}

@Component({ selector: 'app-pago-de-derechos221601', template: '' })
class MockPagoDeDerechos221601Component {}

fdescribe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let mockSolocitud221601Service: any;
  let mockConsultaioQuery: any;

  // Mock for ConsultaioState
  const mockConsultaioState: ConsultaioState = {
    update: false
  } as ConsultaioState;

  beforeEach(async () => {
    // Mock for Solocitud221601Service
    mockSolocitud221601Service = {
      actualizarEstadoFormulario: jest.fn(),
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ data: 'test' }))
    };

    // Mock for ConsultaioQuery
    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    };

    await TestBed.configureTestingModule({
      declarations: [
        DatosComponent,
        MockSolicitanteComponent,
        MockDatosDeLaSolicitudComponent,
        MockMovilizacionComponent,
        MockTercerosComponent,
        MockPagoDeDerechos221601Component
      ],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Solocitud221601Service, useValue: mockSolocitud221601Service },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.esDatosRespuesta).toBe(false);
    expect(component.consultaState).toBeUndefined();
  });

  it('should update indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(5);
    expect(component.indice).toBe(5);

    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('should subscribe to consultaQuery.selectConsultaioState$ on ngOnInit', () => {
    const mockStateWithUpdate = { update: false } as ConsultaioState;
    mockConsultaioQuery.selectConsultaioState$ = of(mockStateWithUpdate);
    
    component.ngOnInit();
    
    expect(component.consultaState).toEqual(mockStateWithUpdate);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario when consultaState.update is true', () => {
    const mockStateWithUpdate = { update: true } as ConsultaioState;
    mockConsultaioQuery.selectConsultaioState$ = of(mockStateWithUpdate);
    const guardarDatosSpy = jest.spyOn(component, 'guardarDatosFormulario');
    
    component.ngOnInit();
    
    expect(component.consultaState).toEqual(mockStateWithUpdate);
    expect(guardarDatosSpy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true when consultaState.update is false', () => {
    const mockStateWithoutUpdate = { update: false } as ConsultaioState;
    mockConsultaioQuery.selectConsultaioState$ = of(mockStateWithoutUpdate);
    
    component.ngOnInit();
    
    expect(component.consultaState).toEqual(mockStateWithoutUpdate);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call service methods when guardarDatosFormulario is executed', () => {
    component.guardarDatosFormulario();
    
    expect(mockSolocitud221601Service.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
  });

  it('should update esDatosRespuesta and call actualizarEstadoFormulario when guardarDatosFormulario receives valid response', () => {
    const mockResponse = { data: 'test response' };
    mockSolocitud221601Service.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(mockResponse));
    
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockSolocitud221601Service.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResponse);
  });

  it('should not update esDatosRespuesta when guardarDatosFormulario receives null response', () => {
    mockSolocitud221601Service.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    
    expect(component.esDatosRespuesta).toBe(false);
    expect(mockSolocitud221601Service.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('should not update esDatosRespuesta when guardarDatosFormulario receives undefined response', () => {
    mockSolocitud221601Service.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(undefined));
    
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    
    expect(component.esDatosRespuesta).toBe(false);
    expect(mockSolocitud221601Service.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('should handle multiple tab selections correctly', () => {
    expect(component.indice).toBe(1);
    
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
    
    component.seleccionaTab(4);
    expect(component.indice).toBe(4);
    
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should handle edge case tab values', () => {
    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
    
    component.seleccionaTab(-1);
    expect(component.indice).toBe(-1);
    
    component.seleccionaTab(100);
    expect(component.indice).toBe(100);
  });

  it('should properly inject dependencies in constructor', () => {
    expect(component['solocitud221601Service']).toBeDefined();
    expect(component['consultaQuery']).toBeDefined();
    expect(component['destroyNotifier$']).toBeDefined();
  });

  it('should initialize destroyNotifier$ as a Subject', () => {
    expect(component['destroyNotifier$']).toBeInstanceOf(Subject);
  });
});
