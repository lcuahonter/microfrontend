import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { DATOS_POR_GARANTIA } from '../../constantes/cancelacion-garantia.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
/**
  * @Component
  * @selector datos-por-garantia
  * @description
  * Componente `DatosPorGarantiaComponent` que representa la sección del formulario relacionada con los datos de la garantía.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Es un componente independiente (`standalone`) que importa módulos y componentes necesarios para su funcionamiento.
  * - Renderiza un formulario dinámico utilizando el componente `FormasDinamicasComponent`.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `datos-por-garantia`.
  * - `standalone`: Indica que el componente es independiente.
  * - `imports`: Lista de módulos y componentes importados, como `CommonModule`, `ReactiveFormsModule`, y `FormasDinamicasComponent`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * - `styleUrl`: Ruta al archivo de estilos SCSS del componente.
  * 
  * @example
  * <datos-por-garantia></datos-por-garantia>
  */
@Component({
  selector: 'datos-por-garantia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './datos-por-garantia.component.html',
  styleUrl: './datos-por-garantia.component.scss',
})

export class DatosPorGarantiaComponent {

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  @Input() consultaState!: ConsultaioState;
    
  /**
     * @property forma
     * @description
     * Representa el formulario reactivo utilizado en el componente `DatosPorGarantiaComponent`.
     * @type {FormGroup}
     */
    public forma: FormGroup = new FormGroup({
      ninoFormGroup: new FormGroup({})
    });

    /**
   * compo doc
   * @getter ninoFormGroup
   * @description
   * Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroup`
   * dentro del formulario reactivo principal `forma`.
   * Se utiliza para acceder y manipular los controles y valores específicos de este grupo de formularios.
   *
   * @returns {FormGroup} El grupo de formularios `ninoFormGroup` como un objeto de tipo `FormGroup`.
   *
   * @example
   * const grupo = this.ninoFormGroup;
   * grupo.get('campo').setValue('nuevo valor');
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

  /**
     * compo doc
     * @property datosPorGarantiaFormData
     * @type {ModeloDeFormaDinamica[]}
     * @description
     * Esta propiedad contiene la configuración de los campos del formulario dinámico
     * utilizado en el componente. La configuración está basada en la constante
     * `DATOS_POR_GARANTIA`, que define los detalles de cada campo, como su
     * identificador, etiqueta, tipo de entrada, validadores, y más.
     *
     * Se utiliza para renderizar dinámicamente los campos del formulario y para
     * gestionar su comportamiento, como la validación y la interacción con los datos
     * obtenidos de los servicios.
     */
    public datosPorGarantiaFormData = DATOS_POR_GARANTIA;
}
