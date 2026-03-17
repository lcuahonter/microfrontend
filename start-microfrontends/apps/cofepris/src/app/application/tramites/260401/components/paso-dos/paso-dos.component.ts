import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertComponent, AnexarDocumentosComponent, CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS, TituloComponent } from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

/**
 * Componente que representa el segundo paso del proceso, enfocado en anexar documentos.
 *
 * Este componente es **standalone** y utiliza:
 * - `TituloComponent`: Para mostrar encabezados o títulos de sección.
 * - `AnexarDocumentosComponent`: Componente encargado de la carga y validación de documentos requeridos.
 * - `AlertComponent`: Para mostrar mensajes de advertencia, error o éxito al usuario.
 * - `CommonModule`: Para acceder a directivas estructurales como *ngIf, *ngFor, etc.
 *
 * Se usa mediante el selector `app-paso-dos`.
 *
 * @component
 * @selector app-paso-dos
 * @standalone
 * @imports CommonModule, TituloComponent, AnexarDocumentosComponent, AlertComponent
 * @template ./paso-dos.component.html
 * @style ./paso-dos.component.scss
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [ CommonModule, 
    TituloComponent,
    AnexarDocumentosComponent, 
    AlertComponent],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
 /**
 * Referencia o alias a la constante `TEXTOS` importada.
 *
 * Se utiliza para mantener disponibles los textos estáticos o etiquetas para el componente.
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

    /**
 * Constructor del componente.
 *
 * Inyecta el servicio `CatalogosService` para acceder a catálogos de datos necesarios en el componente.
 *
 * Aunque el cuerpo del constructor está vacío, la inyección es necesaria para utilizar los métodos del servicio
 * en otros métodos del componente o durante el ciclo de vida.
 *
 * @param catalogosServices Servicio que proporciona datos de catálogos (por ejemplo: tipos, estados, municipios, etc.).
 */
    constructor(private catalogosServices: CatalogosService) {
      // Necesito inyectar los servicios a través del constructor, de modo que el constructor esté vacío.
    }

/**
 * Método del ciclo de vida Angular que se ejecuta después de la inicialización del componente.
 *
 * En este caso, llama al método `getTiposDocumentos()` para cargar o inicializar los tipos de documentos
 * necesarios para el componente.
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
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (resp): void => {
            if (resp.length > 0) {
              this.catalogoDocumentos = resp;
            }
          },
          error: (error): void => {
            console.error('Error al recuperar el catalogo de documentos:', error);
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
