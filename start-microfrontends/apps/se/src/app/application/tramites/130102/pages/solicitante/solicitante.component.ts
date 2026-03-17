/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';

import { ListaPasosWizard } from '@libs/shared/data-access-user/src';

import { PASOS } from '@libs/shared/data-access-user/src';

/**
 * @component
 * @description 
 * Este componente representa la vista del solicitante en el proceso de servicios extraordinarios.
 * Administra la navegación entre los pasos del asistente.
 */
@Component({
  selector: 'app-130102solicitante',
  templateUrl: './solicitante.component.html'
})
export class Solicitante130102Component {

  /**
   * @property {ListaPasosWizard[]} pasos
   * @description 
   * Lista de pasos del asistente, obtenidos desde una constante de configuración.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {number} indice
   * @description 
   * Índice actual del paso en el asistente, comienza en 1.
   */
  indice: number = 1;

}
