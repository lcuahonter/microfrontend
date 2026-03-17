/**
 * Componente utilizado para la gestión del formulario de unidad de arrastre en el trámite correspondiente.
 *
 * Este archivo contiene la lógica para inicializar, limpiar, validar y guardar los datos de la unidad de arrastre,
 * así como la gestión de catálogos y notificaciones asociadas al formulario.
 *
 * El componente permite la edición y creación de unidades, controlando el estado de los campos y la interacción con el usuario.
 *
 * @component
 * @class
 * @implements {OnInit}
 */

import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import { Catalogo, CatalogoSelectComponent, CategoriaMensaje, Notificacion, TipoNotificacionEnum } from '@libs/shared/data-access-user/src';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { CatalogoLista, DatosUnidad } from '../../../../models/registro-muestras-mercancias.model';
import { modificarTerrestreService} from '../../../services/modificacar-terrestre.service';

import { Subject, firstValueFrom, takeUntil } from 'rxjs';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';

// Usar interfaces importadas para consistencia de tipos
type CatalogoItem = Catalogo;
type UnidadData = DatosUnidad;

@Component({
  selector: 'app-unidad-dialog',
  templateUrl: './unidad-dialog.component.html',
  styleUrls: ['./unidad-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CatalogoSelectComponent, TooltipModule],
})
export class UnidadDialogComponent implements OnInit, OnDestroy {
  /**
   * Datos de la unidad a editar o visualizar.
   * @type {UnidadData}
   * @public
   */
  @Input() unidad: UnidadData | null = null;
  /**
   * Listado de unidades existentes para calcular el siguiente identificador.
   * @type {UnidadData[]}
   * @public
   */
  @Input() unidades: UnidadData[] = [];
  /**
   * Indica si el formulario es de solo lectura.
   * @type {boolean}
   * @public
   */
  @Input() readonly = false;
  /**
   * Catálogo de tipos de unidad disponibles.
   * @type {CatalogoItem[]}
   * @public
   */
  @Input() tipoDeUnidadCatalogo: CatalogoItem[] = [];
  /**
   * Catálogo de países emisores disponibles.
   * @type {CatalogoItem[]}
   * @public
   */
  @Input() paisEmisorCatalogo: CatalogoItem[] = [];
  /**
   * Catálogo de años disponibles.
   * @type {CatalogoItem[]}
   * @public
   */
  @Input() anoCatalogo: CatalogoItem[] = [];
  /**
   * Catálogo de tipos de arrastre disponibles.
   * @type {CatalogoItem[]}
   * @public
   */
  @Input() tipoArrastre: CatalogoItem[] = [];

  /**
   * Contexto en el que se utiliza el diálogo (alta, modificación o baja).
   * @type {('alta' | 'modificacion' | 'baja')}
   */
  @Input() contexto: 'alta' | 'modificacion' | 'baja' = 'alta';
  /**
   * Evento emitido al guardar los datos de la unidad.
   * @event
   */
  @Output() guardar = new EventEmitter<UnidadData>();
  /**
   * Evento emitido al cancelar la operación o cerrar el modal.
   * @event
   */
  @Output() cancelar = new EventEmitter<void>();

  /**
   * Formulario reactivo que contiene los controles de la unidad.
   * @type {FormGroup}
   * @public
   */
  unidadForm!: FormGroup;
  /**
   * Indica si se debe mostrar la notificación.
   * @type {boolean}
   * @public
   */
  showNotification: boolean = false;
  /**
   * Objeto de notificación para mostrar mensajes al usuario.
   * @type {Notificacion}
   * @public
   */
  alertaNotificacion!: Notificacion;

  /**
   * Referencia al template del modal de la unidad.
   * @type {TemplateRef<unknown>}
   * @public
   */
  @ViewChild('unidadDialogModal') unidadDialogModal!: TemplateRef<unknown>;
  /**
   * Referencia al modal abierto (si se utiliza una librería de modales).
   * @type {any}
   * @public
   */
  modalRef?: unknown; // Reemplazar con BsModalRef si se usa ngx-bootstrap
/**
   * Catálogo de colores de vehículos disponibles.
   * @type {Catalogo[]}
   */
  colorVehiculoCatalogo: Catalogo[] = [];
  /**
   * Subject utilizado para destruir las suscripciones al destruir el componente.
   * @type {Subject<void>}
   * @public
   */
  public destroyNotifier$: Subject<void> = new Subject();
  /**
   * Constructor del componente. Inicializa el FormBuilder y el servicio de modificación terrestre.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {modificarTerrestreService} modificarTerrestreService - Servicio para obtener catálogos.
   */
  constructor(private fb: FormBuilder, private modificarTerrestreService: modificarTerrestreService,private NOTIF:NotificacionesService) { }

  /**
   * Busca una unidad de arrastre utilizando los parámetros del formulario.
   * Llama al servicio y actualiza el formulario con los datos recibidos.
   * @returns {Promise<void>}
   */
  async buscarUnidad(): Promise<void> {
    const VIN = this.unidadForm.get('numero')?.value;
    const PLACAS = this.unidadForm.get('numeroPlaca')?.value;
    const IDVEHICOLO = this.unidadForm.get('idDeUnidad')?.value;

    if (!VIN) {
      return;
    }

    const ISEXISTENCE = this.contexto === 'modificacion' || this.contexto === 'baja';
    const PARAM = { VIN, PLACAS, IDVEHICOLO };

    try {
      const API_RESPONSE = await firstValueFrom(
        this.modificarTerrestreService.buscarUnidadArrastre(PARAM, ISEXISTENCE)
      );

       if (API_RESPONSE.codigo !== '00' ) {
      
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: API_RESPONSE.mensaje ? API_RESPONSE.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      
        return;
      }

      const DATOS_API = API_RESPONSE.datos;
      
      // Extrae las claves de los catálogos de la respuesta de la API para poblar el formulario.
      // Los campos 'tipo_unidad_arrastre', 'anio', 'marca', 'modelo', 'transponder' no están presentes en la respuesta de la API para unidad de arrastre.
      // Por lo tanto, se omiten o se inicializan con valores predeterminados si es necesario.
      const PAIS_EMISOR_ID = this.paisEmisorCatalogo.find(c => c.clave === DATOS_API.pais_emisor)?.clave || '';
      const COLOR_UNIDAD_ID = this.tipoArrastre.find(c => c.clave === String(DATOS_API.color_vehiculo_arrastre))?.clave || '';
      const PAIS_EMISOR_2DA_PLACA_ID = this.paisEmisorCatalogo.find(c => c.clave === DATOS_API.pais_emisor_2da_placa)?.clave || '';
   const ANO_ID = this.anoCatalogo.find(c => c.id === Number(DATOS_API.anio))?.id|| '';
      const DATOSPARAFORMULARIO = {
        numero: DATOS_API.numero_identificacion_vehicular,
        tipoDeUnidad: DATOS_API.tipo_vehiculo,
        idDeUnidad: DATOS_API.id_vehiculo_arrastre,
        numeroPlaca: DATOS_API.numero_placas,
        paisEmisor: PAIS_EMISOR_ID,
        estado: DATOS_API.estado_provincia,
        marca: DATOS_API.marca, 
        modelo: DATOS_API.modelo, // No disponible en la API para unidad de arrastre
        ano: ANO_ID, // No disponible en la API para unidad de arrastre
        transponder: DATOS_API.transponder, // No disponible en la API para unidad de arrastre
        colorUnidad: COLOR_UNIDAD_ID,
        numeroEconomico: DATOS_API.numero_economico,
        numero2daPlaca: DATOS_API.numero_2da_placa,
        estado2daPlaca: DATOS_API.estado_emisor_2da_placa,
        paisEmisor2daPlaca: PAIS_EMISOR_2DA_PLACA_ID,
        descripcion: DATOS_API.descripcion_unidad_arrastre
      };

      this.unidadForm.patchValue(DATOSPARAFORMULARIO);

    }catch(Error){
     //manejo de error
    }
  }

  /**
   * Inicializa el formulario y carga los catálogos necesarios.
   * Si se está editando una unidad, carga sus datos en el formulario.
   */
  ngOnInit(): void {
    // Restablecer estado de notificación
    this.showNotification = false;
    this.loadCatalogData();
    this.initializeForm();
    this.setupFormValueSubscriptions();
  }

  /**
   * Carga los datos de catálogos si no están disponibles
   */
  private loadCatalogData(): void {
    if (!this.tipoDeUnidadCatalogo || this.tipoDeUnidadCatalogo.length === 0) {
      this.modificarTerrestreService.obtenerTipoArrastre()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((datos: { datos: CatalogoItem[] }) => {
          this.tipoDeUnidadCatalogo = datos.datos;
        });
    }
    // Carga el catálogo de colores de unidad utilizando el servicio de modificación terrestre.
    // Se utiliza obtenerColorVehiculo() ya que tipoArrastre en el HTML se usa para el color de la unidad.
    if (!this.tipoArrastre || this.tipoArrastre.length === 0) {
      this.modificarTerrestreService.obtenerColorVehiculo()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((datos: { datos: CatalogoItem[] }) => {
          this.tipoArrastre = datos.datos;
        });
    }
    if (!this.anoCatalogo || this.anoCatalogo.length === 0) {
      this.modificarTerrestreService.obtenerAno()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((datos: { datos: CatalogoItem[] }) => {
          this.anoCatalogo = datos.datos;
        });
    }
    if (!this.paisEmisorCatalogo || this.paisEmisorCatalogo.length === 0) {
      this.modificarTerrestreService.obtenerPaisEmisor()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((datos: { datos: CatalogoItem[] }) => {
          this.paisEmisorCatalogo = datos.datos;
        });
    }
      this.modificarTerrestreService.obtenerColorVehiculo()
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe((datos: CatalogoLista) => {
              this.colorVehiculoCatalogo = datos.datos as Catalogo[];
            });
  }

  /**
   * Inicializa el formulario con datos de la unidad
   */
  private initializeForm(): void {
    // Calcular lógica de próximo ID (si no se está editando)
    let siguienteId = 1;
    if (Array.isArray(this.unidades) && this.unidades.length > 0) {
      const ID_MAXIMO = Math.max(...this.unidades.map(u => Number(u['idDeUnidad' as keyof UnidadData]) || 0));
      siguienteId = ID_MAXIMO + 1;
    }
    const ES_EDICION = Boolean(this.unidad && this.unidad['idDeUnidad' as keyof UnidadData]);
    this.unidadForm = this.fb.group({
      numero: [this.unidad?.['numero' as keyof UnidadData] || '', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      tipoDeUnidad: [this.unidad?.['tipoDeUnidad' as keyof UnidadData] || '', Validators.required],
      idDeUnidad: [{ value: ES_EDICION ? this.unidad?.['idDeUnidad' as keyof UnidadData] : siguienteId, disabled: true }, Validators.required],
      numeroPlaca: [this.unidad?.['numeroPlaca' as keyof UnidadData] || '', [Validators.required, Validators.maxLength(10)]],
      paisEmisor: [this.unidad?.['paisEmisor' as keyof UnidadData] || '', Validators.required],
      estado: [this.unidad?.['estado' as keyof UnidadData] || '', Validators.required],
      marca: [this.unidad?.['marca' as keyof UnidadData] || '', [Validators.required, Validators.maxLength(50)]],
      modelo: [this.unidad?.['modelo' as keyof UnidadData] || '', [Validators.required, Validators.maxLength(50)]],
      ano: [this.unidad?.['ano' as keyof UnidadData] || '', Validators.required],
      transponder: [this.unidad?.['transponder' as keyof UnidadData] || '', [Validators.required, Validators.maxLength(50)]],
      colorUnidad: [this.unidad?.['colorUnidad' as keyof UnidadData] || '', Validators.required],
      numeroEconomico: [this.unidad?.['numeroEconomico' as keyof UnidadData] || '', [Validators.required, Validators.maxLength(50)]],
      numero2daPlaca: [this.unidad?.['numero2daPlaca' as keyof UnidadData] || '', Validators.maxLength(20)],
      estado2daPlaca: [this.unidad?.['estado2daPlaca' as keyof UnidadData] || '', Validators.maxLength(50)],
      paisEmisor2daPlaca: [this.unidad?.['paisEmisor2daPlaca' as keyof UnidadData] || ''],
      descripcion: [this.unidad?.['descripcion' as keyof UnidadData] || '', Validators.maxLength(200)]
    });
  }

  /**
   * Configura las suscripciones de cambio de valor del formulario con temporización mejorada y manejo de errores
   */
  private setupFormValueSubscriptions(): void {
    // Inicialmente deshabilitar campo descripción
    this.unidadForm.get('descripcion')?.disable();
    
    // Configurar suscripción con takeUntil para limpieza adecuada
    this.unidadForm.get('tipoDeUnidad')?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((selectedValue) => {
        const IDENTIFICADOR = Number(selectedValue);
        const DESCRIPCION_CONTROL = this.unidadForm.get('descripcion');
        
        if (IDENTIFICADOR === 70) { 
          DESCRIPCION_CONTROL?.enable();
        } else {
          DESCRIPCION_CONTROL?.disable();
          DESCRIPCION_CONTROL?.setValue(''); // Limpiar valor cuando esté deshabilitado
        }
      });
    
    // También verificar valor inicial en caso de que el formulario esté pre-poblado
    setTimeout(() => {
      const VALOR_ACTUAL = this.unidadForm.get('tipoDeUnidad')?.value;
      if (VALOR_ACTUAL) {
        const IDENTIFICADOR = Number(VALOR_ACTUAL);
        const DESCRIPCION_CONTROL = this.unidadForm.get('descripcion');
        
        if (IDENTIFICADOR === 70) {
          DESCRIPCION_CONTROL?.enable();
        } else {
          DESCRIPCION_CONTROL?.disable();
        }
      }
    }, 100);
  }

  /**
   * Abre el modal de la unidad.
   * (Implementar lógica de apertura si es necesario)
   */
  static abiertoModal(): void {
    // Este método debería abrir el diálogo modal.
  }

  /**
   * Cierra el modal y emite el evento de cancelación.
   */
  cerrarModal(): void {
    this.showNotification = false;
    this.cancelar.emit();
  }

  /**
   * Limpia los datos del formulario de unidad, manteniendo el idDeUnidad y deshabilitando los campos necesarios.
   */
  limpiarDatosUnidad(): void {
    if (!this.unidadForm) {return;}
    
    // Limpiar notificaciones
    this.showNotification = false;
    
    const VALOR_ID = this.unidadForm.get('idDeUnidad')?.value;
    this.unidadForm.reset();
    this.unidadForm.get('idDeUnidad')?.setValue(VALOR_ID);
    this.unidadForm.get('idDeUnidad')?.disable();
    this.unidadForm.get('descripcion')?.disable();
  }

  /**
   * Guarda los datos del formulario de unidad si es válido.
   * Si el formulario es inválido, muestra una notificación de alerta.
   */
  guardarDatosUnidad(): void {
    this.unidadForm.markAllAsTouched();
    this.unidadForm.updateValueAndValidity();
  

    // Verificación detallada de validación de campos
    Object.keys(this.unidadForm.controls).forEach(key => {
      const CONTROL_FORMULARIO = this.unidadForm.get(key);
      if (CONTROL_FORMULARIO && CONTROL_FORMULARIO.invalid) {
          // Log para depuración
      }
    });
    if (this.unidadForm.valid) {
      this.showNotification = false; // Limpiar notificaciones previas
      const DATOS_BRUTOS = this.unidadForm.getRawValue();
      // Transforma los datos del formulario para enviar solo las claves de los catálogos.
      const DATOS_UNIDAD = {
        ...DATOS_BRUTOS,
        tipoDeUnidadArrastre: DATOS_BRUTOS.tipoDeUnidad, // Mantener para compatibilidad si es necesario
        vinVehiculo: DATOS_BRUTOS.numero,
        idDeUnidad: DATOS_BRUTOS.idDeUnidad,
        tipoDeUnidad: this.tipoDeUnidadCatalogo.find(c => c.clave === DATOS_BRUTOS.tipoDeUnidad)?.clave || '',
        paisEmisor: this.paisEmisorCatalogo.find(c => c.clave === DATOS_BRUTOS.paisEmisor)?.clave || '',
        ano: this.anoCatalogo.find(c => c.clave === DATOS_BRUTOS.ano)?.clave || '',
        colorVehiculo: this.colorVehiculoCatalogo.find(c => c.clave === DATOS_BRUTOS.colorUnidad)?.clave || '',
        paisEmisor2daPlaca: this.paisEmisorCatalogo.find(c => c.clave === DATOS_BRUTOS.paisEmisor2daPlaca)?.clave || ''
      };
      this.guardar.emit(DATOS_UNIDAD);
      // Cerrar modal después de guardar exitosamente
      this.cancelar.emit();
    } else {
      this.alertaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.INFORMACION,
        modo: 'action',
        titulo: 'Alerta',
        mensaje: 'Formulario inválido, por favor verifica los campos.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.showNotification = true;
    }
  }

  /**
   * Verifica si un control del formulario es inválido y ha sido tocado.
   * @param controlName Nombre del control a verificar
   * @returns true si el control es inválido y tocado, de lo contrario null
   */
  isInvalid(controlName: string): boolean | null {
    const CONTROL_FORMULARIO = this.unidadForm.get(controlName);
    return CONTROL_FORMULARIO ? CONTROL_FORMULARIO.invalid && CONTROL_FORMULARIO.touched : null;
  }

  /**
   * Devuelve los controles actuales del formulario de unidad.
   */
  get getFormValues(): { [key: string]: AbstractControl } {
    return this.unidadForm.controls;
  }

  /**
   * Gancho del ciclo de vida que se llama cuando se destruye el componente.
   * Se utiliza para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
