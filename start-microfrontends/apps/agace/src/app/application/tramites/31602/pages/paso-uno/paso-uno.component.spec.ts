import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {SolicitanteComponent} from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { SharedModalComponent } from '../../components/shared-modal/shared-modal.component';


describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let comercioExteriorSvcMock: any;
  let datosComunesSvcMock: any;
  let tercerosRelacionadosSvcMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
    comercioExteriorSvcMock = {
      getConsultaDatos: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
      getConsultaDatosDos: jest.fn(),
      estadoFormulario: jest.fn(),
    };
    datosComunesSvcMock = {
      getConsultaDatosComunes: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };
    tercerosRelacionadosSvcMock = {
      getConsultaDatos: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
    };
    consultaQueryMock = {
      selectConsultaioState$: new Subject<any>(),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,SolicitanteComponent,SharedModalComponent],
      declarations: [PasoUnoComponent],
      providers: [
        { provide: 'ComercioExteriorService', useValue: comercioExteriorSvcMock },
        { provide: 'DatosComunesService', useValue: datosComunesSvcMock },
        { provide: 'TercerosRelacionadosService', useValue: tercerosRelacionadosSvcMock },
        { provide: 'ConsultaioQuery', useValue: consultaQueryMock },
      ],
    })
      .overrideComponent(PasoUnoComponent, {
        set: {
          providers: [
            { provide: 'ComercioExteriorService', useValue: comercioExteriorSvcMock },
            { provide: 'DatosComunesService', useValue: datosComunesSvcMock },
            { provide: 'TercerosRelacionadosService', useValue: tercerosRelacionadosSvcMock },
            { provide: 'ConsultaioQuery', useValue: consultaQueryMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;

    (component as any).comercioExteriorSvc = comercioExteriorSvcMock;
    (component as any).datosComunesSvc = datosComunesSvcMock;
    (component as any).tercerosRelacionadosSvc = tercerosRelacionadosSvcMock;
    (component as any).consultaQuery = consultaQueryMock;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

it('should update consultaState and call guardar methods if update is true in ngOnInit', () => {
  jest.spyOn(component, 'guardarDatosFormulario').mockImplementation(() => {});
  jest.spyOn(component, 'guardarDatosFormularioDos').mockImplementation(() => {});
  jest.spyOn(component, 'guardarDatosComunesFormulario').mockImplementation(() => {});
  jest.spyOn(component, 'guardarTercerosFormulario').mockImplementation(() => {});
  const state = { update: true };
  consultaQueryMock.selectConsultaioState$.next(state);
  expect(component.consultaState).toBe(state);
  expect(component.guardarDatosFormulario).toHaveBeenCalled();
  expect(component.guardarDatosFormularioDos).toHaveBeenCalled();
  expect(component.guardarDatosComunesFormulario).toHaveBeenCalled();
  expect(component.guardarTercerosFormulario).toHaveBeenCalled();
});

  it('should update consultaState and not call guardar methods if update is false in ngOnInit', () => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    const guardarDosSpy = jest.spyOn(component, 'guardarDatosFormularioDos');
    const guardarComunesSpy = jest.spyOn(component, 'guardarDatosComunesFormulario');
    const guardarTercerosSpy = jest.spyOn(component, 'guardarTercerosFormulario');
    const state = { update: false };
    consultaQueryMock.selectConsultaioState$.next(state);
    expect(component.consultaState).toBe(state);
    expect(guardarSpy).not.toHaveBeenCalled();
    expect(guardarDosSpy).not.toHaveBeenCalled();
    expect(guardarComunesSpy).not.toHaveBeenCalled();
    expect(guardarTercerosSpy).not.toHaveBeenCalled();
  });

  it('guardarDatosFormulario should call actualizarEstadoFormulario for each entry', () => {
    const response = { a: 1, b: 2 };
    comercioExteriorSvcMock.getConsultaDatos.mockReturnValue(of(response));
    component.guardarDatosFormulario();
    expect(comercioExteriorSvcMock.actualizarEstadoFormulario).toHaveBeenCalledWith('a', 1);
    expect(comercioExteriorSvcMock.actualizarEstadoFormulario).toHaveBeenCalledWith('b', 2);
  });

  it('guardarDatosFormularioDos should call estadoFormulario with response', () => {
    const response = { foo: 'bar' };
    comercioExteriorSvcMock.getConsultaDatosDos.mockReturnValue(of(response));
    component.guardarDatosFormularioDos();
    expect(comercioExteriorSvcMock.estadoFormulario).toHaveBeenCalledWith(response);
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

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});