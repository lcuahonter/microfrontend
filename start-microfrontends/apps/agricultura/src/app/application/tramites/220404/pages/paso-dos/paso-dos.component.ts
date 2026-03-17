import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { catchError, map } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosExtraordinariosService } from '../../services/servicios-extraordinarios.service';
import { TramiteStore } from '@libs/shared/data-access-user/src/core/estados/tramite.store';

@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss'
})
export class PasoDosComponent implements OnDestroy{
  /** Inyectamos los servicios necesarios*/
  constructor(
    private readonly router: Router,
    private readonly tramiteStore: TramiteStore,
    private readonly serviciosExtraordinariosService: ServiciosExtraordinariosService
  ) { 
      /** El constructor está intencionalmente vacío para la inyección de dependencias */ 
    }

  /**
  * Maneja el evento para obtener la firma y realiza acciones adicionales.
  * @param ev - La cadena de texto que representa la firma obtenida.
  */

  /**
  * **Subject para manejar la destrucción de suscripciones**
  *
  * - Se utiliza para cancelar las suscripciones activas cuando el componente o servicio es destruido.
  * - Evita fugas de memoria al asegurarse de que las suscripciones se cancelen correctamente.
  * - Se emite un valor en `ngOnDestroy` y luego se completa.
  *
  * @private
  */
  private destroy$ = new Subject<void>();

  /**
  * Método para manejar la obtención de la firma y realizar acciones posteriores.
  *
  * @param {string} ev - La firma proporcionada como un string.
  */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      // Obtiene el número de trámite
      this.serviciosExtraordinariosService
        .obtenerTramite(19)
        .pipe(
          takeUntil(this.destroy$),
          map((tramite) => {
            this.tramiteStore.establecerTramite(tramite.data, FIRMA);
            this.router.navigate(['servicios-extraordinarios/acuse']);
          }),
          catchError((_error) => {
            return _error;
          })
        )
        .subscribe();
    }
  }

  /**
  * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
  *
  * Este método emite un valor a través del observable `destroy$` para notificar a los suscriptores
  * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
  *
  * @returns {void} No retorna ningún valor.
  */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }  
}
