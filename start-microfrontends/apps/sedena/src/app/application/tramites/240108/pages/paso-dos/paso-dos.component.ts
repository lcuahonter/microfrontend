import {
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  Usuario,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constants/importacion-armas-explosivo.enum';
import { Tramite240108Query } from '../../estados/tramite240108Query.query';

/**
 * @title Paso Dos
 * @component PasoDosComponent
 * @description
 * Componente responsable de gestionar el segundo paso del procedimiento.
 * Administra los requisitos documentales, consulta catálogos desde el servicio y gestiona la selección de documentos por parte del usuario.
 *
 * @example
 * <app-paso-dos></app-paso-dos>
 */
@Component({
  selector: 'app-paso-dos',
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
   * Indica si la carga de documentos se realizó correctamente.
   */
  cargaRealizada: boolean = false;

  /**
   * Indica si la carga del archivo se encuentra en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
   * Emite el estado de la carga en progreso hacia el componente padre.
   */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
   * Identificador único de la solicitud actual.
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
   * Textos estáticos utilizados en el paso de carga de documentos.
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * Lista local de tipos de documentos disponibles.
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * Evento interno para reenviar la solicitud de carga de documentos.
   */
  reenviarEvento = new EventEmitter<void>();

  /**
   * Evento que indica si existen documentos para cargar,
   * utilizado para habilitar el botón "Cargar Archivos" en <solicitud-page>.
   */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

  /**
   * Evento que notifica que la carga de documentos ha finalizado.
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();

  /**
   * Tipo de alerta Bootstrap utilizada para mensajes informativos.
   */
  public infoAlert: string = 'alert-info';

  /**
   * Catálogo de documentos obtenido desde el API.
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * Lista de documentos seleccionados por el usuario.
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * Subject utilizado para cancelar suscripciones activas
   * al destruir el componente y prevenir memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param catalogosServices Servicio para obtener catálogos desde el API.
   * @param tramiteQuery Servicio para obtener el estado actual del trámite.
   */
  constructor(
    private catalogosServices: CatalogosService,
    private tramiteQuery: Tramite240108Query
  ) { }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Escucha el evento de carga de archivos y obtiene el catálogo de documentos.
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

    this.getTiposDocumentos();
  }

  /**
   * Obtiene el catálogo de tipos de documentos requeridos para el trámite.
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
   * @param existenDocumentosParaCargar Indica si hay documentos pendientes.
   */
  manejarEventoCargaDocumento(existenDocumentosParaCargar: boolean): void {
    this.reenviarEventoCarga.emit(existenDocumentosParaCargar);
  }

  /**
   * Actualiza el estado de carga realizada y notifica al componente padre.
   * @param cargaRealizada Indica si la carga se completó correctamente.
   */
  documentosCargados(cargaRealizada: boolean): void {
    this.cargaRealizada = cargaRealizada;
    this.reenviarCargaRealizada.emit(this.cargaRealizada);
  }

  /**
   * Maneja el evento de carga en progreso emitido por el componente hijo.
   * @param carga Indica si la carga sigue en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
    this.cargaEnProgresoChange.emit(this.cargaEnProgreso);
  }

  /**
  * Hook del ciclo de vida que se ejecuta antes de destruir el componente.
  * Finaliza todas las suscripciones activas.
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
