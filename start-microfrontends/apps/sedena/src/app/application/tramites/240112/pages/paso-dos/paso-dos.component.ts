import { CATALOGOS_ID, Catalogo, CatalogosService, Usuario } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constants/agregar-destinatario.enum';
import { Tramite240112Query } from '../../estados/tramite240112Query.query';

/**
 * Componente encargado de gestionar el segundo paso del formulario de trámites.
 * Permite la selección de documentos requeridos por el usuario, obteniendo el catálogo
 * correspondiente desde un servicio y gestionando la selección y visualización de los mismos.
 *
 * @component
 *
 * @remarks
 * Utiliza servicios para obtener catálogos y maneja la suscripción a observables
 * para evitar fugas de memoria mediante un notificador de destrucción.
 *
 * @example
 * ```html
 * <app-paso-dos></app-paso-dos>
 * ```
 */
@Component({
  /**
   * Selector HTML para usar el componente dentro de otras plantillas.
   */
  selector: 'app-paso-dos',

  /**
   * Ruta al archivo HTML que define la estructura visual del componente.
   */
  templateUrl: './paso-dos.component.html',

  /**
   * Ruta al archivo SCSS que contiene los estilos del componente.
   */
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {

  /**
 * Indica si el componente se encuentra en modo prellenado.
 * Cuando es true, los datos ya han sido cargados previamente.
 */
  esPrellenado: boolean = false;

  /**
* Evento que notifica al componente padre
* la acción de reenviar o regresar a la sección anterior.
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
    * Identificador único de la solicitud.
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
   * Textos estáticos usados en este paso del formulario,
   * importados desde una enumeración de constantes.
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * Lista temporal para gestionar tipos de documentos requeridos.
   * Puede ser usada para control de selección o filtros locales.
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * Clase CSS para mostrar alertas informativas dentro del componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Catálogo de tipos de documentos obtenidos desde el servicio API,
   * que se muestra para selección por parte del usuario.
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * Lista de documentos que el usuario ha seleccionado durante este paso.
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * Notificador para cancelar suscripciones y evitar fugas de memoria.
   * Se utiliza en combinación con `takeUntil` en las suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor que inyecta el servicio de catálogos para obtener datos.
   *
   * @param catalogosServices Servicio para obtener catálogos desde API.
   */
  constructor(private catalogosServices: CatalogosService, private tramiteQuery: Tramite240112Query) {
    // No se requiere lógica adicional en el constructor.
  }

  /**
   * Hook de inicialización de Angular.
   * Se ejecuta al crear el componente e inicia la carga de datos.
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
   * Obtiene el catálogo de tipos de documentos desde el servicio.
   * Al obtener la respuesta, actualiza la propiedad `catalogoDocumentos`.
   * Usa `takeUntil` para limpiar la suscripción cuando se destruya el componente.
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
   * Hook de destrucción de Angular.
   * Se ejecuta antes de eliminar el componente para limpiar suscripciones
   * y liberar recursos.
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
