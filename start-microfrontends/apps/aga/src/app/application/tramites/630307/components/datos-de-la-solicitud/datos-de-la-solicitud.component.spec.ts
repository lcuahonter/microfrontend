import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { Tramite630307Store } from '../../estados/tramite630307.store';
import { Tramite630307Query } from '../../estados/tramite630307.query';
import { of } from 'rxjs';

describe('DatosDeLaSolicitudComponent', () => {
  let componente: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let servicioMock: jest.Mocked<RetornoImportacionTemporalService>;
  let storeMock: jest.Mocked<Tramite630307Store>;
  let queryMock: jest.Mocked<Tramite630307Query>;

  const DATOS_ADUANA_MOCK = [{ id: 1, descripcion: 'Aduana 1' }];
  const DATOS_SECCION_ADUANERA_MOCK = [{ id: 2, descripcion: 'Sección 1' }];
  const DATOS_PRORROGA_MOCK = [{ id: 3, descripcion: 'Prórroga 1' }];
  const ESTADO_INICIAL_MOCK = { cuentaProrroga: '1' };

  beforeEach(async () => {
    servicioMock = {
      getAduanaDeIngreso: jest.fn(),
      getSeccionAduanera: jest.fn(),
      getProrroga: jest.fn(),
    } as unknown as jest.Mocked<RetornoImportacionTemporalService>;

    storeMock = {
      setTramite630307State: jest.fn(),
    } as unknown as jest.Mocked<Tramite630307Store>;

    queryMock = {
      selectTramite630307State$: of(ESTADO_INICIAL_MOCK),
    } as unknown as jest.Mocked<Tramite630307Query>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDeLaSolicitudComponent],
      providers: [
        FormBuilder,
        { provide: RetornoImportacionTemporalService, useValue: servicioMock },
        { provide: Tramite630307Store, useValue: storeMock },
        { provide: Tramite630307Query, useValue: queryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    componente = fixture.componentInstance;

    servicioMock.getAduanaDeIngreso.mockReturnValue(of(DATOS_ADUANA_MOCK));
    servicioMock.getSeccionAduanera.mockReturnValue(
      of(DATOS_SECCION_ADUANERA_MOCK)
    );
    servicioMock.getProrroga.mockReturnValue(of(DATOS_PRORROGA_MOCK));

    componente.formularioDatosSolicitud = [
      {
        id: 'cveAduana', campo: 'cveAduana',
        opciones: [],
        labelNombre: '',
        clase: '',
        tipoInput: '',
        desactivado: false
      },
      {
        id: 'cveSeccionAduanera', campo: 'cveSeccionAduanera',
        opciones: [],
        labelNombre: '',
        clase: '',
        tipoInput: '',
        desactivado: false
      },
      {
        id: 'cuentaProrroga', campo: 'cuentaProrroga',
        opciones: [],
        labelNombre: '',
        clase: '',
        tipoInput: '',
        desactivado: false
      },
    ];

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario y obtener datos en ngOnInit', () => {
    const obtenerValorStoreSpy = jest.spyOn(componente, 'getValorStore');
    const inicializarFormularioSpy = jest.spyOn(
      componente,
      'inizializarFormulario'
    );
    const obtenerAduanaDeIngresoSpy = jest.spyOn(
      componente,
      'getAduanaDeIngreso'
    );
    const obtenerSeccionAduaneraSpy = jest.spyOn(
      componente,
      'getSeccionAduanera'
    );
    const obtenerProrrogaSpy = jest.spyOn(componente, 'getProrroga');
    const cambiarCuentaProrrogaSpy = jest.spyOn(
      componente,
      'cambiarCuentaProrroga'
    );

    componente.ngOnInit();

    expect(obtenerValorStoreSpy).toHaveBeenCalled();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
    expect(obtenerAduanaDeIngresoSpy).toHaveBeenCalled();
    expect(obtenerSeccionAduaneraSpy).toHaveBeenCalled();
    expect(obtenerProrrogaSpy).toHaveBeenCalled();
    expect(cambiarCuentaProrrogaSpy).toHaveBeenCalled();
  });

  it('debería inicializar el formulario con valores predeterminados', () => {
    componente.inizializarFormulario();
    expect(componente.datosImportacionTemporalFormulario).toBeTruthy();
  });

  it('debería obtener las opciones de Aduana de Ingreso', () => {
    servicioMock.getAduanaDeIngreso.mockReturnValue(of(DATOS_ADUANA_MOCK));

    componente.getAduanaDeIngreso();

    expect(servicioMock.getAduanaDeIngreso).toHaveBeenCalled();
    const aduanaIngreso = componente.formularioDatosSolicitud.find(
      (item) => item.id === 'cveAduana'
    );
    expect(aduanaIngreso?.opciones).toEqual(DATOS_ADUANA_MOCK);
  });

  it('debería obtener las opciones de Sección Aduanera', () => {
    servicioMock.getSeccionAduanera.mockReturnValue(
      of(DATOS_SECCION_ADUANERA_MOCK)
    );

    componente.getSeccionAduanera();

    expect(servicioMock.getSeccionAduanera).toHaveBeenCalled();
    const seccionAduanera = componente.formularioDatosSolicitud.find(
      (item) => item.id === 'cveSeccionAduanera'
    );
    expect(seccionAduanera?.opciones).toEqual(DATOS_SECCION_ADUANERA_MOCK);
  });

  it('debería obtener las opciones de Prórroga', () => {
    servicioMock.getProrroga.mockReturnValue(of(DATOS_PRORROGA_MOCK));

    componente.getProrroga();

    expect(servicioMock.getProrroga).toHaveBeenCalled();
    const prorroga = componente.formularioDatosSolicitud.find(
      (item) => item.id === 'cuentaProrroga'
    );
    expect(prorroga?.opciones).toEqual(DATOS_PRORROGA_MOCK);
  });

  it('debería obtener el estado actual del store', () => {
    componente.getValorStore();
    expect(componente.estadoSeleccionado).toEqual(ESTADO_INICIAL_MOCK);
  });

  it('debería actualizar el store y llamar cambiarCuentaProrroga cuando establecerCambioDeValor es llamado', () => {
    const eventoMock = { campo: 'cuentaProrroga', valor: '1' };
    const cambiarCuentaProrrogaSpy = jest.spyOn(
      componente,
      'cambiarCuentaProrroga'
    );

    componente.establecerCambioDeValor(eventoMock);

    expect(storeMock.setTramite630307State).toHaveBeenCalledWith(
      'cuentaProrroga',
      '1'
    );
    expect(cambiarCuentaProrrogaSpy).toHaveBeenCalled();
  });

  it('debería alternar showDatosRetornoProrroga basado en el valor de cuentaProrroga', () => {
    componente.estadoSeleccionado = { cuentaProrroga: '1' } as any;
    componente.cambiarCuentaProrroga();
    expect(componente.showDatosRetornoProrroga).toBe(true);

    componente.estadoSeleccionado = { cuentaProrroga: '0' } as any;
    componente.cambiarCuentaProrroga();
    expect(componente.showDatosRetornoProrroga).toBe(false);
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const destroyedSpy = jest.spyOn((componente as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((componente as any).destroyed$, 'complete');

    componente.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should disable the form if esFormularioSoloLectura is true', () => {
    componente.datosImportacionTemporalFormulario = componente['fb'].group({});
    componente.esFormularioSoloLectura = true;
    componente.guardarDatosFormulario();
    expect(componente.datosImportacionTemporalFormulario.disabled).toBe(true);
  });

  it('should enable the form if esFormularioSoloLectura is false', () => {
    componente.datosImportacionTemporalFormulario = componente['fb'].group({});
    componente.esFormularioSoloLectura = false;
    componente.guardarDatosFormulario();
    expect(componente.datosImportacionTemporalFormulario.enabled).toBe(true);
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true', () => {
    const guardarSpy = jest.spyOn(componente, 'guardarDatosFormulario');
    componente.esFormularioSoloLectura = true;
    componente.inicializarEstadoFormulario();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should call inizializarFormulario if esFormularioSoloLectura is false', () => {
    const initSpy = jest.spyOn(componente, 'inizializarFormulario');
    componente.esFormularioSoloLectura = false;
    componente.inicializarEstadoFormulario();
    expect(initSpy).toHaveBeenCalled();
  });
  it('should initialize datosImportacionTemporalFormulario as a FormGroup', () => {
    componente.inizializarFormulario();
    expect(componente.datosImportacionTemporalFormulario).toBeDefined();
    expect(
      componente.datosImportacionTemporalFormulario instanceof FormGroup
    ).toBe(true);
  });
});
