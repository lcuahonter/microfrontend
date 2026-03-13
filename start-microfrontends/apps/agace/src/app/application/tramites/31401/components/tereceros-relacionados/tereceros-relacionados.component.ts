import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { ENCABEZADO_DE_TERECEROS_TABLA } from '../../constantes/cancelacion-garantia.enum';
import { TerecerosTabla } from '../../models/cancelacion-garantia.model';

/**
  * @Component
  * @selector tereceros-relacionados
  * @description
  * Componente `TerecerosRelacionadosComponent` que representa la sección del formulario relacionada con los terceros relacionados.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Es un componente independiente (`standalone`) que importa módulos y componentes necesarios para su funcionamiento.
  * - Renderiza una tabla dinámica utilizando el componente `TablaDinamicaComponent`.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `tereceros-relacionados`.
  * - `standalone`: Indica que el componente es independiente.
  * - `imports`: Lista de módulos y componentes importados, como `CommonModule`, `TituloComponent`, y `TablaDinamicaComponent`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * - `styleUrl`: Ruta al archivo de estilos SCSS del componente.
  * 
  * @example
  * <tereceros-relacionados></tereceros-relacionados>
  */
@Component({
  selector: 'tereceros-relacionados',
  standalone: true,
  imports: [CommonModule, TituloComponent, TablaDinamicaComponent],
  templateUrl: './tereceros-relacionados.component.html',
  styleUrl: './tereceros-relacionados.component.scss',
})

export class TerecerosRelacionadosComponent implements OnInit, OnDestroy {
  
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
  public tableHeaderTereceros = ENCABEZADO_DE_TERECEROS_TABLA;

  /**
   * Lista de insumos que se mostrarán en la tabla.
   */
  public tablaTereceros: TerecerosTabla[] = [];

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
  * Constructor del componente `TerecerosRelacionadosComponent`.
  * 
  * Detalles:
  * - Inyecta el servicio `CancelacionGarantiaService` para gestionar la obtención de datos relacionados con los terceros.
  * - Este servicio se utiliza para interactuar con la API y obtener la información necesaria para la tabla dinámica.
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
  * Método de inicialización del componente `TerecerosRelacionadosComponent`.
  * 
  * Detalles:
  * - Obtiene los datos de la tabla de terceros relacionados utilizando el servicio `CancelacionGarantiaService`.
  * - Filtra los datos para excluir registros vacíos o nulos.
  * - Asigna los datos filtrados a la propiedad `tablaTereceros` para renderizar la tabla dinámica.
  * 
  * @example
  * // Ejecución al inicializar el componente:
  * this.ngOnInit();
  */
  ngOnInit(): void {
    this.cancelacionGarantiaService.obtenerDatosTablaTereceros()
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp) => {
      if (resp && resp.length > 0) {
        const REQUISITOS_TABLA = resp.filter(item => 
          Object.values(item).some(value => value !== null && value !== '' && value !== undefined)
        );
        if (REQUISITOS_TABLA.length > 0) {
          this.tablaTereceros = REQUISITOS_TABLA;
        } else {
          this.tablaTereceros = [];
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
