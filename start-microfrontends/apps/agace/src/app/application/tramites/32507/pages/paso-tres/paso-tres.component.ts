import {
  DocumentoRequerido,
  FirmarSolicitudRequest,
  GeneraCadenaOriginalSolicitudRequest,
  SolicitanteRequest,
} from '../../models/aviso-traslado.model';
import { EMPTY, catchError, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AcuseComponent,
  base64ToHex,
  encodeToISO88591Hex,
  formatFecha,
  TITULO_ACUSE,
  TramiteFolioStore,
  TXT_ALERTA_ACUSE,
} from '@ng-mf/data-access-user';
import { EntregaActaService } from '../../services/entrega-acta.service';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { ToastrService } from 'ngx-toastr';
import { Tramite32507Query } from '../../../../estados/queries/tramite32507.query';
import {
  Tramite32507State,
  Tramite32507Store,
} from '../../../../estados/tramites/tramite32507.store';

interface DatosFirma {
  firma: string;
  certSerialNumber: string;
  rfc: string;
  fechaFin: string;
}

/**
 * Componente para gestionar el paso tres del trámite 32507.
 *
 * Este componente permite al usuario realizar la firma electrónica de la solicitud
 * y, en caso de éxito, redirigirlo a la página de acuse.
 *
 * En el ngOnInit, se genera automáticamente la cadena original necesaria para la firma.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent, AcuseComponent],
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

  /** Emite el cambio de estado cuando se muestra el acuse */
  @Output() esAcuseChange = new EventEmitter<boolean>();

  /** Texto de alerta mostrado en el componente de acuse */
  txtAlerta: string = '';

  /** Subtítulo mostrado en el componente de acuse */
  subtitulo: string = TITULO_ACUSE;

  /** Folio del trámite para el acuse */
  folio: string = '';

  /** URL del trámite */
  url: string = 'entrega-acta-solicitante';

  /** ID de la solicitud para generar documentos del acuse */
  idSolicitud: number = 0;

  /** Código del procedimiento/trámite */
  procedure: number = 32507;

  /**
   * Constructor del componente.
   *
   * @param {EntregaActaService} entregaActaService - Servicio para operaciones del trámite.
   * @param {Tramite32507Query} tramiteQuery - Query para obtener el estado del trámite.
   * @param {ToastrService} toastrService - Servicio para mostrar notificaciones.
   * @param {Tramite32507Store} store - Store para gestionar el estado del trámite 32507.
   * @param {TramiteFolioStore} tramiteFolioStore - Store compartido para datos del folio y acuse.
   */
  constructor(
    private entregaActaService: EntregaActaService,
    private tramiteQuery: Tramite32507Query,
    private toastrService: ToastrService,
    public store: Tramite32507Store,
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
        next: (tramiteState: Tramite32507State) => {
          // Obtener documentos almacenados del state
          const DOCS_ALMACENADOS = tramiteState.listadoDocsAlmacenados;

          // Obtener ID de la solicitud
          const ID_SOLICITUD = tramiteState.avisoFormulario.idSolicitud;

          if (!ID_SOLICITUD) {
            console.error('❌ No existe ID de solicitud');
            this.toastrService.warning('Debes guardar la solicitud antes de continuar al paso de firma');
            return;
          }

          // Construir array de documentos requeridos
          const DOCUMENTOS_REQUERIDOS: DocumentoRequerido[] = PasoTresComponent.construirDocumentosRequeridos(
            DOCS_ALMACENADOS
          );

          // Construir el solicitante
          const SOLICITANTE: SolicitanteRequest = {
            // rfc: tramiteState.datosSolicitante.rfc,
            rfc: "AAL0409235E6",
            nombre: tramiteState.datosSolicitante.denominacion,
            es_persona_moral: tramiteState.datosSolicitante.tipoPersona === 'M',
          };

          // Construir el request para generar cadena
          const REQUEST: GeneraCadenaOriginalSolicitudRequest = {
            num_folio_tramite: ID_SOLICITUD,
            boolean_extranjero: false,
            // TODO preguntar: falla tanto si le mando el id tipo documento como el uuid generado en la carga ??
            // documento_requerido: DOCUMENTOS_REQUERIDOS,
            solicitante: SOLICITANTE,
            cve_rol_capturista: 'PersonaMoral',
            cve_usuario_capturista: tramiteState.datosSolicitante.rfc,
            fecha_firma: formatFecha(new Date()),
          };

          // Llamar al servicio para generar la cadena
          this.entregaActaService.generaCadenaOriginal(Number(ID_SOLICITUD), REQUEST)
            .pipe(
              take(1),
              catchError((error) => {
                console.error('❌ Error al generar cadena original:', error);
                this.toastrService.error(
                  error?.error?.error || 'Error al generar la cadena original'
                );
                this.cadenaGenerada = false;
                return EMPTY;
              })
            )
            .subscribe({
              next: (respuesta) => {

                if (respuesta.codigo === '00' && respuesta.datos) {
                  this.cadenaOriginal = respuesta.datos;
                  this.cadenaGenerada = true;
                  this.toastrService.info('Listo para firmar');
                } else {
                  console.error('Error generando cadena:', respuesta);
                  this.toastrService.error(
                    `Error al generar cadena: ${respuesta.error || respuesta.codigo}`
                  );
                  this.cadenaGenerada = false;
                }
              },
              error: (error) => {
                console.error('Error inesperado generando cadena:', error);
                this.toastrService.error('Error inesperado al generar la cadena original');
                this.cadenaGenerada = false;
              }
            });
        },
        error: (error) => {
          console.error('❌ Error al obtener el estado del trámite:', error);
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
   * Realiza la firma de la solicitud del trámite 32507.
   *
   * Este método:
   * 1. Obtiene los datos del estado del trámite
   * 2. Obtiene los documentos cargados en el paso 2
   * 3. Construye el request FirmarSolicitudRequest
   * 4. Llama al servicio para firmar
   * 5. Navega al acuse si es exitoso
   *
   * @param {DatosFirma} datosFirma - Datos de la firma electrónica generada.
   */
  private firmaSolicitud(datosFirma: DatosFirma): void {
    this.isLoading = true;

    this.tramiteQuery.selectSolicitud$
      .pipe(take(1))
      .subscribe({
        next: (tramiteState: Tramite32507State) => {
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
            clave_rol: 'PersonaMoral',
            sello: FIRMAHEX,
            fecha_fin_vigencia: formatFecha(datosFirma.fechaFin),
            // TODO: marca error tanto si se manda uuid de documento almacenado como si se manda id del catalogo
            documentos_requeridos: [],
            // documentos_requeridos: DOCUMENTOS_REQUERIDOS,
          };

          // Obtener ID de la solicitud
          const ID_SOLICITUD = tramiteState.avisoFormulario.idSolicitud;

          if (!ID_SOLICITUD) {
            this.toastrService.error('Error: No existe ID de solicitud. Debes guardar la solicitud primero.');
            this.isLoading = false;
            return;
          }

          // Llamar al servicio para firmar
          this.entregaActaService.firmaSolicitud(REQUEST, Number(ID_SOLICITUD))
            .pipe(
              take(1),
              catchError((error) => {
                console.error('❌ Error al firmar solicitud:', error);
                this.toastrService.error(
                  error?.error?.error || 'Error al firmar la solicitud'
                );
                this.isLoading = false;
                return EMPTY;
              })
            )
            .subscribe({
              next: (respuesta) => {

                if (respuesta.codigo === '00' && respuesta.datos) {
                  this.toastrService.success('Solicitud firmada exitosamente');

                  // Guardar también en TramiteFolioStore (store compartido para acuse)
                  this.tramiteFolioStore.establecerTramite(
                    respuesta.datos,
                    datosFirma.firma,
                    Number(tramiteState.avisoFormulario.idSolicitud),
                    32507
                  );

                  // Configurar datos para el componente de acuse
                  this.folio = respuesta.datos;
                  this.idSolicitud = Number(tramiteState.avisoFormulario.idSolicitud);
                  this.txtAlerta = TXT_ALERTA_ACUSE(this.folio);

                  // Mostrar el componente de acuse
                  this.esAcuse = true;

                  // Emitir evento para notificar al padre que se está mostrando el acuse
                  this.esAcuseChange.emit(true);

                  // Resetear el store después de firma exitosa
                  // El usuario puede ver el acuse, pero si recarga o sale, pierde la información
                  this.store.reset();
                } else {
                  this.toastrService.error(
                    `Error al firmar: ${respuesta.error || respuesta.codigo}`
                  );
                  console.error('❌ Error en firma:', respuesta);
                }
                this.isLoading = false;
              },
              error: (error) => {
                console.error('❌ Error inesperado al firmar:', error);
                this.toastrService.error('Error inesperado al firmar la solicitud');
                this.isLoading = false;
              }
            });
        },
        error: (error) => {
          console.error('❌ Error al obtener el estado del trámite:', error);
          this.toastrService.error('Error al obtener los datos del trámite');
          this.isLoading = false;
        }
      });
  }

  /**
   * Construye el array de DocumentoRequerido a partir de los documentos almacenados.
   *
   * Mapea los datos de UploadDocutoResponse a DocumentoRequerido:
   * - documentoUUID → id_documento_seleccionado
   * - hash_documento y sello_documento vienen del backend (vacíos por ahora)
   *
   * @param {any[]} docsAlmacenados - Array de documentos almacenados (UploadDocutoResponse[]).
   * @returns {DocumentoRequerido[]} Array de documentos requeridos para la firma.
   */
  private static construirDocumentosRequeridos(docsAlmacenados: any[]): DocumentoRequerido[] {
    const DOCUMENTOS: DocumentoRequerido[] = [];

    if (!docsAlmacenados || docsAlmacenados.length === 0) {
      console.warn('⚠️ No hay documentos almacenados');
      return DOCUMENTOS;
    }

    for (const DOC_ALMACENADO of docsAlmacenados) {
      const DOC: DocumentoRequerido = {
        id_documento_seleccionado: DOC_ALMACENADO.documentoUUID,
        hash_documento: DOC_ALMACENADO.hash_documento || '',
        sello_documento: DOC_ALMACENADO.sello_documento || '',
      };
      DOCUMENTOS.push(DOC);
    }

    return DOCUMENTOS;
  }
}