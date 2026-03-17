import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject,catchError, map, takeUntil } from 'rxjs';
import { TramiteFolioService, TramiteStore} from '@ng-mf/data-access-user';
import { Router } from '@angular/router';

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
     * Observable para manejar la destrucción del componente.
     * Se utiliza para cancelar suscripciones activas.
     */
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
     /**
    * Tipo de persona.
    */
   tipoPersona!: number;
 /**
 * Constructor del componente PasoTresComponent.
 * 
 * @param router - Servicio de Angular Router utilizado para la navegación entre rutas.
 * @param serviciosExtraordinariosServices - Servicio para gestionar operaciones relacionadas con el trámite, como obtener información del trámite.
 * @param tramiteStore - Almacén de estado para gestionar y almacenar datos relacionados con el trámite.
 */
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
            this.router.navigate(['pago/registro-solicitud/acuse']);
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