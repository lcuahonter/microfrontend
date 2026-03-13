import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModificacionPermisoSanitarioService } from '../../services/modificacion-permosi-sanitario.service';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock para TIPO_PERSONA
const TIPO_PERSONA = { MORAL_NACIONAL: 'MORAL_NACIONAL' };

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let consultaQueryMock: any;
  let servicioMock: any;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ update: false })
    };
    servicioMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ registro: true })),
      getPagoDerechos: jest.fn().mockReturnValue(of({ permiso: true })),
      actualizarEstadoFormulario: jest.fn(),
      actualizarPagoDerechosFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [ require('@angular/common/http/testing').HttpClientTestingModule],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: ModificacionPermisoSanitarioService, useValue: servicioMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    // Mock de solicitante para todos los tests
    component.solicitante = { obtenerTipoPersona: jest.fn() } as any;
    // Mock global para TIPO_PERSONA si es necesario
    (globalThis as any).TIPO_PERSONA = TIPO_PERSONA;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar y suscribirse a selectConsultaioState$ con update=false', () => {
    component.consultaState = undefined as any;
    component.esDatosRespuesta = false;
    consultaQueryMock.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.consultaState).toEqual({ update: false });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería llamar guardarDatosFormulario si update=true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario').mockImplementation();
    consultaQueryMock.selectConsultaioState$ = of({ update: true });
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('guardarDatosFormulario no debe actualizar si no hay datos', (done) => {
    servicioMock.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    servicioMock.getPagoDerechos.mockReturnValue(of(null));
    const actualizarEstadoSpy = jest.spyOn(servicioMock, 'actualizarEstadoFormulario');
    const actualizarPagoSpy = jest.spyOn(servicioMock, 'actualizarPagoDerechosFormulario');
    component.guardarDatosFormulario();
    setTimeout(() => {
      expect(actualizarEstadoSpy).not.toHaveBeenCalled();
      expect(actualizarPagoSpy).not.toHaveBeenCalled();
      done();
    }, 0);
  });

  it('debería cambiar el índice con seleccionaTab', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debería limpiar destroyNotifier$ en ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});