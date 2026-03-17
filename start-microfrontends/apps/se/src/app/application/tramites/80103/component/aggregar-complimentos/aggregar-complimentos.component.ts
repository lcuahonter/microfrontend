/**
 * compo doc
 * @component
 * @selector app-aggregar-complimentos
 * @description
 * Este componente es responsable de gestionar la sección de agregación de cumplimientos
 * en el trámite 80103. Permite visualizar, agregar, modificar y eliminar datos de cumplimientos
 * y de socios/accionistas, tanto nacionales como extranjeros, utilizando el estado centralizado
 * proporcionado por Tramite80101Store y Tramite80101Query.
 *
 * Funcionalidades principales:
 * - Visualiza los datos de cumplimientos y las tablas de socios/accionistas nacionales y extranjeros.
 * - Permite modificar los datos de cumplimientos y almacenarlos en el estado.
 * - Permite agregar y eliminar socios/accionistas en las tablas correspondientes según el tipo de RFC.
 * - Utiliza Observables para reaccionar a los cambios en el estado de los datos.
 *
 * Componentes importados:
 * - `ComplimentosComponent`: Componente para mostrar y gestionar los cumplimientos.
 *
 * @templateUrl ./aggregar-complimentos.component.html
 * @styleUrl ./aggregar-complimentos.component.scss
 */
import { Component, Input, OnDestroy } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {Observable,Subject,map,takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplimentosComponent } from '../../../../shared/components/complimentos/complimentos.component';
import { DatosComplimentos } from '../../../../shared/models/complimentos.model';
import { SociaoAccionistas } from '../../../../shared/models/complimentos.model';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';
/*
  * Componente para agregar cumplimentos en el trámite 80103.
  * 
  * Este componente permite gestionar los cumplimientos y los datos de los accionistas
  * en el trámite 80103. Utiliza el estado centralizado para almacenar y modificar la información.
  * 
  * @export
  * @class AggregarComplimentosComponent
  */
@Component({
  selector: 'app-aggregar-complimentos',
  standalone: true,
  imports: [CommonModule, ComplimentosComponent],
  templateUrl: './aggregar-complimentos.component.html',
  styleUrl: './aggregar-complimentos.component.scss',
})
/** Componente encargado de agregar datos de complementos en el formulario.  
 * Administra el estado y limpieza de recursos al destruirse. */
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
   * Almacena los datos de los cumplimentos.
   * 
   * @type {DatosComplimentos}
   * @memberof AggregarComplimentosComponent
   */
  datosComplimentos!: DatosComplimentos;
  /**
   * Notificador para destruir el componente y liberar recursos.
   * 
   * @type {Subject<void>}
   * @memberof AggregarComplimentosComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Observable que emite los datos de los cumplimentos.
   * 
   * @type {Observable<SociaoAccionistas[]>}
   * @memberof AggregarComplimentosComponent
   */
  tablaDatosComplimentos$: Observable<SociaoAccionistas[]>;
  /*
    * Observable que emite los datos de los cumplimentos extranjeros.
    * 
    * @type {Observable<SociaoAccionistas[]>}
    * @memberof AggregarComplimentosComponent
    */
  tablaDatosComplimentosExtranjera$: Observable<SociaoAccionistas[]>;
   /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
  esFormularioSoloLectura: boolean = false;
  /*
  * Constructor del componente.
  * 
  * @param {Tramite80101Store} store - Almacén de estado para gestionar los datos de los cumplimentos.
  * @param {Tramite80101Query} tramiteQuery - Consulta para obtener los datos de los cumplimentos.
  */
constructor(
    private store: Tramite80101Store,
    private tramiteQuery: Tramite80101Query,
 private consultaioQuery: ConsultaioQuery,  
  ) { 
       this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        
                  })
      )
      .subscribe();
    // Observables que exponen los datos de las tablas de complementos y complementos extranjeros.  
    // Se obtienen desde el store a través del query para su uso reactivo en la vista.
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
   * Modifica los datos de los cumplimientos y los almacena en el estado.
   * También captura los datos del FormControl sin modificar el componente compartido.
   * 
   * @param complimentos - Objeto de tipo `DatosComplimentos` que contiene los datos de los cumplimientos a actualizar.
   * @returns void
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
   * 
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
   * Agrega datos de accionistas a la tabla correspondiente según el tipo de RFC.
   * 
   * @param datos - Objeto de tipo `SociaoAccionistas` que contiene la información del accionista.
   *                Si el objeto incluye un RFC válido, se agrega a la tabla de datos nacionales.
   *                De lo contrario, se agrega a la tabla de datos extranjeros.
   */
  accionistasAgregados(datos: SociaoAccionistas): void {
    if (datos.rfc) {
      this.store.aggregarTablaDatosComplimentos(datos);
    } else {
      this.store.aggregarTablaDatosComplimentosExtranjera(datos);
    }
  }

  /**
   * Elimina los datos de los accionistas proporcionados de la tabla de complementos.
   *
   * @param datos - Una lista de objetos de tipo `SociaoAccionistas` que representan los accionistas a eliminar.
   * 
   * Este método utiliza el servicio `store` para realizar la eliminación de los datos
   * correspondientes en la tabla de complementos.
   */
  accionistasEliminados(datos: SociaoAccionistas[]): void {
    this.store.eliminarTablaDatosComplimentos(datos);
  }

  /**
   * Elimina los datos de los accionistas extranjeros de la tabla de complementos.
   * 
   * @param datos - Una lista de objetos de tipo `SociaoAccionistas` que representan
   * los accionistas extranjeros a eliminar.
   */
  accionistasExtranjerosEliminado(datos: SociaoAccionistas[]): void {
    this.store.eliminarTablaDatosComplimentosExtranjera(datos);
  }
   /**
   * Método que se ejecuta cuando el componente es destruido.
   * 
   * Libera los recursos y completa la notificación de destrucción del componente.
   */
  ngOnDestroy(): void {
  this.destroyNotifier$.next();
  this.destroyNotifier$.complete();
}

}
