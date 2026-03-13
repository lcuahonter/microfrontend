import { Component, OnDestroy } from '@angular/core';
import { FirmaElectronicaComponent, TramiteFolioService } from '@ng-mf/data-access-user';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TramiteStore } from '../../../../estados/tramite.store';

/**
 * Componente que representa el paso dos del trámite.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss'],
  standalone: true,
  imports: [FirmaElectronicaComponent],
})
export class PasoDosComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Tipo de persona.
   * @type {number}
   */
  tipoPersona!: number;

  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: TramiteFolioService,
    private tramiteStore: TramiteStore
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Obtiene el tipo de persona.
   * @param tipo - Tipo de persona a asignar.
   */
  obtenerTipoPersona(tipo: number): void {
    this.tipoPersona = tipo;
  }

  /**
   * Maneja el evento para obtener la firma y realiza acciones adicionales.
   * @param ev - La cadena de texto que representa la firma obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      // Obtiene el número de trámite
      this.serviciosExtraordinariosServices
        .obtenerTramite(19)
        .pipe(
          map((tramite) => {
            this.tramiteStore.establecerTramite(tramite.data, FIRMA);
            this.router.navigate(['servicios-extraordinarios/acuse']);
          }),
          catchError((_error) => {
            return _error;
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  /**
   * Método de limpieza que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
