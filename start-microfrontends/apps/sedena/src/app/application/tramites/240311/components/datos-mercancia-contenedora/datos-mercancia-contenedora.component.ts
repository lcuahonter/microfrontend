import { Component, EventEmitter, Output } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { Tramite240311Store } from '../../estados/tramite240311Store.store';
import { NUMERO_TRAMITE } from '../../../../shared/constants/datos-solicitud.enum';

/**
 * Componente contenedor encargado de recibir los datos de mercancía y actualizar el estado global del trámite.
 * Actúa como puente entre el componente de datos de mercancía y el store de Akita.
 */
@Component({
  selector: 'app-datos-mercancia-contenedora',
  standalone: true,
  imports: [CommonModule, DatosMercanciaComponent],
  templateUrl: './datos-mercancia-contenedora.component.html',
  styleUrl: './datos-mercancia-contenedora.component.scss',
})
export class DatosMercanciaContenedoraComponent {
  /**
   * Evento que se emite para cerrar el componente contenedor.
   * Se utiliza para notificar al componente padre que se debe cerrar la ventana/modal de datos de mercancía.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Observable utilizado para limpiar suscripciones activas al destruir el componente.
   * Previene fugas de memoria.
   */
  private unsubscribe$ = new Subject<void>();

  /**
     * Observable que expone los datos de una mercancía seleccionada.
     * Emite un objeto `MercanciaDetalle` o `null` cuando no hay información disponible.
     */
  MercanciaDatos$!: Observable<MercanciaDetalle | null>;

  /**
   * Identificador único del procedimiento asociado al trámite.
   * 
   * @property {number} idProcedimiento
   * @remarks Este valor se utiliza para identificar el trámite específico.
   */
  idProcedimiento = NUMERO_TRAMITE.TRAMITE_240311;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es true, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * Inyecta el store para actualizar el estado de la tabla de mercancías y el query para obtener el estado de solo lectura.
   * Se suscribe al estado de consulta para actualizar la propiedad de solo lectura.
   * tramiteStore: instancia del store para manipular el estado de mercancías.
   * consultaioQuery: servicio para consultar el estado de solo lectura.
   */
  constructor(private tramiteStore: Tramite240311Store, private consultaioQuery: ConsultaioQuery) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Actualiza los datos de la tabla de mercancía en el store.
   * Recibe una lista de mercancías y la envía al store para su actualización.
   * event: lista de mercancías actualizada.
   */
  updateMercanciaDetalle(event: MercanciaDetalle[]): void {
    this.tramiteStore.updateMercanciaTablaDatos(event);
    this.cerrar.emit();
  }
}