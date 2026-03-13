import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { TramiteStore } from '@ng-mf/data-access-user';

/** Componente que representa el paso tres del trámite y gestiona la firma y navegación. */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent implements OnDestroy {
  /** Tipo de persona seleccionada. */
  tipoPersona!: number;
  /** Observable para manejar la destrucción del componente y cancelar suscripciones. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Constructor que inyecta el router, servicios y store. */
  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: TramiteFolioService,
    private tramiteStore: TramiteStore
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /** Asigna el tipo de persona seleccionado. */
  obtenerTipoPersona(tipo: number): void {
    this.tipoPersona = tipo;
  }

  /** Maneja el evento de firma, obtiene el trámite y navega al acuse si la firma existe. */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.serviciosExtraordinariosServices
        .obtenerTramite(19)
        .pipe(
          takeUntil(this.destroyed$),
          map((tramite) => {
            this.tramiteStore.establecerTramite(tramite.data, FIRMA);
            this.router.navigate(['pago/economico/acuse']);
          }),
          catchError((_error) => {
            return _error;
          })
        )
        .subscribe();
    }
  }

  /** Método que se ejecuta al destruir el componente y libera recursos de suscripciones. */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}