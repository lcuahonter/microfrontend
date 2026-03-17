/**
 * Componente para la modificación de permisos de importación de tratamientos.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Renuncia } from '../../models/renuncia-de-permiso.model';
import { RenunciaDeDerechosComponent } from '../../components/renuncia-de-derechos/renuncia-de-derechos.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitanteData } from '../../models/renuncia-de-permiso.model';

import { Solicitud140218Service } from '../../service/solicitud140218.service';

/**
 * Clase que representa el componente de modificación de permisos de importación de tratamientos.
 */
@Component({
  selector: 'app-paso-uno-pages',
  templateUrl: './paso-uno-pages.component.html',
})
/**
 * Componente que representa la primera sección de un formulario de modificación de permisos de importación.
 * Este componente incluye varios subcomponentes para recopilar información del solicitante, datos de la solicitud,
 * terceros relacionados, pagos de derechos y trámites asociados.
 * 
 * @export
 * @class PasoUnoPagesComponent
 */
export class PasoUnoPagesComponent implements OnInit {
  /**
     * Referencia al componente `SolicitanteComponent` para acceder a sus métodos y propiedades.
     */
    @ViewChild(SolicitanteComponent, { static: false })
    solicitante!: SolicitanteComponent;

    /**
     * Referencia al componente `RenunciaDeDerechosComponent` para acceder a sus métodos y propiedades.
     */
    @ViewChild(RenunciaDeDerechosComponent)
    renunciaDeDerechosComponent!: RenunciaDeDerechosComponent;
    
    /**
     * Método para recopilar los valores de los formularios de todos los componentes hijos.
     * 
     * Este método organiza los datos en un objeto estructurado por secciones o pestañas.
     * 
     * @returns Un objeto que contiene los valores de los formularios de todas las secciones.
     */
   
    collectFormValues(): {
      solicitante?: SolicitanteData;
      renuncia?: Renuncia;
    } {
      const ALL_FORM_VALUES: {
        solicitante?: SolicitanteData;
        renuncia?: Renuncia;
      } = {
        solicitante: undefined,
        renuncia: undefined
      };
  
      // Tab 1: SolicitanteComponent
      if (this.solicitante?.form) {
        ALL_FORM_VALUES.solicitante = this.solicitante.form.value as SolicitanteData;
      }
  
      // Tab 2: RenunciaDeDerechosComponent
      if (this.renunciaDeDerechosComponent?.renunciaDerechosForm) {
        ALL_FORM_VALUES.renuncia = this.renunciaDeDerechosComponent.renunciaDerechosForm.value as Renuncia
      }
  
      return ALL_FORM_VALUES;
    }
  
    /**
     * Índice actual del subtítulo seleccionado en la interfaz.
     */
    indice: number = 1;
  
    /**
     * Método para actualizar el índice del subtítulo seleccionado.
     *
     * @param i - Índice de la pestaña seleccionada.
     */
    seleccionaTab(i: number): void {
      this.indice = i;
    }

       /**
   * Estado actual de la consulta para el componente.
   * 
   * @type {ConsultaioState}
   * @public
   */
  public consultaState!:ConsultaioState;

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
 * Constructor de la clase DatosComponent.
 * 
 * @param consultaQuery Servicio para realizar consultas relacionadas con el trámite.
 * @param productoresService Servicio para la expansión y gestión de productores.
 * @param tramiteStore Almacén específico para el manejo del estado del trámite 120204.
 * 
 * Al inicializar el componente, se establece la consulta inicial en el store de consultas
 * con los parámetros correspondientes al trámite 120204.
 */
  constructor(private consultaQuery: ConsultaioQuery,private solicitud140218Service:Solicitud140218Service) {
    // Inicializa el estado de la consulta
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
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          if(this.consultaState.update) {
            this.guardarDatosFormulario();
            } else {
            this.esDatosRespuesta = true;
            }

      })).subscribe();
    
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
    this.solicitud140218Service
      .getCertiRegistroDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solicitud140218Service.actualizarEstadoFormulario(resp);
        }
      });
  }
}
