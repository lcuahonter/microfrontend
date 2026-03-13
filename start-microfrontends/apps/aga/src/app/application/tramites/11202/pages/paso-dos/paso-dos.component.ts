import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS, Usuario } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit {
  TEXTOS = TEXTOS;
  tiposDocumentos: Catalogo[] = [];
  infoAlert = 'alert-info';
  catalogoDocumentos: Catalogo[] = [];
  documentosSeleccionados: Catalogo[] = [];
  /**
   * EventEmitter used as an @Input to request that the component load or process files.
   *
   * When the parent component calls .emit() on this emitter, the PasoDos component should
   * perform the corresponding action (for example: open a file dialog, start processing
   * queued files, or refresh the displayed file list).
   */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /**
   * Identifier of the "tipo de trámite" supplied by the parent component.
   *
   * This Angular @Input expects a non-empty string that uniquely identifies which
   * trámite the component should display or operate on (for example a numeric id
   * like "11202", a code, or a UUID). The component uses this value to load and
   * configure related data and UI.
   */
  @Input() idTipoTRamite!: string;

  /**
   * Datos del usuario asociados a este paso del trámite.
   *
   * Se utiliza para prellenar o mostrar información específica del usuario dentro del componente.
   * Puede ser:
   * - undefined — no se ha proporcionado ningún valor (estado por defecto),
   * - null — se ha proporcionado explícitamente la ausencia de usuario,
   * - Usuario — objeto de usuario válido con los datos esperados.
   */
  @Input() datosUsuario!: Usuario;
  /**
   * Evento de salida que notifica al componente padre sobre la necesidad de reenviar
   * una carga previamente realizada.
   *
   * Se emite con un booleano:
   *  - true: solicitar el reenvío de la carga.
   *  - false: indicar la cancelación o que no se solicita reenvío.
   *
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();


  /**
   * Event emitted to request a re-send of the carga (upload/load) operation.
   *
   * The payload is a boolean:
   * - `true`  => request to perform the re-send action
   * - `false` => indicates cancellation or a negative response
   *
   * Intended as an @Output EventEmitter for parent components to subscribe to
   * and trigger the appropriate re-send handling.
   */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

  public destroyed$: Subject<void> = new Subject();

  /**
 * Evento que se emite para reenviar la solicitud de carga de documentos.
 * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
 */
  reenviarEvento = new EventEmitter<void>();

  /**
 * Indica si la carga de documentos se realizó correctamente.
 * @type {boolean}
 */
  cargaRealizada = false;

  constructor(private catalogosServices: CatalogosService) { }
  /**
   *
Gancho del ciclo de vida angular que se llama después de que se inicializan las propiedades enlazadas a datos.
   */
  ngOnInit(): void {
    this.cargaArchivosEvento
      .pipe(
        takeUntil(this.destroyed$),
        map(() => {
          this.reenviarEvento.emit();
        })
      )
      .subscribe();
   
  }
 
  /**
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
      });
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
  * Maneja el evento de carga de documentos y emite un evento con el estado.
  * @param existenDocumentosParaCargar - Indica si hay documentos para cargar.
  * @returns void
  */
  manejarEventoCargaDocumento(existenDocumentosParaCargar: boolean): void {
    this.reenviarEventoCarga.emit(existenDocumentosParaCargar);
  }

    /**
   * Maneja el evento de carga de documentos y emite un evento con el estado.
   * @param cargaEnProgreso - Indica si hay documentos para cargar.
   * @returns void
   */
  cargaEnProgreso(cargaEnProgreso: boolean): void {
    this.cargaRealizada = cargaEnProgreso;
    this.reenviarEventoCarga.emit(cargaEnProgreso);
  }

}