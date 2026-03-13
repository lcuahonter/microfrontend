/**
 * tipo-propietario.component.ts
 * Componente que gestiona los datos del tipo de propietario para el trámite 630303.
 * Permite inicializar formularios, obtener datos de catálogos y manejar el estado del formulario.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

import { SolicitanteComponent, TituloComponent } from '@ng-mf/data-access-user';

import { FORMULARIO_DATOS_PROPIETARIO_DIRECCION } from '../../enum/retorno-importacion-temporal.enum';
import { Tramite630303Query } from '../../estados/tramite630303.query';

import { Tramite630303State, Tramite630303Store } from '../../estados/tramite630303.store';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';

import { Catalogo, ModeloDeFormaDinamica } from '@ng-mf/data-access-user';
/**
 * Componente que gestiona los datos del tipo de propietario para el trámite 630303.
 */
@Component({
  selector: 'app-tipo-propietario',
  standalone: true,
  imports: [
    CommonModule,
    FormasDinamicasComponent,
    CatalogoSelectComponent,
    TituloComponent,
    ReactiveFormsModule,
    SolicitanteComponent,
  ],
  templateUrl: './tipo-propietario.component.html',
  styleUrls: ['./tipo-propietario.component.scss'],
})
export class TipoPropietarioComponent implements OnInit, OnDestroy {

  /**
   * Indicador para mostrar el formulario de personas extranjeras.
   */
  mostrarFormularioPersonaExtranjera = false;
  /**
   * Indica si se debe mostrar el tipo de propietario.
   */
  mostrarTipoPropietario = false;

  /**
   * Indica si se debe mostrar el solicitante.
   */
  mostrarSolicitante = false;

  /**
   * Opciones de propietarios obtenidas desde un catálogo.
   */
  propietarioOpciones: Catalogo[] = [];

  /**
   * Opciones de tipos de propietarios obtenidas desde un catálogo.
   */
  tipoDePropietarioOpciones: Catalogo[] = [];

  /**
   * Formulario dinámico para gestionar los datos del tipo de propietario.
   */
  formularioDatosPropietarioDireccion: ModeloDeFormaDinamica[] = FORMULARIO_DATOS_PROPIETARIO_DIRECCION;
  
  /**
   * Formulario reactivo para gestionar los datos del tipo de propietario.
   */
  tipoPropietarioFormulario!: FormGroup;

  /**
   * Estado seleccionado del trámite 630303.
   */
  estadoSeleccionado!: Tramite630303State;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

    /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, los campos del formulario estarán deshabilitados para edición.
   */
  esFormularioSoloLectura!: boolean;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Tramite630303State;

  /**
   * Constructor del componente.
   * Inicializa las dependencias necesarias y establece el formulario reactivo base
   * para la gestión de datos del tipo de propietario en el trámite de retorno
   * de importación temporal.
   * 
   * @param fb - Constructor de formularios reactivos de Angular para crear y manejar formularios.
   * @param tramite630303Store - Store para actualizar y mantener el estado del trámite 630303.
   * @param tramite630303Query - Query para observar y consultar el estado del trámite 630303.
   * @param retornoImportacionTemporalService - Servicio para obtener datos de catálogos relacionados con importación temporal.
   * @param consultaioQuery - Query para obtener el estado de consulta y determinar el modo de solo lectura.
   * 
   * @description El constructor ejecuta inmediatamente la inicialización del formulario
   * con valores predeterminados y validaciones necesarias para la gestión del tipo de propietario.
   * 
   * @memberof TipoPropietarioComponent
   */
  constructor(
    private fb: FormBuilder,
    private tramite630303Store: Tramite630303Store,
    private tramite630303Query: Tramite630303Query,
    private retornoImportacionTemporalService: RetornoImportacionTemporalService,
     private consultaioQuery: ConsultaioQuery
  ) {
    this.inicializarFormulario()
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos según corresponda.
   */
  guardarDatosFormulario(): void {
    if (!this.tipoPropietarioFormulario) {
      return;
    }
    
    if (this.esFormularioSoloLectura) {
      this.tipoPropietarioFormulario.disable();
      this.formularioDatosPropietarioDireccion = this.formularioDatosPropietarioDireccion.map(campo => ({
        ...campo,
        desactivado: true
      }));

    } else if (!this.esFormularioSoloLectura) {
      this.tipoPropietarioFormulario.enable();
      this.formularioDatosPropietarioDireccion = this.formularioDatosPropietarioDireccion.map(campo => ({
        ...campo,
        desactivado: false
      }));
    } 
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario y obtiene datos de catálogos.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.getPropietario();
    this.getTipoDePropietario();
    this.inicializarFormulario();
    this.obtenerEstadoValor();
    this.getPais();
    this.cambiarPropietario();
    this.cambiarTipoPropietario();
  }

   /**
   * Se suscribe al observable del estado del trámite (`Tramite220103Query`)
   * para obtener y almacenar el estado actual en `estadoSeleccionado`.
   * La suscripción se gestiona con `takeUntil` para limpiarse automáticamente
   * en `ngOnDestroy`.
   */
  obtenerEstadoValor(): void {
   this.consultaioQuery.selectConsultaioState$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((estadoConsulta) => {
      this.esFormularioSoloLectura = estadoConsulta.readonly;
      this.guardarDatosFormulario()
    });
  }

  /**
   * Cambia la visibilidad de los campos según el tipo de propietario seleccionado.
   */
  cambiarTipoPropietario(): void {
    if (!this.tipoPropietarioFormulario) {
      return;
    }
    
    const TIPO_PROPIETARIO_VALOR = this.tipoPropietarioFormulario.get('tipoDePropietario')?.value;
    const NOMBRE_CAMPO = this.formularioDatosPropietarioDireccion.find((campo) => campo.id === 'nombre');
    const APELLIDO_PATERNO_CAMPO = this.formularioDatosPropietarioDireccion.find((campo) => campo.id === 'apellidoPaterno');
    const APELLIDO_MATERNO_CAMPO = this.formularioDatosPropietarioDireccion.find((campo) => campo.id === 'apellidoMaterno');
    const RAZON_SOCIAL_CAMPO = this.formularioDatosPropietarioDireccion.find((campo) => campo.id === 'razonSocial');

    if (NOMBRE_CAMPO && APELLIDO_PATERNO_CAMPO && APELLIDO_MATERNO_CAMPO && RAZON_SOCIAL_CAMPO) {
      NOMBRE_CAMPO.mostrar = TIPO_PROPIETARIO_VALOR === '1';
      APELLIDO_PATERNO_CAMPO.mostrar = TIPO_PROPIETARIO_VALOR === '1';
      APELLIDO_MATERNO_CAMPO.mostrar = TIPO_PROPIETARIO_VALOR === '1';
      RAZON_SOCIAL_CAMPO.mostrar = TIPO_PROPIETARIO_VALOR === '2';
    }
    this.mostrarFormularioPersonaExtranjera = TIPO_PROPIETARIO_VALOR ;
  }

  /**
   * Cambia la visibilidad de los componentes según el propietario seleccionado.
   */
  cambiarPropietario(): void {
    if (!this.tipoPropietarioFormulario) {
      return;
    }
    
    this.mostrarTipoPropietario = this.tipoPropietarioFormulario.get('propietario')?.value === '2';
    this.mostrarSolicitante = this.tipoPropietarioFormulario.get('propietario')?.value === '1';
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   */
  inicializarFormulario(): void {
    this.tipoPropietarioFormulario = this.fb.group({
      propietario: [this.estadoSeleccionado?.['propietario'] || '', Validators.required],
      tipoDePropietario: [this.estadoSeleccionado?.['tipoDePropietario'] || '', Validators.required],
    });
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   */
  getValorStore(): void {
    this.tramite630303Query.selectTramite630303State$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }

  /**
   * Obtiene las opciones de propietarios desde el servicio.
   */
  getPropietario(): void {
    this.retornoImportacionTemporalService
      .getPropietario()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.propietarioOpciones = data;
      });
  }

  /**
   * Obtiene las opciones de tipos de propietarios desde el servicio.
   */
  getTipoDePropietario(): void {
    this.retornoImportacionTemporalService
      .getTipoDePropietario()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tipoDePropietarioOpciones = data;
      });
  }

  /**
   * Obtiene las opciones de países desde el servicio.
   */
  getPais(): void {
    this.retornoImportacionTemporalService
      .getPais()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const PAIS_FIELD = this.formularioDatosPropietarioDireccion.find((campo) => campo.id === 'pais');
        if (PAIS_FIELD) {
          PAIS_FIELD.opciones = data;
        }
      });
  }

  /**
   * Establece un cambio de valor en el store basado en un evento.
   *  Evento que contiene el campo y el valor a actualizar.
   */
  establecerCambioDeValor($event: { campo: string; valor: unknown }): void {
    if (!$event || typeof $event !== 'object' || !$event.campo) {
      return;
    }

    if (typeof $event.valor === 'object' && $event.valor !== null && 'id' in $event.valor) {
      this.tramite630303Store.setTramite630303State($event.campo, String(($event.valor as { id: unknown }).id));
    } else {
      this.tramite630303Store.setTramite630303State($event.campo, $event.valor);
    }
  }

  /**
   * Valida el formulario considerando solo los campos visibles según las condiciones.
   * @returns {boolean} true si el formulario es válido considerando solo campos visibles
   */
  public validarFormularioCondicional(): boolean {
    if (!this.tipoPropietarioFormulario) {
      return true; // Si no hay formulario, se considera válido
    }

    // Marcar todos los controles como tocados
    this.tipoPropietarioFormulario.markAllAsTouched();

    let esValido = true;

    // Validar campo "propietario" - siempre requerido
    const PROPIETARIO_CONTROL = this.tipoPropietarioFormulario.get('propietario');
    if (PROPIETARIO_CONTROL && PROPIETARIO_CONTROL.invalid) {
      esValido = false;
    }

    // Validar "tipoDePropietario" solo si es visible (cuando propietario = "2")
    if (this.mostrarTipoPropietario) {
      const TIPO_PROPIETARIO_CONTROL = this.tipoPropietarioFormulario.get('tipoDePropietario');
      if (TIPO_PROPIETARIO_CONTROL && TIPO_PROPIETARIO_CONTROL.invalid) {
        esValido = false;
      }
    }

    // Validar campos dinámicos solo si el formulario persona extranjera es visible
    if (this.mostrarFormularioPersonaExtranjera) {
      // Validar campos según el tipo de propietario
      const TIPO_PROPIETARIO_VALOR = this.tipoPropietarioFormulario.get('tipoDePropietario')?.value;
      
      if (TIPO_PROPIETARIO_VALOR === '1') {
        // Persona física: validar nombre y apellidos
        const CAMPOS_REQUERIDOS = ['nombre', 'apellidoPaterno', 'apellidoMaterno'];
        CAMPOS_REQUERIDOS.forEach(campo => {
          const CONTROL = this.tipoPropietarioFormulario.get(campo);
          if (CONTROL) {
            CONTROL.markAsTouched();
            if (CONTROL.invalid) {
              esValido = false;
            }
          }
        });
      } else if (TIPO_PROPIETARIO_VALOR === '2') {
        // Persona moral: validar razón social
        const RAZON_SOCIAL_CONTROL = this.tipoPropietarioFormulario.get('razonSocial');
        if (RAZON_SOCIAL_CONTROL) {
          RAZON_SOCIAL_CONTROL.markAsTouched();
          if (RAZON_SOCIAL_CONTROL.invalid) {
            esValido = false;
          }
        }
      }
    }

    return esValido;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}