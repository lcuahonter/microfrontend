import { Component, OnDestroy, OnInit } from '@angular/core';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { TEXTOS } from '@ng-mf/data-access-user';
import { TableData } from '@ng-mf/data-access-user';
import { takeUntil } from 'rxjs/operators';
/**  
 * Componente PasoDosComponent que representa el segundo paso del trámite 30901.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit ,OnDestroy {
  /**
   * @description Constante que contiene los textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * Datos de la tabla que contiene los encabezados y el cuerpo de la tabla.
   * @property {Array<any>} tableHeader - Encabezados de la tabla.
   * @property {Array<any>} tableBody - Cuerpo de la tabla.
   */
  tableData: TableData = {
    /**
     * Encabezados de la tabla.
     */
    tableHeader: [],
    /**
     * Cuerpo de la tabla.
     */
    tableBody: [],
  };
  private destroyNotifier$ = new Subject<void>();
  /**
   * Array para almacenar los documentos del catálogo.
   * Cada documento es de tipo `Catalogo`, representando un ítem en el catálogo.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Constructor de la clase PasoDosComponent.
   * 
   * @param catalogosServices - Servicio para manejar los catálogos.
   */
  constructor(
    private catalogosServices: CatalogosService,
  ) {
    // Si es necesario, se puede agregar aquí la lógica de inicialización
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta una vez que el componente ha sido inicializado.
   * Aquí se llama al método `getTiposDocumentos` para cargar los datos necesarios al iniciar el componente.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   *
   * Este método envía una solicitud al servicio `CatalogosService` para obtener los tipos de documentos
   * y los almacena en la propiedad `catalogoDocumentos`.
   *
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
   * Método que se ejecuta al destruir el componente.
   * 
   * @memberof PasoDosComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}