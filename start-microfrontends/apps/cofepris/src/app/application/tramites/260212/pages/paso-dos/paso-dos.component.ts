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
 * @description Component responsible for managing step two of the procedure.
 * It handles document requirements, retrieves catalog data, and manages user selections.
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
   * @description Contains static text literals used in this step of the form.
   * @type {typeof TEXTOS_REQUISITOS}
   */
  public TEXTOS = TEXTOS_REQUISITOS;

  /**
   * @property tiposDocumentos
   * @description Local placeholder for document types used in this step.
   * @type {Catalogo[]}
   */
  public tiposDocumentos: Catalogo[] = [];

  /**
   * @property infoAlert
   * @description Bootstrap alert type used for informational messages.
   * @type {string}
   */
  public infoAlert = 'alert-info';

  /**
   * @property catalogoDocumentos
   * @description Holds the document type catalog fetched from the API.
   * @type {Catalogo[]}
   */
  public catalogoDocumentos: Catalogo[] = [];

  /**
   * @property documentosSeleccionados
   * @description List of documents selected by the user.
   * @type {Catalogo[]}
   */
  public documentosSeleccionados: Catalogo[] = [];

  /**
   * @property destroyNotifier$
   * @description Notifier used to unsubscribe from observables when the component is destroyed.
   * Prevents memory leaks.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @param catalogosServices Service to fetch catalog data needed in the form.
   */
  constructor(private catalogosServices: CatalogosService) {
    // Dependencies are injected here. No initialization logic needed.
  }

  /**
   * @method ngOnInit
   * @description Angular lifecycle hook triggered on component initialization.
   * Initiates the fetch of document types.
   * @returns {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @method getTiposDocumentos
   * @description Fetches the catalog of document types for the procedure.
   * Updates the `catalogoDocumentos` list if successful.
   * @returns {void}
   */
  public getTiposDocumentos(): void {
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
   * @description Angular lifecycle hook triggered just before the component is destroyed.
   * Cleans up active subscriptions to prevent memory leaks.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
