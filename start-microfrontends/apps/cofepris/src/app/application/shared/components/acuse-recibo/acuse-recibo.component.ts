import { AlertComponent, ConsultaioState, NotificacionesComponent, TablaAcciones } from '@ng-mf/data-access-user';
import { AcuseDetalleService } from '@libs/shared/data-access-user/src/core/services/shared/detalleAcuse.service';

import { BodyTablaResolucion, HeaderTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { CONSULTA_RESOLUCIONES } from '@libs/shared/data-access-user/src/core/enums/consulta-generica.enum';
import { CommonModule } from '@angular/common';
import { ConfirmarNotificacionService } from '../../../core/services/confirmar-notificacion/confirmar-notificacion.service';

import { Component, Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';





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
   * Datos de la tabla de resoluciones.Indica si se deben mostrar docs de resoluciones. Opcional ejemplo en trámite 130102.
   */
  @Input() datosTablaResolucion?: BodyTablaResolucion[] = [];

  /**
   * Datos de la tabla de resoluciones.
   * Contiene los registros que se mostrarán en la tabla de resoluciones.
   * @type {BodyTablaResolucion[]}
  */
  @Input() datosTabla: BodyTablaResolucion[] = [];

  /**
   * 
   * @type {BodyTablaResolucion[]}
  */
  @Input() datosTablaAcuseNotificacion: BodyTablaResolucion[] = [];

  /**
   * @property {ConsultaioState} guardarDatos
   * @description Estado actual del trámite consultado.
  */
  @Input() guardarDatos!: ConsultaioState;

  /**
   * @property {string} banderaVista
   * @description Estado para saber estado de la vista.
  */
  @Input() banderaVista!: string;

  /**
   * Encabezado de la tabla de resoluciones.
   * Contiene las columnas que se mostrarán en la tabla de resoluciones.
   * @type {HeaderTablaResolucion[]}
  */
  readonly encabezadoTablaResolucion: HeaderTablaResolucion[] = CONSULTA_RESOLUCIONES.encabezadoTablaResolucion;
  
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
    private router: Router,
    private acuseDetalleService: AcuseDetalleService,
    private confirmarNotificacionService: ConfirmarNotificacionService,
  ) { }

  /**
   * @method ngOnInit
   * @description
   * Hook de inicialización del componente.
   * Obtiene los datos de Acuse de Recibo al inicializar el componente.
   *
   * @returns {void}
   */
  ngOnInit(): void {

      // if(this.banderaVista === "Resolucion"){
      //  this.alertaNotificacion = GENERARMENSAJERESOLUCION(this.guardarDatos.folioTramite);

      // }else{
      //   this.alertaNotificacion = GENERARMENSAJENOTIFICACION(this.guardarDatos.folioTramite);
      // }
      if(this.banderaVista === "Resolucion"){
      this.alertaNotificacion = `La notificación de la resolución para el trámite con número ${this.guardarDatos.folioTramite} ha sido confirmada.`
      } else if(this.banderaVista === "Requerimiento") {
        this.alertaNotificacion = `La notificación de Requerimiento de Información para el trámite con número ${this.guardarDatos.folioTramite} ha sido confirmada.`
      } else {
        this.alertaNotificacion = this.guardarDatos.folioTramite
      }
  }


  /**
   * Abre un archivo PDF en una nueva pestaña del navegador.
   *
   * @param {string} url - La URL del archivo PDF que se va a abrir.
   * @returns {void}
   */
  descargarPdfResolucion(url: string): void {
    this.base64Archivos(url, 'descargar');
  }

  /**
   * Obtiene el contenido base64 de un archivo y realiza la acción especificada.
   * @param {string} uuid - Identificador único del archivo a obtener.
   * @param {'abrir' | 'descargar'} accion - Acción a realizar con el archivo.
   * @returns {void}
   * @example
   * // Abre el archivo en una nueva pestaña
   * base64Archivos('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'abrir');
   * 
   * // Descarga el archivo
   * base64Archivos('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'descargar');
   */
  base64Archivos(uuid: string, accion: 'abrir' | 'descargar'): void {
    this.acuseDetalleService.getDescargarAcuse(Number(this.guardarDatos.procedureId), uuid).subscribe({
      next: (data) => {
        if (data?.codigo === "00" && data?.datos?.contenido) {
          AcuseReciboComponent.manejarPdf(
            data.datos.contenido,
            data.datos.nombre_archivo,
            accion
          );
        }
      },
    });
  }

  /**
  * Método genérico para manejar un PDF en base64.
  *
  * @param base64 Contenido del PDF en base64.
  * @param nombreArchivo Nombre del archivo a descargar (si aplica).
  * @param accion 'abrir' para abrir en pestaña o 'descargar' para forzar descarga.
  */
  static manejarPdf(base64: string, nombreArchivo: string, accion: 'abrir' | 'descargar'): void {
    // Decodificar el base64
    const BYTE_CHARACTERS = atob(base64);
    const BYTE_NUMBERS = new Array(BYTE_CHARACTERS.length);
    for (let i = 0; i < BYTE_CHARACTERS.length; i++) {
      BYTE_NUMBERS[i] = BYTE_CHARACTERS.charCodeAt(i);
    }
    const BYTE_ARRAY = new Uint8Array(BYTE_NUMBERS);

    // Crear el Blob y la URL
    const BLOB = new Blob([BYTE_ARRAY], { type: 'application/pdf' });
    const URLCODIFICADA = URL.createObjectURL(BLOB);

    if (accion === 'abrir') {
      window.open(URLCODIFICADA, '_blank');
    } else {
      const LINK = document.createElement('a');
      LINK.href = URLCODIFICADA;
      LINK.download = nombreArchivo.endsWith('.pdf') ? nombreArchivo : `${nombreArchivo}.pdf`;
      LINK.click();
      URL.revokeObjectURL(URLCODIFICADA);
    }
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