import { Component, Input } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplimentosComponent } from '../../../../shared/components/complimentos/complimentos.component';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { DatosComplimentos } from '../../../../shared/models/complimentos.model';
import { SociaoAccionistas } from '../../../../shared/models/complimentos.model';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';

@Component({
  selector: 'app-aggregar-complimentos',
  standalone: true,
  imports: [CommonModule, ComplimentosComponent],
  templateUrl: './aggregar-complimentos.component.html',
  styleUrl: './aggregar-complimentos.component.scss',
})
export class AggregarComplimentosComponent {
  /** Objeto que contiene los datos de los cumplimientos. */
  datosComplimentos!: DatosComplimentos;
  /** Notificador para destruir suscripciones y evitar fugas de memoria. */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Observable que emite la tabla de datos de cumplimientos nacionales. */
  tablaDatosComplimentos$: Observable<SociaoAccionistas[]>;
  /** Observable que emite la tabla de datos de cumplimientos extranjeros. */
  tablaDatosComplimentosExtranjera$: Observable<SociaoAccionistas[]>;

  
  /**
   * @property {ConsultaioState} consultaState - Estado actual relacionado con la consulta.
   */
  @Input() consultaState!: ConsultaioState;

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
  accionistasAgregados(datos: SociaoAccionistas | null | undefined): void {
    if (!datos) {
      return;
    }
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
  
}
