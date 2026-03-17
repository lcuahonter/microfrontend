import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ENCABEZADO_DE_TABLA_MIEMBRO,
  ENCABEZADO_DE_TABLA_TIPO_INVERSION,
  MIEMBRO_DE_LA_EMPRESA,
} from '../../constantes/cancelacion-garantia.enum';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  InputRadioComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  MiembroTabla,
  TipoInversionTabla,
} from '../../models/cancelacion-garantia.model';
import { Subject, takeUntil } from 'rxjs';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
/**
 * @Component
 * @selector miembro-de-la-empresa
 * @description
 * Componente `MiembroDeLaEmpresaComponent` que representa la sección del formulario relacionada con los miembros de la empresa.
 *
 * Detalles:
 * - Utiliza el decorador `@Component` para definir las propiedades del componente.
 * - Es un componente independiente (`standalone`) que importa módulos y componentes necesarios para su funcionamiento.
 * - Renderiza un formulario dinámico y tablas dinámicas utilizando los componentes `TituloComponent`, `FormasDinamicasComponent`, y `TablaDinamicaComponent`.
 *
 * Propiedades:
 * - `selector`: Define el nombre del selector del componente como `miembro-de-la-empresa`.
 * - `standalone`: Indica que el componente es independiente.
 * - `imports`: Lista de módulos y componentes importados, como `CommonModule`, `ReactiveFormsModule`, `TituloComponent`, `FormasDinamicasComponent`, `TablaDinamicaComponent`, e `InputRadioComponent`.
 * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
 * - `styleUrl`: Ruta al archivo de estilos SCSS del componente.
 *
 * @example
 * <miembro-de-la-empresa></miembro-de-la-empresa>
 */
@Component({
  selector: 'miembro-de-la-empresa',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
  ],
  templateUrl: './miembro-de-la-empresa.component.html',
  styleUrl: './miembro-de-la-empresa.component.scss',
})
export class MiembroDeLaEmpresaComponent implements OnInit, OnDestroy {
  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  @Input() consultaState!: ConsultaioState;

  /**
   * Tipo de selección para la tabla de insumos.
   * Por defecto, se utiliza la selección por checkbox.
   */
  public tipoSeleccionTabla: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas para la tabla de extranjeros.
   */
  public tableHeaderMiembro = ENCABEZADO_DE_TABLA_MIEMBRO;

  /**
   * Lista de insumos que se mostrarán en la tabla.
   */
  public tablaMiembro: MiembroTabla[] = [];
  /**
   * Configuración de las columnas para la tabla de extranjeros.
   */
  public tableHeaderTipoInversion = ENCABEZADO_DE_TABLA_TIPO_INVERSION;

  /**
   * Lista de insumos que se mostrarán en la tabla.
   */
  public tablaTipoInversion: TipoInversionTabla[] = [];

  /**
   * @property forma
   * @description
   * Representa el formulario reactivo utilizado en el componente `MiembroDeLaEmpresaComponent`.
   * @type {FormGroup}
   */
  public forma!: FormGroup;

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
   * @property miembroFormData
   * @type {ModeloDeFormaDinamica[]}
   * @description
   * Esta propiedad contiene la configuración de los campos del formulario dinámico
   * utilizado en el componente. La configuración está basada en la constante
   * `MIEMBRO_DE_LA_EMPRESA`, que define los detalles de cada campo, como su
   * identificador, etiqueta, tipo de entrada, validadores, y más.
   *
   * Se utiliza para renderizar dinámicamente los campos del formulario y para
   * gestionar su comportamiento, como la validación y la interacción con los datos
   * obtenidos de los servicios.
   */
  public miembroFormData = MIEMBRO_DE_LA_EMPRESA;

  /**
   * @property radioDatos
   * @description
   * Contiene las opciones disponibles para el tipo de garantía que se mostrarán en el formulario.
   * @type {Array<{value: number, label: string}>}
   */
  public radioDatos: { value: number; label: string }[] = [];

  /**
   * @property destroy$
   * @description
   * Sujeto utilizado para gestionar la destrucción de suscripciones en el componente `ClientesYProvedoresComponent`.
   * @type {Subject<void>}
   */
  public destroy$ = new Subject<void>();

  /**
   * @constructor
   * @description
   * Constructor del componente `MiembroDeLaEmpresaComponent`.
   *
   * Detalles:
   * - Inyecta el servicio `CancelacionGarantiaService` para gestionar la obtención de datos relacionados con los miembros de la empresa.
   * - Este servicio se utiliza para interactuar con la API y obtener la información necesaria para el formulario dinámico y las tablas.
   *
   * @param {CancelacionGarantiaService} cancelacionGarantiaService - Servicio para manejar la lógica de cancelación de garantías.
   */
  constructor(public cancelacionGarantiaService: CancelacionGarantiaService) {
    //
  }

  /**
   * @method ngOnInit
   * @description
   * Método de inicialización del componente `MiembroDeLaEmpresaComponent`.
   *
   * Detalles:
   * - Llama a los métodos `obtenerDatostablaMiembro`, `obtenerTipoInversionDatos` y `obtenerRadioDatos` para cargar los datos necesarios al inicializar el componente.
   * - `obtenerDatostablaMiembro`: Carga los datos de la tabla de miembros de la empresa.
   * - `obtenerTipoInversionDatos`: Carga los datos de la tabla de tipos de inversión.
   * - `obtenerRadioDatos`: Carga las opciones disponibles para el tipo de garantía.
   *
   * @example
   * this.ngOnInit();
   * // Inicializa el componente y carga los datos necesarios.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerDatostablaMiembro();
    this.obtenerTipoInversionDatos();
    this.obtenerRadioDatos();
  }
  
  /**
  * @method inicializarFormulario
  * @description
  * Método que inicializa el formulario reactivo utilizado en el componente `MiembroDeLaEmpresaComponent`.
  * 
  * Detalles:
  * - Crea un formulario principal `forma` que contiene un grupo de formularios anidado llamado `ninoFormGroup`.
  * - Incluye controles como `senalePreviamente` y `enCasoAffirmativo`, los cuales están deshabilitados por defecto y tienen valores iniciales establecidos.
  * 
  * Funcionalidad:
  * - Este método configura la estructura inicial del formulario reactivo, permitiendo la interacción y validación de los datos en el componente.
  * 
  * @example
  * this.inicializarFormulario();
  * // Inicializa el formulario reactivo con los controles definidos.
  */
  public inicializarFormulario(): void {
    this.forma = new FormGroup({
    ninoFormGroup: new FormGroup({}),
    senalePreviamente: new FormControl({ value: 1, disabled: true }),
    enCasoAffirmativo: new FormControl({ value: 1, disabled: true }),
    });
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
   * @method obtenerDatostablaMiembro
   * @description
   * Método que obtiene los datos de la tabla de miembros de la empresa desde el servicio `CancelacionGarantiaService`.
   *
   * Detalles:
   * - Realiza una solicitud al servicio `obtenerDatosTablaMiembro` para obtener los datos necesarios.
   * - Filtra los datos para excluir registros vacíos o nulos.
   * - Asigna los datos filtrados a la propiedad `tablaMiembro` para renderizar la tabla dinámica.
   *
   * @example
   * this.obtenerDatostablaMiembro();
   * // Carga los datos de la tabla de miembros de la empresa.
   */
  public obtenerDatostablaMiembro(): void {
    this.cancelacionGarantiaService
      .obtenerDatosTablaMiembro()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        if (resp && resp.length > 0) {
          const MIEMBRO_TABLA = resp.filter((item) =>
            Object.values(item).some(
              (value) => value !== null && value !== '' && value !== undefined
            )
          );
          if (MIEMBRO_TABLA.length > 0) {
            this.tablaMiembro = MIEMBRO_TABLA;
          } else {
            this.tablaMiembro = [];
          }
        }
      });
  }

  /**
   * @method obtenerTipoInversionDatos
   * @description
   * Método que obtiene los datos de la tabla de tipos de inversión desde el servicio `CancelacionGarantiaService`.
   *
   * Detalles:
   * - Realiza una solicitud al servicio `obtenerTipoInversionData` para obtener los datos necesarios.
   * - Filtra los datos para excluir registros vacíos o nulos.
   * - Asigna los datos filtrados a la propiedad `tablaTipoInversion` para renderizar la tabla dinámica.
   *
   * @example
   * this.obtenerTipoInversionDatos();
   * // Carga los datos de la tabla de tipos de inversión.
   */
  public obtenerTipoInversionDatos(): void {
    this.cancelacionGarantiaService
      .obtenerTipoInversionData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        if (resp && resp.length > 0) {
          const TIPO_DE_INVERSION_TABLA = resp.filter((item) =>
            Object.values(item).some(
              (value) => value !== null && value !== '' && value !== undefined
            )
          );
          if (TIPO_DE_INVERSION_TABLA.length > 0) {
            this.tablaTipoInversion = TIPO_DE_INVERSION_TABLA;
          } else {
            this.tablaTipoInversion = [];
          }
        }
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
