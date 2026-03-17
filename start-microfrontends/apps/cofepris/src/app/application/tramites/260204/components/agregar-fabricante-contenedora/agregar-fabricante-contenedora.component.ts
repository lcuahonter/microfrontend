import { AgregarFabricanteComponent } from '../../../../shared/components/agregar-fabricante/agregar-fabricante.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260204Store } from '../../estados/stores/tramite260204Store.store';

/**
 * Componente Angular que representa el contenedor para agregar fabricantes.
 * 
 * Este componente es autónomo y utiliza los módulos `CommonModule` y `AgregarFabricanteComponent`.
 * Proporciona una interfaz para actualizar los datos de los fabricantes en el estado del trámite.
 * 
 * @selector `app-agregar-fabricante-contenedora`
 * @standalone Este componente es independiente y no requiere ser parte de un módulo.
 * @imports Incluye los módulos `CommonModule` y `AgregarFabricanteComponent` para su funcionalidad.
 * @templateUrl Ruta al archivo HTML que define la estructura visual del componente.
 * @styleUrl Ruta al archivo SCSS que define los estilos del componente.
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
     * Constructor de la clase AgregarFabricanteContenedoraComponent.
     * 
     * Este constructor inicializa la instancia del componente y configura las dependencias necesarias.
     * 
     * @param tramiteStore - Una instancia de `Tramite260204Store` que se utiliza para gestionar el estado
     *                       relacionado con los trámites en el componente.
     */
    constructor(
        public tramiteStore: Tramite260204Store){
    }

    /**
     * Actualiza los datos de la tabla de fabricantes en el estado del trámite.
     *
     * @param event - Una lista de objetos de tipo `Fabricante` que contiene los datos actualizados de los fabricantes.
     */
    updateFabricanteTablaDatos(event:Fabricante[]): void {
        this.tramiteStore.updateFabricanteTablaDatos(event);
    }
}
