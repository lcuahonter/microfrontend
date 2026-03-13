import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notificacion, NotificacionesComponent, Pedimento, TituloComponent } from '@libs/shared/data-access-user/src';
import { Solicitud220502State, Solicitud220502Store } from '../../estados/tramites220502.store';
import { Subject, map,takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MercanciaTabla } from '../../models/medio-transporte.model';
import { Solicitud220502Query } from '../../estados/tramites220502.query';

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
   * Estado de la solicitud 220502.
   * Se inicializa como un objeto vacío con la estructura de Solicitud220502State.
   */
  solicitud220502State: Solicitud220502State = {} as Solicitud220502State;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios.
   */
  constructor(
    private fb: FormBuilder,
    public solicitud220502Store: Solicitud220502Store,
    public solicitud220502Query: Solicitud220502Query
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
          value: this.solicitud220502State.fraccionArancelaria,
          disabled: true,
        },
      ],
      descripcionFraccion: [
        {
          value: this.solicitud220502State.descripcionFraccion,
          disabled: true,
        },
      ],
      nico: [{ value: this.solicitud220502State.nico, disabled: true }],
      descripcion: [
        { value: this.solicitud220502State.descripcion, disabled: true },
      ],
      unidaddeMedidaDeUMT: [
        {
          value: this.solicitud220502State.unidaddeMedidaDeUMT,
          disabled: true,
        },
      ],
      cantidadTotalUMT: [
        { value: this.solicitud220502State.cantidadTotalUMT, disabled: true },
      ],
      saldoPendiente: [
        { value: this.solicitud220502State.saldoPendiente, disabled: true },
      ],
      saldoACapturar: [
        this.solicitud220502State.saldoACapturar,
        [Validators.required, Validators.maxLength(16)],
      ],
    });

    this.solicitud220502Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((data: Solicitud220502State) => {
          this.solicitud220502State = data;
          this.agregarMercanciaForm.patchValue({
            saldoACapturar: this.solicitud220502State.saldoACapturar,
          });
        })
      )
      .subscribe();
  }

  /**
   * Método para configurar los datos en el formulario con los valores de mercanciasDatos.
   */
  setFormData(): void {
    this.agregarMercanciaForm.patchValue({
      fraccionArancelaria: this.mercanciasDatos?.[0]?.fraccionArancelaria,
      descripcionFraccion: this.mercanciasDatos?.[0]?.descripcionFraccion,
      nico: this.mercanciasDatos?.[0]?.nico,
      descripcion: this.mercanciasDatos?.[0]?.descripcion,
      unidaddeMedidaDeUMT: this.mercanciasDatos?.[0]?.unidaddeMedidaDeUMT,
      saldoPendiente: this.mercanciasDatos?.[0]?.saldoPendiente,
      cantidadTotalUMT: this.mercanciasDatos?.[0]?.cantidadTotalUMT,
      saldoACapturar:this.mercanciasDatos?.[0]?.saldoACapturar,
    });
  }

  /**
   * Método para manejar la selección de la mercancía
   * @param event Evento que se dispara al cambiar el valor del campo "saldoACapturar".
   */
  setSaldoACapturar(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    this.solicitud220502Store.setSaldoACapturar(VALUE);
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
    if (Number(this.mercanciasDatos[0].cantidadTotalUMT) < Number(VALUE)) {
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
          Number(this.mercanciasDatos[0].cantidadTotalUMT) - Number(VALUE)
        ).toFixed(2)
      );
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
