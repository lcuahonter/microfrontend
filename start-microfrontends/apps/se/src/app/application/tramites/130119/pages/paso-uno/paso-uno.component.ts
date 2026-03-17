/**
 * Componente encargado de gestionar el primer paso del trámite.
 */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { DatosDeLaSolicitudComponent } from '../datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud/datos-de-la-solicitud.service';
import { Tramite130119State } from '../../estados/store/tramite130119.store';
/**
 * Componente encargado de gestionar el primer paso del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: false,
  templateUrl: './paso-uno.component.html',
})
/**
 * Componente encargado de gestionar el primer paso del trámite.
 */
export class PasoUnoComponent implements OnInit, OnDestroy {


  /**
  * Indica si los datos de respuesta del servidor están disponibles.
  */
  public datosRespuestaDisponibles: boolean = false;

  /**
/**
 * Subject para notificar la destrucción del componente y desuscribirse de observables.
 */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta.
   */
  public estadoConsulta!: ConsultaioState;

  /**
   * Índice de la pestaña actualmente seleccionada.
   * Inicializado a 1 por defecto.
   */

  /**
   * El índice de la pestaña seleccionada.
   * @type {number}
   */
  indice: number = 1;

  /**
      * Referencia al componente `DatosDeLaSolicitudComponent`.
      * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
      */
  @ViewChild(DatosDeLaSolicitudComponent, { static: false }) datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;

  /**
   * Constructor del componente.
   * @param servicio Servicio para obtener datos de la solicitud.
   * @param consultaQuery Consulta para obtener el estado de la consulta.
   */
  constructor(
    private servicio: DatosDeLaSolicitudService,
    private consultaQuery: ConsultaioQuery
  ) { }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Configura las suscripciones necesarias y verifica si se deben obtener datos del servidor.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoSeccion) => {
        this.estadoConsulta = estadoSeccion;
      });

    if (this.estadoConsulta.update) {
      this.obtenerDatosBandejaSolicitudes();
    } else {
      this.datosRespuestaDisponibles = true;
    }
  }

  /**
   * Obtiene los datos de la bandeja de solicitudes desde el servidor.
   */
  obtenerDatosBandejaSolicitudes(): void {
    this.servicio.obtenerDatosDeLaSolicitud()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((datos: Tramite130119State) => {
        if (datos) {
          this.datosRespuestaDisponibles = true;
          this.servicio.establecerDatosDeLaSolicitud(datos);
        }
      });
  }

  /**
 * Selecciona una pestaña y actualiza el índice.
 * @param {number} i - El índice de la pestaña seleccionada.
 */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Hook del ciclo de vida que se llama cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}