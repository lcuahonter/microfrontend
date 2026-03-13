import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosPageComponent } from './datos-page.component';
import { DatosServiceService } from '../../../../shared/services/datos-service.service';
import { ConsultaioQuery, TIPO_PERSONA, SolicitanteComponent } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosComponent', () => {
  let component: DatosPageComponent;
  let fixture: ComponentFixture<DatosPageComponent>;
  let mockDatosService: any;
  let mockConsultaioQuery: any;
  let mockSolicitanteComponent: any;

  beforeEach(async () => {
    mockDatosService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ update: false }),
    };
    mockSolicitanteComponent = {
      obtenerTipoPersona: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DatosPageComponent],
      providers: [
        { provide: DatosServiceService, useValue: mockDatosService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPageComponent);
    component = fixture.componentInstance;
    // Simula ViewChild
    component.solicitante = mockSolicitanteComponent;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el índice en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería cambiar el índice al llamar seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debería suscribirse a selectConsultaioState$ y llamar guardarDatosFormulario si update es true', () => {
    const consultaState = { update: true };
    mockConsultaioQuery.selectConsultaioState$ = of(consultaState);
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario').mockImplementation();
    component.ngOnInit();
    expect(component.consultaState).toEqual(consultaState);
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('debería suscribirse a selectConsultaioState$ y poner esDatosRespuesta en true si update es false', () => {
    const consultaState = { update: false };
    mockConsultaioQuery.selectConsultaioState$ = of(consultaState);
    component.ngOnInit();
    expect(component.consultaState).toEqual(consultaState);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario debería actualizar esDatosRespuesta y llamar actualizarEstadoFormulario', () => {
    const resp = { test: 'value' };
    mockDatosService.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(resp));
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(mockDatosService.actualizarEstadoFormulario).toHaveBeenCalledWith(resp);
  });

  it('guardarDatosFormulario no debería fallar si resp es falsy', () => {
    mockDatosService.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(false);
    expect(mockDatosService.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('ngAfterViewInit debería llamar obtenerTipoPersona con MORAL_NACIONAL', () => {
    component.ngAfterViewInit();
    expect(mockSolicitanteComponent.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
  });

  it('ngOnDestroy debería completar destroyNotifier$', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
