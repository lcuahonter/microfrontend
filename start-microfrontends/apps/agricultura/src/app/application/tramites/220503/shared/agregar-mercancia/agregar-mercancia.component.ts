import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notificacion, NotificacionesComponent, Pedimento, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

import { MercanciaTabla } from '../../models/solicitud-pantallas.model';


/**
 * Componente para agregar mercancía.
 */
@Component({
  selector: 'app-agregar-mercancia',
  templateUrl: './agregar-mercancia.component.html',
  styleUrl: './agregar-mercancia.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TituloComponent,
    CommonModule,
    NotificacionesComponent,
  ],
})

/**
 * Componente que permite agregar mercancía a una solicitud.
 */
export class AgregarMercanciaComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Elemento a eliminar de la tabla de pedimentos.
   */
  elementoParaEliminar!: number;

  /**
   * Array con los datos de los pedimentos.
   * Se utiliza para almacenar los pedimentos ingresados por el usuario.
   */
  pedimentos: Array<Pedimento> = [];
  /**
   * Formulario para agregar mercancía.
   */
  agregarMercanciaForm!: FormGroup;

  /**
   * Datos de mercancías recibidos como entrada.
   */
  @Input() mercanciasDatos: MercanciaTabla[] = [] as MercanciaTabla[];

  /**
   * Evento emitido cuando se actualiza la mercancía.
   * @type {EventEmitter<MercanciaTabla>}
   */
  @Output() actualizarMercancia = new EventEmitter<MercanciaTabla>();

  /**
   * Evento emitido cuando se cancela la acción.
   */
  @Output() cancelarEvento = new EventEmitter<boolean>();

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios.
   */
  constructor(
    private fb: FormBuilder
  ) {
    this.crearFormulario();
  }

  /**
   * Método que se ejecuta cuando el componente se inicializa.
   * Aquí se debe inicializar el formulario con los datos de entrada.
   */
  ngOnInit(): void {
    if (this.mercanciasDatos && this.mercanciasDatos.length > 0) {
      this.setFormData();
    }
  }

  /**
   * Método para crear el formulario de agregar mercancía.
   */
  crearFormulario(): void {
    this.agregarMercanciaForm = this.fb.group({
      fraccionArancelaria: [
        {
          value: '',
          disabled: true,
        },
      ],
      descripcionFraccion: [
        {
          value: '',
          disabled: true,
        },
      ],
      nico: [{ value: '', disabled: true }],
      descripcion: [
        { value: '', disabled: true },
      ],
      unidaddeMedidaDeUMT: [
        {
          value: '',
          disabled: true,
        },
      ],
      cantidadTotalUMT: [
        { value: '', disabled: true },
      ],
      saldoPendiente: [
        { value: '', disabled: true },
      ],
      saldoACapturar: [
        '',
        [Validators.required, Validators.maxLength(16)],
      ],
    });
  }

  /**
   * Método para configurar los datos en el formulario con los valores de mercanciasDatos.
   */
  setFormData(): void {
    this.agregarMercanciaForm.patchValue({
      fraccionArancelaria: this.mercanciasDatos?.[0]?.fraccionArancelaria || this.mercanciasDatos?.[0]?.fraccion_arancelaria,
      descripcionFraccion: this.mercanciasDatos?.[0]?.descripcionFraccion || this.mercanciasDatos?.[0]?.descripcion_de_la_fraccion,
      nico: this.mercanciasDatos?.[0]?.nico,
      descripcion: this.mercanciasDatos?.[0]?.descripcion || this.mercanciasDatos?.[0]?.descripcion_nico,
      unidaddeMedidaDeUMT: this.mercanciasDatos?.[0]?.unidaddeMedidaDeUMT || this.mercanciasDatos?.[0]?.uni_medida_tar,
      saldoPendiente: this.mercanciasDatos?.[0]?.saldoPendiente || this.mercanciasDatos?.[0]?.saldo_pendiente,
      cantidadTotalUMT: this.mercanciasDatos?.[0]?.cantidadTotalUMT || this.mercanciasDatos?.[0]?.cant_total_umt,
      saldoACapturar: this.mercanciasDatos?.[0]?.saldoACapturar || this.mercanciasDatos?.[0]?.cant_soli_umt || '',
    });
  }

  /**
   * Método que se ejecuta cuando cambian las propiedades de entrada.
   * @param changes Cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const MERCANCIASDATOS = 'mercanciasDatos';
    if (changes[MERCANCIASDATOS] && this.mercanciasDatos) {
      this.setFormData();
    }
  }

  /**
   * Método para aceptar la acción de agregar mercancía.
   * Valida el formulario y emite el evento con los datos del formulario.
   * @returns {void}
   */
  aceptar(): void {
    const VALUE = this.agregarMercanciaForm.get('saldoACapturar')?.value;
    const CANDIDADTOTALUMT = this.mercanciasDatos[0].cantidadTotalUMT || 
                              this.mercanciasDatos[0].cant_total_umt || 0;
    
    if (Number(CANDIDADTOTALUMT) < Number(VALUE)) {
      const PEDIMENTO = {
        patente: 0,
        pedimento: 0,
        aduana: 0,
        idTipoPedimento: 0,
        descTipoPedimento: 'Por evaluar',
        numero: '',
        comprobanteValor: '',
        pedimentoValidado: false,
      };
      this.abrirModal(
        'La cantidad solicita es mayor al saldo pendiente. Favor de verificar.'
      );
      this.pedimentos.push(PEDIMENTO);
      return;
    }

    if (this.agregarMercanciaForm.invalid) {
      this.agregarMercanciaForm.markAllAsTouched();
      return;
    }
    const FORM_VALUE = this.agregarMercanciaForm.getRawValue();
    if (this.mercanciasDatos[0].id) {
      FORM_VALUE['id'] = this.mercanciasDatos[0].id;
      FORM_VALUE['saldoPendiente'] = parseFloat(
        (
          Number(CANDIDADTOTALUMT) - Number(VALUE)
        ).toFixed(2)
      );
      // Mapea el valor ingresado también a cant_soli_umt
      FORM_VALUE['cant_soli_umt'] = Number(VALUE);
    }
    this.actualizarMercancia.emit(FORM_VALUE);
    this.agregarMercanciaForm.reset();
  }

  /**
   * @description
   * Cierra el modal de mercancías y notifica al componente padre que no se ha seleccionado
   * ninguna mercancía, emitiendo `undefined` a través del evento `actualizarMercancia`.
   *
   * Este método suele invocarse al presionar el botón de **cerrar** o **cancelar**
   * dentro del modal, evitando que se pase una mercancía seleccionada.
   *
   * @returns {void}
   */
  cerrarModal(): void {
    this.actualizarMercancia.emit(undefined);
  }

  /**
   * Elimina un elemento de la lista de pedimentos en la posición especificada.
   *
   * @param {number} i - El índice del elemento a eliminar.
   *
   * @remarks
   * Después de eliminar el elemento, se actualiza el título y mensaje del modal,
   * y se abre el modal para mostrar un aviso al usuario.
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Elimina un elemento de la tabla de pedimento, si se confirma la acción.
   * @param borrar Indica si se debe proceder con la eliminación.
   * @returns {void}
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Desuscribe el componente de todos los observables.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

