/**
 * @component
 * @name InternaTercerosRelacionadosComponent
 * @description
 * Componente para gestionar los terceros relacionados (exportadores y destinos) en el trámite 220701.
 * Permite visualizar, seleccionar y manejar la información de exportadores y destinos asociados al trámite.
 * Utiliza tablas dinámicas, consume servicios para obtener los datos y permite la interacción mediante selección tipo radio y checkbox.
 * Implementa la lógica de inicialización, carga de datos y actualización de la vista.
 * 
 * @example
 * <interna-terceros-relacionados></interna-terceros-relacionados>
 */
import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';



import { ReactiveFormsModule } from '@angular/forms';

import {Subject, map, takeUntil } from 'rxjs';


import {
  AlertComponent,
  ConfiguracionColumna,
  TituloComponent,
} from '@libs/shared/data-access-user/src';

import {
  TablaDinamicaComponent,
  TablaSeleccion,
} from '@ng-mf/data-access-user';

import { MANDATORY_INSTRUCTION } from '../../constantes/inspeccion-fisica-zoosanitario.enums';

import {
  DESTINO_SERVICIO,
  EXPORTADOR_SERVICIO,
  destinoInfo,
  exportadorInfo,
} from '../../modelos/datos-de-interfaz.model';

import { ConsultaioQuery} from "@ng-mf/data-access-user";

import { ExportadorDatosService } from '../../servicios/exportador-datos.service';

/**
 * @component
 * @name InternaTercerosRelacionadosComponent
 * @description
 * Componente para gestionar los terceros relacionados (exportadores y destinos) en el trámite 220701.
 * Permite visualizar, seleccionar y manejar la información de exportadores y destinos asociados al trámite.
 * Utiliza tablas dinámicas, consume servicios para obtener los datos y permite la interacción mediante selección tipo radio y checkbox.
 * Implementa la lógica de inicialización, carga de datos y actualización de la vista.
 *
 * - Visualiza y selecciona exportadores y destinos asociados al trámite.
 * - Utiliza tablas dinámicas para mostrar la información.
 * - Permite la selección de filas mediante radio y checkbox.
 * - Consume servicios para obtener los datos y actualiza la vista automáticamente.
 *
 * @example
 * <interna-terceros-relacionados></interna-terceros-relacionados>
 */@Component({
  selector: 'interna-terceros-relacionados',
  standalone: true,
  imports: [AlertComponent, CommonModule, ReactiveFormsModule, TituloComponent, TablaDinamicaComponent],
  templateUrl: './interna-terceros-relacionados.component.html',
  styleUrl: './interna-terceros-relacionados.component.scss'
})
export class InternaTercerosRelacionadosComponent implements OnInit {
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Instrucción obligatoria para la acción de doble clic.
   * @type {string}
   */
   instruccionDobleClic: string = MANDATORY_INSTRUCTION;

  /**
   * Tipo de selección de la tabla utilizando un radio button.
   * @type {TablaSeleccion}
   */
     tablaSeleccionRadio: TablaSeleccion = TablaSeleccion.RADIO;

       /**
   * Tipo de selección de la tabla utilizando checkbox.
   * @type {TablaSeleccion}
   */
     tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;
   
  /**
   * Configuración de las columnas de la tabla para la lista de exportadores.
   * Define las propiedades y formato de las columnas en la tabla de exportadores.
   * @type {ConfiguracionColumna<exportadorInfo>[]}
   */
   exportadorTabla: ConfiguracionColumna<exportadorInfo>[] = EXPORTADOR_SERVICIO;

  /**
   * Datos de los exportadores cargados en la tabla.
   * Contiene la información de los exportadores asociados al trámite.
   * @type {exportadorInfo[]}
   */
     exportadorTableDatos: exportadorInfo[] = [];
 
  /**
   * Contenido de los exportadores obtenido desde el servicio o API.
   * Este array almacena la información sin formato antes de ser procesada para la tabla.
   * @type {any[]}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
   exportadorContenido: any[] = [];

  /**
   * Configuración de las columnas de la tabla para la lista de destinos.
   * Define las propiedades y formato de las columnas en la tabla de destinos.
   * @type {ConfiguracionColumna<destinoInfo>[]}
   */
      destinoTabla: ConfiguracionColumna<destinoInfo>[] = DESTINO_SERVICIO;
  
  /**
   * Datos de los destinos cargados en la tabla.
   * Contiene la información de los destinos relacionados con el trámite.
   * @type {destinoInfo[]}
   */
      destinoTablaDatos: destinoInfo[] = [];
  

  /**
   * Contenido de los destinos obtenido desde el servicio o API.
   * Este array almacena la información sin formato antes de ser procesada para la tabla.
   * @type {any[]}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    destinoContenido: any[] = [];

  private unsubscribe$ = new Subject<void>();

  /**
   * Constructor del componente.
   * Inicializa los servicios necesarios para gestionar datos de exportadores y detectar cambios en la vista.
   *
   * @param {ExportadorDatosService} exportadorDatosService - Servicio para gestionar los datos de exportadores.
   * @param {ChangeDetectorRef} cdr - Detector de cambios para actualizar la vista cuando los datos cambian.
   */
    constructor(
      private exportadorDatosService: ExportadorDatosService,
      private cdr: ChangeDetectorRef,
      private consultaQuery: ConsultaioQuery
    ) {
       this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
      // Se puede agregar aquí la lógica del constructor si es necesario
    }

      /**
   * @method ngOnInit
   * @description Método de inicialización del componente.
   * Llama a `obtenerDatos` para obtener los datos necesarios al cargar el componente.
   */
     ngOnInit(): void {
      this.obtenerDatos();
     }
     
/**
 * @description Obtiene los datos de exportadores y destinos desde el servicio `ExportadorDatosService`.
 * Actualiza las tablas y detecta cambios en la vista.
 */
    obtenerDatos(): void {
      this.exportadorDatosService.getDatos()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: { exportadorContenido: exportadorInfo[]; destinoContenido: destinoInfo[] }) => {
          if (response && Array.isArray(response.exportadorContenido) &&
          Array.isArray(response.destinoContenido)) {
            this.exportadorTableDatos = response.exportadorContenido;
            this.destinoTablaDatos = response.destinoContenido;
            this.cdr.detectChanges(); 
          } else {
            console.error("La respuesta de la API no tiene el formato esperado: ", response);
          }
        },
        error: (error) => {
          console.error("Error al obtener datos: ", error);
        }
      });
    }
    
}
