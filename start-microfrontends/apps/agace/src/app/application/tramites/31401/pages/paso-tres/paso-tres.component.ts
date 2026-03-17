
import { Component, Inject, OnDestroy } from '@angular/core';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { TramiteFolioService, TramiteStore } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

/**
  * @Component
  * @selector paso-tres
  * @description
  * Componente `PasoTresComponent` que representa el tercer paso del flujo de pantallas del trámite.
  * 
  * Detalles:
  * - Utiliza el decorador `@Component` para definir las propiedades del componente.
  * - Renderiza la plantilla HTML asociada para mostrar el contenido del tercer paso del trámite.
  * 
  * Propiedades:
  * - `selector`: Define el nombre del selector del componente como `paso-tres`.
  * - `templateUrl`: Ruta al archivo de plantilla HTML del componente.
  * 
  * @example
  * <paso-tres></paso-tres>
  */
@Component({
  selector: 'paso-tres',
  templateUrl: './paso-tres.component.html',
})

export class PasoTresComponent implements OnDestroy{
 /**
  * @property tipoPersona
  * @description
  * Propiedad que almacena el tipo de persona.
  * 
  * Detalles:
  * - Se utiliza para identificar el tipo de persona en el flujo del trámite.
  * - Puede ser asignado dinámicamente mediante el método `obtenerTipoPersona`.
  * 
  * @type {number}
  * 
  * @example
  * this.tipoPersona = 1; // Asigna el tipo de persona como 1.
  */
  public tipoPersona!: number;

  /**
  * @property destroy$
  * @description
  * Sujeto utilizado para gestionar la destrucción de suscripciones en el componente `PasoTresComponent`.
  * 
  * Detalles:
  * - Se utiliza junto con el operador `takeUntil` para cancelar suscripciones activas cuando el componente se destruye.
  * - Ayuda a prevenir fugas de memoria al asegurarse de que las suscripciones se completen correctamente.
  * 
  * @type {Subject<void>}
  * 
  * @example
  * this.destroy$.next();
  * this.destroy$.complete();
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
  * @method ngOnDestroy
  * @description
  * Método que se ejecuta cuando el componente `PasoTresComponent` se destruye.
  * 
  * Detalles:
  * - Emite un valor a través del sujeto `destroy$` para cancelar todas las suscripciones activas.
  * - Completa el sujeto `destroy$` para liberar recursos y evitar fugas de memoria.
  * 
  * @example
  * this.ngOnDestroy();
  * // Cancela las suscripciones activas y completa el sujeto `destroy$`.
  */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
