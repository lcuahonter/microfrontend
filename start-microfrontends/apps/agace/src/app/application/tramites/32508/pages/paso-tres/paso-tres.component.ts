import {
  DocumentoRequerido,
  FirmarSolicitudRequest,
  GeneraCadenaOriginalSolicitudRequest,
  SolicitanteRequest,
} from '../../models/adace.model';
import { EMPTY, catchError, take } from 'rxjs';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  base64ToHex,
  encodeToISO88591Hex,
  formatFecha,
  TITULO_ACUSE,
  TramiteFolioStore,
  TXT_ALERTA_ACUSE,
} from '@ng-mf/data-access-user';
import { AdaceService } from '../../services/adace.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite32508Query } from '../../state/Tramite32508.query';
import {
  Solicitud32508State,
  Tramite32508Store,
} from '../../state/Tramite32508.store';
import { TIPO_MORAL } from '../../constantes/adace32508.enum';

interface DatosFirma {
  firma: string;
  certSerialNumber: string;
  rfc: string;
  fechaFin: string;
}

/**
 * Componente para gestionar el paso tres del trámite 32508.
 *
 * Este componente permite al usuario realizar la firma electrónica de la solicitud
 * y, en caso de éxito, mostrar el acuse inline.
 *
 * En el ngOnInit, se genera automáticamente la cadena original necesaria para la firma.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent implements OnInit {

  /** Bandera para controlar el estado de carga durante la firma */
  isLoading = false;

  /** Cadena original generada por el backend */
  cadenaOriginal: string = '';

  /** Bandera que indica si la cadena original ha sido generada exitosamente */
  cadenaGenerada: boolean = false;

  /** Indica si se muestra el acuse */
  esAcuse: boolean = false;

  /** Emite cuando cambia el estado del acuse para notificar al componente padre */
  @Output() esAcuseChange = new EventEmitter<boolean>();

  /** Texto de alerta mostrado en el componente de acuse */
  txtAlerta: string = '';

  /** Subtítulo mostrado en el componente de acuse */
  subtitulo: string = TITULO_ACUSE;

  /** Folio del trámite para el acuse */
  folio: string = '';

  /** URL del trámite */
  url: string = 'dictamen-disminucion-compensacion';

  /** ID de la solicitud para generar documentos del acuse */
  idSolicitud: number = 0;

  /** Código del procedimiento/trámite */
  procedure: number = 32508;

  /**
   * Constructor del componente.
   *
   * @param {AdaceService} adaceService - Servicio para operaciones del trámite 32508.
   * @param {Tramite32508Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {ToastrService} toastrService - Servicio para mostrar notificaciones.
   * @param {Tramite32508Store} store - Store para gestionar el estado del trámite 32508.
   * @param {TramiteFolioStore} tramiteFolioStore - Store compartido para datos del folio y acuse.
   */
  constructor(
    private adaceService: AdaceService,
    private tramiteQuery: Tramite32508Query,
    private toastrService: ToastrService,
    public store: Tramite32508Store,
    private tramiteFolioStore: TramiteFolioStore,
  ) {}

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   *
   * En este método se genera automáticamente la cadena original necesaria para la firma,
   * permitiendo que el usuario pueda firmar sin esperas adicionales.
   */
  ngOnInit(): void {
    this.generarCadenaOriginal();
  }

  /**
   * Genera la cadena original necesaria para la firma electrónica.
   *
   * Este método:
   * 1. Obtiene los datos del estado del trámite
   * 2. Obtiene los documentos cargados
   * 3. Construye el request GeneraCadenaOriginalSolicitudRequest
   * 4. Llama al servicio para generar la cadena
   * 5. Almacena la cadena si es exitosa
   */
  private generarCadenaOriginal(): void {

    this.tramiteQuery.selectSolicitud$
      .pipe(take(1))
      .subscribe({
        next: (tramiteState: Solicitud32508State) => {
          // Obtener documentos almacenados del state
          const DOCS_ALMACENADOS = tramiteState.listadoDocsAlmacenados;

          // Obtener ID de la solicitud
          const ID_SOLICITUD = tramiteState.idSolicitud;

          if (!ID_SOLICITUD) {
            this.toastrService.warning('Debes guardar la solicitud antes de continuar al paso de firma');
            return;
          }

          // Construir array de documentos requeridos
          const DOCUMENTOS_REQUERIDOS: DocumentoRequerido[] = PasoTresComponent.construirDocumentosRequeridos(
            DOCS_ALMACENADOS
          );

          // Construir el solicitante
          const SOLICITANTE: SolicitanteRequest = {
            rfc: tramiteState.rfc,
            nombre: tramiteState.nombre,
            es_persona_moral: tramiteState.tipoPersona === TIPO_MORAL,
          };

          // Construir el request para generar cadena
          const REQUEST: GeneraCadenaOriginalSolicitudRequest = {
            num_folio_tramite: ID_SOLICITUD,
            boolean_extranjero: false,
            documento_requerido: DOCUMENTOS_REQUERIDOS,
            solicitante: SOLICITANTE,
            cve_rol_capturista: tramiteState.tipoPersona === TIPO_MORAL ? 'PersonaMoral' : 'PersonaFisica',
            cve_usuario_capturista: tramiteState.rfc,
            fecha_firma: formatFecha(new Date()),
          };

          // Llamar al servicio para generar la cadena
          this.adaceService.generaCadenaOriginal(Number(ID_SOLICITUD), REQUEST)
            .pipe(
              take(1),
              catchError((error) => {
                this.toastrService.error(
                  error?.error?.error || 'Error al generar la cadena original'
                );
                this.cadenaGenerada = false;
                return EMPTY;
              })
            )
            .subscribe({
              next: (respuesta) => {

                if ((respuesta.codigo === '00' || respuesta.codigo === '200') && respuesta.datos) {
                  this.cadenaOriginal = respuesta.datos;
                  this.cadenaGenerada = true;
                  this.toastrService.info('Listo para firmar');
                } else {
                  this.toastrService.error(
                    `Error al generar cadena: ${respuesta.error || respuesta.codigo}`
                  );
                  this.cadenaGenerada = false;
                }
              },
              error: (error) => {
                this.toastrService.error('Error inesperado al generar la cadena original');
                this.cadenaGenerada = false;
              }
            });
        },
        error: (error) => {
          this.toastrService.error('Error al obtener los datos del trámite');
        }
      });
  }

  /**
   * Maneja la obtención de los datos de la firma electrónica.
   *
   * Este método recibe los datos completos de la firma electrónica y procede
   * a firmar la solicitud llamando al método firmaSolicitud.
   *
   * @param {DatosFirma} datosFirma - Objeto con los datos de la firma (firma, certificado, rfc, fechaFin).
   */
  obtieneDatosFirma(datosFirma: DatosFirma): void {
    if (!datosFirma.firma) {
      this.toastrService.error('Error: No se generó correctamente la firma electrónica');
      return;
    }

    if (!this.cadenaGenerada) {
      this.toastrService.warning('Aguarde mientras se prepara la solicitud para firmar...');
      return;
    }

    this.firmaSolicitud(datosFirma);
  }

  /**
   * Realiza la firma de la solicitud del trámite 32508.
   *
   * Este método:
   * 1. Obtiene los datos del estado del trámite
   * 2. Obtiene los documentos cargados en el paso 2
   * 3. Construye el request FirmarSolicitudRequest
   * 4. Llama al servicio para firmar
   * 5. Muestra el acuse inline si es exitoso
   *
   * @param {DatosFirma} datosFirma - Datos de la firma electrónica generada.
   */
  private firmaSolicitud(datosFirma: DatosFirma): void {
    this.isLoading = true;

    this.tramiteQuery.selectSolicitud$
      .pipe(take(1))
      .subscribe({
        next: (tramiteState: Solicitud32508State) => {
          // Obtener documentos del store
          const DOCS_ALMACENADOS = tramiteState.listadoDocsAlmacenados;

          // Construir array de documentos requeridos
          const DOCUMENTOS_REQUERIDOS: DocumentoRequerido[] = PasoTresComponent.construirDocumentosRequeridos(
            DOCS_ALMACENADOS
          );

          const CADENAHEX = encodeToISO88591Hex(this.cadenaOriginal);
          const FIRMAHEX = base64ToHex(datosFirma.firma);

          // Construir el request para firmar
          const REQUEST: FirmarSolicitudRequest = {
            cadena_original: CADENAHEX,
            cert_serial_number: datosFirma.certSerialNumber,
            clave_usuario: datosFirma.rfc,
            fecha_firma: formatFecha(new Date()),
            clave_rol: tramiteState.tipoPersona === TIPO_MORAL ? 'PersonaMoral' : 'PersonaFisica',
            sello: FIRMAHEX,
            fecha_fin_vigencia: formatFecha(datosFirma.fechaFin),
            documentos_requeridos: [],
          };

          // Obtener ID de la solicitud
          const ID_SOLICITUD = tramiteState.idSolicitud;

          if (!ID_SOLICITUD) {
            this.toastrService.error('Error: No existe ID de solicitud. Debes guardar la solicitud primero.');
            this.isLoading = false;
            return;
          }

          // Llamar al servicio para firmar
          this.adaceService.firmaSolicitud(REQUEST, Number(ID_SOLICITUD))
            .pipe(
              take(1),
              catchError((error) => {
                this.toastrService.error(
                  error?.error?.error || 'Error al firmar la solicitud'
                );
                this.isLoading = false;
                return EMPTY;
              })
            )
            .subscribe({
              next: (respuesta) => {

                if ((respuesta.codigo === '00' || respuesta.codigo === '200') && respuesta.datos) {
                  this.toastrService.success('Solicitud firmada exitosamente');

                  // Guardar también en TramiteFolioStore (store compartido para acuse)
                  this.tramiteFolioStore.establecerTramite(
                    respuesta.datos,
                    datosFirma.firma,
                    Number(tramiteState.idSolicitud),
                    32508
                  );

                  // Configurar datos para el componente de acuse
                  this.folio = respuesta.datos;
                  this.idSolicitud = Number(tramiteState.idSolicitud);
                  this.txtAlerta = TXT_ALERTA_ACUSE(this.folio);

                  // Mostrar el componente de acuse
                  this.esAcuse = true;
                  this.esAcuseChange.emit(true);
                  this.store.reset();
                } else {
                  this.toastrService.error(
                    `Error al firmar: ${respuesta.error || respuesta.codigo}`
                  );
                }
                this.isLoading = false;
              },
              error: (error) => {
                this.toastrService.error('Error inesperado al firmar la solicitud');
                this.isLoading = false;
              }
            });
        },
        error: (error) => {
          this.toastrService.error('Error al obtener los datos del trámite');
          this.isLoading = false;
        }
      });
  }

  /**
   * Construye el array de DocumentoRequerido a partir de los documentos almacenados.
   *
   * Mapea los datos de DocumentoProcesado a DocumentoRequerido:
   * - id_documento → id_documento_seleccionado
   * - cadena_original (convertida a hex) → hash_documento
   * - sello_documento vacío por ahora
   *
   * @param {any[]} docsAlmacenados - Array de documentos almacenados (DocumentoProcesado[]).
   * @returns {DocumentoRequerido[]} Array de documentos requeridos para la firma.
   */
  private static construirDocumentosRequeridos(docsAlmacenados: any[]): DocumentoRequerido[] {
    const DOCUMENTOS: DocumentoRequerido[] = [];

    if (!docsAlmacenados || docsAlmacenados.length === 0) {
      return DOCUMENTOS;
    }

    for (const DOC_ALMACENADO of docsAlmacenados) {
      const DOC: DocumentoRequerido = {
        id_documento_seleccionado: DOC_ALMACENADO.id_documento,
        hash_documento: DOC_ALMACENADO.cadena_original || '',
        sello_documento: '',
      };
      DOCUMENTOS.push(DOC);
    }

    return DOCUMENTOS;
  }
}
