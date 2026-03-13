import { AlertComponent, CATALOGOS_ID, CargaDocumentoComponent, Catalogo, CatalogosService, TEXTOS, TituloComponent, Usuario } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

/**
 * Este componente se muestra en PasaDos
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    CargaDocumentoComponent,
    AlertComponent,
    TituloComponent,
  ]
})
export class PasoDosComponent implements OnInit, OnDestroy {

  @Input() regresarSeccionCargarDocumentoEvento!: EventEmitter<void>;

  /**
 * Escucha el evento para cargar los documentos que se emite desde <solicitud-page>.
 * @type {EventEmitter<void>}
 */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  @Input() idTipoTRamite!: string;
  /**
   * Textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * Evento que se emite para reenviar la solicitud de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
   */
  reenviarEvento = new EventEmitter<void>();

  /**
   * Evento que se emite para regresar a la sección de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe regresar a la sección de carga de documentos.
   */
  reenviarRegresarSeccion = new EventEmitter<void>();

  /**
   * Clase CSS para la alerta de información.
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo de documentos disponibles.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Documentos seleccionados por el usuario.
   */
  documentosSeleccionados: Catalogo[] = [];

  /**
   * Subject para destruir notificador.
   */
  public destroyed$: Subject<void> = new Subject();

  /**
  * Indica si la carga de documentos se realizó correctamente.
  * @type {boolean}
  */
  cargaRealizada = false;

  /**
   * Evento que se emite para indicar si la carga de documentos se ha realizado.
   * Este evento se utiliza para notificar a otros componentes que la carga de documentos ha finalizado.
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();

  /**
 * Evento que se emite para indicar si existen documentos para cargar, y así activar el botón de "Cargar Archivos en <solicitud-page>".
 * Este evento se utiliza para habilitar o deshabilitar el botón de carga de archivos en <solicitud-page>.
 */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

  /**
   * Servicio para gestionar los catálogos.
   */
  @Input() datosUsuario!: Usuario;

  /**
   * Constructor del componente.
   * 
   * @param catalogosServices Servicio para gestionar los catálogos.
   */
  constructor(
    private catalogosServices: CatalogosService,
  ) { }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
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

    // this.regresarSeccionCargarDocumentoEvento
    //   .pipe(
    //     takeUntil(this.destroyed$),
    //     map(() => {
    //       this.reenviarRegresarSeccion.emit();
    //     })
    //   )
    //   .subscribe();
  }

  /**
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        }
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
    * Se ejecuta al destruir el componente.
    * Emite un valor y completa el subject `destroyed$` para cancelar las suscripciones.
    */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}