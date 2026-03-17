import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Subject,map, takeUntil } from 'rxjs';

import { SolicitudComponent } from '../../components/solicitud/solicitud.component';

import { ExportacionMineralesDeHierroService } from '../../services/exportacion-minerales-de-hierro.service';
import { Tramite130202Store } from '../../estados/tramites/tramites130202.store';

/**
 * Componente para gestionar el paso uno de un flujo.
 * Este componente permite seleccionar una pestaña y actualizar el índice correspondiente.
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
   * Índice de la pestaña activa.
   * Representa la pestaña seleccionada en el flujo.
   * Valor inicial: 1.
   */
  indice: number = 1;

  /**
   * Referencia al componente SolicitudComponent.
   * Se utiliza para acceder a las funcionalidades del componente de solicitud.
   */ 
  @ViewChild(SolicitudComponent, { static: false}) solicitudComponent!: SolicitudComponent;

   /**
   * Constructor que inyecta los servicios necesarios para manejar el estado y la consulta.
   * La lógica de inicialización se delega a métodos específicos.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private registroSolicitudService: RegistroSolicitudService,
    private exportacionMineralesDeHierroService: ExportacionMineralesDeHierroService,
     private tramite130202Store: Tramite130202Store,
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Inicializa el componente suscribiéndose al estado de consulta.
   * Según el estado, carga datos del formulario o marca como respuesta disponible.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
   
    if (this.consultaState.update) {
      this.tramite130202Store.setIdSolicitud(Number(this.consultaState.id_solicitud));
      this.getMostrarInitial(this.consultaState.id_solicitud);
    } else {
      this.esDatosRespuesta = true;
    }
  }

/**
 * Obtiene los datos vigentes de licitaciones mediante el servicio y actualiza el estado del formulario.
 *
 * Se suscribe al observable que retorna el servicio `getMostrarDatos()`. Si la respuesta es válida,
 * actualiza la bandera `esDatosRespuesta` y llama al método del servicio para actualizar el estado del formulario.
 */
  getMostrarInitial(solicitud_id: string): void {
    this.registroSolicitudService.mostarDatosSolicitud(130202,solicitud_id).pipe(
      takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp && resp.codigo === '00' && resp.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
          this.esDatosRespuesta = true;
          if (DATOS) {
            const MAPPED_DATA = this.exportacionMineralesDeHierroService.reverseBuildSolicitud130202(DATOS as Record<string, unknown[]>);
            this.exportacionMineralesDeHierroService.actualizarEstadoFormulario(resp.datos as unknown as Record<string, unknown[]>);
            this.solicitudComponent.loadCatalogos(MAPPED_DATA);
          } else {
            this.esDatosRespuesta = false;
          }
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
  * Método de limpieza que se ejecuta al destruir el componente.  
  * Finaliza las suscripciones observables utilizando `destroyNotifier$`.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}