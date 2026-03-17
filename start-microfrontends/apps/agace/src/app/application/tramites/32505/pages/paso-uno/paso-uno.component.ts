import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Solicitud32505State, Tramite32505Store } from '../../../../estados/tramites/trimite32505.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { AvisoService } from '../../services/aviso.service';
import { CommonModule } from '@angular/common';
import { SolicitanteComponent } from '../../components/solicitante/solicitante.component';
import { Tramite32505Query } from '../../../../estados/queries/tramite32505.query';


/**
 * Componente PasoUnoComponent
 *
 * Este componente representa el primer paso de un flujo o formulario.
 * Incluye la lógica para cambiar entre pestañas o secciones mediante un índice.
 *
 * Componentes utilizados:
 * - SolicitanteComponent: Componente que permite capturar o mostrar datos del solicitante.
 * - AvisoComponent: Componente que muestra avisos o notificaciones relevantes.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  imports: [CommonModule, SolicitanteComponent, AvisoComponent],
  standalone: true,
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
     * Estado de la consulta, que se obtiene a través del ConsultaioQuery.
     * Este estado contiene información sobre la consulta actual.
     */
  public consultaState!: ConsultaioState;

  /**
   * @property {EventEmitter<boolean>} booleanEvent
   * @description Emite un evento booleano para notificar cambios o acciones en el componente.
   */
  @Output() booleanEvent = new EventEmitter<boolean>();

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para notificar y completar las suscripciones activas al destruir el componente, evitando fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Solicitud32505State} solicitudState
   * @description Estado de la solicitud.
   */
  public solicitudState!: Solicitud32505State;
  /**
   * Método para cambiar el índice actual.
   * Permite navegar entre diferentes pestañas o secciones.
   *
   * @param i - Nuevo índice seleccionado.
   */
  indice: number = 1;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esDatosRespuesta: boolean = false;

  /**
   * Índice actual del paso o pestaña seleccionada.
   * Se usa para mostrar u ocultar secciones del componente.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @constructor
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite32505Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite32505Query} tramiteQuery - Servicio para realizar consultas relacionadas con el trámite.
   * @param {AvisoService} avisoService - Servicio para gestionar datos relacionados con avisos.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   */
  constructor(
    public store: Tramite32505Store,
    public tramiteQuery: Tramite32505Query,
    private avisoService: AvisoService,
    private consultaioQuery: ConsultaioQuery
  ) { }

  /**
   * @method ngOnInit
   *  @description Método del ciclo de vida que se ejecuta al inicializar el componente.
   *  Este método se suscribe a los estados del store `Tramite32505Store` y `ConsultaioQuery` para obtener los datos de la solicitud y la consulta.
   *  Si la consulta está marcada como `update`, se llama al método `fetchGetDatosConsulta` para obtener los datos de consulta.
   *   @returns {void}
   *  @memberof PasoUnoComponent
   *  @description Este método se ejecuta una vez que el componente ha sido inicializado y se utiliza para configurar la lógica de suscripción a los estados del store.
   *   @returns {void}
   *  @memberof PasoUnoComponent
   *   @description Este método se encarga de inicializar el componente, suscribiéndose a los estados del store y obteniendo los datos necesarios para el funcionamiento del componente.
   *   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();

    if (this.consultaState.update) {
      this.guardarDatosFormularios();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * @method guardarDatosFormularios
   * @description Método para obtener los datos de consulta desde el servicio `DatosTramiteService` y actualizar el estado del store `Tramite11201Store`.
   *
   * Este método realiza una solicitud HTTP para obtener los datos de consulta y, si la respuesta es exitosa, actualiza múltiples propiedades del store con los datos recibidos.
   * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   *
   * @returns {void}
   */
  public guardarDatosFormularios(): void {
    this.avisoService
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.avisoService.actualizarEstadoFormulario(resp);
        }
      });

  }

  /**
 * @method ngOnDestroy
 * @description Método del ciclo de vida que se ejecuta al destruir el componente.
 *
 * Este método emite un valor en el `destroyNotifier$` para notificar la destrucción del componente y completa el `Subject` para liberar recursos y evitar fugas de memoria.
 *
 * @returns {void}
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
