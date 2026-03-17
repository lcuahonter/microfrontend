import { Component, OnDestroy } from '@angular/core';
import {
  FirmaElectronicaComponent,
  TramiteFolioService,
  TramiteFolioStore,
} from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription, catchError, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente que representa el paso tres del trámite.
 */
@Component({
  selector: 'paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrls: ['./paso-tres.component.scss'],
  standalone: true,
  imports: [
    FirmaElectronicaComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PasoTresComponent implements OnDestroy {
  /**
   * Suscripción para obtener el trámite.
   */
  obtienerTramiteSubscriber!: Subscription;
  /**
   * Tipo de persona.
   */
  tipoPersona!: number;

  /**
   * Constructor que se utiliza para la inyección de dependencias.
   * @param router Servicio de enrutamiento.
   * @param tramiteFolioService Servicio de servicios extraordinarios.
   * @param tramiteStore Almacén de trámites.
   */
  constructor(
    private router: Router,
    private tramiteFolioService: TramiteFolioService,
    private tramiteStore: TramiteFolioStore
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
      this.obtienerTramiteSubscriber = this.tramiteFolioService
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
   * Método de limpieza que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    if (this.obtienerTramiteSubscriber) {
      this.obtienerTramiteSubscriber.unsubscribe();
    }
  }
}
