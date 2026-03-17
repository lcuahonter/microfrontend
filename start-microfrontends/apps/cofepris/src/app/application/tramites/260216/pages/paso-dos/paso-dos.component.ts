/**
 * Componente utilizado en el trámite 260216 para gestionar la funcionalidad del segundo paso del flujo del trámite.
 *
 * Este archivo contiene la definición del componente `PasoDosComponent`, que permite mostrar los requisitos
 * y anexar documentos necesarios para el trámite. También interactúa con servicios para obtener catálogos
 * de documentos relacionados.
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
 * Componente de Angular que representa el segundo paso en el flujo del trámite 260216.
 * Se utiliza para mostrar los requisitos y anexar documentos necesarios para el trámite.
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
 * - AlertComponent: Componente reutilizable para mostrar alertas.
 * - TituloComponent: Componente reutilizable para mostrar títulos.
 * - AnexarDocumentosComponent: Componente reutilizable para anexar documentos.
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
   * @property {typeof TEXTOS_REQUISITOS} TEXTOS
   * Texto utilizado en el componente para mostrar mensajes de requisitos.
   */
  TEXTOS = TEXTOS_REQUISITOS;

  /**
   * @property {Catalogo[]} tiposDocumentos
   * Lista de tipos de documentos disponibles para el trámite.
   * @defaultValue []
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * @property {string} infoAlert
   * Tipo de alerta utilizada en el componente.
   * @defaultValue 'alert-info'
   */
  infoAlert = 'alert-info';

  /**
   * @property {Catalogo[]} catalogoDocumentos
   * Catálogo de documentos disponibles para el trámite.
   * @defaultValue []
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * @property {Subject<void>} destroyNotifier$
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa para limpiar suscripciones cuando el componente es destruido.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description
   * Constructor que inyecta el servicio `CatalogosService` para obtener datos relacionados con los catálogos.
   *
   * @param {CatalogosService} catalogosServices - Servicio para obtener catálogos de datos relacionados con el trámite.
   */
  constructor(private catalogosServices: CatalogosService) {}

  /**
   * @method ngOnInit
   * @description
   * Hook del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama al método `getTiposDocumentos` para obtener los tipos de documentos disponibles.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @method getTiposDocumentos
   * @description
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   * Actualiza la propiedad `catalogoDocumentos` con los datos obtenidos del servicio.
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
   * @description
   * Hook del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}