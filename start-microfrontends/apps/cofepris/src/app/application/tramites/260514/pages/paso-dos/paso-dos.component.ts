import { Component, OnDestroy, OnInit } from '@angular/core';
import { CATALOGOS_ID } from '@libs/shared/data-access-user/src';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogosService } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { TEXTOS } from '@ng-mf/data-access-user';
import { TableData } from '@ng-mf/data-access-user';
import { takeUntil } from 'rxjs/operators';

/**
 * @component PasoDosComponent
 * @description
 * Componente que representa el segundo paso del trámite 30901.
 * Permite la gestión y visualización de los tipos de documentos requeridos,
 * así como la carga de los catálogos correspondientes.
 *
 * @selector app-paso-dos
 * @templateUrl ./paso-dos.component.html
 * @styleUrl ./paso-dos.component.scss
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * @property {any} TEXTOS
   * @description Constante que contiene los textos utilizados en el componente.
   */
 public TEXTOS = TEXTOS;

  /**
   * @property {TableData} tableData
   * @description
   * Datos de la tabla que contiene los encabezados y el cuerpo de la tabla.
   * - tableHeader: Encabezados de la tabla.
   * - tableBody: Cuerpo de la tabla.
   */
  public tableData: TableData = {
    tableHeader: [],
    tableBody: [],
  };

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Subject utilizado para notificar la destrucción del componente y cancelar suscripciones activas.
   * Evita fugas de memoria al destruir el componente.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * @property {Catalogo[]} catalogoDocumentos
   * @description
   * Array para almacenar los documentos del catálogo.
   * Cada documento es de tipo `Catalogo`, representando un ítem en el catálogo.
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * @constructor
   * @description
   * Constructor de la clase PasoDosComponent.
   * Inyecta el servicio de catálogos para la obtención de datos.
   * @param {CatalogosService} catalogosServices - Servicio para manejar los catálogos.
   */
  constructor(
    private catalogosServices: CatalogosService,
  ) {
    // Inicialización opcional si es necesario.
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta una vez que el componente ha sido inicializado.
   * Aquí se llama al método `getTiposDocumentos` para cargar los datos necesarios al iniciar el componente.
   * @returns {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @method getTiposDocumentos
   * @description
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   * Este método envía una solicitud al servicio `CatalogosService` para obtener los tipos de documentos
   * y los almacena en la propiedad `catalogoDocumentos`.
   * Si la respuesta está vacía, no modifica el array.
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
   * @description
   * Método que se ejecuta al destruir el componente.
   * Notifica y completa el subject para cancelar todas las suscripciones activas y evitar fugas de memoria.
   * @memberof PasoDosComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}