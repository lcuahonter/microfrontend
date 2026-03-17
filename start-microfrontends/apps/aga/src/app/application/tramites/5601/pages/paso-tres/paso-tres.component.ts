import { Component, OnDestroy } from '@angular/core';
import { Subject,catchError, map} from 'rxjs';
import { TramiteFolioService, TramiteFolioStore } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';
/**
 * Componente que representa el paso tres del formulario o flujo de trabajo.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
})
export class PasoTresComponent implements OnDestroy {

  /**
 * Subject utilizado para destruir las suscripciones y evitar fugas de memoria.
 */
  private destruir$: Subject<void> = new Subject<void>();


  /**
 * Constructor del componente.
 * 
 * Se inyectan los servicios necesarios para la navegación, la gestión de folios y el manejo del estado del trámite.
 * 
 * @param router Servicio para la navegación entre rutas.
 * @param tramiteFolioServices Servicio encargado de la gestión de folios del trámite.
 * @param tramiteStore Almacén de estado para manejar el estado del trámite.
 */
  constructor(
    private router: Router,
    private tramiteFolioServices: TramiteFolioService,
    private tramiteStore: TramiteFolioStore) {

  }

  /**
  * Maneja el evento para obtener la firma y realiza acciones adicionales.
  * @param ev - La cadena de texto que representa la firma obtenida.
  */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      // Obtiene el número de trámite
      this.tramiteFolioServices
        .obtenerTramite(19)
        .pipe(
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
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }

}
