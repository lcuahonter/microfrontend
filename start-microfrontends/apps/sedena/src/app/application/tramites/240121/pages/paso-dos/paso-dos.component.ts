import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Usuario } from '@ng-mf/data-access-user';
import { Tramite240121Query } from '../../estados/tramite240121Query.query';
import { TEXTOS_REQUISITOS } from '../../constantes/exportacion-armas-explosivo.enum';
import { map, Subject, takeUntil } from 'rxjs';
/**
 * @component PasoDosComponent
 * @description
 * Componente encargado de mostrar y gestionar la información correspondiente al paso dos del flujo del trámite.
 * Utiliza constantes definidas en el módulo de acceso a datos del usuario para mostrar textos estáticos en la plantilla.
 */
@Component({
  selector: 'paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss'],
})
export class PasoDosComponent {

  /**
* Escucha el evento para cargar los documentos que se emite desde <solicitud-page>.
* @type {EventEmitter<void>}
*/
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /**
 * Identificador único de la solicitud actual.
 */
  @Input() idSolicitud!: string;

  /**
   * Identificador del tipo de trámite asociado a la solicitud.
   */
  @Input() idTipoTRamite!: string;

  /**
   * Información del usuario que contiene los datos necesarios
   * para la gestión y carga de catálogos.
   */
  @Input() datosUsuario!: Usuario;

  /**
 * Evento que notifica al componente padre cuando se solicita
 * regresar a la sección anterior.
 */
  @Output() reenviarRegresarSeccion = new EventEmitter<void>();

  /** Emite un boleano sobre la carga del archivo */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

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
* Evento que se emite para reenviar la solicitud de carga de documentos.
* Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
*/
  reenviarEvento = new EventEmitter<void>();

  /**
   * @property destroyNotifier$
   * @description Notifier used to unsubscribe from observables when the component is destroyed.
   * Prevents memory leaks.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Indica si el formulario se encuentra en modo prellenado.
 * Se utiliza para controlar comportamientos o validaciones específicas.
 */
  esPrellenado: boolean = false;

  /**
* Indica si la carga de documentos se realizó correctamente.
* @type {boolean}
*/
  cargaRealizada = false;

  /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;

  /**
   * @property {any} TEXTOS
   * @description
   * Constantes de textos utilizadas en la plantilla del componente.
   * Estas constantes pueden incluir títulos, descripciones, instrucciones, etc.
   *
   * @see TEXTOS desde @ng-mf/data-access-user
   */
  TEXTOS = TEXTOS_REQUISITOS;

  /**
     * @constructor
     * @param catalogosServices Service to fetch catalog data needed in the form.
     */
  constructor(private tramiteQuery: Tramite240121Query) {
    // Dependencies are injected here. No initialization logic needed.
  }

  /**
 * Inicializa el componente suscribiéndose al evento de carga de archivos
 * para reenviar la notificación y configura el texto dinámico con el ID
 * de la solicitud actual.
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
