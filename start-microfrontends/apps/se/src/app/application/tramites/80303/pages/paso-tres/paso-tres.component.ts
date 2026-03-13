import { Component, Inject, OnDestroy } from '@angular/core';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TramiteFolioService } from '@ng-mf/data-access-user';
import { TramiteStore } from '../../../../estados/tramite.store';

/**
 * Decorador de componente de Angular que define las propiedades esenciales del componente.
 * Este decorador se utiliza para configurar el selector, la plantilla y los estilos del componente.
 * 
 * @selector 'app-paso-tres' - Define el nombre del selector que se utiliza para instanciar este componente en una plantilla HTML.
 * @templateUrl './paso-tres.component.html' - Especifica la ruta del archivo HTML que contiene la estructura de la vista del componente.
 * @styleUrl './paso-tres.component.scss' - Indica la ruta del archivo SCSS que contiene los estilos específicos para este componente.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent implements OnDestroy {
  /**
   * Tipo de persona.
   */
  tipoPersona!: number;


  /**
   * Sujeto utilizado para manejar la destrucción de suscripciones en el componente.
   * Este observable se emite cuando el componente se destruye, permitiendo
   * cancelar suscripciones activas y prevenir fugas de memoria.
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
   * Aquí se utiliza para emitir un valor en el observable `destroy$` y completar el mismo,
   * asegurando la limpieza adecuada de suscripciones y evitando posibles fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
