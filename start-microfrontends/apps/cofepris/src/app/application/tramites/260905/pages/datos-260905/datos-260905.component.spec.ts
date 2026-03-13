import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Datos260905Component } from './datos-260905.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// Mock para TIPO_PERSONA
const TIPO_PERSONA = { MORAL_NACIONAL: 'MORAL_NACIONAL' };

describe('PasoUnoComponent', () => {
  let component: Datos260905Component;
  let fixture: ComponentFixture<Datos260905Component>;
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
      declarations: [Datos260905Component],
      imports: [ require('@angular/common/http/testing').HttpClientTestingModule],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: Datos260905Component, useValue: servicioMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Datos260905Component);
    component = fixture.componentInstance;
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
  it('guardarDatosFormulario debe actualizar estado y pago si hay datos', (done) => {
  // Mocks para los datos de registro y permiso
  const registroMock = { registro: true };
  const permisoMock = { permiso: true };
  // Mockea los métodos para devolver datos
  component['solocitud220401Service'] = {
    getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of(registroMock)),
    getPagoDerechos: jest.fn().mockReturnValue(of(permisoMock)),
    actualizarEstadoFormulario: jest.fn(),
    actualizarPagoDerechosFormulario: jest.fn()
  } as any;

  component.guardarDatosFormulario();

  setTimeout(() => {
    expect(component['solocitud220401Service'].actualizarEstadoFormulario).toHaveBeenCalledWith(registroMock);
    expect(component['solocitud220401Service'].actualizarPagoDerechosFormulario).toHaveBeenCalledWith(permisoMock);
    expect(component.esDatosRespuesta).toBe(true);
    done();
  }, 0);
});
});