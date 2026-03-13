import {
  CategoriaMensaje,
  FirmaElectronicaComponent,
  Notificacion,
  NotificacionesComponent,
  base64ToHex,
  encodeToISO88591Hex,
  formatFecha
} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import {
  Component, OnDestroy,
  OnInit, OnChanges, SimpleChanges, Input
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentosTramiteService } from '../../services/documentos-tramite.service';
import { Solicitud32501Query } from '../../estados/solicitud32501.query';
import { Solicitud32501State } from '../../estados/solicitud32501.store';
import { EMPTY, Subject, catchError, map, of, takeUntil, tap } from 'rxjs';
import { DocumentosQuery } from '@libs/shared/data-access-user/src/core/queries/documentos.query'
import { CadenaOriginalRequest } from '@libs/shared/data-access-user/src/core/models/shared/cadena-original-request.model';
import { DocumentoRequeridoFirmar, FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model'
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { TramiteFolioStore } from '@ng-mf/data-access-user';

/**DocumentoRequeridoFirmar
 * Componente para el paso tres del trámite 32501.
 * Este componente se utiliza para mostrar los pasos del asistente - 32501
 * Lista de pasos
 * Índice del paso
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FirmaElectronicaComponent, NotificacionesComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent implements OnInit, OnDestroy, OnChanges {

  /**
  * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
  * Se utiliza para completar el observable cuando el componente se destruye.
  */
  private destroy$ = new Subject<void>();

  /**
  * Cadena original generada a partir de los datos del trámite.
  * Esta cadena será firmada con el certificado digital y la llave privada proporcionados.
  */
  cadenaOriginal?: string = '';

  /**
   * ID de la Solicitud a firmar
   */
  idSolicitud: number = 0;

  /**
   * Estado del tramite 32501
   */
  public solicitudState!: Solicitud32501State;

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

  /** URL actual */
  url?: string;

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
   * <paso-firma [tramite]="32501"></paso-firma>
   * ```
   */
  @Input() tramite: number | null = null;

  /**
   * Código numérico que identifica el tipo de procedimiento o trámite.
   * Este valor se utiliza para:
   * - Determinar el endpoint específico en las llamadas al servicio
   * - Configurar el comportamiento del proceso de firma según el tipo de trámite
   * - Validar permisos y reglas de negocio específicas del procedimiento
   * 
   * @example
   * ```html
   * <paso-firma [procedure]="32501"></paso-firma>
   * ```
   */
  @Input() procedure: number = 32501;

  /** Lista de documentos que requieren firma electrónica.
   * Esta lista se obtiene del store `DocumentosFirmaStore` a través del query `DocumentosFirmaQuery`.
   * Se utiliza para mostrar los documentos al usuario y procesar la firma de cada uno.
   */
  public documentosFirma: DocumentoRequeridoFirmar[] = [];

  /**
   * Array que almacena las cadenas originales de los documentos que requieren firma.
   */
  public cadenasOriginalesDocumentos: string[] = [];


  /**
   * componente doc
   * @constructor
   * @param {Router} router - Servicio de Angular para la navegación entre rutas.
   */
  constructor(
    private router: Router,
    private documentosTramiteService: DocumentosTramiteService,
    private solicitud32501Query: Solicitud32501Query,
    private tramiteStore: TramiteFolioStore
  ) {
    // Constructor del componente
  }

  /** Sujeto para manejar la destrucción del componente y cancelar suscripciones */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Subject para controlar la destrucción de subscripciones (takeUntil).
 */
  private destroyed$ = new Subject<void>();




  /**
   * @description Método del ciclo de vida de Angular que se ejecuta una vez que el componente ha sido inicializado.
   * Ideal para cargar datos necesarios al inicio del componente.
   * @returns {void}
   */
  ngOnInit(): void {

    this.solicitud32501Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuestaState: Solicitud32501State) => {
          this.idSolicitud = respuestaState.idSolicitud;
          this.solicitudState = respuestaState;
        })
      )
      .subscribe();

    this.documentosTramiteService.detalleDocumentos(String(this.idSolicitud))
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(documentos => documentos.datos)
      ).subscribe(
        listaDocumentos => {
          listaDocumentos.forEach((item, index) => {
            this.documentosFirma.push({ id_documento_seleccionado: item.documento.id_documento, hash_documento: "", sello_documento: "" });
          });
        }
      );

    this.obtenerCadenaOriginal();

    const URL_ACTUAL = this.router.url;
    const URL_SEPARADA = URL_ACTUAL.split('/');
    this.url = URL_SEPARADA.slice(0, 3).join('/');
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

    this.documentosFirma.forEach((item, index) => {
      this.documentosFirma[index].hash_documento = datos.certSerialNumber;
      this.documentosFirma[index].sello_documento = datos.firma;
    });

    this.obtieneFirma(datos.firma);
  }

  /**
   * Método para obtener la cadena original del trámite.
   * Este método se encarga de llamar al servicio correspondiente para generar la cadena original.
   */
  obtenerCadenaOriginal(): void {
    const PAYLOAD: CadenaOriginalRequest = {
      num_folio_tramite: this.solicitudState.idSolicitud.toString() ?? null,
      boolean_extranjero: false,
      solicitante: {
        rfc: this.solicitudState.solicitante.rfc,
        nombre: this.solicitudState.solicitante.denominacion,
        es_persona_moral: true,
        certificado_serial_number: ""
      },
      cve_rol_capturista: "PersonaMoral",
      cve_usuario_capturista: "PersonaMoral",
      fecha_firma: formatFecha(new Date())
    };
    this.documentosTramiteService.obtenerCadenaOriginal(String(this.solicitudState.idSolicitud), PAYLOAD, this.procedure).subscribe({
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
   * componente doc
   * @método obtieneFirma
   * @descripcion Recibe la firma electrónica y redirige a la página de acuse si la firma es válida.
   * @param {string} ev - Cadena que representa la firma electrónica obtenida.
   */
  obtieneFirma(firma: string): void {
    
    const FIRMA: string = firma;    
    const FIRMAHEX: string = base64ToHex(FIRMA);
    
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

    this.documentosFirma.forEach((item, index) => {
      this.documentosFirma[index].hash_documento = CADENAHEX;
      this.documentosFirma[index].sello_documento = FIRMAHEX;
    });

    let PAYLOAD: FirmarRequest = {
      cadena_original: CADENAHEX,
      cert_serial_number: this.datosFirmaReales.certSerialNumber,
      clave_usuario: this.datosFirmaReales.rfc,
      fecha_firma: formatFecha(new Date()),
      clave_rol: 'Solicitante',
      sello: FIRMAHEX,
      fecha_fin_vigencia: formatFecha(this.datosFirmaReales.fechaFin),
      documentos_requeridos: this.documentosFirma || [],
      rfc_solicitante: this.solicitudState.solicitante.rfc
    };

    this.documentosTramiteService.enviarFirma<string>(String(this.solicitudState.idSolicitud), PAYLOAD, this.procedure)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          if (!this.nuevaNotificacion) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: 'Error inesperado',
              mensaje:
                error?.error?.error || 'Ocurrió un error al procesar la firma.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
          return EMPTY;
        })
      )
      .subscribe(
        {
          next: (firmaResponse) => {
            if (firmaResponse.codigo == '00' && firmaResponse.datos) {

              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.EXITO,
                modo: 'action',
                titulo: 'Firma Exitosa',
                mensaje: 'Solicitud firmada exitosamente.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };

              //Guardar estatus acuse
              this.tramiteStore.establecerTramite(
                firmaResponse.datos,
                firma,
                this.solicitudState.idSolicitud,
                32501
              );
              // Éxito: guardar folio
              this.folio = firmaResponse.datos;

              this.router.navigate([`${this.url}/acuse`]);

            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: 'Error al firmar la solicitud',
                mensaje:
                  firmaResponse.mensaje ||
                  firmaResponse.error ||
                  'Ocurrió un error al procesar la firma.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              throw new Error('Firma no exitosa');
            }
          },
        error: (error) => {
          this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: 'Error en Trámite',
                mensaje:
                  'Error al obtener los datos del trámite.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              throw new Error('Error en generar Trámite');
        }
          
        }

      );

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
    if (changes['idSolicitud'] && this.idSolicitud !== 0) {
      this.obtenerCadenaOriginal();
    }
  }


  /**
 * Método de ciclo de vida que se ejecuta al destruir el componente
 * Se encarga de completar el subject y cancelar las suscripciones activas
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }


}
