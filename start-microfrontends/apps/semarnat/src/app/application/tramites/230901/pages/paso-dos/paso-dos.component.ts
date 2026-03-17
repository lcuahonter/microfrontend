import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject, input, signal } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';

import { CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS, Usuario } from '@ng-mf/data-access-user';
import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';


/**
 * @class PasoDosComponent
 * @description
 * Este componente gestiona el segundo paso de un trámite, donde se anexan documentos y se muestran alertas.
 *
 * @since 1.0.0
 * @version 1.0.0
 * @license MIT
 *
 * @selector app-paso-dos
 * @standalone true
 * @requires CommonModule
 * @requires AnexarDocumentosComponent
 * @requires AlertComponent
 * @requires TituloComponent
 *
 * @templateUrl ./paso-dos.component.html
 * @styleUrl ./paso-dos.component.scss
 */
@Component({
  selector: 'paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  public catalogosServices = inject(CatalogosService)
  /** Obtener el valor de la instrucción e inicializar la variable */
  TEXTOS = TEXTOS;
  @Input() regresarSeccionCargarDocumentoEvento!: EventEmitter<void>;

  /** Escucha el evento para cargar los documentos que se emite desde <solicitud>. */
  @Input() cargaArchivosEvento!: EventEmitter<void>;

  /** Carga progreso del archivo */
  @Output() cargaEnProgreso = new EventEmitter<boolean>();

  /**
   * Evento que se emite para reenviar la solicitud de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
   */
  @Output() reenviarEvento = new EventEmitter<void>();

  /**
   * Evento que se emite para regresar a la sección de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe regresar a la sección de carga de documentos.
   */
  @Output() reenviarRegresarSeccion = new EventEmitter<void>();

  /** Clase CSS para la alerta de información. */
  infoAlert = 'alert-info';

  /** Catálogo de documentos disponibles. */
  catalogoDocumentos: Catalogo[] = [];

  /** Documentos seleccionados por el usuario. */
  documentosSeleccionados: Catalogo[] = [];

  /** Subject para destruir notificador. */
  public destroyed$: Subject<void> = new Subject();

  /** Indica si la carga de documentos se realizó correctamente. */
  cargaRealizada = false;

  /**
   * Evento que se emite para indicar si la carga de documentos se ha realizado.
   * Este evento se utiliza para notificar a otros componentes que la carga de documentos ha finalizado.
   */
  @Output() reenviarCargaRealizada = new EventEmitter<boolean>();

  /** Información del usuario actual. */
  datosUsuario: Usuario = USUARIO_INFO;

  /** Información del tipo tramite. */
  idTipoTramite = input.required<string>();

  idSolicitud = input.required<number>()

  /**
   * Evento que se emite para indicar si existen documentos para cargar, y así activar el botón de "Cargar Archivos en <solicitud>".
   * Este evento se utiliza para habilitar o deshabilitar el botón de carga de archivos en <solicitud>.
   */
  @Output() reenviarEventoCarga = new EventEmitter<boolean>();

  /** Obtiene los datos de solictud al guardar */
  //datosSolicitud = input.required<GuardaSolicitudResponse>(); //

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   */
  ngOnInit(): void {
    //this.datosUsuario.idSolicitud = +this.idSolicitud();
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
    //if (existenDocumentosParaCargar) { this.reenviarEvento.emit() } //temporal debe invocarse desde solictud por lo que entendi
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