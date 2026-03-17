/**
 * @fileoverview Componente para la gestión del solicitante de asignación.
 * Este componente maneja la lógica y la presentación del solicitante de asignación,
 * incluyendo la selección de pestañas.
 * @module SolicitanteAsigncionComponent
 */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite120403Query } from '../../estados/queries/tramite120403.query';

/**
 * Componente para la gestión del solicitante de asignación.
 * @selector app-solicitante-asigncion
 * @templateUrl ./solicitante-asigncion.component.html
 * @styleUrl ./solicitante-asigncion.component.scss
 */
@Component({
  selector: 'app-solicitante-entidad',
  templateUrl: './solicitante-entidad.component.html',
  styleUrls: ['./solicitante-entidad.component.scss'],
})
export class SolicitanteAsigncionComponent implements OnInit, OnDestroy {

  /**
     * @description
     * Este componente maneja los datos del trámite 140103, permitiendo la visualización y edición de los datos del establecimiento.
     * Utiliza un servicio para obtener y actualizar los datos del formulario.
     */
    @Input() showBuscarError: boolean = false;
    /**
     * @description
     * Evento que se emite al intentar buscar datos.
     * Contiene el estado del formulario (si fue enviado y si es inválido).
     */
    @Output() buscarIntento = new EventEmitter<{ submitted: boolean; invalid: boolean,numTramite: string}>();
   /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  public destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta, utilizado para determinar si el formulario es de solo lectura. */
  public consultaState!: ConsultaioState;
  /** Subject para manejar la destrucción del componente. */
  public destroyed$ = new Subject<void>();
  
  @Input() isContinuarTriggered: boolean = false;
  /**
   * Selecciona una pestaña.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;  
  }
  /**
   * Constructor del componente.
   * @param solocitud120403Service Servicio para manejar la solicitud de asignación.
   * @param consultaQuery Consulta para obtener el estado de la consulta.
   */

  constructor(
    private solocitud120403Service: SolicitudService,
    private consultaQuery: ConsultaioQuery,
    private tramite120403Query: Tramite120403Query
  ) {}

  /**
   * Método de inicialización del componente.
   * Este método se ejecuta al iniciar el componente y se suscribe a los cambios en el estado de la consulta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState; 
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }
  /**
   * Guarda los datos del formulario de solicitud.
   * Este método se suscribe a los datos de la solicitud y actualiza el estado del formulario.
   */
  guardarDatosFormulario(): void {
    this.solocitud120403Service
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solocitud120403Service.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Método que se invoca al intentar buscar datos.
   * Emite un evento con el estado del formulario (si fue enviado y si es inválido).
   *
   * @param event - Objeto que contiene el estado del formulario.
   */
  onBuscarIntento(event: { submitted: boolean; invalid: boolean ,numTramite: string}): void {
    this.buscarIntento.emit(event);
  }

/**
 * Valida los formularios del componente.
 * @returns {boolean} Indica si los formularios son válidos.
 */
public validarFormularios(): boolean {
  const VALIDITY = this.tramite120403Query.getValue().formValidity;
  const ASIGNCION_VALID = VALIDITY?.asigncion ?? false;
  return ASIGNCION_VALID;
  }
  /**
   * Método de destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
