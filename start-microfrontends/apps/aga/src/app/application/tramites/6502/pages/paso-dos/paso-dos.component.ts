import { Component, OnDestroy } from '@angular/core';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteStore } from '@libs/shared/data-access-user/src/core/estados/tramite.store';

/**
 * Componente para gestionar el paso tres del trámite.
 * Este componente maneja la obtención de la firma del usuario y la redirección a la pantalla de acuse.
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
})
export class PasoDosComponent implements OnDestroy{
  /**
 * Sujeto utilizado para manejar la destrucción de observables.
 * Este objeto se utiliza para evitar pérdidas de memoria al cancelar suscripciones activas.
 * 
 * @public
 */
  public destroyed$ = new Subject<void>();

  /**
   * Constructor del componente.
   *
   * @param {Router} router Servicio de enrutamiento para la navegación.
   * @param {ServiciosPantallaService} serviciosExtraordinariosServices Servicio para manejar trámites extraordinarios.
   * @param {TramiteStore} TramiteStore Store para gestionar el estado del trámite.
   */
  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: ServiciosPantallaService,
    private TramiteStore: TramiteStore
  ) {
    //Añade lógica aquí
  }

  /**
   * Maneja el evento para obtener la firma del usuario.
   * Si la firma es válida, obtiene el trámite correspondiente
   * y redirige a la pantalla de acuse.
   *
   * @param {string} ev La cadena de texto que representa la firma obtenida.
   * @returns {void}
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;

    if (FIRMA) {
      // Obtiene el número de trámite y establece el trámite en el store
      this.serviciosExtraordinariosServices
        .obtenerTramite(19)
        .pipe(
          map((tramite) => {
            this.TramiteStore.establecerTramite(tramite.data, FIRMA);
            // Redirige a la pantalla de acuse
            this.router.navigate(['servicios-extraordinarios/acuse']);
          }),
          catchError((_error) => {
            return _error;
          }),
          takeUntil(this.destroyed$) 
        )
        .subscribe();
    }
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable `destroyed$` para cancelar las suscripciones activas.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
