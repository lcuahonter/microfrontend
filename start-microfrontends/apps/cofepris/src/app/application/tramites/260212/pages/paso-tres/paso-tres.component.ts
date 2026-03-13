import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente para el paso tres del trámite 260212 de COFEPRIS.
 *
 * Este componente representa la tercera etapa del proceso de trámite donde se realiza
 * la firma electrónica del documento. Utiliza el componente compartido de firma
 * electrónica para permitir al usuario completar este paso del proceso.
 *
 */
@Component({
  /** Selector CSS para identificar el componente en el DOM */
  selector: 'app-paso-tres',
  /** Indica que es un componente independiente (standalone) */
  standalone: true,
  /** Módulos y componentes importados necesarios para el funcionamiento */
  imports: [CommonModule, FirmaElectronicaComponent],
  /** Ruta del archivo de plantilla HTML del componente */
  templateUrl: './paso-tres.component.html',
  /** Ruta del archivo de estilos CSS específicos del componente */
  styleUrl: './paso-tres.component.css',
})
export class PasoTresComponent {
  /**
   * Constructor del componente PasoTresComponent.
   *
   * Inicializa el componente para el tercer paso del trámite 260212.
   * En este paso se maneja la firma electrónica del documento.
   *
   * @memberof PasoTresComponent
   */
  constructor() {
    // El constructor está vacío ya que no requiere inicialización específica
  }
}
