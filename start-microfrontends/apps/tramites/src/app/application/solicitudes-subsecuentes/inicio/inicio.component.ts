import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TipoPersonaFormComponent } from '../components/tipo-persona-form/tipo-persona-form.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-solicitudes-subsecuentes',
  standalone: true,
  imports: [CommonModule, TipoPersonaFormComponent, TituloComponent],
  templateUrl: './inicio.component.html'
})
export class SolicitudesSubsecuentesComponent {
  showTipoPersonaForm = false;

  /**
   * Muestra el formulario de tipo de persona
   */
  onSolicitudesSubsecuentes(): void {
    this.showTipoPersonaForm = true;
  }
}