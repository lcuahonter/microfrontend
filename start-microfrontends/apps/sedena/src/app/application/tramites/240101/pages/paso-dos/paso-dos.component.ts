import {
  AlertComponent,
  CATALOGOS_ID,
  CargaDocumentoComponent,
  Catalogo,
  CatalogosService,
  ConsultaioState,
  TituloComponent,
  Usuario
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constants/importacion-armas-municiones.enum';
import { Tramite240101Query } from '../../estados/tramite240101Query.query';

/**
 * @component PasoDosComponent
 * @description Component responsible for managing step two of the procedure.
 * It handles document requirements, retrieves catalog data, and manages user selections.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  imports: [AlertComponent, TituloComponent, CargaDocumentoComponent],
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario se encuentra en modo prellenado.
   */
  esPrellenado: boolean = false;

  /**
   * Evento que notifica al componente padre que se debe
   * regresar a la sección anterior.
   */
  @Output() reenviarRegresarSeccion = new EventEmitter<void>();

  /**
* Evento interno que reenvía la solicitud de carga de documentos.
*/
  reenviarEvento = new EventEmitter<void>();

  /**
   * Evento recibido desde <solicitud-page> para iniciar
   * la carga de documentos.
   */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /**
   * Identificador único de la solicitud.
   */
  @Input() idSolicitud!: string;

  /**
   * Identificador del tipo de trámite asociado a la solicitud.
   */
  @Input() idTipoTRamite!: string;

  /**
   * Información del usuario asociada a la solicitud.
   */
  @Input() datosUsuario!: Usuario;

  /**
   * Emite el estado de la carga en progreso.
   */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
   * Evento que indica si existen documentos para cargar.
   */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

  /**
   * Evento que notifica que la carga de documentos ha finalizado.
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();

  /**
   * Indica si la carga de documentos se realizó correctamente.
   */
  cargaRealizada: boolean = false;

  /**
   * Indica si la carga del archivo se encuentra en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
   * @property TEXTOS
   * @description Contains static text literals used in this step of the form.
   * @type {typeof TEXTOS_REQUISITOS}
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * @property tiposDocumentos
   * @description Local placeholder for document types used in this step.
   * @type {Catalogo[]}
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * @property infoAlert
   * @description Bootstrap alert type used for informational messages.
   * @type {string}
   */
  public infoAlert = 'alert-info';

  /**
   * @property catalogoDocumentos
   * @description Holds the document type catalog fetched from the API.
   * @type {Catalogo[]}
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * @property documentosSeleccionados
   * @description List of documents selected by the user.
   * @type {Catalogo[]}
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * @property destroyNotifier$
   * @description Notifier used to unsubscribe from observables when the component is destroyed.
   * Prevents memory leaks.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Indica si los datos de respuesta están disponibles.
 */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado de la consulta actual.
   */
  public consultaState!: ConsultaioState;

  /**
   * @constructor
   * @param catalogosServices Service to fetch catalog data needed in the form.
   */
  constructor(private catalogosServices: CatalogosService, private tramiteQuery: Tramite240101Query) { }

  /**
   * @method ngOnInit
   * @description Angular lifecycle hook triggered on component initialization.
   * Initiates the fetch of document types.
   * @returns {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
    this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(() => this.reenviarEvento.emit())
      )
      .subscribe();

    const idSolicitud = this.tramiteQuery.getValue().idSolicitud;
    this.TEXTOS = TEXTOS_REQUISITOS.replace(
      '[ID_SOLICITUD]',
      idSolicitud ? idSolicitud.toString() : '------'
    );
  }

  /**
   * @method getTiposDocumentos
   * @description Fetches the catalog of document types for the procedure.
   * Updates the `catalogoDocumentos` list if successful.
   * @returns {void}
   */
  public getTiposDocumentos(): void {
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
  * Maneja el evento que indica si existen documentos para cargar.
  */
  manejarEventoCargaDocumento(existenDocumentosParaCargar: boolean): void {
    this.reenviarEventoCarga.emit(existenDocumentosParaCargar);
  }

  /**
   * Actualiza el estado de carga de documentos.
   */
  documentosCargados(cargaRealizada: boolean): void {
    this.cargaRealizada = cargaRealizada;
    this.reenviarCargaRealizada.emit(this.cargaRealizada);
  }

  /**
   * Maneja el evento de carga en progreso emitido por un componente hijo.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
    this.cargaEnProgresoChange.emit(this.cargaEnProgreso);
  }

  /**
   * @method ngOnDestroy
   * @description Angular lifecycle hook triggered just before the component is destroyed.
   * Cleans up active subscriptions to prevent memory leaks.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
