import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

import { AlertComponent } from '@ng-mf/data-access-user';
import { AnexarDocumentosComponent } from '@ng-mf/data-access-user';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { TEXTOS } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
/**
 * @component PasoDosComponent
 * @description Componente correspondiente al segundo paso del flujo de solicitud.
 * Permite anexar documentos necesarios para el trámite, mostrando una lista
 * de tipos de documentos disponibles mediante un catálogo centralizado.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
  ],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnDestroy, OnInit {
  /**
   * @property {Subject<void>} destroyed$
   * Subject utilizado para manejar la desuscripción de observables cuando el componente se destruye.
   * @private
   */
  private destroyed$ = new Subject<void>();

  /**
   * @property {any} TEXTOS
   * Conjunto de textos utilizados dentro del componente (centralizados en una constante).
   */
  TEXTOS = TEXTOS;

  /**
   * @property {Catalogo[]} tiposDocumentos
   * Lista de tipos de documentos disponibles para seleccionar.
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * @property {string} infoAlert
   * Clase de estilo utilizada para mostrar alertas informativas.
   */
  infoAlert = 'alert-info';

  /**
   * @property {Catalogo[]} catalogoDocumentos
   * Catálogo completo de documentos cargado desde el servicio.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * @constructor
   * Inyecta el servicio de catálogos para obtener información dinámica relacionada a documentos.
   *
   * @param {CatalogosService} catalogosServices - Servicio de catálogos para cargar tipos de documentos.
   */
  constructor(public catalogosServices: CatalogosService) {
        // no realizar ninguna acción
  }

  /**
   * @method ngOnInit
   * @description Hook de ciclo de vida que se ejecuta al inicializar el componente.
   * Llama a `getTiposDocumentos()` para obtener los documentos del catálogo.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @method getTiposDocumentos
   * @description Obtiene del servicio los tipos de documentos disponibles para el trámite.
   * Almacena los resultados en `catalogoDocumentos`.
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
        error: (_error): void => {
          // Manejo de errores opcional
        },
      });
  }

  /**
   * @method ngOnDestroy
   * @description Hook de ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas usando `destroyed$`.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
