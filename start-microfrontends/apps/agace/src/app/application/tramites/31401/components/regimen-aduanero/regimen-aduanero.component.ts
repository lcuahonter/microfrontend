import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputFecha, InputFechaComponent, InputRadioComponent, ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { REGIMEN_ADUANERO } from '../../constantes/cancelacion-garantia.enum';

/**
  * @Component
  * @selector regimen-aduanero
  * @description
  * Componente `RegimenAduaneroComponent` que representa la sección del formulario relacionada con el régimen aduanero.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Es un componente independiente (`standalone`) que importa módulos y componentes necesarios para su funcionamiento.
  * - Renderiza un formulario dinámico utilizando los componentes `FormasDinamicasComponent`, `InputFechaComponent`, e `InputRadioComponent`.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `regimen-aduanero`.
  * - `standalone`: Indica que el componente es independiente.
  * - `imports`: Lista de módulos y componentes importados, como `CommonModule`, `ReactiveFormsModule`, `FormasDinamicasComponent`, `InputFechaComponent`, e `InputRadioComponent`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * - `styleUrl`: Ruta al archivo de estilos SCSS del componente.
  * 
  * @example
  * <regimen-aduanero></regimen-aduanero>
  */
@Component({
  selector: 'regimen-aduanero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormasDinamicasComponent, InputFechaComponent, InputRadioComponent],
  templateUrl: './regimen-aduanero.component.html',
  styleUrl: './regimen-aduanero.component.scss',
})

export class RegimenAduaneroComponent implements OnInit, OnDestroy {
  /**
   * @property forma
   * @description
   * Representa el formulario reactivo utilizado en el componente `RegimenAduaneroComponent`.
   * @type {FormGroup}
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({}),
    fechaDeFin: new FormControl({value: '30/09/2024', disabled: true}),
    numero: new FormControl({value: '543543', disabled: true}),
    senaleEncuentra: new FormControl({value: 1, disabled: true})
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
   * @property regimenFormData
   * @type {ModeloDeFormaDinamica[]}
   * @description
   * Esta propiedad contiene la configuración de los campos del formulario dinámico
   * utilizado en el componente. La configuración está basada en la constante
   * `REGIMEN_ADUANERO`, que define los detalles de cada campo, como su
   * identificador, etiqueta, tipo de entrada, validadores, y más.
   *
   * Se utiliza para renderizar dinámicamente los campos del formulario y para
   * gestionar su comportamiento, como la validación y la interacción con los datos
   * obtenidos de los servicios.
   */
  public regimenFormData = REGIMEN_ADUANERO;

  /**
   * @property destroy$
   * @description
   * Sujeto utilizado para gestionar la destrucción de suscripciones en el componente `ModalidadDeLaGarantiaComponent`.
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
  * Constructor del componente `RegimenAduaneroComponent`.
  * 
  * Detalles:
  * - Inyecta el servicio `CancelacionGarantiaService` para gestionar la obtención de datos relacionados con el régimen aduanero.
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
  * Método de inicialización del componente `RegimenAduaneroComponent`.
  * 
  * Detalles:
  * - Llama a los métodos `obtenerRegimenDatos` y `obtenerRadioDatos` para cargar los datos necesarios al inicializar el componente.
  * - `obtenerRegimenDatos`: Carga las opciones del régimen aduanero en el formulario dinámico.
  * - `obtenerRadioDatos`: Carga las opciones disponibles para el tipo de garantía.
  * 
  * @example
  * this.ngOnInit();
  * // Inicializa el componente y carga los datos necesarios.
  */
  ngOnInit(): void {
    this.obtenerRegimenDatos();
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
   * this.obtenerRadioDatos();
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
  * @method obtenerRegimenDatos
  * @description
  * Método que obtiene los datos relacionados con el régimen aduanero desde el servicio `CancelacionGarantiaService`.
  * 
  * Detalles:
  * - Realiza una solicitud al servicio `getRegimenAduaneraData` para obtener los datos necesarios.
  * - Busca el campo correspondiente al régimen aduanero en la configuración del formulario dinámico.
  * - Si el campo no tiene opciones definidas, las asigna utilizando los datos obtenidos del servicio.
  * 
  * Funcionalidad:
  * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
  * - Actualiza dinámicamente las opciones del campo `regimen` en el formulario.
  * 
  * @example
  * this.obtenerRegimenDatos();
  * // Carga las opciones del régimen aduanero en el formulario dinámico.
  */
  public obtenerRegimenDatos(): void {
    this.cancelacionGarantiaService
      .getRegimenAduaneraData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const REGIMEN_FIELD = this.regimenFormData.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'regimen'
        ) as ModeloDeFormaDinamica;
        if (REGIMEN_FIELD) {
          if (!REGIMEN_FIELD.opciones) {
            REGIMEN_FIELD.opciones = data.map(
              (item: { label: string; value: number }) => ({
                label: item.label,
                value: item.value,
              })
            );
          }
        }
      });
  }

  /**
  * @method obtenerInformacionDeFecha
  * @description
  * Método estático que devuelve la configuración de un campo de tipo fecha.
  * 
  * Detalles:
  * - Proporciona los datos necesarios para configurar un campo de entrada de fecha.
  * - Incluye propiedades como el nombre de la etiqueta, si es obligatorio y si está habilitado.
  * 
  * @returns {InputFecha} Objeto con la configuración del campo de fecha.
  * 
  * @example
  * const fechaConfig = RegimenAduaneroComponent.obtenerInformacionDeFecha;
  * console.log(fechaConfig.labelNombre); // 'Fecha de fin de vigencia'
  */
  // eslint-disable-next-line class-methods-use-this
  get obtenerInformacionDeFecha(): InputFecha {
    const DATOS = {
        labelNombre: 'Fecha de fin de vigencia', 
        required: true,
        habilitado: false,
      };
      return DATOS;
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
