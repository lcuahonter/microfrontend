import { catchError, map, takeUntil } from 'rxjs';

import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TramiteFolioService } from '@libs/shared/data-access-user/src/core/services/shared/tramite-folio/tramite-folio.service';

@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss'
})
export class PasoTresComponent implements OnDestroy {
  private destroyed$ = new Subject<void>(); // Sujeta a desuscripción de señal

  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: TramiteFolioService,
  ) {}

  /**
   * Maneja el evento de obtención de firma y realiza la navegación al acuse si la firma es válida.
   * @param ev - Cadena de texto que representa la firma obtenida desde el evento.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev; // Asignación de la firma desde el evento
    if (FIRMA) {
      // Llamada al servicio para obtener el número de trámite
      this.serviciosExtraordinariosServices
        .obtenerTramite(19) // ID de trámite
        .pipe(
          takeUntil(this.destroyed$), // Darse de baja automáticamente al destruir
          map(() => {
            // Navegación al acuse si el trámite es exitoso
            this.router.navigate(['servicios-extraordinarios/acuse']);
          }),
          catchError((_error) => {
            // Manejo de errores en caso de fallo
            return _error;
          })
        )
        .subscribe(); // Suscripción al observable para ejecutar la lógica
    }
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Emite un valor para completar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(); // Emit a value to complete all subscriptions
    this.destroyed$.complete(); // Complete the Subject
  }
}