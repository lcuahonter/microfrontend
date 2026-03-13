import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DetallesPlantasComponent } from '../../../../shared/components/detalles-plantas/detalles-plantas.component';
import { Location } from '@angular/common';
import { PlantasSubfabricante } from '../../../../shared/models/empresas-subfabricanta.model';
import { Tramite80102Query } from '../../estados/tramite80102.query';

@Component({
  selector: 'app-contenedor-complementar-plantas',
  standalone: true,
  imports: [CommonModule, DetallesPlantasComponent],
  templateUrl: './contenedor-complementar-plantas.component.html',
  styleUrl: './contenedor-complementar-plantas.component.scss',
})

/**
 * @component
 * @name ContenedorComplementarPlantasComponent
 * @description Componente encargado de gestionar la vista de las plantas complementarias en el trámite 80102.
 * Este componente permite visualizar y manejar los datos de las plantas seleccionadas para completar el trámite.
 *
 * @usageNotes
 * Este componente utiliza servicios de consulta (`Tramite80102Query`) para manejar y observar los datos 
 * relacionados con las plantas. Además, implementa el ciclo de vida de Angular para limpiar las suscripciones 
 * al destruirse.
 */
export class ContenedorComplementarPlantasComponent
  implements OnInit, OnDestroy
{
  /**
   * Evento para cerrar el modal desde el hijo.
   */
  @Output() cerrarPopup = new EventEmitter<void>();
    /**
     * Cierra el modal o componente de detalles de plantas.
     * Implementa aquí la lógica para ocultar el modal, navegar o actualizar el estado según tu flujo.
     */
    closeModal(): void {
      // Emite el evento para que el padre cierre el modal correctamente
      this.cerrarPopup.emit();
    }
  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de plantas seleccionadas.
   * @type {PlantasSubfabricante[]}
   */
  plantasSeleccionadas: PlantasSubfabricante[] = [];

/**
 * Evento emitido al regresar a la vista de plantas.
 * No emite ningún dato, solo notifica la acción.
 */
  @Output() alRegresarPlantas = new EventEmitter<void>();
  

  /**
   * Constructor de la clase ContenedorComplementarPlantasComponent.
   * @param {Tramite80102Query} query - Servicio para consultar el estado del trámite.
   * @param {Location} ubicaccion - Servicio de Angular para manejar la ubicación.
   */
  constructor(private query: Tramite80102Query, private ubicaccion: Location) {
    //El constructor requiere inyección de dependencias, pero se ha mantenido vacío debido a una regla de ESLint.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al observable de plantas por completar.
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.query.plantasPorCompletar$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((plantasPorCompletar) => {
        if (plantasPorCompletar.length > 0) {
          this.plantasSeleccionadas = plantasPorCompletar;
        }
      });
  }

/**
 * Regresa a la ubicación anterior en el historial del navegador.
 * @returns {void}
 */
  regresarPlantas(): void {
    this.alRegresarPlantas.emit();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
