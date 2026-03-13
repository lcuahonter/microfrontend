import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { CommonModule } from '@angular/common';

/**
  * @Component
  * @selector modalidad-de-la-garantia
  * @description
  * Componente `ModalidadDeLaGarantiaComponent` que representa la sección del formulario relacionada con la modalidad de la garantía.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Es un componente independiente (`standalone`) que importa módulos y componentes necesarios para su funcionamiento.
  * - Renderiza un formulario dinámico utilizando los componentes `TituloComponent` e `InputRadioComponent`.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `modalidad-de-la-garantia`.
  * - `standalone`: Indica que el componente es independiente.
  * - `imports`: Lista de módulos y componentes importados, como `CommonModule`, `ReactiveFormsModule`, `TituloComponent`, e `InputRadioComponent`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * - `styleUrl`: Ruta al archivo de estilos SCSS del componente.
  * 
  * @example
  * <modalidad-de-la-garantia></modalidad-de-la-garantia>
  */
@Component({
  selector: 'modalidad-de-la-garantia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
  ],
  templateUrl: './modalidad-de-la-garantia.component.html',
  styleUrl: './modalidad-de-la-garantia.component.scss',
})

export class ModalidadDeLaGarantiaComponent implements OnInit, OnDestroy {
  /**
   * @property modalidadDeGarantiaForm
   * @description
   * Representa el formulario reactivo utilizado en el componente `ModalidadDeLaGarantiaComponent`.
   * @type {FormGroup}
   */
  public modalidadDeGarantiaForm!: FormGroup;

  /**
   * @property modalidadDeGarantiaData
   * @description
   * Contiene las opciones disponibles para el tipo de garantía que se mostrarán en el formulario.
   * @type {Array<{value: number, label: string}>}
   */
  public modalidadDeGarantiaData: { value: number; label: string }[] = [];

  /**
   * @property destroy$
   * @description
   * Sujeto utilizado para gestionar la destrucción de suscripciones en el componente `ModalidadDeLaGarantiaComponent`.
   * @type {Subject<void>}
   */
  public destroy$ = new Subject<void>();

  /**
   * @constructor
   * @description
   * Constructor del componente `ModalidadDeLaGarantiaComponent`. Inicializa las dependencias necesarias para el funcionamiento del componente.
   *
   * Funcionalidad:
   * - Inyecta el servicio `FormBuilder` para la creación y gestión de formularios reactivos.
   * - Inyecta el servicio `CancelacionGarantiaService` para obtener las opciones disponibles para el tipo de garantía.
   *
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {CancelacionGarantiaService} cancelacionGarantiaService - Servicio para gestionar los datos relacionados con la cancelación de garantías.
   */
  constructor(
    private fb: FormBuilder,
    private cancelacionGarantiaService: CancelacionGarantiaService
  ) {
    //
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente `ModalidadDeLaGarantiaComponent`.
   */
  ngOnInit(): void {
    this.modalidadDeGarantiaForm = this.fb.group({
      modalidad: [{ value: 1, disabled: true }, Validators.required],
    });
    this.obtenerModalidadDatos();
  }

  /**
   * @method obtenerTipoDatos
   * @description
   * Método que obtiene las opciones disponibles para el tipo de garantía desde el servicio `CancelacionGarantiaService`.
   *
   * Funcionalidad:
   * - Realiza una solicitud al servicio `getTipoDeGarantiaData` para obtener los datos.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * - Actualiza la propiedad `tipoDeGarantiaData` con las opciones obtenidas o la inicializa como un arreglo vacío en caso de error o datos vacíos.
   *
   * @example
   * this.obtenerTipoDatos();
   * // Carga las opciones disponibles para el tipo de garantía.
   */
  public obtenerModalidadDatos(): void {
    this.cancelacionGarantiaService
      .getModalidadDeGarantiaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: { value: number; label: string }[]) => {
          if (Array.isArray(resp) && resp.length > 0) {
            this.modalidadDeGarantiaData = resp;
          } else {
            this.modalidadDeGarantiaData = [];
          }
        },
        error: () => {
          this.modalidadDeGarantiaData = [];
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
