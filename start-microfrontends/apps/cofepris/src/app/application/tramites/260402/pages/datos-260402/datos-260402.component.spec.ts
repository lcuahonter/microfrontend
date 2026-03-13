import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Datos260402Component } from './datos-260402.component';
import { Solocitud260402Service } from '../../services/service260402.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Datos260402Component', () => {
  let component: Datos260402Component;
  let fixture: ComponentFixture<Datos260402Component>;
  let mockConsultaQuery: any;
  let mockSolocitud260402Service: any;

  beforeEach(async () => {
    mockConsultaQuery = {
      selectConsultaioState$: of({ update: false })
    };

    mockSolocitud260402Service = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({})),
      getPagoDerechos: jest.fn().mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn(),
      actualizarPagoDerechosFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [Datos260402Component],
      providers: [
        { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
        { provide: Solocitud260402Service, useValue: mockSolocitud260402Service }
      ],
      imports: [SolicitanteComponent, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideComponent(Datos260402Component, {
        set: {
          providers: [
            { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
            { provide: Solocitud260402Service, useValue: mockSolocitud260402Service }
          ]
        }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Datos260402Component);
    component = fixture.componentInstance;
    // Patch the injected services
    (component as any).consultaQuery = mockConsultaQuery;
    (component as any).solocitud220401Service = mockSolocitud260402Service;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el índice en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería establecer esDatosRespuesta en true si update es false', () => {
    component.esDatosRespuesta = false;
    component.consultaState = { update: false } as any;
    // Simula la suscripción de ngOnInit
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería llamar a guardarDatosFormulario si update es true', () => {
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario').mockImplementation();
    mockConsultaQuery.selectConsultaioState$ = of({ update: true });
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
    guardarSpy.mockRestore();
  });

  it('debería cambiar el índice cuando se llama a seleccionaTab', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('guardarDatosFormulario debería llamar a los métodos del servicio y actualizar esDatosRespuesta', () => {
    const registro = { foo: 'bar' };
    const permiso = { bar: 'baz' };
    mockSolocitud260402Service.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(registro));
    mockSolocitud260402Service.getPagoDerechos.mockReturnValue(of(permiso));
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(mockSolocitud260402Service.actualizarEstadoFormulario).toHaveBeenCalledWith(registro);
    expect(mockSolocitud260402Service.actualizarPagoDerechosFormulario).toHaveBeenCalledWith(permiso);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('guardarDatosFormulario no debería llamar a actualizarEstadoFormulario si registro es nulo', () => {
    mockSolocitud260402Service.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of(null));
    mockSolocitud260402Service.getPagoDerechos.mockReturnValue(of({}));
    component.guardarDatosFormulario();
    expect(mockSolocitud260402Service.actualizarEstadoFormulario).not.toHaveBeenCalled();
    expect(mockSolocitud260402Service.actualizarPagoDerechosFormulario).toHaveBeenCalled();
  });

  it('guardarDatosFormulario no debería llamar a actualizarPagoDerechosFormulario si permiso es nulo', () => {
    mockSolocitud260402Service.getRegistroTomaMuestrasMercanciasData.mockReturnValue(of({}));
    mockSolocitud260402Service.getPagoDerechos.mockReturnValue(of(null));
    component.guardarDatosFormulario();
    expect(mockSolocitud260402Service.actualizarEstadoFormulario).toHaveBeenCalled();
    expect(mockSolocitud260402Service.actualizarPagoDerechosFormulario).not.toHaveBeenCalled();
  });
});