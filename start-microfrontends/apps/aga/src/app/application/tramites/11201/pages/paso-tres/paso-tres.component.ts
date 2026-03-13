import { CommonModule } from '@angular/common';

import { FirmaElectronicaComponent ,formatFecha } from '@libs/shared/data-access-user/src';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { Router } from '@angular/router';

import { CadenaOriginal11201Service } from '../../services/cadena-original.service';
import { CadenaOriginalRequest } from '../../model/request/cadena-original-request.model';
import { CadenaOriginalService } from '@libs/shared/data-access-user/src/core/services/shared/cadena-original/cadena-original.service';

import { Subject, catchError, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { Firma11201Service } from '../../services/firma11201.service';

import { CategoriaMensaje, DocumentoService, Notificacion, NotificacionesComponent, TramiteFolioQueries, TramiteFolioStore, base64ToHex, encodeToISO88591Hex } from '@libs/shared/data-access-user/src';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { Solicitud11201State } from '../../estados/tramites/tramite11201.store';
import { Tramite11201Query } from '../../estados/queries/tramite11201.query';

import { DocumentosQuery } from '@libs/shared/data-access-user/src/core/queries/documentos.query';
import { DocumentosState } from '@libs/shared/data-access-user/src/core/estados/documentos.store';


/**
 * Componente para el paso tres del trámite 301.
 * Este componente se utiliza para mostrar los pasos del asistente - 301
 * Lista de pasos
 * Índice del paso
 */
@Component({
  selector: 'paso-tres',
  standalone: true,
  templateUrl: './paso-tres.component.html',
  imports: [FirmaElectronicaComponent, CommonModule, NotificacionesComponent],
})
export class PasoTresComponent implements OnInit, OnDestroy {

  /**
 * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
 * Se utiliza para completar el observable cuando el componente se destruye.
 */
  private destroy$ = new Subject<void>();

  /**
  * URL del servicio o endpoint al que se realizará la solicitud relacionada con la firma.
  * Puede ser utilizado para enviar la firma generada o para obtener la cadena original.
  */
  url: string = '';

  /**
  * Cadena original generada a partir de los datos del trámite.
  * Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
  */
  cadenaOriginal?: string;

  /**
   * Folio del trámite que se está procesando.
   * Este folio es único para cada trámite y se utiliza para identificarlo en el sistema.
   */
  folio!: string;

  /**
   * Objeto que contiene los datos necesarios para generar la cadena original.
   * Este objeto es enviado al servicio de firma electrónica para obtener la cadena original.
   */
  datosCadena!: CadenaOriginalRequest;

  /**
   * Objeto que contiene el estado de la solicitud del trámite.
   * Este objeto es utilizado para gestionar el estado del trámite en la aplicación.
   */
  public solicitudState!: Solicitud11201State;

  /**
   * Notificación que se muestra al usuario en caso de error o éxito en el proceso de firma.
   * Incluye información sobre el tipo de notificación, categoría, título y mensaje.
   */
  nuevaNotificacion!: Notificacion;

  /**
   * Estado de los documentos relacionados con el trámite.
   * Este objeto es utilizado para gestionar los documentos necesarios para el trámite.
   */
  private documentosState!: DocumentosState;

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
   * Constructor del componente.
   * @param router Servicio de enrutamiento.
   */
  constructor(
    private router: Router,
    private cadenaOriginalService: CadenaOriginalService,
    private cadena: CadenaOriginal11201Service,
    private firma: Firma11201Service,
    private documentoService: DocumentoService,
    private tramite11201Query: Tramite11201Query,
    private tramiteStore: TramiteFolioStore,
    private documentosQuery: DocumentosQuery,
    private tramiteFolioQuery: TramiteFolioQueries
  ) {}
    /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   */
  ngOnInit(): void {
     // Suscribirse a los cambios en el estado de los documentos
    this.documentosQuery.selectDocumentoState$
      .pipe(
        takeUntil(this.destroy$),
        map((documentosState) => {
          this.documentosState = documentosState;
        })
      )
      .subscribe();

    // Suscribirse a los cambios en el estado del trámite 11201
    this.tramite11201Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();

    // Obtener la URL actual y separar los segmentos
    const URL_ACTUAL = this.router.url;
    const URL_SEPARADA = URL_ACTUAL.split('/');
    this.url = URL_SEPARADA.slice(0, 3).join('/');

    // Obtener la cadena original del trámite
    this.obtenerCadenaOriginal();

  }

   /**
   * Método para obtener la cadena original del trámite.
   * Este método se encarga de llamar al servicio correspondiente para generar la cadena original.
   */
  obtenerCadenaOriginal(): void {
    const PAYLOAD: CadenaOriginalRequest = {
      num_folio_tramite: this.tramiteFolioQuery.getTramite() || null,
      boolean_extranjero: true,
      solicitante: {
        rfc: "AAL0409235E6",
        nombre: "Juan Pérez",
        es_persona_moral: true,
        certificado_serial_number: "string"
      },
      cve_rol_capturista: "CapturistaGubernamental",
      cve_usuario_capturista: "Gubernamental",
      fecha_firma: "2025-07-01 20:01:25"
    };
    this.cadena.obtenerCadenaOriginal(String(this.solicitudState.idSolicitud), PAYLOAD).subscribe({
      next: (resp) => {
        if (resp.codigo !== '00') {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: resp.error || 'Error al generar la cadena original.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          return;
        }
        this.cadenaOriginal = typeof resp.datos === 'string' ? resp.datos : undefined;
      },
      error: (error) => {
        const MENSAJE = error?.error?.error || 'Error inesperado al iniciar trámite.';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: 'error',
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
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
   * Método para obtener la firma del documento.
   * Este método se encarga de enviar la solicitud de firma al servicio correspondiente.
   * @param firma - La firma en formato base64 que se desea procesar.
   */
  obtieneFirma(firma: string): void {
    if (!this.cadenaOriginal || !this.datosFirmaReales) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'toastr',
        categoria: CategoriaMensaje.ERROR,
        modo: 'action',
        titulo: 'Error',
        mensaje: 'Faltan datos para completar la firma.',
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
          const PAYLOAD: FirmarRequest = {
            cadena_original: CADENAHEX,
            cert_serial_number: this.datosFirmaReales.certSerialNumber,
            clave_usuario: this.datosFirmaReales.rfc,
            fecha_firma: formatFecha(new Date()),
            clave_rol: 'Solicitante',
            sello: FIRMAHEX,
            fecha_fin_vigencia: formatFecha(this.datosFirmaReales.fechaFin),
            documentos_requeridos: response.datos?.documentos_requeridos || [],
          };

          return this.firma.enviarFirma<string>(String(this.solicitudState.idSolicitud), PAYLOAD);
        }),
        tap((firmaResponse: BaseResponse<string>) => {
          // Validar si la firma fue exitosa
          if (firmaResponse.codigo !== '00' || !firmaResponse.datos) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error al firmar la solicitud',
              mensaje: firmaResponse.mensaje || firmaResponse.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
            throw new Error('Firma no exitosa');
          }

          // Éxito: guardar folio
          this.folio = firmaResponse.datos;
        }),
        tap(() => {
          // Solo se ejecuta si todo fue exitoso
          this.tramiteStore.establecerTramite(
            this.folio,
            firma,
            this.solicitudState.idSolicitud
          );
          this.router.navigate([`${this.url}/acuse`]);
        }),
        catchError((error) => {
          if (!this.nuevaNotificacion) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error inesperado',
              mensaje: error?.error.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
          return of(null); // Evita que se propague y corte el flujo sin redirigir
        })
      )
      .subscribe();
  }
  /**
   * Método para obtener la cadena original del trámite.
   * Este método se encarga de llamar al servicio correspondiente para obtener la cadena original.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
