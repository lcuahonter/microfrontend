import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { SolicitudeDeArtificiosPirotecnicosService } from '../../services/solicitude-de-artificios-pirotecnicos.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockServicio: any;
  let mockConsultaQuery: Partial<ConsultaioQuery>;

  beforeEach(async () => {
    mockServicio = {
      obtenerDatos: jest.fn().mockReturnValue(of({ datos: 'mock' })),
      establecerDatosDeLaSolicitud: jest.fn()
    };

    mockConsultaQuery = {
      selectConsultaioState$: of({
      update: false,
      procedureId: '',
      parameter: '',
      department: '',
      folioTramite: '',
      tipoDeTramite: '',
      estadoDeTramite: '',
      readonly: false,
      create: false,
      consultaioSolicitante: {
        folioDelTramite: '',
        fechaDeInicio: '',
        estadoDelTramite: ''
      }
      })
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
      { provide: SolicitudeDeArtificiosPirotecnicosService, useValue: mockServicio },
      { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    });

    it('debería crear el componente', () => {
    expect(component).toBeTruthy();
    });

    it('debería establecer indice en 1 por defecto', () => {
    expect(component.indice).toBe(1);
    });

    it('debería suscribirse a selectConsultaioState$ y establecer estadoConsulta', () => {
    expect(component.estadoConsulta).toEqual({
      update: false,
      procedureId: '',
      parameter: '',
      department: '',
      folioTramite: '',
      tipoDeTramite: '',
      estadoDeTramite: '',
      readonly: false,
      create: false,
      consultaioSolicitante: {
      folioDelTramite: '',
      fechaDeInicio: '',
      estadoDelTramite: ''
      }
    });
    });

    it('debería establecer datosRespuestaDisponibles en true si estadoConsulta.update es false', () => {
    expect(component.datosRespuestaDisponibles).toBe(true);
    });

    it('debería llamar a obtenerDatosBandejaSolicitudes si estadoConsulta.update es true', () => {
    mockConsultaQuery.selectConsultaioState$ = of({
      update: true,
      procedureId: '',
      parameter: '',
      department: '',
      folioTramite: '',
      tipoDeTramite: '',
      estadoDeTramite: '',
      readonly: false,
      create: false,
      consultaioSolicitante: {
      folioDelTramite: '',
      fechaDeInicio: '',
      estadoDelTramite: ''
      },
    });
    const obtenerSpy = jest.spyOn(PasoUnoComponent.prototype, 'obtenerDatosBandejaSolicitudes');
    const newFixture = TestBed.createComponent(PasoUnoComponent);
    newFixture.detectChanges();
    expect(obtenerSpy).toHaveBeenCalled();
    obtenerSpy.mockRestore();
    });

    it('debería establecer indice cuando se llama seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
    });

  it('obtenerDatosBandejaSolicitudes debería llamar a servicio.obtenerDatos y establecerDatosDeLaSolicitud', () => {
    component.datosRespuestaDisponibles = false;
    component.obtenerDatosBandejaSolicitudes();
    expect(mockServicio.obtenerDatos).toHaveBeenCalled();
    expect(mockServicio.establecerDatosDeLaSolicitud).toHaveBeenCalledWith({ datos: 'mock' });
    expect(component.datosRespuestaDisponibles).toBe(true);
  });

  it('debería limpiar notificadorDestruccion$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).notificadorDestruccion$, 'next');
    const completeSpy = jest.spyOn((component as any).notificadorDestruccion$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
