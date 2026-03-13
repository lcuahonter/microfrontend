import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequerimientoDetalleResponse } from '../../../../core/models/shared/requerimiento-detalle-response.model';
import { Subject } from 'rxjs';


@Component({
  selector: 'lib-consulta-detalle-requerimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consulta-detalle-requerimiento.component.html',
  styleUrl: './consulta-detalle-requerimiento.component.scss',
})
export class ConsultaDetalleRequerimientoComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Formulario reactivo para requerimiento.
   * @type {FormGroup}
  */
  public detalleForm!: FormGroup;

  /**
    * Recibe los datos del requerimiento desde el componente padre 
  */
  @Input() requerimientoDetalle!: RequerimientoDetalleResponse;

  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
  */
  public unsubscribe$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = true;

  /**
    * Constructor para la consulta de requerimientos.
    * @param fb FormBuilder para crear formularios reactivos.
  */
  constructor(
    private fb: FormBuilder
  ) {
     /** 
     * Formulario reactivo para detalle.
     */
    this.detalleForm = this.fb.group({
      estatus: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      dictaminadoPor: ['', Validators.required],
      fechaGeneracion: ['', Validators.required],
      verificadoPor: ['', Validators.required],
      fechaverificación: ['', Validators.required],
      autorizadoPor: ['', Validators.required],
      fechaAutorizacion: ['', Validators.required],
      fechaAtencion: ['', Validators.required],
      justificacionRequerimiento: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.inicializarEstadoFormulario(); 
  }

   /**
   * Ciclo de vida: ngOnChanges
   * Reacciona a cambios en las propiedades de entrada del componente.
   * @param changes Objeto que contiene los cambios en las propiedades (@Input)
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['requerimientoDetalle'] && changes['requerimientoDetalle'].currentValue) {
        this.getDetalleRequerimiento();
      }
  }

  /**
   * Método para obtener la información de la solicitud para detalle de requerimiento.
   * @returns {void}
   */
  getDetalleRequerimiento(): void {
    /** 
     * Verifica si hay datos y actualiza el formulario.
     */
    if (this.requerimientoDetalle !== null) {
      const SOLICITUDDATA = this.requerimientoDetalle;

      this.detalleForm.patchValue({
        estatus: SOLICITUDDATA.estado_requerimiento,
        fechaCreacion: SOLICITUDDATA.fecha_creacion,
        dictaminadoPor: SOLICITUDDATA.dictaminador,
        fechaGeneracion: SOLICITUDDATA.fecha_emision,
        verificadoPor: SOLICITUDDATA.verificador,
        fechaverificación: SOLICITUDDATA.fecha_verificacion,
        autorizadoPor: SOLICITUDDATA.autorizador,
        fechaAutorizacion: SOLICITUDDATA.fecha_autorizacion,
        fechaAtencion: SOLICITUDDATA.fecha_atencion,
        justificacionRequerimiento: SOLICITUDDATA.justificacion,
      });
      
    } 
  }


  /**
   * Evalúa si se debe inicializar o cargar datos.
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.detalleForm.disable();
    } 
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
  */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
