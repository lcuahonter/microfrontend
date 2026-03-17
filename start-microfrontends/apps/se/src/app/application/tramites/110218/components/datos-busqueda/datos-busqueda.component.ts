import { CatalogoServices, InputRadioComponent, Notificacion, NotificacionesComponent, TableBodyData, TableComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, Subscription, distinctUntilChanged,takeUntil } from 'rxjs';
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

import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';
import { Tramite110218Query } from '../../estados/queries/tramite110218.query';
import { Tramite110218Store } from '../../estados/tramites/tramite110218.store';

@Component({
  selector: 'app-datos-busqueda',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, InputRadioComponent, CatalogoSelectComponent, TableComponent,NotificacionesComponent],
  templateUrl: './datos-busqueda.component.html',
})
export class DatosBusquedaComponent implements OnInit, OnDestroy {

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
  * Valor predeterminado: '110218'.
  */
  tramites:string='110218';

  /** 
   * Constructor del componente.
   * Se inyectan las dependencias necesarias para el funcionamiento del componente.
   *
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Router} router - Servicio para la navegación entre rutas.
   * @param {Tramite110218Query} tramite110218Query - Consulta para manejar datos del trámite 110218.
   * @param {Tramite110218Store} tramite110218Store - Almacenamiento para manejar el estado del trámite 110218.
   */
  constructor(
    private fb: FormBuilder, // Servicio para construir formularios reactivos
    private router: Router, // Servicio para la navegación entre rutas
    private consultaQuery: ConsultaioQuery,
    private route: ActivatedRoute,
    private Solicitud110218Service: CertificadoTecnicoJaponService,
    private tramite110218Query: Tramite110218Query,
    private tramite110218Store: Tramite110218Store,
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
    this.Solicitud110218Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.Solicitud110218Service.actualizarEstadoFormulario(resp);
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
    this.tramite110218Query.valorSeleccionado$
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
      .subscribe(valor => this.tramite110218Store.setTramite110218State({ numeroDeCertificado: valor }));

    /** 
     * Escucha los cambios en el campo "tratadoAcuerdo" del formulario.  
     * Si el usuario cambia el valor, este se almacena en la tienda de Akita  
     * llamando al método setTratadoAcuerdo.  
     */
    this.datosBusquedaFormulario.get('tratadoAcuerdo')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(valor => this.tramite110218Store.setTramite110218State({ tratadoAcuerdo: valor }));

    /** 
     * Escucha los cambios en el campo "paisBloque" del formulario.  
     * Cualquier modificación en este campo se refleja en el estado global  
     * de la aplicación a través del método setPaisBloque de la tienda.  
     */
    this.datosBusquedaFormulario.get('paisBloque')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(valor => this.tramite110218Store.setTramite110218State({ paisBloque: valor }));


    this.destinatarioTableData.encabezadoDeTabla = destinatarioTable?.encabezadoDeTabla;
    this.destinatarioTableData.cuerpoTabla = destinatarioTable?.cuerpoTabla;

    /** 
    * Llama a la función para obtener los datos del establecimiento.
    */
    this.getEstableCimiento();

    /**
    * Llama a la función para obtener los tratados y acuerdos.
    */
    this.obtenerTratadosAcuerdos();

    /**
    * Llama a la función para obtener los países y bloques.
    */
    this.obtenerPaisesBloque();
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
    this.tramite110218Store.setTramite110218State({ valorSeleccionado: valor });
  }

  /**
   * Assigns establishment table data, including headers and body, from a JSON file.
   */
  private getEstableCimiento(): void {
    this.establecimientoHeaderData = this.destinatarioTableData?.encabezadoDeTabla;
    this.establecimientoBodyData = this.destinatarioTableData?.cuerpoTabla;
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
    this.datosBusquedaFormulario.get('numeroDeCertificado')?.setValidators(
      this.valorSeleccionado === 'Por número de certificado' ? Validators.required : null
    );

    this.datosBusquedaFormulario.get('tratadoAcuerdo')?.setValidators(
      this.valorSeleccionado === 'Por Tratado/Acuerdo País/Bloque' ? Validators.required : null
    );

    this.datosBusquedaFormulario.get('paisBloque')?.setValidators(
      this.valorSeleccionado === 'Por Tratado/Acuerdo País/Bloque' ? Validators.required : null
    );

    this.datosBusquedaFormulario.get('numeroDeCertificado')?.updateValueAndValidity();
    this.datosBusquedaFormulario.get('tratadoAcuerdo')?.updateValueAndValidity();
    this.datosBusquedaFormulario.get('paisBloque')?.updateValueAndValidity();
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
    if (this.valorSeleccionado === 'Por número de certificado') {
      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'El número de certificado es requerido',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else if (this.valorSeleccionado === 'Por Tratado/Acuerdo País/Bloque') {
      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'La selección de un país/bloque es requerida',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  } else {
    this.verTabla = true;
  }
}


  /**
   * Restores form values from global state.
   * Subscribes to `selectSolicitud$` to fetch stored search data and updates the form.
   * Uses `distinctUntilChanged` to avoid redundant updates and `take(1)` to auto-unsubscribe.
   */
  private restaurarValoresFormulario(): void {
    this.restauraSubscription$ = this.tramite110218Query.selectTramite110218State$
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
    this.router.navigate(['../validar-certificado-tecnico'], { relativeTo: this.route });
  }

  /**
   * Obtiene el catálogo de tratados o acuerdos relacionados con el trámite actual.
   * 
   * Realiza una solicitud al servicio `catalogoService` para recuperar los datos de tratados/acuerdos,
   * utilizando el identificador de trámite almacenado en `this.tramites`. Los resultados se asignan a
   * la propiedad `this.tratadoAcuerdo`. La suscripción se gestiona para finalizar automáticamente cuando
   * el componente se destruye, evitando fugas de memoria.
   */
  obtenerTratadosAcuerdos(): void {
    this.catalogoService.tratadosAcuerdosCatalogo(this.tramites,"TITRAC.TA")
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
   * Método de ciclo de vida de Angular que se ejecuta cuando el componente se destruye.  
   * Emite un valor en `unsubscribe$` para notificar a los observables que deben finalizar.  
   * Luego, marca `unsubscribe$` como completado para liberar memoria y evitar fugas de suscripción.  
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
