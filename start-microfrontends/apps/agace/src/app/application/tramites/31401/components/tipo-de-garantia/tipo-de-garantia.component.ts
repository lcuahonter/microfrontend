import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { CommonModule } from '@angular/common';
import { TIPO_DE_GARANTIA_NOTA } from '../../constantes/cancelacion-garantia.enum';

/**
 * @component TipoDeGarantiaComponent
 * @description
 * Componente que gestiona el formulario para seleccionar el tipo de garantía en el trámite de cancelación de garantías.
 * 
 * Funcionalidad:
 * - Renderiza un formulario reactivo con opciones de tipo radio para seleccionar el tipo de garantía.
 * - Obtiene las opciones disponibles desde el servicio `CancelacionGarantiaService`.
 * - Maneja la validación del formulario y la lógica asociada a la selección del tipo de garantía.
 * 
 * @selector tipo-de-garantia
 * @templateUrl ./tipo-de-garantia.component.html
 * @styleUrl ./tipo-de-garantia.component.scss
 */
@Component({
  selector: 'tipo-de-garantia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent
  ],
  templateUrl: './tipo-de-garantia.component.html',
  styleUrl: './tipo-de-garantia.component.scss',
})

export class TipoDeGarantiaComponent implements OnInit, OnDestroy{
  /**
 * @property tipoDeGarantiaForm
 * @description
 * Representa el formulario reactivo utilizado en el componente `TipoDeGarantiaComponent`.
 * @type {FormGroup}
 */
  public tipoDeGarantiaForm!: FormGroup;

  /**
 * @property destroy$
 * @description
 * Sujeto utilizado para gestionar la destrucción de suscripciones en el componente `TipoDeGarantiaComponent`.
 * @type {Subject<void>}
 */
  public destroy$ = new Subject<void>();

  /**
 * @property tipoDeGarantiaData
 * @description
 * Contiene las opciones disponibles para el tipo de garantía que se mostrarán en el formulario.
 * @type {Array<{value: number, label: string}>}
 */
  public tipoDeGarantiaData: {value: number, label: string}[] = [];

  /**
  * @property tipoNota
  * @description
  * Contiene el mensaje informativo relacionado con los requisitos necesarios para la aceptación de la garantía (carta de crédito).
  * 
  * Detalles:
  * - Utiliza la constante `TIPO_DE_GARANTIA_NOTA` importada desde el archivo de constantes.
  * - Este mensaje se utiliza para mostrar información relevante al usuario en el formulario.
  * 
  * @type {string}
  * 
  * @example
  * console.log(this.tipoNota);
  * // Muestra el contenido de `TIPO_DE_GARANTIA_NOTA`.
  */
  public tipoNota = TIPO_DE_GARANTIA_NOTA;

  /**
 * @constructor
 * @description
 * Constructor del componente `TipoDeGarantiaComponent`. Inicializa las dependencias necesarias para el funcionamiento del componente.
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
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente `TipoDeGarantiaComponent`.
 */
  ngOnInit(): void {
    this.tipoDeGarantiaForm = this.fb.group({
      tipoDeGarantia: [{ value: 1, disabled: true }, Validators.required]
    });
    this.obtenerTipoDatos();
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
  public obtenerTipoDatos(): void {
    this.cancelacionGarantiaService
      .getTipoDeGarantiaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: {value: number, label: string}[]) => {
          if (Array.isArray(resp) && resp.length > 0) {
            this.tipoDeGarantiaData = resp;
          } else {
            this.tipoDeGarantiaData = [];
          }
        },
        error: () => {
          this.tipoDeGarantiaData = [];
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
