import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { CommonModule } from '@angular/common';
/**
  * @Component
  * @selector miembros-de-la-empresa
  * @description
  * Componente `MiembrosDeLaEmpresaComponent` que representa la sección del formulario relacionada con los miembros de la empresa.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Es un componente independiente (`standalone`) que importa módulos y componentes necesarios para su funcionamiento.
  * - Renderiza un formulario dinámico utilizando los componentes `TituloComponent` e `InputRadioComponent`.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `miembros-de-la-empresa`.
  * - `standalone`: Indica que el componente es independiente.
  * - `imports`: Lista de módulos y componentes importados, como `CommonModule`, `ReactiveFormsModule`, `TituloComponent`, e `InputRadioComponent`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * - `styleUrl`: Ruta al archivo de estilos SCSS del componente.
  * 
  * @example
  * <miembros-de-la-empresa></miembros-de-la-empresa>
  */

@Component({
  selector: 'miembros-de-la-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, InputRadioComponent],
  templateUrl: './miembros-de-la-empresa.component.html',
  styleUrl: './miembros-de-la-empresa.component.scss',
})

export class MiembrosDeLaEmpresaComponent implements OnInit, OnDestroy {
  /**
   * @property forma
   * @description
   * Representa el formulario reactivo utilizado en el componente `MiembrosDeLaEmpresaComponent`.
   * @type {FormGroup}
   */
  public miembrosForm: FormGroup = new FormGroup({
    senaleSocios: new FormControl({ value: 1, disabled: true }),
    opinionPositiva: new FormControl({ value: 'Opinión positiva vigente del cumplimiento de obligaciones fiscales de la solicitante, los socios, accionistas, representante legal con facultad para actos de administración o de dominio, administrador único o miembros del consejo de administración, según sea el caso.', disabled: true })
  });

  /**
   * @property destroy$
   * @description
   * Sujeto utilizado para gestionar la destrucción de suscripciones en el componente `MiembrosDeLaEmpresaComponent`.
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
  * Constructor del componente `MiembrosDeLaEmpresaComponent`.
  * 
  * Detalles:
  * - Inyecta el servicio `CancelacionGarantiaService` para gestionar la obtención de datos relacionados con los miembros de la empresa.
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
  * Método de inicialización del componente `MiembrosDeLaEmpresaComponent`.
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
