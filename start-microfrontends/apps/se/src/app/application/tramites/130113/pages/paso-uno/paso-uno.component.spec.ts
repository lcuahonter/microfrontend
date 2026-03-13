import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ImportacionEquipoAnticontaminanteService } from '../../services/importacion-equipo-anticontaminante.service';
import { Subject, of } from 'rxjs';
import { ConsultaioQuery, SolicitanteComponent } from '@ng-mf/data-access-user';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosDeLaMercanciaComponent } from '../../../../shared/components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { RepresentacionComponent } from '../../../../shared/components/representacion/representacion.component';
import { PaisProcendenciaComponent } from '../../../../shared/components/pais-procendencia/pais-procendencia.component';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  let importacionEquipoAnticontaminanteServiceSpy: any;
  let consultaQuerySpy: any;

  beforeEach(async () => {
    importacionEquipoAnticontaminanteServiceSpy = {
      getDatosDeLaSolicitud: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };
    consultaQuerySpy = {
      selectConsultaioState$: {
        pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
      },
    };
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent, SolicitudComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientModule, SolicitanteComponent, PaisProcendenciaComponent,PartidasDeLaMercanciaComponent, DatosDelTramiteComponent,DatosDeLaMercanciaComponent,RepresentacionComponent],
      providers: [
        { provide: ImportacionEquipoAnticontaminanteService, useValue: importacionEquipoAnticontaminanteServiceSpy },
        { provide: ConsultaioQuery, useValue: consultaQuerySpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial indice value as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should update indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should call guardarDatosFormulario if consultaState.update is true in ngOnInit', fakeAsync(() => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario').mockImplementation(() => {});
    consultaQuerySpy.selectConsultaioState$ = of({ update: true });
    component.ngOnInit();
    tick();
    expect(guardarSpy).toHaveBeenCalled();
  }));

  it('should set esDatosRespuesta true if consultaState.update is false in ngOnInit', fakeAsync(() => {
    consultaQuerySpy.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    tick();
    expect(component.esDatosRespuesta).toBe(true);
  }));

  it('should set esDatosRespuesta true and call actualizarEstadoFormulario on valid guardarDatosFormulario response', () => {
    const mockResp = { test: 'data' };
    importacionEquipoAnticontaminanteServiceSpy.getDatosDeLaSolicitud.mockReturnValue({
      pipe: () => ({
        subscribe: (fn: any) => fn(mockResp),
      }),
    });
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
    expect(importacionEquipoAnticontaminanteServiceSpy.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResp);
  });

  it('should set esDatosRespuesta false on invalid guardarDatosFormulario response', () => {
    importacionEquipoAnticontaminanteServiceSpy.getDatosDeLaSolicitud.mockReturnValue({
      pipe: () => ({
        subscribe: (fn: any) => fn(null),
      }),
    });
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});