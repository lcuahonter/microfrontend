import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { of } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { SolicitudService } from '../../services/solicitud.service';

// Componente mock para <solicitante>
@Component({
  selector: 'solicitante',
  template: ''
})
class MockSolicitanteComponent {
  obtenerTipoPersona = jest.fn();
}

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let consultaQueryMock: any;
  let solicitudServiceMock: any;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: false })
    };
    solicitudServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ test: 'data' })),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [DatosComponent, MockSolicitanteComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: SolicitudService, useValue: solicitudServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Asignar el mock DESPUÉS de detectChanges para que @ViewChild no sea undefined
    component.solicitante = new MockSolicitanteComponent() as any;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer esDatosRespuesta en true si consultaState.update es false en ngOnInit', () => {
    component.consultaState = { update: false } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe llamar a guardarDatosFormulario si consultaState.update es true en ngOnInit', () => {
    consultaQueryMock.selectConsultaioState$ = of({ update: true });
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.consultaState = { update: true } as any;
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('debe actualizar indice cuando se llama seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe llamar a solicitudService.actualizarEstadoFormulario y establecer esDatosRespuesta en true en guardarDatosFormulario', () => {
    component.solicitante = new MockSolicitanteComponent() as any; // Asegurarse de que esté definido
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(solicitudServiceMock.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(solicitudServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith({ test: 'data' });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe limpiar las suscripciones en ngOnDestroy', () => {
    component.solicitante = new MockSolicitanteComponent() as any; // Asegurarse de que esté definido
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
