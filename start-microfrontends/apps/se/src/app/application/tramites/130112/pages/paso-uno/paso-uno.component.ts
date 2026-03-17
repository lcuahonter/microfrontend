import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { ImportacionMaterialDeInvestigacionCientificaService } from '../../services/importacion-material-de-investigacion-cientifica.service';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { Tramite130112Store } from '../../estados/tramites/tramites130112.store';

/**
 * @descripcion
 * Componente que representa el primer paso del trámite de importación de material de investigación científica.
 * Este componente gestiona la lógica y la interfaz de usuario para cambiar entre pestañas.
 *
 * @selector app-paso-uno
 * @templateUrl ./paso-uno.component.html
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta cargado desde el store.
   * Contiene datos como modo de solo lectura y valores del formulario.
   */
  public consultaState!: ConsultaioState;
  /**
   * @descripcion
   * Índice de la pestaña seleccionada actualmente.
   * @type {number}
   */
  indice: number = 1;

  /**
   * @descripcion
   * Referencia al componente de solicitud obtenida mediante ViewChild.
   * Se utiliza para acceder a los métodos de validación y manipulación del formulario de solicitud.
   * @type {SolicitudComponent | undefined}
   */
  @ViewChild('solicitud', { static: false })
  solicitudComponent: SolicitudComponent | undefined;

  /**
   * @descripcion
   * Cambia el índice de la pestaña seleccionada.
   * @param {number} i - Índice de la pestaña a seleccionar.
   */

  /**
   * Constructor que inyecta los servicios necesarios para manejar el estado y la consulta.
   * La lógica de inicialización se delega a métodos específicos.
   * @param importacionMaterialDeInvestigacionCientificaService - Servicio para manejar la importación de material de investigación científica.
   * @param consultaQuery - Servicio para consultar el estado de la aplicación.
   * @param tramite130112Store - Store específico para el trámite 130112.
   */
  constructor(
    private importacionMaterialDeInvestigacionCientificaService: ImportacionMaterialDeInvestigacionCientificaService,
    private consultaQuery: ConsultaioQuery,
    private tramite130112Store: Tramite130112Store
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Inicializa el componente suscribiéndose al estado de consulta.
   * Según el estado, carga datos del formulario o marca como respuesta disponible.
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
      this.guardarDatosFormulario(Number(this.consultaState?.id_solicitud));
      this.tramite130112Store.setIdSolicitud(
        Number(this.consultaState?.id_solicitud)
      );
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Obtiene los datos de la solicitud desde un servicio y actualiza el estado del formulario.
   * Si la respuesta es válida, activa el indicador de datos cargados.
   */
  guardarDatosFormulario(idSolicitud: number): void {
    this.importacionMaterialDeInvestigacionCientificaService
      .getDatosDeLaSolicitud(idSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp && resp.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;

          if (DATOS) {
            const MAPPED_DATA = this.importacionMaterialDeInvestigacionCientificaService.reverseBuildSolicitud130112(DATOS as Record<string, unknown>);
            this.importacionMaterialDeInvestigacionCientificaService.actualizarEstadoFormulario(MAPPED_DATA);

            // Llamar a los métodos de obtención del catálogo SÓLO después de que se actualice el estado
            this.solicitudComponent?.loadCatalogos(MAPPED_DATA);
          }
          this.esDatosRespuesta = true;
        } else {
          this.esDatosRespuesta = false;
        }
      });
  }

  /**
   * Método para seleccionar una pestaña.
   * Actualiza el índice de la pestaña activa.
   *
   * Número que representa el índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Valida todos los formularios en el componente.
   * @returns si todos los formularios son válidos
   */
  validarTodosLosFormularios(): boolean {
    if (this.indice >= 2 && this.solicitudComponent) {
      this.solicitudComponent.marcarCamposComoTocados();
      return this.solicitudComponent.validarFormulario();
    }

    this.indice = 2;
    return false;
  }

  /**
   * Método de limpieza que se ejecuta al destruir el componente.
   * Finaliza las suscripciones observables utilizando `destroyNotifier$`.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
