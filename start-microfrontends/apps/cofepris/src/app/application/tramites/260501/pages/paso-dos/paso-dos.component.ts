import {
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  TEXTOS,
} from '@libs/shared/data-access-user/src';
import { Component, Inject, OnInit } from '@angular/core';

/**
 * Componente que representa el segundo paso del proceso de solicitud.

 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent implements OnInit {
  /** Textos usados en el componente, provenientes de una fuente centralizada. */
  TEXTOS = TEXTOS;

  /** Lista de tipos de documentos disponibles para selección. */
  tiposDocumentos: Catalogo[] = [];

  /** Clase de estilo para mensajes de alerta informativa. */
  infoAlert = 'alert-info';

  /** Catálogo completo de documentos disponibles. */
  catalogoDocumentos: Catalogo[] = [];

  /** Lista de documentos seleccionados por el usuario. */
  documentosSeleccionados: Catalogo[] = [];

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

    // Documentos seleccionados por defecto al iniciar el componente
    this.documentosSeleccionados = [
      {
        id: 1,
        descripcion: 'Documentos que amparen el valor de la mercancía',
      },
      {
        id: 2,
        descripcion:
          'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)',
      },
    ];
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
