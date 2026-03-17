import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Datos260916Component } from './datos-260916.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// Mock para TIPO_PERSONA
const TIPO_PERSONA = { MORAL_NACIONAL: 'MORAL_NACIONAL' };

describe('PasoUnoComponent', () => {
  let component: Datos260916Component;
  let fixture: ComponentFixture<Datos260916Component>;
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
      declarations: [Datos260916Component],
      imports: [ require('@angular/common/http/testing').HttpClientTestingModule],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: Datos260916Component, useValue: servicioMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Datos260916Component);
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

});
