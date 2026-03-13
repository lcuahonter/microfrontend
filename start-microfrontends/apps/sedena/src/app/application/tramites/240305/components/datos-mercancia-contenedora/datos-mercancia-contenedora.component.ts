import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240305Store } from '../../estados/tramite240305Store.store';
import { Observable } from 'rxjs';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';

/**
 * @title Datos de la Mercancía Contenedora
 * @description Componente contenedor encargado de recibir los datos de mercancía y actualizar el estado global del trámite.
 * @summary Actúa como puente entre el componente de datos de mercancía y el store de Akita.
 */

@Component({
  selector: 'app-datos-mercancia-contenedora',
  standalone: true,
  imports: [CommonModule, DatosMercanciaComponent],
  templateUrl: './datos-mercancia-contenedora.component.html',
  styleUrl: './datos-mercancia-contenedora.component.scss',
})
export class DatosMercanciaContenedoraComponent {
  /**
   * Evento de salida que emite una señal para cerrar el componente actual.
   * Se emite sin valor (`void`), indicando que no se necesita información adicional.
   *
   * @type {EventEmitter<void>}
   * @memberof NombreDelComponente
   */

  /**
    * Observable que expone los datos de una mercancía seleccionada.
    * Emite un objeto `MercanciaDetalle` o `null` cuando no hay información disponible.
    */
  MercanciaDatos$!: Observable<MercanciaDetalle | null>;

  /**
   * Identificador único del procedimiento asociado al trámite.
   * 
   * @property {number} idProcedimiento
   * @remarks Este valor se utiliza para identificar el trámite específico.
   */
  idProcedimiento = NUMERO_TRAMITE.TRAMITE_240305;

  /**
 * Indica si el formulario debe mostrarse solo en modo de lectura.
 */
  esFormularioSoloLectura: boolean = false

  /**
 * Evento que notifica el cierre del componente o modal
 * al componente padre.
 */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240305Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @returns {void}
   */
  constructor(private tramite240305Store: Tramite240305Store) { }

  /**
   * Actualiza los datos de la tabla de mercancía en el store.
   *
   * @method updateMercanciaDetalle
   * @param {MercanciaDetalle[]} event - Lista de mercancías actualizada desde el formulario.
   * @returns {void}
   */
  updateMercanciaDetalle(event: MercanciaDetalle[]): void {
    this.tramite240305Store.updateMercanciaTablaDatos(event);
    this.cerrar.emit();
  }
}
