import {
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  TEXTOS,
} from '@libs/shared/data-access-user/src';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Componente que representa el segundo paso del proceso de solicitud.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /** Textos usados en el componente, provenientes de una fuente centralizada. */
  TEXTOS = TEXTOS;

  /** Lista de tipos de documentos disponibles para selección. */
  tiposDocumentos: Catalogo[] = [];

  /** Clase de estilo para mensajes de alerta informativa. */
  infoAlert = 'alert-info';

  /** Catálogo completo de documentos disponibles. */
  catalogoDocumentos: Catalogo[] = [];

  /** Subject para manejar la destrucción de observables. */
  private destroy$ = new Subject<void>();

  /**
   * Constructor del componente.
   *
   * @param catalogosServices Servicio para obtener los catálogos necesarios.
   */
  constructor(
    @Inject(CatalogosService) private catalogosServices: CatalogosService
  ) {
    // Dependencia inyectada para uso posterior
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * Inicializa la lista de tipos de documentos disponibles y define algunos
   * documentos seleccionados por defecto.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * Completa todos los observables para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Obtiene el catálogo de tipos de documentos disponibles para el trámite.
   *
   * Este método realiza una solicitud al servicio de catálogos para cargar la lista
   * de documentos disponibles que el usuario podrá seleccionar.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp): void => {
          // Si la respuesta tiene documentos, los almacena en catalogoDocumentos
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error): void => {
          // Manejo de errores, actualmente vacío pero puede ser implementado
        },
      });
  }
}
