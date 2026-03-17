/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogosService } from '@libs/shared/data-access-user/src/core/services/shared/catalogos/catalogos.service';
import { TEXTOS } from '@ng-mf/data-access-user';

/**
 * Componente para el paso dos del trámite 301.
 * Este componente se utiliza para mostrar los pasos del asistente - 301
 * Lista de pasos
 * Índice del paso
 */
@Component({
  selector: 'paso-dos',
  standalone: false,
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent implements OnInit {
  /**
   * Variable que almacena los textos de los componentes.
   */
  TEXTOS = TEXTOS;

  /**
   * Variable que almacena el tipo de alerta.
   */
  infoAlert = 'alert-info';

  /**
   * Variable que almacena el tipo de alerta.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Constructor del componente.
   * @param {CatalogosService} catalogosServices - Servicio para obtener los catálogos.
   */
  constructor(private catalogosServices: CatalogosService) {}

  /**
   * Método que se ejecuta al iniciar el componente
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
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
        error: (_error): void => {},
      });
  }
}
