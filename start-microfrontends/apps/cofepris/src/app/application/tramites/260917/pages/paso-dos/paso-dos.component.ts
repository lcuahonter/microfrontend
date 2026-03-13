import { Component } from '@angular/core';
import { TEXTOS } from '@libs/shared/data-access-user/src';
/**
 * Componente que representa el paso dos del formulario o flujo de trabajo.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent {
    /**
     * @prop {any} TEXTOS - Contiene constantes de texto utilizadas en la UI.
     */
    TEXTOS = TEXTOS;
}

