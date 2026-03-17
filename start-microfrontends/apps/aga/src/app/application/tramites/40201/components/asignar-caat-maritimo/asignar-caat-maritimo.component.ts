import { Component, Input } from '@angular/core';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { BuscarEmpresaCaatComponent } from '../buscar-empresa-caat/buscar-empresa-caat.component';
import { CommonModule } from '@angular/common';
import { EMPRESA_MARITIMA_REQUERIDA } from '../../constantes/transportacion-maritima.enum';
import { PersonaFisicaExtranjeraComponent } from '../persona-fisica-extranjera/persona-fisica-extranjera.component';
import { PersonaFisicaNacionalComponent } from '../persona-fisica-nacional/persona-fisica-nacional.component';
import { PersonaMoralExtranjeraComponent } from '../persona-moral-extranjera/persona-moral-extranjera.component';
import { PersonaMoralNacionalComponent } from '../persona-moral-nacional/persona-moral-nacional.component';

/**
 * Componente para asignar CAAT marítimo.
 */
@Component({
  selector: 'app-asignar-caat-maritimo',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    PersonaFisicaNacionalComponent,
    PersonaMoralNacionalComponent,
    PersonaFisicaExtranjeraComponent,
    PersonaMoralExtranjeraComponent,
    BuscarEmpresaCaatComponent
  ],
  templateUrl: './asignar-caat-maritimo.component.html',
  styleUrl: './asignar-caat-maritimo.component.css',
})
export class AsignarCaatMaritimoComponent {
  /**
   * Cadena que representa el aviso de privacidad simplificado.
   * Este aviso es utilizado para informar a los usuarios sobre el manejo de sus datos personales.
   */
  TEXTOS = EMPRESA_MARITIMA_REQUERIDA;

  /**
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  infoAlert = 'alert-info';

  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * Selecciona la pestaña especificada.
   * 
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Indica si los datos de respuesta del servidor se están utilizando para actualizar el formulario.
   * 
   * @default false
   */
  @Input() esDatosRespuesta: boolean = false;
 
}
