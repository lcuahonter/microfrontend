import { AgregarFabricanteComponent } from '../../../../shared/components/agregar-fabricante/agregar-fabricante.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260205Store } from '../../estados/stores/tramite260205.store';

/**
 * @component AgregarFabricanteContenedoraComponent
 * @description Componente que actúa como contenedor para la funcionalidad de agregar fabricantes. 
 * Este componente utiliza el store `Tramite260205Store` para gestionar el estado del trámite 
 * y delega la funcionalidad de actualización de datos de fabricantes.
 *
 * @selector app-agregar-fabricante-contenedora
 * @standalone true
 * @imports CommonModule, AgregarFabricanteComponent
 * @templateUrl ./agregar-fabricante-contenedora.component.html
 * @styleUrl ./agregar-fabricante-contenedora.component.scss
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
   * @description Constructor que inyecta el store `Tramite260205Store` para gestionar el estado del trámite.
   * 
   * @param tramite260205Store - Store que administra el estado del trámite 260214.
   */
    constructor(
        public tramite260205Store: Tramite260205Store){
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
