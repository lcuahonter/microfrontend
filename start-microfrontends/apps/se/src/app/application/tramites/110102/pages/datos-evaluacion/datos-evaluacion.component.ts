import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { CategoriaMensaje, ConsultaioQuery, ConsultaioState, Notificacion, TabEvaluarTratadosResponse } from '@ng-mf/data-access-user';
import { Subject, takeUntil, tap } from 'rxjs';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { CommonModule } from '@angular/common';
import { EvaluacionTratadosService } from '../../service/evaluacion-tratados.service';
import { ExportadorAutorizadoEvaluarComponent } from "../../components/exportador-autorizado-evaluar/exportador-autorizado-evaluar.component";
import { ExportadorAutorizadoEvaluarService } from '../../service/exportador-autorizado-evaluar.service';
import { MercanciaEvaluacionComponent } from '../../components/mercancia-evaluacion/mercancia-evaluacion.component';
import { ProtestoDecirVerdadComponent } from "../../components/protesto-decir-verdad/protesto-decir-verdad.component";
import { SolicitanteComponent } from "@libs/shared/data-access-user/src";
import { TratadosEvaluacionComponent } from '../../components/tratados-evaluacion/tratados-evaluacion.component';


@Component({
  selector: 'app-datos-evaluacion',
  standalone: true,
  imports: [CommonModule,SolicitanteComponent, MercanciaEvaluacionComponent, TratadosEvaluacionComponent, ProtestoDecirVerdadComponent, ExportadorAutorizadoEvaluarComponent],
  templateUrl: './datos-evaluacion.component.html',
  styleUrls: ['./datos-evaluacion.component.scss'],
})
export class DatosEvaluacionComponent implements OnInit, OnDestroy {
  /**
    * Evento emitido al cambiar de pestaña.
    * @event tabChanged
    * @type {EventEmitter<number>}
    */
  @Output() tabChanged = new EventEmitter<number>();

  /**
 * @property {boolean} esDictaminadorBandera
 * @description Indica si se está mostrando boton de la calificación con bandera.
 * Por defecto es false.
 */
  @Input() esDictaminadorBandera: boolean = false;

  /**
   * Esta variable se utiliza para almacenar los tratados datos actualizados.
   * Es un array de objetos de tipo EvaluarTratadosResponse.
   */
  tratadosDatosActualizados: TabEvaluarTratadosResponse[] = [];

  /**
   * Este evento se emite cuando los tratados datos son actualizados.
   * Es un EventEmitter que emite un array de objetos de tipo EvaluarTratadosResponse.
   */
  @Output() tratadosEmitidos = new EventEmitter<TabEvaluarTratadosResponse[]>();

  /**
  * Esta variable se utiliza para almacenar el índice del subtítulo.
  */
  indice: number = 1;
  /**
   * Subject utilizado para emitir una señal que permite desuscribirse de los observables, típicamente en el ciclo de vida ngOnDestroy.
   * Cuando se emite un valor, todas las suscripciones que usan `takeUntil(this.destroyNotifier$)` serán desuscritas,
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena el estado actual del proceso Consultaio para este componente.
   */
  public consultaState!: ConsultaioState;

  /**
  * Notificación actual que se muestra en el componente.
  *
  * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
  * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
  */
  public nuevaNotificacion!: Notificacion;


  /** 
   * @property mostrarExportadorUE
   * @description Indica si debe mostrarse la sección del exportador autorizado para la Unión Europea.
   * 
  */
  mostrarExportadorUE: boolean = false;

  /**
   * @property mostrarExportadorJPN
   * @description Indica si debe mostrarse la sección del exportador autorizado para Japón.
   */
  mostrarExportadorJPN: boolean = false;

  /**
   * @property tituloExportador
   * @description Almacena el título dinámico que se muestra en la interfaz según el tipo de exportador autorizado.
   */
  tituloExportador: string = '';

  /**
   * @property controlPeticiones
   * @type {boolean}
   * @public
   * @description
   * Gestiona el estado del control de peticiones.
   * Activa o desactiva la funcionalidad de control de peticiones en el componente.
   * Por defecto, el control de peticiones está desactivado (`false`).
   */
  public controlPeticiones = false;
  /**
   * Inicializa una nueva instancia del componente.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private evaluacionTratadosService: EvaluacionTratadosService,
    private exportadorAutorizadoService: ExportadorAutorizadoEvaluarService
  ) {

  }

  /**
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   * 
   * - Se suscribe al observable `selectConsultaioState$` de `consultaQuery` y actualiza la propiedad local `consultaState` con el valor emitido.
   * - Si la bandera `consultaState.update` es verdadera después de la inicialización, ejecuta el método `guardarDatosFormulario()` para guardar los datos del formulario.
   * - Asegura que la suscripción se limpie correctamente utilizando el observable `destroyNotifier$` para evitar fugas de memoria.
   */
  ngOnInit(): void {
    // Suscripción a consultaState
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();

  
    if (this.consultaState.parameter === "EvaluarSolicitud") {
      this.evaluacionTablaTratados();
    }

    if (this.consultaState.create === false) {
      this.consultarExportadorAutorizado();
    }
  }

  /**
   * @method consultarExportadorAutorizado
   * @description Realiza la consulta de información del exportador autorizado para 
   * la Unión Europea o Japón según el folio del trámite.
   * Actualiza las banderas que controlan la visualización de las secciones correspondientes 
   * y el título del componente.
   */
  consultarExportadorAutorizado(): void {
    this.exportadorAutorizadoService.getExportadoAutorizadoUEoJPN(this.consultaState.folioTramite)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.mostrarExportadorUE = Boolean(response.datos?.mostrar_exportador_ue);
            this.mostrarExportadorJPN = Boolean(response.datos?.mostrar_exportador_jpn);

            this.actualizarTituloExportador();
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error obtener tratados.',
              mensaje: response.causa || response.mensaje || 'Error obtener tratados.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Error obtener tratados.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }
  /**
   * @method actualizarTituloExportador
   * @description Actualizar el título dinámicamente según la respuesta del endpoit
   */
  actualizarTituloExportador(): void {
    if (this.mostrarExportadorUE) {
      this.tituloExportador = 'Exportador Autorizado UE';
    } else if (this.mostrarExportadorJPN) {
      this.tituloExportador = 'Exportador Autorizado JPN';
    }
  }

  /**
     * Obtiene la evaluación de tratados para la solicitud actual y actualiza la tabla de evaluación.
     *
     * Este método llama al servicio `evaluacionTratadosService.getEvaluarTratados` pasando el ID de la solicitud.
     * - Si la respuesta es exitosa (`CodigoRespuesta.EXITO`), actualiza `tratadosEvaluacionTablaDatos`.
     * - Si ocurre un error o la respuesta es incorrecta, muestra una notificación de error.
     */
  evaluacionTablaTratados(): void {
    this.evaluacionTratadosService.getEvaluarTratados(this.consultaState.id_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.onTratadosActualizados(response.datos ?? []);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error obtener tratados.',
              mensaje: response.causa || response.mensaje || 'Error obtener tratados.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = err?.error?.error || 'Error obtener tratados.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tabChanged.emit(i);
  }


  /**
   * @method onTratadosActualizados
   * @description Maneja la actualización de los tratados.
   * @param tratados - Array de objetos de tipo EvaluarTratadosResponse que contiene los tratados actualizados.
   */
  onTratadosActualizados(tratados: TabEvaluarTratadosResponse[]): void {
    this.tratadosDatosActualizados = tratados;
    this.tratadosEmitidos.emit(tratados);
  }


  /**
   * Método del ciclo de vida que se llama cuando el componente es destruido.
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a cualquier suscripción
   * que debe limpiar recursos y prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
