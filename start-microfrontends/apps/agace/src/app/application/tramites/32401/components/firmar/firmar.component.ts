import { Component, OnDestroy } from '@angular/core';
import { FirmaElectronicaComponent, TramiteFolioService, TramiteStore } from '@libs/shared/data-access-user/src';
import { ReplaySubject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Componente responsable de gestionar la firma electrónica
 * y continuar el flujo del trámite una vez que se ha firmado.
 */
@Component({
  selector: 'app-firmar',
  standalone: true,
  imports: [FirmaElectronicaComponent],
  templateUrl: './firmar.component.html',
  styleUrl: './firmar.component.scss',
})
/**
 * Componente responsable de gestionar la firma electrónica
 * y continuar el flujo del trámite una vez que se ha firmado.
 */
export class FirmarComponent implements OnDestroy {
  /**
   * Propiedad que almacena el tipo de persona seleccionada.
   */
  tipoPersona!: number;

  /**
   * Subject utilizado para destruir las suscripciones activas
   * cuando el componente se elimina.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Constructor que inyecta los servicios necesarios para el componente.
   * @param router Servicio para la navegación entre rutas.
   * @param serviciosExtraordinariosServices Servicio para obtener información del trámite.
   * @param tramiteStore Almacén central para guardar el estado del trámite.
   */
  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: TramiteFolioService,
    private tramiteStore: TramiteStore
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que asigna el tipo de persona seleccionado.
   * @param tipo Número correspondiente al tipo de persona.
   */
  obtenerTipoPersona(tipo: number): void {
    this.tipoPersona = tipo;
  }

  /**
   * Método que se ejecuta al recibir la firma electrónica.
   * Obtiene el trámite correspondiente y almacena la información,
   * luego redirige al usuario a la pantalla de acuse.
   * @param ev Cadena que contiene la firma electrónica.
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
            this.router.navigate(['pago/registro-solicitud/acuse']);
          }),
          catchError((_error) => {
            // Manejo básico de errores (se puede mejorar).
            return _error;
          })
        )
        .subscribe();
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Se encarga de completar el observable para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
