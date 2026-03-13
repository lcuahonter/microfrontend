import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'lib-consulta-detalle-observacion-requerimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consulta-detalle-observacion-requerimiento.component.html',
  styleUrl: './consulta-detalle-observacion-requerimiento.component.scss',
})
export class ConsultaDetalleObservacionRequerimientoComponent implements OnInit, OnChanges,OnDestroy { 

  @Input() observacion!: string;
  /**
   * Formulario reactivo para la solicitud de observacion requerimiento.
   * @type {FormGroup}
  */
  public observacionForm!: FormGroup;

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
    * Constructor para la consulta de detalle observacion.
    * @param fb FormBuilder para crear formularios reactivos.
  */
  constructor(
    private fb: FormBuilder,
  ) {
    /** 
     * Formulario reactivo para detalle observacion.
     */
    this.observacionForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  /**
    * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
    * Configura los formularios reactivos,y inicia el formulario.
  */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    if (this.observacion) {
      this.observacionForm.patchValue({
        descripcion: this.observacion,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['observacion'] && changes['observacion'].currentValue) {
      this.observacionForm.patchValue({
        descripcion: this.observacion,
      });
    }
  }

  /**
   * Evalúa si se debe inicializar el formulario.
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.observacionForm.disable();
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
