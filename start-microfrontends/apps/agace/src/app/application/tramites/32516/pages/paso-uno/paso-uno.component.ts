/**
 * Componente de paso uno del trámite 32516 para AGACE.
 * 
 * Este archivo contiene la implementación del primer paso del asistente de solicitud,
 * que gestiona la navegación entre pestañas y el estado del formulario de solicitud.
 * Incluye funcionalidades para consulta de datos, gestión de estado y manejo de personas
 * relacionadas con el trámite.
 */

import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { ConsultaDatosService } from '../../servicios/consulta-datos.service';
import { EventEmitter } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit} from '@angular/core';
import { Output } from '@angular/core';
import { PersonaTerceros } from '@ng-mf/data-access-user';
import { SeccionLibStore } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Componente para el primer paso del asistente de solicitud del trámite 32516.
 * 
 * Este componente gestiona la navegación entre los pasos del formulario de solicitud,
 * maneja el estado de consulta, controla el modo solo lectura y gestiona la información
 * de personas relacionadas con el trámite. Implementa los ciclos de vida OnInit y OnDestroy
 * para una correcta gestión de recursos y prevención de fugas de memoria.
 * 
 * @component PasoUnoComponent
 * @selector paso-uno
 * @templateUrl ./paso-uno.component.html
 * @styleUrl ./paso-uno.component.scss
 * @implements {OnInit, OnDestroy}
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss'
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Indica si existen datos de respuesta para mostrar en el formulario.
   * 
   * Esta propiedad controla la visibilidad y disponibilidad de datos
   * obtenidos de respuestas previas del servicio de consulta.
   * 
   * @property {boolean} esDatosRespuesta
   * @default false
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado actual de la consulta del trámite.
   * 
   * Almacena la información del estado de la consulta obtenida del query,
   * incluyendo datos sobre el modo solo lectura y las actualizaciones pendientes.
   * 
   * @property {ConsultaioState} consultaState
   * @public
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * 
   * Cuando es `true`, los campos del formulario no se pueden editar,
   * generalmente se establece basado en el estado de la consulta.
   * 
   * @property {boolean} esFormularioSoloLectura
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Lista de personas relacionadas con el trámite.
   * 
   * Contiene la información de todas las personas (terceros) involucradas
   * en el proceso del trámite, obtenidas del servicio de consulta de datos.
   * 
   * @property {PersonaTerceros[]} personas
   * @default []
   */
  public personas: PersonaTerceros[] = [];
  /**
   * Subject utilizado para gestionar la desuscripción de observables.
   * 
   * Se utiliza como notificador para completar todas las suscripciones activas
   * en el método `ngOnDestroy()` para prevenir fugas de memoria y garantizar
   * una correcta limpieza de recursos.
   * 
   * @property {Subject<void>} destroyNotifier$
   * @private
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Índice de la pestaña seleccionada en el componente.
   * 
   * Controla qué pestaña está actualmente activa en la interfaz de usuario.
   * El valor se puede obtener de los parámetros de consulta de la ruta o
   * establecerse por defecto en 1.
   * 
   * @property {number | undefined} indice
   * @default 1
   */
  public indice: number | undefined = 1;

  /**
   * Constructor del componente PasoUnoComponent.
   * 
   * Inicializa el componente con las dependencias necesarias para la gestión de estado,
   * consulta de datos y navegación. Inyecta los servicios requeridos para el funcionamiento
   * del primer paso del trámite.
   * 
   * @constructor
   * @param {ActivatedRoute} route - Servicio para acceder a información sobre la ruta activa
   * @param {SeccionLibStore} seccionStore - Store para gestionar el estado de la sección
   * @param {ConsultaDatosService} consultaDatosService - Servicio para consulta de datos del trámite
   * @param {ConsultaioQuery} consultaQuery - Query para acceder al estado de la consulta
   */
  constructor(
    private route: ActivatedRoute, private seccionStore: SeccionLibStore, private consultaDatosService: ConsultaDatosService, private consultaQuery: ConsultaioQuery
  ) {
// Se puede agregar aquí la lógica del constructor si es necesario
  }
  /**
   * Método de ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Se suscribe a los cambios en el estado de la consulta y a los parámetros de la ruta.
   * Configura las suscripciones necesarias para:
   * - Monitorear cambios en el estado de la consulta
   * - Controlar el modo solo lectura del formulario
   * - Gestionar actualizaciones de datos
   * - Observar cambios en los parámetros de consulta de la ruta para el índice de pestañas
   * 
   * @method ngOnInit
   * @implements {OnInit}
   * @returns {void}
   */
  ngOnInit(): void {
        this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          if (this.consultaState.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
    this.route.queryParams
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = Number(tab['indice'] || 1);
      });
  }
    /**
     * Guarda los datos del formulario obtenidos del servicio de consulta.
     * 
     * Este método se suscribe al servicio de consulta de datos para obtener la información
     * de la solicitud. Cuando recibe una respuesta válida, actualiza el estado del componente
     * estableciendo los datos de respuesta como disponibles, carga la lista de personas
     * relacionadas y actualiza el estado del formulario a través del servicio.
     * 
     * @method guardarDatosFormulario
     * @returns {void}
     */
    guardarDatosFormulario(): void {
      this.consultaDatosService
        .getDatosDeLaSolicitudData()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((resp) => {
          if (resp) {
            this.esDatosRespuesta = true;
            this.consultaDatosService.actualizarEstadoFormulario(resp);
          }
        });
    }
  /**
   * Evento emitido cuando cambia la pestaña seleccionada.
   * 
   * Este EventEmitter notifica a los componentes padre cuando el usuario
   * selecciona una pestaña diferente, enviando el nuevo índice de la pestaña activa.
   * 
   * @event tabChanged
   * @property {EventEmitter<number>} tabChanged
   * @emits {number} El índice de la nueva pestaña seleccionada
   */
  @Output() tabChanged = new EventEmitter<number>();

  /**
   * Cambia el índice de la pestaña seleccionada y emite el evento correspondiente.
   * 
   * Este método actualiza la propiedad `indice` con el nuevo valor proporcionado
   * y emite un evento `tabChanged` para notificar a los componentes padre sobre
   * el cambio de pestaña activa.
   * 
   * @method seleccionaTab
   * @param {number} i - El índice de la pestaña a seleccionar
   * @returns {void}
   * @emits {number} tabChanged - Emite el nuevo índice de la pestaña seleccionada
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tabChanged.emit(i);
  }

  /**
   * Método de ciclo de vida que maneja la limpieza de recursos antes de destruir el componente.
   * 
   * Completa el Subject `destroyNotifier$` para finalizar todas las suscripciones activas
   * y evitar fugas de memoria. Este método es esencial para una correcta gestión de recursos
   * en componentes que manejan observables y suscripciones.
   * 
   * @method ngOnDestroy
   * @implements {OnDestroy}
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}