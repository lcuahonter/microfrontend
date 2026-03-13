import { CATALOGOS_ID, Catalogo,CatalogosService, TEXTOS } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
 
/**
 * Componente que maneja la selección de documentos en el paso de DUOS.
 *
 * Este componente permite al usuario seleccionar documentos requeridos para un trámite
 * y visualizarlos en una lista de documentos seleccionados.
 */
@Component({
  selector: 'app-pasoduos',
  templateUrl: './pasoduos.component.html',
})
export class PasoduosComponent implements OnInit,OnDestroy {
  /**
     * property {Subject<void>} destroyed$
     * description Sujeto utilizado para manejar la destrucción de observables.
     * private
     */
    private destroyed$ = new Subject<void>();
    
  /** Textos usados en el componente, provenientes de una fuente centralizada. */
  TEXTOS = TEXTOS;
 
  /** Lista de tipos de documentos disponibles para selección. */
  tiposDocumentos: Catalogo[] = [];
 
  /** Clase de estilo para mensajes de alerta informativa. */
  infoAlert = 'alert-info';
 
  /** Catálogo completo de documentos disponibles. */
  catalogoDocumentos: Catalogo[] = [];
 
  /**
   * Constructor del componente.
   *
   * @param catalogosServices Servicio para obtener los catálogos necesarios.
   */
  constructor(public catalogosServices: CatalogosService) {
    // Dependencia inyectada para uso posterior
  }
 
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * Inicializa la lista de tipos de documentos disponibles y define algunos
   * documentos seleccionados por defecto.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
 
  }
 
  /**
   * Obtiene el catálogo de tipos de documentos disponibles para el trámite.
   *
   * Este método realiza una solicitud al servicio de catálogos para cargar la lista
   * de documentos disponibles que el usuario podrá seleccionar.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp): void => {
          // Si la respuesta tiene documentos, los almacena en catalogoDocumentos
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error): void => {
          // Manejo de errores, actualmente vacío pero puede ser implementado
        },
      });
  }
  
  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
 