import { Component, Input, OnDestroy } from '@angular/core';
import { CertificadoOrigenResponse } from '../../models/certificados-disponsible.model';
import { Tramite110210Query } from '../../estados/queries/tramite110210.query';
import { map, Subject, takeUntil } from 'rxjs';

/**
 * @descripcion
 * El componente `CertificadoDeOrigenComponent` es responsable de renderizar la interfaz de usuario
 * y manejar la lógica para la página "Duplicado de Certificado" en la aplicación.
 *
 * @selector app-certificado-de-origen
 * @templateUrl ./certificado-de-origen.component.html
 */
@Component({
  selector: 'app-certificado-de-origen',
  templateUrl: './certificado-de-origen.component.html',
  standalone: false, // Indica que este componente no es independiente.
})
export class CertificadoDeOrigenComponent implements OnDestroy {
  /**
   * Datos del certificado de origen.
   * @type {CertificadoOrigenResponse | null}
   */
  @Input() certificadoDatos: CertificadoOrigenResponse | null = null;

  /**
   * Subject que emite un evento cuando el componente es destruido,
   * permitiendo la desuscripción de observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**   * Valor seleccionado en el dropdown.
   * @type {boolean}
   */
  selectedDropdownValue: boolean = false;

  /**   * Indica si el trámite tratado.
   * @type {string}
   */
  tratadoClave:string = '';

  /**
   * Constructor del componente.
   * @param {Tramite110210Query} tramite110210Query - Servicio para consultar el estado del trámite 110210.
   */
  constructor(private tramite110210Query: Tramite110210Query) {
    this.tramite110210Query.selectTramite110210$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.selectedDropdownValue = seccionState.selectedDropdownValue;
          this.tratadoClave = seccionState.tratadoAcuerdoClave;
        })
      )
      .subscribe();
  }

  
  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject destroyed$ para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}