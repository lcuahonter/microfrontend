import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite260604Query } from '../../estados/tramite260604Query.query';
import { Tramite260604Store } from '../../estados/tramite260604Store.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockTramite260604Query: any;
  let mockTramite260604Store: any;
  let mockConsultaQuery: any;
  let mockHttp: any;

  beforeEach(async () => {
    mockTramite260604Query = {
      getTabSeleccionado$: of(2)
    };
    mockTramite260604Store = {
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
        { provide: Tramite260604Query, useValue: mockTramite260604Query },
        { provide: Tramite260604Store, useValue: mockTramite260604Store },
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

  it('should set indice when tramite260604Query emits a value', () => {
    component.ngOnInit();
    expect(component.indice).toBe(2);
  });

  it('should call tramite260604Store.updateTabSeleccionado when seleccionaTab is called', () => {
    component.seleccionaTab(5);
    expect(mockTramite260604Store.updateTabSeleccionado).toHaveBeenCalledWith(5);
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
    const mockDatosSolicitudConsultaService = {
      urlServer: '',
      urlServerCatalogos: '',
      http: mockHttp,
      tramite260201Store: {},
      tramite260201Query: {},
      obtenerDatosSolicitud: jest.fn(),
      guardarDatosSolicitud: jest.fn()
    };
    component = new PasoUnoComponent(
      mockTramite260604Query,
      mockTramite260604Store,
      mockConsultaQuery,
      mockHttp,
      mockDatosSolicitudConsultaService as any);
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
    expect(mockHttp.get).toHaveBeenCalledWith('assets/json/260604/respuestaDeActualizacionDe.json');
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