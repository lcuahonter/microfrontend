import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DATOS_GENERALES_DEL_SOLICITANTE } from '../../constantes/solicitud-de-registro-tpl.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';

/**
 * @component DatosGeneralesComponent
 * @description
 * Este componente representa la sección "Datos Generales" del trámite 120101. 
 * Utiliza un formulario dinámico para capturar y gestionar los datos generales del solicitante.
 * 
 * Funcionalidad:
 * - Renderiza dinámicamente los campos del formulario basados en la configuración definida en `DATOS_GENERALES_DEL_SOLICITANTE`.
 * - Maneja la validación y el estado del formulario utilizando formularios reactivos de Angular.
 * - Proporciona acceso al grupo de formularios anidado `ninoFormGroup` para gestionar controles específicos.
 * 
 * @selector datos-generales
 * @imports CommonModule, ReactiveFormsModule, FormasDinamicasComponent
 * @templateUrl ./datos-generales.component.html
 * @styleUrl ./datos-generales.component.scss
 */
@Component({
  selector: 'datos-generales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './datos-generales.component.html',
  styleUrl: './datos-generales.component.scss',
})

export class DatosGeneralesComponent implements OnInit{
  /**
    * compo doc
    * @property datosgenerales
    * @description
    * Esta propiedad contiene la configuración de los campos del formulario dinámico 
    * utilizado en el componente. La configuración está basada en la constante 
    * `DATOS_GENERALES_DEL_SOLICITANTE`, que define los detalles de cada campo, como su 
    * identificador, etiqueta, tipo de entrada, validadores, y más.
    * 
    * Se utiliza para renderizar dinámicamente los campos del formulario y para 
    * gestionar su comportamiento, como la validación y la interacción con los datos 
    * obtenidos de los servicios.
    */
  public datosGeneralesFormData = DATOS_GENERALES_DEL_SOLICITANTE;

  /**
   * compo doc
   * @type {FormGroup}
   * @memberof DatosGeneralesComponent
   * @description
   * Este es un formulario reactivo de Angular representado por un FormGroup.
   * Se utiliza para manejar y validar los datos del formulario en el componente.
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
   * @constructor
   * @description
   * Constructor del componente `DatosGeneralesComponent`. Inicializa las dependencias necesarias para el funcionamiento del componente.
   * @param {ServicioDeFormularioService} servicioDeFormularioService - Servicio para gestionar formularios dinámicos.
   */
    constructor(
      private servicioDeFormularioService: ServicioDeFormularioService
    ) {
      //
    }

    /**
 * @method ngOnInit
 * @description
 * Este método se ejecuta al inicializar el componente `DomicilioFiscalComponent`. 
 * Realiza las siguientes acciones:
 * 
 * Funcionalidad:
 * - Se suscribe al observable `selectSolicitudDeRegistroTpl$` del servicio `Tramite120101Query` 
 *   para obtener el estado de la sección "Solicitud de Registro".
 * - Actualiza la propiedad `solicitudDeRegistroState` con el estado obtenido.
 * - Registra el formulario dinámico `domicilioFiscalForm` en el servicio `ServicioDeFormularioService`.
 * 
 * @example
 * // Al inicializar el componente:
 * this.ngOnInit();
 * // El estado de la solicitud se actualiza y el formulario se registra.
 */
  ngOnInit(): void {
    this.servicioDeFormularioService.registerForm(
      'datosGeneralesForm',
      this.ninoFormGroup
    );
  }
}
