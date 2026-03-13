import { CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS } from '@libs/shared/data-access-user/src';
import { Component, Inject, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
/**
 * Componente para gestionar el paso dos del trámite 80210.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnDestroy {
  /**
   * Objeto con los textos de los requisitos.
   * @property {object} TEXTOS_REQUISITOS - Textos para los requisitos del certificado zoosanitario. --220201
   */

  /** Catálogo completo de documentos disponibles. */
  catalogoDocumentos: Catalogo[] = [];

  /** Textos usados en el componente, provenientes de una fuente centralizada. */
  TEXTOS = TEXTOS;

  /** Clase de estilo para mensajes de alerta informativa. */
  infoAlert = 'alert-info';

  /**
   * Notificación para destruir observables al destruir el componente.
   */
  destoryNotification$: Subject<void> = new Subject<void>();
  
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
   * Obtiene el catálogo de tipos de documentos disponibles para el trámite.
   *
   * Este método realiza una solicitud al servicio de catálogos para cargar la lista
   * de documentos disponibles que el usuario podrá seleccionar.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destoryNotification$))
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

  /**
   * Método de limpieza al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destoryNotification$.next();
    this.destoryNotification$.complete();
  }

}