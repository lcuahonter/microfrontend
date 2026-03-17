import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, JSONResponse } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite130113State, Tramite130113Store } from '../../estados/tramites/tramites130113.store';
import { ImportacionEquipoAnticontaminanteService } from '../../services/importacion-equipo-anticontaminante.service';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { Tramite130113Query } from '../../estados/queries/tramite130113.query';
/**
 * @descripcion
 * Componente que representa el paso uno del trámite.
 * Permite la selección de pestañas dentro del flujo del trámite.
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
     * Referencia al componente SolicitudComponent.
     * Se utiliza para acceder a las funcionalidades del componente de solicitud.
     */
  @ViewChild(SolicitudComponent, { static: false }) solicitudComponent!: SolicitudComponent;


  /**
   * Estado actual de la consulta cargado desde el store.
   * Contiene datos como modo de solo lectura y valores del formulario.
   */
  public consultaState!: ConsultaioState;
  /**
   * @descripcion
   * Índice de la pestaña seleccionada.
   * Controla la pestaña activa en el componente.
   */
  indice: number = 1;

  /**
    * Estado interno de la sección actual del trámite 130110.
    * Utilizado para gestionar y almacenar la información relacionada con esta sección.
    * Propiedad privada.
    */
  private seccionState!: Tramite130113State;

  /**
  * Constructor que inyecta los servicios necesarios para manejar el estado y la consulta.
  * La lógica de inicialización se delega a métodos específicos.
  */
  constructor(
    private importacionEquipoAnticontaminanteService: ImportacionEquipoAnticontaminanteService,
    private consultaQuery: ConsultaioQuery,
    private tramite130113Store: Tramite130113Store,
    private tramite130113Query: Tramite130113Query,
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Inicializa el componente suscribiéndose al estado de consulta.
   * Según el estado, carga datos del formulario o marca como respuesta disponible.
   */
  ngOnInit(): void {
    this.tramite130113Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.seccionState = data;
      });
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.tramite130113Store.actualizarEstado({ idSolicitud: Number(this.consultaState.id_solicitud) });
            this.getMostrarDatos(Number(this.consultaState.id_solicitud));           
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
  }
  /**
* Obtiene los datos de la solicitud desde un servicio y actualiza el estado del formulario.  
* Si la respuesta es válida, activa el indicador de datos cargados.
*/
  getMostrarDatos(idSolicitud: number): void {
    this.importacionEquipoAnticontaminanteService.getMostrarPartidasService(idSolicitud).pipe(takeUntil(this.destroyNotifier$)).subscribe((resp: JSONResponse) => {
     if (resp && resp.codigo === '00' && resp.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
          this.esDatosRespuesta = true;
          if (DATOS) {
            const MAPPED_DATA = this.importacionEquipoAnticontaminanteService.reverseBuildSolicitud130113(DATOS as Record<string, unknown[]>);
            this.importacionEquipoAnticontaminanteService.actualizarEstadoFormulario(resp.datos as unknown as Record<string, unknown[]>);
            this.solicitudComponent.loadCatalogos(MAPPED_DATA);
          } else {
            this.esDatosRespuesta = false;
          }
        }

    });
  }
  /**
   * Selecciona una pestaña estableciendo su índice.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
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
