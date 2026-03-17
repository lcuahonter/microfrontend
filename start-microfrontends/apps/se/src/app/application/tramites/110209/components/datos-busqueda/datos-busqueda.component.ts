import { CatalogoServices, ENVIRONMENT, InputRadioComponent, Notificacion, NotificacionesComponent, TableBodyData, TableComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged,takeUntil } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConfiguracionDropdown } from '@libs/shared/data-access-user/src/core/models/110203/datos-busqueda.model';
import { RadioOpcion } from '@libs/shared/data-access-user/src/core/models/110203/datos-busqueda.model';
import { TableData } from '@libs/shared/data-access-user/src/core/models/110203/datos-busqueda.model';

import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import datosBusquedaDropdown from '@libs/shared/theme/assets/json/110203/datos-busqueda.json';
import destinatarioTable from '@libs/shared/theme/assets/json/110203/datos-busqueda-table.json'
import radioOpciones from '@libs/shared/theme/assets/json/110203/datos-busqueda.json';

import { ApiResponse, CertificadoData, TablaRow } from '../../models/certificado-sgp.model';
import { Solicitud110209Service } from '../../services/solicitud-110209/solicitud-110209.service';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { Tramite110209Store } from '../../estados/stores/tramite110209.store';

@Component({
  selector: 'app-datos-busqueda',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, InputRadioComponent, CatalogoSelectComponent, TableComponent,NotificacionesComponent],
  templateUrl: './datos-busqueda.component.html',
})
export class DatosBusquedaComponent implements OnInit, OnDestroy {
  /**
 * Constante que define los tipos de búsqueda disponibles, 
 * incluyendo la búsqueda por número de certificado y por tratado o país/bloque.
 */
  private readonly SEARCH_TYPE_ID = {
    CERTIFICADO: 0, // "Por número de certificado"
    PAIS_DEL_TRATADO: 1 // "Por Tratado/Acuerdo País/Bloque"
  } as const;

  /**
  * Almacena el valor seleccionado, que puede ser un string o un número.
  * Se inicializa con "Por número de certificado".
  *
  * @property {string | number} valorSeleccionado - Valor seleccionado por el usuario.
  */
  valorSeleccionado: string | number = "Por número de certificado";

  /**
   * Indica si la tabla debe ser visible.
   * Se inicializa en false (no visible).
   *
   * @property {boolean} verTabla - Estado de visibilidad de la tabla.
   */
  verTabla = false;
  /**
   * Arreglo que almacena las configuraciones disponibles para los menús desplegables (dropdowns).
   * Cada elemento define las propiedades necesarias para construir un dropdown dinámico.
   */
  configuracionesDropdown: ConfiguracionDropdown[] = [];

  /**
   * Colección de entidades del catálogo.
   * Se inicializa de forma tardía (lazy initialization) con el operador '!'.
   *
   * @property {Catalogo[]} entidad - Entidades del catálogo.
   */
  public entidad!: Catalogo[];

  /**
   * Subject utilizado para manejar la desuscripción de observables.
   * Se inicializa para evitar fugas de memoria.
   *
   * @property {Subject<void>} unsubscribe$ - Subject para la desuscripción.
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Grupo de formularios que contiene los datos de búsqueda.
   * Se inicializa de forma tardía (lazy initialization) con el operador '!'.
   *
   * @property {FormGroup} datosBusquedaFormulario - Formulario de búsqueda.
   */
  datosBusquedaFormulario!: FormGroup;

  /**
   * Suscripción para manejar el ciclo de vida del formulario.
   * Se inicializa de forma tardía (lazy initialization) con el operador '!'.
   *
   * @property {Subscription} formSubscription - Suscripción para cambios en el formulario.
   */
  formSubscription!: Subscription;

  /**
   * Suscripción para restaurar datos o valores.
   * Se inicializa de forma tardía (lazy initialization) con el operador '!'.
   *
   * @property {Subscription} restauraSubscription$ - Suscripción para restaurar valores.
   */
  restauraSubscription$!: Subscription;

  /**
   * Opciones de radio para la selección en el formulario.
   * Cada opción tiene una etiqueta (label) y un valor (value).
   *
   * @property {RadioOpcion[]} radioOptions - Opciones de radio disponibles.
   */
  radioOptions: RadioOpcion[] = radioOpciones?.radioOptions;

  /**
   * Encabezados de la tabla para el establecimiento.
   * Se inicializa como un arreglo vacío.
   *
   * @property {string[]} establecimientoHeaderData - Encabezados de la tabla.
   */
  public establecimientoHeaderData: string[] = [];

  /**
   * Datos del cuerpo de la tabla para el establecimiento.
   * Se inicializa como un arreglo de tipo desconocido (TableBodyData).
   *
   * @property {TableBodyData} establecimientoBodyData - Datos del cuerpo de la tabla.
   */
  public establecimientoBodyData: TableBodyData[] = [];
  /** Bandera que indica si los datos de respuesta están disponibles o han sido cargados.  
 *  Se utiliza para controlar la lógica de visualización o validación en el componente. */
   public esDatosRespuesta: boolean = false;
   /** Almacena el estado actual de la consulta relacionada con el trámite.  
 *  Contiene información necesaria para mostrar o procesar datos en el componente. */
   public consultaState!:ConsultaioState;
   /** Notificador utilizado para cancelar suscripciones al destruir el componente.  
 *  Ayuda a prevenir fugas de memoria en flujos observables. */
   private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Estructura que contiene los datos de la tabla de destinatarios.
   * Incluye encabezados de columna y el cuerpo con las filas correspondientes.
   */
  destinatarioTableData: TableData = { encabezadoDeTabla: [], cuerpoTabla: [] };

  /**
   * Lista de objetos de tipo Catalogo que representa los tratados o acuerdos disponibles para la búsqueda.
   * Se utiliza para mostrar las opciones en el componente de datos de búsqueda.
   */
  tratadoAcuerdo: Catalogo[] = [];

  /**
   * Lista de objetos de tipo Catalogo que representa los países disponibles para seleccionar en el bloque correspondiente.
   * Se utiliza para mostrar opciones de países en el componente de búsqueda.
   */
  paisBloque: Catalogo[] = [];

  
  /**
  * Código del trámite asociado al establecimiento.
  * 
  * Valor predeterminado: '110209'.
  */
  tramites:string='110209';

  public filaSeleccionada: boolean = false;

  public selectedRowsData: TableBodyData[] = [];

  /** 
   * Constructor del componente.
   * Se inyectan las dependencias necesarias para el funcionamiento del componente.
   *
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Router} router - Servicio para la navegación entre rutas.
   * @param {Tramite110209Query} tramite110209Query - Consulta para manejar datos del trámite 110209.
   * @param {Tramite110209Store} tramite110209Store - Almacenamiento para manejar el estado del trámite 110209.
   */
  constructor(
    private fb: FormBuilder, // Servicio para construir formularios reactivos
    private router: Router, // Servicio para la navegación entre rutas
    private consultaQuery: ConsultaioQuery,
    private route: ActivatedRoute,
    private Solicitud110209Service: Solicitud110209Service,
    private tramite110209Query: Tramite110209Query,
    private tramite110209Store: Tramite110209Store,
    private catalogoService: CatalogoServices
  ) {
    /** 
     Configuración de dropdowns para los catálogos de búsqueda
     Incluye los datos para los tratados y países
   */
    this.configuracionesDropdown = [
      { catalogos: datosBusquedaDropdown?.tratado ?? [] },
      { catalogos: datosBusquedaDropdown?.pais ?? [] }
    ];
  }
 /** Obtiene los datos del formulario desde un JSON simulado y actualiza el store.  
 *  Marca la bandera de respuesta si la información es válida. */
     guardarDatosFormulario(): void {
    this.Solicitud110209Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.Solicitud110209Service.actualizarEstadoFormulario(resp);
        }
      });
  }
  /** 
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se configuran los datos iniciales y las suscripciones necesarias.
   */
  ngOnInit(): void {
      this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
        .subscribe((seccionState) => {
          this.consultaState = seccionState
          if (this.consultaState.update) {
             this.guardarDatosFormulario();
             } else {
              this.esDatosRespuesta = true;
            }
        })
    /** 
     * Crea el formulario para la búsqueda de datos.
     */
    this.createFormDatosBusqueda();

    /** 
     * Suscribe a los cambios en el valor seleccionado del trámite.
     * Utiliza takeUntil para evitar fugas de memoria.
     */
    this.tramite110209Query.valorSeleccionado$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(valor => {
        this.valorSeleccionado = valor; // Actualiza el valor seleccionado.
      });

    /** 
     * Restaura los valores del formulario a su estado inicial.
     */
    this.restaurarValoresFormulario();

    /** 
 * Escucha los cambios en el campo "numeroDeCertificado" del formulario.  
 * Cuando el usuario modifica este campo, se actualiza el estado correspondiente  
 * en la tienda de Akita utilizando el método setNumeroDeCertificado.  
 */
    this.datosBusquedaFormulario.get('numeroDeCertificado')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(valor => this.tramite110209Store.setTramite110209({ numeroDeCertificado: valor }));

    /** 
     * Escucha los cambios en el campo "tratadoAcuerdo" del formulario.  
     * Si el usuario cambia el valor, este se almacena en la tienda de Akita  
     * llamando al método setTratadoAcuerdo.  
     */
    this.datosBusquedaFormulario.get('tratadoAcuerdo')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$),
       distinctUntilChanged(),
       debounceTime(200))
      .subscribe(valor => {
        this.tramite110209Store.setTramite110209({ tratadoAcuerdo: valor })

      this.datosBusquedaFormulario.get('paisBloque')?.setValue('', { emitEvent: false });
    
    if (valor && valor.trim() !== '') {
      this.obtenerPaisesPorTratado(valor);
    } else {
      this.paisBloque = [];
    }
  });
  

    /** 
     * Escucha los cambios en el campo "paisBloque" del formulario.  
     * Cualquier modificación en este campo se refleja en el estado global  
     * de la aplicación a través del método setPaisBloque de la tienda.  
     */
    this.datosBusquedaFormulario.get('paisBloque')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(valor => this.tramite110209Store.setTramite110209({ paisBloque: valor }));


    this.destinatarioTableData.encabezadoDeTabla = destinatarioTable?.encabezadoDeTabla;
    this.destinatarioTableData.cuerpoTabla = destinatarioTable?.cuerpoTabla;

    /**
    * Llama a la función para obtener los tratados y acuerdos.
    */
    this.obtenerTratadosAcuerdo();
  }
  /**
   * Handles radio value changes.
   * Updates the selected value, adjusts form validators, and syncs global state.
   * 
   * @param valor The new selected value (string or number).
   */
  enCambioValorRadio(valor: string | number): void {
    this.valorSeleccionado = valor;
    this.validadoresActualización();
    this.tramite110209Store.setTramite110209({ valorSeleccionado: valor });
  }

  /**
   * Initializes the search form with fields for certificate number, treaty/agreement, and country/block.
   * Updates validators based on the selected radio value.
   */
  private createFormDatosBusqueda(): void {
    this.datosBusquedaFormulario = this.fb.group({
      numeroDeCertificado: ['', [Validators.maxLength(20)]],
      tratadoAcuerdo: [''],
      paisBloque: ['']
    });
    this.validadoresActualización();
  }

  /**
   * Updates form validators based on the selected value.
   * 
   * - For "Por número de certificado", sets `Validators.required` on `numeroDeCertificado`.
   * - For "Por Tratado/Acuerdo País/Bloque", sets `Validators.required` on `tratadoAcuerdo` and `paisBloque`.
   * - Clears validators if no condition matches.
   */
  private validadoresActualización(): void {
    const SELECCIONADO_INDICE = this.getSelectedOptionIndex();

    this.datosBusquedaFormulario.get('numeroDeCertificado')?.setValidators(
      SELECCIONADO_INDICE === this.SEARCH_TYPE_ID.CERTIFICADO ? Validators.required : null
    );

    this.datosBusquedaFormulario.get('tratadoAcuerdo')?.setValidators(
      SELECCIONADO_INDICE === this.SEARCH_TYPE_ID.PAIS_DEL_TRATADO ? Validators.required : null
    );

    this.datosBusquedaFormulario.get('paisBloque')?.setValidators(
      SELECCIONADO_INDICE === this.SEARCH_TYPE_ID.PAIS_DEL_TRATADO ? Validators.required : null
    );

    this.datosBusquedaFormulario.get('numeroDeCertificado')?.updateValueAndValidity();
    this.datosBusquedaFormulario.get('tratadoAcuerdo')?.updateValueAndValidity();
    this.datosBusquedaFormulario.get('paisBloque')?.updateValueAndValidity();
  }

/**
 * Obtiene el índice de la opción seleccionada en el grupo de radios,
 * comparando el valor actual seleccionado con las opciones disponibles.
 */
  private getSelectedOptionIndex(): number {
    return this.radioOptions.findIndex(option => option.value === this.valorSeleccionado);
  }

 /**
   * Notificación para mostrar alertas al usuario.
   */
  alertaNotificacion!: Notificacion;
  /** 
   * Método para realizar la búsqueda y mostrar la tabla de resultados.
   */
public buscar(): void {
  if (!this.datosBusquedaFormulario.valid) {
    const INDICE = this.getSelectedOptionIndex();
      let mensaje = 'Datos requeridos';
      if (INDICE === this.SEARCH_TYPE_ID.CERTIFICADO) {
        mensaje = 'El número de certificado es requerido';
      } else if (INDICE === this.SEARCH_TYPE_ID.PAIS_DEL_TRATADO) {
        mensaje = 'La selección de un país/bloque es requerida';
      }

      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje,
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };

  } else {
    this.verTabla = true;
    this.buscarDatos();
  }
}

/**
 * Verifica si la búsqueda seleccionada corresponde a la opción de 
 * búsqueda por número de certificado.
 * @returns `true` si la opción seleccionada es "Por número de certificado", de lo contrario `false`.
 */
busquedaDeCertificado(): boolean {
  return this.getSelectedOptionIndex() === this.SEARCH_TYPE_ID.CERTIFICADO;
}

/**
 * Verifica si la búsqueda seleccionada corresponde a la opción de 
 * búsqueda por tratado, país o bloque.
 * @returns `true` si la opción seleccionada es "Por Tratado/País/Bloque", de lo contrario `false`.
 */
busquedaDeTratadoPais(): boolean {
  return this.getSelectedOptionIndex() === this.SEARCH_TYPE_ID.PAIS_DEL_TRATADO;
}


  /**
   * Restores form values from global state.
   * Subscribes to `selectSolicitud$` to fetch stored search data and updates the form.
   * Uses `distinctUntilChanged` to avoid redundant updates and `take(1)` to auto-unsubscribe.
   */
  private restaurarValoresFormulario(): void {
    this.restauraSubscription$ = this.tramite110209Query.selectTramite110209$
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((datosBusqueda) => {
        if (datosBusqueda) {
          this.datosBusquedaFormulario.patchValue(datosBusqueda, { emitEvent: false });
        }
      });
  }

  /**
   * Navigates to the "selección de trámite" page.
   * Redirects to `/pago/seleccion-tramite` using Angular's Router.
   */
  navigateToSeleccionTramite(): void {
    if (!this.filaSeleccionada) {
    this.alertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: 'Es necesario seleccionar un certificado',
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  } else {
    this.router.navigate(['../solicitud-page'], { relativeTo: this.route });
  }
  }

  /**
   * Obtiene el catálogo de tratados o acuerdos relacionados con el trámite actual.
   * 
   * Realiza una solicitud al servicio `catalogoService` para recuperar los datos de tratados/acuerdos,
   * utilizando el identificador de trámite almacenado en `this.tramites`. Los resultados se asignan a
   * la propiedad `this.tratadoAcuerdo`. La suscripción se gestiona para finalizar automáticamente cuando
   * el componente se destruye, evitando fugas de memoria.
   */
  obtenerTratadosAcuerdo(): void {
    this.catalogoService.tratadosAcuerdosCatalogoDatosNew(this.tramites)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.tratadoAcuerdo = response?.datos ?? []
        }
      });
  }

  /**
   * Obtiene el catálogo de países por bloque relacionado con los trámites actuales.
   * Realiza una solicitud al servicio de catálogo y actualiza la propiedad `paisBloque` con los datos recibidos.
   * La suscripción se cancela automáticamente cuando el componente se destruye.
   */
  obtenerPaisesBloque(): void {
    this.catalogoService.paisBloqueCatalogo(this.tramites)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => { 
            this.paisBloque = response?.datos ?? [];
        }
      });
  }

  /**
 * Actualiza el estado de selección de filas y guarda las filas seleccionadas.
 *
 * @param tieneSeleccion - Indica si hay filas seleccionadas (true) o no (false).
 */
  onRowSelectionChange(hasSelection: boolean): void {
  this.filaSeleccionada = hasSelection;
  if (hasSelection) {
    this.selectedRowsData = this.establecimientoBodyData.filter(row => row.selected);
  } else {
    this.selectedRowsData = [];
  }
}

/**
 * Obtiene la lista de países asociados a un tratado y, si hay resultados, 
 * obtiene los tratados y acuerdos relacionados al primer país clave encontrado.
 *
 * @param tratadoId - Identificador del tratado para filtrar los países.
 */
obtenerPaisesPorTratado(tratadoId: string): void {
  this.catalogoService.getPaisesPorTratado(this.tramites, tratadoId)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {        
        if (response?.datos && response.datos.length > 0) {
          this.paisBloque = response.datos;
        } else {
          this.paisBloque = [];
        }
      },
      error: (error) => {
        console.error('Error obteniendo países por tratado:', error);
        this.paisBloque = [];
      }
    });
}

/**
 * Ejecuta la búsqueda de datos según los criterios definidos en el estado actual.
 */
buscarDatos(): void {

    type CertificadoPayload =
      | { numeroCertificado: string; rfcSolicitante: string }
      | { cvePaisSeleccionado: string; cveTratadoAcuerdoSeleccionado: string; rfcSolicitante: string };

    let PAYLOAD: CertificadoPayload;
    const INDICE = this.getSelectedOptionIndex();

        if (INDICE === this.SEARCH_TYPE_ID.CERTIFICADO) {
          PAYLOAD = {
            numeroCertificado: this.datosBusquedaFormulario.get('numeroDeCertificado')?.value || '',
            rfcSolicitante: ENVIRONMENT.RFC
          };
        } else if (INDICE === this.SEARCH_TYPE_ID.PAIS_DEL_TRATADO) {
          PAYLOAD = {
            cvePaisSeleccionado: `P-${this.datosBusquedaFormulario.get('paisBloque')?.value || ''}`,
            cveTratadoAcuerdoSeleccionado: this.datosBusquedaFormulario.get('tratadoAcuerdo')?.value || '',
            rfcSolicitante: ENVIRONMENT.RFC
          };
        } else {
          return;
        }

    this.Solicitud110209Service.buscarCertificado(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response: unknown) => {
      const API_RESPONSE = response as ApiResponse;
      const DATOS: CertificadoData[] = API_RESPONSE.datos ?? [];
      this.tramite110209Store.setBuscarPayload(DATOS);

        if (DATOS.length > 0) {
          this.procesarDatosCertificado(DATOS[0]);
          this.actualizarTabla(DATOS);
        }
      });

    this.establecimientoHeaderData = this.destinatarioTableData?.encabezadoDeTabla;
}

private procesarDatosCertificado(data: CertificadoData): void {
    this.actualizarDatosTratado(data);
    this.actualizarDatosDestinatario(data);
    this.actualizarDatosTransporte(data);
    this.actualizarDatosCertificado(data);
    this.actualizarDatosMercancias(data);
}

private actualizarDatosTratado(data: CertificadoData): void {
    this.tramite110209Store.setTramite110209({ tratadoAcuerdo: data.tratadoAsociado.nombre ?? '' });
    this.tramite110209Store.setTramite110209({ paisBloque: data.paisAsociado.nombre ?? '' });
    this.tramite110209Store.setTramite110209({ paisOrigen: data.cvePaisFabricacion || 'México' });
    this.tramite110209Store.setTramite110209({ paisDestino: data.paisAsociado.nombre ?? '' });
    this.tramite110209Store.setTramite110209({ fechaExpedicion: data.fechaExpedicion ?? '' });
    this.tramite110209Store.setTramite110209({ fechaVencimiento: data.fechaVencimiento ?? '' });
}

private actualizarDatosDestinatario(data: CertificadoData): void {
    const PERSONA = data.solicitud.personaSolicitud;
    this.tramite110209Store.setTramite110209({ nombre: PERSONA.nombre ?? '' });
    this.tramite110209Store.setTramite110209({ primerApellido: PERSONA.apellidoMaterno ?? '' });
    this.tramite110209Store.setTramite110209({ segundoApellido: PERSONA.apellidoPaterno ?? '' });
    this.tramite110209Store.setTramite110209({ numeroDeRegistroFiscal: PERSONA.numeroIdentificacionFiscal ?? '' });
    this.tramite110209Store.setTramite110209({ razonSocial: PERSONA.razonSocial ?? '' });

    const DOMICILIO = PERSONA.domicilio;
    this.tramite110209Store.setTramite110209({ calle: DOMICILIO.calle ?? '' });
    this.tramite110209Store.setTramite110209({ numeroLetra: DOMICILIO.letra ?? '' });
    this.tramite110209Store.setTramite110209({ ciudad: DOMICILIO.ciudad ?? '' });
    this.tramite110209Store.setTramite110209({ correoElectronico: PERSONA.correoElectronico ?? '' });
    this.tramite110209Store.setTramite110209({ fax: DOMICILIO.fax ?? '' });
    this.tramite110209Store.setTramite110209({ telefono: DOMICILIO.telefono ?? '' });
}

private actualizarDatosTransporte(data: CertificadoData): void {
    this.tramite110209Store.setTramite110209({ medioDeTransporte: data.medioTransporte });
    this.tramite110209Store.setTramite110209({ rutaCompleta: data.rutaCompleta });
    this.tramite110209Store.setTramite110209({ puertoDeEmbarque: data.puertoEmbarque });
    this.tramite110209Store.setTramite110209({ puertoDeDesembarque: data.puertoDesembarque });
}

private actualizarDatosCertificado(data: CertificadoData): void {
    this.tramite110209Store.setTramite110209({ observaciones: data.observaciones });
}

private actualizarDatosMercancias(data: CertificadoData): void {
    const MERCANCIA = data.mercanciasAsociadas[0];

        this.tramite110209Store.setTramite110209({ 
        mercanciasSeleccionadas: {
            numeroDeOrden: MERCANCIA.numeroOrden ?? '',
            fraccionArancelaria: MERCANCIA.fraccionArancelaria ?? '',
            nombreTecnico: MERCANCIA.nombreTecnico ?? '',
            nombreComercial: MERCANCIA.nombreComercial ?? '',
            nombreIngles: MERCANCIA.nombreIngles ?? '',
            numeroDeRegistro: MERCANCIA.numeroRegistro ?? '',
        }
    });

    this.tramite110209Store.setTramite110209({ descripcion: MERCANCIA.complementoDescripcion ?? '' });
    this.tramite110209Store.setTramite110209({ marca: MERCANCIA.marca ?? '' });
    this.tramite110209Store.setTramite110209({ valorMercancia: MERCANCIA.valorMercancia ?? '' });
    this.tramite110209Store.setTramite110209({ cantidad: MERCANCIA.cantidad ?? '' });
    this.tramite110209Store.setTramite110209({ unidadMedida: MERCANCIA.unidadMedidaComercial ?? '' });
    this.tramite110209Store.setTramite110209({ numeroFactura: MERCANCIA.numeroFactura ?? '' });
    this.tramite110209Store.setTramite110209({ tipoFactura: MERCANCIA.tipoFactura ?? '' });
    this.tramite110209Store.setTramite110209({ fechaFactura: MERCANCIA.fechaFactura ?? '' });
}

private actualizarTabla(datos: CertificadoData[]): void {
    const CUERPO_TABLA = datos.map((item: CertificadoData) => ({
      numeroDeCertificado: item.numeroCertificado,
      expedicion: item.fechaExpedicion,
      vencimiento: item.fechaVencimiento,
    }));

    this.establecimientoBodyData = [];
    CUERPO_TABLA.forEach((row: TablaRow) => {
      const TABLE_ROW: TableBodyData = { tbodyData: [] };
      TABLE_ROW.tbodyData = [row.numeroDeCertificado, row.expedicion, row.vencimiento];
      this.establecimientoBodyData.push(TABLE_ROW);
    });
}

  /** 
   * Método de ciclo de vida de Angular que se ejecuta cuando el componente se destruye.  
   * Emite un valor en `unsubscribe$` para notificar a los observables que deben finalizar.  
   * Luego, marca `unsubscribe$` como completado para liberar memoria y evitar fugas de suscripción.  
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
