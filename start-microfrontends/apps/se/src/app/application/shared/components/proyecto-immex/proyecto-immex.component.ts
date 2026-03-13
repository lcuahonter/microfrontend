import {
  AnexoUnoEncabezado,
  Catalogo,
  ProyectoImmexConfiguartion,
  ProyectoImmexEncabezado,
} from '../../models/nuevo-programa-industrial.model';
import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { INPUT_FECHA_DE_CONFIGURACION, INPUT_FECHA_DE_VIGENCIA } from '../../../tramites/80102/models/autorizacion-programa-nuevo.model';
import { Notificacion, NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { OnInit, Output } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ComplementarQuery } from '../../../estados/queries/complementar.query';
import { ComplimentosService } from '../../services/complimentos.service';
import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { Location } from '@angular/common';
import { PoryectoDatos } from '../../models/nuevo-programa-industrial.model';
import { ReactiveFormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Validators } from '@angular/forms';
import { d } from '@datorama/akita-ngdevtools';
@Component({
  selector: 'app-proyecto-immex',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
    InputFechaComponent,
  ],
  templateUrl: './proyecto-immex.component.html',
  styleUrl: './proyecto-immex.component.scss',
})
/**
 * Componente para gestionar los proyectos IMMEX.
 */
export class ProyectoImmexComponent implements OnInit {
  /**
   * Datos del proyecto IMMEX.
   * @type {PoryectoDatos}
   */
  @Input() proyectoImmexDatos!: PoryectoDatos;

  /**
   * Datos del catálogo de documentos.
   * @type {Catalogo[]}
   */
  public documentoCatalogDatos: Catalogo[] = [];

  /**
   * Configuración del proyecto IMMEX.
   * @type {ProyectoImmexConfiguartion<ProyectoImmexEncabezado>}
   */
  @Input()
  proyectoImmexConfiguartion!: ProyectoImmexConfiguartion<ProyectoImmexEncabezado>;

  /**
   * Lista de encabezados del proyecto IMMEX.
   * @type {ProyectoImmexEncabezado[]}
   */
  @Input() proyectoImmexTablaLista: ProyectoImmexEncabezado[] = [];

  /**
   * Emisor de eventos para devolver la lista de encabezados del proyecto IMMEX.
   * @type {EventEmitter<ProyectoImmexEncabezado[]>}
   */
  @Output() obtenerProyectoTablaDevolverLaLlamada: EventEmitter<
    ProyectoImmexEncabezado[]
  > = new EventEmitter<ProyectoImmexEncabezado[]>(true);


  /**
    * Constante para configurar el input de fecha.
    * Define las propiedades del campo de entrada de fecha.
    */
  INPUT_FECHA_DE_CONFIGURACION = INPUT_FECHA_DE_CONFIGURACION;

  /**
   * Constante para configurar el input de fecha de vigencia.
   * Define las propiedades del campo de entrada de fecha de vigencia.
   */
  INPUT_FECHA_DE_VIGENCIA = INPUT_FECHA_DE_VIGENCIA;
  /**
   * Formulario reactivo para gestionar los datos del proyecto IMMEX.
   * @type {FormGroup}
   */
  public proyectoForm!: FormGroup;

  /**
   * Indica si la tabla está seleccionada.
   * @type {boolean}
   */
  public esTablaeleccionada: boolean = false;

  /**
   * Lista de encabezados seleccionados del proyecto IMMEX.
   * @type {ProyectoImmexEncabezado[]}
   */
  public seleccionList: ProyectoImmexEncabezado[] = [];

  /**
   * Evento que se emite al cerrar el popup.
   * 
   * Se utiliza para notificar al componente padre que el popup ha sido cerrado.
   */
  @Output() cerrarPopup = new EventEmitter<void>();

  /**
    *  * compodoc
   * @property {Subject<void>} destroyNotifier$
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud 221601, que contiene los valores actuales de la solicitud.
   */
  public complementarState!: ComplementarState;

  /**
   * Contiene la notificación relacionada con la acción de agregar una empresa o elemento.
   * 
   * Se utiliza para mostrar mensajes al usuario, como confirmaciones de éxito,
   * advertencias o errores durante el proceso de agregado.
   */
  public agregarNotification!: Notificacion;

  /**
   * Notificación para mostrar mensajes al usuario.
   * @type {Notificacion}
   */
  public nuevaNotificacion!: Notificacion;

  /** 
   * Fila seleccionada del tipo AnexoUnoEncabezado.
   * Se utiliza para almacenar y manipular la fila actualmente activa o seleccionada en la tabla.
   */
  public selectedRow: AnexoUnoEncabezado | null = null;

  /**
   * Today's date in yyyy-MM-dd format for min attribute in date input
   */
  public today!: string;
  /**
   * Indica si el componente está en modo de edición.
   */
  isEditMode = false;
  /**
   * Índice del elemento que se está editando.
   */
  editIndex: number | null = null;
  /**
   * Constructor de la clase ProyectoImmexComponent.
   * @param {FormBuilder} fb - FormBuilder para la creación del formulario reactivo.
   * @param {Location} ubicaccion - Servicio de Angular para manejar la ubicación del navegador.
   */
  constructor(
    private fb: FormBuilder,
    private ubicaccion: Location,
    private complimentosService: ComplimentosService,
    private complementarStore: ComplementarStore,
    private complementarQuery: ComplementarQuery) {
    //El constructor requiere inyección de dependencias, pero se ha mantenido vacío debido a una regla de ESLint.
  }

  /**
 * Inicializa el componente, suscribe al estado de la solicitud y carga las opciones de país si es necesario.
 */
  ngOnInit(): void {
    this.complementarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.complementarState = seccionState as ComplementarState;
        })
      )
      .subscribe();
    this.complimentosService.anexoUnoFilaSeleccionada$.subscribe(row => {
      this.selectedRow = row;
    });
    this.crearProyectoForm();

    // Clear any previous selection state when component initializes
    this.seleccionList = [];

    if (!(this.complementarState.tipoDocumentoOptions.length)) {
      this.obtenerTipoDocumentoOptions();
    } else {
      this.documentoCatalogDatos = [...this.complementarState.tipoDocumentoOptions];
    }
    this.today = this.getToday();
  }

  /** Obtiene y actualiza las opciones del catálogo de tipo de documento desde el servicio. */
  // obtenerTipoDocumentoOptions(id: number): void {
  //   this.complimentosService.getTipoDocumento(id)
  //     .pipe(
  //       takeUntil(this.destroyNotifier$)
  //     )
  //     .subscribe((res) => {
  //       this.complementarStore.setTipoDocumentoOptions(res.datos);
  //       this.documentoCatalogDatos = res.datos;
  //     });
  // }
  obtenerTipoDocumentoOptions(): void {
    this.complimentosService.TipoDocImmex()
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((res) => {
        this.complementarStore.setTipoDocumentoOptions(res.datos);
        this.documentoCatalogDatos = res.datos;
      });
  }


  /**
   * Crea el formulario reactivo para el proyecto IMMEX.
   * @returns {void}
   */
  crearProyectoForm(): void {
    this.proyectoForm = this.fb.group({
      descripcion: [{ value: this.selectedRow?.encabezadoDescripcionComercial, disabled: true }, Validators.required],
      tipoDeDocumente: [this.complementarState.tipoDeDocumente, Validators.required],
      descripcionOtroImmex: [this.complementarState.descripcionOtroImmex, [Validators.maxLength(60)]],
      fechaDeFirma: [this.complementarState.fechaDeFirma, Validators.required],
      fechaDeVigencia: [
        this.complementarState.fechaDeVigencia,
        Validators.required,
      ],
      rfcTaxId: [this.complementarState.rfcTaxId, [
        Validators.required,
        Validators.maxLength(20),
      ]],
      razonSocial: [this.complementarState.razonSocial, [
        Validators.required,
        Validators.maxLength(180),
      ]],
    });

    this.proyectoForm
      .get('tipoDeDocumente')
      ?.valueChanges.subscribe((value) => {
        const DESCRIPCION_CTRL = this.proyectoForm.get('descripcionOtroImmex');

        if (value === 'TIDPI.OTRO') {
          DESCRIPCION_CTRL?.setValidators([
            Validators.required,
            Validators.maxLength(60),
          ]);
        } else {
          DESCRIPCION_CTRL?.clearValidators();
          DESCRIPCION_CTRL?.setValue('');
        }

        DESCRIPCION_CTRL?.updateValueAndValidity();
      });
  }
  /**
   * Obtiene la fecha actual en formato yyyy-MM-dd.
   * @returns {string} - La fecha actual en formato yyyy-MM-dd.
   */
  private getToday(): string {
    const DATE = new Date();
    return DATE.toISOString().split('T')[0]; // yyyy-MM-dd
  }
  /**
   * Establece la lista de proyectos seleccionados.
   * @param {ProyectoImmexEncabezado[]} event - Lista de encabezados seleccionados.
   * @returns {void}
   */
  setProyectpLista(event: ProyectoImmexEncabezado[]): void {
    this.seleccionList = event;
  }
  /**
   * Agrega un nuevo proyecto IMMEX a la lista.
   * @returns {void}
   */
  aggregar(): void {
    const RFC_TAX_ID_VALUE = this.proyectoForm.get('rfcTaxId')?.value || '';
    const RAZON_SOCIAL_VALUE = this.proyectoForm.get('razonSocial')?.value || '';
    const ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9]+$/;
       if (this.proyectoForm.invalid) {
      this.agregarNotification = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe capturar todos los datos marcados como obligatorios(*)',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (!ALPHANUMERIC_PATTERN.test(RFC_TAX_ID_VALUE) || !ALPHANUMERIC_PATTERN.test(RAZON_SOCIAL_VALUE)) {
      this.agregarNotification = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Ocurrió un error al cargar la información.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
 
    if (this.proyectoForm.valid) {
      this.agregarNotification = {
        tipoNotificacion: 'alert',
        categoria: 'success',
        modo: 'action',
        titulo: '',
        mensaje:
          'La operación se realizó exitosamente.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      }
    }
    const DESCRIPCION_VALUE = this.proyectoForm.get('descripcion')?.value;
    const OBJECTO_IDX: ProyectoImmexEncabezado = {
      encabezadoDescripcionOtro: this.proyectoForm.get('descripcionOtroImmex')?.value,
      encabezadoTipoDocument: this.proyectoForm.get('tipoDeDocumente')?.value,
      encabezadoFechaFirma: this.proyectoForm.get('fechaDeFirma')?.value,
      encabezadoFechaVigencia: this.proyectoForm.get('fechaDeVigencia')?.value,
      encabezadoRfc: typeof this.proyectoForm.get('rfcTaxId')?.value === 'string' ? this.proyectoForm.get('rfcTaxId')?.value.toUpperCase() : this.proyectoForm.get('rfcTaxId')?.value,
      encabezadoRazonFirmante: this.proyectoForm.get('razonSocial')?.value,
      estatus: false,
      encabezadoFraccion: (this.proyectoImmexTablaLista.length + 1).toString(), // Sequential indexing
    };

    if (this.isEditMode && this.editIndex !== null) {
      this.proyectoImmexTablaLista[this.editIndex] = OBJECTO_IDX;
    } else {
      this.proyectoImmexTablaLista = [
        ...this.proyectoImmexTablaLista,
        OBJECTO_IDX
      ];
    }

    this.obtenerProyectoTablaDevolverLaLlamada.emit(
      this.proyectoImmexTablaLista
    );

    this.proyectoForm.reset({
      descripcion: DESCRIPCION_VALUE
    });
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
   * Limpia el formulario del proyecto IMMEX.
   * @returns {void}
   */
  limpar(): void {
    const DESCRIPCION_VALUE = this.proyectoForm.get('descripcion')?.value;
    this.proyectoForm.reset({
      descripcion: DESCRIPCION_VALUE
    });

  }

  /**
* Obtiene el número total de socios accionistas registrados en el formulario.
* @returns {number} Total de socios accionistas. 
*/
  get totalItemsproyectoImmexTablaLista(): number {
    return this.proyectoImmexTablaLista.length;
  }
  /**
   * Elimina los proyectos IMMEX seleccionados de la lista.
   * @returns {void}
   */
  elimiar(): void {
    if (this.seleccionList.length > 0) {
      this.proyectoImmexTablaLista = this.proyectoImmexTablaLista.filter(
        row => !this.seleccionList.includes(row)
      );
      this.obtenerProyectoTablaDevolverLaLlamada.emit(this.proyectoImmexTablaLista);
      this.seleccionList = [];
    } else {
      this.agregarNotification = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe elegir al menos un firmante para eliminar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Edita el proyecto IMMEX seleccionado en el formulario.
   * @returns {void}
   */
  eidtar(): void {
    if (!this.seleccionList?.length) {
      this.agregarNotification = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar un registro de Proyecto IMMEX para actualizar',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (this.seleccionList.length > 1) {
      this.agregarNotification = {
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
    const SELECTED = this.seleccionList[0];

    this.isEditMode = true;
    this.editIndex = this.proyectoImmexTablaLista.findIndex(
      item => item === SELECTED
    );
    this.proyectoForm.patchValue({
      descripcion: SELECTED.encabezadoDescripcionOtro,
      tipoDeDocumente: SELECTED.encabezadoTipoDocument,
      descripcionOtroImmex: SELECTED.encabezadoDescripcionOtro,
      fechaDeFirma: SELECTED.encabezadoFechaFirma,
      fechaDeVigencia: SELECTED.encabezadoFechaVigencia,
      rfcTaxId: SELECTED.encabezadoRfc,
      razonSocial: SELECTED.encabezadoRazonFirmante,
    });

    setTimeout(() => {
      const INPUT = document.querySelector(
        'input[formControlName="descripcion"]'
      ) as HTMLInputElement;

      INPUT?.focus();
    });
  }

  /**
  * Maneja los cambios en el campo "Fecha de Pago".
  * Actualiza el estado del almacén con la fecha de pago proporcionada.  
  */
  cambioFechaFirma(nuevo_valor: string): void {
    this.proyectoForm.patchValue({
      fechaDeFirma: nuevo_valor,
    });
    this.complementarStore.setFechaDeFirma(nuevo_valor);
  }
  /**
   * Maneja los cambios en el campo "Fecha de Vigencia".
   * Actualiza el estado del almacén con la fecha de vigencia proporcionada.
   * @param nuevo_valor 
   */
  cambioFechaVigencia(nuevo_valor: string): void {
    this.proyectoForm.patchValue({
      fechaDeVigencia: nuevo_valor,
    });
    this.complementarStore.setFechaDeVigencia(nuevo_valor);
  }
  /**
   * Regresa a la ubicación anterior en el historial del navegador.
   * @returns {void}
   */
  regresar(): void {
    this.limpar();
    this.cerrarPopup.emit();
  }


}
