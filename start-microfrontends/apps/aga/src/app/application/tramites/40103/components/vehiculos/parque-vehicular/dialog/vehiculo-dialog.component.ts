/**
 * Componente de diálogo para la gestión de vehículos en el trámite 40103.
 *
 * Permite crear, editar y validar la información de un vehículo, así como mostrar notificaciones y manejar catálogos relacionados.
 *
 * @module VehiculoDialogComponent
 */
import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Catalogo, CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { DatosVehiculo } from '../../../../models/registro-muestras-mercancias.model';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { modificarTerrestreService } from '../../../services/modificacar-terrestre.service';

type CatalogoItem = Catalogo;
type VehiculoData = DatosVehiculo;
@Component({
  selector: 'app-vehiculo-dialog',
  templateUrl: './vehiculo-dialog.component.html',
  styleUrls: ['./vehiculo-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CatalogoSelectComponent, TooltipModule],
})
/**
 * Componente de diálogo para agregar o editar información de vehículos.
 *
 * @class
 * @implements {OnInit}
 * @implements {OnChanges}
 */
export class VehiculoDialogComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Vehículo a editar (si aplica).
   * @type {VehiculoData}
   * @memberof VehiculoDialogComponent
   */
  @Input() vehiculo: VehiculoData | null = null;

  /**
   * Lista de vehículos existentes.
   * @type {VehiculoData[]}
   */
  @Input() vehiculos: VehiculoData[] = [];

  /**
   * Indica si el formulario es de solo lectura.
   * @type {boolean}
   */
  @Input() readonly = false;

  /**
   * Catálogo de tipos de vehículo.
   * @type {CatalogoItem[]}
   */
  @Input() tipoDeVehiculoCatalogo: CatalogoItem[] = [];

  /**
   * Catálogo de países emisores.
   * @type {CatalogoItem[]}
   */
  @Input() paisEmisorCatalogo: CatalogoItem[] = [];

  /**
   * Catálogo de años.
   * @type {CatalogoItem[]}
   */
  @Input() anoCatalogo: CatalogoItem[] = [];

  /**
   * Catálogo de tipos de arrastre.
   * @type {CatalogoItem[]}
   */
  @Input() tipoArrastre: CatalogoItem[] = [];

  /**
   * Catálogo de colores de vehículos.
   * @type {CatalogoItem[]}
   */
  @Input() colorVehiculoCatalogo: CatalogoItem[] = [];

  /**
   * Contexto en el que se utiliza el diálogo (alta, modificación o baja).
   * @type {('alta' | 'modificacion' | 'baja')}
   */
  @Input() contexto: 'alta' | 'modificacion' | 'baja' = 'alta';

  /**
   * Evento emitido al guardar el vehículo.
   * @type {EventEmitter<VehiculoData>}
   */
  @Output() save = new EventEmitter<VehiculoData>();

  /**
   * Evento emitido al cancelar la operación.
   * @type {EventEmitter<void>}
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * Formulario reactivo para el vehículo.
   * @type {FormGroup}
   */
  vehiculoForm!: FormGroup;

  /**
   * Referencia a la plantilla del modal.
   * @type {TemplateRef<unknown>}
   */
  @ViewChild('vehiculoDialogModal') vehiculoDialogModal!: TemplateRef<unknown>;

  /**
   * Referencia al modal (si se usa un servicio de modal).
   * @type {unknown}
   */
  modalRef?: unknown; 

  /**
   * Notificador para destruir suscripciones.
   * @type {Subject<void>}
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param {FormBuilder} fb
   * @param {modificarTerrestreService} modificarTerrestreService
   */
  constructor(private fb: FormBuilder, private modificarTerrestreService: modificarTerrestreService,private NOTIF:NotificacionesService) {}

  /**
   * Busca un vehículo del parque vehicular utilizando los parámetros del formulario.
   * Llama al servicio y actualiza el formulario con los datos recibidos.
   * @returns {Promise<void>}
   */
  async buscarVehiculo(): Promise<void> {
    const VIN = this.vehiculoForm.get('numero')?.value;
    const PLACAS = this.vehiculoForm.get('numeroPlaca')?.value;

    if (!VIN) {
      return;
    }

    const PARAMS = { VIN, PLACAS };

    try {
      const API_RESPONSE = await firstValueFrom(
        this.modificarTerrestreService.buscarParqueVehicular(PARAMS)
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
      
      // Mapping API data to form controls
      // Mapping API data (claves) to catalog IDs for the form
      const TIPO_DE_VEHICULO_ID = this.tipoDeVehiculoCatalogo.find(c => c.clave === DATOS_API.tipo_vehiculo)?.clave || '';
const PAIS_EMISOR_ID = this.paisEmisorCatalogo.find(c => c.clave === DATOS_API.pais_emisor)?.clave || '';
const ANO_ID = this.anoCatalogo.find(c => c.id === Number(DATOS_API.anio))?.id || '';
const COLOR_VEHICULO_ID = this.colorVehiculoCatalogo.find(c => c.clave === String(DATOS_API.color_vehiculo))?.clave || '';
const PAIS_EMISOR_2DA_PLACA_ID = this.paisEmisorCatalogo.find(c => c.clave === DATOS_API.pais_emisor_2da_placa)?.clave || '';

      const DATOSPARAFORMULARIO = {
        numero: DATOS_API.numero_identificacion_vehicular,
        tipoDeVehiculo: TIPO_DE_VEHICULO_ID,
        idDeVehiculo: DATOS_API.id_vehiculo,
        numeroPlaca: DATOS_API.numero_placas,
        paisEmisor: PAIS_EMISOR_ID,
        estado: DATOS_API.estado_provincia,
        marca: DATOS_API.marca,
        modelo: DATOS_API.modelo,
        ano: ANO_ID,
        transponder: DATOS_API.transponder,
        colorVehiculo: COLOR_VEHICULO_ID,
        numeroEconomico: DATOS_API.numero_economico,
        numero2daPlaca: DATOS_API.numero_2da_placa,
        estado2daPlaca: DATOS_API.estado_emisor_2da_placa,
        paisEmisor2daPlaca: PAIS_EMISOR_2DA_PLACA_ID,
        descripcion: DATOS_API.descripcion_vehiculo
      };

      this.vehiculoForm.patchValue(DATOSPARAFORMULARIO);

    } catch (error) {
      // Manejo de errores (si es necesario)
    }
  }

  /**
   * Detecta cambios en las propiedades de entrada y actualiza el formulario.
   * @param {SimpleChanges} changes - Cambios detectados en las propiedades.
   * @returns {void}
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Si la lista de vehículos cambia, recalcular el ID siguiente
    if (changes['vehiculos'] && this.vehiculoForm) {
      this.actualizarIdSiguiente();
    }
  }

  /**
   * Inicializa el componente, catálogos y formulario.
   * @returns {void}
   */
  async ngOnInit(): Promise<void> {
    await this.loadCatalogData();
    this.initializeForm();
    this.setupFormValueSubscriptions();
  }

  /**
   * Carga los datos de catálogos si no están disponibles
   */
  private async loadCatalogData(): Promise<void> {
    if (!this.tipoDeVehiculoCatalogo || this.tipoDeVehiculoCatalogo.length === 0) {
      const DATOS = await firstValueFrom(this.modificarTerrestreService.obtenerTipoDeVehiculo().pipe(takeUntil(this.destroyNotifier$)));
      this.tipoDeVehiculoCatalogo = DATOS.datos;
    }
    if (!this.tipoArrastre || this.tipoArrastre.length === 0) {
        const DATOS = await firstValueFrom(this.modificarTerrestreService.obtenerTipoArrastre().pipe(takeUntil(this.destroyNotifier$)));
        this.tipoArrastre = DATOS.datos;
    }
    if (!this.anoCatalogo || this.anoCatalogo.length === 0) {
        const DATOS = await firstValueFrom(this.modificarTerrestreService.obtenerAno().pipe(takeUntil(this.destroyNotifier$)));
        this.anoCatalogo = DATOS.datos;
    }
    if (!this.paisEmisorCatalogo || this.paisEmisorCatalogo.length === 0) {
        const DATOS = await firstValueFrom(this.modificarTerrestreService.obtenerPaisEmisor().pipe(takeUntil(this.destroyNotifier$)));
        this.paisEmisorCatalogo = DATOS.datos;
    }
  }

 /**
 * Inicializa el formulario con datos del vehículo
 */
private initializeForm(): void {
  let SIGUIENTE_ID = 1;

  if (Array.isArray(this.vehiculos) && this.vehiculos.length > 0) {
    const ID_MAXIMO = Math.max(
      ...this.vehiculos.map(v => Number(v['idDeVehiculo' as keyof VehiculoData]) || 0)
    );
    SIGUIENTE_ID = ID_MAXIMO + 1;
  }

  const ES_EDICION = Boolean(
    this.vehiculo && this.vehiculo['idDeVehiculo' as keyof VehiculoData]
  );

  // Obtiene los IDs mapeados
  const {
    TIPO_DE_VEHICULO_ID,
    PAIS_EMISOR_ID,
    ANO_ID,
    COLOR_VEHICULO_ID,
    PAIS_EMISOR_2DA_PLACA_ID
  } = this.OBTENER_IDS_VEHICULO();

  this.vehiculoForm = this.fb.group({
    numero: [this.vehiculo?.['numero' as keyof VehiculoData] || '', [Validators.required, Validators.maxLength(20)]],
    tipoDeVehiculo: [TIPO_DE_VEHICULO_ID, Validators.required],
    idDeVehiculo: [{ value: ES_EDICION ? this.vehiculo?.['idDeVehiculo' as keyof VehiculoData] : SIGUIENTE_ID, disabled: true }, Validators.required],
    numeroPlaca: [this.vehiculo?.['numeroPlaca' as keyof VehiculoData] || '', Validators.required],
    paisEmisor: [PAIS_EMISOR_ID, Validators.required],
    estado: [this.vehiculo?.['estado' as keyof VehiculoData] || '', Validators.required],
    marca: [this.vehiculo?.['marca' as keyof VehiculoData] || '', Validators.required],
    modelo: [this.vehiculo?.['modelo' as keyof VehiculoData] || '', Validators.required],
    ano: [ANO_ID, Validators.required],
    transponder: [this.vehiculo?.['transponder' as keyof VehiculoData] || '', Validators.required],
    colorVehiculo: [COLOR_VEHICULO_ID, Validators.required],
    numeroEconomico: [this.vehiculo?.['numeroEconomico' as keyof VehiculoData] || '', Validators.required],
    numero2daPlaca: [this.vehiculo?.['numero2daPlaca' as keyof VehiculoData] || ''],
    estado2daPlaca: [this.vehiculo?.['estado2daPlaca' as keyof VehiculoData] || ''],
    paisEmisor2daPlaca: [PAIS_EMISOR_2DA_PLACA_ID || ''],
    descripcion: [this.vehiculo?.['descripcion' as keyof VehiculoData] || '', Validators.maxLength(120)]
  });
}

/**
 * Mapea las claves a sus IDs correspondientes para el formulario
 */
private OBTENER_IDS_VEHICULO():{ TIPO_DE_VEHICULO_ID: string | number;
  PAIS_EMISOR_ID: string | number;
  ANO_ID: string | number;
  COLOR_VEHICULO_ID: string | number;
  PAIS_EMISOR_2DA_PLACA_ID: string | number;} {
  return {
    TIPO_DE_VEHICULO_ID: this.tipoDeVehiculoCatalogo.find(c => c.clave === this.vehiculo?.tipoDeVehiculo)?.id || '',
    PAIS_EMISOR_ID: this.paisEmisorCatalogo.find(c => c.clave === this.vehiculo?.paisEmisor)?.id || '',
    ANO_ID: this.anoCatalogo.find(c => c.clave === this.vehiculo?.ano)?.id || '',
    COLOR_VEHICULO_ID: this.colorVehiculoCatalogo.find(c => c.clave === this.vehiculo?.colorVehiculo)?.id || '',
    PAIS_EMISOR_2DA_PLACA_ID: this.paisEmisorCatalogo.find(c => c.clave === this.vehiculo?.paisEmisor2daPlaca)?.id || ''
  };
}


  /**
   * Actualiza el ID siguiente en el formulario cuando cambia la lista de vehículos.
   * @returns {void}
   */
  private actualizarIdSiguiente(): void {
    if (!this.vehiculoForm) {
      return;
    }
    
    // Solo actualizar si no es un modo de edición
    const ES_EDICION = Boolean(this.vehiculo && this.vehiculo['idDeVehiculo' as keyof VehiculoData]);
    if (ES_EDICION) {
      return;
    }
    
    let siguienteId = 1;
    if (Array.isArray(this.vehiculos) && this.vehiculos.length > 0) {
      const ID_MAXIMO = Math.max(...this.vehiculos.map(v => Number(v['idDeVehiculo' as keyof VehiculoData]) || 0));
      siguienteId = ID_MAXIMO + 1;
    }
    
    // Actualizar el valor del campo idDeVehiculo en el formulario
    const CONTROL_ID = this.vehiculoForm.get('idDeVehiculo');
    if (CONTROL_ID) {
      CONTROL_ID.setValue(siguienteId);
    }
  }

  /**
   * Configura las suscripciones de cambio de valor del formulario con temporización mejorada y manejo de errores
   */
  private setupFormValueSubscriptions(): void {
    this.vehiculoForm.get('descripcion')?.disable();
    
    this.vehiculoForm.get('tipoDeVehiculo')?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((selectedValue) => {
        const IDENTIFICADOR = Number(selectedValue);
        const DESCRIPCION_CONTROL = this.vehiculoForm.get('descripcion');
        
        if (IDENTIFICADOR === 60) { // OTROS
          DESCRIPCION_CONTROL?.enable();
        } else {
          DESCRIPCION_CONTROL?.disable();
          DESCRIPCION_CONTROL?.setValue('');
        }
      });
    
    setTimeout(() => {
      const VALOR_ACTUAL = this.vehiculoForm.get('tipoDeVehiculo')?.value;
      if (VALOR_ACTUAL) {
        const IDENTIFICADOR = Number(VALOR_ACTUAL);
        const DESCRIPCION_CONTROL = this.vehiculoForm.get('descripcion');
        
        if (IDENTIFICADOR === 60) {
          DESCRIPCION_CONTROL?.enable();
        } else {
          DESCRIPCION_CONTROL?.disable();
        }
      }
    }, 100);
  }

  /**
   * Abre el modal de diálogo (si se implementa con un servicio de modal).
   * @returns {void}
   */
  static abiertoModal(): void {
    // Este método debería abrir el diálogo modal.
  }

  /**
   * Cierra el modal de diálogo y emite el evento de cancelación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.cancel.emit();
    this.vehiculoForm.reset();
  }

  /**
   * Limpia los datos del formulario de vehículo, manteniendo el id.
   * @returns {void}
   */
  limpiarVehiculoData(): void {
    if (!this.vehiculoForm) {
      return;
    }
    const VALOR_ID = this.vehiculoForm.get('idDeVehiculo')?.value;
    this.vehiculoForm.reset();
    this.vehiculoForm.get('idDeVehiculo')?.setValue(VALOR_ID);
    this.vehiculoForm.get('idDeVehiculo')?.disable();
    this.vehiculoForm.get('descripcion')?.disable();
  }

  /**
   * Guarda los datos del vehículo si el formulario es válido, emite el evento y cierra el modal.
   * Si el formulario es inválido, muestra una notificación de alerta.
   * @returns {void}
   */
  guardarVehiculoData(): void {
    this.vehiculoForm.markAllAsTouched();
    this.vehiculoForm.updateValueAndValidity();
    
    if (this.vehiculoForm.valid) {
      const FORM_DATA = this.vehiculoForm.getRawValue();
      const DATOS_VEHICULO = {
        ...FORM_DATA,
        tipoDeVehiculo: this.tipoDeVehiculoCatalogo.find(c => c.clave === FORM_DATA.tipoDeVehiculo)?.clave || '',
          idDeUnidad: this.vehiculoForm.get('idDeVehiculo')?.value,
        paisEmisor: this.paisEmisorCatalogo.find(c => c.clave === FORM_DATA.paisEmisor)?.clave || '',
        ano: this.anoCatalogo.find(c => c.clave === FORM_DATA.ano)?.clave || '',
        colorVehiculo: this.colorVehiculoCatalogo.find(c => c.clave === FORM_DATA.colorVehiculo)?.clave || '',
        paisEmisor2daPlaca: this.paisEmisorCatalogo.find(c => c.clave === FORM_DATA.paisEmisor2daPlaca)?.clave || ''
      };
      this.save.emit(DATOS_VEHICULO);
      // Cerrar modal después de guardar exitosamentj
      this.cancel.emit();
    } else {
      // El formulario es inválido, los errores de validación se mostrarán en la plantilla
    }
  }

  /**
   * Verifica si un control del formulario es inválido y ha sido tocado.
   * @param {string} controlName - Nombre del control a verificar.
   * @returns {boolean | null} True si es inválido y tocado, null si no existe.
   */
  isInvalid(controlName: string): boolean | null {
    const CONTROL_FORMULARIO = this.vehiculoForm.get(controlName);
    return CONTROL_FORMULARIO ? CONTROL_FORMULARIO.invalid && CONTROL_FORMULARIO.touched : null;
  }

  /**
   * Obtiene los controles del formulario de vehículo.
   * @readonly
   * @type {{ [key: string]: AbstractControl }}
   */
  get getFormValues(): { [key: string]: AbstractControl } {
    return this.vehiculoForm.controls;
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
