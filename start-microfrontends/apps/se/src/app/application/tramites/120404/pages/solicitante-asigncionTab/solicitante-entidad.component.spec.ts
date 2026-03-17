import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitanteAsigncionComponent } from './solicitante-entidad.component';
import { SolicitudService } from '../../services/solicitud.service';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('SolicitanteAsigncionComponent', () => {
  let component: SolicitanteAsigncionComponent;
  let fixture: ComponentFixture<SolicitanteAsigncionComponent>;
  let solicitudService: jest.Mocked<SolicitudService>;
  let consultaQuery: jest.Mocked<ConsultaioQuery>;

  const mockConsultaioState: ConsultaioState = {
    procedureId: '12345',
    parameter: 'test-param',
    department: 'Finance',
    folioTramite: 'FT123',
    tipoDeTramite: 'some-type',
    estadoDeTramite: 'active',
    readonly: true,
    create: true,
    update: false,
    consultaioSolicitante: null,
    action_id: '',
    current_user: '',
    id_solicitud: '',
    nombre_pagina: ''
  };
  
  const mockResponse = {
    id: '12345',
    status: 'success',
    details: {}
  };
  beforeEach(async () => {
    solicitudService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn(() => of({})),
      actualizarEstadoFormulario: jest.fn()
    } as any;

    consultaQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    } as any;

    await TestBed.configureTestingModule({
      declarations: [SolicitanteAsigncionComponent],
      imports: [SolicitanteComponent,HttpClientModule],
      providers: [
        { provide: SolicitudService, useValue: solicitudService },
        { provide: ConsultaioQuery, useValue: consultaQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitanteAsigncionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update tab index when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should retrieve and set consultaState on init', () => {
    component.ngOnInit();
    expect(component.consultaState).toEqual(mockConsultaioState);
  });

  it('should call guardarDatosFormulario when consultaState.update is true', () => {
    consultaQuery.selectConsultaioState$ = of({ ...mockConsultaioState, update: true });
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true when consultaState.update is false', () => {
    consultaQuery.selectConsultaioState$ = of({ ...mockConsultaioState, update: false });
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call solicitudService on guardarDatosFormulario', () => {
    component.guardarDatosFormulario();
    expect(solicitudService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
  });

    it('should emit buscarIntento event', () => {
      const spy = jest.spyOn(component.buscarIntento, 'emit');
      const event = { submitted: true, invalid: false, numTramite: '123' };
      component.onBuscarIntento(event);
      expect(spy).toHaveBeenCalledWith(event);
    });

    it('should validate formularios correctly', () => {
      const mockTramiteQuery: any = {
        getValue: jest.fn(() => ({ formValidity: { asigncion: true, solicitante: true } }))
      };
      component['tramite120404Query'] = mockTramiteQuery;
      expect(component.validarFormularios()).toBe(true);
      mockTramiteQuery.getValue.mockReturnValue({ formValidity: { asigncion: false, solicitante: true } });
      expect(component.validarFormularios()).toBe(false);
    });

    it('should clean up on ngOnDestroy', () => {
      const spy = jest.spyOn(component.destroyNotifier$, 'next');
      const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });
});
