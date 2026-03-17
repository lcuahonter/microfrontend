import { CATALOGOS_ID, Catalogo, CatalogosService,TEXTOS} from '@libs/shared/data-access-user/src';
import { Component,OnInit } from '@angular/core';
/**
 * Componente encargado del segundo paso en el trámite 30505.
 * 
 * Este componente obtiene y muestra el catálogo de tipos de documentos requeridos
 * para el trámite. Utiliza el servicio de catálogos para recuperar la información
 * necesaria al inicializarse.
 * 
 * @component
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})

export class PasoDosComponent implements OnInit {
 
  /**
   * Referencia a la constante `TEXTOS` que contiene los textos utilizados en el componente.
   * 
   * @remarks
   * Esta propiedad permite acceder a los textos definidos en la constante `TEXTOS` para su uso en la plantilla del componente.
   * 
   * @see TEXTOS
   */
  TEXTOS = TEXTOS;

  /**
   * Arreglo que contiene el catálogo de documentos disponibles.
   * Cada elemento del arreglo es de tipo `Catalogo`.
   * 
   * @type {Catalogo[]}
   */
  catalogoDocumentos: Catalogo[] = [];

  
  /**
   * Constructor de la clase PasoDosComponent.
   * 
   * @param catalogosServices Servicio inyectado para manejar operaciones relacionadas con catálogos.
   */
  constructor(
    private catalogosServices: CatalogosService,
  ) {
    
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama al método `getTiposDocumentos` para obtener los tipos de documentos necesarios.
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }
 
    /**
     * Obtiene el catálogo de tipos de documentos desde el servicio de catálogos.
     * 
     * Realiza una solicitud al servicio para obtener el catálogo identificado por `CATALOGOS_ID.CAT_TIPO_DOCUMENTO`.
     * Si la respuesta contiene elementos, asigna el resultado a la propiedad `catalogoDocumentos`.
     *
     * @returns {void} No retorna ningún valor.
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
        });
    }
}
