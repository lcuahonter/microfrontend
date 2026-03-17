import { AgregarFacturadorComponent } from '../../../../shared/components/agregar-facturador/agregar-facturador.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260203Store } from '../../estados/stores/tramite260203Store.store';


/**
 * @component AgregarFacturadorContenedoraComponent
 * @description Componente Angular que representa un contenedor para agregar facturadores. 
 * Este componente es autónomo y utiliza el módulo común de Angular y el componente `AgregarFacturadorComponent`.
 * 
 * @selector app-agregar-facturador-contenedora
 * 
 * @templateUrl ./agregar-facturador-contenedora.component.html
 * @styleUrl ./agregar-facturador-contenedora.component.scss
 * 
 * @remarks Este componente está diseñado para interactuar con el store `Tramite260203Store` 
 * para gestionar el estado del trámite relacionado. Proporciona funcionalidad para actualizar 
 * los datos de facturadores en el store.
 */
@Component({
  selector: 'app-agregar-facturador-contenedora',
  standalone: true,
  imports: [CommonModule,AgregarFacturadorComponent],
  templateUrl: './agregar-facturador-contenedora.component.html',
  styleUrl: './agregar-facturador-contenedora.component.scss',
})
export class AgregarFacturadorContenedoraComponent {
    
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
   * @method updateFacturadorTablaDatos
   * @description Actualiza los datos de la tabla de facturadores en el store del trámite.
   * 
   * @param {Facturador[]} event - Lista de facturadores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
    updateFacturadorTablaDatos(event:Facturador[]): void {
        this.tramite260205Store.updateFacturadorTablaDatos(event);
    }
}
