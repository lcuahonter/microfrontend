import {
  AlertComponent,
  AnexarDocumentosComponent,
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  TEXTOS,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente que representa la funcionalidad de la paso dos 230202.
 */
@Component({
  selector: 'paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss'],
  standalone: true,
  imports: [TituloComponent, AlertComponent, AnexarDocumentosComponent],
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Constante que contiene los textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * Arreglo que contiene los tipos de documentos disponibles.
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * Clase CSS para mostrar una alerta informativa.
   */
  infoAlert = 'alert-info';

  /**
   * Arreglo que contiene el catálogo de documentos disponibles.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Arreglo que contiene los documentos seleccionados.
   */
  documentosSeleccionados: Catalogo[] = [];

  /**
   * Sujeto para notificar la destrucción del componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param catalogosServices Servicio para obtener los catálogos.
   */
  constructor(private catalogosServices: CatalogosService) {
    // Constructor no vacío para evitar el error de ESLint.
  }

  /**
   * Método de inicialización del componente.
   * Se ejecuta al inicializar el componente y obtiene los tipos de documentos.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp): void => {
          if (Array.isArray(resp) && resp.length > 0) {
            this.catalogoDocumentos = resp;
          } else {
            console.error(
              'Unexpected response format for tipos de documentos',
              resp
            );
          }
        },
        error: (_error): void => {
          console.error(
            'Error al obtener el catálogo de tipos de documentos',
            _error
          );
        },
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar las suscripciones.
   */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}
