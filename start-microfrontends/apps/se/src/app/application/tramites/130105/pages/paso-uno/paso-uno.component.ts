import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { ImportacionVehiculosUsadosDonacionService } from '../../services/importacion-vehiculos-usados-donacion.service';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { Tramite130105Store } from '../../../../estados/tramites/tramites130105.store';

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
  @ViewChild(SolicitudComponent, { static: false })
  solicitudComponent!: SolicitudComponent;

  /**
   * Constructor que inyecta los servicios necesarios para manejar el estado y la consulta.
   * La lógica de inicialización se delega a métodos específicos.
   */
  constructor(
    private importacionVehiculosUsadosDonacionService: ImportacionVehiculosUsadosDonacionService,
    private consultaQuery: ConsultaioQuery,
    private tramite130105Store: Tramite130105Store
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

    if (this.consultaState?.update) {
      this.guardarDatosFormulario(Number(this.consultaState?.id_solicitud));
      this.tramite130105Store.setIdSolicitud(
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
  guardarDatosFormulario(id_solicitud: number): void {
    this.importacionVehiculosUsadosDonacionService
      .getDatosDeLaSolicitud(id_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp && resp.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;

          if (DATOS) {
            const MAPPED_DATA = this.importacionVehiculosUsadosDonacionService.reverseBuildSolicitud130105(DATOS as Record<string, unknown>);
            this.importacionVehiculosUsadosDonacionService.actualizarEstadoFormulario(MAPPED_DATA);
            
            // Llamar a los métodos de obtención del catálogo SÓLO después de que se actualice el estado
            this.solicitudComponent.loadCatalogos(MAPPED_DATA);
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
   * Método de limpieza que se ejecuta al destruir el componente.
   * Finaliza las suscripciones observables utilizando `destroyNotifier$`.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
