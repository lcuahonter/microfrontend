import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { MANIFIESTO_BAJO_PROTESTA } from '../../constantes/cancelacion-garantia.enum';

/**
  * @Component
  * @selector manifiesto-bajo-protesta
  * @description
  * Componente `ManifiestoBajoProtestaComponent` que representa la sección del formulario relacionada con la declaración bajo protesta de decir la verdad.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Es un componente independiente (`standalone`) que importa módulos y componentes necesarios para su funcionamiento.
  * - Renderiza un formulario dinámico utilizando el componente `FormasDinamicasComponent`.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `manifiesto-bajo-protesta`.
  * - `standalone`: Indica que el componente es independiente.
  * - `imports`: Lista de módulos y componentes importados, como `CommonModule`, `ReactiveFormsModule`, y `FormasDinamicasComponent`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * - `styleUrl`: Ruta al archivo de estilos SCSS del componente.
  * 
  * @example
  * <manifiesto-bajo-protesta></manifiesto-bajo-protesta>
  */
@Component({
  selector: 'manifiesto-bajo-protesta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './manifiesto-bajo-protesta.component.html',
  styleUrl: './manifiesto-bajo-protesta.component.scss',
})

export class ManifiestoBajoProtestaComponent {
  /**
     * @property forma
     * @description
     * Representa el formulario reactivo utilizado en el componente `ManifiestoBajoProtestaComponent`.
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
     * @property tipoSectorFormData
     * @type {ModeloDeFormaDinamica[]}
     * @description
     * Esta propiedad contiene la configuración de los campos del formulario dinámico
     * utilizado en el componente. La configuración está basada en la constante
     * `TIPO_SECTOR`, que define los detalles de cada campo, como su
     * identificador, etiqueta, tipo de entrada, validadores, y más.
     *
     * Se utiliza para renderizar dinámicamente los campos del formulario y para
     * gestionar su comportamiento, como la validación y la interacción con los datos
     * obtenidos de los servicios.
     */
    public manifiestoFormData = MANIFIESTO_BAJO_PROTESTA;
}
