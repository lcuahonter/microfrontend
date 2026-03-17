import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { TEXTOS } from '@ng-mf/data-access-user';
import documentList from '@libs/shared/theme/assets/json/32515/document-list.json';

/**
 * Este componente se muestra en el paso dos del asistente.
 * En este paso se inicializan y muestran los textos necesarios.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy{
  
  /**
   * Variable que almacena los textos utilizados en el componente.
   * Se inicializa con los textos provenientes de la constante TEXTOS importada.
   */
  TEXTOS = TEXTOS;
  tiposDocumentos: Catalogo[] = [];
  infoAlert = 'alert-info';
  catalogoDocumentos: Catalogo[] = [];
  documentosSeleccionados = documentList.documentosSeleccionados;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private catalogosServices: CatalogosService,
  ) { 
    // Constructor
  }

  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
    /**
 * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
 */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error): void => {
          // Manejo de error
         },
      });
  }
}
