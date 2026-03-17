
/**
 * Angular core imports for the component.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { InputFecha, TituloComponent } from '@ng-mf/data-access-user';
import { DetallesDelTransporteService } from '../../services/detalls-de-transporte/detalles-del-transporte.service';
import { InputFechaComponent } from "@ng-mf/data-access-user";

import { FECHA_EXPEDICION, FECHA_VENCIMIENTO } from '../../constantes/certificado-sgp.enum';
import { Tramite110209State, Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { formatFechaDDMMYYYY } from '@libs/shared/data-access-user/src';

/**
 * Componente: DetallesDelTransporteComponent
 * 
 */
@Component({
  selector: 'app-detalles-del-transporte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, InputFechaComponent],
  templateUrl: './detalles-del-transporte.component.html',
  styleUrl: './detalles-del-transporte.component.scss',
})
export class DetallesDelTransporteComponent implements OnInit, OnDestroy {
  /**
   * Representa el formulario del componente.
   * Se espera que esta propiedad sea de tipo 'FormGroup'.
   *
   * @property {FormGroup} detallesDeltransportForm - El formulario del componente.
   */
  detallesDelTransporteForm!: FormGroup;
  /**
   * Fecha de expedición del certificado.
   * @type {InputFecha}
   */
  fechaDeVencimientoInput: InputFecha = FECHA_VENCIMIENTO;
  /**
   * Fecha de vencimiento del certificado.
   * @type {InputFecha}
    */
  fechaDeExpedicionInput: InputFecha = FECHA_EXPEDICION;
  /**
   * Subject que emite un evento cuando el componente es destruido,
   * permitiendo la desuscripción de observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

   /**
   * Indica si el formulario ha sido cargado correctamente con los datos del servicio.
   * Se utiliza para mostrar u ocultar elementos en la interfaz según el estado de carga.
   * @type {boolean}
   */
  formularioCargado: boolean = false;

  /**  
  * Contiene el estado actual de la solicitud del trámite 110209.  
  * Permite acceder y manipular los datos relacionados con el flujo del trámite.  
  */
  public solicitudState!: Tramite110209State;

  /**
   * Constructor del componente DetallesDelTransporteComponent.
   * 
   * @param {FormBuilder} fb - El servicio FormBuilder proporcionado por Angular.
   * @param {DetallesDelTransporteService} service - El servicio para obtener los detalles del transporte.
   */
  constructor(private fb: FormBuilder, private service: DetallesDelTransporteService,private tramite110209Query: Tramite110209Query, private tramite110209Store: Tramite110209Store) {
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Obtiene los detalles del transporte.
   */
  ngOnInit(): void {
    this.getMedioDeTransporte();
  }

 getMedioDeTransporte(): void {
    this.tramite110209Query.selectTramite110209$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((seccionState) => {
      this.solicitudState = seccionState as Tramite110209State;

          if (!this.detallesDelTransporteForm) {
            this.formularioCargado = true;
              this.detallesDelTransporteForm = this.fb.group({
                tratado: this.solicitudState.tratadoAcuerdo,
                paisOBloque: this.solicitudState.paisBloque,
                paisOOrigin: this.solicitudState.paisOrigen,
                paisODestino: this.solicitudState.paisBloque,
                fechaDeExpedicion: formatFechaDDMMYYYY(this.solicitudState.fechaExpedicion),
                fechaDeVencimiento: formatFechaDDMMYYYY(this.solicitudState.fechaVencimiento),
              });
              this.detallesDelTransporteForm.disable();
            } else {
              this.formularioCargado = true;
              this.detallesDelTransporteForm.patchValue({
                tratado: this.solicitudState.tratadoAcuerdo,
                paisOBloque: this.solicitudState.paisBloque,
                paisOOrigin: this.solicitudState.paisOrigen,
                paisODestino: this.solicitudState.paisBloque,
                fechaDeExpedicion: formatFechaDDMMYYYY(this.solicitudState.fechaExpedicion),
                fechaDeVencimiento: formatFechaDDMMYYYY(this.solicitudState.fechaVencimiento),
              });
              this.detallesDelTransporteForm.disable();
            }
    });
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