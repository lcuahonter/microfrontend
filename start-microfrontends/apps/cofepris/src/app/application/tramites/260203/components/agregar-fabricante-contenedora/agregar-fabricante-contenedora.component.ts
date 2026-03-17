import { AgregarFabricanteComponent } from '../../../../shared/components/agregar-fabricante/agregar-fabricante.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260203Store } from '../../estados/stores/tramite260203Store.store';


/**
 * @component AgregarFabricanteContenedoraComponent
 * @description Componente Angular que representa un contenedor para agregar fabricantes. Este componente es autónomo y utiliza el módulo común de Angular y el componente `AgregarFabricanteComponent`.
 * 
 * @selector app-agregar-fabricante-contenedora
 * @standalone true
 * @imports [CommonModule, AgregarFabricanteComponent]
 * @templateUrl ./agregar-fabricante-contenedora.component.html
 * @styleUrl ./agregar-fabricante-contenedora.component.scss
 * 
 * Este componente está diseñado para interactuar con el store `Tramite260203Store` para gestionar el estado del trámite relacionado. Proporciona funcionalidad para actualizar los datos de fabricantes en el store.
 */
@Component({
  selector: 'app-agregar-fabricante-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarFabricanteComponent],
  templateUrl: './agregar-fabricante-contenedora.component.html',
  styleUrl: './agregar-fabricante-contenedora.component.scss',
})
export class AgregarFabricanteContenedoraComponent {
 /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260203Store` para gestionar el estado del trámite.
   * 
   * @param tramite260205Store - Store que administra el estado del trámite 260214.
   */
    constructor(
        public tramite260205Store: Tramite260203Store){
    }

  /**
   * @method updateFabricanteTablaDatos
   * @description Actualiza los datos de la tabla de fabricantes en el store del trámite.
   * 
   * @param {Fabricante[]} event - Lista de fabricantes que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
    updateFabricanteTablaDatos(event:Fabricante[]): void {
        this.tramite260205Store.updateFabricanteTablaDatos(event);
    }
}
