
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tramite260912Store, Tramites260912State } from '../../estados/tramite-260912.store';
import { ActivatedRoute } from '@angular/router';
import { AgregarFabricanteComponent } from '../../../../shared/components/agregar-fabricante/agregar-fabricante.component';
import { CommonModule } from '@angular/common';

import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';

import { Subject, map, takeUntil } from 'rxjs';
import { ID_PROCEDIMIENTO } from '../../enums/domicilio-del-establecimiento.enum';
import { Router } from '@angular/router';
import { Tramite260912Query } from '../../estados/tramite-260912.query';




/**
 * @component AgregarFabricanteContenedoraComponent
 * @description Componente Angular que representa un contenedor para agregar fabricantes. Este componente es autónomo y utiliza el módulo común de Angular y el componente `AgregarFabricanteComponent`.
 * 
 * @selector app-agregar-fabricante-contenedora
 * @standalone true
 * @imports [CommonModule, AgregarFabricanteComponent]
 * @templateUrl ./agregar-fabricante-contenedora.component.html
 * @styleUrl ./agregar-fabricante-contenedora.component.scss
 * 
 * Este componente está diseñado para interactuar con el store `Tramite260203Store` para gestionar el estado del trámite relacionado. Proporciona funcionalidad para actualizar los datos de fabricantes en el store.
 */
@Component({
  selector: 'app-agregar-fabricante-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarFabricanteComponent],
  templateUrl: './agregar-fabricante-contenedora.component.html',
  styleUrl: './agregar-fabricante-contenedora.component.scss',
})
export class AgregarFabricanteContenedoraComponent implements OnInit {
  
  @Input() idProcedimiento: number = ID_PROCEDIMIENTO;
  @Input() fabricanteTablaDatos: Fabricante[] = [];
  @Input() datoSeleccionado: Fabricante[] = [];
  @Input() tramiteState!: Tramites260912State;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardarYSalir = new EventEmitter<void>();
  @Output() updateFabricanteTablaDatos = new EventEmitter<Fabricante[]>();

  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260214Store` para gestionar el estado del trámite.
   *
   * @param {Tramite260214Store} tramite260214Store - Store que administra el estado del trámite 260214.
   */


  /**
   * Notificador para la destrucción del componente.
   *
   * @type {Subject<void>}
   * @description
   * Subject que se utiliza como mecanismo de cancelación para observables.  
   * Al emitir un valor en `ngOnDestroy`, todas las suscripciones
   * que usen `takeUntil(this.destroyNotifier$)` se completan, 
   * evitando fugas de memoria.
   */
  destroyNotifier$ = new Subject<void>();

  /**
   * Estado actual del trámite 260214.
   *
   * @type {Tramite260214State}
   * @description
   * Contiene la información y valores del estado del trámite en curso.  
   * Se inicializa mediante datos externos o servicios que gestionan
   * el flujo de la aplicación.
   */

  /**
   * Lista de fabricantes en la tabla de datos.
   *
   * @type {Fabricante[]}
   * @description
   * Arreglo que almacena los registros de fabricantes mostrados en la tabla.  
   * Se actualiza dinámicamente a partir de la interacción del usuario
   * o de llamadas a servicios.
   */
 
  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260911Store` para gestionar el estado del trámite.
   * 
   * @param tramite260912Store - Store que administra el estado del trámite 260911.
   */
    constructor(
    public tramite260912Store: Tramite260912Store,
    public tramite260912Query: Tramite260912Query,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tramite260912Query.selectTramite260912$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
          this.fabricanteTablaDatos = seccionState.fabricanteTablaDatos;
        })
      )
      .subscribe();
  }

  /**
   * Ciclo de vida de Angular: `ngAfterViewInit`.
   *
   * @description
   * Se ejecuta después de que la vista del componente ha sido inicializada.  
   *
   * - Se suscribe a los parámetros de la ruta (`queryParams`).  
   * - Si el parámetro `update` es igual a `'false'`, se limpia la lista
   *   de fabricantes (`fabricanteTablaDatos`).  
   *
   * Esto permite resetear los datos de la tabla de fabricantes
   * en función de los parámetros recibidos en la URL tras la carga de la vista.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['update'] === 'false') {
        this.fabricanteTablaDatos = [];
      }else if (params['update'] === 'true') {
        this.fabricanteTablaDatos = this.tramiteState.fabricanteTablaModificaDatos;
      }
    });
  }
  /**
   * @method updateFabricanteTablaDatos
   * @description Actualiza los datos de la tabla de fabricantes en el store del trámite.
   * 
   * @param {Fabricante[]} event - Lista de fabricantes que se actualizarán en el store.
   * @returns {void} Este método no retorna ningún valor.
   */
 




updateFabricanteTablaDatosHandler(event: Fabricante[]): void {
  this.tramite260912Store.updateFabricanteTablaDatos(event); 
  this.cerrarModalAgregarFabricante();
}


  cerrarModalAgregarFabricante(): void {
    this.cancelar.emit();
  }

onLimpiarFabricante(): void {
  this.router.navigate(['../terceros-relacionados'], { relativeTo: this.route });
}

onGuardarFabricante(fabricantes: Fabricante[]): void {
  this.updateFabricanteTablaDatos.emit(fabricantes);
  this.router.navigate(['../terceros-relacionados'], { relativeTo: this.route });
}

}
