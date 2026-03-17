import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { TramiteStore } from '../../../../estados/tramite.store';
/**
 * Componente que representa el paso tres del trámite.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
  standalone: false,
})
export class PasoTresComponent implements OnDestroy {
 
   /**
    * Tipo de persona.
    */
   tipoPersona!: number;
 /**
  * Notificador para destruir observables al destruir el componente.
  * Se utiliza para gestionar la cancelación de suscripciones activas y evitar fugas de memoria.
  */
   private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
   
  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: TramiteFolioService,
    private tramiteStore: TramiteStore
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }
  /**
   * Obtiene el tipo de persona.
   * @param tipo Tipo de persona.
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
        .pipe(takeUntil(this.destroyed$),
          map((tramite) => {
            this.tramiteStore.establecerTramite(tramite.data, FIRMA);
            this.router.navigate(['pago/reportes/acuse']);
          }),
          catchError((_error) => {
            return _error;
          })
        )
        .subscribe();
    }
  }
   /**
   * Método de limpieza que se ejecuta cuando el componente se destruye.
   */
   ngOnDestroy(): void {
   this.destroyed$.next(true);
   this.destroyed$.complete();
  }

}
