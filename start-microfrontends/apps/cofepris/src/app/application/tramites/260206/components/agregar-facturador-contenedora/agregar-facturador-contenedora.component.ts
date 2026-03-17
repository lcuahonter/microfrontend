import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite260206State, Tramite260206Store } from '../../estados/stores/tramite260206Store.store';
import { AgregarFacturadorComponent } from '../../../../shared/components/agregar-facturador/agregar-facturador.component';
import { CommonModule } from '@angular/common';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260206Query } from '../../estados/queries/tramite260206Query.query';

@Component({
  selector: 'app-agregar-facturador-contenedora',
  standalone: true,
  imports: [CommonModule,AgregarFacturadorComponent],
  templateUrl: './agregar-facturador-contenedora.component.html',
  styleUrl: './agregar-facturador-contenedora.component.scss',
})
export class AgregarFacturadorContenedoraComponent implements OnInit, OnDestroy {
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Observable utilizado para notificar la destrucción del componente y liberar recursos.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Tramite260206State} tramiteState
   * Estado completo del trámite, que contiene información como la tabla de mercancías.
   */
  public tramiteState!: Tramite260206State;

    /**
     * Constructor de la clase AgregarFacturadorContenedoraComponent.
     * 
     * @param tramiteStore - Proporciona acceso al estado y métodos del store relacionado con el trámite 260206.
     * @param tramite260206Query - Proporciona acceso a las consultas relacionadas con el trámite 260206.
     */
    constructor(
        public tramiteStore: Tramite260206Store,
        public tramite260206Query: Tramite260206Query){
    }

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Se suscribe al estado del trámite y guarda su valor localmente para uso posterior.
   */
  ngOnInit(): void {
    this.tramite260206Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
  }

    /**
     * Actualiza los datos de la tabla de facturadores en el almacén de trámites.
     * 
     * @param event - Una lista de objetos de tipo `Facturador` que contiene los datos actualizados de los facturadores.
     * 
     * @remarks
     * Este método se utiliza para sincronizar los datos de facturadores con el almacén de trámites.
     */
    updateFacturadorTablaDatos(event:Facturador[]): void {
        this.tramiteStore.updateFacturadorTablaDatos(event);
    }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se llama antes de destruir el componente.
   * Libera recursos y completa el observable `destroyNotifier$`.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
