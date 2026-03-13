import { Component, Inject, OnDestroy } from '@angular/core';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { TramiteStore } from '../../../../estados/tramite.store';

@Component({
  standalone: true,
  imports: [FirmaElectronicaComponent],
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.css',
})
export class PasoTresComponent implements OnDestroy {
  /**
   * Tipo de persona.
   */
  tipoPersona!: number;
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Constructor que se utiliza para la inyección de dependencias.
   * @param router Servicio de enrutamiento.
   * @param serviciosExtraordinariosServices Servicio de servicios extraordinarios.
   * @param tramiteStore Almacén de trámites.
   */
  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: TramiteFolioService,
    @Inject(TramiteStore) private tramiteStore: TramiteStore
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
   * @param ev La cadena de texto que representa la firma obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
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
   * @override
   * @method
   * @description
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Se utiliza para completar y limpiar el Subject `destroy$`, evitando fugas de memoria
   * al desuscribirse de observables.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
