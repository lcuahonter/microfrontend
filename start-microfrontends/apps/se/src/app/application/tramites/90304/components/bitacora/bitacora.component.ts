import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { Bitacora, BitacoraResquesta } from '../../../../shared/models/bitacora.model';
import { BitacoraTablaComponent } from '../../../../shared/components/bitacora/bitacora.component';
import { ProsecService } from '../../services/prosec/prosec.service';

/**
 * Componente para mostrar la bitácora de un trámite.
 * @component BitacoraComponent
 */
@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [
    BitacoraTablaComponent
  ],
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.scss'
})
export class BitacoraComponent implements OnInit, OnDestroy {
  /**
   * Lista de bitácoras obtenidas del servicio
   * @type {Bitacora[]}
   */
  bitacoraDatos: Bitacora[] = [];

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param {ProsecService} prosecService - Servicio para obtener los datos de la bitácora.
   */
  constructor(
    private prosecService: ProsecService
  ) {
    // constructor vacío
  }

  /**
   * Se ejecuta al inicializar el componente.
   * Llama al método `obtenerBitacoraDatos` para obtener los datos de la bitácora.
   * @returns {void}
   */
  ngOnInit(): void {
    this.obtenerBitacoraDatos();
  }

  /**
   * Obtiene los datos de la bitácora desde el servicio `ProsecService`.
   * Se suscribe al observable y almacena los datos en `bitacoraDatos`.
   * @returns {void}
   */
  obtenerBitacoraDatos(): void {
    this.prosecService.obtenerBitacoraDatos()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe((bitacora: BitacoraResquesta) => {
        this.bitacoraDatos = bitacora.data.length > 0 ? bitacora.data : [];
      });
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}