import { Component, OnDestroy, OnInit } from '@angular/core';

import { CATALOGOS_ID, ConsultaioState, base64ToHex, encodeToISO88591Hex } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Chofer40101Query } from '../../estado/chofer40101.query';

import { modificarTerrestreService } from '../../components/services/modificacar-terrestre.service';

import { BodyTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';

import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';

export interface Certificado {
  certSerialNumber: string;
  fechaFin: string; // ISO date string (e.g., "2013-03-26T18:29:59.000Z")
  firma: string;
  rfc: string;
}



@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Constante que contiene los textos utilizados en el componente.
   */
  TEXTOS: string = '';

  isSuccessCert: boolean = false
  acuseDocumentos: BodyTablaResolucion[] = [];

  /**
   * Lista de tipos de documentos disponibles para el trámite.
   */
  tiposDocumentos: Catalogo[] = [];

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

  cadenaOriginal = '';
  idSolicitud: number | undefined;
  /**
   * Notificador para gestionar la destrucción de suscripciones activas y evitar fugas de memoria.
   */
  private destroyNotifier$ = new Subject<void>();

  constructor(
    private catalogosServices: CatalogosService,
    private chofer40101Query: Chofer40101Query,
    private modificarTerrestreService: modificarTerrestreService,
    private NOTIF: NotificacionesService
  ) { }
  /**
   * 
Gancho del ciclo de vida angular que se llama después de que se inicializan las propiedades enlazadas a datos.
   */
  ngOnInit(): void {
   
    this.chofer40101Query
      .select()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
        if (state.cadena_original) {
          this.cadenaOriginal = state.cadena_original;
        }
        if (state.id_solicitud) {
          this.idSolicitud = state.id_solicitud;
        }
      });
  }



  /**
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
   */
  getDatosOfFirma(event: Certificado): void {
    const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginal);
    const FIRMAHEX = base64ToHex(event ? event.firma : '');
    this.idSolicitud = this.chofer40101Query.getValue().id_solicitud;
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
            urlPdf: res.datos?.documento_detalle?.nombre_archivo ?? '', // for display or download name
            fullBase64: res.datos?.documento_detalle?.contenido ?? '' // <--- backend base64 here
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
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
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
