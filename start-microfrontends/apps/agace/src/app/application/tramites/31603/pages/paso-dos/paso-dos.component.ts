import { CATALOGOS_ID,Catalogo, CatalogosService, TEXTOS } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente Angular que representa el paso dos de un trámite.
 * 
 * Este componente se encarga de inicializar y gestionar un catálogo de documentos
 * disponibles para el usuario, utilizando un servicio inyectado para obtener los datos.
 * También implementa la limpieza de suscripciones al destruirse.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent implements OnInit,OnDestroy {


  /**
  * property {Subject<void>} destroyed$
  * description Sujeto utilizado para manejar la destrucción de observables.
  * private
  */
   private destroyed$ = new Subject<void>();  
   /** Textos usados en el componente, provenientes de una fuente centralizada. */
   TEXTOS = TEXTOS;
    /** Catálogo completo de documentos disponibles. */
   catalogoDocumentos: Catalogo[] = []; 
   /**
    * Constructor del componente PasoDosComponent.
    * 
    * @param catalogosServices - Servicio inyectado para manejar operaciones relacionadas con catálogos.
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
