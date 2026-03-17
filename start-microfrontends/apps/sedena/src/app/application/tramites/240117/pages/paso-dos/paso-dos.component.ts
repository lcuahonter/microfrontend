import { AlertComponent, CATALOGOS_ID, CargaDocumentoComponent, Catalogo, CatalogosService, Usuario } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Subject } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constantes/exportacion-quimicas-sustancias.enum';
import { TituloComponent } from '@ng-mf/data-access-user';
import { takeUntil } from 'rxjs';
import { Tramite240117Query } from '../../estados/tramite240117Query.query';

/**
 * @component
 * @name PasoDosComponent
 * @description Este componente representa el segundo paso de un formulario en el flujo de trámites.
 * Se encarga de manejar la lógica relacionada con los tipos de documentos requeridos y seleccionados
 * por el usuario, así como de interactuar con los servicios necesarios para obtener los datos del catálogo.
 * 
 * @example
 * <app-paso-dos></app-paso-dos>
 * 
 * @implements OnInit
 * @implements OnDestroy
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [CommonModule, AlertComponent, TituloComponent, CargaDocumentoComponent],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
    * @property TEXTOS
    * @description Contains static text literals used in this step of the form.
    * @type {typeof TEXTOS_REQUISITOS}
    */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
 * Indica si el componente se encuentra en modo prellenado.
 * Cuando es true, los datos ya vienen cargados previamente.
 */
  esPrellenado: boolean = false;

  /**
 * Evento que notifica al componente padre
 * que se debe reenviar o regresar a la sección anterior.
 */
  @Output() reenviarRegresarSeccion = new EventEmitter<void>();

  /**
   * Identificador de la solicitud actual.
   */
  @Input() idSolicitud!: string;

  /**
   * Identificador del tipo de trámite asociado a la solicitud.
   */
  @Input() idTipoTRamite!: string;

  /**
* Servicio para gestionar los catálogos.
*/
  @Input() datosUsuario!: Usuario;

  /**
* Escucha el evento para cargar los documentos que se emite desde <solicitud-page>.
* @type {EventEmitter<void>}
*/
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /**
* Evento que se emite para indicar si existen documentos para cargar, y así activar el botón de "Cargar Archivos en <solicitud-page>".
* Este evento se utiliza para habilitar o deshabilitar el botón de carga de archivos en <solicitud-page>.
*/
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

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
* Evento que se emite para indicar si la carga de documentos se ha realizado.
* Este evento se utiliza para notificar a otros componentes que la carga de documentos ha finalizado.
*/
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();

  /**
* Evento que se emite para reenviar la solicitud de carga de documentos.
* Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
*/
  reenviarEvento = new EventEmitter<void>();

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
   * @constructor
   * @param catalogosServices Service to fetch catalog data needed in the form.
   */
  constructor(private catalogosServices: CatalogosService, private tramiteQuery: Tramite240117Query) {
    // Dependencies are injected here. No initialization logic needed.
  }

  /**
   * @method ngOnInit
   * @description Angular lifecycle hook triggered on component initialization.
   * Initiates the fetch of document types.
   * @returns {void}
   */
  ngOnInit(): void {
    const idSolicitud = this.tramiteQuery.getValue().idSolicitud;
    this.TEXTOS = TEXTOS_REQUISITOS.replace(
      '[ID_SOLICITUD]',
      idSolicitud ? idSolicitud.toString() : '------'
    );
    this.getTiposDocumentos();
    this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(() => {
          this.reenviarEvento.emit();
        })
      )
      .subscribe();
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
