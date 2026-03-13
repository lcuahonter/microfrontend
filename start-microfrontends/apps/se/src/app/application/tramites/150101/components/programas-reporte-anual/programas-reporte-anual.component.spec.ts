import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramasReporteAnnualComponent } from './programas-reporte-anual.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Solicitud150101Store } from '../../estados/solicitud150101.store';
import { Solicitud150101Query } from '../../estados/solicitud150101.query';
import { SolicitudService } from '../../services/registro-solicitud-anual.service';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProgramasReporteAnnualComponent', () => {
  let component: ProgramasReporteAnnualComponent;
  let fixture: ComponentFixture<ProgramasReporteAnnualComponent>;

  const mockSolicitudStore = {
    actualizarFolioPrograma: jest.fn(),
    actualizarModalidad: jest.fn(),
    actualizarTipoPrograma: jest.fn(),
    actualizarEstatus: jest.fn(),
    setReporteAnualFechaInicio: jest.fn(),
    setReporteAnualFechaFin: jest.fn(),
    setIdProgramaCompuesto: jest.fn(),
  };

  const mockSolicitudQuery = {
    seleccionarSolicitud$: of({
      folioPrograma: '123',
      modalidad: 'Presencial',
      tipoPrograma: 'Anual',
      estatus: 'Activo',
      reporteAnualFechaInicio: '2025-01-01',
      reporteAnualFechaFin: '2025-12-31',
    }),
    getValue: jest.fn().mockReturnValue({
    solicitudDato: [],
  }),
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false }),
  };

  const mockSolicitudService = {
    obtenerProgramasReporte: jest.fn(() => of([])),
    obtenerReporteFechas: jest.fn(() =>
      of({
        reporteAnualFechaInicio: '2025-01-01',
        reporteAnualFechaFin: '2025-12-31',
      })
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProgramasReporteAnnualComponent, HttpClientTestingModule],
      providers: [
        { provide: Solicitud150101Store, useValue: mockSolicitudStore },
        { provide: Solicitud150101Query, useValue: mockSolicitudQuery },
        { provide: SolicitudService, useValue: mockSolicitudService },
        {
          provide: ValidacionesFormularioService,
          useValue: { isValid: () => true },
        },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramasReporteAnnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with state values', () => {
    const formValue = component.periodoReporteAnual.getRawValue();
    expect(formValue.folioPrograma).toBe('123');
    expect(formValue.modalidad).toBe('Presencial');
    expect(formValue.tipoPrograma).toBe('Anual');
    expect(formValue.estatus).toBe('Activo');
  });

  it('should call obtenerProgramasReporte and populate solicitudDatos', () => {
    const spy = jest.spyOn(mockSolicitudService, 'obtenerProgramasReporte');
    component.obtenerProgramasReporte();
    expect(spy).toHaveBeenCalled();
  });

  it('should call obtenerReporteFechas and update store', () => {
    const spy = jest.spyOn(mockSolicitudService, 'obtenerReporteFechas');
    component.obtenerReporteFechas();
    expect(spy).toHaveBeenCalled();
    expect(mockSolicitudStore.setReporteAnualFechaInicio).toHaveBeenCalledWith(
      '2025-01-01'
    );
    expect(mockSolicitudStore.setReporteAnualFechaFin).toHaveBeenCalledWith(
      '2025-12-31'
    );
  });

  it('should patch form and update store when actualizarProgramasReporte is called', () => {
    const mockEvento = {
      folioPrograma: 'ABC123',
      modalidad: 'Virtual',
      tipoPrograma: 'Semestral',
      estatus: 'Inactivo',
    };

    const emitSpy = jest.spyOn(component.filaDeInformeSeleccionada, 'emit');

    component.actualizarProgramasReporte(mockEvento);

    const formValue = component.periodoReporteAnual.getRawValue();
    expect(formValue.folioPrograma).toBe('ABC123');
    expect(mockSolicitudStore.actualizarFolioPrograma).toHaveBeenCalledWith(
      'ABC123'
    );
    expect(mockSolicitudStore.actualizarModalidad).toHaveBeenCalledWith(
      'Virtual'
    );
    expect(mockSolicitudStore.actualizarTipoPrograma).toHaveBeenCalledWith(
      'Semestral'
    );
    expect(mockSolicitudStore.actualizarEstatus).toHaveBeenCalledWith(
      'Inactivo'
    );
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
