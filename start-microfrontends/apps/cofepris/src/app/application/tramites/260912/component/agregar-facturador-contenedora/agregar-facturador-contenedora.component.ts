import { AgregarFacturadorComponent } from '../../../../shared/components/agregar-facturador/agregar-facturador.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../enums/domicilio-del-establecimiento.enum';
import { Tramite260912Store } from '../../estados/tramite-260912.store';



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
     * Identificador numérico del procedimiento actual.
     * Se inicializa con el valor de la constante global `ID_PROCEDIMIENTO`.
     * 
     * @remarks
     * Este campo se utiliza para asociar el facturador con el procedimiento correspondiente dentro del componente.
     */
    idProcedimiento: number = ID_PROCEDIMIENTO;
    
  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260911Store` para gestionar el estado del trámite.
   * 
   * @param tramite260912Store - Store que administra el estado del trámite 260911.
   */
    constructor(
        public tramite260912Store: Tramite260912Store){
    }

    /**
   * @method updateFacturadorTablaDatos
   * @description Actualiza los datos de la tabla de facturadores en el store del trámite.
   * 
   * @param {Facturador[]} event - Lista de facturadores que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
    updateFacturadorTablaDatos(event:Facturador[]): void {
        this.tramite260912Store.updateFacturadorTablaDatos(event);
    }
}
