import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Validadores } from '../../../../core/models/shared/forms-model';

/**
 * ValidadoresDeFormulariosComponent es un componente que permite la validación
 * de formularios en el contexto de trámites. Este componente utiliza formularios
 * reactivos de Angular para manejar y validar los datos de manera eficiente.
 * Además, soporta la integración con validadores personalizados para proporcionar
 * mensajes de error dinámicos y configurables.
 *
 * @component
 * @selector validadores-de-formularios
 * @standalone true
 * @imports [CommonModule]
 * @templateUrl ./validadores-de-formularios.component.html
 * @styleUrl ./validadores-de-formularios.component.scss
 */
@Component({
  selector: 'validadores-de-formularios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validadores-de-formularios.component.html',
  styleUrl: './validadores-de-formularios.component.scss',
})
export class ValidadoresDeFormulariosComponent {
  /**
   * compo doc
   * @input forma
   * @type {FormGroup}
   * @memberof ValidadoresDeFormulariosComponent
   * @description
   * Este es un formulario reactivo de Angular representado por un FormGroup.
   * Se utiliza para manejar y validar los datos del formulario en el componente.
   */
  @Input() forma!: FormGroup;

  /**
   * compo doc
   * @input controlDeFormulario
   * @type {string}
   * @memberof ValidadoresDeFormulariosComponent
   * @description
   * entrada de control de formulario
   */
  @Input() controlDeFormulario!: string;

  /**
   * compo doc
   * @input validadores
   * @type {Validadores[]}
   * @memberof ValidadoresDeFormulariosComponent
   * @description
   * entrada de matriz de validadores de tipo Validadaores que
   * consta de una colección de objetos de tipo tipo, valor y mensaje
   */
  @Input() validadores!: Validadores[];

  /**
   * @input setMinHeight
   * @type {boolean}
   * @memberof ValidadoresDeFormulariosComponent
   * @description
   * Esta propiedad de entrada permite establecer si el componente debe aplicar
   * una altura mínima. Por defecto, está configurada como `true`.
   */
  @Input() setMinHeight: boolean = false;

  /**
   * Devuelve el mensaje de error correspondiente para un control de formulario según los validadores configurados.
   * @param controlName - Nombre del control dentro del FormGroup.
   * @param validadores - Arreglo de validadores asociados al control.
   * @returns El mensaje de error si existe, o null si no hay errores o el control no ha sido tocado.
   */
  obtenerErrorDeValidacion(controlName: string, validadores: Validadores[]): string | null {
    const CONTROL = this.forma.get(controlName);
    if (!CONTROL || !CONTROL.touched || !CONTROL.invalid) {
      return null;
    }

    if (CONTROL.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    if (CONTROL.hasError('minlength')) {
      const VALIDADOR = validadores.find((v) => v.tipo === 'minlength');
      if (VALIDADOR && VALIDADOR.valor !== undefined) {
        return `Debe tener al menos ${VALIDADOR.valor} caracteres.`;
      }
    }

    if (CONTROL.hasError('customMaxlength')) {
      const VALIDADOR = validadores.find((v) => v.tipo === 'customMaxlength');
      if (VALIDADOR && VALIDADOR.mensaje) {
        return VALIDADOR.mensaje;
      }
    }

    for (const VALIDADOR of validadores) {
      if (VALIDADOR.tipo === 'pattern' && VALIDADOR.valor !== undefined) {
        const ERROR_KEY =
          'pattern_' + VALIDADOR.valor.toString().replace(/\W/g, '');
        const ERRORS = CONTROL.errors || {};
        const MATCHING_KEY = Object.keys(ERRORS).find((k) =>
          k.startsWith('pattern_')
        );
        if (MATCHING_KEY && MATCHING_KEY === ERROR_KEY) {
          return ERRORS[MATCHING_KEY];
        }
      }
    }

    if (CONTROL.hasError('backend')) {
      return CONTROL.getError('backend').mensaje;
    }

    if (CONTROL.hasError('custom')) {
      return CONTROL.getError('custom').mensaje;
    }

    return null;
  }
}
