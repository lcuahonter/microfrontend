import { AgregarProveedorComponent } from '../../../../shared/components/agregar-proveedor/agregar-proveedor.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260204Store } from '../../estados/stores/tramite260204Store.store';

/**
 * Decorador de componente que define la configuración para el componente 
 * `AgregarProveedorContenedoraComponent`.
 * 
 * Este componente es independiente (`standalone`) y utiliza los módulos 
 * `CommonModule` y `AgregarProveedorComponent` como dependencias importadas.
 * 
 * @selector `app-agregar-proveedor-contenedora` - Selector utilizado para 
 * identificar este componente en las plantillas HTML.
 * 
 * @templateUrl `./agregar-proveedor-contenedora.component.html` - Ruta del 
 * archivo de plantilla HTML que define la estructura visual del componente.
 * 
 * @styleUrl `./agregar-proveedor-contenedora.component.scss` - Ruta del archivo 
 * de estilos SCSS que define el diseño visual del componente.
 * 
 * @standalone `true` - Indica que este componente es independiente y no forma 
 * parte de un módulo Angular tradicional.
 * 
 * Este componente está diseñado para interactuar con el estado del trámite 
 * `Tramite260204Store` y actualizar los datos de la tabla de proveedores 
 * mediante el método `updateProveedorTablaDatos`.
 */
@Component({
  selector: 'app-agregar-proveedor-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarProveedorComponent],
  templateUrl: './agregar-proveedor-contenedora.component.html',
  styleUrl: './agregar-proveedor-contenedora.component.scss',
})
export class AgregarProveedorContenedoraComponent {

    /**
     * Constructor de la clase AgregarProveedorContenedoraComponent.
     * 
     * Este constructor inicializa el componente y establece la dependencia 
     * del store `Tramite260204Store` para gestionar el estado relacionado 
     * con los trámites específicos del módulo 260204.
     * 
     * @param tramiteStore - Instancia del store `Tramite260204Store` que 
     * proporciona acceso y control sobre el estado de los trámites.
     */
    constructor(
        public tramiteStore: Tramite260204Store){
    }

    /**
     * Actualiza los datos de la tabla de proveedores en el estado del trámite.
     * 
     * @param event - Una lista de proveedores que se utilizará para actualizar los datos de la tabla.
     */
    updateProveedorTablaDatos(event:Proveedor[]): void {  
        this.tramiteStore.updateProveedorTablaDatos(event);
    }
}
