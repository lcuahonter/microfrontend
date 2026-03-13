/**
 * @componente
 * @nombre ManifiestoDeAceptacionComponent
 * @descripcion
 * Este componente representa el manifiesto de aceptación en el flujo de trámites dentro de la aplicación.
 * Es un componente autónomo que se encarga de mostrar información y alertas relacionadas con el proceso de aceptación de trámites.
 * Utiliza otros componentes y módulos compartidos para cumplir su función.
 *
 * @selector app-manifiesto-de-aceptacion
 * @autonomo true
 * @plantillaUrl ./manifiesto-de-aceptacion.component.html
 * @estiloUrl ./manifiesto-de-aceptacion.component.scss
 * @importaciones [CommonModule, TituloComponent, AlertComponent]
 *
 * @remarks
 * Este componente se utiliza en aplicaciones que gestionan flujos de trámites donde los usuarios deben aceptar ciertos términos o condiciones.
 * Está diseñado para ser reutilizable en diferentes contextos sin depender de un módulo específico.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { MANIFIESTO_ACEPTACION_TEXTO } from '../../../../shared/constantes/manifesto-texto.enum';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * @decorador
 * @descripcion
 * Define el metadato del componente, especificando el selector, la plantilla, el estilo y los módulos importados.
 * Estos metadatos permiten que Angular construya y maneje el componente correctamente dentro de la aplicación.
 */

@Component({
  selector: 'app-manifiesto-de-aceptacion',
  standalone: true,
  imports: [CommonModule, TituloComponent, AlertComponent, ReactiveFormsModule],
  templateUrl: './manifiesto-de-aceptacion.component.html',
  styleUrls: ['./manifiesto-de-aceptacion.component.scss'],
})

/**
 * @clase
 * @nombre ManifiestoDeAceptacionComponent
 * @descripcion
 * La clase `ManifiestoDeAceptacionComponent` es responsable de la lógica del componente de manifiesto de aceptación.
 * Este componente se utiliza dentro de un flujo de trámites donde el usuario debe aceptar ciertos términos o condiciones.
 * A través de este componente, se gestionan las interacciones del usuario con el manifiesto y las alertas relacionadas.
 */
export class ManifiestoDeAceptacionComponent {

  
   /**
 * Formulario reactivo que representa el manifiesto de aceptación.
 * Este formulario es recibido como input desde el componente padre y se utiliza para gestionar
 * los controles y validaciones asociados al manifiesto de aceptación.
 *
 * @type {FormGroup}
 * @memberof ManifiestoDeAceptacionComponent
 */
  @Input() manifestoForm!: FormGroup;

  /**
   * @description Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es `true`, el checkbox y otros campos estarán deshabilitados y no podrán ser editados por el usuario.
   * Este valor se recibe como entrada desde el componente padre.
   * @type {boolean}
   * @default false
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
    * @event setValoresStoreEvent
    * @description
    * Evento que emite los valores del formulario para almacenarlos en el store.
    * Incluye el formulario reactivo, el nombre del campo que se está actualizando
    * y el nombre del método que realiza la actualización.
    */
  @Output() setValoresStoreEvent = new EventEmitter<{ form: FormGroup; campo: string }>();

  /**
 * @property
 * @name manifestoText
 * @description
 * Esta propiedad contiene el texto HTML del manifiesto de aceptación.
 * El contenido de esta propiedad se utiliza para mostrar el manifiesto en la interfaz de usuario.
 * El valor se obtiene de la constante `MANIFIESTO_ACEPTACION_TEXTO`, que está definida en el módulo compartido.
 * 
 * @type {string}
 * @default MANIFIESTO_ACEPTACION_TEXTO
 */
  manifestoText = MANIFIESTO_ACEPTACION_TEXTO;

/**
 * Emite un evento para actualizar los valores del formulario en el store.
 *
 * Este método recibe el formulario reactivo y el nombre del campo que se está actualizando,
 * y emite un evento (`setValoresStoreEvent`) con estos datos para que el componente padre
 * pueda almacenarlos en el store correspondiente.
 *
 * @param {FormGroup} form - Formulario reactivo con los valores actuales.
 * @param {string} campo - Nombre del campo que se está actualizando.
 * @memberof ManifiestoDeAceptacionComponent
 */
 setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
  }
}