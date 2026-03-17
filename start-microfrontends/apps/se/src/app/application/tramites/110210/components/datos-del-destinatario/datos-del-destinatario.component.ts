/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CertificadoOrigenResponse } from '../../models/certificados-disponsible.model';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite110210Query } from '../../estados/queries/tramite110210.query';
import { Tramite110210Store } from '../../estados/store/tramite110210.store';

/**
 * Componente para gestionar el formulario del solicitante.
 */

@Component({
  selector: 'app-datos-del-destinatario',
  templateUrl: './datos-del-destinatario.component.html',
  styleUrl: './datos-del-destinatario.component.scss',
  standalone: true,
  imports: [TituloComponent, ReactiveFormsModule]
})
export class DatosDelDestinatarioComponent implements OnInit, OnDestroy, OnChanges {
  /**
     * Datos del certificado de origen.
     * @type {CertificadoOrigenResponse | null}
     */
    @Input() certificadoDatos: CertificadoOrigenResponse | null = null;
  /**
   * Constructor para inyectar las dependencias necesarias.
   * @param fb - Servicio FormBuilder para crear formularios reactivos.
   */
  constructor(private fb: FormBuilder,
    private tramite110210Store: Tramite110210Store,
    private tramite110210Query: Tramite110210Query
  ) { 
    // Inicializa el formulario del solicitante.
  }

  /**
   * Grupo de formulario para el formulario de solicitud.
   */
  solicitudForm!: FormGroup;

  /**
 * Sujeto para manejar la destrucción de suscripciones y evitar fugas de memoria.
 */
  private destroy$ = new Subject<void>();

  /**
  * Suscripción utilizada para restaurar los valores del formulario desde el estado de la tienda.
  */
  private restoreSubscription$!: Subscription;




  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario `solicitudForm` con los campos necesarios.
   * @returns {void}
   */

  ngOnInit(): void {
    this.inicializarFormulario();
    this.restoreFormValues(); 
    this.updateStore();
    this.setFormValues()
  }

   /**
 * Método para inicializar el formulario `solicitudForm`.
 */
private inicializarFormulario(): void {
  this.solicitudForm = this.fb.group({
    nombres: [''],
    primerApellido: [''],
    segundoApellido: [''],
    numeroRegistroFiscal: [''],
    razonSocial: [''],
  });
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
    if (!this.solicitudForm) {
      return;
    }
    this.solicitudForm.get('nombres')?.setValue(this.certificadoDatos?.nombre);
    this.solicitudForm.get('primerApellido')?.setValue(this.certificadoDatos?.primerApellido);
    this.solicitudForm.get('segundoApellido')?.setValue(this.certificadoDatos?.segundoApellido);
    this.solicitudForm.get('numeroRegistroFiscal')?.setValue(this.certificadoDatos?.numeroRegistroFiscal);
    this.solicitudForm.get('razonSocial')?.setValue(this.certificadoDatos?.razonSocial);
  }

  /**
   * Restaura los valores del formulario desde el estado de la tienda.
   * Se suscribe al estado del solicitante y actualiza los valores del formulario si existen datos previos.
   * La suscripción se completa después de recibir el primer valor.
   */
  private restoreFormValues(): void {
    this.restoreSubscription$ = this.tramite110210Query.selectTramite110210$
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
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
    this.destroy$.next();
    this.destroy$.complete();
  }

    /**
   * Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * Actualiza los valores del formulario cuando `certificadoDatos` cambia.
   */
  ngOnChanges(): void {
    this.setFormValues();
  }


  /**
   * Método para actualizar el estado del store con los valores actuales del formulario.
   * Se extraen los valores del formulario y se actualizan en el store correspondiente.
   */
  private updateStore(): void {
    const FORMVALUES = this.solicitudForm.value;
    this.tramite110210Store.setNombres(FORMVALUES.nombres);
    this.tramite110210Store.setPrimerApellido(FORMVALUES.primerApellido);
    this.tramite110210Store.setSegundoApellido(FORMVALUES.segundoApellido);
    this.tramite110210Store.setNumeroRegistroFiscal(FORMVALUES.numeroRegistroFiscal);
    this.tramite110210Store.setRazonSocial(FORMVALUES.razonSocial);
  }

}
