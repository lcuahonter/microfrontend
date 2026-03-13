import { AgregarFacturadorComponent } from '../../../../shared/components/agregar-facturador/agregar-facturador.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260204Store } from '../../estados/stores/tramite260204Store.store';

/**
 * Componente Angular que representa la contenedora para agregar facturadores.
 * 
 * Este componente es independiente (`standalone`) y utiliza los módulos `CommonModule` 
 * y `AgregarFacturadorComponent` como dependencias. Su propósito principal es proporcionar 
 * una interfaz para gestionar la tabla de facturadores en el contexto de un trámite específico.
 * 
 * @selector app-agregar-facturador-contenedora - Selector utilizado para instanciar este componente en una plantilla.
 * @standalone true - Indica que este componente es independiente y no forma parte de un módulo Angular tradicional.
 * @imports [CommonModule, AgregarFacturadorComponent] - Módulos y componentes importados para el funcionamiento del componente.
 * @templateUrl ./agregar-facturador-contenedora.component.html - Ruta del archivo HTML que define la estructura visual del componente.
 * @styleUrl ./agregar-facturador-contenedora.component.scss - Ruta del archivo SCSS que contiene los estilos del componente.
 * 
 * @constructor
 * - `tramiteStore: Tramite260204Store` - Servicio que actúa como almacén de datos para gestionar el estado del trámite.
 * 
 * @method updateFacturadorTablaDatos
 * - Actualiza los datos de la tabla de facturadores en el almacén de trámites.
 * - @param event - Una lista de objetos de tipo `Facturador` que contiene los datos actualizados para la tabla de facturadores.
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
     * Constructor de la clase AgregarFacturadorContenedoraComponent.
     * 
     * Este constructor inicializa el componente y permite la inyección de dependencias necesarias.
     * 
     * @param tramiteStore - Instancia de `Tramite260204Store` que proporciona acceso al estado y métodos relacionados con el trámite 260204.
     */
    constructor(
        public tramiteStore: Tramite260204Store){
    }

    /**
     * Actualiza los datos de la tabla de facturadores en el almacén de trámites.
     *
     * @param event - Una lista de objetos de tipo `Facturador` que contiene los datos actualizados
     *                 para la tabla de facturadores.
     */
    updateFacturadorTablaDatos(event:Facturador[]): void {
        this.tramiteStore.updateFacturadorTablaDatos(event);
    }
}
