import { Component, Inject, OnDestroy } from '@angular/core';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { TramiteFolioService, TramiteStore } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent implements OnDestroy{
  /**
   * Tipo de persona.
   */
  tipoPersona!: number;

  /**
   * @private
   * Un `Subject` utilizado para gestionar la destrucción de suscripciones en el componente.
   * Se emite un valor cuando el componente se destruye, lo que permite cancelar suscripciones
   * y evitar fugas de memoria.
   */
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
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Emite un valor en el observable `destroy$` para notificar a los suscriptores que deben limpiar recursos
   * y luego completa el observable para liberar memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
