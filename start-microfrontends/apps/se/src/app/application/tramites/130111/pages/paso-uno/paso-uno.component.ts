import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject,map, takeUntil } from 'rxjs';
import { ImportacionDeVehiculosService } from '../../services/importacion-de-vehiculos.service';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';

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
    private importacionDeVehiculosService: ImportacionDeVehiculosService,
    private consultaQuery: ConsultaioQuery
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Inicializa el componente suscribiéndose al estado de consulta.
   * Según el estado, carga datos del formulario o marca como respuesta disponible.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.consultaState = seccionState;
    })).subscribe();
    if(this.consultaState?.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
  * Obtiene los datos de la solicitud desde un servicio y actualiza el estado del formulario.  
  * Si la respuesta es válida, activa el indicador de datos cargados.
  */
  guardarDatosFormulario(): void {
    this.importacionDeVehiculosService
      .getDatosDeLaSolicitud().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.importacionDeVehiculosService.actualizarEstadoFormulario(resp);
        }else {
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