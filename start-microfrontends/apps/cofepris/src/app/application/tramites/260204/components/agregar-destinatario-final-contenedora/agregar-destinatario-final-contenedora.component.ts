import { AgregarDestinatarioFinalComponent } from '../../../../shared/components/agregar-destinatario-final/agregar-destinatario-final.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260204Store } from '../../estados/stores/tramite260204Store.store';

/**
 * Componente Angular que representa la contenedora para agregar destinatarios finales.
 * 
 * Este componente es independiente (`standalone`) y utiliza los módulos `CommonModule` 
 * y `AgregarDestinatarioFinalComponent` como dependencias. Su propósito principal es 
 * proporcionar una interfaz para gestionar y actualizar los destinatarios finales 
 * asociados a un trámite específico.
 * 
 * @selector app-agregar-destinatario-final-contenedora
 * 
 * @templateUrl ./agregar-destinatario-final-contenedora.component.html
 * 
 * @styleUrl ./agregar-destinatario-final-contenedora.component.scss
 * 
 * @class AgregarDestinatarioFinalContenedoraComponent
 * 
 * @constructor
 * @param {Tramite260204Store} tramiteStore - Servicio de almacenamiento que contiene 
 * los datos y métodos relacionados con el trámite 260204. Se utiliza para actualizar 
 * la tabla de destinatarios finales.
 */
@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioFinalComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
})
export class AgregarDestinatarioFinalContenedoraComponent {


  /**
   * Constructor de la clase AgregarDestinatarioFinalContenedoraComponent.
   * 
   * Este constructor inicializa la instancia del componente y permite la inyección
   * de dependencias necesarias para su funcionamiento. En este caso, se inyecta
   * el `Tramite260204Store`, que es utilizado para gestionar el estado relacionado
   * con los trámites específicos de la aplicación.
   * 
   * @param tramiteStore - Instancia del servicio `Tramite260204Store` que proporciona
   * acceso y manipulación del estado de los trámites.
   */
  constructor(public tramiteStore: Tramite260204Store) {}

  /**
   * Actualiza los datos de la tabla de destinatarios finales en el almacén de trámites.
   * 
   * @param event - Una lista de destinatarios de tipo `Destinatario` que se utilizará para actualizar los datos.
   */
  updateDestinatarioFinalTablaDatos(event: Destinatario[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
  }
}
