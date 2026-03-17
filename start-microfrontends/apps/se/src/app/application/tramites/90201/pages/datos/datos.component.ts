import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DomiciliosDePlantasComponent } from '../../components/domicilios-de-plantas/domicilios-de-plantas.component';
import { ExpansionDeProductoresService } from '@libs/shared/data-access-user/src/core/services/90201/expansion-de-productores.service';
import { ProductorIndirectoComponent } from '../../components/productor-indirecto/productor-indirecto.component';
import { SectoresYMercanciasComponent } from '../../components/sectores-y-mercancias/sectores-y-mercancias.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { Tramite90201Store } from '../../../../estados/tramites/tramite90201.store';


/**
 * Este componente se utiliza para mostrar el subtítulo del asistente - 90201
 * Establecer el índice del subtítulo
 */ 

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit, OnDestroy {  
  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public indice: number = 1;

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

  
  /**
   * @property {Array<{index: number, title: string, component: string}>} seccionesDeLaSolicitud
   * @description
   * Arreglo que define las secciones del formulario en el paso uno, incluyendo el índice, título y nombre del componente asociado.
   */
  seccionesDeLaSolicitud = [
    { index: 1, title: 'Solicitante', component: 'solicitante' },
    { index: 2, title: 'Domicilios de plantas', component: 'domicilios-de-plantas' },
    { index: 3, title: 'Sectores y mercancías', component: 'sectores-y-mercancias' },
    { index: 4, title: 'Productor indirecto', component: 'productor-indirecto' },
  ];


  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
     * @property {SolicitanteComponent} solicitante
     * @description Referencia al componente de la sección "Solicitante" del formulario.
     */
    @ViewChild('solicitanteRef') solicitante!: SolicitanteComponent;
  
   /**
     * @property {SectoresYMercanciasComponent} sectoresYMercancias
     * @description Referencia al componente de la sección "Sectores y mercancías" del formulario.
     */
    @ViewChild('sectoresRef') sectoresYMercancias!: SectoresYMercanciasComponent;
  
    /**
     * @property {ProductorIndirectoComponent} productorIndirecto
     * @description Referencia al componente de la sección "Productor indirecto" del formulario.
     */
    @ViewChild('productorIndirectoRef') productorIndirecto!: ProductorIndirectoComponent;
     
    

/**
 * Constructor de la clase DatosComponent.
 * 
 * @param consultaQuery Servicio para realizar consultas relacionadas con el trámite.
 * @param consultaStore Almacén para gestionar el estado de las consultas de trámite.
 * @param productoresService Servicio para la expansión y gestión de productores.
 * @param tramiteStore Almacén específico para el manejo del estado del trámite 90201.
 * 
 * Al inicializar el componente, se establece la consulta inicial en el store de consultas
 * con los parámetros correspondientes al trámite 90201.
 */
constructor(
  private consultaQuery: ConsultaioQuery,
  private productoresService: ExpansionDeProductoresService,private tramiteStore:Tramite90201Store) {
  }

   /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
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
      })).subscribe();
    if(this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
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
    this.productoresService
      .getRegistroExpansionDeProductoresData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.tramiteStore.setActividadProductiva(resp?.actividadProductiva);
        this.tramiteStore.setRepresentacionFederal(resp?.representacionFederal);
        this.tramiteStore.setRfc(resp?.rfc);
        this.tramiteStore.setFraccion(resp?.fraccion);
        this.tramiteStore.setSector(resp?.sector);
        }
      });
  }

  
  /**
   * @method validarFormularios
   * @description
   * Valida todos los formularios de las secciones del paso uno.
   * Marca los controles como tocados si son inválidos para mostrar los errores.
   * Retorna `true` si todos los formularios son válidos, `false` en caso contrario.
   *
   * @returns {boolean} `true` si todos los formularios son válidos, `false` si alguno es inválido.
   */
  public validarFormularios(): boolean {
    let isValid = true;

    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.sectoresYMercancias) {
      if (!this.sectoresYMercancias.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.productorIndirecto) {
      if (!this.productorIndirecto.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
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
