import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { Solocitud110203Service } from '../../service/service110203.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let mockConsultaQuery: jest.Mocked<ConsultaioQuery>;
  let mockService: jest.Mocked<Solocitud110203Service>;

  const MOCK_STATE_TRUE: ConsultaioState = {
    procedureId: '1',
    parameter: 'param',
    department: 'dept',
    folioTramite: 'folio',
    tipoDeTramite: 'tipo',
    estadoDeTramite: 'en proceso',
    readonly: false,
    create: true,
    update: true,
    consultaioSolicitante: null,
    action_id: '',
    current_user: '',
    id_solicitud: '',
    nombre_pagina: ''
  };

  const MOCK_STATE_FALSE: ConsultaioState = {
    ...MOCK_STATE_TRUE,
    update: false
  };

  beforeEach(async () => {
    mockConsultaQuery = {
      selectConsultaioState$: of(MOCK_STATE_TRUE)
    } as unknown as jest.Mocked<ConsultaioQuery>;

    mockService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ datos: 'respuesta' })),
      actualizarEstadoFormulario: jest.fn()
    } as unknown as jest.Mocked<Solocitud110203Service>;

    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      providers: [
        { provide: Solocitud110203Service, useValue: mockService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set indice by seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should call guardarDatosFormulario if update is true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta true if update is false', () => {
    // Override observable with update = false
    mockConsultaQuery.selectConsultaioState$ = of(MOCK_STATE_FALSE);
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario should call service and update state', () => {
    component.guardarDatosFormulario();
    expect(mockService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(mockService.actualizarEstadoFormulario).toHaveBeenCalledWith({ datos: 'respuesta' });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should clean up destroyNotifier$ on destroy', () => {
    component['destroyNotifier$'] = new Subject<void>();
    const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnInit();

    component['destroyNotifier$'].next();
    component['destroyNotifier$'].complete();

    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});
