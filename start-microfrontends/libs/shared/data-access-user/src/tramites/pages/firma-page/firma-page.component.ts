import { Component, OnDestroy } from '@angular/core';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { FirmaElectronicaComponent } from '../../components/firma-electronica/firma-electronica.component';
import { Router } from '@angular/router';
import { TramiteFolioService } from '../../../core/services/shared/tramite-folio/tramite-folio.service';

@Component({
  selector: 'lib-firma-page',
  templateUrl: './firma-page.component.html',
  styleUrl: './firma-page.component.scss',
  standalone: true,
  imports: [FirmaElectronicaComponent]
})
export class FirmaPageComponent implements OnDestroy {
  ruta!: string;

  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private TramiteFolioServices: TramiteFolioService,
  ) { 
    // Lógica de inicialización si es necesario
  }

  /**
  * Maneja el evento para obtener la firma y realiza acciones adicionales.
  * @param ev - La cadena de texto que representa la firma obtenida.
  */
  obtieneFirma(ev: string): void {
    const RUTA_ACTUAL = this.router.url;
    this.ruta = RUTA_ACTUAL.split('/')[1];

    const FIRMA: string = ev;
    if (FIRMA) {
      // Obtiene el número de trámite
      this.TramiteFolioServices
        .obtenerTramite(19)
        .pipe(
          takeUntil(this.destroy$),
          map(() => {

            this.router.navigate([`${this.ruta}/acuse`]);
          }),
          catchError((_error) => {
            return _error;
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
