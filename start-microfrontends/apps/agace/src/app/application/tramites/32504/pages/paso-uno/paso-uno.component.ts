import { AvisoComponent } from '../../components/aviso/aviso.component';
import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  SeccionLibStore,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite32504Store } from '../../estados/tramite32504.store';

/**
 * Componente PasoUnoComponent
 *
 * Este componente gestiona el primer paso del trámite 32504, permitiendo la visualización y actualización
 * de los datos del solicitante y el aviso correspondiente. Utiliza servicios y estados para manejar la lógica
 * de presentación y persistencia de datos.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  imports: [CommonModule, SolicitanteComponent, AvisoComponent],
  standalone: true,
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * Indica si los datos de respuesta están disponibles.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Notificador para destruir las suscripciones al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la consulta actual.
   */
  public consultaState!: ConsultaioState;

  @ViewChild('aviso', { static: false }) avisoComponent!: AvisoComponent;

  /**
   * Constructor del componente.
   * @param seccionStore Servicio para manejar el estado de la sección.
   * @param consultaQuery Consulta para obtener el estado de la consulta.
   * @param avisoService Servicio para manejar los datos del aviso.
   */
  constructor(
    private seccionStore: SeccionLibStore,
    private consultaQuery: ConsultaioQuery,
    private tramiteStore32504:Tramite32504Store,
  ) {}

  /**
   * Inicializa el componente y suscribe al estado de la consulta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      // this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  validarFormulario(): boolean {
    return this.avisoComponent?.validarFormulario();
  }

  validarTabla(): boolean {
    return this.avisoComponent?.validarTabla();
  }

  /**
   * Limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Selecciona la pestaña activa.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }


}
