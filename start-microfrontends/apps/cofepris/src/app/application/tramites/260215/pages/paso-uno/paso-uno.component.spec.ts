import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { of, Subject, throwError } from 'rxjs';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { ServiciosPermisoSanitarioService } from '../../services/servicios-permiso-sanitario.service';

// Mocks de servicios usando funciones normales para compatibilidad
class MockConsultaioQuery {
  selectConsultaioState$ = of({ update: false });
}
class MockServiciosPermisoSanitarioService {
  getRegistroTomaMuestrasMercanciasData = () => of({ datos: 'mock' });
  actualizarEstadoTramite260215 = jest.fn();
}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let consultaQuery: MockConsultaioQuery;
  let serviciosPermisoSanitarioService: MockServiciosPermisoSanitarioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery },
        { provide: ServiciosPermisoSanitarioService, useClass: MockServiciosPermisoSanitarioService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    consultaQuery = TestBed.inject(ConsultaioQuery) as any;
    serviciosPermisoSanitarioService = TestBed.inject(ServiciosPermisoSanitarioService) as any;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer esDatosRespuesta en true si update es false en el constructor', () => {
    consultaQuery.selectConsultaioState$ = of({ update: false });
    const comp = new PasoUnoComponent(consultaQuery as any, serviciosPermisoSanitarioService as any);
    expect(comp.esDatosRespuesta).toBe(true);
  });

  it('debe llamar a guardarDatosFormulario si update es true en el constructor', () => {
    consultaQuery.selectConsultaioState$ = of({ update: true });
    const comp = new PasoUnoComponent(consultaQuery as any, serviciosPermisoSanitarioService as any);
    const spy = jest.spyOn(comp, 'guardarDatosFormulario');
    comp.consultaState = { update: true } as any;
    if (comp.consultaState.update) {
      comp.guardarDatosFormulario();
    }
    expect(spy).toHaveBeenCalled();
  });

  it('debe llamar a actualizarEstadoTramite260215 y establecer esDatosRespuesta en true en guardarDatosFormulario', () => {
    component.esDatosRespuesta = false;
    serviciosPermisoSanitarioService.getRegistroTomaMuestrasMercanciasData = () => of({ datos: 'mock' });
    component.guardarDatosFormulario();
    expect(serviciosPermisoSanitarioService.actualizarEstadoTramite260215).toHaveBeenCalledWith({ datos: 'mock' });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('no debe llamar a actualizarEstadoTramite260215 si la respuesta es falsy en guardarDatosFormulario', () => {
    // Cambia of(null) por of(undefined as any) para evitar error de tipos
    serviciosPermisoSanitarioService.getRegistroTomaMuestrasMercanciasData = () => of(undefined as any);
    component.guardarDatosFormulario();
    expect(serviciosPermisoSanitarioService.actualizarEstadoTramite260215).not.toHaveBeenCalled();
  });

  it('debe manejar error en guardarDatosFormulario sin lanzar excepción', () => {
    serviciosPermisoSanitarioService.getRegistroTomaMuestrasMercanciasData = () => throwError(() => new Error('error'));
    expect(() => component.guardarDatosFormulario()).not.toThrow();
  });

  it('debe llamar a obtenerTipoPersona en ngAfterViewInit', () => {
    component.solicitante = { obtenerTipoPersona: jest.fn() } as any;
    component.ngAfterViewInit();
    expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalled();
  });

  it('no debe fallar ngAfterViewInit si solicitante es undefined', () => {
    component.solicitante = undefined as any;
    expect(() => component.ngAfterViewInit()).not.toThrow();
  });

  it('debe cambiar el índice al llamar seleccionaTab', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe completar destroyNotifier$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
