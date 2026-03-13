import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Datos90305Component } from './datos-90305.component';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';
import { ConsultaioQuery, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

describe('Datos90305Component', () => {
  let component: Datos90305Component;
  let fixture: ComponentFixture<Datos90305Component>;

  const MOCK_CONSULTA_STATE_UPDATE = {
    procedureId: '123',
    parameter: 'abc',
    department: 'COMERCIO',
    folioTramite: 'FT-001',
    tipoDeTramite: 'Modificación',
    estadoDeTramite: 'Pendiente',
    readonly: false,
    create: false,
    update: true,
    consultaioSolicitante: null,
  };

  const MOCK_CONSULTA_STATE_NO_UPDATE = {
    ...MOCK_CONSULTA_STATE_UPDATE,
    update: false,
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of(MOCK_CONSULTA_STATE_UPDATE),
  };

  const mockProsecService = {
    getRegistroTomaMuestrasMercanciasData: jest.fn(() => of({ foo: 'bar' })),
    actualizarEstadoFormulario: jest.fn(),
  };

  @Component({
    selector: 'app-solicitante',
    template: '',
  })
  class MockSolicitanteComponent {
    obtenerTipoPersona = jest.fn();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Datos90305Component, MockSolicitanteComponent],
      providers: [
        { provide: ProsecModificacionServiceTsService, useValue: mockProsecService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Datos90305Component);
    component = fixture.componentInstance;

    // Manually assign mocked child
    component.solicitante = new MockSolicitanteComponent() as any;

    jest.spyOn(component, 'guardarDatosFormulario');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call guardarDatosFormulario if consultaState.update is true', () => {
    fixture.detectChanges(); // triggers ngOnInit
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should set esDatosRespuesta to true if consultaState.update is false', async () => {
    const mockConsultaioQueryFalse = {
      selectConsultaioState$: of(MOCK_CONSULTA_STATE_NO_UPDATE),
    };

    await TestBed.resetTestingModule()
      .configureTestingModule({
        declarations: [Datos90305Component, MockSolicitanteComponent],
        providers: [
          { provide: ProsecModificacionServiceTsService, useValue: mockProsecService },
          { provide: ConsultaioQuery, useValue: mockConsultaioQueryFalse },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents();

    fixture = TestBed.createComponent(Datos90305Component);
    component = fixture.componentInstance;
    component.solicitante = new MockSolicitanteComponent() as any;

    jest.spyOn(component, 'guardarDatosFormulario');

    fixture.detectChanges();

    expect(component.esDatosRespuesta).toBe(true);
    expect(component.guardarDatosFormulario).not.toHaveBeenCalled();
  });

it('should call obtenerTipoPersona on solicitante after view init', () => {
  // manually mock the @ViewChild
  component.solicitante = { obtenerTipoPersona: jest.fn() } as any;

  component.ngAfterViewInit();

  expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
});

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call actualizarEstadoFormulario when guardarDatosFormulario is called', () => {
    fixture.detectChanges(); // triggers guardarDatosFormulario
    expect(mockProsecService.actualizarEstadoFormulario).toHaveBeenCalledWith({ foo: 'bar' });
    expect(component.esDatosRespuesta).toBe(true);
  });
});
