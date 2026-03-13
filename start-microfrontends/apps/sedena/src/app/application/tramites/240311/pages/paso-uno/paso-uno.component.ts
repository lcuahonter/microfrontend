import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { SolicitudPermisoService } from '../../services/solicitud-permiso.service';
import { Tramite240311Query } from '../../estados/tramite240311Query.query';

/**
 * @title Paso Uno
 * @description Componente que representa el primer paso del flujo de solicitud. Contiene los datos del solicitante, datos del trámite, terceros relacionados y pago de derechos.
 * @summary Agrupa los subcomponentes necesarios para capturar la información inicial del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})

/**
 * Clase que representa el componente Paso Uno.
 * Este componente se encarga de gestionar el primer paso del proceso de solicitud,
 * incluyendo la carga de datos iniciales y la gestión del estado del formulario.
 */
export class PasoUnoComponent implements OnInit {
  /**
   * Observable utilizado para limpiar las suscripciones al destruir el componente.
   * Esto ayuda a evitar fugas de memoria.
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
     * @property indice
     * @description Indicates the index of the selected tab within the form step.
     * @type {number | undefined}
     */
  public indice: number = 1;

  /**
 * @property destroyNotifier$
 * @description Observable notifier to unsubscribe active subscriptions when the component is destroyed.
 * Helps prevent memory leaks.
 * @type {Subject<void>}
 */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Evento que emite el índice de la pestaña seleccionada
 * para notificar el cambio al componente padre.
 */
  @Output() selectedTab = new EventEmitter<number>();

  /**
   * Estado de la consulta, que contiene información sobre el estado actual del formulario.
   */
  public consultaState!: ConsultaioState;


  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Constructor del componente.
   * Inicializa los servicios y dependencias necesarias.
   */
  constructor(
    public solicitudPermisoService: SolicitudPermisoService,
    private consultaQuery: ConsultaioQuery,
    private tramite240311Query: Tramite240311Query
  ) { }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Configura las suscripciones necesarias y carga los datos iniciales.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
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
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.solicitudPermisoService
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudPermisoService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Selecciona una pestaña específica.
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.selectedTab.emit(i);
  }

  /**
  * Angular lifecycle method that runs just before the component is destroyed.
  * Emits and completes the `destroyNotifier$` to unsubscribe observables.
  *
  * @returns {void}
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
