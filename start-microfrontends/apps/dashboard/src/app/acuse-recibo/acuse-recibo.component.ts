import { ACUSE_CONFIRMAR_NOTIFICACION_REQUERIMIENTO_ENCABEZADO_DE_TABLA, AcuseNotificacionRequerimiento, CONFIRMAR_NOTIFICACION_ALERT, CONFIRMAR_NOTIFICACION_RESOLUCION_ALERT } from '../constants/confirmar-notificacion.enum';
import { AlertComponent, NotificacionesComponent, TablaAcciones } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmarNotificacionService } from '../services/confirmar-notificacion.service';
import { Documento } from '../models/confirmar-notificacion.model';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { takeUntil } from 'rxjs';

/**
 * @component AcuseReciboComponent
 * @description
 * Componente encargado de mostrar los documentos correspondientes al Acuse de Recibo en una tabla dinámica.
 * Permite acciones como ver y descargar documentos.
 *
 * @example
 * <app-acuse-recibo></app-acuse-recibo>
 */
@Component({
  selector: 'app-acuse-recibo',
  standalone: true,
  imports: [CommonModule, TituloComponent, TablaDinamicaComponent, NotificacionesComponent, AlertComponent],
  templateUrl: './acuse-recibo.component.html',
  styleUrl: './acuse-recibo.component.scss',
})
export class AcuseReciboComponent implements OnInit, OnDestroy {
  /**
   * @property unsubscribe$
   * @description
   * Subject utilizado para gestionar la desuscripción de observables y prevenir fugas de memoria.
   * Se completa en `ngOnDestroy()`.
   *
   * @private
   * @type {Subject<void>}
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * @property acciones
   * @description
   * Acciones permitidas en la tabla del Acuse de Recibo (Ver, Descargar).
   *
   * @type {TablaAcciones[]}
   */
  public acciones: TablaAcciones[] = [
    TablaAcciones.VER,
    TablaAcciones.DESCARGAR,
  ];

  /**
   * Lista de acciones disponibles para el acuse de recibo.
   * 
   * Esta propiedad contiene las acciones que pueden realizarse en la tabla de acuse de recibo.
   * Inicialmente, solo se permite la acción de "VER".
   *
   * @type {TablaAcciones[]}
   */
  public acuseAcciones: TablaAcciones[] = [
    TablaAcciones.VER,
    TablaAcciones.DESCARGAR
  ];

  /**
   * @property acuseReciboTablaDatos
   * @description
   * Arreglo que almacena los datos del Acuse de Recibo obtenidos desde el servicio.
   *
   * @type {Documento[]}
   */
  public acuseReciboTablaDatos: Documento[] = [];
  
  /**
   * Almacena los datos de la tabla de confirmación de resolución de acuses de requerimiento.
   * Cada elemento representa un requerimiento con su respectiva resolución.
   * 
   * @type {AcuseNotificacionRequerimiento[]}
   */
  public acuseConfirmarResolucionTablaDatos: AcuseNotificacionRequerimiento[] = [];

  /**
   * Arreglo que almacena los datos de las resoluciones confirmadas para la tabla de requerimientos.
   * Cada elemento representa una instancia de `AcuseNotificacionRequerimiento`.
   */
  public resolucionConfirmarResolucionTablaDatos: AcuseNotificacionRequerimiento[] = [];
  
  /**
   * Representa el nombre de la pantalla actual que se está mostrando en el componente.
   * Puede ser utilizado para controlar la lógica de navegación o visualización de la interfaz.
   */
  public pantalla: string = '';

  /**
   * @property {string} infoAlert
   * Clase CSS usada para mostrar alertas informativas.
   */
  public infoAlert = 'alert-info';

  /**
   * @property alertaNotificacion
   * @description
   * Mensaje de alerta para la notificación.
   */
  public alertaNotificacion: string = '';

  /**
   * @property tablaConfiguracion
   * @description
   * Configuración de la tabla dinámica que muestra los documentos de Acuse de Recibo.
   * Define encabezados y acciones disponibles.
   */
  public tablaConfiguracion = {
    configuracionTabla: ACUSE_CONFIRMAR_NOTIFICACION_REQUERIMIENTO_ENCABEZADO_DE_TABLA,
    acciones: this.acciones,
    acuseAcciones: this.acuseAcciones,
    resolucionAcciones: this.acuseAcciones,
  };

  /**
   * @constructor
   * @param {ConfirmarNotificacionService} confirmarNotificacionService - Servicio para obtener datos de Acuse de Recibo.
   */
  /**
   * Crea una instancia del componente AcuseRecibo.
   * 
   * @param confirmarNotificacionService Servicio para confirmar notificaciones.
   * @param router Servicio de enrutamiento para navegar entre vistas.
   */
  constructor(
    private confirmarNotificacionService: ConfirmarNotificacionService,
    private router: Router
  ) {}

  /**
   * @method ngOnInit
   * @description
   * Hook de inicialización del componente.
   * Obtiene los datos de Acuse de Recibo al inicializar el componente.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.pantalla = this.router?.url === '/confirmar-resolucion' ? 'confirmar-resolucion' : 'confirmar-notificacion';
    this.alertaNotificacion = this.pantalla === 'confirmar-notificacion' ? CONFIRMAR_NOTIFICACION_ALERT : CONFIRMAR_NOTIFICACION_RESOLUCION_ALERT;
    this.confirmarNotificacionService
      .getAcuseConfirmarResolucionTablaDatos()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: AcuseNotificacionRequerimiento[]) => {
        this.acuseConfirmarResolucionTablaDatos = data;
    });

    this.confirmarNotificacionService
      .getResolucionConfirmarResolucionTablaDatos()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: AcuseNotificacionRequerimiento[]) => {
        this.resolucionConfirmarResolucionTablaDatos = data;
    });
  }

  /**
   * @method ngOnDestroy
   * @description
   * Hook de destrucción del componente.
   * Libera recursos completando el observable `unsubscribe$`.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
