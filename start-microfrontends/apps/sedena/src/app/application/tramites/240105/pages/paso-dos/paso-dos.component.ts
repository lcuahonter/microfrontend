import {
  AlertComponent,
  CATALOGOS_ID,
  CargaDocumentoComponent,
  Catalogo,
  CatalogosService,
  TituloComponent,
  Usuario,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TEXTOS_REQUISITOS } from '../../constants/importacion-armas-municiones.enum';
import { Tramite240105Query } from '../../estados/tramite240105Query.query';

/**
 * @component PasoDosComponent
 * @description Component responsible for managing step two of the procedure.
 * It handles document requirements, retrieves catalog data, and manages user selections.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    TituloComponent,
    CargaDocumentoComponent
  ],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
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
   * Textos estáticos utilizados en el paso de carga de documentos.
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * Lista local de tipos de documentos utilizados en este paso.
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * Tipo de alerta Bootstrap utilizada para mensajes informativos.
   */
  public infoAlert: string = 'alert-info';

  /**
   * Catálogo de tipos de documentos obtenido desde el API.
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * Lista de documentos seleccionados por el usuario.
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * Evento interno que reenvía la solicitud de carga de documentos.
   */
  reenviarEvento = new EventEmitter<void>();

  /**
   * Subject utilizado para cancelar suscripciones activas
   * al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   */
  constructor(
    private catalogosServices: CatalogosService,
    private tramiteQuery: Tramite240105Query
  ) { }

  /**
 * Inicializa el componente.
 * - Se suscribe a `cargaArchivosEvento` y emite `reenviarEvento` hasta que
 *   el componente se destruya, evitando fugas de memoria.
 * - Reemplaza el marcador `[ID_SOLICITUD]` en `TEXTOS_REQUISITOS` con el
 *   id de la solicitud actual o con '------' si no existe.
 */
  ngOnInit(): void {
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
   * Obtiene el catálogo de tipos de documentos.
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
 * Limpia los recursos al destruir el componente.
 * - Completa el `destroyNotifier$` para cancelar todas las suscripciones
 *   dependientes de `takeUntil` y evitar fugas de memoria.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
