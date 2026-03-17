import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Solicitud30505State, Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';

/**
 * Componente encargado de gestionar el primer paso del trámite 30505.
 * 
 * Este componente permite controlar el avance entre pestañas, manejar la selección de checkboxes
 * y suscribirse al estado de la solicitud para mantener la información actualizada.
 * 
 * @remarks
 * Utiliza un store y un query para la gestión y consulta del estado de la solicitud 30505.
 * Implementa mecanismos para evitar fugas de memoria al destruir el componente.
 * 
 * @example
 * <app-paso-uno></app-paso-uno>
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})

export class PasoUnoComponent implements OnDestroy,OnInit{

  /**
   * Índice actual utilizado para controlar el paso o la etapa activa en el componente.
   * 
   * @default 1 - El valor inicial del índice es 1.
   */
 public indice: number = 1;

  /**
   * Notificador utilizado para destruir suscripciones y evitar fugas de memoria.
   * Se debe emitir un valor y completar este Subject cuando el componente se destruya.
   * 
   * @type {Subject<void>}
   */
   public destroyNotifier$: Subject<void> = new Subject();
   
  /**
   * Arreglo que almacena los identificadores de los checkboxes seleccionados por el usuario.
   * Cada elemento del arreglo representa el valor asociado a un checkbox marcado.
   */
  public selectedCheckboxes: string[] = []; 

  /**
   * Representa el estado actual de la solicitud 30505 en el componente.
   * 
   * @type {Solicitud30505State}
   * @private
   */
  private avisoState!: Solicitud30505State;
  
  /**
   * Referencia al componente hijo SolicitanteComponent.
   * Estado actual de la consulta para el componente.
   * 
   * Utiliza el decorador `@ViewChild` para obtener acceso al componente hijo
   * SolicitanteComponent, lo que permite interactuar con él desde este componente.
   * @type {ConsultaioState}
   * @private
   */
  private consultaState!: ConsultaioState;
 
   /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;


  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  public esFormularioSoloLectura: boolean = false;

 /**
   * Constructor de la clase DatosComponent.
   * 
   * @param consultaQuery Servicio para realizar consultas relacionadas con el trámite.
   * @param productoresService Servicio para la expansión y gestión de productores.
   * @param tramiteStore Almacén específico para el manejo del estado del trámite 120204.
   * 
   * Al inicializar el componente, se establece la consulta inicial en el store de consultas
   * con los parámetros correspondientes al trámite 120204.
   */
  constructor(private consultaQuery: ConsultaioQuery, private tercerosService:TercerosRelacionadosService,private tramiteQuery: Solicitud30505Query,private tramiteStore: Solicitud30505Store) {
    // Inicialización del componente, se pueden agregar más configuraciones si es necesario.
  }


  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe al observable `selectSolicitud$` para obtener el estado de la sección y actualizar `AvisoState`.
   * - Asigna los checkboxes seleccionados desde `AvisoState` a la propiedad `selectedCheckboxes`.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruya.
   *
   * @returns {void} No retorna ningún valor.
   */
   ngOnInit(): void {
     this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
      this.esFormularioSoloLectura = seccionState.readonly;
      if (this.consultaState.update) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
        this.initializerFormulario();
      }
    })).subscribe();

  }

   /**
   * Inicializa el formulario del componente.
   *
   * Este método suscribe al observable `selectSolicitud$` del servicio `tramiteQuery` para obtener el estado de la sección
   * y asignarlo a la propiedad `avisoState`. Utiliza el operador `takeUntil` para cancelar la suscripción cuando se emite
   * el notifier `destroyNotifier$`. Posteriormente, asigna los checkboxes seleccionados desde `avisoState` a la propiedad
   * `selectedCheckboxes`.
   *
   * @remarks
   * Es importante llamar a este método durante la inicialización del componente para asegurar que el estado del formulario
   * y los checkboxes seleccionados estén sincronizados con el estado actual de la solicitud.
   */
  initializerFormulario(): void {

    this.tramiteQuery.selectSolicitud$
            .pipe(
              takeUntil(this.destroyNotifier$),
              map((seccionState) => {
                this.avisoState = seccionState;
              })
            )
            .subscribe()

   this.selectedCheckboxes = this.avisoState?.selectedCheckbox;
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
    this.tercerosService
      .getAvisoDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.tramiteStore.setCheckboxDatos(resp.selectedCheckbox);
          this.initializerFormulario();
          this.tercerosService.setDatosFormulario(resp);
        }
      });
  }

  /**
   * Selecciona una pestaña específica.
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i:number): void {
    this.indice = i;
  }

  /**
   * Alterna la visibilidad de los datos seleccionados.
   * 
   * @param datos - Un arreglo de cadenas que representa los datos seleccionados por el usuario.
   */
  toggleDataVisibility(datos: string[]): void {
    this.selectedCheckboxes = datos;
  }

   /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Notifica a los suscriptores para limpiar recursos y completa el observable `destroyNotifier$`.
   * Es útil para evitar fugas de memoria al cancelar suscripciones activas.
   */
   ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
