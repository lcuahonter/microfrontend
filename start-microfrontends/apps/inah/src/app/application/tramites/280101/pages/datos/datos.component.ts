import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { PermisoDeExportacionService } from '../../services/permiso-de-exportacion.service';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente DatosComponent.
 * 
 * Este componente es responsable de manejar la lógica y la interacción de la vista
 * asociada al archivo `datos.component.html`. Permite la selección de pestañas y 
 * la interacción con el componente hijo `SolicitanteComponent`.
 */
@Component({
  selector: 'app-datos', // Selector del componente
  templateUrl: './datos.component.html', // Ruta del archivo HTML asociado al componente
  styleUrl:'./datos.component.scss',
})
export class DatosComponent implements OnInit, OnDestroy {
  /**
   * Índice del subtítulo actual.
   * 
   * Esta variable se utiliza para almacenar el índice de la pestaña seleccionada.
   * Por defecto, se inicializa con el valor 1.
   */
   public indice: number = 1;

    /**
   * Estado actual de la consulta para el componente.
   * 
   * @type {ConsultaioState}
   * @private
   */
  private consultaState!: ConsultaioState;
  /**
   * Referencia al componente hijo SolicitanteComponent.
   * 
   * Utiliza el decorador `@ViewChild` para obtener acceso al componente hijo
   * SolicitanteComponent, lo que permite interactuar con él desde este componente.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

   /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   * 
   * Este Subject emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones a observables y evitar fugas de memoria.
   * 
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Indica el estado actual de la pestaña seleccionada.
   * 
   * `true` representa que la pestaña está activa, mientras que `false` indica que no lo está.
   */
  private tabIndex: boolean = false;

  /**
   * Constructor del componente.
   * 
   * @param service - Servicio de PermisoDeExportacionService que se utiliza para
   * compartir datos y lógica entre diferentes componentes.
   */
  constructor(private consultaQuery: ConsultaioQuery, private permisoService: PermisoDeExportacionService) {}
   /**
  * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
  * 
  * - Suscribe al observable `selectConsultaioState$` para obtener el estado de la consulta y actualizar la propiedad `consultaState`.
  * - Dependiendo del valor de `consultaState.update`, decide si guardar los datos del formulario o mostrar los datos de respuesta.
  * 
  * @returns {void}
  */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
      this.esFormularioSoloLectura = seccionState.readonly;
      if (this.consultaState.update) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }

    })).subscribe();

    if (this.permisoService.indice) {
      this.seleccionaTab(this.permisoService.indice);
    }
  }

  /**
   * Guarda los datos del formulario obteniendo la información de los productores.
   * 
   * Este método realiza una solicitud al servicio `productoresService` para obtener
   * los datos de expansión de productores. Si la respuesta es válida, actualiza
   * el estado interno del componente y almacena los datos relevantes en el store
   * de trámites.
   * 
   * @remarks
   * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente
   * se destruye, evitando fugas de memoria.
   * 
   * @returns {void} No retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    this.permisoService
      .getPermisoExportacion().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.permisoService.setDatosFormulario(resp);
        }
      });
  }

  /**
   * Método para seleccionar una pestaña específica.
   * 
   * Este método actualiza el índice de la pestaña seleccionada, permitiendo
   * cambiar entre diferentes vistas o secciones de la interfaz.
   * 
   * @param i - Índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.permisoService.indice = i;
  }

  /**
   * Método para determinar si una pestaña está deshabilitada.
   * 
   * Este método verifica si una pestaña específica debe estar deshabilitada
   * según su índice.
   * 
   * @param tabIndex - Índice de la pestaña que se desea verificar.
   * @returns `true` si la pestaña está deshabilitada, `false` en caso contrario.
   */
  isTabDisabled(tabIndex: number): boolean {
    const INDEX = tabIndex;
    this.tabIndex = INDEX === 5 || INDEX === 6;
    return this.tabIndex;
  }

   /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
