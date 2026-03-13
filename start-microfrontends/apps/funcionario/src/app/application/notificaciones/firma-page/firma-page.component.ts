import { Component, OnDestroy } from '@angular/core';
import { EncabezadoRequerimientoComponent, FirmaElectronicaComponent, TramiteFolioService } from '@libs/shared/data-access-user/src';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-firma-page',
  templateUrl: './firma-page.component.html',
  styleUrl: './firma-page.component.scss',
  standalone: true,
  imports: [FirmaElectronicaComponent, EncabezadoRequerimientoComponent]
})
export class FirmaPageComponent implements OnDestroy {
  ruta!: string;
  numFolioTramite: string = '02309482934723832';
  tipoTramite: string = 'Registro de solicitud de servicios extraordinarios';

  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private tramiteFolioService: TramiteFolioService,
  ) { }

  /**
  * Maneja el evento para obtener la firma y realiza acciones adicionales.
  * @param ev - La cadena de texto que representa la firma obtenida.
  */
  obtieneFirma(ev: string): void {
    const RUTA_ACTUAL = this.router.url;
    const SEGEMENTOS_RUTA = RUTA_ACTUAL.split('/');

    this.ruta = SEGEMENTOS_RUTA.slice(0, SEGEMENTOS_RUTA.length - 1).join('/');

    const FIRMA: string = ev;
    if (FIRMA) {
      // Obtiene el número de trámite
      this.tramiteFolioService
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
