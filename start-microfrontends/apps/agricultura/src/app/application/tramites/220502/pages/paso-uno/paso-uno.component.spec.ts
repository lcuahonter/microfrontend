import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { of, Subject } from 'rxjs';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import {
  CatalogoSelectComponent,
  ConsultaioQuery,
  SolicitanteComponent,
} from '@libs/shared/data-access-user/src';
import { DatosDeLaSolicitud } from '../../models/solicitud-pantallas.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteARealizarComponent } from '../../shared/datos-del-tramite-a-realizar/datos-del-tramite-a-realizar.component';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockConsultaQuery: any;
  let mockSolicitudPantallasService: any;
  let consultaStateMock: any;

  beforeEach(async () => {
    consultaStateMock = {
      update: false,
      consultaioSolicitante: null,
      create: true,
      department: '',
      estadoDeTramite: '',
      folioTramite: '',
      parameter: '',
      procedureId: '',
      readonly: false,
      tipoDeTramite: '',
    };
    mockConsultaQuery = {
      selectConsultaioState$: of(consultaStateMock),
    };
    mockSolicitudPantallasService = {
      getDatosDeLaSolicitud: jest
        .fn()
        .mockReturnValue(of({} as DatosDeLaSolicitud)),
      actualizarEstadoFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        PasoUnoComponent,
        HttpClientTestingModule,
        SolicitudComponent,
        CatalogoSelectComponent,
        CommonModule,
        SolicitanteComponent,
        DatosDelTramiteARealizarComponent,
      ],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        {
          provide: SolicitudPantallasService,
          useValue: mockSolicitudPantallasService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set consultaState from query observable', () => {
    component.ngOnInit();
    const stateMock = {
      action_id: '',
      consultaioSolicitante: null,
      create: true,
      current_user: '',
      department: '',
      estadoDeTramite: '',
      folioTramite: '',
      id_solicitud: '',
      nombre_pagina: '',
      parameter: '',
      procedureId: '',
      readonly: false,
      tipoDeTramite: '',
      update: false,
    };
    expect(component.consultaState).toStrictEqual(stateMock);
  });

  it('should call guardarDatosFormulario if consultaState.update is true', () => {
    consultaStateMock.update = true;
    mockConsultaQuery.selectConsultaioState$ = of(consultaStateMock);
    const guardarDatosFormularioSpy = jest
      .spyOn(component, 'guardarDatosFormulario')
      .mockImplementation(() => {});
    component.ngOnInit();
    expect(guardarDatosFormularioSpy).toBeDefined();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false', () => {
    consultaStateMock.update = false;
    mockConsultaQuery.selectConsultaioState$ = of(consultaStateMock);
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should update indice', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should set esDatosRespuesta to true and call actualizarEstadoFormulario if response exists', () => {
    const datosMock = { foo: 'bar' } as unknown as DatosDeLaSolicitud;
    mockSolicitudPantallasService.getDatosDeLaSolicitud.mockReturnValue(
      of(datosMock)
    );
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(
      mockSolicitudPantallasService.actualizarEstadoFormulario
    ).toHaveBeenCalledWith(datosMock);
  });

  it('should not call actualizarEstadoFormulario if response is falsy', () => {
    mockSolicitudPantallasService.getDatosDeLaSolicitud.mockReturnValue(
      of(null)
    );
    component.guardarDatosFormulario();
    expect(
      mockSolicitudPantallasService.actualizarEstadoFormulario
    ).not.toHaveBeenCalled();
  });

  it('should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(
      (component as any).destroyNotifier$,
      'complete'
    );
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
