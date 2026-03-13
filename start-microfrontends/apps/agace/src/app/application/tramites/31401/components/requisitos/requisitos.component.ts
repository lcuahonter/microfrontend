import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ENCABEZADO_DE_TABLA, REQUISITOS } from '../../constantes/cancelacion-garantia.enum';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputRadioComponent, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { RequisitosTabla } from '../../models/cancelacion-garantia.model';

/**
  * @Component
  * @selector requisitos
  * @description
  * Componente `RequisitosComponent` que representa la sección del formulario relacionada con los requisitos.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Es un componente independiente (`standalone`) que importa módulos y componentes necesarios para su funcionamiento.
  * - Renderiza un formulario dinámico y una tabla dinámica utilizando los componentes `FormasDinamicasComponent` y `TablaDinamicaComponent`.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `requisitos`.
  * - `standalone`: Indica que el componente es independiente.
  * - `imports`: Lista de módulos y componentes importados, como `CommonModule`, `ReactiveFormsModule`, `FormasDinamicasComponent`, `TablaDinamicaComponent`, e `InputRadioComponent`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * - `styleUrl`: Ruta al archivo de estilos SCSS del componente.
  * 
  * @example
  * <requisitos></requisitos>
  */
@Component({
  selector: 'requisitos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    TablaDinamicaComponent,
    InputRadioComponent
  ],
  templateUrl: './requisitos.component.html',
  styleUrl: './requisitos.component.scss',
})

export class RequisitosComponent implements OnInit, OnDestroy {

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  @Input() consultaState!: ConsultaioState;

  /**
   * @property forma
   * @description
   * Representa el formulario reactivo utilizado en el componente `RequisitosComponent`.
   * @type {FormGroup}
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({}),
    rfc: new FormControl({ value: '', disabled: true }),
    senaleEncuentra: new FormControl({ value: 1, disabled: true }),
    delMismo: new FormControl({ value: 1, disabled: true }),
    indiqueEncuentra: new FormControl({ value: 1, disabled: true }),
    senaleCertificados: new FormControl({ value: 1, disabled: true }),
    senaleActulaizado: new FormControl({ value: 1, disabled: true }),
    senaleSuspendida: new FormControl({ value: 1, disabled: true }),
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
   * @property requisitosFormData
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
    public requisitosFormData = REQUISITOS;

  /**
   * Tipo de selección para la tabla de insumos.
   * Por defecto, se utiliza la selección por checkbox.
   */
  public tipoSeleccionTabla: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas para la tabla de extranjeros.
   */
  public tableHeaderRequisitos = ENCABEZADO_DE_TABLA;

  /**
   * Lista de insumos que se mostrarán en la tabla.
   */
  public tablaRequisitos: RequisitosTabla[] = [];

  /**
   * @property destroy$
   * @description
   * Sujeto utilizado para gestionar la destrucción de suscripciones en el componente `ModalidadDeLaGarantiaComponent`.
   * @type {Subject<void>}
   */
  public destroy$ = new Subject<void>();

  /**
   * @property requisitosRadioData
   * @description
   * Contiene las opciones disponibles para el tipo de garantía que se mostrarán en el formulario.
   * @type {Array<{value: number, label: string}>}
   */
  public requisitosRadioData: { value: number; label: string }[] = [];
  
  /**
  * @constructor
  * @description
  * Constructor del componente `RequisitosComponent`.
  * 
  * Detalles:
  * - Inyecta el servicio `CancelacionGarantiaService` para gestionar la obtención de datos relacionados con los requisitos.
  * - Este servicio se utiliza para interactuar con la API y obtener la información necesaria para el formulario y la tabla dinámica.
  * 
  * @param {CancelacionGarantiaService} cancelacionGarantiaService - Servicio para manejar la lógica de cancelación de garantías.
  */

  /**
  * @constructor
  * @description
  * Constructor del componente `RequisitosComponent`.
  * 
  * Detalles:
  * - Inyecta el servicio `CancelacionGarantiaService` para gestionar la obtención de datos relacionados con los requisitos.
  * - Este servicio se utiliza para interactuar con la API y obtener la información necesaria para el formulario y la tabla dinámica.
  * 
  * @param {CancelacionGarantiaService} cancelacionGarantiaService - Servicio para manejar la lógica de cancelación de garantías.
  */
  constructor(
    public cancelacionGarantiaService: CancelacionGarantiaService
  ) {
    //
  }

  /**
  * @method ngOnInit
  * @description
  * Método de inicialización del componente `RequisitosComponent`.
  * 
  * Detalles:
  * - Llama al servicio `obtenerDatosTablaRequisitos` para cargar los datos de la tabla de requisitos.
  * - Filtra los datos para excluir registros vacíos o nulos.
  * - Asigna los datos filtrados a la propiedad `tablaRequisitos` para renderizar la tabla dinámica.
  * - Llama al método `obtenerRequisitosDatos` para cargar las opciones disponibles para el tipo de garantía.
  * 
  * Funcionalidad:
  * - Este método configura los datos iniciales necesarios para el formulario y la tabla dinámica.
  * 
  * @example
  * this.ngOnInit();
  * // Inicializa el componente y carga los datos necesarios.
  */
  ngOnInit(): void {
    this.cancelacionGarantiaService.obtenerDatosTablaRequisitos()
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp) => {
      if (resp && resp.length > 0) {
        const REQUISITOS_TABLA = resp.filter(item => 
          Object.values(item).some(value => value !== null && value !== '' && value !== undefined)
        );
        if (REQUISITOS_TABLA.length > 0) {
          this.tablaRequisitos = REQUISITOS_TABLA;
        } else {
          this.tablaRequisitos = [];
        }
      }
    });
    this.obtenerRequisitosDatos();
  }

  /**
     * @method obtenerRequisitosDatos
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
    public obtenerRequisitosDatos(): void {
      this.cancelacionGarantiaService
        .getRequisitosRadioData()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp: { value: number; label: string }[]) => {
            if (Array.isArray(resp) && resp.length > 0) {
              this.requisitosRadioData = resp;
            } else {
              this.requisitosRadioData = [];
            }
          },
          error: () => {
            this.requisitosRadioData = [];
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
