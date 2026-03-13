/**
 * Importaciones necesarias para el funcionamiento del componente.
 */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FECHA_PAGO, MAXLENGTH,PAGO } from '../../constantes/permiso-importacion-biologica.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CatalogoResponse, CatalogoSelectComponent, InputFecha, InputFechaComponent } from '@libs/shared/data-access-user/src';
import { PermisoImportacionBiologicaState, PermisoImportacionBiologicaStore } from '../../estados/permiso-importacion-biologica.store';


import { TituloComponent } from '@libs/shared/data-access-user/src';

import { PagoDeDerechosEntradaService } from '../../services/pago-de-derechos-entrada.service';

import { PermisoImportacionBiologicaQuery } from '../../estados/permiso-importacion-biologica.query';

import { Observable,Subject,map, takeUntil } from 'rxjs';
import { REQUIRED_BANCO } from '../../constantes/datos-solicitud.enum';

import {CatalogoServices, ConsultaioQuery} from '@ng-mf/data-access-user'
import { DATOS_GENERALES_TRAMITES_COFEPRIS } from '../../constantes/datos-generales.enum';
/**
 * Componente que gestiona el pago de derechos.
 * Utiliza un formulario reactivos para recopilar datos del usuario.
 */
@Component({
  selector: 'app-pago-de-derechos-entrada',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    InputFechaComponent
  ],
  templateUrl: './pago-de-derechos-entrada.component.html',
  styleUrls: ['./pago-de-derechos-entrada.component.scss',],
})
export class PagoDeDerechosEntradaComponent implements OnInit, OnDestroy {

  /** 
   * Subject utilizado para gestionar la destrucción del componente y cancelar suscripciones.
   * Previene fugas de memoria al completar observables cuando el componente se destruye.
   */
  private destroy$ = new Subject<void>();


  /**
   * @observable selectedBanco$
   * @description Observable que representa el banco seleccionado en el contexto del componente.
   * @type {Observable<CatalogoResponse | null>}
   * @remarks Este observable se suscribe al estado del query `permisoImportacionBiologicaQuery` 
   * para obtener el banco seleccionado. Puede emitir un valor de tipo `CatalogoResponse` 
   * o `null` si no hay un banco seleccionado.
   */
  selectedBanco$: Observable<CatalogoResponse | null> =
    this.permisoImportacionBiologicaQuery.selectedBanco$;

  /**
   * @observable claveDeReferncia$
   * @description Representa un observable que emite la clave de referencia seleccionada
   * en el contexto del trámite 260402.
   */
  claveDeReferncia$ = this.permisoImportacionBiologicaQuery.selectedClaveDeReferncia$

  /**
   * @observable cadenaDeLaDependencia$
   * @description Representa un observable que emite la cadena de la dependencia seleccionada
   * en el contexto del trámite 260402.
   */
  cadenaDeLaDependencia$ = this.permisoImportacionBiologicaQuery.selectedCadenaDeLaDependencia$

  /**
   * @observable llaveDePago$
   * @description Observable que representa la llave de pago seleccionada 
   * en el contexto del trámite 260402. Este flujo de datos se utiliza 
   * para rastrear y reaccionar a los cambios en la llave de pago seleccionada.
   */
  llaveDePago$ = this.permisoImportacionBiologicaQuery.selectedLlaveDePago$

  /**
   * @descripcion Un observable que emite la fecha de pago seleccionada
   * desde el estado del query `permisoImportacionBiologicaQuery`.
   */
  fechaDePago$ = this.permisoImportacionBiologicaQuery.selectedFechaDePago$

  /**
   * @observable importeDePago$
   * @description Observable que representa el importe de pago seleccionado
   * en el contexto del trámite 260402. Este observable se utiliza para
   * rastrear y reaccionar a los cambios en el importe de pago asociado.
   */
  importeDePago$ = this.permisoImportacionBiologicaQuery.selectedImporteDePago$


  /**
   * @descripcion Arreglo que contiene los datos del catálogo para el componente.
   * @tipo {CatalogoResponse[]}
   */
  dropdownData: CatalogoResponse[] = [];

  /**
  * Identificador del procedimiento recibido como entrada desde un componente padre.
  * @type {number}
  */
  @Input() public idProcedimiento!: number;

  /**
   * Indica si los campos del formulario deben mostrar etiquetas como requeridos.
   * Se determina basado en el ID del procedimiento y afecta la visualización de validaciones.
   */
  public requiredLabel: boolean = false;

  /**
   * Objeto que define las longitudes máximas permitidas para los campos del formulario.
   * Las restricciones varían según el tipo de procedimiento.
   */
  public maxLength!: { [key: string]: number };

  /**
   * Configuración del campo de fecha utilizado en el formulario.
   * Su valor se determina según el tipo de procedimiento (PAGO o FECHA_PAGO).
   */
  fechaFinalInput!: InputFecha;

  /**
   * Indica si el formulario debe mostrarse en modo de solo lectura.
   * Cuando es `true`, todos los campos del formulario se deshabilitan.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual del permiso de importación biológica.
   * Contiene toda la información del formulario y configuraciones del trámite.
   */
  public solicitudState!: PermisoImportacionBiologicaState;

  /**
   * Identificador único del trámite que se está procesando.
   * Se utiliza para obtener datos específicos del trámite desde los servicios.
   */
  @Input() tramiteID!: string;

  /** Código del trámite recibido desde el componente padre,  
 *  utilizado para controlar la lógica y los datos que se muestran. */
  @Input() public tramites!: string;

  /** Sujeto que emite una notificación al destruir el componente,  
 *  utilizado para completar observables y prevenir fugas de memoria. */
  private destroyNotifier$: Subject<void> = new Subject();

  private procedures = DATOS_GENERALES_TRAMITES_COFEPRIS;


  /**
   * Constructor del componente de pago de derechos de entrada.
   * 
   * Inicializa las dependencias necesarias y configura la suscripción al estado
   * de consulta para manejar el modo de solo lectura del formulario.
   * 
   * @param fb - Constructor de formularios reactivos de Angular
   * @param pagoDeDerechosService - Servicio para obtener datos de pago de derechos
   * @param permisoImportacionBiologicaStore - Store para gestionar el estado del permiso
   * @param permisoImportacionBiologicaQuery - Query para acceder al estado del permiso
   * @param consultaioQuery - Query para obtener el estado de consulta
   * @param catalogoService - Servicio para obtener catálogos de datos
   */
  constructor(
    private fb: FormBuilder,
    private pagoDeDerechosService: PagoDeDerechosEntradaService,
    private permisoImportacionBiologicaStore: PermisoImportacionBiologicaStore,
    private permisoImportacionBiologicaQuery: PermisoImportacionBiologicaQuery,
    private consultaioQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices
  ) {
    // Configuración de la suscripción para el modo de solo lectura
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.guardarDatosFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Formulario reactivo para la captura de datos de pago de derechos.
   * 
   * Contiene los siguientes campos:
   * - claveDeReferencia: Código de referencia del pago
   * - cadenaDeLaDependencia: Cadena de la dependencia emisora
   * - banco: Entidad bancaria donde se realizó el pago
   * - llaveDePago: Identificador único del pago (obligatorio)
   * - fechaDePago: Fecha en que se efectuó el pago (obligatorio)
   * - importeDePago: Monto del pago realizado (obligatorio)
   */
  public pagoDerechos: FormGroup = this.fb.group({
    claveDeReferncia: [''],
    cadenaDeLaDependencia: [''],
    banco: [''],
    llaveDePago: ['', [Validators.required]],
    fechaDePago: ['', [Validators.required]],
    importeDePago: ['', [Validators.required]]
  });

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Realiza las siguientes operaciones de inicialización:
   * - Configura el formulario de certificado según el modo de solo lectura
   * - Obtiene los datos del catálogo de bancos
   * - Inicializa los datos del banco desde el servicio
   */
  ngOnInit(): void {
    this.inicializarCertificadoFormulario();
    this.obtenerDatosBanco();

    if (this.procedures.includes(Number(this.tramites))) {
      this.pagoDerechos.get('cadenaDeLaDependencia')?.setValidators([Validators.required]);
      this.pagoDerechos.get('banco')?.setValidators([Validators.required]);
      this.pagoDerechos.get('cadenaDeLaDependencia')?.updateValueAndValidity();
      this.pagoDerechos.get('banco')?.updateValueAndValidity();
    } 
  }

  /**
   * Actualiza el formulario de certificado.
   * Si el formulario es solo de lectura, guarda los datos del formulario.
   * De lo contrario, inicializa el formulario.
   */
  inicializarCertificadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }  
  }

    /**
     * Actualiza los datos del formulario.
     * Si el formulario es solo de lectura, deshabilita el formulario.
     * De lo contrario, habilita el formulario.
     */
    guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.pagoDerechos.disable();
      } else {
        this.pagoDerechos.enable();
      }
    }

  /**
   * Inicializa el formulario y configura sus valores a partir del estado actual.
   * 
   * Este método:
   * - Se suscribe a los observables del estado para sincronizar los valores del formulario
   * - Configura las propiedades de validación según el tipo de procedimiento
   * - Establece las longitudes máximas y configuraciones de fecha
   * - Determina si los campos deben ser marcados como requeridos
   */
  inicializarFormulario(): void {
    this.selectedBanco$.pipe(takeUntil(this.destroy$)).subscribe((selectedBanco) => {
      if (selectedBanco) {
        this.pagoDerechos.get('banco')?.setValue(selectedBanco);
      }
    });

    this.claveDeReferncia$.pipe(takeUntil(this.destroy$)).subscribe((claveDeReferncia) => {
      if (claveDeReferncia) {
        this.pagoDerechos.get('claveDeReferncia')?.setValue(claveDeReferncia);
      }
    });

    this.cadenaDeLaDependencia$.pipe(takeUntil(this.destroy$)).subscribe((cadenaDeLaDependencia) => {
      if (cadenaDeLaDependencia) {
        this.pagoDerechos.get('cadenaDeLaDependencia')?.setValue(cadenaDeLaDependencia);
      }
    });
    this.llaveDePago$.pipe(takeUntil(this.destroy$)).subscribe((llaveDePago) => {
      if (llaveDePago) {
        this.pagoDerechos.get('llaveDePago')?.setValue(llaveDePago);
      }
    });
    this.fechaDePago$.pipe(takeUntil(this.destroy$)).subscribe((fechaDePago) => {
      if (fechaDePago) {
        this.pagoDerechos.get('fechaDePago')?.setValue(fechaDePago);
      }
    });
    this.importeDePago$.pipe(takeUntil(this.destroy$)).subscribe((importeDePago) => {
      if (importeDePago) {
        this.pagoDerechos.get('importeDePago')?.setValue(importeDePago);
      }
    });

    this.requiredLabel = REQUIRED_BANCO.includes(this.idProcedimiento) ? true : false;

    this.fechaFinalInput = REQUIRED_BANCO.includes(this.idProcedimiento) ? PAGO : FECHA_PAGO;

    this.maxLength = REQUIRED_BANCO.includes(this.idProcedimiento) ? MAXLENGTH : {
    };
   
  }

  getBanco(): void {
    this.pagoDeDerechosService.getData(this.tramiteID).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.dropdownData = data;
    });
  }

  /**
   * Actualiza el valor de la clave de referencia en el store.
   * 
   * Obtiene el valor del campo 'claveDeReferncia' del formulario y lo almacena
   * en el estado global del permiso de importación biológica.
   */
  updateClaveDeReferncia(): void {
    const CLAVE = this.pagoDerechos.get('claveDeReferncia')?.value;
    this.permisoImportacionBiologicaStore.setClaveDeReferncia(CLAVE);
  }

  /**
   * Actualiza el valor de la cadena de dependencia en el store.
   * 
   * Obtiene el valor del campo 'cadenaDeLaDependencia' del formulario y lo almacena
   * en el estado global del permiso de importación biológica.
   */
  updateCadenaDeLaDependencia(): void {
    const CADENA = this.pagoDerechos.get('cadenaDeLaDependencia')?.value;
    this.permisoImportacionBiologicaStore.setCadenaDeLaDependencia(CADENA);
  }

  /**
   * Actualiza el valor de la llave de pago en el store.
   * 
   * Obtiene el valor del campo 'llaveDePago' del formulario y lo almacena
   * en el estado global del permiso de importación biológica.
   */
  updateLlaveDePago(): void {
    const LLAVE = this.pagoDerechos.get('llaveDePago')?.value;
    this.permisoImportacionBiologicaStore.setLlaveDePago(LLAVE);
  }

  /**
   * Actualiza el valor de la fecha de pago en el store.
   * 
   * Obtiene el valor del campo 'fechaDePago' del formulario y lo almacena
   * en el estado global del permiso de importación biológica.
   */
  updateFechaDePago(): void {
    const FECHA = this.pagoDerechos.get('fechaDePago')?.value;
    this.permisoImportacionBiologicaStore.setFechaDePago(FECHA);
  }

  /**
   * Actualiza el valor del importe de pago en el store.
   * 
   * Obtiene el valor del campo 'importeDePago' del formulario y lo almacena
   * en el estado global del permiso de importación biológica.
   */
  updateImporteDePago(): void {
    const IMPORTE = this.pagoDerechos.get('importeDePago')?.value;
    this.permisoImportacionBiologicaStore.setImporteDePago(IMPORTE);
  }

  /**
   * Obtiene y actualiza el banco seleccionado del formulario en el store.
   * 
   * Extrae el valor del campo 'banco' del formulario y lo almacena en el estado
   * global del permiso de importación biológica para su uso en otros componentes.
   */
  getMunicipios(): void {
    const SELECTED_BANCO = this.pagoDerechos.get('banco')?.value;
    this.permisoImportacionBiologicaStore.setBanco(SELECTED_BANCO);
  }

  /**
   * Método para cambiar la fecha final.
   * @param nuevo_valor Nuevo valor de la fecha final.
   */
  /**
   * Indica si la fecha seleccionada es posterior al día actual.
   * Se utiliza para validar que las fechas de pago no sean futuras y mostrar errores correspondientes.
   */
  fechaFuturaSeleccionada = false;
  cambioFechaDePago(nuevo_valor: string): void {
    this.pagoDerechos.patchValue({
      fechaDePago: nuevo_valor,
    });
   this.permisoImportacionBiologicaStore.setFechaDePago(nuevo_valor);
  this.pagoDerechos.get('fechaDePago')?.setValue(nuevo_valor);

  let seleccionada: Date | null = null;
  if (nuevo_valor && nuevo_valor.includes('/')) {
    const [DAY, MONTH, YEAR] = nuevo_valor.split('/').map(Number);
    seleccionada = new Date(YEAR, MONTH - 1, DAY);
  } else {
    seleccionada = new Date(nuevo_valor); 
  }

  const HOY = new Date();
  HOY.setHours(0, 0, 0, 0);

  if (seleccionada && seleccionada > HOY) {
    this.fechaFuturaSeleccionada = true;
    this.pagoDerechos.get('fechaDePago')?.setErrors({ futureDate: true });
  } else {
    this.fechaFuturaSeleccionada = false;
    this.pagoDerechos.get('fechaDePago')?.setErrors(null);
  }
  }

  /**
   * Limpia todos los campos del formulario de pago de derechos.
   * 
   * Restablece todos los valores del formulario a sus estados iniciales vacíos,
   * lo que permite al usuario comenzar una nueva captura de datos sin valores previos.
   */
  onReset(): void {
this.pagoDerechos.reset({
  claveDeReferncia: '',
  cadenaDeLaDependencia: '',
  banco: '',
  llaveDePago: '',
  fechaDePago: this.pagoDerechos.get('fechaDePago')?.setValue(''),
  importeDePago: ''
});

  }

  /**
   * Obtiene el catálogo de bancos disponibles según el trámite actual.
   * 
   * Realiza una llamada al servicio de catálogos para obtener la lista de bancos
   * válidos para el tipo de trámite especificado y los almacena en `dropdownData`.
   * La suscripción se cancela automáticamente al destruir el componente.
   */
  obtenerDatosBanco(): void {
  this.catalogoService.bancosCatalogo(this.tramites)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        this.dropdownData = response?.datos ?? []
      }
    });
}

  /**
   * Valida que todos los campos obligatorios del formulario tengan valores válidos.
   * 
   * Verifica que los campos requeridos (llaveDePago, fechaDePago, importeDePago)
   * contengan valores no vacíos. Si alguno falta, marca todos los controles
   * como tocados para mostrar los mensajes de validación correspondientes.
   * 
   * @returns `true` si todos los campos obligatorios están completos, `false` en caso contrario
   */
  validarPagoDerechosFormularios(): boolean {
    let CAMPOS_OBLIGATORIOS: string[] = [];
    if (this.procedures.includes(Number(this.tramites))) {
      CAMPOS_OBLIGATORIOS = ['llaveDePago', 'fechaDePago', 'importeDePago', 'banco', 'cadenaDeLaDependencia'];
    } else {
      CAMPOS_OBLIGATORIOS = ['llaveDePago', 'fechaDePago', 'importeDePago'];
    }
  

  const ALL_FILLED = CAMPOS_OBLIGATORIOS.every(field => {
    const VALOR = this.pagoDerechos.get(field)?.value;
    return VALOR ? VALOR !== '' && VALOR !== null && VALOR !== undefined : false;
  });

  if (ALL_FILLED) {
    return true;
  }
  this.pagoDerechos.markAllAsTouched();
  return false;
} 

  public validarFormulario(): boolean {
    return this.pagoDerechos.valid;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Emite una señal a través del Subject `destroy$` para cancelar todas las
   * suscripciones activas y completa el Subject para liberar recursos y
   * prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



}
