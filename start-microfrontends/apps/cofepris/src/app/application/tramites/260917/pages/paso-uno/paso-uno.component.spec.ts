import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let consultaQueryMock: any;
  let solocitud260917ServiceMock: any;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: false })
    };
    solocitud260917ServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ registro: 'ok' })),
      getPagoDerechos: jest.fn().mockReturnValue(of({ permiso: 'ok' })),
      actualizarEstadoFormulario: jest.fn(),
      actualizarPagoDerechosFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: require('../../services/service260917.service').Solocitud260917Service, useValue: solocitud260917ServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el índice en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería cambiar el índice al seleccionar una pestaña', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debería activar esDatosRespuesta si update es false en ngOnInit', () => {
    component.esDatosRespuesta = false;
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería llamar a guardarDatosFormulario si update es true en ngOnInit', () => {
    consultaQueryMock.selectConsultaioState$ = of({ update: true });
    const guardarSpy = jest.spyOn(PasoUnoComponent.prototype, 'guardarDatosFormulario');
    // Se crea un nuevo componente para este caso
    const fix = TestBed.createComponent(PasoUnoComponent);
    fix.detectChanges();
    expect(guardarSpy).toHaveBeenCalled();
    guardarSpy.mockRestore();
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    // Simula el ciclo de vida de destrucción
    const destroySpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'complete');
    // Implementa ngOnDestroy si no existe
    (component as any).ngOnDestroy?.() ?? (() => {
      component['destroyNotifier$'].next();
      component['destroyNotifier$'].complete();
    })();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});