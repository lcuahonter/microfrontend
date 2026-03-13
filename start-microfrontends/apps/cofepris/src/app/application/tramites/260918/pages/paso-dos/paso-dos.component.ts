import { Component } from '@angular/core';
import { TEXTOS } from '@libs/shared/data-access-user/src';
/**
 * Componente que representa el paso dos del formulario.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent {
  /**
 * Asignación de textos estáticos utilizados en la vista.
 */
    TEXTOS = TEXTOS;
}
