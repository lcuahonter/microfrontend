import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Catalogo, InputFecha, Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';


import { CATALOGO_TIPO, COMPLEMENTO_DE_PLANTA, COMPLEMENTO_PLANTA, ComplementarPlantaState, ComplementoDePlanta, PERMANCERA_OPTIONS, } from '../../constantes/complementar-planta.enum';
import { ComplementarQuery } from '../../../estados/queries/complementar.query';
import { ComplimentosService } from '../../services/complimentos.service';
import { FECHA_DE_FIN_DE_VIGENCIA } from '../../constantes/complementar-planta.enum';
import { FECHA_DE_FIRMA } from '../../constantes/complementar-planta.enum';
import { Location } from '@angular/common';
/**
 * Componente para gestionar la información complementaria de planta.
 * @class ComplementarPlantaComponent
 */
@Component({
  selector: 'app-complementar-planta',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    TablaDinamicaComponent, FormsModule,
    ReactiveFormsModule,
    NotificacionesComponent
  ],
  templateUrl: './complementar-planta.component.html',
  styleUrl: './complementar-planta.component.scss',
})
export class ComplementarPlantaComponent implements OnInit ,OnChanges {

  @Input() plantaID!: string | null;

  @Input() eliminarPlantaId: string[] = [];
  /**
   * Selección de filas para complementoPlantaDatos
   */
  seleccionadosPlanta: ComplementarPlantaState[] = [];
  /**
   * Selección de filas para complementoDePlantaDatos
   */
  public seleccionados: ComplementoDePlanta[] = [];

  /**
   * Formulario para gestionar la información complementaria de planta.
   * @property {FormGroup} complementarForm
   */
  complementarForm!: FormGroup;
  /**
   * Formulario reactivo para gestionar los datos de complementos de planta.
   * @property {FormGroup} complimentosPlantaForma
   */
  complimentosPlantaForma!: FormGroup;

  /**
  * Constructor de la clase ComplementarPlantaComponent.
  * @param {Location} ubicaccion - Servicio de Angular para manejar la ubicación del navegador.
  */
  constructor(private ubicaccion: Location, private fb: FormBuilder, private complementarStore: ComplementarStore,
    private complementarQuery: ComplementarQuery, private complimentosService: ComplimentosService,) {
    this.complementarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as ComplementarState;
        })
      )
      .subscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
  if (changes['eliminarPlantaId']) {
    const CRT_VL: string[] = changes['eliminarPlantaId'].currentValue;

    if (CRT_VL && CRT_VL.length > 0) {
      this.complementarStore.setEliminarMontosDeInversionPlanta(CRT_VL);
      this.complementarStore.cleanComplementoPlantaDatos();
    }
  }
  if( changes['plantaID'] ){
        this.complementoDePlantaDatos = this.solicitudState.complementoDePlantaDatos.filter(item => item.PLANTA === this.plantaID);
    }
    }
  /**
   * Configuración de la fecha de firma.
   * @property {InputFecha} fetchaDeFirma
   */
  fetchaDeFirma: InputFecha = FECHA_DE_FIRMA;

  /**
   * Configuración de la fecha de fin de vigencia.
   * @property {InputFecha} fetchaDeFinDeVigencia
   */
  fetchaDeFinDeVigencia: InputFecha = FECHA_DE_FIN_DE_VIGENCIA;

  /**
   * Opciones disponibles para mercancía programa.
   * @property {Array} permaneceraMercanciaProgramaOptions
   */
  permaneceraMercanciaProgramaOptions = PERMANCERA_OPTIONS;

  /**
   * Catálogo de tipos de firmante.
   * @property {Array} tipoFirmanteCatalogo
   */
  tipoFirmanteCatalogo:Catalogo[] = [];

  /**
   * Opciones disponibles para documentos.
   * @property {Array} documentoOptions
   */
  documentoOptions:Catalogo[] = [];

  documentoDeRespalodoOptions:Catalogo[] = [];


  /**
   * Tipo de selección para la tabla de complemento de planta.
   * @property {TablaSeleccion} complecomplementoDePlantaTableSelection
   */
  complecomplementoDePlantaTableSelection = TablaSeleccion.CHECKBOX;

  /**
   * Datos para la tabla de complemento de planta.
   */
  complementoPlantaTableSelection = TablaSeleccion.CHECKBOX;
  /**
   * Configuración de encabezados para la tabla de complemento de planta.
   * @property {any} complementoDePlantaEncabezado
   */
  complementoDePlantaEncabezado = COMPLEMENTO_DE_PLANTA;

  /**
   * Estado de la solicitud 221601, que contiene los valores actuales de la solicitud.
   */
  public solicitudState!: ComplementarState;
  /**
   * Formulario reactivo para gestionar los datos de complemento de planta.
   */
  public complementoPlanta = COMPLEMENTO_PLANTA;
  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Datos para la tabla de complemento de planta.
   * @property {Array} complementoDePlantaDatos
   */
  complementoDePlantaDatos: ComplementoDePlanta[] = [];
  /**
   * Datos para la tabla de complemento de planta.
   * @property {Array} complementoPlantaDatos
   */
  complementoPlantaDatos: ComplementarPlantaState[] = [];
  /**
   * Evento que se emite al cerrar el popup.
   * 
   * Se utiliza para notificar al componente padre que el popup ha sido cerrado.
   */
  @Output() cerrarPopup = new EventEmitter<void>();

  /**  
   * Evento de salida que emite una lista de objetos ComplementoDePlanta al componente padre.
   */
  @Output() obtenerComplementarPlantaList: EventEmitter<ComplementoDePlanta[]> = new EventEmitter<ComplementoDePlanta[]>();

  /**  
   * Evento de salida que emite una lista de estados de firmantes hacia el componente padre.
   */
  @Output() obtenerFirmantesList: EventEmitter<ComplementarPlantaState[]> = new EventEmitter<ComplementarPlantaState[]>();

  /**
   * Evento que se emite al cerrar el popup.
   * Se utiliza para notificar al componente padre que el popup ha sido cerrado.
   */
  public exitosamenteNotificacion!: Notificacion;

  /**
    * Notificación para editor de complemento.
   */
  public nuevaNotificacionEditor!: Notificacion;

  /**
   * Notificación para editor de complemento.
   */
  public nuevaNotificacionFirmante!: Notificacion;
  /**
   * Notificación para eliminar complemento.
   */
  public nuevaNotificacionEliminar!: Notificacion;
  /**
  * Índice de la capacidad instalada que se está editando actualmente.
  */
  editingIndex: number | null = null;

  /**
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   * @property {void} inicializarFormulario
   */
  inicializarFormulario(): void {
    this.complementarForm = this.fb.group({
      permanecera: [this.solicitudState.permanecera],
      tipo: [this.solicitudState.tipo, Validators.required],
      descripcionOtro:[this.solicitudState.descripcionOtro,[Validators.required,Validators.maxLength(200)]],
      fechaDeFirma: [this.solicitudState.fechaDeFirma, Validators.required],
      fetchaDeFinDeVigencia: [this.solicitudState.fetchaDeFinDeVigencia, Validators.required],
      documentoRespaldo: [this.solicitudState.documentoRespaldo, Validators.required],
      descripcionOtroComodato: [this.solicitudState.descripcionOtroComodato, Validators.required],
      fechaDeFirmaDocumento: [this.solicitudState.fechaDeFirmaDocumento, Validators.required],
      fechaDeFinDeVigenciaDocumento: [this.solicitudState.fechaDeFinDeVigenciaDocumento, Validators.required],
    });

    this.complimentosPlantaForma = this.fb.group({
      rfcFirmante: [this.solicitudState.rfcFirmante, Validators.required],
      tipoFirmante: [this.solicitudState.tipoFirmante, Validators.required],
    });

  }
  /**
    * Maneja los cambios en el campo "Fecha de Pago".
    * Actualiza el estado del almacén con la fecha de pago proporcionada.  
    */
  cambioFechaFinal(nuevo_valor: string): void {
    this.complementarForm.patchValue({
      fechaDeFirma: nuevo_valor,
    });
    this.complementarStore.setFechaDeFirma(nuevo_valor);
  }
  /**
  * Maneja los cambios en el campo "Fecha de Pago".
  * Actualiza el estado del almacén con la fecha de pago proporcionada.  
  */
  cambioFechaFinale(nuevo_valor: string): void {
    this.complementarForm.patchValue({
      fetchaDeFinDeVigencia: nuevo_valor,
    });
  }
  cambioFechaFin(nuevo_valor: string, campo: string): void {
    this.complementarForm.patchValue({
      [campo]: nuevo_valor,
    });
  }

  private parseDate(VALUE: string | Date): Date {
  if (VALUE instanceof Date) {
    return VALUE;
  }

  const [DAY, MONTH, YEAR] = VALUE.split('/');
  return new Date(Number(YEAR), Number(MONTH) - 1, Number(DAY));
}

fechasVigenciaCondicionalValidator(): boolean {
  const TIPO = this.complementarForm.get('tipo')?.value;

  const FIRMA = this.complementarForm.get('fechaDeFirma')?.value;
  const FIN = this.complementarForm.get('fetchaDeFinDeVigencia')?.value;

  const FIRMA_DOC = this.complementarForm.get('fechaDeFirmaDocumento')?.value;
  const FIN_DOC = this.complementarForm.get('fechaDeFinDeVigenciaDocumento')?.value;

  const HAS_MAIN = Boolean(FIRMA && FIN);
  const HAS_DOC =
    (TIPO === 'TIDCOM.CC' || TIPO === 'TIDCOM.CSA') &&
    Boolean(FIRMA_DOC && FIN_DOC);

const MAIN_INVALID = HAS_MAIN && this.parseDate(FIN) <= this.parseDate(FIRMA);
const DOC_INVALID = HAS_DOC && this.parseDate(FIN_DOC) <= this.parseDate(FIRMA_DOC);

  if (HAS_MAIN && HAS_DOC) {
    return MAIN_INVALID || DOC_INVALID
  }

  if (HAS_MAIN) {
    return MAIN_INVALID;
  }

  if (HAS_DOC) {
    return DOC_INVALID;
  }

  return false;
}


  /**
  * Vuelve a la ubicación anterior en el historial del navegador.
  * @returns {void}
  */
  regrasar(): void {
    if(this.solicitudState.complementoDePlantaDatos.length > 0 && this.solicitudState.complementoPlantaDatos.length === 0){
      this.showErrorMessage('Debe ingresar por lo menos un firmante')
      return;
    }
    this.obtenerComplementarPlantaList.emit(this.complementoDePlantaDatos);
    this.obtenerFirmantesList.emit(this.complementoPlantaDatos);
    this.cerrarPopup.emit();
  }

  tipoDocumentoOnChange(event: Catalogo): void {
    if(event.clave !== 'TIDCOM.OTRO'){
      this.clearFieldValidators(['descripcionOtro']);
    } else {
      this.updateFieldValidators(['descripcionOtro']);
  }
  if(event.clave === 'TIDCOM.CSA' || event.clave === 'TIDCOM.CC'){
      this.updateFieldValidators(['documentoRespaldo','fechaDeFirmaDocumento','fechaDeFinDeVigenciaDocumento']);
    } else {
      this.clearFieldValidators(['documentoRespaldo','descripcionOtroComodato','fechaDeFirmaDocumento','fechaDeFinDeVigenciaDocumento']);
    }
}

tipoDocumentoOnChangeRespaldo(event: Catalogo): void {
    if(event.clave !== 'TIDCOR.OTRO'){
      this.clearFieldValidators(['descripcionOtroComodato']);
    }
    else {
      this.updateFieldValidators(['descripcionOtroComodato']);
    }
  }

  private updateFieldValidators(fields: string[] = []): void {
    // Mark required fields
    fields.forEach(field => {
      const CONTROL = this.complementarForm.get(field);
      if (CONTROL) {
        CONTROL.enable();
        CONTROL.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  private clearFieldValidators(fields: string[] = []): void {
    fields.forEach(field => {
      const CONTROL = this.complementarForm.get(field);
      if (CONTROL) {
        CONTROL.setValue('');
        CONTROL.disable({ emitEvent: false });
        CONTROL.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
  /**
     * Método que se ejecuta cuando el componente es inicializado.
     * 
     * Inicializa el formulario reactivo con los valores actuales de la solicitud.
     */
  ngOnInit(): void {
    this.obtenerTipodocumentoDeRespalodoOptions();
    this.inicializarFormulario();
    
    if (!(this.solicitudState.tipoDocumentoOptions.length)) {
      this.obtenerTipoDocumentoOptions();
    } else {
      this.documentoOptions = [...this.solicitudState.tipoDocumentoOptions];
    }
    if(this.solicitudState.complementoDePlantaDatos.length > 0){
      if(this.plantaID){
        this.complementoDePlantaDatos = this.solicitudState.complementoDePlantaDatos.filter(item => item.PLANTA === this.plantaID);
      this.complementarForm.reset();
    }
  }
    if(this.solicitudState.complementoPlantaDatos.length > 0){
      this.complementoPlantaDatos = [...this.solicitudState.complementoPlantaDatos];
      this.complimentosPlantaForma.reset();
    }
      this.complimentosService
      .obtenerTipoList()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.tipoFirmanteCatalogo = resp.datos;
      });
}

  /** Obtiene y actualiza las opciones del catálogo de tipo de categoría desde el servicio. */
  obtenerTipoDocumentoOptions(): void {
    this.complimentosService.getCatalogoEnumAPI('ENU_TIPO_DOC_COMP')
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((res) => {
        this.complementarStore.setTipoDocumentoOptions(res.datos);
        this.documentoOptions = res.datos;
      });
  }

  obtenerTipodocumentoDeRespalodoOptions(): void {
    this.complimentosService.getCatalogoEnumAPI('ENU_TIPO_DOC_COMP_RESP')
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((res) => {
        this.documentoDeRespalodoOptions = res.datos;
      });
  }

  /**
   * Agrega un nuevo complemento a la lista de datos.
   */
   agregarComplemento(): void {
    if (this.complementarForm.valid) {
      if(this.complementoDePlantaDatos.length > 0 && this.editingIndex === null){
        this.showErrorMessage('Solo puede ingresar un registro de complemento.');
        return;
      }
      if(this.fechasVigenciaCondicionalValidator()===true){
        this.showErrorMessage('La fecha de fin de vigencia no puede ser menor a la fecha de firma.');
        return;
      }
      this.abrirexitosamente();
      const VALORES_FORMULARIO = this.complementarForm.value;
      const TIPO = this.documentoOptions
      ?.find(e => e.clave === this.complementarForm.value.tipo);
      const DOCUMENTO_RESPALDO = this.documentoDeRespalodoOptions?.find(e => e.clave === this.complementarForm.value.documentoRespaldo);
      const NUEVA_FILA: ComplementoDePlanta = {
        PLANTA: this.complimentosService.plantaID || '',
        PERMANECERA_MERCANCIA_PROGRAMA: VALORES_FORMULARIO.permanecera ===1?'SI':'NO',
        TIPO_DOCUMENTO:TIPO?.descripcion || '',
        DESCRIPCION_TIPO_DOCUMENTO: VALORES_FORMULARIO.descripcionOtro || '',
        FECHA_DE_FIRMA: VALORES_FORMULARIO.fechaDeFirma || '',
        FECHA_DE_FIN_DE_VIGENCIA: VALORES_FORMULARIO.fetchaDeFinDeVigencia || '',
        DOCUMENTO_RESPALDO:  DOCUMENTO_RESPALDO?.descripcion || '',
        DESCRIPCION_DOCUMENTO_RESPALDO: VALORES_FORMULARIO.descripcionOtroComodato || '',
        FECHA_DE_FIRMA_DOCUMENTO: VALORES_FORMULARIO.fechaDeFirmaDocumento || '',
        FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO:   VALORES_FORMULARIO.fechaDeFinDeVigenciaDocumento || '',
      };

      if (this.editingIndex !== null && this.editingIndex > -1 && NUEVA_FILA !== null) {
        this.complementoDePlantaDatos[this.editingIndex] = NUEVA_FILA;
        this.complementoDePlantaDatos = [...this.complementoDePlantaDatos];
        this.editingIndex = null;

      } else if (NUEVA_FILA !== null) {
        this.complementoDePlantaDatos = [
          ...this.complementoDePlantaDatos,
          NUEVA_FILA,
        ];
      }
      this.complementarStore.setComplementoDePlantaDatos(NUEVA_FILA);

      this.seleccionados = [];
      this.complementarForm.reset();
    } else {
      this.showErrorMessage('Debe capturar todos los datos marcados como obligatorios(*)');
    }
  }
  /**
   * Agrega un nuevo firmante a la lista de datos.
   */
  agregarFirmante(): void {
    if (this.complimentosPlantaForma.valid) {
      const VALORES_FORMULARIO = this.complimentosPlantaForma.value;
      if(VALORES_FORMULARIO.rfcFirmante.length < 13){
        this.showErrorMessage('El RFC debe tener 13 caracteres de longitud');
        return;
      }
      const TIPO = this.tipoFirmanteCatalogo.find(e => e.clave === VALORES_FORMULARIO.tipoFirmante);
      if(this.complementoPlantaDatos.some(firmante => firmante.rfcFirmante === VALORES_FORMULARIO.rfcFirmante && firmante.tipoFirmante === TIPO?.descripcion)){
        this.showErrorMessage('El registro se encuentra previamente registrado.');
        return;
      }
      this.complimentosService.obtenerRazonSocial(VALORES_FORMULARIO.rfcFirmante).subscribe({
        next: (razonSocial) => {
          const NOMBRE_RAZON = razonSocial.datos || '';
          const NUEVO_FIRMANTE: ComplementarPlantaState = {
            rfcFirmante: VALORES_FORMULARIO.rfcFirmante || '',
            nombreRazonFirmante: NOMBRE_RAZON.razon_social || '',
            tipoFirmante: TIPO?.descripcion || '',
          };

          this.complementoPlantaDatos = [...this.complementoPlantaDatos, NUEVO_FIRMANTE];
          this.complementarStore.setComplementoPlantaDatos(this.complementoPlantaDatos);
          this.complimentosPlantaForma.reset();
        },
        error: () => {
          this.showErrorMessage('El RFC no se encontró, favor de verificarlo');
        },
      });
    }
    else{
      this.showErrorMessage('El RFC y el tipo de firmante son requeridos');
    }
  }

  /**
   * Muestra una notificación de éxito al usuario.
   * La notificación indica que la operación se realizó exitosamente.
   */
  abrirexitosamente(): void {
    this.exitosamenteNotificacion = {
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

  /**
   * Muestra una notificación de error al usuario.
   * @param message - Mensaje de error a mostrar en la notificación.
   */
  showErrorMessage(message: string): void {
    this.exitosamenteNotificacion = {
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
   * Limpia el formulario.
   */
  limpiar(): void {
    this.complementarForm.reset();
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
   * Maneja la selección de filas en la tabla de complemento de planta.
   * @param event - Evento que contiene la lista de filas seleccionadas en la tabla.
   */
  onSeleccionChange(event: ComplementoDePlanta[]): void {
    this.seleccionados = event;
  }
  /**
   * Elimina los complementos seleccionados de la lista de datos.
   * @param event - Evento que contiene la lista de filas seleccionadas en la tabla.
   */
  eliminarComplemento(): void {
    if (this.seleccionados.length > 0) {
      this.mostrarNotificacionEliminar();
      this.complementarStore.removeComplementoDePlantaDatos(this.seleccionados);
      this.seleccionados = [];
    }
    else {
      this.mostrarNotificacionEliminar();
    }
  }

  /**
   * Muestra una notificación de advertencia al usuario cuando intenta eliminar sin seleccionar un registro.
   */
  mostrarNotificacionEliminar(): void {
    this.nuevaNotificacionEliminar = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: this.seleccionados.length > 0 ? 'El registro fue eliminado correctamente.' : 'Debe elegir al menos un registro de complemento para eliminar',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  /**
   * Edita el complemento seleccionado en la lista de datos.
   * Permite modificar los campos del complemento seleccionado.
   */
  editarComplemento(): void {
    if (this.seleccionados?.length === 1) {
      const SELECTED = this.seleccionados[0];
      const TIPO = this.documentoOptions
      ?.find(e => e.descripcion === SELECTED.TIPO_DOCUMENTO);
      const VALOR_PERMANECERA = SELECTED.PERMANECERA_MERCANCIA_PROGRAMA === 'SI' ? 1 : 2;
      const DOCUMENTO_RESPALDO=this.documentoDeRespalodoOptions
      ?.find(e => e.descripcion === SELECTED.DOCUMENTO_RESPALDO);
      this.complementarForm.patchValue({
        permanecera: VALOR_PERMANECERA,
        tipo: TIPO?.clave,
        descripcionOtro: SELECTED.DESCRIPCION_TIPO_DOCUMENTO,
        fechaDeFirma: SELECTED.FECHA_DE_FIRMA,
        fetchaDeFinDeVigencia: SELECTED.FECHA_DE_FIN_DE_VIGENCIA,
        documentoRespaldo: DOCUMENTO_RESPALDO?.clave,
        descripcionOtroComodato: SELECTED.DESCRIPCION_DOCUMENTO_RESPALDO,
        fechaDeFirmaDocumento: SELECTED.FECHA_DE_FIRMA_DOCUMENTO,
        fechaDeFinDeVigenciaDocumento: SELECTED.FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO,
      });

      setTimeout(() => {
        const NATIVE_EL = document.querySelector(
          'app-catalogo-select[formControlName="permanecera"] select'
        ) as HTMLElement | null;
        if (NATIVE_EL) {
          NATIVE_EL.focus();
        }
      }, 0);
      this.editingIndex = this.complementoDePlantaDatos.findIndex(row => row === SELECTED);
    }
    else if (!this.seleccionados || this.seleccionados.length === 0) {
      this.nuevaNotificacionEditor = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe elegir al menos un registro de complemento para eliminar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Maneja la selección de filas en la tabla de complemento de planta.
   * @param event - Evento que contiene la lista de filas seleccionadas en la tabla.
   */
  onSeleccionPlantaChange(event: ComplementarPlantaState[]): void {
    this.seleccionadosPlanta = event;
  }

  /**
   * Elimina los complementos seleccionados de la lista de datos.
   * @param event - Evento que contiene la lista de filas seleccionadas en la tabla.
   */
  eliminarComplementoPlanta(): void {
    if (this.seleccionadosPlanta.length > 0) {
      this.complementoPlantaDatos = this.complementoPlantaDatos.filter(
        row => !this.seleccionadosPlanta.some(sel =>
          sel.rfcFirmante === row.rfcFirmante && sel.tipoFirmante === row.tipoFirmante
        )
      );
      this.complementarStore.setComplementoPlantaDatos(this.complementoPlantaDatos);
      this.seleccionadosPlanta = [];
    }
    else{
       this.nuevaNotificacionFirmante = {
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

}


