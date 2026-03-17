import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { SharedModalComponent } from '../../components/shared-modal/shared-modal.component';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let datosComunesSvcMock: any;
  let tercerosRelacionadosSvcMock: any;
  let registrosDeComercioExteriorSvcMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
       datosComunesSvcMock = {
      getConsultaDatosComunes: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };
    tercerosRelacionadosSvcMock = {
      getConsultaDatos: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };
    registrosDeComercioExteriorSvcMock = {
      getConsultaDatos: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
      getConsultaDatosDos: jest.fn(),
      estadoFormulario: jest.fn(),
    };
    consultaQueryMock = {
      selectConsultaioState$: new Subject<any>(),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,SolicitanteComponent,SharedModalComponent],
      declarations: [PasoUnoComponent],
           providers: [
        { provide: 'DatosComunesService', useValue: datosComunesSvcMock },
        { provide: 'TercerosRelacionadosService', useValue: tercerosRelacionadosSvcMock },
        { provide: 'RegistrosDeComercioExteriorService', useValue: registrosDeComercioExteriorSvcMock },
        { provide: 'ConsultaioQuery', useValue: consultaQueryMock },
      ],
    }).overrideComponent(PasoUnoComponent, {
      set: {
        providers: [
          { provide: 'DatosComunesService', useValue: datosComunesSvcMock },
          { provide: 'TercerosRelacionadosService', useValue: tercerosRelacionadosSvcMock },
          { provide: 'RegistrosDeComercioExteriorService', useValue: registrosDeComercioExteriorSvcMock },
          { provide: 'ConsultaioQuery', useValue: consultaQueryMock },
        ],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;

    (component as any).datosComunesSvc = datosComunesSvcMock;
    (component as any).tercerosRelacionadosSvc = tercerosRelacionadosSvcMock;
    (component as any).registrosDeComercioExteriorSvc = registrosDeComercioExteriorSvcMock;
    (component as any).consultaQuery = consultaQueryMock;

    fixture.detectChanges();
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

    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should not throw error when seleccionaTab is called with invalid input', () => {
    expect(() => component.seleccionaTab(null as unknown as number)).not.toThrow();
    expect(() => component.seleccionaTab(undefined as unknown as number)).not.toThrow();
  });

  it('should update consultaState and call guardar methods if update is true in ngOnInit', () => {
    jest.spyOn(component, 'guardarDatosComunesFormulario').mockImplementation(() => {});
    jest.spyOn(component, 'guardarTercerosFormulario').mockImplementation(() => {});
    jest.spyOn(component, 'guardarDatosFormulario').mockImplementation(() => {});
    jest.spyOn(component, 'guardarIvaeiepsFormulario').mockImplementation(() => {});
    const state = { update: true };
    consultaQueryMock.selectConsultaioState$.next(state);
    expect(component.consultaState).toBe(state);
    expect(component.guardarDatosComunesFormulario).toHaveBeenCalled();
    expect(component.guardarTercerosFormulario).toHaveBeenCalled();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
    expect(component.guardarIvaeiepsFormulario).toHaveBeenCalled();
  });

  it('should update consultaState and not call guardar methods if update is false in ngOnInit', () => {
    jest.spyOn(component, 'guardarDatosComunesFormulario').mockImplementation(() => {});
    jest.spyOn(component, 'guardarTercerosFormulario').mockImplementation(() => {});
    jest.spyOn(component, 'guardarDatosFormulario').mockImplementation(() => {});
    jest.spyOn(component, 'guardarIvaeiepsFormulario').mockImplementation(() => {});
    const state = { update: false };
    consultaQueryMock.selectConsultaioState$.next(state);
    expect(component.consultaState).toBe(state);
    expect(component.guardarDatosComunesFormulario).not.toHaveBeenCalled();
    expect(component.guardarTercerosFormulario).not.toHaveBeenCalled();
    expect(component.guardarDatosFormulario).not.toHaveBeenCalled();
    expect(component.guardarIvaeiepsFormulario).not.toHaveBeenCalled();
  });

  it('guardarDatosComunesFormulario should call actualizarEstadoFormulario with response', () => {
    const response = { x: 1 };
    datosComunesSvcMock.getConsultaDatosComunes.mockReturnValue(of(response));
    component.guardarDatosComunesFormulario();
    expect(datosComunesSvcMock.actualizarEstadoFormulario).toHaveBeenCalledWith(response);
  });

  it('guardarTercerosFormulario should call actualizarEstadoFormulario for each entry', () => {
    const response = { c: 3, d: 4 };
    tercerosRelacionadosSvcMock.getConsultaDatos.mockReturnValue(of(response));
    component.guardarTercerosFormulario();
    expect(tercerosRelacionadosSvcMock.actualizarEstadoFormulario).toHaveBeenCalledWith('c', 3);
    expect(tercerosRelacionadosSvcMock.actualizarEstadoFormulario).toHaveBeenCalledWith('d', 4);
  });

  it('guardarDatosFormulario should call actualizarEstadoFormulario for each entry', () => {
    const response = { a: 1, b: 2 };
    registrosDeComercioExteriorSvcMock.getConsultaDatos.mockReturnValue(of(response));
    component.guardarDatosFormulario();
    expect(registrosDeComercioExteriorSvcMock.actualizarEstadoFormulario).toHaveBeenCalledWith('a', 1);
    expect(registrosDeComercioExteriorSvcMock.actualizarEstadoFormulario).toHaveBeenCalledWith('b', 2);
  });

  it('guardarIvaeiepsFormulario should call estadoFormulario with response', () => {
    const response = { foo: 'bar' };
    registrosDeComercioExteriorSvcMock.getConsultaDatosDos.mockReturnValue(of(response));
    component.guardarIvaeiepsFormulario();
    expect(registrosDeComercioExteriorSvcMock.estadoFormulario).toHaveBeenCalledWith(response);
  });

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
    const destroyed$ = (component as any).destroyNotifier$;
    const completeSpy = jest.spyOn(destroyed$, 'complete');
    const nextSpy = jest.spyOn(destroyed$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
