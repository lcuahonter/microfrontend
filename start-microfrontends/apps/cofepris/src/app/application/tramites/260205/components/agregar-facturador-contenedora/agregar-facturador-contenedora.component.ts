import { AgregarFacturadorComponent } from '../../../../shared/components/agregar-facturador/agregar-facturador.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260205Store } from '../../estados/stores/tramite260205.store';

/**
 * @component AgregarFacturadorContenedoraComponent
 * @description Componente que actúa como contenedor para la funcionalidad de agregar facturadores. 
 * Este componente utiliza el store `Tramite260205Store` para gestionar el estado del trámite 
 * y delega la funcionalidad de actualización de datos de facturadores.
 *
 * @selector app-agregar-facturador-contenedora
 * @standalone true
 * @imports CommonModule, AgregarFacturadorComponent
 * @templateUrl ./agregar-facturador-contenedora.component.html
 * @styleUrl ./agregar-facturador-contenedora.component.scss
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
   * @description Constructor que inyecta el store `Tramite260205Store` para gestionar el estado del trámite.
   * 
   * @param tramite260205Store - Store que administra el estado del trámite 260214.
   */
    constructor(
        public tramite260205Store: Tramite260205Store){
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
