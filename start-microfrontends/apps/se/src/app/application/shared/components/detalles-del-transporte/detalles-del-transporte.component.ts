import { CAMPO_DE_DETALLES, CAMPO_DE_TRANSPORTE } from '../../constantes/modificacion.enum';
import { Catalogo, CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DestinatarioService } from '../../services/destinatario.service';
import { Subject } from 'rxjs';

/**
 * @component DetallesDelTransporteComponent
 * Componente para gestionar los detalles del transporte en el formulario.
 */
@Component({
  selector: 'app-detalles-del-transporte',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, CatalogoSelectComponent],
  templateUrl: './detalles-del-transporte.component.html',
  styleUrl: './detalles-del-transporte.component.scss',
})
export class DetallesDelTransporteComponent implements OnInit, OnDestroy, OnChanges {

  /** Formulario reactivo para los datos de transporte */
  formTransporte!: FormGroup;
  /** Indica si el campo destinatario está activo */
  campoDestinatario = false;
  /** Indica si el campo detalles está activo */
  campoDetalles = false;
  /** Lista de medios de transporte disponibles */
  medioDeTransporte!: Catalogo[];
  /** Subject para manejar la destrucción del componente */
  destroyNotifier$: Subject<void> = new Subject();

  /** Identificador del procedimiento */
  @Input() idProcedimiento!: number;
  /** Datos del formulario recibidos como input */
  @Input() datosForm!: { [key: string]: unknown };
  /** Evento para seleccionar medio de transporte */
  @Output() medioDeTransporteSeleccionEvent: EventEmitter<Catalogo> = new EventEmitter<Catalogo>();
  /** Evento para cambios en el formulario de transporte */
  @Output() formTransporteEvent: EventEmitter<{ formGroupName: string; campo: string; valor: undefined; storeStateName: string }> = new EventEmitter<{ formGroupName: string; campo: string; valor: undefined; storeStateName: string }>();
  /** Evento para indicar si el formulario es válido */
  @Output() formaValida: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  /** Lista de medios de transporte recibida como input */
  @Input() medioTransporte!: Catalogo[];
  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   * @type {boolean}
   */
  @Input() esFormularioSoloLectura!: boolean;
  /** Constructor del componente */
  constructor(private fb: FormBuilder, public destinatarioService: DestinatarioService) { }

  /** Inicializa el componente y sus estados */
  ngOnInit(): void {
    this.campoDestinatario = CAMPO_DE_TRANSPORTE.includes(this.idProcedimiento);
    this.campoDetalles = CAMPO_DE_DETALLES.includes(this.idProcedimiento);
    if (!this.campoDetalles) {
      this.getMedioTransporte();
    }
    this.inicializarEstadoFormulario();
    this.createForm();
  }

  /** Emite el evento de selección de medio de transporte */
  medioDeTransporteSeleccion(estado: Catalogo): void {
    this.medioDeTransporteSeleccionEvent.emit(estado)
  }

  /**
 * Evalúa si se debe inicializar o cargar datos en el formulario.
 */
  inicializarEstadoFormulario(): void {
    if (!this.formTransporte) {
      this.createForm();
    }

    if (this.esFormularioSoloLectura) {
      this.formTransporte.disable();
    }
  }

  /** Obtiene la lista de medios de transporte desde el servicio */
  getMedioTransporte(): void {
    this.destinatarioService.getTransporte(this.idProcedimiento.toString()).subscribe((data) => {
      this.medioDeTransporte = data as Catalogo[];
       if (this.datosForm && this.formTransporte) {
        const MEDIO = this.datosForm?.['medioDeTransporte']; // string from API

        const SELECET_MEDIO = this.medioDeTransporte.find(
          item => item.clave?.trim().toLowerCase() === String(MEDIO)?.trim().toLowerCase()
        ) || null;

        this.formTransporte.patchValue({
          ...this.datosForm,
          medioDeTransporte: SELECET_MEDIO?.clave || ''
        });
      }
      
    });
  }

  /** Actualiza el formulario cuando cambian los datos de entrada */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosForm'] && this.datosForm) {
      if (this.formTransporte) {
        this.formTransporte.patchValue(this.datosForm);
      } else {
        this.createForm();
      }
    }
  }




  /** Establece valores en el store y emite eventos relacionados con el formulario */
  setValoresStore(formGroupName: string, campo: string, storeStateName: string): void {
    const VALOR = this.formTransporte.get(campo)?.value;
    this.formaValida.emit(this.formTransporte.valid);
    this.formTransporteEvent.emit({ formGroupName, campo, valor: VALOR, storeStateName });
  }

  /** Crea e inicializa el formulario reactivo de transporte */
  createForm(): void {
    this.formTransporte = this.fb.group({
      medioDeTransporte: [''],
      rutaCompleta: [''],
      puertoEmbarque: [''],
      puertoDesembarque: [''],
      puertoTransito: [''],
      nombreEmbarcacion: [''],
      numeroVuelo: [''],
    });
    if (this.datosForm) {
      this.formTransporte.patchValue(this.datosForm);
      queueMicrotask(() => {
        this.formTransporte.updateValueAndValidity({ emitEvent: false });
        this.formaValida.emit(this.formTransporte.valid);
      });
    }
  }

  /** Cancela suscripciones y limpia recursos al destruir el componente */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}