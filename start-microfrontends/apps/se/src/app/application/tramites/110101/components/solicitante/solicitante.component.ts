/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { Solicitante110101Query } from '../../estados/queries/solicitante110101.query';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite110101Store } from '../../estados/tramites/solicitante110101.store';
import mockData from 'libs/shared/theme/assets/json/110101/solicitante-mockdata.json';

/**
 * Componente para gestionar el formulario del solicitante.
 */

@Component({
  selector: 'app-solicitante',
  templateUrl: './solicitante.component.html',
  styleUrl: './solicitante.component.scss',
  standalone: true,
  imports: [TituloComponent, ReactiveFormsModule]
})
export class SolicitanteComponent implements OnInit, OnDestroy {
  /**
   * Constructor para inyectar las dependencias necesarias.
   * @param fb - Servicio FormBuilder para crear formularios reactivos.
   */
  // eslint-disable-next-line no-empty-function
  constructor(private fb: FormBuilder,
    private tramite110101Store: Tramite110101Store,
    private tramite110101Query: Solicitante110101Query
    // eslint-disable-next-line no-empty-function
  ) { }

  /**
   * Grupo de formulario para el formulario de solicitud.
   */
  solicitudForm!: FormGroup;

  /**
 * Suscripción para rastrear los cambios en el formulario y manejar la limpieza de memoria.
 */
  formSubscription!: Subscription;

  /**
 * Sujeto para manejar la destrucción de suscripciones y evitar fugas de memoria.
 */
  private destroy$ = new Subject<void>();

  /**
  * Suscripción utilizada para restaurar los valores del formulario desde el estado de la tienda.
  */
  private restoreSubscription$!: Subscription;



  /**
  * Datos simulados que representan a un solicitante con varios atributos.
  * 
  * @property {string} rfc - El RFC (Registro Federal de Contribuyentes) del solicitante.
  * @property {string} denominacion - El nombre o denominación del negocio del solicitante.
  * @property {string} actividadEconomica - La actividad económica o sector empresarial del solicitante.
  * @property {string} correoElectronico - La dirección de correo electrónico del solicitante.
  */

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario `solicitudForm` con los campos necesarios.
   * @returns {void}
   */
  ngOnInit(): void {
    this.solicitudForm = this.fb.group({
      rfc: [''],
      denominacion: [''],
      actividadEconomica: [''],
      correoElectronico: ['']
    });
    this.restoreFormValues(); 
    this.formSubscription = this.solicitudForm.valueChanges.subscribe(() => {
      this.updateStore();
    });
    this.setFormValues()
  }

  /**
 * Establece los valores del formulario `solicitudForm` utilizando datos simulados.
 * 
 * Este método llena los siguientes campos en el formulario:
 * - rfc: El RFC (Registro Federal de Contribuyentes).
 * - denominacion: La denominación o razón social.
 * - actividadEconomica: La actividad económica.
 * - correoElectronico: La dirección de correo electrónico.
 * 
 * @remarks
 * Este método asume que `mockData` contiene los campos necesarios
 * y que `solicitudForm` está correctamente inicializado.
 */

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  setFormValues() {
    this.solicitudForm.get('rfc')?.setValue(mockData.rfc);
    this.solicitudForm.get('denominacion')?.setValue(mockData.denominacion);
    this.solicitudForm.get('actividadEconomica')?.setValue(mockData.actividadEconomica);
    this.solicitudForm.get('correoElectronico')?.setValue(mockData.correoElectronico);
  }

  /**
   * Restaura los valores del formulario desde el estado de la tienda.
   * Se suscribe al estado del solicitante y actualiza los valores del formulario si existen datos previos.
   * La suscripción se completa después de recibir el primer valor.
   */
  private restoreFormValues(): void {
    this.restoreSubscription$ = this.tramite110101Query.selectSolicitante$
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        take(1)
      )
      .subscribe((solicitante) => {
        if (solicitante) {
          this.solicitudForm.patchValue(solicitante, { emitEvent: false });
        }
      });
  }


  /**
   * Método que se ejecuta cuando el componente se destruye.
   * Se encarga de limpiar las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
    if (this.restoreSubscription$) {
      this.restoreSubscription$.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }


  /**
   * Método para actualizar el estado del store con los valores actuales del formulario.
   * Se extraen los valores del formulario y se actualizan en el store correspondiente.
   */
  private updateStore(): void {
    const FORMVALUES = this.solicitudForm.value;
    this.tramite110101Store.setRfc(FORMVALUES.rfc);
    this.tramite110101Store.setDenominacion(FORMVALUES.denominacion);
    this.tramite110101Store.setActividadEconomica(FORMVALUES.actividadEconomica);
    this.tramite110101Store.setCorreoElectronico(FORMVALUES.correoElectronico);
  }

}
