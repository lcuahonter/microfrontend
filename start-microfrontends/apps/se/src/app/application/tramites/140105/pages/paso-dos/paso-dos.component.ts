import { Component } from '@angular/core';
import { TEXTOS_REQUISITOS } from "../../constants/intropermiso.enum";
/**
 * @component
 * @name PasoDosComponent
 * @description Este componente representa el segundo paso de un formulario en el flujo de trámites.
 * Se encarga de manejar la lógica relacionada con los tipos de documentos requeridos y seleccionados
 * por el usuario, así como de interactuar con los servicios necesarios para obtener los datos del catálogo.
 * 
 * @example
 * <app-paso-dos></app-paso-dos>
 * 
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})

/**
 * Componente encargado de gestionar la lógica y presentación del segundo paso
 * en el flujo de trámites para el certificado zoosanitario.
 *
 * @description
 * Este paso presenta los requisitos que el solicitante debe cumplir para continuar
 * con el trámite. Los textos mostrados en la vista se obtienen del archivo de constantes
 * `intropermiso.enum.ts` a través del objeto `TEXTOS_REQUISITOS`.
 *
 * @example
 * <app-paso-dos></app-paso-dos>
 */
export class PasoDosComponent {
  /**
   * Objeto que contiene los textos descriptivos de los requisitos del certificado zoosanitario.
   * Estos textos se utilizan en la plantilla para informar al usuario sobre
   * los pasos o documentación necesaria.
   *
   * @type {object}
   * @memberof PasoDosComponent
   */
  TEXTOS = TEXTOS_REQUISITOS;

}