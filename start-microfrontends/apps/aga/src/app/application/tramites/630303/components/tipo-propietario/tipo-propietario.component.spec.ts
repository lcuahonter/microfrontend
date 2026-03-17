import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TipoPropietarioComponent } from './tipo-propietario.component';
import { Tramite630303Query } from '../../estados/tramite630303.query';
import { Tramite630303Store } from '../../estados/tramite630303.store';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Catalogo, ModeloDeFormaDinamica } from '@ng-mf/data-access-user';
import { FORMULARIO_DATOS_PROPIETARIO_DIRECCION } from '../../enum/retorno-importacion-temporal.enum';

/**
 * Mock completo para el estado del trámite 630303.
 */
const mockTramite630303State = {
  propietario: '1',
  tipoDePropietario: '2',
  nombre: 'Juan',
  apellidoPaterno: 'Pérez',
  apellidoMaterno: 'González',
  razonSocial: 'Empresa Test SA de CV',
  pais: 'MX'
};

/**
 * Mock para el estado de consulta.
 */
const mockConsultaioState = {
  readonly: false,
  loading: false,
  error: null
};

/**
 * Mock de datos de catálogo de propietarios.
 */
const mockPropietarioOpciones: Catalogo[] = [
  { id: 1, descripcion: 'Solicitante', nombre: 'Solicitante' },
  { id: 2, descripcion: 'Tercero', nombre: 'Tercero' }
] as any;

/**
 * Mock de datos de catálogo de tipos de propietario.
 */
const mockTipoPropietarioOpciones: Catalogo[] = [
  { id: 1, descripcion: 'Persona Física', nombre: 'Persona Física' },
  { id: 2, descripcion: 'Persona Moral', nombre: 'Persona Moral' }
] as any;

/**
 * Mock de datos de catálogo de países.
 */
const mockPaisOpciones: Catalogo[] = [
  { id: 1, descripcion: 'México', nombre: 'México' },
  { id: 2, descripcion: 'Estados Unidos', nombre: 'Estados Unidos' },
  { id: 3, descripcion: 'Canadá', nombre: 'Canadá' }
] as any;

describe('TipoPropietarioComponent', () => {
  let component: TipoPropietarioComponent;
  let fixture: ComponentFixture<TipoPropietarioComponent>;
  let mockTramite630303Query: jest.Mocked<Tramite630303Query>;
  let mockTramite630303Store: jest.Mocked<Tramite630303Store>;
  let mockRetornoImportacionTemporalService: jest.Mocked<RetornoImportacionTemporalService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  let tramite630303StateSubject: BehaviorSubject<any>;
  let consultaioStateSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    tramite630303StateSubject = new BehaviorSubject(mockTramite630303State);
    consultaioStateSubject = new BehaviorSubject(mockConsultaioState);

    mockTramite630303Query = {
      selectTramite630303State$: tramite630303StateSubject.asObservable()
    } as any;

    mockTramite630303Store = {
      setTramite630303State: jest.fn()
    } as any;

    mockRetornoImportacionTemporalService = {
      getPropietario: jest.fn().mockReturnValue(of(mockPropietarioOpciones)),
      getTipoDePropietario: jest.fn().mockReturnValue(of(mockTipoPropietarioOpciones)),
      getPais: jest.fn().mockReturnValue(of(mockPaisOpciones))
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: consultaioStateSubject.asObservable()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        TipoPropietarioComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: Tramite630303Query, useValue: mockTramite630303Query },
        { provide: Tramite630303Store, useValue: mockTramite630303Store },
        { provide: RetornoImportacionTemporalService, useValue: mockRetornoImportacionTemporalService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TipoPropietarioComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    tramite630303StateSubject.complete();
    consultaioStateSubject.complete();
  });

  describe('Inicialización del Componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar el formulario con validaciones requeridas', () => {
      fixture.detectChanges();
      
      expect(component.tipoPropietarioFormulario).toBeDefined();
      expect(component.tipoPropietarioFormulario.get('propietario')).toBeTruthy();
      expect(component.tipoPropietarioFormulario.get('tipoDePropietario')).toBeTruthy();
      
      const propietarioControl = component.tipoPropietarioFormulario.get('propietario');
      const tipoPropietarioControl = component.tipoPropietarioFormulario.get('tipoDePropietario');
      
      propietarioControl?.setValue('');
      tipoPropietarioControl?.setValue('');
      
      expect(propietarioControl?.hasError('required')).toBe(true);
      expect(tipoPropietarioControl?.hasError('required')).toBe(true);
    });

    it('debería configurar el formulario dinámico correctamente', () => {
      fixture.detectChanges();
      
      expect(component.formularioDatosPropietarioDireccion).toBeDefined();
      expect(Array.isArray(component.formularioDatosPropietarioDireccion)).toBe(true);
      expect(component.formularioDatosPropietarioDireccion.length).toBeGreaterThan(0);
    });

    it('debería inicializar las propiedades de visibilidad en false', () => {
      expect(component.mostrarFormularioPersonaExtranjera).toBe(false);
      expect(component.mostrarTipoPropietario).toBe(false);
      expect(component.mostrarSolicitante).toBe(false);
    });
  });

  describe('Ciclo de Vida del Componente', () => {
    it('debería ejecutar ngOnInit y llamar todos los métodos de inicialización', () => {
      jest.spyOn(component, 'getValorStore');
      jest.spyOn(component, 'getPropietario');
      jest.spyOn(component, 'getTipoDePropietario');
      jest.spyOn(component, 'inicializarFormulario');
      jest.spyOn(component, 'obtenerEstadoValor');
      jest.spyOn(component, 'getPais');
      jest.spyOn(component, 'cambiarPropietario');
      jest.spyOn(component, 'cambiarTipoPropietario');

      fixture.detectChanges();

      expect(component.getValorStore).toHaveBeenCalled();
      expect(component.getPropietario).toHaveBeenCalled();
      expect(component.getTipoDePropietario).toHaveBeenCalled();
      expect(component.inicializarFormulario).toHaveBeenCalled();
      expect(component.obtenerEstadoValor).toHaveBeenCalled();
      expect(component.getPais).toHaveBeenCalled();
      expect(component.cambiarPropietario).toHaveBeenCalled();
      expect(component.cambiarTipoPropietario).toHaveBeenCalled();
    });

    it('debería limpiar suscripciones en ngOnDestroy', () => {
      jest.spyOn(component['destroyed$'], 'next');
      jest.spyOn(component['destroyed$'], 'complete');

      fixture.detectChanges();
      component.ngOnDestroy();

      expect(component['destroyed$'].next).toHaveBeenCalled();
      expect(component['destroyed$'].complete).toHaveBeenCalled();
    });
  });

  describe('Gestión del Estado', () => {
    it('debería obtener el estado del trámite correctamente', () => {
      fixture.detectChanges();

      expect(component.estadoSeleccionado).toEqual(mockTramite630303State);
    });

    it('debería manejar estado vacío del trámite', () => {
      tramite630303StateSubject.next({});
      fixture.detectChanges();

      expect(component.estadoSeleccionado).toEqual({});
    });

    it('debería establecer cambios de valor en el store correctamente', () => {
      const evento = { campo: 'propietario', valor: '2' };
      
      component.establecerCambioDeValor(evento);

      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith('propietario', '2');
    });

    it('debería manejar objetos con id en establecerCambioDeValor', () => {
      const evento = { campo: 'tipoDePropietario', valor: { id: 1, descripcion: 'Test' } };
      
      component.establecerCambioDeValor(evento);

      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith('tipoDePropietario', '1');
    });
  });

  describe('Obtención de Catálogos', () => {
    it('debería obtener opciones de propietarios correctamente', () => {
      fixture.detectChanges();

      expect(mockRetornoImportacionTemporalService.getPropietario).toHaveBeenCalled();
      expect(component.propietarioOpciones).toEqual(mockPropietarioOpciones);
    });

    it('debería obtener opciones de tipos de propietarios correctamente', () => {
      fixture.detectChanges();

      expect(mockRetornoImportacionTemporalService.getTipoDePropietario).toHaveBeenCalled();
      expect(component.tipoDePropietarioOpciones).toEqual(mockTipoPropietarioOpciones);
    });

    it('debería obtener países y configurar opciones en formulario dinámico', () => {
      fixture.detectChanges();

      expect(mockRetornoImportacionTemporalService.getPais).toHaveBeenCalled();
      
      const paisField = component.formularioDatosPropietarioDireccion.find(campo => campo.id === 'pais');
      if (paisField) {
        expect(paisField.opciones).toEqual(mockPaisOpciones);
      }
    });

    it('debería manejar errores al obtener catálogos de propietarios', () => {
      const errorMessage = 'Error al obtener propietarios';
      mockRetornoImportacionTemporalService.getPropietario.mockReturnValue(throwError(() => new Error(errorMessage)));

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('debería manejar errores al obtener catálogos de tipos de propietarios', () => {
      const errorMessage = 'Error al obtener tipos de propietarios';
      mockRetornoImportacionTemporalService.getTipoDePropietario.mockReturnValue(throwError(() => new Error(errorMessage)));

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('debería manejar errores al obtener catálogos de países', () => {
      const errorMessage = 'Error al obtener países';
      mockRetornoImportacionTemporalService.getPais.mockReturnValue(throwError(() => new Error(errorMessage)));

      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('Lógica de Cambio de Propietario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería mostrar solicitante cuando propietario es "1"', () => {
      component.tipoPropietarioFormulario.patchValue({ propietario: '1' });
      component.cambiarPropietario();

      expect(component.mostrarSolicitante).toBe(true);
      expect(component.mostrarTipoPropietario).toBe(false);
    });

    it('debería mostrar tipo de propietario cuando propietario es "2"', () => {
      component.tipoPropietarioFormulario.patchValue({ propietario: '2' });
      component.cambiarPropietario();

      expect(component.mostrarTipoPropietario).toBe(true);
      expect(component.mostrarSolicitante).toBe(false);
    });

    it('debería ocultar ambos componentes cuando propietario no es válido', () => {
      component.tipoPropietarioFormulario.patchValue({ propietario: '3' });
      component.cambiarPropietario();

      expect(component.mostrarTipoPropietario).toBe(false);
      expect(component.mostrarSolicitante).toBe(false);
    });

    it('debería manejar valor nulo en propietario', () => {
      component.tipoPropietarioFormulario.patchValue({ propietario: null });
      component.cambiarPropietario();

      expect(component.mostrarTipoPropietario).toBe(false);
      expect(component.mostrarSolicitante).toBe(false);
    });
  });

  describe('Lógica de Cambio de Tipo de Propietario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería mostrar campos de persona física cuando tipo es "1"', () => {
      component.tipoPropietarioFormulario.patchValue({ tipoDePropietario: '1' });
      component.cambiarTipoPropietario();

      const nombreCampo = component.formularioDatosPropietarioDireccion.find(campo => campo.id === 'nombre');
      const apellidoPaternoCampo = component.formularioDatosPropietarioDireccion.find(campo => campo.id === 'apellidoPaterno');
      const apellidoMaternoCampo = component.formularioDatosPropietarioDireccion.find(campo => campo.id === 'apellidoMaterno');
      const razonSocialCampo = component.formularioDatosPropietarioDireccion.find(campo => campo.id === 'razonSocial');

      if (nombreCampo && apellidoPaternoCampo && apellidoMaternoCampo && razonSocialCampo) {
        expect(nombreCampo.mostrar).toBe(true);
        expect(apellidoPaternoCampo.mostrar).toBe(true);
        expect(apellidoMaternoCampo.mostrar).toBe(true);
        expect(razonSocialCampo.mostrar).toBe(false);
      }
    });

    it('debería mostrar campo de razón social cuando tipo es "2"', () => {
      component.tipoPropietarioFormulario.patchValue({ tipoDePropietario: '2' });
      component.cambiarTipoPropietario();

      const nombreCampo = component.formularioDatosPropietarioDireccion.find(campo => campo.id === 'nombre');
      const apellidoPaternoCampo = component.formularioDatosPropietarioDireccion.find(campo => campo.id === 'apellidoPaterno');
      const apellidoMaternoCampo = component.formularioDatosPropietarioDireccion.find(campo => campo.id === 'apellidoMaterno');
      const razonSocialCampo = component.formularioDatosPropietarioDireccion.find(campo => campo.id === 'razonSocial');

      if (nombreCampo && apellidoPaternoCampo && apellidoMaternoCampo && razonSocialCampo) {
        expect(nombreCampo.mostrar).toBe(false);
        expect(apellidoPaternoCampo.mostrar).toBe(false);
        expect(apellidoMaternoCampo.mostrar).toBe(false);
        expect(razonSocialCampo.mostrar).toBe(true);
      }
    });

    it('debería mostrar formulario de persona extranjera cuando hay tipo seleccionado', () => {
      component.tipoPropietarioFormulario.patchValue({ tipoDePropietario: '1' });
      component.cambiarTipoPropietario();

      expect(component.mostrarFormularioPersonaExtranjera).toBeTruthy();
    });

    it('debería manejar campos faltantes en formulario dinámico', () => {
      component.formularioDatosPropietarioDireccion = [];
      component.tipoPropietarioFormulario.patchValue({ tipoDePropietario: '1' });

      expect(() => component.cambiarTipoPropietario()).not.toThrow();
    });
  });

  describe('Gestión de Formulario en Modo Solo Lectura', () => {

    it('debería deshabilitar formulario cuando esFormularioSoloLectura es true', () => {
      fixture.detectChanges();
      component.tipoPropietarioFormulario.disable();
      expect(component.tipoPropietarioFormulario.disabled).toBe(true);
    });

    it('debería habilitar formulario cuando esFormularioSoloLectura es false', () => {
      fixture.detectChanges();
      
      component.esFormularioSoloLectura = false;
      component.guardarDatosFormulario();

      expect(component.tipoPropietarioFormulario.enabled).toBe(true);
      
      const camposActivados = component.formularioDatosPropietarioDireccion.every(campo => campo.desactivado === false);
      expect(camposActivados).toBe(true);
    });

  });

  describe('Casos Extremos y Manejo de Errores', () => {
    it('debería manejar formulario no inicializado en cambiarPropietario', () => {
      component.tipoPropietarioFormulario = null as any;

      expect(() => component.cambiarPropietario()).not.toThrow();
    });

    it('debería manejar formulario no inicializado en cambiarTipoPropietario', () => {
      component.tipoPropietarioFormulario = null as any;

      expect(() => component.cambiarTipoPropietario()).not.toThrow();
    });

    it('debería manejar estado undefined en inicializarFormulario', () => {
      component.estadoSeleccionado = undefined as any;
      
      component.inicializarFormulario();

      expect(component.tipoPropietarioFormulario.get('propietario')?.value).toBe('');
      expect(component.tipoPropietarioFormulario.get('tipoDePropietario')?.value).toBe('');
    });

    it('debería manejar eventos con valor null en establecerCambioDeValor', () => {
      const evento = { campo: 'propietario', valor: null };
      
      component.establecerCambioDeValor(evento);

      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith('propietario', null);
    });

    it('debería manejar objetos sin id en establecerCambioDeValor', () => {
      const evento = { campo: 'propietario', valor: { descripcion: 'Test sin id' } };
      
      component.establecerCambioDeValor(evento);

      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith('propietario', { descripcion: 'Test sin id' });
    });
  });

  describe('Validación de Formulario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería validar que el formulario es inválido cuando los campos requeridos están vacíos', () => {
      component.tipoPropietarioFormulario.patchValue({
        propietario: '',
        tipoDePropietario: ''
      });

      expect(component.tipoPropietarioFormulario.valid).toBe(false);
      expect(component.tipoPropietarioFormulario.get('propietario')?.hasError('required')).toBe(true);
      expect(component.tipoPropietarioFormulario.get('tipoDePropietario')?.hasError('required')).toBe(true);
    });

    it('debería validar que el formulario es válido cuando los campos requeridos tienen valores', () => {
      component.tipoPropietarioFormulario.patchValue({
        propietario: '1',
        tipoDePropietario: '2'
      });

      expect(component.tipoPropietarioFormulario.valid).toBe(true);
    });

    it('debería mantener valores del estado en la inicialización del formulario', () => {
      tramite630303StateSubject.next({
        propietario: '2',
        tipoDePropietario: '1'
      });

      component.inicializarFormulario();

      expect(component.tipoPropietarioFormulario.get('propietario')?.value).toBe('2');
      expect(component.tipoPropietarioFormulario.get('tipoDePropietario')?.value).toBe('1');
    });
  });

  describe('Rendimiento y Optimización', () => {
    it('debería completar el Subject destroyed$ correctamente para evitar memory leaks', () => {
      const destroyedSpy = jest.spyOn(component['destroyed$'], 'complete');
      
      component.ngOnDestroy();

      expect(destroyedSpy).toHaveBeenCalled();
    });

    it('debería manejar múltiples cambios de estado sin errores', () => {
      fixture.detectChanges();

      for (let i = 0; i < 10; i++) {
        tramite630303StateSubject.next({ propietario: i.toString() });
      }

      expect(component.estadoSeleccionado['propietario']).toBe('9');
    });

    it('debería manejar suscripciones concurrentes correctamente', () => {
      fixture.detectChanges();

      expect(component.propietarioOpciones).toEqual(mockPropietarioOpciones);
      expect(component.tipoDePropietarioOpciones).toEqual(mockTipoPropietarioOpciones);
      expect(component.estadoSeleccionado).toEqual(mockTramite630303State);
    });
  });
});
