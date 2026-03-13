/**
 * Este módulo define el componente `DatosTratadosAcuerdosComponent` que maneja la información de los tratados y acuerdos.
 */

import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

import { ConfiguracionColumna, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';

import { ComercializadoresProductosResponse, CriterioTratadoDetalle } from '../../models/response/comercializadores-productos-response.model';
 import { DatostratadosacuerdosService } from '@ng-mf/data-access-user';

/**
 * Este módulo define el componente `DatosTratadosAcuerdosComponent` que maneja la información de los tratados y acuerdos.
 */
@Component({
  selector: 'app-datos-tratados-acuerdos',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent],
  templateUrl: './datos-tratados-acuerdos.component.html',
  styleUrl: './datos-tratados-acuerdos.component.scss',
})
export class DatosTratadosAcuerdosComponent implements OnChanges, OnDestroy {

  /**
   * Configuración de la tabla que se utilizará en el componente.
   * @type {CriterioTratadoDetalle}
   */
  public configuracionTabla: ConfiguracionColumna<CriterioTratadoDetalle>[] = [
    { encabezado: 'País o bloque', clave: (item) => item.pais_bloque_nombre, orden: 1 },
    { encabezado: "Tratado o Acuerdo", clave: (item) => item.tratado_acuerdo.nombre, orden: 2 },
    { encabezado: "Criterio de origen", clave: (item) => item.criterio_origen.nombre, orden: 3 },
    { encabezado: "Norma", clave: (item) => item.norma_pais_criterio.descripcion_norma_origen, orden: 4 },
    { encabezado: "Otras instancias", clave: (item) => item.otras_instancias_asociadas ?? "", orden: 5 },
    { encabezado: "Juegos o surtidos", clave: (item) => item.descripcion_juego_surtido ?? "", orden: 6 },
  ];

  /**
   * Selección de la tabla inicializada como indefinida.
   * @type {TablaSeleccion}
   */
  seleccionTabla = TablaSeleccion.UNDEFINED;

  /**
    * Datos de la tabla de tratados.
    * Este array contiene objetos de tipo `CriterioTratadoDetalle` que representan
    * el resultado los tratados.
  */
   public tratadosTablaDatos: CriterioTratadoDetalle[]= []

  /**
   * Subject para manejar la desuscripción cuando el componente se destruye.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Tratados del comercializador de productos.
   * @type {ComercializadoresProductosResponse}
   */
  @Input() tratados!: ComercializadoresProductosResponse;

  /**
   * Constructor del componente.
   * Servicio para obtener datos para el componente.
   * @param {DatostratadosacuerdosService} service - Servicio para obtener datos de tratados y acuerdos.
   */
  constructor(private service: DatostratadosacuerdosService) {
    // Lógica del constructor puede ser añadida aquí si es necesario
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Obtiene datos del servicio y los asigna a tableData.
   */
 ngOnChanges(changes: SimpleChanges): void {
  if (changes['tratados']) {
    const ACTUAL = changes['tratados'].currentValue;

    if (!ACTUAL) {
      return;
    }

    this.tablaTratados(ACTUAL);
  }
}

  /**
   * @method tablaTratados
   * @description 
   * Actualiza los datos de la tabla de tratados con la información obtenida de la respuesta.
   * @param data 
  */
  tablaTratados(data: ComercializadoresProductosResponse):void{
    const TRATADOS = data.criterios_tratado
    this.tratadosTablaDatos = TRATADOS;
  }

  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject destroyed$ para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}