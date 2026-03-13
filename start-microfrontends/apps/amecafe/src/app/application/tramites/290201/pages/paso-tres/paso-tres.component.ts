/**
 * PasoTresComponent
 * */
import { Catalogo,CategoriaMensaje,ConsultaioState, FirmaElectronicaComponent ,Notificacion,base64ToHex, encodeToISO88591Hex,} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AcuseReciboComponent } from "../../../../shared/acuse-recibo/acuse-recibo.component";
import { BodyTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { CommonModule } from '@angular/common';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { Router } from '@angular/router';

import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';

import { FirmaDatosRequest, RegistrarSolicitudService } from '../../services/registrar-solicitud.service';
import { Solicitud290201Query } from '../../../../estados/queries/tramites290201.query';


export interface Certificado {
  certSerialNumber: string;
  fechaFin: string; 
  firma: string;
  rfc: string;
}
interface DocumentoDetalle {
  llave_archivo?: string;
  nombre_archivo?: string;
  contenido?: string;
}
/**
 * PasoTresComponent
 * @nombre PasoTresComponent
 * @descripcion Componente que representa el tercer paso de un proceso. 
 * Este componente maneja la firma electrónica y redirige a otra página cuando se obtiene la firma.
 */

@Component({
  selector: 'app-paso-tres',
  standalone: true, 
  imports: [
    CommonModule,
    FirmaElectronicaComponent,
    AcuseReciboComponent
],
  templateUrl: './paso-tres.component.html', 
})
export class PasoTresComponent implements OnInit, OnDestroy {
  
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
       * Notificación que se muestra al usuario en caso de error o éxito en el proceso de firma.
       * Incluye información sobre el tipo de notificación, categoría, título y mensaje.
       */
      nuevaNotificacion!: Notificacion;

  /**
   * Clase CSS utilizada para mostrar un mensaje de alerta informativa.
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo de documentos disponibles para el trámite.
   */
  catalogoDocumentos: Catalogo[] = [];
    /** Sujeto para manejar la destrucción del componente */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Lista de documentos seleccionados por el usuario.
   */
  documentosSeleccionados: Catalogo[] = [];

  /**
   * Notificador para gestionar la destrucción de suscripciones activas y evitar fugas de memoria.
   */
  private destroyNotifier$ = new Subject<void>();

  constructor( private registrarsolicitud: RegistrarSolicitudService
    , private NOTIF: NotificacionesService,
     private solicitud290201Query: Solicitud290201Query
  ) { }
  /**
   * 
Gancho del ciclo de vida angular que se llama después de que se inicializan las propiedades enlazadas a datos.
   */
  ngOnInit(): void {
    
   this.getCadenaOriginal()
  }

getDatosOfFirma(event: Certificado): void {
  // Convertir la cadena original a HEX ISO-8859-1
  const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginal);

  // Convertir la firma Base64 a HEX
  const FIRMAHEX = base64ToHex(event?.firma ?? '');

  // Obtener el ID de la solicitud del store
  this.idSolicitud = Number(this.solicitud290201Query.getValue().id_solicitud);

  // Crear payload completo para la firma
  const PAYLOAD: FirmaDatosRequest = {
    id_solicitud: this.idSolicitud,
    cadena_original: CADENAHEX,
    cert_serial_number: event?.certSerialNumber ?? '',
    sello: FIRMAHEX,
    num_autorizacion: '',
    documentos_requeridos: [],
  };

  // Llamar al servicio para firmar el certificado
  this.registrarsolicitud
    .firmarCertificado(PAYLOAD)
    .pipe(takeUntil(this.destroyed$))
    .subscribe({
      next: (res) => {
        if (res.codigo !== '00') {
          this.NOTIF.showNotification({
            tipoNotificacion: 'toastr',
            categoria: 'danger',
            mensaje: res.mensaje ?? '',
            titulo: 'Error',
            modo: '',
            cerrar: true,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: 'Cancelar',
          });
          return;
        }

        // Normalizar documento_detalle (objeto o arreglo)
        const DOCUMENTODETAIL = res.datos?.documento_detalle;

        const DOCUMENTOS: DocumentoDetalle[] = Array.isArray(DOCUMENTODETAIL)
          ? DOCUMENTODETAIL
          : DOCUMENTODETAIL
          ? [DOCUMENTODETAIL]
          : [];

        // Mapear documentos
        this.acuseDocumentos = DOCUMENTOS.map((doc, index) => ({
          id: index + 1,
          idDocumento: res.datos?.cve_folio_caat ?? '',
          documento: doc.nombre_archivo ?? '',
          urlPdf: doc.nombre_archivo ?? '',
          fullBase64: doc.contenido ?? '',
        }));

        // Guardar información de la firma
        this.guardarDatos = {
          ...this.guardarDatos,
          folioTramite: res.datos?.mensaje ?? '',
          procedureId: (res.datos?.id_solicitud ?? 0).toString(),
        };

        this.isSuccessCert = true;
        this.TEXTOS = res.datos?.mensaje ?? '';
      },
      error: (err) => {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: err?.message ?? 'Error desconocido',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      },
    });
}


  /**
 * Generates the original signature string (cadena original) for the selected documents.
 * It builds the payload from `documentosFirma`, calls the service, and assigns the result
 * to `this.cadenaOriginal`. In case of an error, it sets `this.nuevaNotificacion` with details.
 */
 getCadenaOriginal(): void {

  // Construir payload con documentos mapeados
  const PAYLOAD = {
 "num_folio_tramite": "",
  "documento_requerido": [
  ]
  };

  // Llamada al servicio POST
  this.registrarsolicitud
    .generaCadenaOriginalSolicitud('290201', Number(this.solicitud290201Query.getValue().id_solicitud)??'', PAYLOAD)
    .pipe(take(1))
    .subscribe({
      next: (res) => {

        if (!res || res.codigo !== '00') {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: 'Unexpected Error',
            mensaje:
              res?.mensaje ||

              'An unexpected error occurred during signature.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          return;
        }
        this.cadenaOriginal = res.datos?? '';
      },

      error: (err) => {
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: CategoriaMensaje.ERROR,
          modo: 'action',
          titulo: 'Unexpected Error',
          mensaje:
            err?.mensajeUsuario ||
            err?.error?.error ||
            'An unexpected error occurred during signature.',
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        };
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
