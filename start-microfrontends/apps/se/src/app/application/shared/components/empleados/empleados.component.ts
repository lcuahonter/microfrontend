import { CEDULAS_OPTIONS, DIRECTOS, Directos } from '../../constantes/empleados.enum';
import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { Component, EventEmitter, Input, OnChanges, OnInit, output, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { doDeepCopy, esValidObject, Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ComplementarQuery } from '../../../estados/queries/complementar.query';
import { FECHA_DE_CEDULA } from '../../constantes/empleados.enum';
import { FECHA_DE_FIRMA } from '../../constantes/empleados.enum';
import { FECHA_FIN_VIGENCIA } from '../../constantes/empleados.enum';
import { FormGroup } from '@angular/forms';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import { ComplimentosService } from '../../services/complimentos.service';
/**
 * Componente para gestionar la información de empleados.
 * @class EmpleadosComponent
 */
@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    ReactiveFormsModule,
    NotificacionesComponent
  ],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css',
})
export class EmpleadosComponent implements OnInit {

  /**
   * Indica si se debe mostrar el modal de éxito al agregar un empleado.
   * @property {boolean} showSuccessModal
   */
  showSuccessModal = false;

  /**
   * Método que se ejecuta al hacer clic en el botón de agregar empleado.
   * Muestra el modal de éxito.
   */
  onAgregarClick() {
    if (typeof this.agregar === 'function') {
      this.agregar();
    }
    this.showSuccessModal = true;
  }

  /**
   * Método que se ejecuta al cerrar el modal de éxito.
   * Oculta el modal de éxito.
   */
  closeSuccessModal() {
    this.showSuccessModal = false;
  }
  /**
   * Formulario para gestionar la información de empleados.
   * @property {FormGroup} empleadosForm
   */
  empleadosForm!: FormGroup;
  /**
   * Nueva notificación para mostrar mensajes al usuario.
   * @property {Notificacion} nuevaNotificacion
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Nueva notificación para mostrar mensajes al usuario en el editor.
   * @property {Notificacion} nuevaNotificacionEditor
   */
  public nuevaNotificacionEditor!: Notificacion;

  razonSocial: string = '';

  /**
   * Nueva notificación para mostrar mensajes al usuario al eliminar registros.
   * @property {Notificacion} nuevaNotificacionEliminar
   */
  public nuevaNotificacionEliminar!: Notificacion;
  /**
 * Estado actual de la solicitud, utilizado para inicializar y gestionar los datos del formulario de empleados.
 * @property {ComplementarState} solicitudState
 */
  public solicitudState!: ComplementarState;
  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Indica si el campo de razón social está deshabilitado.
   * @property {boolean} disableRazonSocial
   */
  disableRazonSocial: boolean = true;

  /**
   * Opciones disponibles para cédulas.
   * @property {Array} cedulasOptions
   */
  cedulasOptions = CEDULAS_OPTIONS;

  /**
   * Tipo de selección para la tabla de empleados directos.
   * @property {TablaSeleccion} directosTablaSeleccion
   */
  directosTablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de encabezados para la tabla de empleados directos.
   * @property {any} directosEncabezado
   */
  directosEncabezado = DIRECTOS;

  /**
   * Datos para la tabla de empleados directos.
   * @property {Array} directosDatos
   */
  directosDatos!: Directos[];

  /**
   * Datos para la tabla de empleados directos.
   * @property {Array} selectedDirectosDatos
   */
  selectedDirectosDatos!: Directos[];

  /**
   * Configuración de la fecha de cédula.
   * @property {any} fetchaDeCedula
   */
  fetchaDeCedula = FECHA_DE_CEDULA;

  /**
   * Configuración de la fecha de firma.
   * @property {any} fetchaDeFirma
   */
  fetchaDeFirma = FECHA_DE_FIRMA;

  /**
   * Configuración de la fecha de fin de vigencia.
   * @property {any} fetchaFinVigencia
   */
  fetchaFinVigencia = FECHA_FIN_VIGENCIA;

  /**
   * Evento que se emite al cerrar el popup.
   * 
   * Se utiliza para notificar al componente padre que el popup ha sido cerrado.
   */
  @Output() cerrarPopup = new EventEmitter<void>();


  /**
   * Índice de la capacidad instalada que se está editando actualmente.
   */
  editingIndex: number | null = null;

  /**  
   * Evento de salida que emite una lista de empleados directos al componente padre.
   */
  @Output() obtenerEmpleadosList: EventEmitter<Directos[]> = new EventEmitter<Directos[]>();
  /**
   * Constructor del componente.
   * @constructor
   * @param {FormBuilder} fb - Servicio para construcción de formularios
   */
  constructor(public fb: FormBuilder, private ubicaccion: Location, private complimentosService: ComplimentosService,private complementarStore: ComplementarStore,
    private complementarQuery: ComplementarQuery) {

  }
  /**
   * Método que se ejecuta cuando el componente es inicializado.
   * 
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   */
  ngOnInit(): void {
    this.crearFormularioEmpleados();
    if (!this.directosDatos) {
      this.directosDatos = [];
    }
  }

  /**
   * Método que se ejecuta cuando las propiedades de entrada cambian.
   * Actualiza el valor del campo "razonSocial" en el formulario reactivo.
   */
  ngOnChanges(): void {
    if (this.razonSocial) {
      this.empleadosForm.get('razonSocial')?.setValue(this.razonSocial);
    }
  }
  /**
   * Crea el formulario de empleados.
   * @method crearFormularioEmpleados
   * @returns {void}
   */
  crearFormularioEmpleados(): void {
    this.complementarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as ComplementarState;
        })
      )
      .subscribe();
    this.empleadosForm = this.fb.group({
      totalDeEmpleados: [this.solicitudState.totalDeEmpleados, Validators.required],
      directos: [this.solicitudState.directos],
      indirectos: [this.solicitudState.indirectos],
      directo: [this.solicitudState.directo],
      cedula: [this.solicitudState.cedula],
      fechaCedula: [this.solicitudState.fechaCedula],
      indirectosDatos: [this.solicitudState.indirectosDatos],
      contrato: [this.solicitudState.contrato, [Validators.maxLength(20)]],
      objeto: [this.solicitudState.objeto, [Validators.maxLength(100)]],
      fechaFirma: [this.solicitudState.fechaFirma],
      fechaFinVigencia: [this.solicitudState.fechaFinVigencia],
      rfcEmpresa: [this.solicitudState.rfcEmpresa, [Validators.maxLength(13)]],
      razonSocial: [{ value: this.solicitudState.razonSocial, disabled: true }],
    });
    if(this.solicitudState.directosDatos.length > 0){
      this.directosDatos = this.solicitudState.directosDatos;
      this.limpiar();
    }
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
    this.empleadosForm.get(controlPath)?.setValue(value, { emitEvent: false });
  }

  /**
   * Vuelve a la ubicación anterior en el historial del navegador.
   * @returns {void}
   */
  regrasar(): void {
    this.obtenerEmpleadosList.emit(this.directosDatos);
    this.cerrarPopup.emit();
  }

  obtenerRazonSocial():void{
    const RFC_EMPRESA = this.empleadosForm.get('rfcEmpresa')?.value;

    if(!RFC_EMPRESA || RFC_EMPRESA.length > 12){
        this.nuevaNotificacionEditor = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'El RFC debe tener 12 caracteres de longitud',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        }
    }
      else{
        this.abrirRazonSocial(RFC_EMPRESA);
      }
  }
  /**
  * Maneja los cambios en el campo "Fecha de Pago".
  * Actualiza el estado del almacén con la fecha de pago proporcionada.  
  */
  cambiofetchaDeCedula(nuevo_valor: string): void {
    this.empleadosForm.patchValue({
      fechaCedula: nuevo_valor,
    });
    this.complementarStore.setFechaCedula(nuevo_valor);
  }
  /**
  * Maneja los cambios en el campo "Fecha de Pago".
  * Actualiza el estado del almacén con la fecha de pago proporcionada.  
  */
  cambiofetchaDeFirma(nuevo_valor: string): void {
    this.empleadosForm.patchValue({
      fechaFirma: nuevo_valor,
    });
    this.complementarStore.setFechaFirma(nuevo_valor);
  }
  /**
  * Maneja los cambios en el campo "Fecha de Pago".
  * Actualiza el estado del almacén con la fecha de pago proporcionada.  
  */
  cambiofechaFinVigencia(nuevo_valor: string): void {
    this.empleadosForm.patchValue({
      fechaFinVigencia: nuevo_valor,
    });
    this.complementarStore.setFechaFinVigencia(nuevo_valor);
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
    if (campo === 'directos') {
      this.setDirectosValidation();
    } else if (campo === 'indirectos') {
      this.setIndirectosValidation();
    }
    (this.complementarStore[metodoNombre] as (value: unknown) => void)(VALOR);
  }
  /** 
   * Abre la razón social de una empresa utilizando su RFC.
   * 
   * @param {string} rfc - RFC de la empresa cuya razón social se desea obtener.
   */
  abrirRazonSocial(rfc: string): void {
    this.complimentosService.obtenerRazonSocial(rfc).pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (esValidObject(response)) {
            const API_DATOS = doDeepCopy(response);
            if (esValidObject(API_DATOS.datos)) {
              this.empleadosForm.get('razonSocial')?.setValue(API_DATOS.datos.razon_social);
            }
          }
        },
        error: (err) => {
        this.empleadosForm.get('razonSocial')?.setValue('');
        this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'info',
        modo: 'action',
        titulo: '',
        mensaje: 'El RFC no se encontró, favor de verificarlo',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
        }
      });
  }
  /**
   * Maneja los cambios en el campo "Razon Social".
   * Actualiza el estado del almacén con la razón social proporcionada.  
   */
  setIndirectosValidation(): void {
    if (this.empleadosForm.get('indirectos')?.value) {
      if(this.empleadosForm.get('indirectos')?.value===true){
       this.empleadosForm.patchValue({
        indirectosDatos: this.solicitudState.indirectosDatos,
        contrato: this.solicitudState.contrato,
        objeto: this.solicitudState.objeto,
        fechaFirma: this.solicitudState.fechaFirma,
        fechaFinVigencia: this.solicitudState.fechaFinVigencia,
        rfcEmpresa: this.solicitudState.rfcEmpresa,
        razonSocial: this.solicitudState.razonSocial
      });
    }
      this.empleadosForm.get('indirectosDatos')?.setValidators([Validators.required]);
      this.empleadosForm.get('contrato')?.setValidators([Validators.required]);
      this.empleadosForm.get('objeto')?.setValidators([Validators.required]);
      this.empleadosForm.get('fechaFirma')?.setValidators([Validators.required]);
      this.empleadosForm.get('fechaFinVigencia')?.setValidators([Validators.required]);
      this.empleadosForm.get('rfcEmpresa')?.setValidators([Validators.required]);
      this.empleadosForm.get('razonSocial')?.setValidators([Validators.required]);
    } else {
      this.empleadosForm.get('indirectosDatos')?.clearValidators();
      this.empleadosForm.get('contrato')?.clearValidators();
      this.empleadosForm.get('objeto')?.clearValidators();
      this.empleadosForm.get('fechaFirma')?.clearValidators();
      this.empleadosForm.get('fechaFinVigencia')?.clearValidators();
      this.empleadosForm.get('rfcEmpresa')?.clearValidators();
      this.empleadosForm.get('razonSocial')?.clearValidators();
    }
    this.empleadosForm.get('indirectosDatos')?.updateValueAndValidity();
    this.empleadosForm.get('contrato')?.updateValueAndValidity();
    this.empleadosForm.get('objeto')?.updateValueAndValidity();
    this.empleadosForm.get('fechaFirma')?.updateValueAndValidity();
    this.empleadosForm.get('fechaFinVigencia')?.updateValueAndValidity();
    this.empleadosForm.get('rfcEmpresa')?.updateValueAndValidity();
    this.empleadosForm.get('razonSocial')?.updateValueAndValidity();
  }

  /**
   * Maneja los cambios en el campo "Razon Social".
   * Actualiza el estado del almacén con la razón social proporcionada.  
   */
  setDirectosValidation(): void {
    if (this.empleadosForm.get('directos')?.value) {
      this.empleadosForm.get('directo')?.setValidators([Validators.required]);
      this.empleadosForm.get('cedula')?.setValidators([Validators.required]);
      this.empleadosForm.get('fechaCedula')?.setValidators([Validators.required]);
    } else {
      this.empleadosForm.get('directo')?.clearValidators();
      this.empleadosForm.get('cedula')?.clearValidators();
      this.empleadosForm.get('fechaCedula')?.clearValidators();
    }
    this.empleadosForm.get('directo')?.updateValueAndValidity();
    this.empleadosForm.get('cedula')?.updateValueAndValidity();
    this.empleadosForm.get('fechaCedula')?.updateValueAndValidity();
  }

  /**
   * Maneja los cambios en el campo "Razon Social".
   * Actualiza el estado del almacén con la razón social proporcionada.  
   */
  agregar(): void {
      if(this.empleadosForm.invalid)
      {
        this.empleadosForm.markAllAsTouched();
        this.mostrarValidacion();
        return;
      }

    if (this.empleadosForm.valid) {
      const DIRECTOS = this.empleadosForm.get('directos')?.value;
      const INDIRECTOS = this.empleadosForm.get('indirectos')?.value;
      const TABLA_VALOR: Directos = {
        PLANTA: this.complimentosService.plantaID,
        TOTAL: this.empleadosForm.get('totalDeEmpleados')?.value,
        DIRECTOS: DIRECTOS ? this.empleadosForm.get('directo')?.value : '',
        CEDULA_DE_CUOTAS: DIRECTOS ? this.empleadosForm.get('cedula')?.value === 1 ? 'SI' : 'NO' : '',
        FECHA_DE_CEDULA: DIRECTOS ? this.empleadosForm.get('fechaCedula')?.value : '',
        INDIRECTOS: INDIRECTOS ? this.empleadosForm.get('indirectosDatos')?.value : '',
        CONTRATO: INDIRECTOS ? this.empleadosForm.get('contrato')?.value : '',
        OBJETO_DEL_CONTRATO_DEL_SERVICIO: INDIRECTOS ? this.empleadosForm.get('objeto')?.value : '',
        FECHA_FIRMA: INDIRECTOS ? this.empleadosForm.get('fechaFirma')?.value : '',
        FECHA_FIN_VIGENCIA: INDIRECTOS ? this.empleadosForm.get('fechaFinVigencia')?.value : '',
        RFC: INDIRECTOS ? this.empleadosForm.get('rfcEmpresa')?.value : '',
        RAZON_SOCIAL: INDIRECTOS ? this.empleadosForm.get('razonSocial')?.value : ''
      };

      if (this.editingIndex !== null && this.editingIndex > -1 && TABLA_VALOR !== null) {
        this.directosDatos[this.editingIndex] = TABLA_VALOR;
        this.directosDatos = [...this.directosDatos];
        this.editingIndex = null;

      } else if (TABLA_VALOR !== null) {
        this.directosDatos = [...this.directosDatos, TABLA_VALOR];
      }
      this.complementarStore.setDirectosDatos(this.directosDatos);
      this.limpiar();
      this.nuevaNotificacion = {
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
    }

    this.selectedDirectosDatos = [];
    this.agregarValidacion();
  }
  /**
   * Agrega validaciones al formulario de empleados.
   * 
   * Este método verifica las condiciones de los campos del formulario `empleadosForm`
   */
  agregarValidacion(): void {
    if (this.empleadosForm.get('directos')?.value && !this.empleadosForm.get('indirectos')?.value) {
      const DIRECTOS = this.empleadosForm.get('directo')?.value;
      const CEDULA_DE_CUOTAS = this.empleadosForm.get('cedula')?.value;
      const FECHA_DE_CEDULA = this.empleadosForm.get('fechaCedula')?.value;

      if (DIRECTOS === "" || CEDULA_DE_CUOTAS === "" || FECHA_DE_CEDULA === "") {
        this.mostrarValidacion();
      }
    }
    else if (this.empleadosForm.get('indirectos')?.value && !this.empleadosForm.get('directos')?.value) {
      const CONTRATO = this.empleadosForm.get('contrato')?.value;
      const OBJETO_DEL_CONTRATO_DEL_SERVICIO = this.empleadosForm.get('objeto')?.value;
      const FECHA_FIRMA = this.empleadosForm.get('fechaFirma')?.value;
      const FECHA_FIN_VIGENCIA = this.empleadosForm.get('fechaFinVigencia')?.value;
      const RFC = this.empleadosForm.get('rfcEmpresa')?.value;
      const RAZON_SOCIAL = this.empleadosForm.get('razonSocial')?.value;

      if (
        CONTRATO === "" ||
        OBJETO_DEL_CONTRATO_DEL_SERVICIO === "" ||
        FECHA_FIRMA === "" ||
        FECHA_FIN_VIGENCIA === "" ||
        RFC === "" ||
        RAZON_SOCIAL === ""
      ) {
        this.mostrarValidacion();
      }
    }
    else if (this.empleadosForm.invalid) {
      this.mostrarValidacion();
    }
  }
  /**
   * Muestra una notificación de validación al usuario.
   * 
   * Esta función configura y muestra una notificación de advertencia indicando que
   * el usuario debe capturar todos los datos marcados como obligatorios.
   */
  mostrarValidacion(): void {
    const DIRECTOS_CHECKED = this.empleadosForm.get('directos')?.value;
    const INDIRECTOS_CHECKED = this.empleadosForm.get('indirectos')?.value;
    if (DIRECTOS_CHECKED || INDIRECTOS_CHECKED) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'info',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe capturar todos los datos marcados como obligatorios(*)',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Restablece el formulario de empleados a su estado inicial.
   * 
   * Este método realiza las siguientes acciones:
   * - Reinicia todos los campos del formulario `empleadosForm` a sus valores predeterminados.
   * - Desactiva el campo `razonSocial` en el formulario.
   * - Establece la propiedad `disableRazonSocial` en `true` para reflejar el estado deshabilitado.
   * - Limpia la lista de datos `directosDatos`.
   * - Establece los valores de los campos `directos` e `indirectos` en `false`.
   * - Configura las validaciones para los campos `directos` e `indirectos` llamando a los métodos `setDirectosValidation` y `setIndirectosValidation`.
   * 
   * Este método es útil para reiniciar el formulario y asegurarse de que todos los campos y validaciones
   * estén en su estado inicial.
   */
  limpiar(): void {
    this.empleadosForm.reset();
    this.empleadosForm.get('razonSocial')?.disable();
    this.disableRazonSocial = true;
    this.empleadosForm.get('directos')?.setValue(false);
    this.empleadosForm.get('indirectos')?.setValue(false);
    this.setDirectosValidation();
    this.setIndirectosValidation();
  }

  /**
     * Maneja la selección de capacidades instaladas.
     * 
     * @param capacidadInstalada - Arreglo de objetos `CapacidadInstalada` seleccionados.
     * Si el arreglo contiene elementos, actualiza la propiedad `SelectedInstaladaDatos` con la selección.
     */
  onDirectosSeleccionadas(DirectosDatos: Directos[]): void {
    if (DirectosDatos.length > 0) {
      this.selectedDirectosDatos = DirectosDatos;
    }
  }

  /**
   * Elimina las capacidades instaladas seleccionadas de la lista `capacidadInstaladaDatos`.
   * 
   * Recorre el arreglo `SelectedInstaladaDatos` y elimina cada elemento correspondiente
   * de `capacidadInstaladaDatos` si existe. Al finalizar, actualiza la referencia del arreglo
   * para asegurar la detección de cambios en Angular.
   *
   * @remarks
   * Esta función asume que `SelectedInstaladaDatos` y `capacidadInstaladaDatos` son arreglos
   * de objetos comparables mediante igualdad estricta (`===`).
   */
  eliminarDirectos(): void {
    if (this.selectedDirectosDatos?.length > 0) {
      this.mostrarNotificacionEliminarDirectos();
      this.selectedDirectosDatos.forEach(planta => {
        const INDEX = this.selectedDirectosDatos.findIndex(row => row === planta);
        if (INDEX !== -1) {
          this.directosDatos.splice(INDEX, 1);
        }
      });
      this.directosDatos = [...this.directosDatos];
      this.complementarStore.setDirectosDatos(this.directosDatos);
    }
    else {
      this.mostrarNotificacionEliminarDirectos();
    }
  }

  /**
   * Nueva notificación para mostrar mensajes al usuario al eliminar registros.
   */
  mostrarNotificacionEliminarDirectos(): void {
    this.nuevaNotificacionEliminar = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: this.selectedDirectosDatos?.length > 0 ? 'El registro fue eliminado correctamente.' : 'Debe elegir al menos un registro de empleados para eliminar.',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  /**
   * Maneja la edición de empleados directos.
   * 
   * Si hay exactamente un empleado seleccionado en `selectedDirectosDatos`, llena el formulario
   * con los datos de ese empleado y establece `editingIndex` al índice correspondiente en `directosDatos`.
   * Si no hay empleados seleccionados, muestra una notificación de advertencia.
   */
  editarDirectos(): void {
      if (this.selectedDirectosDatos && this.selectedDirectosDatos.length > 1) {
     this.nuevaNotificacionEditor = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe elegir solo un registro para editar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        }
        return;
      }

    if (this.selectedDirectosDatos?.length === 1) {
      const SELECTED = this.selectedDirectosDatos[0];
      this.empleadosForm.patchValue({
        directo: SELECTED.DIRECTOS,
        totalDeEmpleados: SELECTED.TOTAL,
        directos: SELECTED.DIRECTOS,
        cedula: SELECTED.CEDULA_DE_CUOTAS === 'SI' ? 1 : SELECTED.CEDULA_DE_CUOTAS === 'NO' ? 2 : '',
        fechaCedula: SELECTED.FECHA_DE_CEDULA,
        indirectos: SELECTED.INDIRECTOS,
        indirectosDatos: SELECTED.INDIRECTOS,
        contrato: SELECTED.CONTRATO,
        objeto: SELECTED.OBJETO_DEL_CONTRATO_DEL_SERVICIO,
        fechaFirma: SELECTED.FECHA_FIRMA,
        fechaFinVigencia: SELECTED.FECHA_FIN_VIGENCIA,
        rfcEmpresa: SELECTED.RFC,
        razonSocial: SELECTED.RAZON_SOCIAL
      });

      setTimeout(() => {
        const NATIVE_EL = document.querySelector(
          'input[formControlName="totalDeEmpleados"]'
        ) as HTMLElement | null;
        if (NATIVE_EL) {
          NATIVE_EL.focus();
        }
      }, 0);
      this.editingIndex = this.directosDatos.findIndex(row => row === SELECTED);
    }
    else if (!this.selectedDirectosDatos || this.selectedDirectosDatos.length === 0) {
      this.nuevaNotificacionEditor = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe elegir un registro de complemento para actualizar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Muestra una notificación de error al usuario.
   * @param message - Mensaje de error a mostrar en la notificación.
   */
  showErrorMessage(message: string): void {
    this.nuevaNotificacion = {
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


}
