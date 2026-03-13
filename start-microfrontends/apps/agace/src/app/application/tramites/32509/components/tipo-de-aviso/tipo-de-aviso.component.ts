import { AVISO_OPCIONES, CASO_FORTUITO, DESTRUCCION_FECHA, ETIQUETA_DE_ARCHIVO, MENSAJE, TEXTO } from '../../constantes/destruccion-o-donacion';
import { AlertComponent, Catalogo, CatalogoSelectComponent, CatalogosSelect, ConsultaioQuery, ConsultaioState, InputFechaComponent, InputRadioComponent, SeccionLibQuery, SeccionLibState, SeccionLibStore, TituloComponent } from '@libs/shared/data-access-user/src';
import { AvisoDeMercanciaService } from '../service/aviso-de-mercancia';

import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { DestruccionState, DestruccionStore } from '../../estados/Tramite32509.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DestruccionQuery } from '../../estados/Tramite32509.query';

import { DOCUMENT } from '@angular/common';


/**
 * @component
 * @name TipoDeAvisoComponent
 * @descripcion
 * Componente encargado de gestionar el formulario de tipo de aviso para el trámite 32509.
 * Permite seleccionar el tipo de aviso, capturar información relacionada y manejar la lógica de validación y estado del formulario.
 * Utiliza formularios reactivos y se integra con los stores y queries para el manejo de estado.
 *
 * @example
 * <app-tipo-de-aviso [formularioDeshabilitado]="true"></app-tipo-de-aviso>
 */
@Component({
  selector: 'app-tipo-de-aviso',
  templateUrl: './tipo-de-aviso.component.html',
  styleUrl: './tipo-de-aviso.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent, InputFechaComponent, TituloComponent, InputRadioComponent, CommonModule,CatalogoSelectComponent]
})
export class TipoDeAvisoComponent implements OnInit, OnDestroy {
  /**
   * @property {FormGroup} avisoForm 
   * @descripcion
   * Formulario reactivo para capturar los datos del aviso.
   */
  avisoForm!: FormGroup;

  /**
   * @property {Array} avisoOpciones
   * @description
   * Opciones disponibles para el tipo de aviso.
   */
  avisoOpciones = AVISO_OPCIONES;

  /**
   * @property {string} MENSAJE 
   * @descripcion
   * Mensaje informativo relacionado con el aviso.
   */
  MENSAJE = MENSAJE;

  /**
   * @property {string} desrtuccionFecha 
   * @descripcion
   * Fecha de destrucción predeterminada.
   */
  desrtuccionFecha = DESTRUCCION_FECHA;

  /**
   * @property {Array} casoFortuitoOpcion 
   * @descripcion
   * Opciones para el caso fortuito.
   */
  casoFortuitoOpcion = CASO_FORTUITO;

  /**
   * @property {string} avisoValor 
   * @descripcion
   * Valor seleccionado para el tipo de aviso.
   */
  avisoValor: string = ''; // Default value to ensure no section is displayed initially
  /**
   * @property {string} TEXTO 
   * @descripcion
   * Texto informativo relacionado con el aviso.
   */
  TEXTO = TEXTO;

  /**
   * @property {HTMLInputElement} entradaArchivo 
   * @descripcion
   * Referencia al input de archivo.
   */
  entradaArchivo!: HTMLInputElement;

  /**
   * @property {string} etiquetaDeArchivo 
   * @descripcion
   * Etiqueta del archivo seleccionado.
   */
  etiquetaDeArchivo: string = ETIQUETA_DE_ARCHIVO;

  /**
   * @property {File | null} archivoMedicamentos 
   * @descripcion
   * Archivo seleccionado para los medicamentos.
   */
  archivoMedicamentos: File | null = null;

  /**
   * @property {Subject<void>} destroyNotifier$ 
   * @descripcion
   * Notificador para manejar la destrucción de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {DestruccionState} destruccionState 
   * @descripcion
   * Estado actual del formulario de destrucción.
   */
  private destruccionState!: DestruccionState;

  /**
   * @property {SeccionLibState} seccionState 
   * @descripcion
   * Estado actual de la sección.
   */
  private seccionState!: SeccionLibState;

  /**
   * @property {string} DestruccionFecha 
   * @descripcion
   * Fecha de destrucción seleccionada.
   */
  DestruccionFecha: string = '15/03/2025';

  /**
   * @input
   * @description
   * Indica si el formulario debe estar deshabilitado. Cuando es `true`, los controles del formulario estarán inactivos y no permitirán la edición por parte del usuario.
   * @type {boolean}
   */
   @Input() formularioDeshabilitado: boolean = false;

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /** Consulta de estado para la solicitud */
  consultaDatos!: ConsultaioState;
  
  /** Indica si el formulario es de solo lectura */
  esFormularioSoloLectura: boolean = false;


  /**
 * @propiedad {CatalogosSelect} entidadFederativaData
 * @descripción
 * Datos del catálogo para la selección de la entidad federativa.
 * Incluye el nombre de la etiqueta, si es requerido, la primera opción por defecto y los datos del catálogo.
 */
public entidadFederativaData: CatalogosSelect = {
    labelNombre: 'Entidad federativa',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
};

/**
 * @propiedad {CatalogosSelect} alcaldiaMunicipoData
 * @descripción
 * Datos del catálogo para la selección de la alcaldía o municipio.
 * Incluye el nombre de la etiqueta, si es requerido, la primera opción por defecto y los datos del catálogo.
 */
public alcaldiaMunicipoData: CatalogosSelect = {
    labelNombre: 'Alcaldía o Municipio',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
};

/**
 * @propiedad {CatalogosSelect} coloniaData
 * @descripción
 * Datos del catálogo para la selección de la colonia.
 * Incluye el nombre de la etiqueta, si es requerido, la primera opción por defecto y los datos del catálogo.
 */
public coloniaData: CatalogosSelect = {
    labelNombre: 'Colonia',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
};

/**
 * @propiedad {CatalogosSelect} merccanciaEntidadFederativaData
 * @descripción
 * Datos del catálogo para la selección de la entidad federativa relacionada con la mercancía.
 * Incluye el nombre de la etiqueta, si es requerido, la primera opción por defecto y los datos del catálogo.
 */
public merccanciaEntidadFederativaData: CatalogosSelect = {
    labelNombre: 'Entidad federativa',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
};

/**
 * @propiedad {CatalogosSelect} merccanciaAlcaldiaMunicipoData
 * @descripción
 * Datos del catálogo para la selección de la alcaldía o municipio relacionado con la mercancía.
 * Incluye el nombre de la etiqueta, si es requerido, la primera opción por defecto y los datos del catálogo.
 */
public merccanciaAlcaldiaMunicipoData: CatalogosSelect = {
    labelNombre: 'Alcaldía o Municipio',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
};

/**
 * @propiedad {CatalogosSelect} merccanciaColoniaData
 * @descripción
 * Datos del catálogo para la selección de la colonia relacionada con la mercancía.
 * Incluye el nombre de la etiqueta, si es requerido, la primera opción por defecto y los datos del catálogo.
 */
public merccanciaColoniaData: CatalogosSelect = {
    labelNombre: 'Colonia',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
};

/**
 * @propiedad {CatalogosSelect} tarifaData
 * @descripción
 * Datos del catálogo para la selección de la unidad de medida (tarifa).
 * Incluye el nombre de la etiqueta, si es requerido, la primera opción por defecto y los datos del catálogo.
 */
public tarifaData: CatalogosSelect = {
    labelNombre: 'Unidad de medida (Tarifa)',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
};

  /**
   * @constructor
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos.
   * @param {DestruccionStore} store - Almacén para gestionar el estado del formulario.
   * @param {DestruccionQuery} query - Consulta para obtener el estado del formulario.
   * @param {SeccionLibStore} seccionStore - Almacén para gestionar el estado de la sección.
   * @param {SeccionLibQuery} seccionQuery - Consulta para obtener el estado de la sección.
   */
  constructor(
    private readonly fb: FormBuilder,
    private store: DestruccionStore,
    private query: DestruccionQuery,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private avisodemercancia: AvisoDeMercanciaService,
    private consultaioQuery: ConsultaioQuery,
    @Inject(DOCUMENT) private document: Document

  ) {}

  /**
   * @method ngOnInit
   * @description Inicializa el componente y configura las suscripciones necesarias.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();
    this.query.selectDestruccion$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.destruccionState = state as DestruccionState;
        })
      )
      .subscribe();
    this.initActionBuilder();

    this.campoObligatorioChange();
    this.getEntidadFederativaData();
    this.getAlcaldiaMunicipo();
    this.getColonia();
    this.getMerccanciaEntidadFederativa();
    this.getMerccanciaAlcaldiaMunicipo();
    this.getMerccanciaColonia();
    this.getTarifa();

    this.seccionStore.establecerSeccion([false]);

    this.avisoForm.statusChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        () => {
          if(this.avisoForm.valid) {
            this.seccionStore.establecerSeccion([true]);
            this.seccionStore.establecerFormaValida([true])
        }
      }
      );
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario(); 
        })
      )   
      .subscribe();   
    
       this.inicializarEstadoFormulario();
  

    if(this.formularioDeshabilitado){
      this.esFormularioSoloLectura = true;
      this.inicializarEstadoFormulario();
    }
  }

  /**
   * @method inicializarEstadoFormulario
   * @descripcion
   * Inicializa el estado del formulario según si está en modo solo lectura o editable.
   * Si el formulario está en modo solo lectura, deshabilita todos los controles.
   * Si no, habilita los controles para permitir la edición.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.avisoForm.disable();
    }
    else {
      this.avisoForm.enable();
    } 
  }

  /**
   * @method initActionBuilder
   * @descripcion
   * Configura el formulario reactivo con los valores iniciales provenientes del estado.
   */
  initActionBuilder(): void {
    this.avisoForm = this.fb.group({
      tipoDeAviso: [this.destruccionState.tipoDeAviso],
      nombre: [this.destruccionState.nombre, Validators.required],
      rfc: [this.destruccionState.rfc, Validators.required],
      entidadFederativa: [this.destruccionState.entidadFederativa, Validators.required],
      alcaldiaMunicipo: [this.destruccionState.alcaldiaMunicipo, Validators.required],
      colonia: [this.destruccionState.colonia, Validators.required],
      calle: [this.destruccionState.calle, Validators.required],
      numeroExterior: [this.destruccionState.numeroExterior, Validators.required],
      numeroInterior: [this.destruccionState.numeroInterior],
      codigoPostal: [this.destruccionState.codigoPostal, Validators.required],
      cartaCupo: [this.destruccionState.cartaCupo, Validators.required],
      numeraDeAcuse: [this.destruccionState.numeraDeAcuse, Validators.required],
      destruccionMercancia: [this.destruccionState.destruccionMercancia, Validators.required,Validators.maxLength(500)],
      merccanciaEntidadFederativa: [this.destruccionState.merccanciaEntidadFederativa, Validators.required],
      merccanciaAlcaldiaMunicipo: [this.destruccionState.merccanciaAlcaldiaMunicipo, Validators.required],
      merccanciaColonia: [this.destruccionState.merccanciaColonia, Validators.required],
      merccanciaCalle: [this.destruccionState.merccanciaCalle, Validators.required],
      merccanciaNumeroExterior: [this.destruccionState.merccanciaNumeroExterior, Validators.required],
      merccanciaNumeroInterior: [this.destruccionState.merccanciaNumeroInterior],
      merccanciaCodigoPostal: [this.destruccionState.merccanciaCodigoPostal, Validators.required],
      destruir: [this.destruccionState.destruir, Validators.required],
      tarifa: [this.destruccionState.tarifa, Validators.required],
      destruccionEntidadFederativa: [this.destruccionState.destruccionEntidadFederativa, Validators.required],
      destruccionAlcaldiaMunicipo: [this.destruccionState.destruccionAlcaldiaMunicipo, Validators.required],
      destruccionColonia: [this.destruccionState.destruccionColonia, Validators.required],
      destruccionCalle: [this.destruccionState.destruccionCalle, Validators.required],
      destruccionNumeroExterior: [this.destruccionState.destruccionNumeroExterior, Validators.required],
      destruccionNumeroInterior: [this.destruccionState.destruccionNumeroInterior],
      destruccionCodigoPostal: [this.destruccionState.destruccionCodigoPostal, [Validators.required, Validators.pattern('^([01]\\d|2[0-3]):([0-5]\\d)$')]
],
      destruccionHora: [this.destruccionState.destruccionHora, Validators.required],
      desturccionProceso: [this.destruccionState.desturccionProceso, Validators.required],
      casofortuito: [this.destruccionState.casofortuito, Validators.required],
      donoMercancia: [this.destruccionState.donoMercancia, Validators.required],
      condicionesMateriales: [this.destruccionState.condicionesMateriales, Validators.required],
      caboDestruccionFecha: [{ value: this.destruccionState.caboDestruccionFecha || '', disabled: true }, Validators.required],
    });
  }

  /**
 * @method getEntidadFederativaData
 * @descripcion
 * Este método obtiene los datos del catálogo de entidades federativas desde el servicio `AvisoDeMercanciaService`.
 * Utiliza el operador `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * Los datos obtenidos se asignan a la propiedad `catalogos` del objeto `entidadFederativaData`.
 * @returns {void}
 */
  getEntidadFederativaData(): void {
    this.avisodemercancia
      .getEntidadFederativaData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.entidadFederativaData.catalogos = data as Catalogo[];
      });
  }

  /**
 * @method getAlcaldiaMunicipo
 * @descripcion
 * Este método obtiene los datos del catálogo de alcaldías o municipios desde el servicio `AvisoDeMercanciaService`.
 * Utiliza el operador `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * Los datos obtenidos se asignan a la propiedad `catalogos` del objeto `alcaldiaMunicipoData`.
 * @returns {void}
 */
  getAlcaldiaMunicipo(): void {
    this.avisodemercancia
      .getAlcaldiaMunicipo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.alcaldiaMunicipoData.catalogos = data as Catalogo[];
      });
  }

  /**
 * @method getColonia
 * @descripcion
 * Este método obtiene los datos del catálogo de colonias desde el servicio `AvisoDeMercanciaService`.
 * Utiliza el operador `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * Los datos obtenidos se asignan a la propiedad `catalogos` del objeto `coloniaData`.
 * @returns {void}
 */
  getColonia(): void {
    this.avisodemercancia
      .getColonia()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.coloniaData.catalogos = data as Catalogo[];
      });
  }

  /**
 * @method getMerccanciaEntidadFederativa
 * @descripcion
 * Este método obtiene los datos del catálogo de entidades federativas relacionadas con la mercancía 
 * desde el servicio `AvisoDeMercanciaService`.
 * Utiliza el operador `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * Los datos obtenidos se asignan a la propiedad `catalogos` del objeto `merccanciaEntidadFederativaData`.
 * @returns {void}
 */
  getMerccanciaEntidadFederativa(): void {
    this.avisodemercancia
      .getMerccanciaEntidadFederativa()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.merccanciaEntidadFederativaData.catalogos = data as Catalogo[];
      });
  }
  /**
 * @method getMerccanciaAlcaldiaMunicipo
 * @descripcion
 * Este método obtiene los datos del catálogo de alcaldías o municipios relacionados con la mercancía 
 * desde el servicio `AvisoDeMercanciaService`.
 * Utiliza el operador `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * Los datos obtenidos se asignan a la propiedad `catalogos` del objeto `merccanciaAlcaldiaMunicipoData`.
 * @returns {void}
 */
  getMerccanciaAlcaldiaMunicipo(): void {
    this.avisodemercancia
      .getMerccanciaAlcaldiaMunicipo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.merccanciaAlcaldiaMunicipoData.catalogos = data as Catalogo[];
      });
  }

  /**
 * @method getMerccanciaColonia
 * @descripcion
 * Este método obtiene los datos del catálogo de colonias relacionadas con la mercancía 
 * desde el servicio `AvisoDeMercanciaService`.
 * Utiliza el operador `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * Los datos obtenidos se asignan a la propiedad `catalogos` del objeto `merccanciaColoniaData`.
 * @returns {void}
 */
  getMerccanciaColonia(): void {
    this.avisodemercancia
      .getMerccanciaColonia()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.merccanciaColoniaData.catalogos = data as Catalogo[];
      });
  }
/**
 * @method getTarifa
 * @descripcion
 * Este método obtiene los datos del catálogo de tarifas desde el servicio `AvisoDeMercanciaService`.
 * Utiliza el operador `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * Los datos obtenidos se asignan a la propiedad `catalogos` del objeto `tarifaData`.
 * @returns {void}
 */
  getTarifa(): void {
    this.avisodemercancia
      .getTarifa()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.tarifaData.catalogos = data as Catalogo[];
      });
  }
  /**
   * @method campoObligatorioChange
   * @descripcion
   * Cambia los campos obligatorios del formulario según el tipo de aviso seleccionado.
   * Ajusta los validadores de los campos relacionados con la destrucción dependiendo del valor actual del tipo de aviso.
   * Si el tipo de aviso es 'deposito_fiscal', los campos se marcan como requeridos; en caso contrario, se eliminan los validadores requeridos.
   * Se actualiza la validez de los controles afectados.
   * @returns {void}
   */
  campoObligatorioChange(): void {
    const DESTRUCCIONENTIDADFEDERATIVA = this.avisoForm.get('destruccionEntidadFederativa');
    const DESTRUCCIONALCALDIAMUNICIPO = this.avisoForm.get('destruccionAlcaldiaMunicipo');
    const DESTRUCCIONCOLONIA = this.avisoForm.get('destruccionColonia');
    const DESTRUCCIONCALLE = this.avisoForm.get('destruccionCalle');
    const DESTRUCCIONNUMEROEXTERIOR = this.avisoForm.get('destruccionNumeroExterior');
    const DESTRUCCIONNUMEROINTERIOR = this.avisoForm.get('destruccionNumeroInterior');
    const DESTRUCCIONCODIGOPOSTAL = this.avisoForm.get('destruccionCodigoPostal');
    const DESTRUCCIONHORA = this.avisoForm.get('destruccionHora');
    const DESTRUCCIONPROCESO = this.avisoForm.get('desturccionProceso');
    const CASOFORTUITO = this.avisoForm.get('casofortuito');
    if(this.destruccionState.tipoDeAviso === 'deposito_fiscal') {
      DESTRUCCIONENTIDADFEDERATIVA?.setValidators([Validators.required]);
      DESTRUCCIONALCALDIAMUNICIPO?.setValidators([Validators.required]);
      DESTRUCCIONCOLONIA?.setValidators([Validators.required]);
      DESTRUCCIONCALLE?.setValidators([Validators.required]);
      DESTRUCCIONNUMEROEXTERIOR?.setValidators([Validators.required]);
      DESTRUCCIONNUMEROINTERIOR?.setValidators([Validators.required]);
      DESTRUCCIONCODIGOPOSTAL?.setValidators([Validators.required]);
      DESTRUCCIONHORA?.setValidators([Validators.required]);
      DESTRUCCIONPROCESO?.setValidators([Validators.required]);
      CASOFORTUITO?.setValidators([Validators.required]);
    }
    else{
      DESTRUCCIONENTIDADFEDERATIVA?.clearValidators();
      DESTRUCCIONALCALDIAMUNICIPO?.clearValidators();
      DESTRUCCIONCOLONIA?.clearValidators();
      DESTRUCCIONCALLE?.clearValidators();
      DESTRUCCIONNUMEROEXTERIOR?.clearValidators();
      DESTRUCCIONNUMEROINTERIOR?.clearValidators();
      DESTRUCCIONCODIGOPOSTAL?.clearValidators();
      DESTRUCCIONHORA?.clearValidators();
      DESTRUCCIONPROCESO?.clearValidators();
      CASOFORTUITO?.clearValidators();
    }
    DESTRUCCIONENTIDADFEDERATIVA?.updateValueAndValidity();
    DESTRUCCIONALCALDIAMUNICIPO?.updateValueAndValidity();
    DESTRUCCIONCOLONIA?.updateValueAndValidity();
    DESTRUCCIONCALLE?.updateValueAndValidity();
    DESTRUCCIONNUMEROEXTERIOR?.updateValueAndValidity();
    DESTRUCCIONNUMEROINTERIOR?.updateValueAndValidity();
    DESTRUCCIONCODIGOPOSTAL?.updateValueAndValidity();
    DESTRUCCIONHORA?.updateValueAndValidity();
    DESTRUCCIONPROCESO?.updateValueAndValidity();
    CASOFORTUITO?.updateValueAndValidity();
  }

  /**
   * @method cambioFecha
   * @descripcion
   * Actualiza la fecha de destrucción en el formulario.
   * @param {string} nuevoValor - Nuevo valor de la fecha.
   */
  cambioFecha(nuevoValor: string): void {
    this.avisoForm.patchValue({
      caboDestruccionFecha: nuevoValor,
    });
    this.DestruccionFecha = nuevoValor;
  }

  /**
   * @method avisoValorRadio
   * @descripcion
   * Actualiza el valor del tipo de aviso en el formulario.
   * @param {string} nombreControl - Nombre del control en el formulario.
   * @param {string} valor - Valor a asignar.
   */
  avisoValorRadio(nombreControl: string, valor: string): void {
    this.avisoForm.patchValue({
      [nombreControl]: valor,
    });
    this.avisoValor = valor;
  }

  /**
   * @method activarSeleccionArchivo
   * @descripcion
   * Activa la selección de un archivo abriendo el diálogo de selección de archivos.
   */
  activarSeleccionArchivo(): void {
    this.entradaArchivo = document.getElementById('archivoMedicamentos') as HTMLInputElement;
    if (this.entradaArchivo) {
      this.entradaArchivo.click();
    }
  }

  /**
   * @method onCambioDeArchivo
   * @descripcion
   * Maneja el cambio de archivo seleccionado y actualiza la etiqueta del archivo.
   * @param {Event} event - Evento de cambio de archivo.
   */
  onCambioDeArchivo(event: Event): void {
    const TARGET = event.target as HTMLInputElement;

    if (TARGET.files && TARGET.files.length > 0) {
      this.archivoMedicamentos = TARGET.files[0];
      this.etiquetaDeArchivo = this.archivoMedicamentos.name;
    } else {
      this.etiquetaDeArchivo = ETIQUETA_DE_ARCHIVO;
    }
  }

  /**
   * @method setValoresStore
   * @descripcion
   * Establece valores en el store a partir del formulario.
   * @param {FormGroup} form - Formulario reactivo.
   * @param {string} campo - Nombre del campo en el formulario.
   * @param {keyof DestruccionStore} metodoNombre - Método del store a invocar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof DestruccionStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: string | number | boolean | null) => void)(
      VALOR
    );
  }

  /**
   * @method ngOnDestroy
   * @descripcion
   * Limpia las suscripciones activas cuando el componente es destruido.
   * Este método se llama automáticamente cuando el componente es destruido para evitar fugas de memoria.
   * @lifecycle
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}