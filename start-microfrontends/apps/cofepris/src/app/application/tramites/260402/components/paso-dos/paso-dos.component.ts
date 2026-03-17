

/**
 * compo doc
 * @component PasoDosComponent
 * @description
*/
import { Component, OnDestroy, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { AlertComponent, AnexarDocumentosComponent, CATALOGOS_ID, Catalogo, CatalogosService,TEXTOS, TituloComponent } from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';

/**
 * @nombre PasoDosComponent
 * @descripcion Componente que representa el segundo paso de un proceso.
 * Este componente es independiente (standalone) y utiliza varios componentes compartidos.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    CommonModule, 
    TituloComponent,
    AnexarDocumentosComponent, 
    AlertComponent,
  ],
  templateUrl: './paso-dos.component.html', 
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * @prop {any} TEXTOS - Contiene constantes de texto utilizadas en la UI.
   */
  TEXTOS = TEXTOS;

    /**
     * Texto utilizado para mostrar el mensaje de requisitos.
     * @type {string}
     */
    tiposDocumentos: Catalogo[] = [];
    /**
     * Tipo de alerta utilizada.
     * @type {string}
     */
    infoAlert = 'alert-info';
    /**
     * Texto utilizado para mostrar el mensaje de requisitos.
     * @type {string}
     */
    catalogoDocumentos: Catalogo[] = [];
  
    /**
     * Notificador utilizado para manejar la destrucción o desuscripción de observables.
     * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
     *
     * @property {Subject<void>} destroyNotifier$
     */
    private destroyNotifier$: Subject<void> = new Subject();
  
    constructor(private catalogosServices: CatalogosService) {
      // Necesito inyectar los servicios a través del constructor, de modo que el constructor esté vacío.
    }
  
    ngOnInit(): void {
      this.getTiposDocumentos();
    }
  

    /**
     * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
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
          error: (_error): void => {
            return _error;
          },
        });
    }
    /**
     * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
     * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
     * @method ngOnDestroy
     */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}
