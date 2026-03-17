import { Catalogo, CatalogosService, TEXTOS } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';

/** Componente que representa el segundo paso del trámite y permite anexar documentos. */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /** Observable para manejar la destrucción del componente y cancelar suscripciones. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Textos utilizados en el componente. */
  TEXTOS = TEXTOS;
  /** Lista de tipos de documentos disponibles para el trámite. */
  tiposDocumentos: Catalogo[] = [];
  /** Clase CSS para mostrar una alerta informativa. */
  claseAlertaInformativa = 'alert-info';
  /** Catálogo de documentos disponibles. */
  catalogoDocumentos: Catalogo[] = [];

  /** Constructor que inyecta el servicio de catálogos. */
  constructor(private catalogosServices: CatalogosService) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /** Método que se ejecuta al inicializar el componente y obtiene los tipos de documentos. */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /** Obtiene el catálogo de los tipos de documentos disponibles para el trámite. */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO).pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error): void => {
          // Manejo de error al obtener los tipos de documentos.
        },
      });
  }

  /** Método que se ejecuta al destruir el componente y libera recursos de suscripciones. */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}