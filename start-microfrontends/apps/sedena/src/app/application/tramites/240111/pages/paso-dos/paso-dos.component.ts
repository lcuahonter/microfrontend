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
import { Tramite240111Query } from '../../estados/tramite240111Query.query';

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
  styleUrl: './paso-dos.component.css',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario se encuentra en modo prellenado.
   */
  esPrellenado: boolean = false;

  /**
   * Evento que escucha la orden para iniciar la carga de documentos
   * emitida desde <solicitud-page>.
   */
  @Input()
  cargaArchivosEvento!: EventEmitter<void>;

  /**
   * Identificador de la solicitud actual.
   */
  @Input()
  idSolicitud!: string;

  /**
   * Identificador del tipo de trámite.
   */
  @Input()
  idTipoTRamite!: string;

  /**
   * Información del usuario asociada a la solicitud.
   */
  @Input()
  datosUsuario!: Usuario;

  /**
   * Evento que notifica al componente padre que se debe
   * regresar a la sección anterior.
   */
  @Output()
  reenviarRegresarSeccion = new EventEmitter<void>();

  /**
   * Emite el estado de la carga en progreso del archivo.
   */
  @Output()
  cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
   * Evento que indica si existen documentos para cargar,
   * utilizado para habilitar o deshabilitar el botón
   * "Cargar Archivos" en <solicitud-page>.
   */
  @Output()
  reenviarEventoCarga = new EventEmitter<boolean>();

  /**
   * Evento que notifica que la carga de documentos
   * se ha realizado correctamente.
   */
  @Output()
  reenviarCargaRealizada = new EventEmitter<boolean>();

  /**
   * Indica si la carga de documentos se realizó correctamente.
   */
  cargaRealizada: boolean = false;

  /**
   * Indica si la carga del archivo se encuentra en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
   * Tipo de alerta Bootstrap utilizada para mensajes informativos.
   */
  public infoAlert: string = 'alert-info';

  /**
   * Textos estáticos utilizados en el paso de carga de documentos.
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * Lista local de tipos de documentos utilizados en este paso.
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * Catálogo de documentos obtenido desde el API.
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * Lista de documentos seleccionados por el usuario.
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * Evento interno que reenvía la solicitud de carga de documentos
   * hacia los componentes hijos.
   */
  reenviarEvento = new EventEmitter<void>();

  /**
   * Subject utilizado para cancelar suscripciones activas
   * al destruir el componente y prevenir memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   *
   * @param catalogosServices Servicio para obtener catálogos.
   * @param tramiteQuery Servicio para obtener el estado del trámite.
   */
  constructor(
    private catalogosServices: CatalogosService,
    private tramiteQuery: Tramite240111Query
  ) { }

  /**
  * Inicializa el componente escuchando el evento de carga de archivos,
  * configurando los textos dinámicos y cargando los tipos de documentos.
  */
  ngOnInit(): void {
    this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(() => {
          this.reenviarEvento.emit();
        })
      )
      .subscribe();

    const idSolicitud = this.tramiteQuery.getValue().idSolicitud;
    this.TEXTOS = TEXTOS_REQUISITOS.replace(
      '[ID_SOLICITUD]',
      idSolicitud ? idSolicitud.toString() : '------'
    );

    this.getTiposDocumentos();
  }

  /**
   * Libera recursos y finaliza las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Obtiene el catálogo de tipos de documentos
   * asociados al procedimiento.
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
   *
   * @param existenDocumentosParaCargar Indica si hay documentos pendientes.
   */
  manejarEventoCargaDocumento(existenDocumentosParaCargar: boolean): void {
    this.reenviarEventoCarga.emit(existenDocumentosParaCargar);
  }

  /**
   * Actualiza el estado de carga de documentos y notifica al componente padre.
   *
   * @param cargaRealizada Indica si la carga se completó correctamente.
   */
  documentosCargados(cargaRealizada: boolean): void {
    this.cargaRealizada = cargaRealizada;
    this.reenviarCargaRealizada.emit(this.cargaRealizada);
  }

  /**
   * Maneja el evento de carga en progreso emitido por un componente hijo.
   *
   * @param carga Indica si la carga sigue en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
    this.cargaEnProgresoChange.emit(this.cargaEnProgreso);
  }
}
