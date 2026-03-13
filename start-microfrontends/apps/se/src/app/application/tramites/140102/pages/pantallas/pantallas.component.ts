import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { GuardarMappingAdapter } from '../../adapters/guardar-mapping.adapter';
import { ProgramaACancelarComponent } from '../../components/programaACancelar/programaACancelar.component';
import { ProgramaACancelarService } from '../../services/programACancelar.service';
import { Tramite140102Store } from '../../../../estados/tramites/tramite140102.store';

/**
 * Componente DatosComponent.
 * 
 * Este componente se encarga de gestionar la lógica relacionada con los datos
 * en la página correspondiente. Incluye funcionalidades para interactuar con
 * componentes hijos y manejar la selección de pestañas.
 */
@Component({
  selector: 'app-pantallas', // Selector del componente
  templateUrl: './pantallas.component.html' // Ruta del archivo HTML asociado al componente
})
export class PantallasComponent implements OnInit, OnDestroy {
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
   * @public
   */
  public consultaState!: ConsultaioState;

  /**
   * Referencia al componente hijo `SolicitanteComponent` dentro de la vista.
   * 
   * Esta propiedad permite acceder a los métodos y propiedades públicas del componente
   * `SolicitanteComponent` desde el componente padre, facilitando la interacción y manipulación
   * de su estado o comportamiento.
   * 
   * @see SolicitanteComponent
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

  /** Estado del formulario, indica si es válido o no. */
  public formFieldValidado: boolean = true;
  
  /**
   * Referencia al componente `programaACancelarComponent`.
   */
  @ViewChild('programaACancelarComponent', { static: false }) programaACancelarComponent: ProgramaACancelarComponent | undefined;

  @Input() idTipoTramite!: string;

  /**
   * Constructor de la clase.
   * 
   * @param consultaQuery Servicio para realizar consultas relacionadas.
   * @param programaService Servicio para manejar la lógica de programas a cancelar.
   */
  constructor(private consultaQuery: ConsultaioQuery, 
    private programaService: ProgramaACancelarService,
   public registroSolicitudService: RegistroSolicitudService,
  public tramiteStore: Tramite140102Store) {
  }

  /**
  * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
  * 
  * - Suscribe al observable `selectConsultaioState$` para obtener el estado de la consulta y actualizar la propiedad `consultaState`.
  * - Dependiendo del valor de `consultaState.update`, decide si guardar los datos del formulario o mostrar los datos de respuesta.
  * 
  * @returns {void}
  */
  ngOnInit(): void {

  //this.guardarDatosFormulario(202943585);
    this.consultaQuery.selectConsultaioState$
          .pipe(
            takeUntil(this.destroyNotifier$),
            map((seccionState) => {
              this.consultaState = seccionState;
              if (this.consultaState.update) {
                this.guardarDatosFormulario(Number(this.consultaState?.id_solicitud));
                this.tramiteStore.setIdSolicitud(Number(this.consultaState?.id_solicitud));
              } else {
                this.esDatosRespuesta = true;
              }
            })
          )
          .subscribe();
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
  guardarDatosFormulario(id_solicitud: number): void {
    //const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
      this.registroSolicitudService
        .parcheOpcionesPrellenadas(140102, id_solicitud)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((resp) => {
          if(resp && resp.datos){
            GuardarMappingAdapter.patchToStore(resp.datos, this.tramiteStore);
            this.esDatosRespuesta = true;
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
  }

  /**
   * Valida todos los formularios del paso uno.
   * 
   * Este método valida principalmente el formulario de solicitante que es el único
   * obligatorio. Los otros formularios solo se validan si están disponibles.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos, `false` en caso contrario.
   */
public validarFormularios(): boolean {
  let allFormsValid = true;
  if (this.programaACancelarComponent) {
    if(this.programaACancelarComponent?.isFormValido() === false) {
      this.formFieldValidado = false;
      return false;
    }
    this.formFieldValidado = true;
    if (this.programaACancelarComponent?.radioId === null || this.programaACancelarComponent?.radioId === undefined || this.programaACancelarComponent?.radioId === -1) {
      allFormsValid = true;
      this.formFieldValidado = false;
    }
  }
  return allFormsValid;
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
