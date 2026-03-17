import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { DatosComunesService } from '../../../../shared/services/datos-comunes.service';
import { TercerosRelacionadosService } from '../../../../shared/services/terceros-relacionados.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let DatosComunesServiceMock: any;
  let TercerosRelacionadosServiceMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
    DatosComunesServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ test: 'data' })),
      actualizarEstadoFormulario: jest.fn(),
    };
    TercerosRelacionadosServiceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ test: 'data' })),
      actualizarEstadoFormulario: jest.fn(),
    };
    consultaQueryMock = {
      selectConsultaioState$: of({ update: true }),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: DatosComunesService, useValue: DatosComunesServiceMock },
        { provide: TercerosRelacionadosService, useValue: TercerosRelacionadosServiceMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should call guardarDatosComunesFormulario if consultaState.update is true', () => {
    const spy = jest.spyOn(component, 'guardarDatosComunesFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false', () => {
    consultaQueryMock.selectConsultaioState$ = of({ update: false });
    component.ngOnInit();
    expect(component.esFormularioSoloLectura).toBe(true);
  });


  it('ngOnDestroy should complete destroyNotifier$', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should initialize indice to 1 by default', () => {
    expect(component.indice).toBe(1);
  });

  it('should unsubscribe from observables on destroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('should handle multiple seleccionaTab calls', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
    component.seleccionaTab(5);
    expect(component.indice).toBe(5);
  });

  it('should not throw error if ngOnDestroy is called multiple times', () => {
    expect(() => {
      component.ngOnDestroy();
      component.ngOnDestroy();
    }).not.toThrow();
  });

  it('should not update esFormularioSoloLectura if consultaState is undefined', () => {
    consultaQueryMock.selectConsultaioState$ = of(undefined);
    component.ngOnInit();
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should not call guardarDatosComunesFormulario if consultaState.update is falsy', () => {
    consultaQueryMock.selectConsultaioState$ = of({ update: false });
    const spy = jest.spyOn(component, 'guardarDatosComunesFormulario');
    component.ngOnInit();
    expect(spy).not.toHaveBeenCalled();
  });

    it('should update consultaState and not call guardar methods if update is false in ngOnInit', () => {
    const guardarSpy = jest.spyOn(component, 'getAgenteAduanalFormulario');
    const guardarDosSpy = jest.spyOn(component, 'getAgenteFormulario');
    const guardarComunesSpy = jest.spyOn(component, 'guardarDatosComunesFormulario');
    const guardarTercerosSpy = jest.spyOn(component, 'guardarTercerosFormulario');
    const guardarPerfilesSpy = jest.spyOn(component, 'getPerfilesFormulario');
    const guardarPerfilesAccodianeSpy = jest.spyOn(component, 'getPerfilesAccodianeFormulario');
    const state = { update: false };
    consultaQueryMock.selectConsultaioState$.next(state);
    expect(component.consultaState).toBe(state);
    expect(guardarSpy).not.toHaveBeenCalled();
    expect(guardarDosSpy).not.toHaveBeenCalled();
    expect(guardarComunesSpy).not.toHaveBeenCalled();
    expect(guardarTercerosSpy).not.toHaveBeenCalled();
    expect(guardarPerfilesSpy).not.toHaveBeenCalled();
    expect(guardarPerfilesAccodianeSpy).not.toHaveBeenCalled();
  });

    it('guardarDatosFormulario should call actualizarEstadoFormulario for each entry', () => {
    const response = { a: 1, b: 2 };
    DatosComunesServiceMock.getConsultaDatos.mockReturnValue(of(response));
    component.guardarDatosComunesFormulario();
    expect(DatosComunesServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith('a', 1);
    expect(DatosComunesServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith('b', 2);
  });

  it('guardarDatosFormularioDos should call estadoFormulario with response', () => {
    const response = { foo: 'bar' };
    DatosComunesServiceMock.getConsultaDatosDos.mockReturnValue(of(response));
    component.guardarDatosComunesFormulario();
    expect(DatosComunesServiceMock.estadoFormulario).toHaveBeenCalledWith(response);
  });

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
