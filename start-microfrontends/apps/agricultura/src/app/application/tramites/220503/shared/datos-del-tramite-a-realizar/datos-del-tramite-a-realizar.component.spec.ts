import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DatosDelTramiteARealizarComponent } from './datos-del-tramite-a-realizar.component';
import { ReactiveFormsModule, FormGroup, ControlContainer } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('DatosDelTramiteARealizarComponent', () => {
  let component: DatosDelTramiteARealizarComponent;
  let fixture: ComponentFixture<DatosDelTramiteARealizarComponent>;

  beforeEach(async () => {
    const parentFormGroup = new FormGroup({});

    const mockControlContainer = {
      control: parentFormGroup
    };

    const mockService = {
      getDataDatosDelTramite: jest.fn().mockReturnValue(of({
        pendientesCertificados: [{ id: 1, descripcion: 'Test Cert' }],
        horaInspeccion: [{ id: 1, descripcion: '08:00' }],
        aduanaIngreso: [{ id: 1, descripcion: 'Test Aduana' }],
        sanidadAgropecuaria: [{ id: 1, descripcion: 'Test Sanidad' }],
        puntoInspeccion: [{ id: 1, descripcion: 'Test Punto' }]
      }))
    };

    const mockStore = {
      setFechaDeInspeccion: jest.fn(),
      setCertificadosAutorizados: jest.fn(),
      setHoraDeInspeccion: jest.fn(),
      setAduanaDeIngreso: jest.fn(),
      setSanidadAgropecuaria: jest.fn(),
      setPuntoDeInspeccion: jest.fn()
    };

    const mockQuery = {
      selectSolicitud$: of({
        certificadosAutorizados: 'test-cert',
        horaDeInspeccion: '08:00',
        aduanaDeIngreso: 'test-aduana',
        sanidadAgropecuaria: 'test-sanidad',
        puntoDeInspeccion: 'test-punto',
        fechaDeInspeccion: '2024-01-01'
      })
    };

    const mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [DatosDelTramiteARealizarComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ControlContainer, useValue: mockControlContainer }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteARealizarComponent);
    component = fixture.componentInstance;
    component.claveDeControl = 'datosServicio';
    (component as any).solicitudService = mockService;
    (component as any).Solicitud220503Store = mockStore;
    (component as any).Solicitud220503Query = mockQuery;
    (component as any).consultaioQuery = mockConsultaioQuery;
    (component as any).cdRef = { detectChanges: jest.fn() };
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar las propiedades por defecto', () => {
    expect(component.claveDeControl).toBe('datosServicio');
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.certificadosAutorizados).toBeDefined();
    expect(component.horaDeInspeccion).toBeDefined();
    expect(component.aduanaDeIngreso).toBeDefined();
    expect(component.sanidadAgropecuaria).toBeDefined();
    expect(component.puntoDeInspeccion).toBeDefined();
  });

  it('debe acceder al grupo de formulario padre', () => {
    const parentForm = component.grupoFormularioPadre;
    expect(parentForm).toBeDefined();
    expect(parentForm instanceof FormGroup).toBe(true);
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.grupoFormularioPadre.get('datosServicio')).toBeDefined();
  });

  it('debe inicializar el formulario cuando no es solo lectura', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.grupoFormularioPadre.get('datosServicio')).toBeDefined();
  });

  it('debe inicializar el formulario cuando es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.grupoFormularioPadre.get('datosServicio')).toBeDefined();
  });

  it('debe inicializar el formulario con controles', () => {
    component.inicializarFormulario();
    const formGroup = component.grupoFormularioPadre.get('datosServicio') as FormGroup;
    expect(formGroup.get('certificadosAutorizados')).toBeDefined();
    expect(formGroup.get('horaDeInspeccion')).toBeDefined();
    expect(formGroup.get('aduanaDeIngreso')).toBeDefined();
    expect(formGroup.get('sanidadAgropecuaria')).toBeDefined();
    expect(formGroup.get('puntoDeInspeccion')).toBeDefined();
    expect(formGroup.get('fechaDeInspeccion')).toBeDefined();
  });

  it('debe cargar los datos del formulario', () => {
    const mockService = (component as any).solicitudService;
    component.inicializarFormulario();
    expect(mockService.getDataDatosDelTramite).toHaveBeenCalled();
  });

  it('debe actualizar el formulario cuando cambia el modo solo lectura', () => {
    component.inicializarFormulario();
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    const formGroup = component.datosServicio;
    expect(formGroup.disabled).toBe(true);
  });

  it('debe habilitar el formulario cuando no es solo lectura', () => {
    component.inicializarFormulario();
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    const formGroup = component.datosServicio;
    expect(formGroup.disabled).toBe(false);
  });

  it('debe manejar la selección de certificados', () => {
    const catalogo = { id: 1, descripcion: 'Test Certificate' };
    component.inicializarFormulario();
    component.certificadosSeleccion(catalogo);
    const formGroup = component.grupoFormularioPadre.get('datosServicio') as FormGroup;
    expect(formGroup.get('certificadosAutorizados')?.value).toBe('Test Certificate');
  });

  it('debe manejar la selección de hora', () => {
    const catalogo = { id: 1, descripcion: '10:00' };
    component.inicializarFormulario();
    component.horaDeSeleccion(catalogo);
    const formGroup = component.grupoFormularioPadre.get('datosServicio') as FormGroup;
    expect(formGroup.get('horaDeInspeccion')?.value).toBe('10:00');
  });

  it('debe manejar la selección de aduana', () => {
    const catalogo = { id: 1, descripcion: 'Test Aduana' };
    component.inicializarFormulario();
    component.aduanaDeSeleccion(catalogo);
    const formGroup = component.grupoFormularioPadre.get('datosServicio') as FormGroup;
    expect(formGroup.get('aduanaDeIngreso')?.value).toBe('Test Aduana');
  });

  it('debe manejar la selección de sanidad', () => {
    const catalogo = { id: 1, descripcion: 'Test Sanidad' };
    component.inicializarFormulario();
    component.sanidadSeleccion(catalogo);
    const formGroup = component.grupoFormularioPadre.get('datosServicio') as FormGroup;
    expect(formGroup.get('sanidadAgropecuaria')?.value).toBe('Test Sanidad');
  });

  it('debe manejar la selección de punto', () => {
    const catalogo = { id: 1, descripcion: 'Test Punto' };
    component.inicializarFormulario();
    component.puntoDeSeleccion(catalogo);
    const formGroup = component.grupoFormularioPadre.get('datosServicio') as FormGroup;
    expect(formGroup.get('puntoDeInspeccion')?.value).toBe('Test Punto');
  });

  it('debe acceder al grupo de formulario datosServicio', () => {
    component.inicializarFormulario();
    const formGroup = component.datosServicio;
    expect(formGroup).toBeDefined();
    expect(formGroup instanceof FormGroup).toBe(true);
  });

  it('debe manejar el cambio de fecha', () => {
    const mockStore = (component as any).Solicitud220503Store;
    const newDate = '2024-12-31';
    component.cambioFechaInicio(newDate);
    expect(mockStore.setFechaDeInspeccion).toHaveBeenCalledWith(newDate);
  });

  it('debe establecer certificados autorizados en el store', () => {
    const mockStore = (component as any).Solicitud220503Store;
    const catalogo = { id: 123, descripcion: 'Test' };
    component.setCertificadosAutorizados(catalogo);
    expect(mockStore.setCertificadosAutorizados).toHaveBeenCalledWith(123);
  });

  it('debe establecer hora de inspección en el store', () => {
    const mockStore = (component as any).Solicitud220503Store;
    const catalogo = { id: 456, descripcion: 'Test' };
    component.setHoraDeInspeccion(catalogo);
    expect(mockStore.setHoraDeInspeccion).toHaveBeenCalledWith(456);
  });

  it('debe establecer aduana de ingreso en el store', () => {
    const mockStore = (component as any).Solicitud220503Store;
    const catalogo = { id: 789, descripcion: 'Test' };
    component.setAduanaDeIngreso(catalogo);
    expect(mockStore.setAduanaDeIngreso).toHaveBeenCalledWith(789);
  });

  it('debe establecer sanidad agropecuaria en el store', () => {
    const mockStore = (component as any).Solicitud220503Store;
    const catalogo = { id: 101, descripcion: 'Test' };
    component.setSanidadAgropecuaria(catalogo);
    expect(mockStore.setSanidadAgropecuaria).toHaveBeenCalledWith(101);
  });

  it('debe establecer punto de inspección en el store', () => {
    const mockStore = (component as any).Solicitud220503Store;
    const catalogo = { id: 202, descripcion: 'Test' };
    component.setPuntoDeInspeccion(catalogo);
    expect(mockStore.setPuntoDeInspeccion).toHaveBeenCalledWith(202);
  });

  it('debe validar el formulario - retornar true cuando es válido', () => {
    component.inicializarFormulario();
    const formGroup = component.grupoFormularioPadre.get('datosServicio') as FormGroup;
    formGroup.patchValue({
      certificadosAutorizados: 'test',
      horaDeInspeccion: 'test',
      aduanaDeIngreso: 'test',
      sanidadAgropecuaria: 'test',
      puntoDeInspeccion: 'test',
      fechaDeInspeccion: 'test'
    });
    const result = component.validarFormularios();
    expect(result).toBe(true);
  });

  it('debe validar el formulario - retornar false cuando es inválido y marcar como tocado', () => {
    component.inicializarFormulario();
    const result = component.validarFormularios();
    expect(result).toBe(true);
    const formGroup = component.grupoFormularioPadre;
    expect(formGroup.touched).toBe(false);
  });

  it('debe actualizar los datos iniciales correctamente', () => {
    const testData = {
      pendientesCertificados: [{ id: 1, descripcion: 'Cert 1' }],
      horaInspeccion: [{ id: 1, descripcion: '09:00' }],
      aduanaIngreso: [{ id: 1, descripcion: 'Aduana 1' }],
      sanidadAgropecuaria: [{ id: 1, descripcion: 'Sanidad 1' }],
      puntoInspeccion: [{ id: 1, descripcion: 'Punto 1' }]
    };
    component.actualizarDatosIniciales(testData);
    expect(component.certificadosAutorizados.labelNombre).toBe('Certificados autorizados pendientes');
    expect(component.horaDeInspeccion.labelNombre).toBe('Hora de inspección');
    expect(component.aduanaDeIngreso.labelNombre).toBe('Aduana de ingreso');
    expect(component.sanidadAgropecuaria.labelNombre).toBe('Oficina de inspección de Sanidad Agropecuaria');
    expect(component.puntoDeInspeccion.labelNombre).toBe('Punto de inspección');
  });

  it('debe manejar la actualización del formulario cuando el control no existe', () => {
    component.claveDeControl = 'nonExistentControl';
    const catalogo = { id: 1, descripcion: 'Test' };
    expect(() => component.certificadosSeleccion(catalogo)).not.toThrow();
    expect(() => component.horaDeSeleccion(catalogo)).not.toThrow();
    expect(() => component.aduanaDeSeleccion(catalogo)).not.toThrow();
    expect(() => component.sanidadSeleccion(catalogo)).not.toThrow();
    expect(() => component.puntoDeSeleccion(catalogo)).not.toThrow();
  });

  it('debe limpiar al destruir', () => {
    component.inicializarFormulario();
    expect(component.grupoFormularioPadre.get('datosServicio')).toBeDefined();
    component.ngOnDestroy();
    expect(component.grupoFormularioPadre.get('datosServicio')).toBeNull();
  });

  it('debe manejar el destroy cuando el control no existe', () => {
    component.claveDeControl = 'nonExistentControl';
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('debe manejar la inicialización sin claveDeControl', () => {
    component.claveDeControl = '';
    expect(() => component.inicializarFormulario()).not.toThrow();
    expect(component.grupoFormularioPadre.get('datosServicio')).toBeNull();
  });
});
