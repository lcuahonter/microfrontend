import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramasReporteAnnualComponent } from './programas-reporte-annual.component';
import { FormBuilder } from '@angular/forms';
import { Solicitud150102Store } from '../../estados/solicitud150102.store';
import { Solicitud150102Query } from '../../estados/solicitud150102.query';
import { SolicitudService } from '../../services/solicitud.service';
import { ConsultaioQuery } from "@ng-mf/data-access-user";
import { LoginQuery } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { ProgramasReporte } from '../../models/programas-reporte.model';

describe('ProgramasReporteAnnualComponent', () => {
  let component: ProgramasReporteAnnualComponent;
  let fixture: ComponentFixture<ProgramasReporteAnnualComponent>;
  let mockSolicitud150102Store: any;
  let mockSolicitud150102Query: any;
  let mockSolicitudService: any;
  let mockConsultaioQuery: any;
  let mockLoginQuery: any;

  beforeEach(async () => {
    mockSolicitud150102Store = {
      actualizarInicio: jest.fn(),
      actualizarFin: jest.fn(),
      actualizarIndiceDeRegistroDelPrograma: jest.fn(),
      actualizarFolioPrograma: jest.fn(),
      actualizarModalidad: jest.fn(),
      actualizarTipoPrograma: jest.fn(),
      actualizarEstatus: jest.fn(),
      actualizarIdProgramaCompuesto: jest.fn(),
    };
    mockSolicitud150102Query = {
      seleccionarSolicitud$: of({
        inicio: '01-2024',
        fin: '12-2024',
        folioPrograma: 'FP-001',
        modalidad: 'Modalidad1',
        tipoPrograma: 'Tipo1',
        estatus: 'Activo',
        indiceDeRegistroDelPrograma: 0,
      }),
    };
    mockSolicitudService = {
      obtenerReporteFechas: jest.fn().mockReturnValue(of({ inicio: '2024-01-01', fin: '2024-12-31' })),
      obtenerProgramasReporte: jest.fn().mockReturnValue(of({
        datos: [
          {
            folioPrograma: 'FP-001',
            modalidad: 'Modalidad1',
            tipoPrograma: 'Tipo1',
            estatus: 'Activo',
            idProgramaCompuesto: 'ID-001',
            fechaInicioVigencia: '2024-01-01',
            fechaFinVigencia: '2024-12-31'
          }
        ]
      })),
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    };
    mockLoginQuery = {
      selectLoginState$: of({ rfc: 'AAL0409235E6' }),
    };

    await TestBed.configureTestingModule({
      imports: [ProgramasReporteAnnualComponent],
      providers: [
        FormBuilder,
        { provide: Solicitud150102Store, useValue: mockSolicitud150102Store },
        { provide: Solicitud150102Query, useValue: mockSolicitud150102Query },
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: LoginQuery, useValue: mockLoginQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramasReporteAnnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize bsConfig correctly', () => {
    expect(component.bsConfig.dateInputFormat).toBe('MM-YYYY');
    expect(component.bsConfig.minMode).toBe('month');
  });

  it('should initialize solicitudConfiguracionTabla', () => {
    expect(component.solicitudConfiguracionTabla.length).toBe(4);
    expect(component.solicitudConfiguracionTabla[0].encabezado).toBe('Número/Registro de programa');
  });

  it('should call obtenerProgramasReporte on construction', () => {
    expect(mockSolicitudService.obtenerProgramasReporte).toHaveBeenCalled();
    expect(component.solicitudDatos.length).toBe(1);
    expect(component.solicitudDatos[0].folioPrograma).toBe('FP-001');
  });

  it('should set rfcValor on ngOnInit', () => {
    component.rfcValor = '';
    component.ngOnInit();
    expect(component.rfcValor).toBe('AAL0409235E6');
  });

  it('should initialize formProgrmasReporte with correct values', () => {
    component.inicializarFormulario();
    expect(component.formProgrmasReporte.value.folioPrograma).toBe('FP-001');
    expect(component.formProgrmasReporte.get('folioPrograma')?.disabled).toBe(true);
  });

  it('should disable form when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.formProgrmasReporte.disabled).toBe(true);
  });

  it('should enable form when esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.formProgrmasReporte.enabled).toBe(true);
  });

  it('should call actualizarInicio and actualizarFin in obtenerReporteFechas', () => {
    component.obtenerReporteFechas();
    expect(mockSolicitud150102Store.actualizarInicio).toHaveBeenCalledWith('2024-01-01');
    expect(mockSolicitud150102Store.actualizarFin).toHaveBeenCalledWith('2024-12-31');
  });

  it('should map programas response correctly', () => {
    const datos = [
      {
        folioPrograma: 'FP-002',
        modalidad: 'Modalidad2',
        tipoPrograma: 'Tipo2',
        estatus: 'Inactivo',
        idProgramaCompuesto: 'ID-002'
      }
    ];
    const result = component.mapProgramasResponse(datos);
    expect(result[0].folioPrograma).toBe('FP-002');
    expect(result[0].modalidad).toBe('Modalidad2');
  });

  it('should update store and emit event in actualizarProgramasReporte', () => {
    const emitSpy = jest.spyOn(component.filaDeInformeSeleccionada, 'emit');
    component.solicitudDatos = [
      { folioPrograma: 'FP-001', modalidad: '', tipoPrograma: '', estatus: '', idProgramaCompuesto: '' }
    ];
    const evento: ProgramasReporte = { folioPrograma: 'FP-001', modalidad: 'm', tipoPrograma: 't', estatus: 'e', idProgramaCompuesto: 'id' };
    component.actualizarProgramasReporte(evento);
    expect(mockSolicitud150102Store.actualizarIndiceDeRegistroDelPrograma).toHaveBeenCalledWith(0);
    expect(mockSolicitud150102Store.actualizarFolioPrograma).toHaveBeenCalledWith('FP-001');
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should format date to MM-YYYY', () => {
    expect(component['formatDateToMonthYear']('2024-01-15')).toBe('01-2024');
    expect(component['formatDateToMonthYear']('')).toBe('');
  });

  it('should set nuevaNotificacion in showAlert', () => {
    component.showAlert();
    expect(component.nuevaNotificacion.titulo).toBe('Programa seleccionado');
    expect(component.nuevaNotificacion.tipoNotificacion).toBe('alert');
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario in inicializarEstadoFormulario when not readonly', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario in inicializarEstadoFormulario when readonly', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });
});