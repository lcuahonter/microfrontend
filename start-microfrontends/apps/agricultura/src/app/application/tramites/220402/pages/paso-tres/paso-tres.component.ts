import {CategoriaMensaje, ConsultaioState, DocumentoService, DocumentosFirmaQuery, DocumentosFirmaStore, FirmaElectronicaComponent,Notificacion,base64ToHex, encodeToISO88591Hex} from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import { DocumentoRequeridoFirmar,FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import { AcuseReciboComponent } from '../../../../shared/components/acuse-recibo/acuse-recibo.component';
import { BodyTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { CommonModule } from '@angular/common';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { Router } from '@angular/router';
import { Solicitud220402Query } from '../../estados/queries/tramites220402.query';

/**
 * Componente para mostrar el subtítulo del asistente.
 * @component PasoTresComponent
 * @selector app-paso-tres
 * @templateUrl ./paso-tres.component.html
 * @styleUrls ./paso-tres.component.scss --220201
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
   imports: [CommonModule, FirmaElectronicaComponent, AcuseReciboComponent],
  templateUrl: './paso-tres.component.html',
  styleUrls: ['./paso-tres.component.scss']
})
export class PasoTresComponent implements OnInit {
  /**
   * @constructor
   * @description
   * Constructor que inyecta `Router` para la navegación.
   *
   * @param {Router} router - Servicio de Angular para manejar la navegación.
   * @access public
   */
    isSuccessCert: boolean = false;
  /**
  * Cadena original generada a partir de los datos del trámite.
  * Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
  */
  cadenaOriginal?: string;
     /**
   * Constante que contiene los textos utilizados en el componente.
   */
  TEXTOS: string = '';

    /**
 * Objeto que contiene los datos reales de la firma electrónica generada después del proceso de firma.
 * Incluye:
 * - firma: Cadena de la firma generada (en base64).
 * - certSerialNumber: Número de serie del certificado digital.
 * - rfc: RFC extraído del certificado.
 * - fechaFin: Fecha de vencimiento del certificado.
 */
  datosFirmaReales!: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  };
   /**
     * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
     * Se utiliza para completar el observable cuando el componente se destruye.
     */
      private destroy$ = new Subject<void>();
      /** Lista de documentos que requieren firma electrónica.
       * Esta lista se obtiene del store `DocumentosFirmaStore` a través del query `DocumentosFirmaQuery`.
       * Se utiliza para mostrar los documentos al usuario y procesar la firma de cada uno.
       */
      public documentosFirma: DocumentoRequeridoFirmar[] = [];
    /**
   * Array que almacena las cadenas originales de los documentos que requieren firma.
   */
  public cadenasOriginalesDocumentos: string[] = [];


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

      nuevaNotificacion!: Notificacion;
          procedure: number = 220502;
          idSolicitud:string|null=null

      acuseDocumentos: BodyTablaResolucion[] = [];
  constructor(
    private router: Router,
     private documentoService: DocumentoService,
     private documentosFirmaStore: DocumentosFirmaStore, 
     private documentosFirmaQuery: DocumentosFirmaQuery,
      private solicitud220402Query: Solicitud220402Query,
      private MediodetransporteService: MediodetransporteService,
                  private NOTIF: NotificacionesService,
    ) {
    }

   ngOnInit(): void{
        this.documentosFirmaQuery.documentos$
          .pipe(takeUntil(this.destroy$))
          .subscribe((docs) => {
            this.documentosFirma = docs;
            this.cadenasOriginalesDocumentos = docs.map(d => d.hash_documento);
          });
     this.idSolicitud = this.solicitud220402Query.getValue().idSolicitud?.toString()??null
  
     // Obtener la cadena original al iniciar el componente\
      this.getCadenaOriginal()
    }
    

  
    /**
 * Maneja el evento de firma y obtiene los datos de la firma.
 * @param datos - Objeto que contiene la firma, número de serie del certificado y RFC.
 */
  datosFirma(datos: {
    firma: string;
    certSerialNumber: string;
    rfc: string;
    fechaFin: string;
  }): void {
    this.datosFirmaReales = datos;
    this.obtieneFirma(datos.firma);
  }



  /**
   * Generates the original signature string (cadena original) for the selected documents.
   * It builds the payload from `documentosFirma`, calls the service, and assigns the result
   * to `this.cadenaOriginal`. In case of an error, it sets `this.nuevaNotificacion` with details.
   */
   getCadenaOriginal(): void {
  
    // Construir payload con documentos mapeados
    const PAYLOAD = {
      documentos_requeridos: this.documentosFirma?.map((doc) => ({
        id_documento_seleccionado: doc.id_documento_seleccionado,
      })) ?? []
    };
  
    // Llamada al servicio POST
    this.MediodetransporteService
      .generaCadenaOriginal('220402', this.idSolicitud??'', PAYLOAD)
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
    * Método para obtener la firma y navegar a la página de acuse.
    * @param ev Firma obtenida.
    */
 obtieneFirma(firma: string): void {
   if (!this.cadenaOriginal || !this.datosFirmaReales) {
     this.nuevaNotificacion = {
       tipoNotificacion: 'toastr',
       categoria: CategoriaMensaje.ERROR,
       modo: 'action',
       titulo: 'Error',
       mensaje: 'Missing data needed to complete the signature.',
       cerrar: false,
       txtBtnAceptar: '',
       txtBtnCancelar: '',
     };
     return;
   }
 
   const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginal);
   const FIRMAHEX = base64ToHex(firma);
 
   this.documentoService
     .obtenerDatosFirma<FirmarRequest>()
     .pipe(
       takeUntil(this.destroy$),
 
       switchMap((response) => {
         const PAYLOAD= {
             id_solicitud: Number(this.idSolicitud),
           cadena_original: CADENAHEX,
           cert_serial_number: this.datosFirmaReales.certSerialNumber,
            sello: FIRMAHEX,
            documentos_requeridos:
             this.documentosFirma ??
             response.datos?.documentos_requeridos ??
             [],
          };
        return this.MediodetransporteService.firmaDatos(
           PAYLOAD,
 );
       })
     )
 
     .subscribe({
       next: (res) => {
         if (!res) 
           {return
           }
 
         if (res.codigo !== '00') {
           this.NOTIF.showNotification({
             tipoNotificacion: 'toastr',
             categoria: 'danger',
             mensaje: res.mensaje ?? '',
             titulo: 'Error',
             modo: '',
             cerrar: true,
             txtBtnAceptar: 'Accept',
             txtBtnCancelar: 'Cancel',
           });
           return;
         }
 
         this.acuseDocumentos = [
           {
             id: 1,
             idDocumento: res.datos?.cve_folio_caat ?? '',
             documento: res.datos?.documento_detalle?.nombre_archivo ?? '',
             urlPdf: res.datos?.documento_detalle?.nombre_archivo ?? '',
             fullBase64: res.datos?.documento_detalle?.contenido ?? '',
           },
         ];
 
         this.guardarDatos = {
           ...this.guardarDatos,
           folioTramite: res.datos?.mensaje ?? '',
           procedureId: (res.datos?.id_solicitud ?? 0).toString(),
         };
 
         this.isSuccessCert = true;
         this.TEXTOS = res?.datos?.mensaje ?? '';
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
       },
     });
 }
 

  /**
       * Maneja los documentos firmados y actualiza el store con los sellos correspondientes.
       * @param sellos - Array de cadenas que representan los sellos de los documentos firmados.
       */
      onDocumentosFirmados(sellos: string[]): void {
        // Mezclas los sellos con los documentos de Akita
        const DOCUMENTOS = this.documentosFirma.map((doc, i) => ({
          ...doc,
          hash_documento: encodeToISO88591Hex(doc.hash_documento),
          sello_documento: base64ToHex(sellos[i] || '')
        }));
    
        this.documentosFirmaStore.update({ documentos: DOCUMENTOS });
      }
  

}