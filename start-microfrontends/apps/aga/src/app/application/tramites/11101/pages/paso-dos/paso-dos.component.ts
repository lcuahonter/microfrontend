import {
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  TEXTOS
} from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import { DOCUMENTOS_SELECCIONADOS } from '../../constants/mercancia.enum';

/**
 * Componente para gestionar el paso dos del trámite.
 * Este componente se encarga de manejar los documentos requeridos para el trámite.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit {
  /**
   * Textos utilizados en el componente.
   * @type {typeof TEXTOS}
   */
  TEXTOS = TEXTOS;

  /**
   * Lista de tipos de documentos disponibles.
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

  /**
   * Lista de documentos seleccionados por el usuario.
   * @type {Catalogo[]}
   */
  documentosSeleccionados: Catalogo[] = [];

  /**
   * Constructor de la clase. Inyecta los servicios necesarios.
   * @param {CatalogosService} catalogosServices - Servicio para obtener los catálogos de documentos.
   */
  constructor(private catalogosServices: CatalogosService) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura los documentos seleccionados por defecto y obtiene los tipos de documentos disponibles.
   * @returns {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
    this.documentosSeleccionados =DOCUMENTOS_SELECCIONADOS
  }

  /**
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   * Este método utiliza el servicio `CatalogosService` para obtener los datos.
   * 
   * @returns {void}
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error): void => {
          return _error;
        },
      });
  }
}