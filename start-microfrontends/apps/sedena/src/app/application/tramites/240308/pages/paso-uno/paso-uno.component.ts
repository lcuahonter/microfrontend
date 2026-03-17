/**
 *  PasoUnoComponent
 *  Componente que representa el primer paso del flujo de solicitud de artificios pirotécnicos.
 */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { map, Subject, takeUntil } from 'rxjs';
import { SolicitudeDeArtificiosPirotecnicosService } from '../../services/solicitude-de-artificios-pirotecnicos.service';
import { Tramite240308Store } from '../../estados/tramite240308Store.store';
import { Tramite240308Query } from '../../estados/tramite240308Query.query';

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
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
    * @property indice
    * @description Indicates the index of the selected tab within the form step.
    * @type {number | undefined}
    */
  @Input() indice: number = 1;

  /**
   * Indica si los datos de respuesta del servidor están disponibles.
   * @type {boolean}
   */
  public datosRespuestaDisponibles: boolean = false;

  /**
 * Esta variable se utiliza para almacenar el índice del subtítulo.
 */
  public consultaState!: ConsultaioState;

  /**
   * Subject para notificar la destrucción del componente y desuscribirse de observables.
   * @type {Subject<void>}
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta.
   * @type {ConsultaioState}
   */
  public estadoConsulta!: ConsultaioState;

  /**
   * Constructor del componente. Inyecta los servicios necesarios.
   * @param servicio Servicio para obtener y establecer datos de la solicitud.
   * @param consultaQuery Servicio para consultar el estado de la solicitud.
   */
  constructor(
    private servicio: SolicitudeDeArtificiosPirotecnicosService,
    private consultaQuery: ConsultaioQuery,
    private tramite240308Store: Tramite240308Store,
    private tramite240308Query: Tramite240308Query,
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de la consulta y obtiene los datos si es necesario.
   */
  ngOnInit(): void {
    this.tramite240308Query.getTabSeleccionado$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((tab) => {
        this.indice = tab ?? 1;
      });
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
   * Updates the selected tab index in the store.
   *
   * @param i Index of the selected tab.
   * @returns {void}
   */
  public seleccionaTab(i: number): void {
    this.tramite240308Store.updateTabSeleccionado(i);
  }


  /**
   * Obtiene los datos de la bandeja de solicitudes desde el servicio y los establece.
   */
  obtenerDatosBandejaSolicitudes(): void {
    this.servicio.obtenerDatos()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((datos) => {
        if (datos) {
          this.servicio.establecerDatosDeLaSolicitud(datos);
          this.datosRespuestaDisponibles = true;
        }
      });
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Notifica a los observables para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}

