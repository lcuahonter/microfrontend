import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoPropietarioComponent } from './tipo-propietario.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite630307Store } from '../../estados/tramite630307.store';
import { Tramite630307Query } from '../../estados/tramite630307.query';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { FORMULARIO_DATOS_PROPIETARIO_NOMBRE } from '../../enum/retorno-importacion-temporal.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
@Injectable()
class MockSolicitanteService {}

describe('TipoPropietarioComponent', () => {
  let componente: TipoPropietarioComponent;
  let fixture: ComponentFixture<TipoPropietarioComponent>;
  let storeMock: Partial<Tramite630307Store>;
  let queryMock: Partial<Tramite630307Query>;
  let servicioMock: Partial<RetornoImportacionTemporalService>;

  class MockConsultaioQuery {
    selectConsultaioState$ = of({ readonly: false });
  }

  beforeEach(async () => {
    storeMock = {
      setTramite630307State: jest.fn(),
    };

    queryMock = {
      selectTramite630307State$: of({
        propietario: '1',
        tipoDePropietario: '2',
      }),
    };

    servicioMock = {
      getPropietario: jest
        .fn()
        .mockReturnValue(of([{ id: '1', descripcion: 'Persona' }])),
      getTipoDePropietario: jest
        .fn()
        .mockReturnValue(of([{ id: '1', descripcion: 'Física' }])),
      getPais: jest
        .fn()
        .mockReturnValue(of([{ id: 'MX', descripcion: 'México' }])),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TipoPropietarioComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Tramite630307Store, useValue: storeMock },
        { provide: Tramite630307Query, useValue: queryMock },
        { provide: RetornoImportacionTemporalService, useValue: servicioMock },
        { provide: MockSolicitanteService, useClass: MockSolicitanteService },
        { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoPropietarioComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario con datos del estado', () => {
    expect(componente.tipoPropietarioFormulario.value).toEqual({
      propietario: '1',
      tipoDePropietario: '2',
    });
  });

  it('debería crear el formulario con propietario deshabilitado', () => {
    componente.tipoPropietarioFormulario = componente['fb'].group({
      propietario: [{ value: '1', disabled: true }, Validators.required],
      tipoDePropietario: ['2', Validators.required],
    });
    expect(componente.tipoPropietarioFormulario.get('propietario')?.disabled).toBe(true);
  });

  it('debería crear el formulario con propietario habilitado', () => {
    componente.tipoPropietarioFormulario = componente['fb'].group({
      propietario: [{ value: '1', disabled: false }, Validators.required],
      tipoDePropietario: ['2', Validators.required],
    });
    expect(componente.tipoPropietarioFormulario.get('propietario')?.enabled).toBe(true);
  });

  it('debería llamar a getPropietario y llenar propietarioOpciones', () => {
    expect(componente.propietarioOpciones.length).toBeGreaterThan(0);
  });

  it('debería llamar a getTipoDePropietario y llenar tipoDePropietarioOpciones', () => {
    expect(componente.tipoDePropietarioOpciones.length).toBeGreaterThan(0);
  });

  it('debería actualizar la visibilidad de los campos en cambiarTipoPropietario()', () => {
    componente.tipoPropietarioFormulario
      .get('tipoDePropietario')
      ?.setValue('1');
    componente.formularioDatosPropietarioNombre = JSON.parse(JSON.stringify(FORMULARIO_DATOS_PROPIETARIO_NOMBRE));
    componente.cambiarTipoPropietario();

    const nombreCampo = componente.formularioDatosPropietarioNombre.find(
      (c) => c.id === 'nombre'
    );
    expect(nombreCampo?.mostrar).toBe(true);
  });

  it('debería alternar mostrarTipoPropietario y mostrarSolicitante en cambiarPropietario()', () => {
    componente.tipoPropietarioFormulario.get('propietario')?.setValue('2');
    componente.cambiarPropietario();
    expect(componente.mostrarSolicitante).toBe(false);
    expect(componente.mostrarTipoPropietario).toBe(true);
    componente.tipoPropietarioFormulario.get('propietario')?.setValue('1');
    componente.cambiarPropietario();
    expect(componente.mostrarSolicitante).toBe(true);
    expect(componente.mostrarTipoPropietario).toBe(false);
  });

  it('debería establecer un valor en el store con establecerCambioDeValor (primitivo)', () => {
    componente.establecerCambioDeValor({ campo: 'campoPropietario', valor: 'valorPropietario' });
    expect(storeMock.setTramite630307State).toHaveBeenCalledWith(
      'campoPropietario',
      'valorPropietario'
    );
  });

  it('debería establecer un valor en el store con establecerCambioDeValor (objeto con id)', () => {
    componente.establecerCambioDeValor({
      campo: 'campoTipoDePropietario',
      valor: { id: 5 },
    });
    expect(storeMock.setTramite630307State).toHaveBeenCalledWith(
      'campoTipoDePropietario',
      '5'
    );
  });

  it('debería completar destroyed$ al destruir el componente', () => {
    const completeSpy = jest.spyOn(componente['destroyed$'], 'complete');
    componente.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería deshabilitar el formulario si esFormularioSoloLectura es true', () => {
    componente.tipoPropietarioFormulario = componente['fb'].group({
      propietario: [{ value: '1', disabled: false }, Validators.required],
      tipoDePropietario: ['2', Validators.required],
    });
    componente.esFormularioSoloLectura = true;
    componente.guardarDatosFormulario();
    expect(componente.tipoPropietarioFormulario.disabled).toBe(true);
  });

  it('debería habilitar el formulario si esFormularioSoloLectura es false', () => {
    componente.tipoPropietarioFormulario = componente['fb'].group({
      propietario: [{ value: '1', disabled: true }, Validators.required],
      tipoDePropietario: ['2', Validators.required],
    });
    componente.esFormularioSoloLectura = false;
    componente.guardarDatosFormulario();
    expect(componente.tipoPropietarioFormulario.enabled).toBe(true);
  });

  it('debería llamar a guardarDatosFormulario si esFormularioSoloLectura es true', () => {
    const guardarSpy = jest.spyOn(componente, 'guardarDatosFormulario');
    componente.esFormularioSoloLectura = true;
    componente.inicializarEstadoFormulario();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('debería llamar a inicializarDatosIniciales si esFormularioSoloLectura es false', () => {
    const initSpy = jest.spyOn(componente, 'inicializarDatosIniciales');
    componente.esFormularioSoloLectura = false;
    componente.inicializarEstadoFormulario();
    expect(initSpy).toHaveBeenCalled();
  });
  it('debería llamar a los métodos de inicialización en inicializarDatosIniciales', () => {
    const initFormSpy = jest.spyOn(componente, 'inicializarFormulario');
    const getPropSpy = jest.spyOn(componente, 'getPropietario');
    const getTipoSpy = jest.spyOn(componente, 'getTipoDePropietario');
    const getPaisSpy = jest.spyOn(componente, 'getPais');
    componente.inicializarDatosIniciales();
    expect(initFormSpy).toHaveBeenCalled();
    expect(getPropSpy).toHaveBeenCalled();
    expect(getTipoSpy).toHaveBeenCalled();
    expect(getPaisSpy).toHaveBeenCalled();
  });
});
