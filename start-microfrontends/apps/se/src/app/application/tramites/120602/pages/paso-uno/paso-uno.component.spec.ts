import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { DatosEmpresaService } from '../../services/datos-empresa.service';
import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { DatosEmpresa } from '../../modelos/datos-empresa.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockDatosEmpresaService: jest.Mocked<DatosEmpresaService>;
  let mockConsultaioQuery: Partial<ConsultaioQuery>;
  let consultaioState: ConsultaioState;

  beforeEach(async () => {
    consultaioState = { update: false } as ConsultaioState;

    mockDatosEmpresaService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ test: 'data' })),
      actualizarEstadoFormulario: jest.fn()
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(consultaioState)
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: DatosEmpresaService, useValue: mockDatosEmpresaService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar indice en 1 y esDatosRespuesta en true', () => {
    expect(component.indice).toBe(1);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe suscribirse a selectConsultaioState$ y establecer consultaState', () => {
    expect(component.consultaState).toEqual(consultaioState);
  });

  it('debe establecer esDatosRespuesta en true si consultaState.update es false', () => {
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe llamar a guardarDatosFormulario si consultaState.update es true', () => {
    consultaioState.update = true;
    mockConsultaioQuery.selectConsultaioState$ = of(consultaioState);
    const guardarSpy = jest.spyOn(PasoUnoComponent.prototype, 'guardarDatosFormulario');
    // Volver a crear el componente para disparar ngOnInit nuevamente
    const newFixture = TestBed.createComponent(PasoUnoComponent);
    newFixture.detectChanges();
    expect(guardarSpy).toHaveBeenCalled();
    guardarSpy.mockRestore();
  });

  it('guardarDatosFormulario debe llamar a getRegistroTomaMuestrasMercanciasData y actualizarEstadoFormulario', () => {
    component.guardarDatosFormulario();
    expect(mockDatosEmpresaService.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(mockDatosEmpresaService.actualizarEstadoFormulario).toHaveBeenCalledWith({ test: 'data' });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario no debe llamar a actualizarEstadoFormulario si la respuesta es falsy', () => {
    mockDatosEmpresaService.getRegistroTomaMuestrasMercanciasData.mockReturnValueOnce(of(null as unknown as DatosEmpresa));
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(false);
    expect(mockDatosEmpresaService.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('seleccionaTab debe establecer el indice', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe limpiar destroyNotifier$ en ngOnDestroy', () => {
    const destroyNotifier$ = (component as any).destroyNotifier$ as Subject<void>;
    const nextSpy = jest.spyOn(destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});