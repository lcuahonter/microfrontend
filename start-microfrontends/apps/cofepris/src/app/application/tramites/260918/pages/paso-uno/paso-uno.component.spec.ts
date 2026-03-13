import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { ModificacionPermisoLabService } from '../../services/modificacion-permiso-lab.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockConsultaQuery: Partial<ConsultaioQuery>;
  let mockModificacionService: Partial<ModificacionPermisoLabService>;

  const RESPUESTA_MOCK: Record<string, string> = { campo: 'valor' };

  const CONSULTAIO_STATE_MOCK: ConsultaioState = {
    procedureId: '123',
    parameter: 'abc',
    department: 'semarnat',
    folioTramite: '999888777',
    tipoDeTramite: 'Permiso Modificación',
    estadoDeTramite: 'EN_PROCESO',
    readonly: false,
    create: false,
    update: true,
    consultaioSolicitante: null,
    action_id: '',
    current_user: '',
    id_solicitud: '',
    nombre_pagina: ''
  };

  beforeEach(async () => {
    mockConsultaQuery = {
      selectConsultaioState$: of(CONSULTAIO_STATE_MOCK)
    };

    mockModificacionService = {
      obtenerDatosInicialesFormulario: jest.fn().mockReturnValue(of(RESPUESTA_MOCK)),
      actualizarEstadoFormulario: jest.fn(),
      obtenerValoresFormularioPagoDerechos: jest.fn().mockReturnValue(of(RESPUESTA_MOCK)),
      actualizarValoresFormularioPagoDerechos: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [PasoUnoComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: ModificacionPermisoLabService, useValue: mockModificacionService },
        provideHttpClient()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('debe inicializar el componente y cargar los datos si "update" es true', () => {
    component.ngOnInit();

    expect(component.consultaState).toEqual(CONSULTAIO_STATE_MOCK);
    expect(mockModificacionService.obtenerDatosInicialesFormulario).toHaveBeenCalled();
    expect(mockModificacionService.actualizarEstadoFormulario).toHaveBeenCalledWith(RESPUESTA_MOCK);
    expect(mockModificacionService.obtenerValoresFormularioPagoDerechos).toHaveBeenCalled();
    expect(mockModificacionService.actualizarValoresFormularioPagoDerechos).toHaveBeenCalledWith(RESPUESTA_MOCK);
  });

  it('debe actualizar el índice de pestaña correctamente', () => {
    const NUEVO_INDICE: number = 3;
    component.seleccionaTab(NUEVO_INDICE);
    expect(component.indice).toBe(NUEVO_INDICE);
  });
});
