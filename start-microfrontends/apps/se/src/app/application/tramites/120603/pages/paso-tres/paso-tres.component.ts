import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { TramiteStore } from '@ng-mf/data-access-user';

/**
 * Componente que representa el paso tres del trámite.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent implements OnDestroy {
  /**
   * Observable para gestionar la destrucción de suscripciones.
   */
  private destroyed$ = new ReplaySubject<void>(1);

  /**
   * Tipo de persona.
   */
  tipoPersona!: number;

  /**
   * @constructor
   * Inyecta el servicio de catálogos para obtener información dinámica relacionada a documentos.
   *
   * @param {Router} router - Servicio de enrutamiento.
   * @param {TramiteFolioService} serviciosExtraordinariosServices - Servicio para obtener información del trámite.
   * @param {TramiteStore} tramiteStore - Almacén para gestionar el estado del trámite.
   */
  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: TramiteFolioService,
    private tramiteStore: TramiteStore
  ) {}

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
        .pipe(
          map((tramite) => {
            this.tramiteStore.establecerTramite(tramite.data, FIRMA);
            this.router.navigate(['pago/consulta/acuse']);
          }),
          catchError((_error) => {
            console.error('Error al obtener el trámite:', _error);
            return [];
          }),
          takeUntil(this.destroyed$) 
        )
        .subscribe();
    }
  }

  /**
   * Método de limpieza que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}