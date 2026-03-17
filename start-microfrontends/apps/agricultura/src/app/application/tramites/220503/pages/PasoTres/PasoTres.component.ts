import { CategoriaMensaje, ConsultaioState, DocumentoService, DocumentosFirmaQuery, DocumentosFirmaStore,FirmaElectronicaComponent, Notificacion, base64ToHex,encodeToISO88591Hex } from '@ng-mf/data-access-user';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DocumentoRequeridoFirmar, FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { Subject, catchError, map, switchMap, take, takeUntil } from 'rxjs';
import { AcuseReciboComponent } from "../../../../shared/components/acuse-recibo/acuse-recibo.component";
import { BodyTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { CommonModule } from '@angular/common';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { Router } from '@angular/router';
import { Solicitud220503Query } from '../../estados/tramites220503.query';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { TramiteAgriState } from '../../../../estados/tramites/tramite220503.store';
import { TramiteFolioService } from '@libs/shared/data-access-user/src';
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent, AcuseReciboComponent],
  templateUrl: './PasoTres.component.html',
})
export class PasoTresComponent implements OnDestroy, OnInit {
  /**
   * Tipo de persona, puede ser un valor numérico que se asigna según la acción.
   */
  tipoPersona!: number;

    isSuccessCert: boolean = false
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
   * Array que almacena las cadenas originales de los documentos que requieren firma.
   */
  public cadenasOriginalesDocumentos: string[] = [];

    
  
  private destroy$: Subject<void> = new Subject<void>(); // Sujeto para manejar el ciclo de vida del componente y evitar fugas de memoria

  /**
   * Constructor que inyecta los servicios necesarios para el funcionamiento del componente.
   * @param router Servicio de enrutamiento para navegar entre rutas.
   * @param serviciosExtraordinariosServices Servicio para obtener información del trámite.
   * @param tramiteStore Almacén de estado del trámite para gestionar los datos del trámite.
   */
  constructor(
    private router: Router,
    private documentosFirmaQuery: DocumentosFirmaQuery,
    private serviciosExtraordinariosServices: TramiteFolioService,
     private documentosFirmaStore: DocumentosFirmaStore,
     private documentoService: DocumentoService,
    private solicitud220503Query: Solicitud220503Query,
     private NOTIF: NotificacionesService,
    private solicitudPantallasService: SolicitudPantallasService,
    @Inject(TramiteAgriState) private tramiteStore: TramiteAgriState
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  ngOnInit(): void{
      this.documentosFirmaQuery.documentos$
        .pipe(takeUntil(this.destroy$))
        .subscribe((docs) => {
          this.documentosFirma = docs;
          this.cadenasOriginalesDocumentos = docs.map(d => d.hash_documento);
        });
   this.idSolicitud = this.solicitud220503Query.getValue().id_solicitud.toString();
    this.num_autorizacion = String(this.solicitud220503Query.getValue().certificadosAutorizados) 

   // Obtener la cadena original al iniciar el componente\
    this.getCadenaOriginal()
  }
  /**
   * Método que obtiene el tipo de persona y lo asigna a la propiedad 'tipoPersona'.
   * @param tipo Tipo de persona que se obtiene como parámetro.
   */
  obtenerTipoPersona(tipo: number): void {
    this.tipoPersona = tipo; // Asigna el tipo de persona al campo correspondiente
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

      /** Lista de documentos que requieren firma electrónica.
       * Esta lista se obtiene del store `DocumentosFirmaStore` a través del query `DocumentosFirmaQuery`.
       * Se utiliza para mostrar los documentos al usuario y procesar la firma de cada uno.
       */
      public documentosFirma: DocumentoRequeridoFirmar[] = [];
  
            /**
             * Notificación que se muestra al usuario en caso de error o éxito en el proceso de firma.
             * Incluye información sobre el tipo de notificación, categoría, título y mensaje.
             */
            nuevaNotificacion!: Notificacion;
            procedure: number = 220502;
            idSolicitud:string|null=null
            num_autorizacion:string=''
      

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
          num_autorizacion:   this.num_autorizacion ,
           sello: FIRMAHEX,
           documentos_requeridos:
            this.documentosFirma ??
            response.datos?.documentos_requeridos ??
            [],
         };
       return this.solicitudPantallasService.firmaDatos(
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
   * Método de ciclo de vida para limpiar los recursos cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    /**
     * Emite una señal de destrucción para notificar a los observadores que el flujo está finalizando.
     * Esto ayuda a cerrar correctamente cualquier suscripción activa.
     */
    this.destroy$.next();

    /**
     * Completa el flujo del `Subject`, asegurando que no se envíen más valores
     * y evitando posibles fugas de memoria.
     */
    this.destroy$.complete();
  }
/**
 * Obtiene la cadena original del trámite.
 */
   getCadenaOriginal(): void {
  
    // Construir payload con documentos mapeados
    const PAYLOAD = {
      documentos_requeridos: this.documentosFirma?.map((doc) => ({
        id_documento_seleccionado: doc.id_documento_seleccionado,
      })) ?? []
    };
  
    // Llamada al servicio POST
    this.solicitudPantallasService
      .generaCadenaOriginal('220503', this.idSolicitud??'', PAYLOAD)
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
  
}
