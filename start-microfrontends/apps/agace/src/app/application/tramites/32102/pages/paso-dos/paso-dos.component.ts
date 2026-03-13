import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { TEXTOS } from '@ng-mf/data-access-user';
import documentList from '@libs/shared/theme/assets/json/32502/document-list.json';


/**
 * Este componente se muestra en PasoDos
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * Constante que contiene los textos utilizados en el componente.
   * Se utiliza para centralizar y reutilizar los textos en la interfaz de usuario.
   */
  TEXTOS = TEXTOS;

  /**
   * Arreglo que contiene los tipos de documentos disponibles.
   * Cada elemento es de tipo `Catalogo`, que representa un catálogo de opciones.
   */
  tiposDocumentos: Catalogo[] = [];
  
  /**
   * Clase CSS utilizada para mostrar una alerta informativa en la interfaz de usuario.
   * 
   * @type {string}
   */
  infoAlert = 'alert-info';

  /**
   * Lista de documentos del catálogo.
   * 
   * @type {Catalogo[]}
   * @remarks
   * Este arreglo contiene los documentos disponibles en el catálogo,
   * que pueden ser utilizados en el proceso de trámites.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Lista de documentos seleccionados por el usuario.
   * Esta propiedad almacena los documentos que han sido marcados
   * como seleccionados en el flujo actual de la aplicación.
   */
  documentosSeleccionados = documentList?.documentosSeleccionados;

  /**
   * @private
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   * Se emite un valor cuando el componente se destruye, lo que permite completar las suscripciones activas.
   */
  private destroy$: Subject<void> = new Subject<void>();


  /**
   * Constructor de la clase PasoDosComponent.
   * 
   * @param catalogosServices - Servicio para gestionar los catálogos necesarios en el componente.
   */
  constructor(
    private catalogosServices: CatalogosService,
  ) { 
    // Constructor
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se llama al método `getTiposDocumentos` para obtener los tipos de documentos necesarios.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Aquí se utiliza para emitir un valor en el observable `destroy$` y completar su emisión,
   * asegurando la limpieza de suscripciones y evitando posibles fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
 * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
 */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error): void => {
          // Manejo de error
         },
      });
  }
}