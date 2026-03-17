import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoPropietarioComponent } from './tipo-propietario.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite630103Store } from '../../estados/tramite630103.store';
import { Tramite630103Query } from '../../estados/tramite630103.query';
import { AutorizacionImportacionTemporalService } from '../../services/autorizacion-importacion-temporal.service';
import { FORMULARIO_DATOS_PROPIETARIO_NOMBRE } from '../../enum/autorizacion-importacion-temporal.enum';

describe('TipoPropietarioComponent', () => {
  let componente: TipoPropietarioComponent;
  let fixture: ComponentFixture<TipoPropietarioComponent>;
  let storeMock: any;
  let queryMock: any;
  let servicioMock: any;

  beforeEach(async () => {
    storeMock = {
      setTramite630103State: jest.fn(),
    };

    queryMock = {
      selectTramite630103State$: of({
        propietario: '1',
        tipoDePropietario: '2',
      }),
    };

    servicioMock = {
      getPropietario: jest.fn().mockReturnValue(of([{ id: '1', descripcion: 'Persona' }])),
      getTipoDePropietario: jest.fn().mockReturnValue(of([{ id: '1', descripcion: 'Física' }])),
      getPais: jest.fn().mockReturnValue(of([{ id: 'MX', descripcion: 'México' }])),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TipoPropietarioComponent],
      providers: [
        FormBuilder,
        { provide: Tramite630103Store, useValue: storeMock },
        { provide: Tramite630103Query, useValue: queryMock },
        { provide: AutorizacionImportacionTemporalService, useValue: servicioMock },
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

  it('debería llamar a getPropietario y llenar propietarioOpciones', () => {
    expect(componente.propietarioOpciones.length).toBeGreaterThan(0);
  });

  it('debería llamar a getTipoDePropietario y llenar tipoDePropietarioOpciones', () => {
    expect(componente.tipoDePropietarioOpciones.length).toBeGreaterThan(0);
  });

  it('debería actualizar la visibilidad de los campos en cambiarTipoPropietario()', () => {
    componente.tipoPropietarioFormulario.get('tipoDePropietario')?.setValue('1');
    componente.formularioDatosPropietarioNombre = JSON.parse(JSON.stringify(FORMULARIO_DATOS_PROPIETARIO_NOMBRE));
    componente.cambiarTipoPropietario();

    const nombreCampo = componente.formularioDatosPropietarioNombre.find(c => c.id === 'nombre');
    expect(nombreCampo?.mostrar).toBe(true);
  });

  it('debería alternar mostrarTipoPropietario y mostrarSolicitante en cambiarPropietario()', () => {
    componente.tipoPropietarioFormulario.get('propietario')?.setValue('2');
    componente.cambiarPropietario();
    expect(componente.mostrarTipoPropietario).toBe(true);
    expect(componente.mostrarSolicitante).toBe(false);
  });

  it('debería establecer un valor en el store con establecerCambioDeValor (primitivo)', () => {
    componente.establecerCambioDeValor({ campo: 'propietario', valor: '1' });
    expect(storeMock.setTramite630103State).toHaveBeenCalledWith('propietario', '1');
  });

  it('debería establecer un valor en el store con establecerCambioDeValor (objeto con id)', () => {
    componente.establecerCambioDeValor({ campo: 'tipoDePropietario', valor: { id: 5 } });
    expect(storeMock.setTramite630103State).toHaveBeenCalledWith('tipoDePropietario', '5');
  });

  it('debería completar destroyed$ al destruir el componente', () => {
    const completeSpy = jest.spyOn(componente['destroyed$'], 'complete');
    componente.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería deshabilitar el formulario si esFormularioSoloLectura es true', () => {
    componente.esFormularioSoloLectura = true;
    componente.inicializarFormulario();
    const disableSpy = jest.spyOn(componente.tipoPropietarioFormulario, 'disable');
    componente.guardarDatosFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('debería habilitar el formulario si esFormularioSoloLectura es false', () => {
    componente.esFormularioSoloLectura = false;
    componente.inicializarFormulario();
    const enableSpy = jest.spyOn(componente.tipoPropietarioFormulario, 'enable');
    componente.guardarDatosFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('debería actualizar los campos como desactivados si esFormularioSoloLectura es true', () => {
    componente.formularioDatosPropietarioNombre = [
      { id: 'campo1', desactivado: false } as any,
      { id: 'campo2', desactivado: false } as any,
    ];
    componente.formularioDatosPropietarioDireccion = [
      { id: 'campo3', desactivado: false } as any,
      { id: 'campo4', desactivado: false } as any,
    ];
    componente.esFormularioSoloLectura = true;
    if (typeof componente.inicializarFormulario === 'function') {
      componente.inicializarFormulario();
      expect(componente.formularioDatosPropietarioNombre.every(c => c.desactivado)).toBe(true);
      expect(componente.formularioDatosPropietarioDireccion.every(c => c.desactivado)).toBe(true);
    }
  });

  it('debería actualizar los campos como activados si esFormularioSoloLectura es false', () => {
    componente.formularioDatosPropietarioNombre = [
      { id: 'campo1', desactivado: true } as any,
      { id: 'campo2', desactivado: true } as any,
    ];
    componente.formularioDatosPropietarioDireccion = [
      { id: 'campo3', desactivado: true } as any,
      { id: 'campo4', desactivado: true } as any,
    ];
    componente.esFormularioSoloLectura = false;
    if (typeof componente.inicializarFormulario === 'function') {
      componente.inicializarFormulario();
      expect(componente.formularioDatosPropietarioNombre.every(c => !c.desactivado)).toBe(true);
      expect(componente.formularioDatosPropietarioDireccion.every(c => !c.desactivado)).toBe(true);
    }
  });

  it('debería asignar opciones de país al campo correspondiente en getPais()', () => {
    componente.formularioDatosPropietarioDireccion = [
      { id: 'pais', opciones: [] } as any,
      { id: 'otro', opciones: [] } as any,
    ];
    componente.getPais();
    expect(componente.formularioDatosPropietarioDireccion.find(c => c.id === 'pais')?.opciones?.length).toBeGreaterThan(0);
  });
});