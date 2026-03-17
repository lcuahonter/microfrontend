import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplementarQuery } from '../../../estados/queries/complementar.query';
import { ComplimentosService } from '../../services/complimentos.service';

import { CATALOGO_TIPO, MontoDeInversion } from '../../constantes/complementar-planta.enum';
import { FormBuilder, Validators } from '@angular/forms';
import { Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MONTOS_DE_INVERSION } from '../../constantes/montos-de-inversion.enum';
import { ReactiveFormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src'

import {Catalogo, TablaSeleccion } from '@libs/shared/data-access-user/src'
import { TituloComponent } from '@libs/shared/data-access-user/src'
/**
 * Componente para gestionar los montos de inversión.
 * @class MontosDeInversionComponent
 */
@Component({
  selector: 'app-montos-de-inversion',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    NotificacionesComponent
  ],
  templateUrl: './montos-de-inversion.component.html',
  styleUrl: './montos-de-inversion.component.css',
})
export class MontosDeInversionComponent implements OnInit {

  @Input() montosDeInversionDatos: MontoDeInversion[] = [];
  /**
   * Formulario para gestionar los montos de inversión.
   * @property {FormGroup} montosDeInversionForm
   */
  montosDeInversionForm!: FormGroup;

  /**
   * Opciones disponibles para el tipo de inversión.
   * @property {Array} tipoOptions
   */
  tipoOptions : Catalogo[] = [] ;

  /**
   * Lista de montos de inversión.
   * @property {Array} montosDeInversion
   */
  montosDeInversion = [];
  /**
   * Tipo de selección para la tabla de montos de inversión.
   * @property {TablaSeleccion} montosDeInversionTablaSeleccion
   */
  montosDeInversionTablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de encabezados para la tabla de montos de inversión.
   * @property {any} montosDeInversionEncabezado
   */
  montosDeInversionEncabezado = MONTOS_DE_INVERSION;

  /**
   * Datos para la tabla de montos de inversión.
   * @property {MontoDeInversion[]} montosDeInversionDatos
   */
 // montosDeInversionDatos: MontoDeInversion[] = [];
  /**
    * Estado de la solicitud 221601, que contiene los valores actuales de la solicitud.
    */
  public solicitudState!: ComplementarState;
  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Notificación para agregar un monto de inversión.
   */
  public agregarMontoNotificacion!: Notificacion;
  /**
   * Evento que se emite al cerrar el popup.
   * 
   * Se utiliza para notificar al componente padre que el popup ha sido cerrado.
   */
  @Output() cerrarPopup = new EventEmitter<void>();

  /**  
   * Evento de salida que emite una lista de montos de inversión al componente padre.
   */
  @Output() obtenerMontosInversionList: EventEmitter<MontoDeInversion[]> = new EventEmitter<MontoDeInversion[]>();
   @Output() obtenerMontosInversion: EventEmitter<MontoDeInversion> = new EventEmitter<MontoDeInversion>();
   @Output() removeMontosInversionList: EventEmitter<MontoDeInversion[]> = new EventEmitter<MontoDeInversion[]>();

  /**
   * Índice de la capacidad instalada que se está editando actualmente.
   */
  editingIndex: number | null = null;
  /**
   * Maneja el cambio de selección en la tabla de montos de inversión.
   * @param event Evento que contiene la lista de filas seleccionadas en la tabla.
   */
  public seleccionados: MontoDeInversion[] = [];

  /**
 * Nueva notificación para mostrar mensajes al usuario en el editor.
 * @property {Notificacion} nuevaNotificacionEditor
 */
  public nuevaNotificacionEditor!: Notificacion;

  /**
   * Notificación para eliminar un monto de inversión.
   * @property {Notificacion} NotificacionEliminarMonto
   */
  public NotificacionEliminarMonto!: Notificacion;
  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para construcción de formularios
   */
  constructor(private fb: FormBuilder, private ubicaccion: Location, private complementarStore: ComplementarStore,
    private complementarQuery: ComplementarQuery, private complimentosService: ComplimentosService,) {

  }
  /**
  * Método que se ejecuta cuando el componente es inicializado.
  * 
  * Inicializa el formulario reactivo con los valores actuales de la solicitud.
  */
  ngOnInit(): void {
    this.createMontosDeInversionForm();
    if (!(this.solicitudState.tipoInversionOptions.length)) {
      this.obtenerTipoMontoOptions('ENU_TIPO_MONTO_INVERSION');
    } else {
      this.tipoOptions = [...this.solicitudState.tipoInversionOptions];
    }
  }
  /**
   * Agrega un nuevo monto de inversión.
   */
  agregarMonto(): void {

    if (this.montosDeInversionForm.valid) {
      this.agregarMontoNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'La operación se realizó exitosamente.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      const VALOR_FORMULARIO = this.montosDeInversionForm.value;
      const TIPO = this.tipoOptions.find(tipo => tipo.clave === VALOR_FORMULARIO.tipos);
      const NUEVO_MONTO: MontoDeInversion = {
        PLANTA: this.complimentosService.plantaID,
        TIPO: TIPO?.descripcion || '',
        CANTIDAD: VALOR_FORMULARIO.cantidad || '',
        DESCRIPCION: VALOR_FORMULARIO.descripsion || '',
        MONTO: VALOR_FORMULARIO.mnx || '',
      };
      if (this.editingIndex !== null && this.editingIndex > -1) {
        this.montosDeInversionDatos[this.editingIndex] = NUEVO_MONTO;
        this.montosDeInversionDatos = [...this.montosDeInversionDatos];
        this.editingIndex = null;

      } else {
        this.montosDeInversionDatos = [...this.montosDeInversionDatos, NUEVO_MONTO];
        this.obtenerMontosInversionList.emit(this.montosDeInversionDatos);
        this.obtenerMontosInversion.emit(NUEVO_MONTO);
      }
      this.seleccionados = [];
      this.montosDeInversionForm.reset();
      this.setValoresStore(this.montosDeInversionForm, 'tipos', 'setTipos');
      this.setValoresStore(this.montosDeInversionForm, 'cantidad', 'setCantidad');
      this.setValoresStore(this.montosDeInversionForm, 'descripsion', 'setDescripsion');
      this.setValoresStore(this.montosDeInversionForm, 'mnx', 'setMnx');
    }else{
      this.showErrorMessage('Debe capturar todos los datos marcados como obligatorios(*)');
    }
  }
  /**
   * Limpia el formulario de montos de inversión.
   */
  limpiarFormulario(): void {
    this.montosDeInversionForm.reset();
  }

  /** Obtiene y actualiza las opciones del catálogo de tipo de monto desde el servicio. */
  obtenerTipoMontoOptions(tipo: string): void {
    this.complimentosService.getTipoInversion(tipo)
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((res) => {
        this.complementarStore.setTipoInversionOptions(res.datos);
        this.tipoOptions = res.datos;
      });
  }

  /**
   * Crea el formulario de montos de inversión.
   * @method createMontosDeInversionForm
   * @returns {void}
   */
  createMontosDeInversionForm(): void {

    this.complementarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as ComplementarState;
        })
      )
      .subscribe();
    this.montosDeInversionForm = this.fb.group({
      tipos: [this.solicitudState.tipos],
      cantidad: [this.solicitudState.cantidad, [Validators.required]],
      descripsion: [this.solicitudState.descripsion, [Validators.required, Validators.maxLength(1000)]],
      mnx: [
        this.solicitudState.mnx, [Validators.required]
      ],
    });
  }

  /**
   * Maneja el evento de entrada y limita la longitud del texto.
   * @param event Evento del input
   * @param maxLength Longitud máxima permitida
   */
  onInputMaxLength(event: Event, maxLength: number, controlPath: string): void {
    const TARGET = event.target as HTMLInputElement;
    let value = TARGET.value;
    value = value.replace(/\D/g, '').slice(0, maxLength);
    TARGET.value = value;
    this.montosDeInversionForm.get(controlPath)?.setValue(value, { emitEvent: false });
  }
  /**
     * Método que actualiza el store con los valores del formulario.
     * 
     * @param form - Formulario reactivo con los datos actuales.
     * @param campo - El campo que debe actualizarse en el store.
     * @param metodoNombre - El nombre del método en el store que se debe invocar.
     */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof ComplementarStore): void {
    const VALOR = form.get(campo)?.value;
    (this.complementarStore[metodoNombre] as (value: unknown) => void)(VALOR);
  }
  /**
   * Vuelve a la ubicación anterior en el historial del navegador.
   * @returns {void}
   */
  regrasar(): void {
    this.cerrarPopup.emit();
  }

  /**
   * Maneja el cambio de selección en la tabla de montos de inversión.
   * @param event Evento que contiene la lista de filas seleccionadas en la tabla.
   */
  onSeleccionChange(event: MontoDeInversion[]): void {
    this.seleccionados = event;
  }

  /**
   * Elimina los montos de inversión seleccionados de la lista.
   * @returns {void}
   */
  eliminarMonto(): void {
    if (this.seleccionados.length > 0) {
      this.mostrarNotificacionEliminarMonto();
      this.montosDeInversionDatos = this.montosDeInversionDatos.filter(
        data => !this.seleccionados.some(sel =>
          sel.TIPO === data.TIPO &&
          sel.CANTIDAD === data.CANTIDAD &&
          sel.DESCRIPCION === data.DESCRIPCION &&
          sel.MONTO === data.MONTO
        )
      );
      this.obtenerMontosInversionList.emit(this.montosDeInversionDatos);
      this.removeMontosInversionList.emit(this.seleccionados);
      this.seleccionados = [];
    }
    else {
      this.mostrarNotificacionEliminarMonto();
    }
  }

  /**
   * Muestra una notificación de eliminación de monto.
   * @returns {void} 
   */
  mostrarNotificacionEliminarMonto(): void {
    this.NotificacionEliminarMonto = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: this.seleccionados.length > 0 ? 'El registro fue eliminado correctamente.' : 'Debe elegir al menos un registro de monto de inversion para eliminar.',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

    /**
   * Muestra una notificación de error al usuario.
   * @param message - Mensaje de error a mostrar en la notificación.
   */
  showErrorMessage(message: string): void {
    this.agregarMontoNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: message,
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Maneja la edición de un monto de inversión seleccionado.
   * Si hay exactamente un monto seleccionado en `seleccionados`, llena el formulario
   * con los datos de ese monto y establece `editingIndex` al índice correspondiente en `montosDeInversionDatos`.
   * Si no hay montos seleccionados, muestra una notificación de advertencia.
   * @returns {void}
   */
  editarMonto(): void {
    if(this.seleccionados.length > 1){
       this.nuevaNotificacionEditor = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe elegir solo un registro para editar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (this.seleccionados?.length === 1) {
      const SELECTED = this.seleccionados[0];
      const TIPO = this.tipoOptions.find(tipo => tipo.descripcion === SELECTED.TIPO);
      this.montosDeInversionForm.patchValue({
        tipos: TIPO?.clave || '',
        cantidad: SELECTED.CANTIDAD,
        descripsion: SELECTED.DESCRIPCION,
        mnx: SELECTED.MONTO,
      });
      setTimeout(() => {
        const NATIVE_EL = document.querySelector(
          'app-catalogo-select[formControlName="tipos"] select'
        ) as HTMLElement | null;
        if (NATIVE_EL) {
          NATIVE_EL.focus();
        }
      }, 0);
      this.editingIndex = this.montosDeInversionDatos.findIndex(row => row === SELECTED);
    }
    else if (!this.seleccionados || this.seleccionados.length === 0) {
      this.nuevaNotificacionEditor = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe elegir un registro de monto de inversión para actualizar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }
}
