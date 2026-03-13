import { Component, OnDestroy, OnInit } from '@angular/core';

import { Catalogo, ConsultaioState } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';

import { base64ToHex, encodeToISO88591Hex } from '@ng-mf/data-access-user';

import { Certificado } from '../../../40101/pages/paso-dos/paso-dos.component';
import { modificarTerrestreService } from '../../components/services/modificacar-terrestre.service';

import { Chofer40103Query } from '../../estados/chofer40103.query';

import { BodyTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Constante que contiene los textos utilizados en el componente.
   */
  /**
   * Constante que contiene los textos utilizados en el componente.
   */
  TEXTOS: string = '';

  banderaVista: string = ""

  acuseDocumentos: BodyTablaResolucion[] = [];
  guardarDatos: ConsultaioState = {
    folioTramite: '',
    procedureId: '',
    parameter: '',
    department: '',
    tipoDeTramite: '',
    estadoDeTramite: '',
    readonly: false,
    create: true,
    update: false,
    consultaioSolicitante: null,
    action_id: '',
    current_user: '',
    id_solicitud: '',
    nombre_pagina: '',
    idSolicitudSeleccionada: ''
  };

  isSuccessCert: boolean = false
  cadenaOriginal = '';
  idSolicitud: number | undefined;
  /**
   * Lista de tipos de documentos disponibles para el trámite.
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * Clase CSS utilizada para mostrar un mensaje de alerta informativa.
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo de documentos disponibles para el trámite.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Lista de documentos seleccionados por el usuario.
   */
  documentosSeleccionados: Catalogo[] = [];

  /**
   * Notificador para gestionar la destrucción de suscripciones activas y evitar fugas de memoria.
   */
  private destroyNotifier$ = new Subject<void>();

  constructor(private catalogosServices: CatalogosService, private modificarTerrestreService: modificarTerrestreService, private chofer40103Query: Chofer40103Query
    , private NOTIF: NotificacionesService
  ) { }
  /**
   * 
Gancho del ciclo de vida angular que se llama después de que se inicializan las propiedades enlazadas a datos.
   */
  ngOnInit(): void {
    
    this.cadenaOriginal = this.chofer40103Query.getValue().cadenaOriginal
  }

  /**
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
   */
 

  /**
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
   */
  getDatosOfFirma(event: Certificado): void {
    const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginal);
    const FIRMAHEX = base64ToHex(event ? event.firma : '');
    this.idSolicitud = Number(this.chofer40103Query.getValue().solicitudeId);
    this.modificarTerrestreService.firmaDatos({
      cadena_original: CADENAHEX,
      sello: FIRMAHEX,
      certificate_serial_number: event ? event.certSerialNumber : '',
      solicitudId: this.idSolicitud ? this.idSolicitud.toString() : ''
    }).subscribe((res) => {
      if (res.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: res.mensaje ? res.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      }
      if (Number(res.codigo) === 0) {
        this.acuseDocumentos = [
          {
            id: 1,
            idDocumento: res.datos?.cve_folio_caat ?? '',
            documento: res.datos?.documento_detalle?.nombre_archivo ?? '',
            urlPdf: res.datos?.documento_detalle?.nombre_archivo ?? '', // para mostrar o descargar nombre
            fullBase64: res.datos?.documento_detalle?.contenido ?? '' // <--- Base64 del backend aquí
          }
        ];

        this.guardarDatos = {
          ...this.guardarDatos,
          folioTramite: res.datos?.mensaje ?? '',
          procedureId: (res.datos?.id_solicitud ?? 0).toString()
        };
        this.isSuccessCert = true
        this.TEXTOS = res?.datos?.mensaje ?? ''
      }
    });
  }


  /**
   * Gancho del ciclo de vida angular que se llama antes de que se destruya el componente.
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}