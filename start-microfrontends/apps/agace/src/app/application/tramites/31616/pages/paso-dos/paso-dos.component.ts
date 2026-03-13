import { CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente que representa el segundo paso de un flujo de captura,
 * donde se muestran y seleccionan tipos de documentos disponibles.
 *
 * @export
 * @class PasoDosComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Sujeto utilizado para manejar la destrucción de observables.
   * Este objeto se utiliza para evitar pérdidas de memoria al cancelar suscripciones activas.
   *
   * @private
   * @type {Subject<void>}
   * @memberof PasoDosComponent
   */
  private destroyed$ = new Subject<void>();

  /**
   * Conjunto de textos utilizados en el componente.
   * Se obtienen desde una fuente centralizada para facilitar su mantenimiento y reutilización.
   *
   * @type {*}
   * @memberof PasoDosComponent
   */
  TEXTOS = TEXTOS;

  /**
   * Lista de tipos de documentos disponibles que pueden ser seleccionados por el usuario.
   *
   * @type {Catalogo[]}
   * @memberof PasoDosComponent
   */
  tiposDocumentos: Catalogo[] = [];

  /**
   * Clase CSS utilizada para mostrar mensajes informativos en la interfaz.
   *
   * @type {string}
   * @memberof PasoDosComponent
   */
  infoAlert = 'alert-info';

  /**
   * Catálogo completo de documentos obtenidos desde el servicio.
   *
   * @type {Catalogo[]}
   * @memberof PasoDosComponent
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Constructor del componente.
   * Inyecta el servicio `CatalogosService` para obtener los catálogos de datos necesarios.
   *
   * @param {CatalogosService} catalogosServices - Servicio para obtener catálogos.
   * @memberof PasoDosComponent
   */
  constructor(public catalogosServices: CatalogosService) {
    //Añade lógica aquí
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Carga los tipos de documentos disponibles desde el servicio de catálogos.
   *
   * @memberof PasoDosComponent
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Obtiene el catálogo de tipos de documentos desde el servicio de catálogos.
   * El resultado se almacena en la propiedad `catalogoDocumentos`.
   *
   * @memberof PasoDosComponent
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
          // Manejo de errores, pendiente de implementación
        },
      });
  }

  /**
   * Método del ciclo de vida de Angular que se llama al destruir el componente.
   * Completa el observable `destroyed$` para cancelar todas las suscripciones activas
   * y liberar recursos.
   *
   * @memberof PasoDosComponent
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
