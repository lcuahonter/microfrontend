import {
  BodyTablaAcuses,
  BodyTablaResolucion,
  HeaderTablaAcuses,
  HeaderTablaResolucion,
} from '../../../../core/models/shared/consulta-generica.model';
import {
  CONSULTA_ACUSES,
  CONSULTA_RESOLUCIONES,
} from '../../../../core/enums/consulta-generica.enum';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AcuseDetalleService } from '../../../../core/services/shared/detalleAcuse.service';
import { AcusesResolucionResponse } from '../../../../core/models/shared/consulta-acuses-response.model';
import { AcusesService } from '../../../../core/services/consultagenerica/acuses-service';
import { CommonModule } from '@angular/common';
import { ResolucionesService } from '../../../../core/services/consultagenerica/resoluciones-service';
import { Router } from '@angular/router';


@Component({
  selector: 'lib-bandeja-acuses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bandeja-acuses.component.html',
  styleUrl: './bandeja-acuses.component.scss',
})
export class BandejaAcusesComponent implements OnChanges, OnDestroy {
  /**
   * Título del componente.
   * @type {string}
   */
  @Input() titulo!: string;

  /**
   * Texto de alerta que se muestra en el componente.
   * @type {string}
   */
  @Input() txtAlerta!: string;

  /**
   * Lista de acuses de resolución.
   * @type {AcusesResolucionResponse[]}
   */
  @Input() acusesResolucion!: AcusesResolucionResponse;

  /**
   * Subtítulo del componente.
   * @type {string}
   */
  @Input() subtitulo!: string;

  /**
   * URL utilizada para realizar acciones relacionadas con el componente.
   * @type {string}
   */
  @Input() url!: string;

  /**
   * Encabezado de la tabla de acuses.
   * Contiene las columnas que se mostrarán en la tabla de acuses.
   * @type {HeaderTablaAcuses[]}
   */
  readonly encabezadoTablaAcuse: HeaderTablaAcuses[] = CONSULTA_ACUSES.encabezadoTablaAcuseSinDescarga;

  /**
   * Encabezado de la tabla de resoluciones.
   * Contiene las columnas que se mostrarán en la tabla de resoluciones.
   * @type {HeaderTablaResolucion[]}
   */
  readonly encabezadoTablaResolucion: HeaderTablaResolucion[] = CONSULTA_RESOLUCIONES.encabezadoTablaResolucion;

  /**
   * Datos de la tabla de acuses.
   * Contiene los registros que se mostrarán en la tabla de acuses.
   * @type {BodyTablaAcuses[]}
   */
  datosTablaAcuse: BodyTablaAcuses[] = [];

  /**
   * Datos de la tabla de resoluciones.
   * Contiene los registros que se mostrarán en la tabla de resoluciones.
   * @type {BodyTablaResolucion[]}
   */
  datosTablaResolucion: BodyTablaResolucion[] = [];

  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
   */
  public unsubscribe$ = new Subject<void>();

  /**
   * @property {number} tramite
   * @description Identificador del trámite asociado a las pestañas.
   */
  @Input() tramite!: number;


  constructor(
    private router: Router,
    private acusesService: AcusesService,
    private resolucionesService: ResolucionesService,
    private acuseDetalleService : AcuseDetalleService
  ) { }

  /**
   * Método que se ejecuta cuando uno o más inputs del componente cambian.
   *
   * @param changes - Objeto que contiene los cambios de los inputs del componente.
   * @returns void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['acusesResolucion'] && changes['acusesResolucion'].currentValue) {
      this.getAcuses();
      this.getResolucion();
    } 
  }
  /**
   * Método `ngOnDestroy()`.
   * Este método se ejecuta cuando el componente se destruye y realiza las siguientes acciones:
   * - Desuscribe la suscripción a los cambios en el formulario reactivo.
   *
   * @memberof AcusesResolucionesComponent
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Método para obtener los documentos desde el servicio.
   * unsubscribe$ - Subject para manejar la cancelación de suscripciones.
   * suscribe - Se suscribe al observable del servicio para obtener los datos.
   */
  getAcuses(): void {
    this.datosTablaAcuse = this.acusesResolucion.acuses.map((ac, index) => ({
      id: index + 1,
      idDocumento: ac.id_documento_oficial.toString(),
      documento: ac.desc_documento,
      urlPdf: ac.documento_minio ?? '',
    }));
  }

  /**
   * Método para obtener los documentos desde el servicio.
   * unsubscribe$ - Subject para manejar la cancelación de suscripciones.
   * suscribe - Se suscribe al observable del servicio para obtener los datos.
   */
  getResolucion(): void {
    this.datosTablaResolucion = this.acusesResolucion.documentos_oficiales.map((doc, index) => ({
      id: index + 1,
      idDocumento: doc.id_documento_oficial.toString(),
      documento: doc.desc_documento,
      urlPdf: doc.documento_minio ?? '',
    }));
  }

  /**
   * Abre un archivo PDF en una nueva pestaña del navegador.
   *
   * @param {string} url - La URL del archivo PDF que se va a abrir.
   * @returns {void}
   */
  descargarPdfAcuse(url: string): void {
    this.base64Archivos(url, 'descargar');
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
  this.acuseDetalleService.getDescargarAcuse(this.tramite, uuid).subscribe({
    next: (data) => {
      if (data?.codigo === "00" && data?.datos?.contenido) {
        BandejaAcusesComponent.manejarPdf(
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
   * Abre el detalle de una resolución en una nueva pestaña.
   * @param {string} url - La URL (UUID) del archivo PDF de la resolución.
   * @returns {void}
   * @example
   * // Abre el detalle de resolución
   * verDetalleResolucion('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
   */
  verDetalleResolucion(url: string): void {
   this.base64Archivos(url, 'abrir');
  }

  /**
   * Abre el detalle de un acuse en una nueva pestaña.
   * @param {string} url - La URL (UUID) del archivo PDF del acuse.
   * @returns {void}
   * @example
   * // Abre el detalle de acuse
   * verDetalleAcuse('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
   */
  verDetalleAcuse(url: string): void {
   this.base64Archivos(url, 'abrir');
  }
}
