import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';
import { TIPO_SECTOR } from '../../constantes/cancelacion-garantia.enum';

/**
  * @Component
  * @selector tipo-sector
  * @description
  * Componente `TipoSectorComponent` que representa la sección del formulario relacionada con el tipo de sector.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Es un componente independiente (`standalone`) que importa módulos y componentes necesarios para su funcionamiento.
  * - Renderiza un formulario dinámico utilizando el componente `FormasDinamicasComponent`.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `tipo-sector`.
  * - `standalone`: Indica que el componente es independiente.
  * - `imports`: Lista de módulos y componentes importados, como `CommonModule`, `ReactiveFormsModule`, y `FormasDinamicasComponent`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * - `styleUrl`: Ruta al archivo de estilos SCSS del componente.
  * 
  * @example
  * <tipo-sector></tipo-sector>
  */
@Component({
  selector: 'tipo-sector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
  ],
  templateUrl: './tipo-sector.component.html',
  styleUrl: './tipo-sector.component.scss',
})

export class TipoSectorComponent implements OnInit, OnDestroy {
  /**
   * @property forma
   * @description
   * Representa el formulario reactivo utilizado en el componente `TipoSectorComponent`.
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
  public tipoSectorFormData = TIPO_SECTOR;

  /**
   * @property destroy$
   * @description
   * Sujeto utilizado para gestionar la destrucción de suscripciones en el componente `TipoSectorComponent`.
   * @type {Subject<void>}
   */
  public destroy$ = new Subject<void>();

  /**
   * @constructor
   * @description
   * Constructor del componente `TipoSectorComponent`. Inicializa las dependencias necesarias para el funcionamiento del componente.
   *
   * Funcionalidad:
   * - Inyecta el servicio `FormBuilder` para la creación y gestión de formularios reactivos.
   * - Inyecta el servicio `CancelacionGarantiaService` para obtener las opciones disponibles para el tipo de garantía.
   *
   * @param {CancelacionGarantiaService} cancelacionGarantiaService - Servicio para gestionar los datos relacionados con la cancelación de garantías.
   */
  constructor(
    private cancelacionGarantiaService: CancelacionGarantiaService
  ) {
    //
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente `TipoSectorComponent`.
   */
  ngOnInit(): void {
    this.obtenerTipoSectorDatos();
  }

  /**
   * @method obtenerTipoSectorDatos
   * @description
   * Método que obtiene las opciones disponibles para el tipo de garantía desde el servicio `CancelacionGarantiaService`.
   *
   * Funcionalidad:
   * - Realiza una solicitud al servicio `getTipoDeGarantiaData` para obtener los datos.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * - Actualiza la propiedad `tipoDeGarantiaData` con las opciones obtenidas o la inicializa como un arreglo vacío en caso de error o datos vacíos.
   *
   * @example
   * this.obtenerTipoSectorDatos();
   * // Carga las opciones disponibles para el tipo de garantía.
   */
  public obtenerTipoSectorDatos(): void {
    this.cancelacionGarantiaService
      .getTipoSectorData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const AUTOR_FIELD = this.tipoSectorFormData.find((datos: ModeloDeFormaDinamica) => datos.campo === 'tipoSector') as ModeloDeFormaDinamica;
        if (AUTOR_FIELD) {
          if (!AUTOR_FIELD.opciones) {
            AUTOR_FIELD.opciones = data.map((item: { label: string, value: number }) => ({
              label: item.label,
              value: item.value,
            }));
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
