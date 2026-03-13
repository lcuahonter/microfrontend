/**
 * @fileoverview
 * El `PasoTresComponent` es un componente de Angular diseñado para gestionar la funcionalidad del tercer paso en el flujo del trámite.
 * Este paso incluye la firma electrónica del usuario y la redirección a la pantalla de acuse.
 * 
 * @module PasoTresComponent
 * @description
 * Este componente actúa como el tercer paso dentro del flujo del trámite 260218, donde se realiza la firma electrónica
 * y se gestiona la navegación hacia la pantalla de acuse.
 */
import { Component, OnDestroy } from '@angular/core';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { TramiteCofeprisStore } from '../../../../estados/tramite.store';

/**
 * @component
 * @name PasoTresComponent
 * @description
 * Componente que representa el tercer paso del flujo del trámite 260218. 
 * Este paso incluye la funcionalidad para realizar la firma electrónica del usuario y redirigir a la pantalla de acuse.
 *
 * @selector app-paso-tres
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./paso-tres.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./paso-tres.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - FirmaElectronicaComponent: Componente compartido para gestionar la funcionalidad de la firma electrónica.
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent implements OnDestroy {
  /**
   * @property {Subject<void>} destroyed$
   * @description
   * Sujeto utilizado para manejar la destrucción de observables y evitar fugas de memoria.
   * @private
   */
  private destroyed$ = new Subject<void>();

  /**
   * @constructor
   * @description
   * Constructor que inyecta los servicios necesarios para manejar la firma electrónica y la navegación.
   * 
   * @param {Router} router - Servicio de enrutamiento para la navegación.
   * @param {ServiciosPantallaService} serviciosExtraordinariosServices - Servicio para manejar trámites extraordinarios.
   * @param {TramiteCofeprisStore} TramiteCofeprisStore - Store para gestionar el estado del trámite.
   */
  constructor(
    private router: Router,
    private serviciosExtraordinariosServices: ServiciosPantallaService,
    private TramiteCofeprisStore: TramiteCofeprisStore
  ) {}

  /**
   * @method obtieneFirma
   * @description
   * Maneja el evento para obtener la firma del usuario. Si la firma es válida, obtiene el trámite correspondiente
   * y redirige a la pantalla de acuse.
   * 
   * @param {string} ev - La cadena de texto que representa la firma obtenida.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * this.obtieneFirma('firma-electronica');
   * ```
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
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable `destroyed$` para cancelar las suscripciones activas y evitar fugas de memoria.
   * 
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * this.ngOnDestroy();
   * ```
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}