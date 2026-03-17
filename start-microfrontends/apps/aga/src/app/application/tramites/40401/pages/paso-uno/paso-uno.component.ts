/**
 * Componente Angular para el primer paso del wizard de registro del trámite 40401 del sistema AGA.
 *
 * Este archivo contiene la implementación del componente que maneja la primera etapa del proceso
 * de registro de certificación aérea del trámite 40401. El componente gestiona la captura inicial
 * de datos del solicitante, la inicialización del formulario, y la coordinación entre diferentes
 * componentes hijos para recopilar la información necesaria del trámite.
 *
 * Funcionalidades principales:
 * - Gestión del primer paso del wizard de registro
 * - Captura de datos del solicitante y empresa
 * - Integración con servicios de CAAT Aéreo
 * - Manejo de estado del trámite y navegación entre pestañas
 * - Inicialización automática de datos desde servicios externos
 * - Control del ciclo de vida del componente y gestión de memoria
 *
 * @fileoverview Componente del primer paso del wizard de registro del trámite 40401
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module PasoUnoComponent
 */

import { AfterViewInit, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Component } from '@angular/core';
import { map } from 'rxjs';

import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from '../../components/datos-del-tramite/datos-del-tramite.component';
import { RegistroCaatAereoService } from '../../services/RegistroCaatAereoController.service';
import { Tramite40401Query } from '../../../../core/queries/tramite40401.query';
import { Tramite40401State } from '../../../../core/estados/tramites/tramite40401.store';
import { Tramite40401Store } from '../../../../core/estados/tramites/tramite40401.store';

/**
 * Componente Angular que implementa el primer paso del wizard de registro del trámite 40401.
 *
 * Este componente gestiona la etapa inicial del proceso de certificación de registro
 * para el trámite 40401 del sistema AGA. Coordina la captura de información del
 * solicitante, datos de la empresa, y la inicialización de datos específicos de
 * CAAT Aéreo mediante integración con servicios especializados.
 *
 * El componente implementa un patrón de wizard con navegación por pestañas,
 * gestión de estado reactivo utilizando Akita, y manejo automático del ciclo
 * de vida para prevenir fugas de memoria en suscripciones RxJS.
 *
 * @class PasoUnoComponent
 * @implements {AfterViewInit} Para inicialización posterior a la vista
 * @implements {OnInit} Para inicialización del componente
 * @implements {OnDestroy} Para limpieza de recursos y suscripciones
 *
 * @example
 * ```typescript
 * // Uso en template padre:
 * <paso-uno></paso-uno>
 *
 * // Navegación programática desde componente padre:
 * export class RegistroWizardComponent {
 *   @ViewChild(PasoUnoComponent) pasoUno!: PasoUnoComponent;
 *
 *   avanzarAlSiguientePaso(): void {
 *     if (this.pasoUno.solicitante.esValido()) {
 *       this.navegarAPasoDos();
 *     }
 *   }
 * }
 * ```
 *
 * @since 1.0.0
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SolicitanteComponent,
    DatosDelTramiteComponent,
  ],
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * @property {SolicitanteComponent} solicitante
   * Referencia al componente hijo que maneja la captura de datos del solicitante.
   *
   * ViewChild que proporciona acceso directo al componente SolicitanteComponent
   * para controlar la inicialización de datos, validación de formularios,
   * y configuración del tipo de persona (moral nacional) requerido para
   * el trámite 40401 de certificación aérea.
   *
   * @since 1.0.0
   */
  @ViewChild(SolicitanteComponent)
  solicitante!: SolicitanteComponent;

  /**
   * @property {number} indice
   * Índice del paso actual en el wizard de registro del trámite.
   *
   * Número que identifica la posición actual dentro del flujo de pasos
   * del wizard, utilizado para navegación, control de estado activo
   * y sincronización con el store del trámite para mantener consistencia
   * en la interfaz de usuario durante el proceso de registro.
   *
   * @default 1
   * @since 1.0.0
   */
  indice: number = 1;

  /**
   * @property {Tramite40401State} tramiteState
   * Estado completo del trámite 40401 obtenido desde el store de Akita.
   *
   * Objeto que contiene toda la información del estado del trámite,
   * incluyendo datos del formulario, pestañas activas, progreso del
   * wizard, y configuraciones específicas utilizadas para mantener
   * la coherencia de datos durante el proceso de registro.
   *
   * @since 1.0.0
   */
  public tramiteState!: Tramite40401State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * Subject RxJS para gestionar la destrucción de suscripciones y prevenir fugas de memoria.
   *
   * Observable que se utiliza con el operador takeUntil para automaticamente
   * cancelar todas las suscripciones activas cuando el componente es destruido,
   * implementando el patrón de limpieza de memoria recomendado en Angular
   * para componentes que manejan múltiples suscripciones RxJS.
   *
   * @since 1.0.0
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {boolean} esDatosRespuesta
   * Indicador de si los datos han sido cargados desde el servidor.
   *
   * Flag que controla el estado de carga de datos del servidor, utilizado
   * para mostrar indicadores de carga, habilitar/deshabilitar campos del
   * formulario, y determinar cuándo los datos están listos para interacción
   * del usuario en el proceso de captura de información del trámite.
   *
   * @default false
   * @since 1.0.0
   */
  public esDatosRespuesta: boolean = false;
  
  /**
   * @property {ConsultaioState} consultaDatos
   * Estado de la consulta de datos del sistema de consultas.
   *
   * Objeto que almacena el estado actual de las consultas realizadas
   * al sistema, incluyendo información sobre actualizaciones pendientes,
   * datos cargados, y configuraciones necesarias para sincronizar
   * información entre diferentes módulos del sistema AGA.
   *
   * @since 1.0.0
   */
  consultaDatos!: ConsultaioState;

  /**
   * Constructor del componente PasoUnoComponent.
   *
   * Inicializa las dependencias necesarias para el funcionamiento del componente,
   * incluyendo el store de Akita para gestión de estado, queries para consultas
   * reactivas, y servicios especializados para la obtención de datos de CAAT Aéreo.
   *
   * @constructor
   * @param {Tramite40401Store} store - Store de Akita para gestión del estado del trámite 40401
   * @param {Tramite40401Query} tramiteQuery - Query para consultas reactivas del estado del trámite
   * @param {ConsultaioQuery} consultaQuery - Query para consultas del sistema general
   * @param {RegistroCaatAereoService} registroCaatAereoService - Servicio para operaciones de CAAT Aéreo
   *
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular DI:
   * // No se invoca directamente, Angular maneja la inyección de dependencias
   * ```
   *
   * @since 1.0.0
   */
  constructor(
    public store: Tramite40401Store,
    public tramiteQuery: Tramite40401Query,
    private consultaQuery: ConsultaioQuery,
    private registroCaatAereoService: RegistroCaatAereoService
  ) {
    // Inicializa el paso activo en el store
  }

  /**
   * @method seleccionaTab
   * Selecciona y activa una pestaña específica del wizard de registro.
   *
   * Método que maneja la navegación entre diferentes pestañas del wizard,
   * actualizando tanto el estado local del componente como el estado global
   * del store para mantener sincronización entre la interfaz de usuario
   * y el modelo de datos del trámite.
   *
   * @param {number} i - Índice numérico de la pestaña a activar (1-based)
   *
   * @example
   * ```typescript
   * // Navegar a la segunda pestaña:
   * this.seleccionaTab(2);
   *
   * // Uso desde template:
   * <button (click)="seleccionaTab(3)">Ir a Paso 3</button>
   * ```
   *
   * @returns {void}
   * @since 1.0.0
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.store.setPestanaActiva(this.indice);
  }

  /**
   * @method ngOnInit
   * Método del ciclo de vida OnInit de Angular para inicialización del componente.
   *
   * Ejecuta la configuración inicial del componente incluyendo la suscripción
   * a observables del estado del trámite y del sistema de consultas. Configura
   * la navegación inicial basada en el estado persistido y determina si debe
   * cargar datos desde servicios externos o utilizar datos de respuesta previos.
   *
   * Este método implementa el patrón de suscripción con takeUntil para gestión
   * automática de memoria y utiliza el operador map para transformación de datos.
   *
   * @implements {OnInit.ngOnInit}
   *
   * @example
   * ```typescript
   * // Llamado automáticamente por Angular:
   * // No se invoca directamente, forma parte del ciclo de vida del componente
   *
   * // El flujo de inicialización incluye:
   * // 1. Suscripción al estado del trámite
   * // 2. Configuración de pestaña activa
   * // 3. Suscripción al estado de consultas
   * // 4. Decisión de carga de datos
   * ```
   *
   * @returns {void}
   * @since 1.0.0
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    this.indice = this.tramiteState.pestanaActiva;

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          // seccionState.update = true; // Asegura que se actualice el estado 
          this.consultaDatos = seccionState;

        })
      )
      .subscribe();

    if (this.consultaDatos.update) {
      this.guardarDatosFormulario();
    }else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * @method guardarDatosFormulario
   * Carga y guarda datos de CAAT Aéreo desde servicios externos al store del trámite.
   *
   * Método que realiza una llamada al servicio de registro de CAAT Aéreo para
   * obtener datos específicos de certificación aérea y actualiza el estado
   * del store con la información obtenida. Los datos incluyen tipo de CAAT,
   * código de transportación y empresa de transportación.
   *
   * Utiliza el patrón de suscripción con takeUntil para gestión automática
   * de memoria y actualiza el flag de datos de respuesta una vez completada
   * la operación para habilitar la interacción del usuario con el formulario.
   *
   * @example
   * ```typescript
   * // Llamado automáticamente durante ngOnInit si consultaDatos.update es true:
   * if (this.consultaDatos.update) {
   *   this.guardarDatosFormulario();
   * }
   *
   * // También puede ser llamado manualmente:
   * this.guardarDatosFormulario();
   * ```
   *
   * @returns {void}
   * @since 1.0.0
   */
  guardarDatosFormulario(): void {
      this.registroCaatAereoService
        .obtenerCAATAereoData()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((data) => {
          this.esDatosRespuesta = true;

          // Actualiza el estado del chofer40103Store con los datos del director general
          this.store.setPais(data.TipoDeCaatAereo);
          this.store.setCodigo(data.DodigoDeTransportacion);
          this.store.setTransportacion(data.EmpresaDeTransportacion);
        });
  }

  /**
   * @method ngOnDestroy
   * Método del ciclo de vida OnDestroy de Angular para limpieza de recursos.
   *
   * Ejecuta la limpieza necesaria al destruir el componente, incluyendo la
   * finalización del Subject destroyNotifier$ que automáticamente cancela
   * todas las suscripciones activas, previniendo fugas de memoria y
   * operaciones en componentes destruidos.
   *
   * Implementa el patrón recomendado de Angular para manejo de suscripciones
   * RxJS en componentes con múltiples observables suscritos.
   *
   * @implements {OnDestroy.ngOnDestroy}
   *
   * @example
   * ```typescript
   * // Llamado automáticamente por Angular:
   * // No se invoca directamente, forma parte del ciclo de vida del componente
   *
   * // Limpia automáticamente todas las suscripciones que usan:
   * // .pipe(takeUntil(this.destroyNotifier$))
   * ```
   *
   * @returns {void}
   * @since 1.0.0
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

    /**
     * @method ngAfterViewInit
     * Método del ciclo de vida AfterViewInit de Angular para inicialización post-vista.
     *
     * Se ejecuta después de que Angular ha completamente inicializado la vista
     * del componente y todos sus componentes hijos. En este punto, las referencias
     * ViewChild están disponibles y se puede interactuar safely con componentes
     * hijos como SolicitanteComponent.
     *
     * Este método inicia la configuración del tipo de persona requerida para
     * el trámite 40401, específicamente estableciendo el tipo como persona moral nacional.
     *
     * @implements {AfterViewInit.ngAfterViewInit}
     *
     * @example
     * ```typescript
     * // Llamado automáticamente por Angular:
     * // No se invoca directamente, forma parte del ciclo de vida del componente
     *
     * // Garantiza que @ViewChild(SolicitanteComponent) esté disponible
     * // antes de llamar métodos en el componente hijo
     * ```
     *
     * @returns {void}
     * @since 1.0.0
     */
    ngAfterViewInit(): void {
      this.obtenerTipoPersona();
    }
    
    /**
     * @method obtenerTipoPersona
     * Configura el tipo de persona en el componente SolicitanteComponent.
     *
     * Método que establece el tipo de persona como "Moral Nacional" en el componente
     * hijo SolicitanteComponent, requerido para el trámite 40401 de certificación
     * aérea. Utiliza setTimeout para asegurar que el componente hijo esté
     * completamente inicializado antes de invocar sus métodos.
     *
     * La configuración de persona moral nacional es un requisito específico
     * del trámite 40401 que determina los campos y validaciones aplicables
     * en el formulario de registro del solicitante.
     *
     * @example
     * ```typescript
     * // Llamado automáticamente desde ngAfterViewInit:
     * this.obtenerTipoPersona();
     *
     * // El método configura internamente:
     * // this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
     * ```
     *
     * @returns {void}
     * @since 1.0.0
     */
    obtenerTipoPersona(): void {
      setTimeout(() => {
        if (this.solicitante) {
          this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
        }
      }, 50);
    }
}
