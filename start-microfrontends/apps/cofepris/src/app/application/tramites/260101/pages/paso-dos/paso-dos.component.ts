/**
 * Componente utilizado en el trámite 260101 para gestionar la funcionalidad del paso dos.
 *
 * Este archivo contiene la definición del componente `PasoDosComponent`, que permite anexar documentos
 * relacionados con el trámite. También interactúa con servicios para obtener los catálogos de documentos disponibles.
 */

import {
  AlertComponent,
  AnexarDocumentosComponent,
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TEXTOS_REQUISITOS } from '../../constants/medicos-uso.enum';

/**
 * @component
 * @name PasoDosComponent
 * @description
 * Componente que gestiona la funcionalidad del paso dos del trámite 260101.
 * Permite al usuario anexar documentos y muestra información relevante sobre los requisitos del trámite.
 *
 * @selector app-paso-dos
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./paso-dos.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./paso-dos.component.css
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - AlertComponent: Componente para mostrar alertas informativas.
 * - TituloComponent: Componente para mostrar el título del paso.
 * - AnexarDocumentosComponent: Componente para anexar documentos al trámite.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    TituloComponent,
    AnexarDocumentosComponent,
  ],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.css',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * @property {string} TEXTOS
   * Contiene el texto de requisitos del trámite, importado desde las constantes.
   */
  TEXTOS = TEXTOS_REQUISITOS;

  /**
   * @property {Catalogo[]} tiposDocumentos
   * Lista de tipos de documentos disponibles para el trámite.
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * @property {string} infoAlert
   * Clase CSS utilizada para mostrar alertas informativas.
   */
  infoAlert = 'alert-info';

  /**
   * @property {Catalogo[]} catalogoDocumentos
   * Catálogo de documentos disponibles para anexar al trámite.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * @property {Catalogo[]} documentosSeleccionados
   * Lista de documentos seleccionados por el usuario.
   */
  documentosSeleccionados: Catalogo[] = [];

  /**
   * @property {Subject<void>} destroyNotifier$
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description
   * Constructor que inyecta el servicio `CatalogosService` para obtener los catálogos de documentos.
   *
   * @param {CatalogosService} catalogosServices - Servicio para obtener los catálogos de documentos.
   */
  constructor(private catalogosServices: CatalogosService) {}

  /**
   * @method ngOnInit
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama al método `getTiposDocumentos` para obtener los tipos de documentos disponibles.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @method getTiposDocumentos
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   * Realiza una solicitud al servicio `CatalogosService` y actualiza la lista de documentos disponibles.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
      });
  }

  /**
   * @method ngOnDestroy
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones activas y libera recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}