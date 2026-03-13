import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { Subject } from 'rxjs';
import { TramiteCofeprisStore } from '../../../../estados/tramite.store';
import { catchError } from 'rxjs';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';


/**
 * Decorador de componente de Angular que define la configuración del componente `PasoTresComponent`.
 * 
 * Este componente es parte de la aplicación y representa el tercer paso en el flujo de trámites.
 * 
 * @selector `app-paso-tres` - Selector utilizado para instanciar este componente en una plantilla HTML.
 * @standalone `true` - Indica que este componente es independiente y no requiere un módulo específico.
 * @imports `[CommonModule, FirmaElectronicaComponent]` - Módulos y componentes importados para proporcionar funcionalidades adicionales.
 * @templateUrl `./paso-tres.component.html` - Ruta del archivo HTML que define la estructura visual del componente.
 * @styleUrl `./paso-tres.component.css` - Ruta del archivo CSS que define los estilos del componente.
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.css',
})
export class PasoTresComponent implements OnDestroy {
  /**
   * property {Subject<void>} destroyed$
   * description Sujeto utilizado para manejar la destrucción de observables.
   * private
   */
  private destroyed$ = new Subject<void>();
  /**
   * Constructor del componente.
   *
   * @param router - Servicio de enrutamiento para la navegación.
   * @param serviciosExtraordinariosServices - Servicio para manejar trámites extraordinarios.
   * @param TramiteCofeprisStore - Store para gestionar el estado del trámite.
   */
  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: ServiciosPantallaService,
    private TramiteCofeprisStore: TramiteCofeprisStore
  ) {
    // Constructor
  }

  /**
   * Maneja el evento para obtener la firma del usuario.
   * Si la firma es válida, obtiene el trámite correspondiente
   * y redirige a la pantalla de acuse.
   *
   * @param ev - La cadena de texto que representa la firma obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;

    if (FIRMA) {
      // Obtiene el número de trámite y establece el trámite en el store
      this.serviciosExtraordinariosServices
        .obtenerTramite(19)
        .pipe(
          map((tramite) => {
            this.TramiteCofeprisStore.establecerTramite(tramite.data, FIRMA);
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
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
