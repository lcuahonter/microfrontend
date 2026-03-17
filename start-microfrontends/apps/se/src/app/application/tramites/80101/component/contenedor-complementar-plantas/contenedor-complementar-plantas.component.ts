import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DetallesPlantasComponent } from '../../../../shared/components/detalles-plantas/detalles-plantas.component';
import { Location } from '@angular/common';
import { PlantasSubfabricante } from '../../../../shared/models/empresas-subfabricanta.model';
import { Tramite80101Query } from '../../estados/tramite80101.query';

/**
 * Regresa a la ruta de la solicitud relativa al contexto actual.
 * 
 * Este método utiliza el servicio de enrutamiento de Angular (`Router`) para redirigir al usuario
 * a la página de solicitud. La navegación se realiza de manera relativa a la ruta activa actual,
 * lo que permite mantener el contexto de navegación dentro de la estructura de rutas del módulo.
 * 
 * @remarks
 * Este método es útil para manejar la navegación en aplicaciones con rutas jerárquicas,
 * asegurando que el usuario pueda regresar a una página específica dentro del flujo de trabajo.
 * 
 * @example
 * ```typescript
 * regressarPlantas();
 * ```
 * Esto redirigirá al usuario a la ruta `../solicitud` relativa a la ruta activa actual.
 * 
 * @method regressarPlantas
 */
@Component({
  selector: 'app-contenedor-complementar-plantas',
  standalone: true,
  imports: [CommonModule, DetallesPlantasComponent],
  templateUrl: './contenedor-complementar-plantas.component.html',
  styleUrl: './contenedor-complementar-plantas.component.scss',
})
export class ContenedorComplementarPlantasComponent implements OnInit, OnDestroy {
  /**
 * Notificador utilizado para manejar la destrucción o desuscripción de observables.
 * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
 *
 * @property {Subject<void>} destroyNotifier$
 */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
    * Evento emitido al regresar de la vista de plantas.
    * @property {EventEmitter<void>} graduar
    */
  @Output() guadarEvent = new EventEmitter();

  /**
   * Arreglo que almacena las plantas seleccionadas del subfabricante.
   * 
   * @type {PlantasSubfabricante[]}
   * @remarks
   * Este arreglo se utiliza para gestionar las plantas seleccionadas en el componente
   * y puede ser modificado dinámicamente según las interacciones del usuario.
   */
  plantasSeleccionadas: PlantasSubfabricante[] = []

  /**
   * Constructor de la clase ContenedorComplementarPlantasComponent.
   * 
   * @param query - Servicio de consulta específico para Tramite80101.
   * @param router - Servicio de enrutamiento para la navegación entre rutas.
   * @param activatedRoute - Servicio para acceder a información sobre la ruta activa.
   */

/**
 * Evento emitido al regresar a la vista de plantas.
 * No emite ningún dato, solo notifica la acción.
 */
  @Output() alRegresarPlantas = new EventEmitter<void>();

  /**
   * Constructor de la clase ComplementarPlantaComponent.
   * @param {Location} ubicaccion - Servicio de Angular para manejar la ubicación del navegador.
   */

  constructor(private query: Tramite80101Query,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ubicaccion: Location,
  ) { 
    // Constructor del componente
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * Este método suscribe al observable `plantasPorCompletar$` para obtener una lista
   * de plantas pendientes de completar. Si la lista contiene elementos, se asigna
   * a la propiedad `plantasSeleccionadas`. La suscripción se gestiona utilizando
   * el operador `takeUntil` para garantizar que se cancele cuando el componente
   * se destruya, evitando posibles fugas de memoria.
   */
  ngOnInit(): void {
    this.query.plantasPorCompletar$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((plantasPorCompletar) => {
        if (plantasPorCompletar.length > 0) {
          this.plantasSeleccionadas =
            plantasPorCompletar;
        }
      });
  }

  /**
   * Navega a la ruta de la solicitud relativa al contexto actual.
   * Utiliza el enrutador para redirigir al usuario a la página de solicitud.
   */
  regressarPlantas(): void {
    this.alRegresarPlantas.emit();
  }

  /**
   * Vuelve a la ubicación anterior en el historial del navegador.
   * @returns {void}
   */
  regrasar(): void {
    this.ubicaccion.back();
  }

  /**
   * Emits the `guadarEvent` to trigger a save action.
   *
   * @remarks
   * This method should be called when the user initiates a save operation
   * for the component's data.
   *
   * @fires guadarEvent
   */
  setGuardar(): void {
    this.guadarEvent.emit();
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
  onCerrarPopup(): void {
  this.alRegresarPlantas.emit();
  }
}
