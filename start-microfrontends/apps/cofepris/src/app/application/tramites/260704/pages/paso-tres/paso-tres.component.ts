import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject, catchError, map, takeUntil } from 'rxjs';
import { TramiteFolioService, TramiteStore } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';

/**
 * Componente que representa el paso tres del trámite.
 * Este paso incluye la obtención de la firma y la navegación al acuse de pago.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
  standalone: false,
})
export class PasoTresComponent implements OnDestroy {
  /**
   * ReplaySubject utilizado para gestionar la destrucción de observables.
   * Se emite un valor cuando el componente se destruye para cancelar las suscripciones activas.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Tipo de persona (e.g., física o moral).
   */
  tipoPersona!: number;

  /**
   * Constructor del componente.
   * @param router Servicio de enrutamiento para navegar entre páginas.
   * @param serviciosExtraordinariosServices Servicio para obtener información del trámite.
   * @param tramiteStore Almacén para gestionar el estado del trámite.
   */
  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: TramiteFolioService,
    private tramiteStore: TramiteStore
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Obtiene el tipo de persona y lo almacena en la propiedad `tipoPersona`.
   * @param tipo Tipo de persona (e.g., 1 para física, 2 para moral).
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
    this.serviciosExtraordinariosServices
      .obtenerTramite(19)
      .pipe(
        takeUntil(this.destroyed$),
        map((tramite) => {
          this.tramiteStore.establecerTramite(tramite.data, FIRMA);
          this.router.navigate(['/pago/catalogos/acuse']);
        }),
        catchError((error) => {
          console.error(error);
          return [];
        })
      )
      .subscribe();
  }
}

  /**
   * Método de limpieza que se ejecuta cuando el componente se destruye.
   * Cancela las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}