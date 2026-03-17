import {
  AlertComponent,
  AnexarDocumentosComponent,
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  TEXTOS,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente que representa el paso dos del trámite.
 */
@Component({
  selector: 'paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
  standalone: true,
  imports: [AnexarDocumentosComponent, AlertComponent, TituloComponent],
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Constante que contiene los textos utilizados en el componente.
   * @type {any}
   */
  TEXTOS = TEXTOS;

  /**
   * Lista de tipos de documentos disponibles para el trámite.
   * @type {Catalogo[]}
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * Clase CSS para mostrar alertas informativas.
   * @type {string}
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo de documentos disponibles para el trámite.
   * @type {Catalogo[]}
   */
  catalogoDocumentos: Catalogo[] = [];

  /** Observable para manejar la destrucción de suscripciones */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Evento emitido para reenviar el evento de carga de documentos al componente padre.
   */
  @Output() reenviarEvento = new EventEmitter<void>();

/**
 * Evento emitido para regresar a la sección de carga de documentos en el componente padre.
 */
  @Output() regresarSeccionCargarDocumentoEvento = new EventEmitter<void>()

  /**
   * Constructor del componente.
   * @param catalogosServices Servicio para obtener los catálogos necesarios para el trámite.
   */
  constructor(private catalogosServices: CatalogosService) {
    // Constructor utilizado para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Se encarga de obtener los tipos de documentos y establecer los documentos seleccionados por defecto.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   * Utiliza el servicio `CatalogosService` para obtener los datos.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        /**
         * Callback que se ejecuta cuando la solicitud es exitosa.
         * @param resp Respuesta del servicio con los tipos de documentos.
         */
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        /**
         * Callback que se ejecuta cuando ocurre un error en la solicitud.
         * @param _error Error devuelto por el servicio.
         */
        error: (_error): void => {
          return _error;
        },
      });
  }

  /**
   * Método que se llama cuando el componente es destruido.
   * Libera las suscripciones activas para evitar fugas de memoria.
   * @returns void
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
