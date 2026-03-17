import { CategoriaMensaje, Notificacion, NotificacionesComponent } from '../notificaciones/notificaciones.component';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DocumentoRequeridoFirmar, FirmarRequest } from '../../../core/models/shared/firma-electronica/request/firmar-request.model';
import { base64ToHex, encodeToISO88591Hex, formatFecha, renameKey } from '../../../core/utils/utilerias';
import { catchError, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { BaseResponse } from '../../../core/models/shared/base-response.model';
import { CadenaOriginalRequest } from '../../../core/models/shared/cadena-original-request.model';
import { DocumentoService } from '../../../core/services/shared/documento/documento.service';
import { FirmaElectronicaComponent } from '../firma-electronica/firma-electronica.component';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TramiteFolioQueries } from '../../../core/queries/tramiteFolio.query';
import { TramiteFolioStore } from '../../../core/estados/tramiteFolio.store';

import { DocumentosFirmaQuery } from '../../../core/queries/documentos-firma.query';
import { DocumentosFirmaStore } from '../../../core/estados/documentos-firma.store';
import { LoginQuery } from '../../../core/queries/login.query';

@Component({
  selector: 'paso-firma',
  standalone: true,
  imports: [FirmaElectronicaComponent, NotificacionesComponent],
  templateUrl: './paso-firma.component.html',
  styleUrl: './paso-firma.component.scss',
})
export class PasoFirmaComponent implements OnDestroy, OnChanges {

  /**
 * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
 * Se utiliza para completar el observable cuando el componente se destruye.
 */
  private destroy$ = new Subject<void>();

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
   * Notificación que se muestra al usuario en caso de error o éxito en el proceso de firma.
   * Incluye información sobre el tipo de notificación, categoría, título y mensaje.
   */
  nuevaNotificacion!: Notificacion;

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
   * Identificador único de la solicitud de trámite que se está procesando.
   * Este valor se recibe desde el componente padre y se utiliza para:
   * - Generar la cadena original del documento
   * - Enviar la firma electrónica al servicio correspondiente
   * - Identificar la solicitud en las llamadas a la API
   * 
   * @example
   * ```html
   * <paso-firma [idSolicitud]="123456"></paso-firma>
   * ```
   */
  @Input() idSolicitud: number | null = null;

  /**
   * Código numérico que identifica el tipo de procedimiento o trámite.
   * Este valor se utiliza para:
   * - Determinar el endpoint específico en las llamadas al servicio
   * - Configurar el comportamiento del proceso de firma según el tipo de trámite
   * - Validar permisos y reglas de negocio específicas del procedimiento
   * 
   * @example
   * ```html
   * <paso-firma [procedure]="11201"></paso-firma>
   * ```
   */
  @Input() procedure: number = 0;

   @Input() idMecanismo: number | null = null;

  /**
   * URL del procedimiento actual utilizada para la navegación entre pasos del trámite.
   * Se usa para:
   * - Construir la ruta de navegación al acuse de recibo después de la firma exitosa
   * - Reemplazar la URL actual con la del siguiente paso en el flujo
   * - Mantener la coherencia en la navegación del proceso de trámite
   * 
   * @example
   * ```html
   * <paso-firma procedureUrl="solicitud-11201"></paso-firma>
   * ```
   */
  @Input() procedureUrl: string = '';

  /** Lista de documentos que requieren firma electrónica.
   * Esta lista se obtiene del store `DocumentosFirmaStore` a través del query `DocumentosFirmaQuery`.
   * Se utiliza para mostrar los documentos al usuario y procesar la firma de cada uno.
   */
  public documentosFirma: DocumentoRequeridoFirmar[] = [];

  /**
   * Array que almacena las cadenas originales de los documentos que requieren firma.
   */
  public cadenasOriginalesDocumentos: string[] = [];

  /*
  * Valor del RFC obtenido del estado de login.
  */
  public rfcValor: string = '';


  /**
   * Constructor del componente.
   * @param router Servicio de enrutamiento.
   */
  constructor(
    private router: Router,
    private documentoService: DocumentoService,
    private tramiteStore: TramiteFolioStore,
    private documentosFirmaQuery: DocumentosFirmaQuery,
    private documentosFirmaStore: DocumentosFirmaStore,
    private loginQuery: LoginQuery,
    private tramiteFolioQuery: TramiteFolioQueries) {
    this.documentosFirmaQuery.documentos$
      .pipe(takeUntil(this.destroy$))
      .subscribe((docs) => {
        this.documentosFirma = docs;
        this.cadenasOriginalesDocumentos = docs.map(d => d.hash_documento);
      });

    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;
        })
      )
      .subscribe();
  }



  /**
 * @description
 * Método del ciclo de vida de Angular que se ejecuta cuando 
 * alguna propiedad de entrada (@Input) del componente cambia.
 *
 * Este método verifica si la propiedad `idSolicitud` ha recibido 
 * un nuevo valor y, siempre que dicho valor sea diferente de cero, 
 * ejecuta el método `obtenerCadenaOriginal()`.
 *
 * @param {SimpleChanges} changes - Objeto que contiene los cambios 
 * detectados en las propiedades de entrada del componente. 
 * Cada clave corresponde al nombre de la propiedad cambiada.
 */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idSolicitud']) {
      this.obtenerCadenaOriginal();
    }
  }



  /**
   * Método para obtener la cadena original del trámite.
   * Este método se encarga de llamar al servicio correspondiente para generar la cadena original.
   */
  obtenerCadenaOriginal(): void {
    const DOCUMENTOS = this.documentosFirma.map(doc => ({
    id_documento_seleccionado: doc.id_documento_seleccionado
   }));
    const PAYLOAD: CadenaOriginalRequest = {
      num_folio_tramite: this.tramiteFolioQuery.getTramite() || null,
      boolean_extranjero: true,
      solicitante: {
        rfc: this.rfcValor,
        nombre: "INTEGRADORA DE URBANIZACIONES SIGNUM",
        es_persona_moral: true,
        certificado_serial_number: "string"
      },
      cve_rol_capturista: "CapturistaGubernamental",
      cve_usuario_capturista: "Gubernamental",
      fecha_firma: formatFecha(new Date())
    };
    if (DOCUMENTOS.length > 0) {
      PAYLOAD.documento_requerido = DOCUMENTOS;
    }
    this.documentoService.obtenerCadenaOriginal(String(this.idSolicitud), PAYLOAD, this.procedure).subscribe({
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
        console.error('Error al iniciar trámite:', error);
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
   * Método para obtener la firma del documento.
   * Este método se encarga de enviar la solicitud de firma al servicio correspondiente.
   * @param firma - La firma en formato base64 que se desea procesar.
   */
  obtieneFirma(firma: string): void {
    if (!this.cadenaOriginal || !this.datosFirmaReales) {
      console.error('Faltan datos para completar la firma');
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
          let PAYLOAD: FirmarRequest = {
            cadena_original: CADENAHEX,
            cert_serial_number: this.datosFirmaReales.certSerialNumber,
            clave_usuario: this.datosFirmaReales.rfc,
            fecha_firma: formatFecha(new Date()),
            clave_rol: 'Solicitante',
            sello: FIRMAHEX,
            fecha_fin_vigencia: formatFecha(this.datosFirmaReales.fechaFin),
            documentos_requeridos: this.documentosFirma || response.datos?.documentos_requeridos || [],
            rfc_solicitante: this.datosFirmaReales.rfc
          };
          if(this.idMecanismo){
            PAYLOAD={...PAYLOAD, id_mecanismo: this.idMecanismo};
          }
          if (this.procedure === 80302) {
            PAYLOAD = renameKey(PAYLOAD as unknown as Record<string, unknown>, 'rfc_solicitante', 'rfcSolicitante') as unknown as FirmarRequest;
          }
          return this.documentoService.enviarFirma<string>(String(this.idSolicitud), PAYLOAD, this.procedure);
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
            this.idSolicitud ?? 0,
            this.procedure
          );
           // Emitir la solicitud al acuse entre MFE.
          localStorage.setItem('solicitud', JSON.stringify({
            idsolicitud: this.idSolicitud ?? 0,
            folio: this.folio,
            procedure: this.procedure
          }));
          this.router.navigate([this.router.url.replace(this.procedureUrl, 'acuse')]);
        }),
        catchError((error) => {
          console.error('Error en el proceso de firma:', error);
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
