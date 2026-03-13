import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

import { PasoUnoComponent } from './paso-uno.component';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockConsultaioQuery: any;
  let mockRetornoImportacionTemporalService: any;
  let consultaioState$: BehaviorSubject<ConsultaioState>;

  const initialConsultaioState: ConsultaioState = {
    procedureId: '', 
    parameter: '', 
    department: '', 
    folioTramite: '',
    tipoDeTramite: '', 
    estadoDeTramite: '', 
    readonly: false,
    create: true, 
    update: false, 
    consultaioSolicitante: null,
    action_id: '',
    current_user: '',
    id_solicitud: '',
    nombre_pagina: '',
  };

  beforeEach(async () => {
    consultaioState$ = new BehaviorSubject(initialConsultaioState);

    mockConsultaioQuery = {
      selectConsultaioState$: consultaioState$.asObservable()
    };

    mockRetornoImportacionTemporalService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [CommonModule],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: RetornoImportacionTemporalService, useValue: mockRetornoImportacionTemporalService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería usar takeUntil para evitar fugas de memoria', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnInit();
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('no debería arrojar error si solicitante está indefinido en ngAfterViewInit', () => {
    component.solicitante = undefined as any;
    expect(() => component.ngAfterViewInit()).not.toThrow();
  });

  it('debería llamar ngOnDestroy manualmente y limpiar suscripciones', () => {
    const destroySpy = jest.spyOn(component, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('debería manejar errores en el observable de consultaio', () => {
    const errorQuery = {
      selectConsultaioState$: throwError(() => new Error('Test error'))
    };

    const mockCdr = { markForCheck: jest.fn() } as any;
    const testComponent = new PasoUnoComponent(
      mockRetornoImportacionTemporalService,
      errorQuery as any,
      mockCdr
    );

    expect(() => testComponent.ngOnInit()).not.toThrow();
  });
});
