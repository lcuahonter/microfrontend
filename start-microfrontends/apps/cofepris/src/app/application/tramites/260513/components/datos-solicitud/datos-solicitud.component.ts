import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DEFAULT_CONFIGURACION_VISIBILIDAD } from '../../constantes/datos-solicitud.enum';
import { DatosDeLaComponent } from '../../../../shared/components/datos-solicitud/datos-solicitud.component';
import { ViewChild } from '@angular/core';
/**
 * Interfaz que define la configuración de visibilidad para diferentes atributos relacionados con países.
 * 
 * @property {boolean} paisOrigen - Indica si el país de origen es visible.
 * @property {boolean} paisFabrica - Indica si el país de fabricación es visible.
 * @property {boolean} paisElaboracion - Indica si el país de elaboración es visible.
 * @property {boolean} paisProveedor - Indica si el país del proveedor es visible.
 * @property {boolean} paisProcedencia - Indica si el país de procedencia es visible.
 */
export interface ConfiguracionVisibilidad {
  paisOrigen: boolean;
  paisFabrica: boolean;
  paisElaboracion: boolean;
  paisProveedor: boolean;
  paisProcedencia: boolean;
}
@Component({
  selector: 'app-datos-solicitud',
  standalone: true,
  imports: [CommonModule, DatosDeLaComponent],
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.scss',
})
export class DatosSolicitudComponent {
  idProcedimiento: number = 260513;
  @ViewChild(DatosDeLaComponent)
  datosDeLaComponent!: DatosDeLaComponent;
  /**
   * Indica si se debe mostrar la sección de Aviso de Licencia
   */
  isAvisoLicenciaVisible: boolean = false;

  /**
   * Indica si se debe mostrar la sección de Aduanas de Entrada
   */
  isAduanasEntradaVisible: boolean = true;

  /**
   * Configuración de visibilidad utilizada para determinar qué elementos
   * deben ser visibles en el componente. Se inicializa con la configuración
   * predeterminada definida en `DEFAULT_CONFIGURACION_VISIBILIDAD`.
   */
  configuracionVisibilidad: ConfiguracionVisibilidad = DEFAULT_CONFIGURACION_VISIBILIDAD;


  validarClickDeBoton(): boolean {
    return this.datosDeLaComponent.validarClickDeBoton();
  }
}
