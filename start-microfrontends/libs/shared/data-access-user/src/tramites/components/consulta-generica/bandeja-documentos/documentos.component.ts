import { BodyTablaDocumentos, HeaderTablaDocumentos } from '../../../../core/models/shared/consulta-generica.model';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

import { CONSULTA_DOCUMENTOS } from '../../../../core/enums/consulta-generica.enum';
import { CommonModule } from '@angular/common';
import { DocumentosService } from '../../../../core/services/consultagenerica/bandeja-documentos-service';


import { DocumentoSolicitud } from '../../../../core/models/shared/consulta-documentos-response.model';
import { DocumentosTabsService } from '@libs/shared/data-access-user/src/core/services/shared/documentosTabs.service';
import { formatFechaServicioToDDMMYYYY } from '@libs/shared/data-access-user/src/core/utils/utilerias';

@Component({
  selector: 'lib-documentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss',
})
export class DocumentosComponent implements OnChanges , OnDestroy {  
  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
   */
  public unsubscribe$ = new Subject<void>();

  /**
   * @property {DocumentoSolicitud[]} documentos
   * @description Documentos de solicitud.
   */
  @Input() documentos: DocumentoSolicitud[] = [];

  /**
   * Encabezado de la tabla de documentos.
   * Contiene las columnas que se mostrarán en la tabla.
   * @type {HeaderTablaDocumentos[]}
   */
  readonly encabezadoTablaDocumentos: HeaderTablaDocumentos[] = CONSULTA_DOCUMENTOS.encabezadoTablaDocumento;

  /**
   * Datos de la tabla de documentos.
   * Contiene los registros que se mostrarán en la tabla.
   * @type {BodyTablaDocumentos[]}
   */
  public datosTablaDocumentos: BodyTablaDocumentos[] = [];

  /**
   * URL del archivo PDF que se va a abrir.
   * @type {string}
   */
  public verPdf = DocumentosComponent.verPdf;

  /**
   * URL del archivo PDF que se va a descargar.
   * @type {string}
   */
  public descargarPdf = DocumentosComponent.descargarPdf;

  /**
   * Constructor de la clase DocumentosComponent.
   * @param documentosService Servicio para obtener los documentos.
   */
  constructor(
    private documentosService: DocumentosService,
    private documentosTabsService: DocumentosTabsService
    ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al observable del servicio para obtener los datos.
   * @returns {void}
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentos'] && changes['documentos'].currentValue?.length > 0) {
      this.getDocumentos();
    }
  }

  /**
   * Abre una nueva pestaña del navegador para ver los detalles del documento.
   * @param {string} url - La URL del archivo PDF que se va a abrir.
   * @returns {void}
   */
  static verPdf(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Permite descargar un documento.
   * @param {string} url - La URL del archivo PDF que se va a descargar.
   * @returns {void}
   */
  static descargarPdf(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Método para obtener los documentos desde el servicio.
   * Se suscribe al observable del servicio para obtener los datos.
   * @returns {void}
   */
  getDocumentos(): void {
     this.datosTablaDocumentos = this.documentos.map((doc) => ({
      tipoDocumento: doc.documento.tipo_documento,
      estatus: doc.estado_documento_solicitud,
      fechaAdjunto: formatFechaServicioToDDMMYYYY(doc.fecha_asociacion),
      nombreArchivo: doc.documento.nombre,
      urlPdf: doc.documento_uuid
    }));
  }

   /**
   * Abre el detalle de un acuse en una nueva pestaña.
   * @param {string} url - La URL (UUID) del archivo PDF del acuse.
   * @returns {void}
   * @example
   * // Abre el detalle de acuse
   * verDetalleAcuse('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
   */
  verDetalleAcuse(url: string, nombre: string): void {
   this.base64Archivos(url, 'abrir', nombre);
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
  base64Archivos(uuid: string, accion: 'abrir' | 'descargar', nombre: string): void {
  this.documentosTabsService.getDescargarDoc(uuid).subscribe({
    next: (data) => {
      if (data?.codigo === "UPSER00" && data?.datos?.content) {
        DocumentosComponent.manejarPdf(
          data.datos.content,
          nombre, 
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
   * Abre un archivo PDF en una nueva pestaña del navegador.
   *
   * @param {string} url - La URL del archivo PDF que se va a abrir.
   * @returns {void}
   */
  descargarPdfAcuse(url: string, nombre: string): void {
    this.base64Archivos(url, 'descargar', nombre);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}