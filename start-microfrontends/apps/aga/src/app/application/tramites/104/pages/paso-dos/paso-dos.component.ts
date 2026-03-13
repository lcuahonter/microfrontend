import {CATALOGOS_ID, Catalogo, CatalogosService } from '@libs/shared/data-access-user/src';
import { Component, OnInit } from '@angular/core';
import { TEXTOS } from '@ng-mf/data-access-user';
/**
 * **Componente Paso Tres**  
 * 
 * Representa el tercer paso dentro de un flujo de pasos en la aplicación.  
 * Este componente maneja la lógica y la interfaz de usuario para la tercera sección del proceso.
 */
@Component({
  selector: 'app-paso-dos', // Nombre del selector que se usará en el HTML para invocar este componente.
  templateUrl: './paso-dos.component.html', // Ruta del archivo de la plantilla HTML asociada.
})

export class PasoDosComponent implements OnInit {

    /**
     * Variable que almacena los textos de los componentes.
     */
    TEXTOS = TEXTOS;

  /**
* Variable que almacena el tipo de alerta.
*/
  infoAlert = 'alert-info';
  /**
   * **Catálogo de documentos**  
   * 
   * Contiene una lista de documentos disponibles en el sistema.  
   * Se llena con los valores obtenidos desde una fuente de datos externa.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Constructor del componente.
   * 
   * @param catalogosServices Servicio para obtener los catálogos desde la fuente de datos externa.
   */
  constructor(private catalogosServices: CatalogosService){
    // Inicialización del servicio de catálogos.
  }

    /**
   * Método que se ejecuta al iniciar el componente
   * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
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
        .subscribe({
          next: (resp): void => {
            if (resp.length > 0) {
              this.catalogoDocumentos = resp;
            }
          },
          error: (_error): void => {
            //
          },
        });
    }


}
