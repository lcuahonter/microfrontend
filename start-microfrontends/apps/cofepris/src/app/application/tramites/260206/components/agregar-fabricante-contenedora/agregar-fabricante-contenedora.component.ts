import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil, } from 'rxjs';
import { Tramite260206State, Tramite260206Store } from '../../estados/stores/tramite260206Store.store';
import { AgregarFabricanteComponent } from '../../../../shared/components/agregar-fabricante/agregar-fabricante.component';
import { CommonModule } from '@angular/common';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260206Query } from '../../estados/queries/tramite260206Query.query';

@Component({
  selector: 'app-agregar-fabricante-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarFabricanteComponent],
  templateUrl: './agregar-fabricante-contenedora.component.html',
  styleUrl: './agregar-fabricante-contenedora.component.scss',
})
export class AgregarFabricanteContenedoraComponent implements OnInit, OnDestroy {
    /**
 * @property {Tramite260206State} tramiteState
 * Estado completo del trámite, que contiene información como la tabla de mercancías.
 */
    public tramiteState!: Tramite260206State;

    /**
 * @property {Subject<void>} destroyNotifier$
 * @description
 * Observable utilizado para notificar la destrucción del componente y liberar recursos.
 */
    private destroyNotifier$: Subject<void> = new Subject();

    /**
     * Constructor de la clase AgregarFabricanteContenedoraComponent.
     * 
     * @param tramiteStore - Proporciona acceso al estado y acciones relacionadas con el trámite 260206.
     * @param tramite260206Query - Proporciona métodos para consultar el estado del trámite 260206.
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
     * Actualiza los datos de la tabla de fabricantes en el estado del trámite.
     *
     * @param event - Una lista de objetos de tipo `Fabricante` que contiene los datos actualizados de los fabricantes.
     * 
     * @remarks
     * Este método se utiliza para sincronizar los datos de los fabricantes con el estado del trámite
     * a través del `tramiteStore`.
     */
    updateFabricanteTablaDatos(event:Fabricante[]): void {
        this.tramiteStore.updateFabricanteTablaDatos(event);
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
