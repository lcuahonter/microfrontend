import { CATALOGOS_ID, Catalogo, CatalogosService, Usuario } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constants/solicitud-de-prorroga-importacion-material-explosivo.enum';
import { Tramite240321Query } from '../../estados/tramite240321Query.query';

/**
 * @component PasoDosComponent
 * @description
 * Componente correspondiente al segundo paso del flujo de un trámite,
 * destinado a la gestión y anexado de documentos requeridos.
 * Consulta el catálogo de tipos de documentos disponibles mediante un servicio.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
 * Indica si la sección se encuentra en modo prellenado.
 * Se utiliza para controlar el comportamiento y la visualización
 * de los datos cuando estos ya vienen cargados previamente.
 * @type {boolean}
 */
  esPrellenado: boolean = false;

  /**
* Evento que se emite para notificar al componente padre
* que se debe reenviar o regresar a la sección anterior.
* @type {EventEmitter<void>}
*/
  @Output() reenviarRegresarSeccion = new EventEmitter<void>();

  /**
* Escucha el evento para cargar los documentos que se emite desde <solicitud-page>.
* @type {EventEmitter<void>}
*/
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /**
* Indica si la carga de documentos se realizó correctamente.
* @type {boolean}
*/
  cargaRealizada = false;

  /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;

  /** Emite un boleano sobre la carga del archivo */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

  /**
 * ID de la solicitud actual.
 */
  @Input() idSolicitud!: string;

  /**
* ID de la tipo de trámite.
* @type {string}
*/
  @Input() idTipoTRamite!: string;

  /**
* Servicio para gestionar los catálogos.
*/
  @Input() datosUsuario!: Usuario;

  /**
* Evento que se emite para reenviar la solicitud de carga de documentos.
* Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
*/
  reenviarEvento = new EventEmitter<void>();

  /**
* Evento que se emite para indicar si existen documentos para cargar, y así activar el botón de "Cargar Archivos en <solicitud-page>".
* Este evento se utiliza para habilitar o deshabilitar el botón de carga de archivos en <solicitud-page>.
*/
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

  /**
  * Evento que se emite para indicar si la carga de documentos se ha realizado.
  * Este evento se utiliza para notificar a otros componentes que la carga de documentos ha finalizado.
  */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();

  /**
   * Textos estáticos que se utilizan en la interfaz de este paso.
   * 
   * @type {typeof TEXTOS_REQUISITOS}
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * Tipos de documentos definidos por el catálogo (local).
   * 
   * @type {Catalogo[]}
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * Clase CSS de alerta informativa (usualmente de Bootstrap).
   * 
   * @default 'alert-info'
   * @type {string}
   */
  public infoAlert = 'alert-info';

  /**
   * Catálogo de documentos obtenidos desde la API.
   * 
   * @type {Catalogo[]}
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * Documentos que el usuario ha seleccionado en este paso.
   * 
   * @type {Catalogo[]}
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * Notificador para cancelar las suscripciones activas al destruir el componente.
   * 
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject<void>();

  /**
   * Constructor que inyecta el servicio de catálogos.
   * 
   * @param catalogosServices Servicio para recuperar datos de catálogos necesarios en el formulario.
   */
  constructor(private catalogosServices: CatalogosService, private tramiteQuery: Tramite240321Query) { }

  /**
   * @method ngOnInit
   * @description
   * Hook de ciclo de vida de Angular. Se ejecuta al inicializar el componente.
   * Inicia la carga de los tipos de documentos requeridos.
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
   * @method getTiposDocumentos
   * @description
   * Recupera el catálogo de tipos de documentos necesarios para este paso.
   * El resultado se almacena en `catalogoDocumentos`.
   */
  public getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp: Catalogo[]): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
      });
  }

  /**
   * @method ngOnDestroy
   * @description
   * Hook de ciclo de vida de Angular que se ejecuta justo antes de destruir el componente.
   * Cancela las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
 * Maneja el evento de carga de documentos y emite un evento con el estado.
 * @param existenDocumentosParaCargar - Indica si hay documentos para cargar.
 * @returns void
 */
  manejarEventoCargaDocumento(existenDocumentosParaCargar: boolean): void {
    this.reenviarEventoCarga.emit(existenDocumentosParaCargar);
  }

  /**
* Actualiza el estado de carga de documentos y emite un evento con el nuevo valor.
* @param cargaRealizada Indica si la carga de documentos se realizó correctamente.
* @returns void
*/
  documentosCargados(cargaRealizada: boolean): void {
    this.cargaRealizada = cargaRealizada;
    this.reenviarCargaRealizada.emit(this.cargaRealizada);
  }

  /**
* Maneja el evento de carga en progreso emitido por un componente hijo.
* Actualiza el estado de cargaEnProgreso según el valor recibido.
* @param carga Valor booleano que indica si la carga está en progreso.
*/
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
    this.cargaEnProgresoChange.emit(this.cargaEnProgreso);
  }

}