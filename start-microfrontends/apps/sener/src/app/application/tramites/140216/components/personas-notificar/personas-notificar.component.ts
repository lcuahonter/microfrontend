import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { PersonasNotificar, PersonasNotificarRespuesta } from '../../models/suspension-permiso.model';
import { TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { PERSONAS_NOTIFICAR_ENCABEZADO_DE_TABLA } from '../../constantes/suspension-permiso.enum';
import { SuspensionPermisoService } from '../../services/suspension-permiso/suspension-permiso.service';

/**
 * Componente para mostrar la lista de personas a notificar.
 */
@Component({
  selector: 'app-personas-notificar',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './personas-notificar.component.html',
  styleUrl: './personas-notificar.component.scss',
})
export class PersonasNotificarComponent implements OnDestroy {
  /**
   * Encabezado de la tabla de personas a notificar.
   * @type {string[]}
   */
  personasNotificarEncabezadoDeTabla = PERSONAS_NOTIFICAR_ENCABEZADO_DE_TABLA;

  /**
   * Datos de las personas a notificar.
   * @type {PersonasNotificar[]}
   */
  personasNotificarTabla: PersonasNotificar[] = [];

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param suspensionPermisoService - Servicio para gestionar permisos de suspensión.
   */
  constructor(
    private suspensionPermisoService: SuspensionPermisoService
  ) {
    this.obtenerPersonasNotificar();
  }

  /**
   * Método para obtener las personas a notificar.
   * Realiza una llamada al servicio de suspensión de permisos y asigna la respuesta a la variable personasNotificarTabla.
   * @returns {void}
   */
  obtenerPersonasNotificar(): void {
    this.suspensionPermisoService.obtenerPersonasNotificar()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe((respuesta: PersonasNotificarRespuesta) => {
        this.personasNotificarTabla = respuesta.data;
      });
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}