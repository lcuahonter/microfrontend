/**
 * Componente responsable de manejar el segundo paso del trámite 120301.
 * Incluye la lógica para obtener y gestionar los tipos de documentos y los documentos seleccionados.
 *
 * @example <app-paso-dos></app-paso-dos>
 *
 * @see TEXTOS
 */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import {CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS, Usuario } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';

/**
 * Constantes de textos utilizados en el componente.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Constantes de textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  @Input() regresarSeccionCargarDocumentoEvento!: EventEmitter<void>;

  /**
 * Escucha el evento para cargar los documentos que se emite desde <solicitud-page>.
 * @type {EventEmitter<void>}
 */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /**
 * ID del tipo de trámite actual.
 */
  @Input() idTipoTRamite!: string;

  /**
 * ID de la solicitud actual.
 */
  @Input() idSolicitud!: string;

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

  /** Carga del progreso del archivo */
  cargaEnProgreso: boolean = true;

  /** Emite un boleano sobre la carga del archivo */
  @Output() cargaEnProgresoChange = new EventEmitter<boolean>();

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
   * Maneja el evento de carga en progreso emitido por un componente hijo.
   * Actualiza el estado de cargaEnProgreso según el valor recibido.
   * @param carga Valor booleano que indica si la carga está en progreso.
   */
   onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
    this.cargaEnProgresoChange.emit(this.cargaEnProgreso);
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