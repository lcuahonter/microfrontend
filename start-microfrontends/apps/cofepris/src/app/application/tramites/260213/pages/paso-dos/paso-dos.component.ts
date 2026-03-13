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
 * @component PasoDosComponent
 * @description Componente correspondiente al segundo paso de un flujo
 * o asistente (wizard). Se encarga de gestionar la obtención de tipos de
 * documentos desde un servicio y la presentación de alertas, títulos y
 * la sección de anexado de documentos.
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
   * @property TEXTOS
   * @description Constante que contiene los textos y rótulos necesarios
   * para los requisitos médicos en este paso.
   * @type {typeof TEXTOS_REQUISITOS}
   */
  TEXTOS = TEXTOS_REQUISITOS;

  /**
   * @property tiposDocumentos
   * @description Arreglo que almacena los tipos de documentos cargados
   * desde el servicio de catálogos.
   * @type {Catalogo[]}
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * @property infoAlert
   * @description Cadena que define el estilo de la alerta a mostrar.
   * En este caso, `'alert-info'` se utiliza para mostrar una alerta informativa.
   * @type {string}
   */
  infoAlert = 'alert-info';

  /**
   * @property catalogoDocumentos
   * @description Arreglo que contiene el catálogo de documentos disponible,
   * obtenido desde el servicio de catálogos.
   * @type {Catalogo[]}
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * @property documentosSeleccionados
   * @description Arreglo de documentos seleccionados por el usuario,
   * que se gestionarán o anexarán dentro de este paso.
   * @type {Catalogo[]}
   */
  documentosSeleccionados: Catalogo[] = [];

  /**
   * @property destroyNotifier$
   * @description Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description Constructor que inyecta el servicio de catálogos para
   * obtener los tipos de documentos necesarios.
   * @param {CatalogosService} catalogosServices - Servicio para la obtención
   * de catálogos (tipos de documentos, etc.).
   */
  constructor(private catalogosServices: CatalogosService) {
    // Constructor vacío, ya que solo se inyecta el servicio.
  }

  /**
   * @method ngOnInit
   * @description Hook de ciclo de vida de Angular que se ejecuta al inicializar
   * el componente. Llama a `getTiposDocumentos()` para cargar la lista de
   * tipos de documentos disponibles.
   * @returns {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @method getTiposDocumentos
   * @description Obtiene el catálogo de los tipos de documentos disponibles
   * para este trámite a través del `CatalogosService`.
   * Suscribe al observable y almacena los resultados en `catalogoDocumentos`.
   * Si la respuesta contiene elementos, se asignan al arreglo.
   * @returns {void}
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
   * @description Hook de ciclo de vida de Angular que se ejecuta justo antes de
   * destruir el componente. Emite `next()` y `complete()` al `destroyNotifier$`
   * para cancelar todas las suscripciones activas y evitar fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
