import { CLASIFICACION, CONFIGURACION, CONFIGURACION_CERTIFICACION_DE_EMPRESAS, CONFIGURACION_COMERCIAL_CERTIFICADO, PAGO_DE_DERECHOS, RADIO_OPCIONS } from '../../constants/agente-aduanal.enum';
import { Catalogo, CatalogoSelectComponent, CrosslistComponent, ModeloDeFormaDinamica, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitude32612DosState, Tramite32612DosStore } from '../../estados/solicitud32612Dos.store';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CROSLISTA_ENTRADA } from '../../constants/croslista.enums';
import { CommonModule } from '@angular/common';
import { EsquemaDeCertificacionService } from '../../services/esquema-de-certificacion.service';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { SociedadesTablaComponent } from '../sociedades-tabla/sociedades-tabla.component';
import { Tramite32612DosQuery } from '../../estados/solicitud32612Dos.query';
import { Tramite32612Query } from '../../estados/solicitud32612.query';

/**
 * Componente para la gestión de datos del agente aduanal en el trámite 32612.
 * Permite la visualización y edición de información relacionada con el agente aduanal,
 * incluyendo datos de certificación, clasificación, pago de derechos y selección de aduanas de entrada.
 *
 * @remarks
 * Utiliza formularios reactivos para la captura y edición de datos, y se integra con los stores y queries
 * para la gestión del estado global de la aplicación. El componente puede operar en modo solo lectura
 * dependiendo del estado de la consulta.
 */
@Component({
  selector: 'app-agente-aduanal',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    CrosslistComponent,
    TituloComponent,
    SociedadesTablaComponent,
    FormasDinamicasComponent,
    ReactiveFormsModule,
    TituloComponent
  ],
  templateUrl: './agente-aduanal.component.html',
  styleUrl: './agente-aduanal.component.scss',
})
export class AgenteAduanalComponent implements OnInit,OnDestroy {

  /**
   * Representa el estado actual de la consulta para el componente.
   * Esta entrada se espera que sea de tipo `ConsultaioState` y se utiliza para
   * controlar o reflejar el estado de la consulta dentro del componente Agente Aduanal.
   */
  @Input() consultaState!: ConsultaioState;
  /**
   * Una QueryList que contiene todas las instancias de {@link CrosslistComponent} encontradas dentro de la vista de este componente.
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;
  /**
   * Subject utilizado para notificar y completar las suscripciones cuando el componente es destruido.
   * Ayuda a prevenir fugas de memoria al emitir un valor y completar todos los observables
   * que están suscritos a este notificador, típicamente en el hook de ciclo de vida `ngOnDestroy`.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Almacena la lista de elementos de catálogo relacionados con la selección "indique".
   * Cada elemento del arreglo es de tipo {@link Catalogo}.
   * Se utiliza para poblar campos desplegables o de selección en el componente Agente Aduanal.
   */
  public indiqueCatalogo: Catalogo[] = [];
  /**
   * Lista de aduanas de entrada disponibles para selección.
   * 
   * Esta propiedad expone la constante `CROSLISTA_ENTRADA`, que contiene las opciones
   * de aduanas de entrada que pueden ser seleccionadas en el componente.
   */
  public seleccionarAduanasEntrada = CROSLISTA_ENTRADA;
  /**
   * Almacena la lista de aduanas de entrada seleccionadas como identificadores de tipo string.
   * Se utiliza para llevar el control de las aduanas seleccionadas por el usuario durante el ingreso de datos.
   */
  public seleccionadasAduanasEntradaDatos: string[] = [];
  /**
   * Un arreglo de configuraciones de botones para gestionar las aduanas de entrada.
   * Cada objeto representa un botón con un nombre, clase CSS y una acción asociada.
   */
  public aduanasEntradaBotons = [
    {
      btnNombre: 'Agregar',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Agregar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Eliminar',
      class: 'btn-danger',
      funcion: (): void => this.crossList.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Eliminar todas',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * Instancia de FormGroup para gestionar los controles y validaciones del formulario de Agente Aduanal.
   *
   * @type {FormGroup}
   */
  public formaAgente!: FormGroup;
  /**
   * Grupo principal de formularios que contiene grupos de formularios anidados para diferentes secciones del componente Agente Aduanal.
   *
   * @property agenteFormGroup - Grupo de formulario para los campos relacionados con el Agente Aduanal.
   * @property comercialCertificadoFormGroup - Grupo de formulario para los campos relacionados con el Certificado Comercial.
   * @property clasificacionFormGroup - Grupo de formulario para los campos relacionados con la Clasificación.
   * @property pagoDeDerechosFormGroup - Grupo de formulario para los campos relacionados con el Pago de Derechos.
   */
  public forma: FormGroup = new FormGroup({
    agenteFormGroup: new FormGroup({}),
    comercialCertificadoFormGroup: new FormGroup({}),
    clasificacionFormGroup: new FormGroup({}),
    pagoDeDerechosFormGroup: new FormGroup({}),
    certificacionDeEmpresasFormGroup: new FormGroup({})
  });
  /**
   * Almacena el objeto de configuración para el componente "Agente Aduanal".
   * Este objeto se importa desde la constante global `CONFIGURACION` y contiene
   * todos los ajustes y datos necesarios para la funcionalidad del componente.
   */
  public agenteDatos = CONFIGURACION;
  /**
   * Almacena la configuración dinámica del formulario para la sección "Comercial Certificado".
   */
  public comercialCertificadoDatos: ModeloDeFormaDinamica[] = CONFIGURACION_COMERCIAL_CERTIFICADO;
  /**
   * Almacena los datos de clasificación para el componente, inicializados con el valor de `CLASIFICACION`.
   * Esta propiedad se utiliza para gestionar y mostrar la información relacionada con la clasificación dentro del componente Agente Aduanal.
   */
  public clasificacionDatos = CLASIFICACION;
  /**
   * Contiene los datos relacionados con el pago de derechos.
   * 
   * Esta propiedad se inicializa con el valor de `PAGO_DE_DERECHOS`, que se espera
   * que contenga la información necesaria para procesar o mostrar los detalles de pago.
   */
  public pagoDeDerechosDatos = PAGO_DE_DERECHOS;
  /**
   * Representa el estado actual de la solicitud para el trámite 32612.
   * Esta propiedad contiene toda la información relevante sobre la solicitud,
   * incluyendo su estado, datos asociados y cualquier actualización realizada
   * durante el flujo de trabajo de la aplicación.
   *
   * @type {Solicitude32612State}
   */
  public solicitudeState!: Solicitude32612State;
  /**
   * Almacena el estado actual para el proceso "Solicitude 32612 Dos".
   * 
   * Esta propiedad se espera que se inicialice con una instancia de `Solicitude32612DosState`,
   * la cual gestiona los datos y la lógica relacionada con la segunda parte del flujo de solicitud.
   */
  public solicitudeDosState!: Solicitude32612DosState;
  /**
   * Indica si el formulario debe mostrarse en modo solo lectura..
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Almacena la configuración para la sección "Certificación de Empresas".
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_CERTIFICACION_DE_EMPRESAS`,
   * que contiene los ajustes y parámetros necesarios para gestionar el proceso de
   * certificación de empresas dentro de la aplicación.
   */
  public certificacionDeEmpresasDatos = CONFIGURACION_CERTIFICACION_DE_EMPRESAS;

  /**
   * Inicializa el AgenteAduanalComponent con los servicios y stores requeridos.
   * 
   * Se suscribe al observable `selectConsultaioState$` de `ConsultaioQuery` para monitorear cambios
   * en el estado de consultaio. Actualiza la propiedad `esFormularioSoloLectura` según el flag `readonly`
   * en el estado y recrea el formulario en consecuencia.
   * 
   * @param esquemaDeCertificacionSvc Servicio para operaciones de esquema de certificación.
   * @param tramite32612Store Store para gestionar el estado relacionado con el trámite 32612.
   * @param tramite32612Query Query para acceder al estado del trámite 32612.
   * @param fb FormBuilder para construir formularios reactivos.
   * @param tramiteStore Store para gestionar el estado relacionado con el trámite 32612 Dos.
   * @param tramiteQuery Query para acceder al estado del trámite 32612 Dos.
   * @param consultaioQuery Query para acceder al estado de consultaio.
   */
  constructor(
    private esquemaDeCertificacionSvc: EsquemaDeCertificacionService,
    private tramite32612Store: Tramite32612Store,
    private tramite32612Query: Tramite32612Query,
    private fb: FormBuilder,
    private tramiteStore: Tramite32612DosStore,
    private tramiteQuery: Tramite32612DosQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.crearFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de un componente.
   * 
   * - Se suscribe a los observables `selectSolicitude$` y `selectSolicitudeDos$` de las queries respectivas,
   *   actualizando las propiedades locales de estado (`solicitudeState` y `solicitudeDosState`) cuando llegan nuevos datos.
   * - Garantiza que las suscripciones se limpien correctamente utilizando `takeUntil` con `destroyNotifier$`.
   * - Inicializa los datos de catálogo llamando a `getIndiqueCatalogoDatos()`.
   * - Configura el formulario invocando `crearFormulario()`.
   */
  ngOnInit(): void {
    this.tramite32612Query.selectSolicitude$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudeState = seccionState;
        })
      ).subscribe();
    this.tramiteQuery.selectSolicitudeDos$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudeDosState = seccionState;
        })
      ).subscribe();
    this.getIndiqueCatalogoDatos();
    this.crearFormulario();
  }

  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'agenteFormGroup' del formulario principal.
   *
   * @returns El `FormGroup` correspondiente al control 'agenteFormGroup'.
   */
  get agenteFormGroup(): FormGroup {
    return this.forma.get('agenteFormGroup') as FormGroup;
  }

  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'comercialCertificadoFormGroup' del formulario principal.
   *
   * @returns {FormGroup} El grupo de formulario correspondiente a 'comercialCertificadoFormGroup'.
   */
  get comercialCertificadoFormGroup(): FormGroup {
    return this.forma.get('comercialCertificadoFormGroup') as FormGroup;
  }

  /**
   * Obtiene el 'clasificacionFormGroup' como un FormGroup desde el formulario principal.
   * 
   * @returns La instancia de FormGroup asociada a 'clasificacionFormGroup'.
   */
  get clasificacionFormGroup(): FormGroup {
    return this.forma.get('clasificacionFormGroup') as FormGroup;
  }

  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'pagoDeDerechosFormGroup'
   * del formulario principal (`forma`). Normalmente se utiliza para acceder o manipular
   * el grupo de formulario de pago de derechos dentro del componente.
   *
   * @returns El `FormGroup` correspondiente a 'pagoDeDerechosFormGroup'.
   */
  get pagoDeDerechosFormGroup(): FormGroup {
    return this.forma.get('pagoDeDerechosFormGroup') as FormGroup;
  }

  /**
   * Obtiene la instancia de FormGroup asociada al control 'certificacionDeEmpresasFormGroup' del formulario principal.
   * 
   * @returns {FormGroup} El FormGroup correspondiente al control 'certificacionDeEmpresasFormGroup'.
   */
  get certificacionDeEmpresasFormGroup(): FormGroup {
    return this.forma.get('certificacionDeEmpresasFormGroup') as FormGroup;
  }

  /**
   * Inicializa el formulario reactivo `formaAgente` para el componente Agente Aduanal.
   * 
   * El formulario contiene los siguientes controles:
   * - `numeroPatente`: Número de patente del agente.
   * - `numeroRegistro`: Número de registro del agente.
   * - `nombreAgenteAduanal`: Nombre del agente aduanal.
   * - `numeroTrabajadoresIMSS`: Número de trabajadores registrados en el IMSS.
   * - `numeroTrabajadoresContratistas`: Número de trabajadores contratistas.
   * - `serviciosAdicionales`: Servicios adicionales proporcionados.
   * - `indique`: Información adicional o indicación.
   * 
   * Los valores iniciales de cada control se obtienen de `solicitudeDosState`.
   */
  public crearAgenteForm(): void {
    this.formaAgente = this.fb.group({
      numeroPatente: [this.solicitudeDosState?.numeroPatente],
      numeroRegistro: [this.solicitudeDosState?.numeroRegistro],
      nombreAgenteAduanal: [this.solicitudeDosState?.nombreAgenteAduanal],
      numeroTrabajadoresIMSS: [this.solicitudeDosState?.numeroTrabajadoresIMSS],
      numeroTrabajadoresContratistas: [this.solicitudeDosState?.numeroTrabajadoresContratistas],
      serviciosAdicionales: [this.solicitudeDosState?.serviciosAdicionales],
      indique: [this.solicitudeDosState?.indique]
    });
  }

  /**
   * Obtiene los datos del "Catálogo Indique" desde el servicio de certificación y los asigna a `indiqueCatalogo`.
   * 
   * Se suscribe al observable retornado por `getIndiqueCatalogo` del servicio `esquemaDeCertificacionSvc`,
   * y actualiza la propiedad local `indiqueCatalogo` con los datos de la respuesta.
   * La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor.
   * 
   * Maneja errores en la suscripción, pero no implementa lógica específica para el manejo de errores.
   */
  public getIndiqueCatalogoDatos(): void {
    this.esquemaDeCertificacionSvc.getIndiqueCatalogo().pipe(takeUntil(this.destroyNotifier$)).subscribe({
      next: (response) => {
        const API_RESPONSE = JSON.parse(JSON.stringify(response));
        this.indiqueCatalogo = API_RESPONSE.data;
      },
      error: (error) => {
        // Manejo de errores
      }
    });
  }

  /**
   * Itera sobre una lista de mapeos campo-control y actualiza la propiedad `mostrar`
   * de los elementos correspondientes en `comercialCertificadoDatos` según el valor del control del formulario.
   *
   * Para cada mapeo en `CAMPOS`, busca el elemento en `comercialCertificadoDatos` cuyo `campo`
   * coincida con el `campo` del mapeo. Si lo encuentra, establece su propiedad `mostrar` en `true` si el valor
   * del control del formulario (especificado por `control`) es `'Si'`, de lo contrario la establece en `false`.
   * La función procesa los mapeos de forma recursiva.
   *
   * @param CAMPOS - Un arreglo de objetos que especifica el mapeo entre campos de datos (`campo`)
   *                 y controles del formulario (`control`). Por defecto utiliza una lista predefinida de mapeos.
   */
  public seleccionarDatos(CAMPOS: { campo: string, control: string }[] = [
    { campo: 'pagina', control: 'paginaElectronica' },
    { campo: 'correo', control: 'correoElectronico' },
    { campo: 'telefonoUno', control: 'telefonoContacto' },
    { campo: 'lada', control: 'telefonoContacto' },
    { campo: 'telefonoDos', control: 'telefonoContacto' },
    { campo: 'ladaDos', control: 'telefonoContacto' },
    { campo: 'telefonoTres', control: 'telefonoContacto' },
    { campo: 'ladaTres', control: 'telefonoContacto' }
  ]): void {
    if (!Array.isArray(this.comercialCertificadoDatos)) { return; }
    if (!CAMPOS.length) { return; }

    const [{ campo: CAMPO, control: CONTROL }, ...REST] = CAMPOS;
    const CONTROL_VALUE = this.comercialCertificadoFormGroup.get(CONTROL)?.value;
    const INDEX = this.comercialCertificadoDatos.findIndex((ITEM: Partial<ModeloDeFormaDinamica>) => ITEM.campo === CAMPO);

    if (INDEX !== -1) {
      this.comercialCertificadoDatos[INDEX] = {
        ...this.comercialCertificadoDatos[INDEX],
        mostrar: CONTROL_VALUE === 'Si'
      };
    }

    if (REST.length) {
      this.seleccionarDatos(REST);
    }
  }

  /**
   * Emite un cambio de valor para un campo dinámico en el tramite32612Store.
   *
   * @param event - Un objeto que contiene el nombre del campo (`campo`) y su nuevo valor (`valor`).
   */
  public emitirCambioDeValor(event: {campo: string, valor: string}): void {
    this.tramite32612Store.setDynamicFieldValue(event.campo, event.valor);
  }

  /**
   * Establece un valor en el store invocando el método especificado en `tramiteStore` con el valor
   * obtenido del control de formulario proporcionado.
   *
   * @param form - El `FormGroup` que contiene los controles del formulario.
   * @param campo - El nombre del control de formulario cuyo valor será obtenido.
   * @param metodoNombre - La clave del método en `Tramite32612DosStore` que será llamado con el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32612DosStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramiteStore[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Crea el formulario para el componente Agente Aduanal.
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), guarda los datos del formulario.
   * De lo contrario, inicializa el formulario del agente para edición o creación.
   */
  public crearFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearAgenteForm();
    }
  }

  /**
   * Maneja el proceso de guardado de los datos del formulario del agente.
   *
   * - Inicializa el formulario del agente llamando a `crearAgenteForm()`.
   * - Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es `true`), deshabilita los controles del formulario.
   * - De lo contrario, habilita los controles del formulario para su edición.
   */
  public guardarDatosFormulario(): void {
    this.crearAgenteForm();
    if (this.esFormularioSoloLectura) {
      this.formaAgente.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formaAgente.enable();
    }
  }

  /**
   * Método del ciclo de vida que se llama cuando el componente es destruido.
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a los suscriptores
   * que deben limpiar recursos y cancelar la suscripción a los observables.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
