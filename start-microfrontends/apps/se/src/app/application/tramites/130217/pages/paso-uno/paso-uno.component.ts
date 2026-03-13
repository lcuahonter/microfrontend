import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { ControlPermisosPreviosExportacionService } from '../../services/control-permisos-previos-exportacion.service';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';

/**
 * Componente que representa el primer paso del trámite 130217.
 *
 * Este componente gestiona la visualización y lógica del primer paso del flujo,
 * incluyendo la carga y actualización de datos relacionados con la consulta y el formulario.
 * Utiliza servicios para obtener información del estado global y para interactuar con el backend.
 *
 * @export
 * @class PasoUnoComponent
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /**
   * Índice utilizado para identificar la posición actual en un proceso o lista.
   * @type {number}
   */
  indice: number = 1;

     /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta obtenido desde el store global.
   * Contiene la información relevante para el flujo del trámite en este paso.
   */
  public consultaState!:ConsultaioState;

  /**
   * Referencia al componente SolicitudComponent.
   * Se utiliza para acceder a las funcionalidades del componente de solicitud.
   */ 
  @ViewChild(SolicitudComponent, { static: false}) solicitudComponent!: SolicitudComponent;

  /**
   * Constructor del componente PasoUnoComponent.
   *
   * @param controlPermisosService Servicio inyectado para gestionar permisos previos de exportación.
   * @param consultaQuery Servicio para consultar el estado global de la consulta.
   *
   * El constructor no realiza inicialización directa; la configuración y carga de datos
   * se efectúan en métodos específicos y en los ciclos de vida del componente.
   */
  constructor(
    @Inject(ControlPermisosPreviosExportacionService)
    public controlPermisosService: ControlPermisosPreviosExportacionService,
    private consultaQuery: ConsultaioQuery
  ) {
// Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
 * Método del ciclo de vida que se ejecuta al inicializar el componente.
 *
 * Suscribe al observable `selectConsultaioState$` para obtener el estado actual de la consulta
 * y lo asigna a la propiedad `consultaState`. Dependiendo del valor de `update` en el estado,
 * decide si debe cargar los datos del formulario o marcar que los datos de respuesta están listos.
 *
 * @returns {void}
 */
ngOnInit(): void {
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
    if(this.consultaState.update) {
      // this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
}

// /**
//    * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
//    * Luego reinicializa el formulario con los valores actualizados desde el store.
//    */
//   guardarDatosFormulario(): void {
//     this.controlPermisosService
//       .getRegistroTomaMuestrasMercanciasData().pipe(
//         takeUntil(this.destroyNotifier$)
//       )
//       .subscribe((resp) => {
//         if(resp){
//         this.esDatosRespuesta = true;
//         this.controlPermisosService.actualizarEstadoFormulario(resp);
//         }else {
//           this.esDatosRespuesta = false;
//         }
//       });
//   }

  /**
   * Selecciona una pestaña específica.
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
     * Método de limpieza al destruir el componente.
     */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
