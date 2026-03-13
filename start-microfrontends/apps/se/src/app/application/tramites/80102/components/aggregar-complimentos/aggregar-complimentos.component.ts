import { Component, Input, OnDestroy } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  DatosComplimentos,
  SociaoAccionistas,
} from '../../../../shared/models/complimentos.model';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplimentosComponent } from '../../../../shared/components/complimentos/complimentos.component';
import { Tramite80102Query } from '../../estados/tramite80102.query';
import { Tramite80102Store } from '../../estados/tramite80102.store';

@Component({
  selector: 'app-aggregar-complimentos',
  standalone: true,
  imports: [CommonModule, ComplimentosComponent],
  templateUrl: './aggregar-complimentos.component.html',
  styleUrl: './aggregar-complimentos.component.scss',
})

/**
 * @component
 * @name AggregarComplimentosComponent
 * @description
 * Componente encargado de gestionar los datos y operaciones relacionadas con los complementos 
 * en el trámite 80102. Este componente permite agregar, modificar y eliminar accionistas 
 * nacionales y extranjeros, así como validar el formulario de complementos.
 * 
 * @usageNotes
 * Este componente utiliza servicios de estado y consultas (`Tramite80102Store` y `Tramite80102Query`) 
 * para manejar y observar los datos de los complementos. Además, implementa el ciclo de vida de Angular 
 * para limpiar las suscripciones al destruirse.
 * */
export class AggregarComplimentosComponent implements OnDestroy {
  /**
   * @property {ConsultaioState} consultaState - Estado actual relacionado con la consulta.
   */
  @Input() consultaState!: ConsultaioState;
  /**
     * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.Add commentMore actions
     */
    @Input() formularioDeshabilitado: boolean = false;
    
  /**
   * Datos de los complementos.
   * @type {DatosComplimentos}
   */
  datosComplimentos!: DatosComplimentos;

  /**
   * Notificador para destruir las suscripciones.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Observable para los datos de la tabla de complementos.
   * @type {Observable<SociaoAccionistas[]>}
   */
  tablaDatosComplimentos$: Observable<SociaoAccionistas[]>;

  /**
   * Observable para los datos de la tabla de complementos extranjeros.
   * @type {Observable<SociaoAccionistas[]>}
   */
  tablaDatosComplimentosExtranjera$: Observable<SociaoAccionistas[]>;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false; 

  /**
   * Constructor de la clase AggregarComplimentosComponent.
   * @param {Tramite80102Store} store - Servicio para manejar el estado del trámite.
   * @param {Tramite80102Query} tramiteQuery - Servicio para consultar el estado del trámite.
   */
  constructor(
    private store: Tramite80102Store,
    private tramiteQuery: Tramite80102Query, private consultaQuery: ConsultaioQuery) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe()
    this.tablaDatosComplimentos$ =
      this.tramiteQuery.selectTablaDatosComplimentos$;
    this.tablaDatosComplimentosExtranjera$ =
      this.tramiteQuery.selectTablaDatosComplimentosExtranjera$;
  
    this.tramiteQuery.selectDatosComplimento$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.datosComplimentos = datos;
      });
  }

  /**
   * Modifica los datos de los complementos.
   * @param {DatosComplimentos} complimentos - Datos de los complementos.
   * @returns {void}
   */
  modifierComplimentos(complimentos: DatosComplimentos): void {
    this.store.setDatosComplimentos(complimentos);
     // Capturar los datos como FormControl data y almacenarlos separadamente
    // Esto permite acceso a los datos crudos del formulario
    const formControlData = this.extractFormControlData(complimentos);
    this.store.setFormControlData(formControlData);
  }
  
  /**
   * Extrae los datos del FormControl de los datos de complementos.
   *                        v0
   * @param complimentos - Objeto de tipo `DatosComplimentos`
   * @returns Objeto con los datos del FormControl
   */
  private extractFormControlData(complimentos: DatosComplimentos): { [key: string]: any } {
    return {
      // Datos generales
      modalidad: complimentos.modalidad,
      programaPreOperativo: complimentos.programaPreOperativo,
      
      // Datos generales - sección
      paginaWWeb: complimentos.datosGeneralis?.paginaWWeb || '',
      localizacion: complimentos.datosGeneralis?.localizacion || '',
      
      // Obligaciones fiscales
      opinionPositiva: complimentos.obligacionesFiscales?.opinionPositiva || '',
      fechaExpedicion: complimentos.obligacionesFiscales?.fechaExpedicion || '',
      aceptarObligacionFiscal: complimentos.obligacionesFiscales?.aceptarObligacionFiscal || '',
      
      // Modificaciones
      nombreDelFederatario: complimentos.formaModificaciones?.nombreDelFederatario || '',
      nombreDeNotaria: complimentos.formaModificaciones?.nombreDeNotaria || '',
      estado: complimentos.formaModificaciones?.estado || '',
      nombreDeActa: complimentos.formaModificaciones?.nombreDeActa || '',
      fechaDeActa: complimentos.formaModificaciones?.fechaDeActa || '',
      rfc: complimentos.formaModificaciones?.rfc || '',
      nombreDeRepresentante: complimentos.formaModificaciones?.nombreDeRepresentante || '',
      
      // Certificación
      certificada: complimentos.formaCertificacion?.certificada || '',
      fechaInicio: complimentos.formaCertificacion?.fechaInicio || '',
      fechaVigencia: complimentos.formaCertificacion?.fechaVigencia || '',
      
      // Socios accionistas
      nationalidadMaxicana: complimentos.formaSocioAccionistas?.nationalidadMaxicana || '',
      tipoDePersona: complimentos.formaSocioAccionistas?.tipoDePersona || '',
      formaDatos: complimentos.formaSocioAccionistas?.formaDatos || {},
    };
  }

  /**
   * Almacena los datos del FormControl en el store sin modificar el componente compartido.
   * Este método puede ser usado para capturar datos del formulario de complimentos.
   * 
   * @param formData - Objeto que contiene los datos del FormControl
   */
  storeFormControlData(formData: { [key: string]: any }): void {
    this.store.setFormControlData(formData);
  }

  /**
   * Agrega un nuevo accionista a la tabla de complementos.
   * @param {SociaoAccionistas} datos - Datos del accionista.
   * @returns {void}
   */
  accionistasAgregados(datos: SociaoAccionistas): void {
    if (datos.rfc) {
      this.store.aggregarTablaDatosComplimentos(datos);
    } else {
      this.store.aggregarTablaDatosComplimentosExtranjera(datos);
    }
  }

  /**
   * Elimina los accionistas seleccionados de la tabla de complementos.
   * @param {SociaoAccionistas[]} datos - Lista de accionistas a eliminar.
   * @returns {void}
   */
  accionistasEliminados(datos: SociaoAccionistas[]): void {
    this.store.eliminarTablaDatosComplimentos(datos);
  }

  /**
   * Elimina los accionistas extranjeros seleccionados de la tabla de complementos.
   * @param {SociaoAccionistas[]} datos - Lista de accionistas extranjeros a eliminar.
   * @returns {void}
   */
  accionistasExtranjerosEliminado(datos: SociaoAccionistas[]): void {
    this.store.eliminarTablaDatosComplimentosExtranjera(datos);
  }

  /**
   * Establece si el formulario de complementos es válido.
   * @param {boolean} valida - Indica si el formulario es válido.
   * @returns {void}
   */
  setFormValida(valida: boolean): void {
    this.store.setFormValida({ complimentos: valida });
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