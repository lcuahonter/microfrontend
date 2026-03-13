import {
  AlertComponent,
  InputRadioComponent,
} from '@libs/shared/data-access-user/src';
import {
  CONTROL_DE_INVENTARIOS,
  CONTROL_DE_INVENTARIOS_ALERT,
} from '../../constantes/cancelacion-garantia.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

/**
  * @Component
  * @selector control-de-inventarios
  * @description
  * Componente `ControlDeInventariosComponent` que representa la sección del formulario relacionada con el control de inventarios.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Es un componente independiente (`standalone`) que importa módulos y componentes necesarios para su funcionamiento.
  * - Renderiza un formulario dinámico utilizando los componentes `FormasDinamicasComponent`, `AlertComponent`, e `InputRadioComponent`.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `control-de-inventarios`.
  * - `standalone`: Indica que el componente es independiente.
  * - `imports`: Lista de módulos y componentes importados, como `CommonModule`, `ReactiveFormsModule`, `FormasDinamicasComponent`, `AlertComponent`, e `InputRadioComponent`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * - `styleUrl`: Ruta al archivo de estilos SCSS del componente.
  * 
  * @example
  * <control-de-inventarios></control-de-inventarios>
  */
@Component({
  selector: 'control-de-inventarios',
  standalone: true,
  imports: [
    CommonModule,
    FormasDinamicasComponent,
    ReactiveFormsModule,
    AlertComponent,
    InputRadioComponent,
  ],
  templateUrl: './control-de-inventarios.component.html',
  styleUrl: './control-de-inventarios.component.scss',
})

export class ControlDeInventariosComponent implements OnInit, OnDestroy {
  /**
   * @property forma
   * @description
   * Representa el formulario reactivo utilizado en el componente `ManifiestoBajoProtestaComponent`.
   * @type {FormGroup}
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({}),
    nombreDelSistema: new FormControl({ value: 'dasda', disabled: true }),
    lugar: new FormControl({ value: 'sadas', disabled: true }),
    senaleSiIleva: new FormControl({ value: 1, disabled: true }),
    senaleSiIngresa: new FormControl({ value: 1, disabled: true }),
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
   * @property controlInventariosFormData
   * @type {ModeloDeFormaDinamica[]}
   * @description
   * Esta propiedad contiene la configuración de los campos del formulario dinámico
   * utilizado en el componente. La configuración está basada en la constante
   * `CONTROL_DE_INVENTARIOS`, que define los detalles de cada campo, como su
   * identificador, etiqueta, tipo de entrada, validadores, y más.
   *
   * Se utiliza para renderizar dinámicamente los campos del formulario y para
   * gestionar su comportamiento, como la validación y la interacción con los datos
   * obtenidos de los servicios.
   */
  public controlInventariosFormData = CONTROL_DE_INVENTARIOS;

  /**
   * compo doc
   * Mensaje relacionado con el aviso de privacidad simplificado.
   *
   * @type {string}
   * @memberof PantallasComponent
   */
  public controlDeInventariosAlert: string =
    CONTROL_DE_INVENTARIOS_ALERT.mensaje;

  /**
   * @property destroy$
   * @description
   * Sujeto utilizado para gestionar la destrucción de suscripciones en el componente `ClientesYProvedoresComponent`.
   * @type {Subject<void>}
   */
  public destroy$ = new Subject<void>();

  /**
   * @property radioDatos
   * @description
   * Contiene las opciones disponibles para el tipo de garantía que se mostrarán en el formulario.
   * @type {Array<{value: number, label: string}>}
   */
  public radioDatos: { value: number; label: string }[] = [];

  /**
  * @constructor
  * @description
  * Constructor del componente `ControlDeInventariosComponent`.
  * 
  * Detalles:
  * - Inyecta el servicio `CancelacionGarantiaService` para gestionar la obtención de datos relacionados con el control de inventarios.
  * - Este servicio se utiliza para interactuar con la API y obtener la información necesaria para el formulario dinámico.
  * 
  * @param {CancelacionGarantiaService} cancelacionGarantiaService - Servicio para manejar la lógica de cancelación de garantías.
  */
  constructor(public cancelacionGarantiaService: CancelacionGarantiaService) {
    //
  }

  /**
  * @method ngOnInit
  * @description
  * Método de inicialización del componente `ControlDeInventariosComponent`.
  * 
  * Detalles:
  * - Llama al método `obtenerRadioDatos` para cargar las opciones disponibles para el tipo de garantía al inicializar el componente.
  * 
  * @example
  * this.ngOnInit();
  * // Inicializa el componente y carga los datos necesarios.
  */
  ngOnInit(): void {
    this.obtenerRadioDatos();
  }

  /**
   * @method obtenerRadioDatos
   * @description
   * Método que obtiene las opciones disponibles para el tipo de garantía desde el servicio `CancelacionGarantiaService`.
   *
   * Funcionalidad:
   * - Realiza una solicitud al servicio `getTipoDeGarantiaData` para obtener los datos.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * - Actualiza la propiedad `tipoDeGarantiaData` con las opciones obtenidas o la inicializa como un arreglo vacío en caso de error o datos vacíos.
   *
   * @example
   * this.obtenerRequisitosDatos();
   * // Carga las opciones disponibles para el tipo de garantía.
   */
  public obtenerRadioDatos(): void {
    this.cancelacionGarantiaService
      .getRequisitosRadioData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: { value: number; label: string }[]) => {
          if (Array.isArray(resp) && resp.length > 0) {
            this.radioDatos = resp;
          } else {
            this.radioDatos = [];
          }
        },
        error: () => {
          this.radioDatos = [];
        },
      });
  }

  /**
   * @method ngOnDestroy
   * @description
   * Este método es parte del ciclo de vida del componente y se ejecuta automáticamente
   * cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones
   * activas y evitar fugas de memoria en la aplicación.
   *
   * Funcionalidad:
   * - Notifica a través del `Subject` `destroy$` que el componente será destruido.
   * - Completa el `Subject` para liberar los recursos asociados.
   *
   * @example
   * ngOnDestroy(): void {
   *   this.destroy$.next();
   *   this.destroy$.complete();
   * }
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
