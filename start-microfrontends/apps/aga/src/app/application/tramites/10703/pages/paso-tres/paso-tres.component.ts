import { Component, OnDestroy } from '@angular/core';
import {
  FirmaElectronicaComponent,
  TramiteFolioService,
  TramiteFolioStore,
} from '@ng-mf/data-access-user';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
})
export class PasoTresComponent implements OnDestroy {
  /**
   * Constructor del componente.
   *
   * @param router Servicio de enrutamiento.
   * @param tramiteFolioService Servicio para gestionar los servicios extraordinarios.
   * @param tramiteStore Almacén para gestionar el estado del trámite.
   */
  constructor(
    private router: Router,
    private tramiteFolioService: TramiteFolioService,
    private tramiteFolioStore: TramiteFolioStore
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Subject utilizado para destruir suscripciones y evitar fugas de memoria.
   */
  private destroy$: Subject<void> = new Subject<void>();
  
  /**
   * Maneja el evento para obtener la firma y realiza acciones adicionales.
   * @param ev - La cadena de texto que representa la firma obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.tramiteFolioService
        .obtenerTramite(19)
        .pipe(
          takeUntil(this.destroy$),
          map((tramite) => {
            this.tramiteFolioStore.establecerTramite(tramite.data, FIRMA);
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
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destroy$` para cancelar las suscripciones.
   */
     ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
