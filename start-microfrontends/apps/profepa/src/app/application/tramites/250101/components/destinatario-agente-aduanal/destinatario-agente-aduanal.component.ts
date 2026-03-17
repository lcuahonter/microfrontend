import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite250101State, Tramite250101Store } from '../../estados/tramite250101.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DESTINATARIO_OPCIONES_DE_BOTON_DE_RADIO } from '../../constantes/flora-fauna.enum';
import { DestinatarioService } from '../../services/destinatario.service';
import { DestinatarioTablaDatos } from '../../models/flora-fauna.models';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { ModalComponent } from '../modal/modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TablaDatos } from '../../models/flora-fauna.models';
import { TableComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite250101Query } from '../../estados/tramite250101.query';
import { Validators } from '@angular/forms';
import datosAgenteDummy from '@libs/shared/theme/assets/json/250101/datos-agente-dummy.json';
import datosDestinatarioDummy from '@libs/shared/theme/assets/json/250101/datos-destinatario-dummy.json'
/**
 * Componente encargado de gestionar la visualización y manipulación de los datos relacionados con el destinatario 
 * y el agente aduanal dentro del trámite 250101.
 * Permite al usuario ingresar los datos correspondientes al destinatario, como razón social, dirección, 
 * código postal, país y estado, así como los datos del agente aduanal, como nombre, apellidos y patente.
 * 
 * Este componente utiliza formularios reactivos para gestionar los datos y se comunica con el store para 
 * almacenar y actualizar la información relacionada con el destinatario y el agente aduanal.
 * 
 * Además, gestiona la visualización de tablas y modales para mostrar y editar los datos de manera interactiva.
 * 
 * @component
 * @example
 * <app-destinatario-agente-aduanal></app-destinatario-agente-aduanal>
 * 
 * @imports
 * - `CommonModule`: Módulo común de Angular para importar funcionalidades básicas.
 * - `TableComponent`: Componente para mostrar tablas en la interfaz.
 * - `InputRadioComponent`: Componente para crear opciones de botones de radio.
 * - `TituloComponent`: Componente para mostrar el título en la interfaz.
 * - `ModalComponent`: Componente para mostrar modales en la interfaz.
 * - `CatalogoSelectComponent`: Componente para seleccionar valores de un catálogo.
 * - `ReactiveFormsModule`: Módulo necesario para trabajar con formularios reactivos en Angular.
 * 
 * @example
 * <app-destinatario-agente-aduanal></app-destinatario-agente-aduanal>
 */
@Component({
  selector: 'app-destinatario-agente-aduanal',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    InputRadioComponent,
    TituloComponent,
    ModalComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './destinatario-agente-aduanal.component.html',
  styleUrl: './destinatario-agente-aduanal.component.scss',
  encapsulation: ViewEncapsulation.None,
})
/**
 * Componente encargado de gestionar la visualización y manipulación de los datos relacionados con el destinatario 
 * y el agente aduanal dentro del trámite 250101. Permite al usuario ingresar los datos correspondientes al destinatario, 
 * como razón social, dirección, código postal, país y estado, así como los datos del agente aduanal, como nombre, 
 * apellidos y patente.
 * 
 * Utiliza formularios reactivos para gestionar los datos y se comunica con el store para almacenar y actualizar 
 * la información relacionada con el destinatario y el agente aduanal.
 * Además, gestiona la visualización de tablas y modales para mostrar y editar los datos de manera interactiva.
 * 
 * @class
 * @implements OnInit, OnDestroy
 * @example
 * <app-destinatario-agente-aduanal></app-destinatario-agente-aduanal>
 * 
 * @constructor
 * El constructor inicializa las dependencias necesarias y prepara los formularios reactivos para gestionar los 
 * datos del destinatario y el agente aduanal.
 * 
 * @property {boolean} showTableDiv - Determina si la tabla del destinatario debe ser visible en la interfaz.
 * @property {boolean} showDestinatarioModal - Determina si el modal para el destinatario debe ser visible.
 * @property {boolean} showAgenteModal - Determina si el modal para el agente aduanal debe ser visible.
 * @property {boolean} showAceptarModal - Determina si el modal de aceptación debe ser visible.
 * @property {string} destinatarioOpcionDeBotonDeRadio - Almacena las opciones de botones de radio para el destinatario.
 * @property {FormGroup} formDestinatariosModal - Formulario reactivo para gestionar los datos del destinatario.
 * @property {FormGroup} formAgenteAduanal - Formulario reactivo para gestionar los datos del agente aduanal.
 * @property {Catalogo[]} paisData - Lista de países obtenida del catálogo.
 * @property {Catalogo[]} estadoData - Lista de estados obtenida del catálogo.
 * @property {string[]} tablaDestinatarioData - Datos de las columnas para la tabla del destinatario.
 * @property {string[]} tablaAgenteAduanalData - Datos de las columnas para la tabla del agente aduanal.
 * @property {TablaDatos[]} tablaDestinatarioFilaDatos - Filas de datos de la tabla del destinatario.
 * @property {TablaDatos[]} tablaAgenteAduanaFilaDatos - Filas de datos de la tabla del agente aduanal.
 * 
 * @method ngOnInit() - Método que se ejecuta cuando el componente es inicializado. Obtiene los datos necesarios 
 * de las tablas relacionadas con el destinatario y el agente aduanal.
 * @method ngOnDestroy() - Método que se ejecuta cuando el componente es destruido, asegurando que los recursos 
 * se liberen correctamente.
 */
export class DestinatarioAgenteAduanalComponent implements OnInit, OnDestroy {
  /**
 * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
 * Este Subject se utiliza para notificar cuando el componente debe ser destruido y limpiar las suscripciones.
 * La combinación de `takeUntil(this.destroy$)` en los observables asegura que las suscripciones se cierren adecuadamente 
 * cuando el componente es destruido.
 * 
 * @type {Subject<void>} 
 */
  private destroy$ = new Subject<void>();
/**
 * Controla la visibilidad de la tabla en la interfaz de usuario.
 * Si `true`, se muestra la tabla relacionada con el destinatario.
 * Si `false`, la tabla no se mostrará.
 * 
 * @type {boolean}
 */
public showTableDiv = true;
  /**
 * Controla la visibilidad del modal para ingresar datos del destinatario.
 * Si `true`, el modal del destinatario será visible.
 * Si `false`, el modal estará oculto.
 * 
 * @type {boolean}
 */
 public showDestinatarioModal = false;
  /**
 * Controla la visibilidad del modal para ingresar datos del agente aduanal.
 * Si `true`, el modal del agente aduanal será visible.
 * Si `false`, el modal estará oculto.
 * 
 * @type {boolean}
 */
 public showAgenteModal = false;
  /**
 * Controla la visibilidad del modal de aceptación.
 * Si `true`, el modal de aceptación será visible.
 * Si `false`, el modal estará oculto.
 * 
 * @type {boolean}
 */
 public showAceptarModal = false;
  /**
 * Variable que almacena las opciones de botones de radio disponibles para el destinatario, 
 * definidas en la constante `DESTINATARIO_OPCIONES_DE_BOTON_DE_RADIO`. 
 * Esta variable se utiliza para controlar las opciones seleccionadas por el usuario en la interfaz.
 * @type {typeof DESTINATARIO_OPCIONES_DE_BOTON_DE_RADIO}
 */

 public destinatarioOpcionDeBotonDeRadio = DESTINATARIO_OPCIONES_DE_BOTON_DE_RADIO;
/**
 * Formulario reactivo para gestionar los datos ingresados en el modal del destinatario, 
 * utilizado para validar y almacenar la información proporcionada por el usuario.
 * @type {FormGroup}
 */
  public formDestinatariosModal!: FormGroup;
  /**
 * Formulario reactivo para gestionar los datos ingresados en el modal del agente aduanal, 
 * utilizado para validar y almacenar la información proporcionada por el usuario.
 * @type {FormGroup}
 */
  public formAgenteAduanal!: FormGroup;
/**
 * Almacena los datos de los países obtenidos del catálogo, representados como una lista de objetos `Catalogo`.
 * @type {Catalogo[]}
 */
 public paisData: Catalogo[] = [];
  /**
 * Almacena los datos de los estados obtenidos del catálogo, representados como una lista de objetos `Catalogo`.
 * @type {Catalogo[]}
 */
 public estadoData: Catalogo[] = [];
  /**
 * Almacena las columnas de la tabla del destinatario, representadas como una lista de cadenas de texto (`string[]`).
 * @type {string[]}
 */
 public tablaDestinatarioData: string[] = [];
  /**
 * Almacena las columnas de la tabla del agente aduanal, representadas como una lista de cadenas de texto (`string[]`).
 * @type {string[]}
 */
 public tablaAgenteAduanalData: string[] = [];
/**
 * Almacena los datos de las filas de la tabla del destinatario, representados como una lista de objetos `TablaDatos`.
 * @type {TablaDatos[]}
 */
 public tablaDestinatarioFilaDatos: TablaDatos[] = [];
  /**
 * Almacena los datos de las filas de la tabla del agente aduanal, representados como una lista de objetos `TablaDatos`.
 * @type {TablaDatos[]}
 */
 public tablaAgenteAduanaFilaDatos: TablaDatos[] = [];
 /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;

   /** Estado actual del trámite 270201 asociado a la solicitud. 
   * Contiene datos del flujo y validaciones del proceso. */
   public solicitudState!: Tramite250101State;

/**
 * Constructor del componente que inyecta las dependencias necesarias para su funcionamiento.
 * @param {FormBuilder} fb - Inyecta el servicio `FormBuilder` para crear formularios reactivos.
 * @param {DestinatarioService} destinatarioService - Inyecta el servicio que gestiona las operaciones relacionadas con destinatarios.
 * @param {Tramite250101Store} tramite250101Store - Inyecta el store para gestionar el estado de la solicitud 250101.
 */
  constructor(
    private fb: FormBuilder,
    private destinatarioService: DestinatarioService,
    private tramite250101Store: Tramite250101Store,
    private tramite250101Query: Tramite250101Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    //
  }
/**
 * Método que se ejecuta al inicializar el componente. 
 * Realiza una llamada al servicio `DestinatarioService` para obtener los datos del encabezado de la tabla de destinatarios 
 * y los asigna a la propiedad `tablaDestinatarioData`.
 * Utiliza `takeUntil(this.destroy$)` para gestionar la suscripción y evitar pérdidas de memoria.
 */
  ngOnInit(): void {

      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

      /**
 * Si no existen datos en la tabla de destinatarios, se inicializa con un valor por defecto.
 * Luego, se actualiza el store con la nueva fila de destinatario.
 */
   if (this.tablaDestinatarioFilaDatos.length === 0){
      const DESTINATARIO_FILA: TablaDatos = {
        tbodyData: datosDestinatarioDummy,
      };
      this.tablaDestinatarioFilaDatos.push(DESTINATARIO_FILA);
      this.tramite250101Store.establecerDestinatario(
        this.tablaDestinatarioFilaDatos);
      }

      /**
 * Si no existen datos en la tabla de agente aduanal, se agrega un valor por defecto.
 * Luego, se actualiza el store con la nueva fila del agente aduanal.
 */
    if (this.tablaAgenteAduanaFilaDatos.length === 0){
      const AGENTE_ADUANAL_FILA: TablaDatos = {
        tbodyData: datosAgenteDummy,
      };
      this.tablaAgenteAduanaFilaDatos.push(AGENTE_ADUANAL_FILA);
      this.tramite250101Store.establecerAgenteAduanal(
        this.tablaAgenteAduanaFilaDatos);
      }

    this.destinatarioService
      .getDestinatarioEncabezadoDeTabla()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: DestinatarioTablaDatos) => {
        this.tablaDestinatarioData = data.columns;
      });
/**
 * Método que obtiene los datos del encabezado de la tabla de agentes aduanales 
 * mediante el servicio `DestinatarioService`. 
 * Utiliza `takeUntil(this.destroy$)` para gestionar la suscripción y evitar pérdidas de memoria.
 * Los datos obtenidos se asignan a la propiedad `tablaAgenteAduanalData`.
 */
    this.destinatarioService
      .getAduanalEncabezadoDeTabla()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: DestinatarioTablaDatos) => {
        this.tablaAgenteAduanalData = data.columns;
      });
/**
 * Método que obtiene los datos del país mediante el servicio `DestinatarioService`.
 * Utiliza `takeUntil(this.destroy$)` para gestionar la suscripción y evitar pérdidas de memoria.
 * Los datos obtenidos se asignan a la propiedad `paisData`.
 */
    this.destinatarioService
      .getPaisData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.paisData = data;
      });
/**
 * Método que obtiene los datos del estado mediante el servicio `DestinatarioService`.
 * Utiliza `takeUntil(this.destroy$)` para gestionar la suscripción y evitar pérdidas de memoria.
 * Los datos obtenidos se asignan a la propiedad `estadoData`.
 */
    this.destinatarioService
      .getEstadoData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.estadoData = data;
      });
/**
 * Método que establece el formulario para el destinatario utilizando la función `establecerFormDestinatariosModal`.
 * Este método se encarga de inicializar y configurar el formulario específico para el modal de destinatarios.
 */
    this.establecerFormDestinatariosModal();
    /**
     * Método que establece el formulario para el agente aduanal utilizando la función `establecerFormAgenteAduanal`.
     * Este método se encarga de inicializar y configurar el formulario específico para el modal del agente aduanal.
     */
    this.establecerFormAgenteAduanal();
  }

   /**
   * Determina si se debe cargar un formulario nuevo o uno existente.  
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else if(this.formDestinatariosModal && this.formAgenteAduanal) {
       this.formDestinatariosModal.enable();
       this.formAgenteAduanal.enable();
    }
  }

    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
private guardarDatosFormulario(): void {
    this.establecerFormDestinatariosModal();
    this.establecerFormAgenteAduanal();

    if (this.formDestinatariosModal && this.esFormularioSoloLectura) {
      this.formDestinatariosModal.disable();
      if (this.tablaDestinatarioFilaDatos.length === 0){
      const DESTINATARIO_FILA: TablaDatos = {
        tbodyData: datosDestinatarioDummy,
      };
      this.tablaDestinatarioFilaDatos.push(DESTINATARIO_FILA);
      }
    } else if (!this.esFormularioSoloLectura) {
      this.formDestinatariosModal.enable();
    } 

    if (this.formAgenteAduanal && this.esFormularioSoloLectura) {
      this.formAgenteAduanal.disable();
      if (this.tablaAgenteAduanaFilaDatos.length === 0){
      const AGENTE_ADUANAL_FILA: TablaDatos = {
        tbodyData: datosAgenteDummy,
      };
      this.tablaAgenteAduanaFilaDatos.push(AGENTE_ADUANAL_FILA);
      }
    } else if (!this.esFormularioSoloLectura) {
      this.formAgenteAduanal.enable();
    } 
  }

/**
 * Método que cambia la visibilidad de la tabla y el modal del destinatario.
 * Este método alterna el estado de las variables `showTableDiv` y `showDestinatarioModal`, 
 * lo que permite mostrar u ocultar la tabla y el modal de destinatario según sea necesario.
 */
 public cambiarDestinatario(): void {
    this.showTableDiv = !this.showTableDiv;
    this.showDestinatarioModal = !this.showDestinatarioModal;
  }
/**
 * Método que cambia la visibilidad de la tabla y el modal del agente aduanal.
 * Este método alterna el estado de las variables `showTableDiv` y `showAgenteModal`, 
 * lo que permite mostrar u ocultar la tabla y el modal del agente aduanal según sea necesario.
 */
 public cambiarAgenteAduanal(): void {
    this.showTableDiv = !this.showTableDiv;
    this.showAgenteModal = !this.showAgenteModal;
  }
/**
 * Método que inicializa el formulario reactivo para el modal de destinatarios.
 * Este formulario incluye campos para capturar información del destinatario, como razón social, país, estado, 
 * código postal y domicilio. Los campos están validados para asegurar que los datos ingresados sean correctos.
 * 
 * @method
 * @description
 * Establece un formulario reactivo que contiene los siguientes controles:
 * - `destinatarioRadio`: Campo de radio deshabilitado con valor inicial `'1'` y validación de requerimiento.
 * - `destinatarioRazonSocial`: Campo de texto para la razón social del destinatario, con validación de longitud máxima y obligatoriedad.
 * - `paisNacionalDestinatario`: Campo de selección para el país del destinatario, con validación de obligatoriedad.
 * - `estadoNacionalDestinatario`: Campo de selección para el estado del destinatario, con validación de obligatoriedad.
 * - `codigoPostalDestinatario`: Campo de texto para el código postal, con validación de longitud máxima y obligatoriedad.
 * - `domicilioDestinatario`: Campo de texto para el domicilio del destinatario, con validación de obligatoriedad.
 */
 private establecerFormDestinatariosModal(): void {

   /** Suscribe al estado de solicitud 40302 y lo asigna a `solicitudState`.  
    * Usa `takeUntil` para limpiar la suscripción al destruir el componente. */
    this.tramite250101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250101State;
        })
      )
      .subscribe();

    this.formDestinatariosModal = this.fb.group({
      destinatarioRadio: new FormControl({ value: '1', disabled: true }, [
        Validators.required,
      ]),
      destinatarioRazonSocial: new FormControl('', [
        Validators.required,
        Validators.maxLength(120),
      ]),
      paisNacionalDestinatario: new FormControl('', [Validators.required]),
      estadoNacionalDestinatario: new FormControl('', [Validators.required]),
      codigoPostalDestinatario: new FormControl('', [
        Validators.required,
        Validators.maxLength(12),
      ]),
      domicilioDestinatario: new FormControl('', [Validators.required,Validators.maxLength(100),]),
    });

    this.formDestinatariosModal.patchValue({
      destinatarioRazonSocial: this.solicitudState.destinatarioDenominacion,
      paisNacionalDestinatario: this.solicitudState.destinatarioPais,
      estadoNacionalDestinatario: this.solicitudState.destinatarioEstado,
      codigoPostalDestinatario: this.solicitudState.destinatarioCodigoPostal,
      domicilioDestinatario: this.solicitudState.destinatarioDomicilio,
    });
  }
/**
 * Método que inicializa el formulario reactivo para el modal de agente aduanal.
 * Este formulario incluye campos para capturar información del agente aduanal, como nombre, apellidos, y patente. 
 * Los campos están validados para asegurar que los datos ingresados sean correctos.
 * 
 * @method
 * @description
 * Establece un formulario reactivo que contiene los siguientes controles:
 * - `nombreAgenteAduanal`: Campo de texto para el nombre del agente aduanal, con validación de obligatoriedad y longitud máxima.
 * - `primerApellidoAgenteAduanal`: Campo de texto para el primer apellido del agente aduanal, con validación de obligatoriedad y longitud máxima.
 * - `segundoApellidoAgenteAduanal`: Campo de texto para el segundo apellido del agente aduanal, con validación de obligatoriedad y longitud máxima.
 * - `patenteAgenteAduanal`: Campo de texto para la patente del agente aduanal, con validación de obligatoriedad y longitud máxima.
 */
 private establecerFormAgenteAduanal(): void {
   /** Suscribe al estado de solicitud 40302 y lo asigna a `solicitudState`.  
    * Usa `takeUntil` para limpiar la suscripción al destruir el componente. */
    this.tramite250101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250101State;
        })
      )
      .subscribe();

    this.formAgenteAduanal = this.fb.group({
      nombreAgenteAduanal: new FormControl('', [
        Validators.required,
        Validators.maxLength(28),
      ]),
      primerApellidoAgenteAduanal: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      segundoApellidoAgenteAduanal: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      patenteAgenteAduanal: new FormControl('', [
        Validators.required,
        Validators.maxLength(4),
      ]),
    });

    this.formAgenteAduanal.patchValue({
      nombreAgenteAduanal: this.solicitudState.agenteAduanalNombre,
      primerApellidoAgenteAduanal: this.solicitudState.agenteAduanalPrimerApellido,
      segundoApellidoAgenteAduanal: this.solicitudState.agenteAduanalSegundoApellido,
      patenteAgenteAduanal: this.solicitudState.agenteAduanalPatente,
    });
  }
/**
 * Método que abre el modal de aceptación y oculta el modal de destinatario.
 * Al ejecutarse, cambia la visibilidad del modal de destinatario a oculto y muestra el modal de aceptación.
 * 
 * @method
 * @description
 * Este método se utiliza para mostrar el modal de aceptación (confirmación de datos o acción),
 * mientras oculta el modal de destinatario. Es útil para flujos de trabajo que requieren
 * una confirmación antes de proceder con la acción.
 */
 public openAceptarModal(): void {
    this.showDestinatarioModal = !this.showDestinatarioModal;
    this.showAceptarModal = true;
  }
/**
 * Método que confirma la acción de agregar destinatario y cierra el modal de aceptación.
 * Este método ejecuta el envío del formulario de destinatario y luego oculta el modal de aceptación.
 * 
 * @method
 * @description
 * Se utiliza para confirmar la adición de un destinatario, enviando el formulario con los datos 
 * ingresados y cerrando el modal de aceptación para continuar con el flujo de trabajo.
 */
 public confirmAgregar(): void {
    this.enviarDestinatarioFormulario();
    this.showAceptarModal = false;
  }
/**
 * Método encargado de enviar los datos del formulario de destinatario.
 * Este método obtiene el valor seleccionado de los campos "paisNacionalDestinatario" 
 * y "estadoNacionalDestinatario" del formulario y los mapea a sus descripciones 
 * correspondientes a partir de las listas `paisData` y `estadoData`.
 * 
 * @method
 * @description
 * Utiliza las opciones disponibles en los catálogos de países y estados para obtener las descripciones 
 * correspondientes y luego procesa o envía estos valores como parte del formulario de destinatario.
 */
 public enviarDestinatarioFormulario(): void {
    const PAIS_VALOR = this.paisData.find(
      (item: Catalogo) =>
        item.id === this.formDestinatariosModal.value.paisNacionalDestinatario
    )?.descripcion;

    const ESTADO_VALOR = this.estadoData.find(
      (item: Catalogo) =>
        item.id === this.formDestinatariosModal.value.estadoNacionalDestinatario
    )?.descripcion;

    const DESTINATARIO_FILA = {
      tbodyData: [
        this.formDestinatariosModal.value.destinatarioRazonSocial,
        PAIS_VALOR,
        '',
        ESTADO_VALOR,
        this.formDestinatariosModal.value.domicilioDestinatario,
        this.formDestinatariosModal.value.codigoPostalDestinatario,
      ],
    };

    this.tablaDestinatarioFilaDatos.push(DESTINATARIO_FILA);

    this.tramite250101Store.establecerDestinatario(
      this.tablaDestinatarioFilaDatos
    );

    this.showTableDiv = !this.showTableDiv;
  }
/**
 * Envía los datos del formulario de agente aduanal, agrega la nueva fila al arreglo `tablaAgenteAduanaFilaDatos`,
 * actualiza el store con `setAgenteAduanal`, y alterna la visibilidad de la tabla y el modal.
 */
 public enviarAgenteAduanalFormulario(): void {
    const AGENTE_ADUANAL_FILA = {
      tbodyData: [
        this.formAgenteAduanal.value.nombreAgenteAduanal,
        this.formAgenteAduanal.value.primerApellidoAgenteAduanal,
        this.formAgenteAduanal.value.segundoApellidoAgenteAduanal,
        this.formAgenteAduanal.value.patenteAgenteAduanal,
      ],
    };
    this.tablaAgenteAduanaFilaDatos.push(AGENTE_ADUANAL_FILA);
    this.tramite250101Store.establecerAgenteAduanal(
      this.tablaAgenteAduanaFilaDatos
    );
    this.showTableDiv = !this.showTableDiv;
    this.showAgenteModal = !this.showAgenteModal;
  }
/**
 * Obtiene el valor de 'destinatarioRazonSocial' del formulario y actualiza la denominación del destinatario en el store.
 */
  actualizarDenominacion(): void {
    const DESTINATARIO_DENOMINACION = this.formDestinatariosModal.get(
      'destinatarioRazonSocial'
    )?.value;
    this.tramite250101Store.establecerDestinatarioDenominacion(
      DESTINATARIO_DENOMINACION
    );
  }
/**
 * Obtiene el valor de 'codigoPostalDestinatario' del formulario y actualiza el código postal del destinatario en el store.
 */
  actualizarCodigoPostal(): void {
    const DESTINATARIO_CODIGO_POSTAL = this.formDestinatariosModal.get(
      'codigoPostalDestinatario'
    )?.value;
    this.tramite250101Store.establecerDestinatarioCodigoPostal(
      DESTINATARIO_CODIGO_POSTAL
    );
  }
/**
 * Obtiene el valor de 'domicilioDestinatario' del formulario y actualiza el domicilio del destinatario en el store.
 */
  actualizarDomicilio(): void {
    const DESTINATARIO_DOMICILIO = this.formDestinatariosModal.get(
      'domicilioDestinatario'
    )?.value;
    this.tramite250101Store.establecerDestinatarioDomicilio(
      DESTINATARIO_DOMICILIO
    );
  }
/**
 * Obtiene el valor de 'paisNacionalDestinatario' del formulario y actualiza el país del destinatario en el store.
 */
  actualizarDestinatarioPais(): void {
    const DESTINATARIO_PAIS = this.formDestinatariosModal.get(
      'paisNacionalDestinatario'
    )?.value;
    this.tramite250101Store.establecerDestinatarioPais(DESTINATARIO_PAIS);
  }
/**
 * Obtiene el valor de 'estadoNacionalDestinatario' del formulario y actualiza el estado del destinatario en el store.
 */
  actualizarDestinatarioEstado(): void {
    const DESTINATARIO_ESTADO = this.formDestinatariosModal.get(
      'estadoNacionalDestinatario'
    )?.value;
    this.tramite250101Store.establecerDestinatarioEstado(DESTINATARIO_ESTADO);
  }
/**
 * Obtiene el valor de 'nombreAgenteAduanal' del formulario y actualiza el nombre del agente aduanal en el store.
 */
  actualizarAgenteNombre(): void {
    const AGENTE_NOMBRE = this.formAgenteAduanal.get(
      'nombreAgenteAduanal'
    )?.value;
    this.tramite250101Store.establecerAgenteAduanalNombre(AGENTE_NOMBRE);
  }
/**
 * Obtiene el valor de 'primerApellidoAgenteAduanal' del formulario y actualiza el primer apellido del agente aduanal en el store.
 */
  actualizarAgentePrimerApellido(): void {
    const AGENTE_PRIMER_APELLIDO = this.formAgenteAduanal.get(
      'primerApellidoAgenteAduanal'
    )?.value;
    this.tramite250101Store.establecerAgenteAduanalPrimerApellido(
      AGENTE_PRIMER_APELLIDO
    );
  }
/**
 * Obtiene el valor de 'segundoApellidoAgenteAduanal' del formulario y actualiza el segundo apellido del agente aduanal en el store.
 */
  actualizarAgenteSegundoApellido(): void {
    const AGENTE_SEGUNDO_APELLIDO = this.formAgenteAduanal.get(
      'segundoApellidoAgenteAduanal'
    )?.value;
    this.tramite250101Store.establecerAgenteAduanalSegundoApellido(
      AGENTE_SEGUNDO_APELLIDO
    );
  }
/**
 * Obtiene el valor de 'patenteAgenteAduanal' del formulario y actualiza la patente del agente aduanal en el store.
 */
  actualizarAgentePatente(): void {
    const AGENTE_PATENTE = this.formAgenteAduanal.get(
      'patenteAgenteAduanal'
    )?.value;
    this.tramite250101Store.establecerAgenteAduanalPatente(AGENTE_PATENTE);
  }
/**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
