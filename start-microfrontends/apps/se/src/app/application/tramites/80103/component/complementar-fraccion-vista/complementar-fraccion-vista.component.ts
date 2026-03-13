import { ComplimentarFraccion, ComplimentarFraccionResoponse } from '../../../../shared/models/nuevo-programa-industrial.model';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { COMPLEMENTAR_FRACCION_DATOS } from '../../constantes/nuevo-programa.enum';
import { CommonModule } from '@angular/common';
import { ComplementarFraccionComponent } from '../../../../shared/components/complementar-fraccion/complementar-fraccion.component';

/**
 * Componente Angular para la vista de complementar fracción del trámite 80103.
 * Este componente se encarga de mostrar y gestionar los datos complementarios
 * relacionados con la fracción del trámite.
 * 
 * @remarks
 * Este componente es autónomo y utiliza el módulo `CommonModule` y el componente `ComplementarFraccionComponent`.
 */
@Component({
  selector: 'app-complementar-fraccion-vista',
  standalone: true,
  imports: [CommonModule, ComplementarFraccionComponent],
  templateUrl: './complementar-fraccion-vista.component.html',
  styleUrl: './complementar-fraccion-vista.component.scss',
})
export class ComplementarFraccionVistaComponent {
  /**
   * Propiedad que almacena los datos complementarios relacionados con la fracción.
   * 
   * @type {ComplimentarFraccionResoponse}
   * @public
   */
  public complimentarDatos!: ComplimentarFraccionResoponse;
  /**
   * Datos utilizados para complementar la fracción en el componente.
   * 
   * @type {ComplimentarFraccion}
   * @constant
   * @description Esta propiedad contiene los datos necesarios para complementar 
   * la fracción, utilizando la constante `COMPLEMENTAR_FRACCION_DATOS`.
   */
  public complimentarFraccionDatos: ComplimentarFraccion = COMPLEMENTAR_FRACCION_DATOS;

  /**
   * Descripción de la fracción recibida desde el componente padre.
   * 
   * Esta propiedad se utiliza para mostrar o utilizar la descripción en el componente hijo.
   */
  @Input() descripcion!: string;

  /**
   * Evento que se emite al guardar la fracción complementada.
   * 
   * Envía un objeto de tipo `ComplimentarFraccionResoponse` al componente padre
   * con los datos actualizados de la fracción.
   */
  @Output() guardarComplementarFraccion = new EventEmitter<ComplimentarFraccionResoponse>();

  /**
   * Evento que se emite para cerrar el popup actual.
   * 
   * Notifica al componente padre que se debe cerrar el popup.
   * No envía ningún dato, solo indica la acción de cierre.
   */
  @Output() cerrarPopup = new EventEmitter<void>();

  /**
   * Método para asignar los datos recibidos al atributo `complimentarDatos`.
   * 
   * @param event - Objeto de tipo `ComplimentarFraccionResoponse` que contiene los datos a complementar.
   */
  getDatos(event: ComplimentarFraccionResoponse): void {
  this.guardarComplementarFraccion.emit({
    ...event,
    descripcion: this.descripcion
  });
}
}