/**
 * Componente encargado de gestionar los datos de la solicitud.
 */
import { Component, ViewChild } from '@angular/core';
import { DatosDeLaMercanciaComponent } from '../../components/datos-de-la-mercancia/datos-de-la-mercancia.component';
import { DatosDelTramiteComponent } from '../../components/datos-del-tramite/datos-del-tramite.component';
import { RepresentacionFederalComponent } from '../../components/representacion-federal/representacion-federal.component';

/**
 * Componente encargado de gestionar los datos de la solicitud.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: false,
  templateUrl: './datos-de-la-solicitud.component.html',
})
export class DatosDeLaSolicitudComponent {
  /**
   * @property {DatosDelTramiteComponent} datosDelTramiteComponent
   * @description
   * Referencia al componente hijo **DatosDelTramiteComponent**, obtenida mediante `@ViewChild`.
   * Permite acceder a sus métodos y propiedades desde el componente padre.
   */
  @ViewChild(DatosDelTramiteComponent, { static: false }) datosDelTramiteComponent!: DatosDelTramiteComponent;
  /**
   * @property {DatosDeLaMercanciaComponent} datosDeLaMercanciaComponent
   * @description
   * Referencia al componente hijo **DatosDeLaMercanciaComponent**, utilizada para manipular
   * o consultar datos relacionados con la mercancía dentro del flujo del trámite.
   */
  @ViewChild(DatosDeLaMercanciaComponent, { static: false }) datosDeLaMercanciaComponent!: DatosDeLaMercanciaComponent;

  /**
   * @property {RepresentacionFederalComponent} representacionFederalComponent
   * @description
   * Referencia al componente hijo **RepresentacionFederalComponent**, utilizada para manipular
   * o consultar datos relacionados con la representación federal dentro del flujo del trámite.
   */
  @ViewChild(RepresentacionFederalComponent, { static: false }) representacionFederalComponent!: RepresentacionFederalComponent;
  
  /**
   * Método que valida el formulario completo de la solicitud.
   * @returns {boolean} Retorna `true` si todos los formularios son válidos, `false` en caso contrario.
   */
  validarFormulario(): boolean {
    let esValido = true;

    if (this.datosDelTramiteComponent && this.datosDelTramiteComponent.datosDelTramiteForm.invalid) {
      this.datosDelTramiteComponent.datosDelTramiteForm.markAllAsTouched();
      esValido = false;
    }

    if (this.datosDeLaMercanciaComponent && this.datosDeLaMercanciaComponent.datosDeLaMercanciaForm.invalid) {
      this.datosDeLaMercanciaComponent.datosDeLaMercanciaForm.markAllAsTouched();
      esValido = false;
    }

    if (this.representacionFederalComponent && this.representacionFederalComponent.formularioRepresentacionFederalForm.invalid) {
      this.representacionFederalComponent.formularioRepresentacionFederalForm.markAllAsTouched();
      esValido = false;
    }

    return esValido;
  }
}