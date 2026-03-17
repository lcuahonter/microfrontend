/**
 * @fileoverview Componente del primer paso del trámite 300105
 * 
 * Este archivo contiene el componente que gestiona el primer paso del proceso
 * de autorización de equipos de rayos X, enfocado en la captura de datos iniciales
 * del solicitante y la configuración inicial del formulario.
 * 
 * Funcionalidades principales:
 * - Inicialización del formulario del trámite
 * - Gestión de datos del solicitante
 * - Integración con servicios de consulta
 * - Manejo de pestañas y navegación interna
 * 
 * @author VUCEM Development Team
 * @since 1.0.0
 * @version 1.0.0
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { AutorizacionDeRayosXService } from '../../services/autorizacion-de-rayos-x.service';

/**
 * @class PasoUnoComponent
 * @description Componente que gestiona el primer paso del trámite 300105 para autorización
 * de equipos de rayos X. Este componente es el punto de entrada del proceso y maneja
 * la inicialización del formulario, la carga de datos existentes y la configuración
 * inicial necesaria para el resto del trámite.
 * 
 * El componente integra múltiples funcionalidades:
 * - Gestión del estado de consulta global
 * - Carga de datos previamente guardados
 * - Manejo de pestañas internas del primer paso
 * - Integración con servicios específicos del trámite
 * 
 * Características técnicas:
 * - Implementa OnInit para inicialización
 * - Uso de Subject para manejo de destrucción
 * - Integración con Akita para manejo de estado
 * - Suscripciones reactivas con RxJS
 * 
 * @implements {OnInit}
 * 
 * @example
 * ```typescript
 * // Uso del componente en template
 * // <app-paso-uno></app-paso-uno>
 * ```
 * 
 * @example
 * ```html
 * <!-- Integración en el wizard -->
 * <div *ngIf="pasoActual === 1">
 *   <app-paso-uno></app-paso-uno>
 * </div>
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @property {number} indice
   * @description El índice de la pestaña actualmente seleccionada dentro del primer paso.
   * Controla qué sección específica del primer paso está visible para el usuario.
   * 
   * @example
   * ```typescript
   * // Cambiar a la segunda pestaña
   * this.indice = 2;
   * ```
   * 
   * @since 1.0.0
   */
  indice: number = 1;

  /**
   * @property {boolean} esDatosRespuesta
   * @description Indica si los datos del formulario provienen de una respuesta del servidor.
   * Cuando es true, significa que se están cargando datos previamente guardados.
   * Cuando es false, indica que es un formulario nuevo sin datos previos.
   * 
   * @example
   * ```typescript
   * // Verificar origen de datos
   * if (this.esDatosRespuesta) {
   *   // Datos cargados desde servidor
   *   this.configurarFormularioConDatos();
   * } else {
   *   // Formulario nuevo
   *   this.configurarFormularioVacio();
   * }
   * ```
   * 
   * @since 1.0.0
   */
  public esDatosRespuesta: boolean = true;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para notificar la destrucción del componente.
   * Se usa para cancelar suscripciones activas y evitar memory leaks cuando
   * el componente es destruido por Angular.
   * 
   * @example
   * ```typescript
   * // Uso con takeUntil para cancelar suscripciones
   * this.servicio.obtenerDatos()
   *   .pipe(takeUntil(this.destroyNotifier$))
   *   .subscribe(datos => {
   *     // Procesar datos
   *   });
   * ```
   * 
   * @since 1.0.0
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {ConsultaioState} consultaState
   * @description Estado actual de la consulta global del sistema.
   * Contiene información sobre el estado de la consulta activa,
   * incluyendo si hay actualizaciones pendientes o datos disponibles.
   * 
   * @example
   * ```typescript
   * // Verificar estado de actualización
   * if (this.consultaState.update) {
   *   this.procesarActualizacion();
   * }
   * ```
   * 
   * @since 1.0.0
   * @public
   */
  public consultaState!: ConsultaioState;

  /**
   * @constructor
   * @description Constructor del componente PasoUnoComponent que inicializa las dependencias
   * necesarias para gestionar el primer paso del trámite 300105.
   * 
   * Inyecta los servicios requeridos:
   * - AutorizacionDeRayosXService para operaciones específicas del trámite
   * - ConsultaioQuery para acceder al estado global de consultas
   * 
   * @param {AutorizacionDeRayosXService} autorizacionDeRayosXService - Servicio específico para
   *                                                                    gestionar la autorización de equipos de rayos X
   * @param {ConsultaioQuery} consultaQuery - Query para acceder al estado global de consultas
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular
   * // cuando el componente es instanciado
   * ```
   * 
   * @since 1.0.0
   */
  constructor(
    private autorizacionDeRayosXService: AutorizacionDeRayosXService,
    private consultaQuery: ConsultaioQuery
  ) {}

  /**
   * @method ngOnInit
   * @description Método que se ejecuta al inicializar el componente.
   * Configura las suscripciones necesarias para monitorear el estado de la consulta
   * y determina si debe cargar datos existentes o inicializar un formulario nuevo.
   * 
   * Proceso de inicialización:
   * 1. Se suscribe al estado de consulta global
   * 2. Actualiza el estado local cuando hay cambios
   * 3. Determina si hay datos para actualizar
   * 4. Ejecuta la carga de datos o configura formulario nuevo
   * 
   * @returns {void} No retorna valor, ejecuta inicialización como efecto secundario
   * 
   * @example
   * ```typescript
   * // Llamado automáticamente por Angular
   * // No requiere invocación manual
   * ```
   * 
   * @since 1.0.0
   * @lifecycle
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
    if(this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * @method guardarDatosFormulario
   * @description Carga datos desde el servicio de autorización y actualiza el store con la información obtenida.
   * Este método se ejecuta cuando hay datos previamente guardados que necesitan ser
   * cargados en el formulario para permitir la continuación de un trámite existente.
   * 
   * Proceso que realiza:
   * 1. Llama al servicio para obtener datos de autorización
   * 2. Procesa la respuesta del servidor
   * 3. Actualiza el estado del formulario con los datos obtenidos
   * 4. Marca que los datos provienen del servidor
   * 
   * @returns {void} No retorna valor, actualiza el estado como efecto secundario
   * 
   * @example
   * ```typescript
   * // Uso típico al detectar datos existentes
   * if (this.consultaState.update) {
   *   this.guardarDatosFormulario();
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // El método maneja automáticamente:
   * // - Carga de datos del servidor
   * // - Actualización del estado del formulario
   * // - Configuración de bandera de datos de respuesta
   * ```
   * 
   * @since 1.0.0
   * @access public
   */
  guardarDatosFormulario(): void {
    this.autorizacionDeRayosXService
      .getAutorizacionDeRayosXDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.autorizacionDeRayosXService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * @method seleccionaTab
   * @description Selecciona una pestaña específica estableciendo su índice.
   * Este método controla la navegación interna dentro del primer paso del trámite,
   * permitiendo al usuario moverse entre diferentes secciones de captura de datos.
   * 
   * @param {number} i - El índice de la pestaña a seleccionar.
   *                     Debe ser un número válido que corresponda a una pestaña existente.
   * 
   * @returns {void} No retorna valor, actualiza el índice como efecto secundario
   * 
   * @example
   * ```typescript
   * // Seleccionar la primera pestaña
   * this.seleccionaTab(1);
   * 
   * // Seleccionar la segunda pestaña
   * this.seleccionaTab(2);
   * ```
   * 
   * @example
   * ```html
   * <!-- Uso en template con evento click -->
   * <button (click)="seleccionaTab(1)">
   *   Datos del Solicitante
   * </button>
   * <button (click)="seleccionaTab(2)">
   *   Información Adicional
   * </button>
   * ```
   * 
   * @since 1.0.0
   * @access public
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta cuando el componente va a ser destruido.
   * Se encarga de limpiar las suscripciones activas para prevenir memory leaks.
   * 
   * @returns {void} No retorna valor, ejecuta limpieza como efecto secundario
   * 
   * @example
   * ```typescript
   * // Llamado automáticamente por Angular
   * // No requiere invocación manual
   * ```
   * 
   * @since 1.0.0
   * @lifecycle
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
