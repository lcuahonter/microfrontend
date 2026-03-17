import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite260201Query } from '../../estados/tramite260201Query.query';
import { Tramite260201Store } from '../../estados/tramite260201Store.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockTramite260201Query: any;
  let mockTramite260201Store: any;
  let mockConsultaQuery: any;
  let mockHttp: any;

  beforeEach(async () => {
    mockTramite260201Query = {
      getTabSeleccionado$: of(2)
    };
    mockTramite260201Store = {
      updateTabSeleccionado: jest.fn(),
      update: jest.fn()
    };
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: true })
    };
    mockHttp = {
      get: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: Tramite260201Query, useValue: mockTramite260201Query },
        { provide: Tramite260201Store, useValue: mockTramite260201Store },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: HttpClient, useValue: mockHttp }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set indice when tramite260201Query emits a value', () => {
    component.ngOnInit();
    expect(component.indice).toBe(2);
  });

  it('should call tramite260201Store.updateTabSeleccionado when seleccionaTab is called', () => {
    component.seleccionaTab(5);
    expect(mockTramite260201Store.updateTabSeleccionado).toHaveBeenCalledWith(5);
  });

  it('should set formularioDeshabilitado to false and call guardarDatosFormulario if consultaState.update is true', () => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario').mockImplementation();
    mockConsultaQuery.selectConsultaioState$ = of({ update: true });
    component.ngOnInit();
    expect(component.formularioDeshabilitado).toBe(false);
    expect(guardarSpy).toHaveBeenCalled();
    guardarSpy.mockRestore();
  });

  it('should set formularioDeshabilitado to true if consultaState.readonly is true', () => {
    mockConsultaQuery.selectConsultaioState$ = of({ readonly: true });
    component = new PasoUnoComponent(
      mockTramite260201Query,
      mockTramite260201Store,
      mockConsultaQuery,
      mockHttp
    );
    component.ngOnInit();
    expect(component.formularioDeshabilitado).toBe(true);
  });


  it('should call actualizarEstadoFormulario if getRegistroTomaMuestrasMercanciasData returns data', () => {
    const data = { test: 123 };
    jest.spyOn(component, 'getRegistroTomaMuestrasMercanciasData').mockReturnValue(of(data as any));
    const actualizarSpy = jest.spyOn(component, 'actualizarEstadoFormulario').mockImplementation();
    component.guardarDatosFormulario();
    expect(actualizarSpy).toHaveBeenCalledWith(data as any);
    actualizarSpy.mockRestore();
  });

 

  it('should call http.get with correct URL in getRegistroTomaMuestrasMercanciasData', () => {
    mockHttp.get.mockReturnValue(of({}));
    component.getRegistroTomaMuestrasMercanciasData().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith('assets/json/260201/respuestaDeActualizacionDe.json');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should emit next on destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    // This test ensures no errors are thrown when ngOnDestroy is called after ngOnInit
    component.ngOnInit();
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});