import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DOMICILIO_FISCAL_DEL_SOLICITANTE } from '../../constantes/solicitud-de-registro-tpl.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';

/**
 * @component DomicilioFiscalComponent
 * @description
 * Este componente representa la sección "Domicilio Fiscal" del trámite 120101. 
 * Utiliza un formulario dinámico para capturar y gestionar los datos relacionados con el domicilio fiscal del solicitante.
 * 
 * Funcionalidad:
 * - Renderiza dinámicamente los campos del formulario basados en la configuración definida en `DOMICILIO_FISCAL_DEL_SOLICITANTE`.
 * - Maneja la validación y el estado del formulario utilizando formularios reactivos de Angular.
 * - Proporciona métodos para manejar cambios en los valores del formulario y actualizar el estado global del trámite.
 * 
 * @selector domicilio-fiscal
 * @imports CommonModule, ReactiveFormsModule, FormasDinamicasComponent
 * @templateUrl ./domicilio-fiscal.component.html
 * @styleUrl ./domicilio-fiscal.component.scss
 */
@Component({
  selector: 'domicilio-fiscal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormasDinamicasComponent],
  templateUrl: './domicilio-fiscal.component.html',
  styleUrl: './domicilio-fiscal.component.scss',
})
export class DomicilioFiscalComponent implements OnInit {
  /**
   * compo doc
   * @property domicilioFiscalFormData
   * @description
   * Esta propiedad contiene la configuración de los campos del formulario dinámico
   * utilizado en el componente. La configuración está basada en la constante
   * `DOMICILIO_FISCAL_DEL_SOLICITANTE`, que define los detalles de cada campo, como su
   * identificador, etiqueta, tipo de entrada, validadores, y más.
   *
   * Se utiliza para renderizar dinámicamente los campos del formulario y para
   * gestionar su comportamiento, como la validación y la interacción con los datos
   * obtenidos de los servicios.
   */
  public domicilioFiscalFormData = DOMICILIO_FISCAL_DEL_SOLICITANTE;

  /**
   * compo doc
   * @type {FormGroup}
   * @memberof DomicilioFiscalComponent
   * @description
   * Este es un formulario reactivo de Angular representado por un FormGroup.
   * Se utiliza para manejar y validar los datos del formulario en el componente.
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({}),
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
 * Constructor del componente `DomicilioFiscalComponent`. Inicializa las dependencias necesarias para el funcionamiento del componente.
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
      'domicilioFiscalForm',
      this.ninoFormGroup
    );
  }
}
