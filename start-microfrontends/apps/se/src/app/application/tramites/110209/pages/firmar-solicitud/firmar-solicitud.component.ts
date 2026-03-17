
/*
* Se utiliza para paso2
*/
import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { TramiteStore } from '../../../../estados/tramite.store';
/**
 * Componente que representa la página para firmar la solicitud.
 */
@Component({
  selector: 'app-firmar-solicitud',
  templateUrl: './firmar-solicitud.component.html'
})
/**
 * Componente que representa la página para firmar la solicitud.
 */
export class FirmarSolicitudComponent implements OnDestroy{
/**
  * Notificador para destruir observables al destruir el componente.
  * Se utiliza para gestionar la cancelación de suscripciones activas y evitar fugas de memoria.
  */
private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

/**
 * Constructor de la clase que inicializa las dependencias necesarias.
 * 
 * @param router - Servicio de enrutamiento para navegación entre rutas.
 * @param serviciosExtraordinariosServices - Servicio para manejar trámites extraordinarios.
 * @param tramiteStore - Almacén (store) para gestionar el estado de los trámites.
 */
  constructor(private router: Router,
  private serviciosExtraordinariosServices: TramiteFolioService,
  private tramiteStore: TramiteStore
  ) {
    // Constructor
  }
/**
 * Obtiene la firma proporcionada y, si es válida, redirige a la página de acuse.
 * 
 * @param ev - Cadena de texto que representa la firma obtenida.
 */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.serviciosExtraordinariosServices
      .obtenerTramite(19)
      .pipe(takeUntil(this.destroyed$),
      map((tramite) => {
        this.tramiteStore.establecerTramite(tramite.data, FIRMA);
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
   * Método de limpieza que se ejecuta cuando el componente se destruye.
   */
   ngOnDestroy(): void {
   this.destroyed$.next(true);
   this.destroyed$.complete();
  }
}
