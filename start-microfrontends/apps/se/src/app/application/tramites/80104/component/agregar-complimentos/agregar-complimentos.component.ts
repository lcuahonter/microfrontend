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
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplimentosComponent } from '../../../../shared/components/complimentos/complimentos.component';
import { ConsultaioState } from '@ng-mf/data-access-user';
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
  selector: 'app-agregar-complimentos',
  standalone: true,
  imports: [CommonModule, ComplimentosComponent],
  templateUrl: './agregar-complimentos.component.html',
  styleUrl: './agregar-complimentos.component.scss',
})
export class AgregarComplimentosComponent implements OnDestroy {
  
  /**
   * @property {ConsultaioState} consultaState - Estado actual relacionado con la consulta.
   */
  @Input() consultaState!: ConsultaioState;
  /**
   * Almacena los datos de los cumplimentos.
   * 
   * @type {DatosComplimentos}
   * @memberof AgregarComplimentosComponent
   */
  datosComplimentos!: DatosComplimentos;
  /**
   * Notificador para destruir el componente y liberar recursos.
   * 
   * @type {Subject<void>}
   * @memberof AgregarComplimentosComponent
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
  /*
  * Constructor del componente.
  * 
  * @param {Tramite80101Store} store - Almacén de estado para gestionar los datos de los cumplimentos.
  * @param {Tramite80101Query} tramiteQuery - Consulta para obtener los datos de los cumplimentos.
  */

constructor(
    private store: Tramite80101Store,
    private tramiteQuery: Tramite80101Query,
  ) {
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
   * 
   * @param complimentos - Objeto de tipo `DatosComplimentos` que contiene los datos de los cumplimientos a actualizar.
   * @returns void
   */
  modifierComplimentos(complimentos: DatosComplimentos): void {
    this.store.setDatosComplimentos(complimentos);
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
      this.store.agregarTablaDatosComplimentos(datos);
    } else {
      this.store.agregarTablaDatosComplimentosExtranjera(datos);
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
  ngOnDestroy(): void {
  this.destroyNotifier$.next();
  this.destroyNotifier$.complete();
}

}
