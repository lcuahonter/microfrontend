import { Catalogo, CatalogoSelectComponent, CatalogosSelect, Notificacion, NotificacionesComponent, Pedimento } from '@libs/shared/data-access-user/src';
import { CommonModule,Location } from '@angular/common';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AvisoAgente } from '../../../../core/models/30505/aviso-modificacion.model';
import { Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';
import productivo from '@libs/shared/theme/assets/json/30505/productivo.json';

import { AgregarAgenteComponent } from '../agregar-agente/agregar-agente.component';
/**
 * Componente para agregar un agente en el trámite 30505.
 *
 * Este componente permite gestionar el formulario y la lógica necesaria para agregar un agente,
 * mostrando u ocultando secciones según el tipo de figura seleccionada y manipulando el estado
 * mediante un store y query específicos del trámite.
 *
 * @remarks
 * Utiliza formularios reactivos para la captura y validación de datos, así como suscripciones
 * gestionadas para evitar fugas de memoria.
 */
@Component({
  selector: 'app-modificar-agente',
  templateUrl: './modificar-agente.component.html',
   styleUrl: './modificar-agente.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,CatalogoSelectComponent,AgregarAgenteComponent,NotificacionesComponent]
})
export class ModificarAgenteComponent implements OnInit,OnDestroy {

  /**
   * Grupo de controles de formulario que contiene los datos relacionados con el trámite.
   * Utilizado para gestionar y validar la información ingresada por el usuario en el formulario.
   */
  datosTramite!: FormGroup;

  /**
   * Indica si el agente debe mostrarse en la interfaz de usuario.
   * 
   * Cuando es `true`, el agente es visible; cuando es `false`, el agente está oculto.
   */
  mostrarAgente: boolean = false;

  /**
   * Indica si se debe mostrar la sección de agencia en la interfaz de usuario.
   * 
   * Cuando es `true`, la agencia se muestra; cuando es `false`, permanece oculta.
   */
  mostrarAgencia: boolean = false;

  /**
   * Arreglo que contiene el catálogo de sectores productivos AGACE.
   * 
   * @type {Catalogo[]}
   * @remarks
   * Este arreglo se inicializa con los valores provenientes de la constante `productivo`.
   * Se utiliza para mostrar y seleccionar sectores productivos en el componente.
   */
  sectorProductivoAgace: Catalogo[] = productivo;

  /**
   * Notificador utilizado para destruir suscripciones y evitar fugas de memoria.
   * Se debe emitir un valor y completar este Subject cuando el componente se destruya.
   * 
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Arreglo que contiene los datos de los agentes.
   * Cada elemento del arreglo es de tipo `AvisoAgente`.
   * 
   * @type {AvisoAgente[]}
   */
  agenteDatos:AvisoAgente[] = [];
 
   /**
   * Representa el agente seleccionado en el componente.
   * 
   * @type {AvisoAgente}
   * @remarks
   * Este objeto almacena la información del agente que ha sido seleccionado
   * para su modificación. Inicialmente se define como un objeto vacío
   * con el tipo `AvisoAgente`.
   */
  /**
 * Representa el agente seleccionado en el componente.
 * 
 * @type {AvisoAgente}
 * @remarks
 * Este objeto almacena la información del agente que ha sido seleccionado
 * para su modificación. Inicialmente se define como un objeto vacío
 * con el tipo `AvisoAgente`.
 */
selectedAgente = {} as AvisoAgente;

/**
 * Contiene los datos del catálogo de tipos de movimiento.
 * 
 * @type {CatalogosSelect}
 * @remarks
 * Este objeto incluye información como el nombre del campo, si es requerido,
 * la primera opción a mostrar y el arreglo de catálogos disponibles.
 */
public tipoMovimientoData: CatalogosSelect = {
  labelNombre: '*Tipo Movimiento',
  required: true,
  primerOpcion: 'Seleccione una estatus',
  catalogos: [],
};

/**
 * Representa una nueva notificación en el componente.
 * 
 * @type {Notificacion}
 * @remarks
 * Este objeto se utiliza para gestionar y mostrar notificaciones en el componente.
 */
public nuevaNotificacion: Notificacion | null = null;

/**
 * Índice del elemento que se desea eliminar.
 * 
 * @type {number}
 * @remarks
 * Este valor se utiliza para identificar el elemento que será eliminado
 * del arreglo correspondiente.
 */
elementoParaEliminar!: number;

/**
 * Arreglo que contiene los pedimentos relacionados.
 * 
 * @type {Array<Pedimento>}
 * @remarks
 * Este arreglo almacena los pedimentos que se gestionan en el componente.
 */
pedimentos: Array<Pedimento> = [];

  /**
   * Constructor de la clase AgregarAgenteComponent.
   * 
   * @param fb Instancia de FormBuilder para la creación y manejo de formularios reactivos.
   * @param tramite30505Store Store para gestionar el estado relacionado con la adición de agentes en el trámite 30505.
   * @param tramite30505Query Query para consultar el estado y datos relacionados con la adición de agentes en el trámite 30505.
   * @param ubicaccion Servicio Location para manejar la navegación y ubicación en la aplicación.
   */
  constructor(
    private fb: FormBuilder,
    private tramite30505Store: Solicitud30505Store,
    private tercerosService: TercerosRelacionadosService,
    private ubicaccion : Location,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Se suscribe al observable `agente$` del servicio `tercerosService` para obtener información del agente.
   * - Si existe un agente y la lista no está vacía, selecciona el primer agente y lo asigna a `selectedAgente`.
   * - Llama al método `crearFormulario()` para inicializar el formulario del componente.
   * 
   * @remarks
   * La suscripción se gestiona con `takeUntil(this.destroyNotifier$)` para evitar fugas de memoria.
   */
  ngOnInit(): void {
    this.tercerosService.getAvisoAgenteData().subscribe(
      (data) => {
        this.tercerosService.setAgente(data); 
      },
      (error) => {
        console.error('Error fetching agent data:', error);
      }
    );
  
    // Subscribe to the agent data
    this.tercerosService.agente$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((agente) => {
  
        if (!agente || agente.length === 0) {
          this.selectedAgente = {
            tipoFigura: '',
            numPatenteModal: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            razonSocial: '',
            tipoMovimiento: '',
          };
        } else {
          this.selectedAgente = agente[0];
        }
  
        this.crearFormulario(); 
      });
  
    this.getTipoMovimientoData(); 
  }

 /**
 * Obtiene los datos del catálogo de tipos de movimiento desde el servicio `TercerosRelacionadosService`.
 *
 * Este método realiza una suscripción al observable `getTipoMovimientoData` del servicio,
 * recuperando los datos del catálogo y asignándolos a la propiedad `tipoMovimientoData.catalogos`.
 * 
 * @remarks
 * La suscripción se gestiona con `takeUntil(this.destroyNotifier$)` para evitar fugas de memoria.
 * 
 * @example
 * this.getTipoMovimientoData();
 */
getTipoMovimientoData(): void {
  this.tercerosService
    .getTipoMovimientoData()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((data) => {
      this.tipoMovimientoData.catalogos = data as unknown as Catalogo[];
    });
}
  
/**
 * Handles the selection of a table row and binds the data to the form fields.
 * 
 * @param agente The selected agent data from the table.
 */
  /**
   * Crea y configura el formulario reactivo para el trámite de agregar agente.
   * 
   * Este método inicializa el formulario `datosTramite` con los controles y validaciones necesarias,
   * utilizando el FormBuilder de Angular. Los campos incluyen información como tipo de figura, patente,
   * RFC, obligaciones fiscales, autorización de patente, nombre, apellidos, razón social y agencia.
   * Algunos campos se inicializan deshabilitados y otros toman valores iniciales del estado de la solicitud.
   * 
   * Validaciones aplicadas:
   * - Requerido en la mayoría de los campos.
   * - Longitud máxima en campos como número de patente, RFC y patente2.
   * - Validación de verdadero para campos booleanos obligatorios.
   */
  public crearFormulario():void{
    this.datosTramite = this.fb.group({
      tipoFigura: [this.selectedAgente?.tipoFigura, Validators.required],
      numPatenteModal: [{ value: this.selectedAgente?.numPatenteModal, disabled: true }, [Validators.required, Validators.maxLength(4)]],
      nombre: [{ value: this.selectedAgente?.nombre, disabled: true }, Validators.required],
      apellidoPaterno: [{ value: this.selectedAgente?.apellidoPaterno, disabled: true }, Validators.required],
      apellidoMaterno: [{ value: this.selectedAgente?.apellidoMaterno, disabled: true }, Validators.required],
      razonSocial: [{ value: this.selectedAgente?.razonSocial, disabled: true }, Validators.required],
      tipoMovimiento:[this.selectedAgente?.tipoMovimiento, Validators.required]

    });
  }
/**
 * Elimina un pedimento del arreglo de pedimentos si se confirma la acción.
 * 
 * @param borrar Indica si se debe proceder con la eliminación del pedimento.
 * @returns {void} No retorna ningún valor.
 */
eliminarPedimento(borrar: boolean): void {
  if (borrar) {
    this.pedimentos.splice(this.elementoParaEliminar, 1);
  }
  this.nuevaNotificacion = null;
}

/**
* Abre un modal de notificación con un mensaje predefinido.
* 
* @param i Índice del elemento relacionado con la notificación (opcional, valor predeterminado: 0).
* @returns {void} No retorna ningún valor.
*/
abrirModal(i: number = 0): void {
  this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: '',
    mensaje: 'Datos guardados correctamente',
    cerrar: false,
    tiempoDeEspera: 2000,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };

  this.elementoParaEliminar = i;
}

  /**
   * Maneja el evento de selección de figura en el formulario.
   * 
   * Dependiendo del valor seleccionado, muestra u oculta los campos de agencia o agente.
   * Si el valor seleccionado es '1' o '2', se muestra el campo de agente y se oculta el de agencia.
   * En cualquier otro caso, se muestra el campo de agencia y se oculta el de agente.
   * 
   * @param event Evento del cambio de selección, que contiene el valor seleccionado.
   */
  public onSelectFigura(event: Event): void {
    const SELECTED_VALUE = (event.target as HTMLSelectElement).value;
    if (SELECTED_VALUE === '1' || SELECTED_VALUE === '2') {
      this.mostrarAgencia = false;
      this.mostrarAgente = true;
    } else {
      this.mostrarAgencia = true;
      this.mostrarAgente = false;
    }
  }
 /**
   * Limpia los datos relacionados con las sociedades SCC en el formulario.
   * 
   * Esta función reinicia el formulario `datosTramite` y oculta las secciones de agencia y agente.
   * 
   * @returns {void} No retorna ningún valor.
   */

  public limpiarSociedadesScc(): void {
    this.datosTramite.reset();
    this.mostrarAgencia = false;
    this.mostrarAgente = false;
  }

  /**
   * Cierra el diálogo relacionado con las sociedades SCC.
   * 
   * Este método restablece el formulario de datos del trámite y navega de regreso a la ubicación anterior.
   * 
   * @returns {void} No retorna ningún valor.
   */
  public cerrarDialogoSociedadesScc(): void {
   this.datosTramite.reset();
    this.ubicaccion.back();
  }

  /**
   * Establece un valor en el store utilizando el valor de un campo de un formulario.
   *
   * @param form El formulario reactivo que contiene el campo.
   * @param campo El nombre del campo dentro del formulario cuyo valor se va a obtener.
   * @param metodoNombre El nombre del método del store que se debe invocar para establecer el valor.
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud30505Store,
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite30505Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones
   * y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Acepta y guarda los datos de una nueva sociedad SCC en la lista de agentes.
   *
   * Obtiene los valores actuales del formulario, crea un nuevo objeto de agente con dichos valores,
   * lo agrega al arreglo de agentes, actualiza el estado en el store correspondiente,
   * reinicia el formulario y navega hacia la pantalla anterior.
   *
   * @returns {void} No retorna ningún valor.
   */
  aceptarSociedadesScc(): void {

    const VALOR_FORMULARIO = this.datosTramite.getRawValue();
  
    const MODIFICADO_AGENTE = {
      tipoFigura: VALOR_FORMULARIO.tipoFigura,
      numPatenteModal: VALOR_FORMULARIO.numPatenteModal,
      nombre: VALOR_FORMULARIO.nombre,
      apellidoPaterno: VALOR_FORMULARIO.apellidoPaterno,
      apellidoMaterno: VALOR_FORMULARIO.apellidoMaterno,
      razonSocial: VALOR_FORMULARIO.razonSocial,
      tipoMovimiento: VALOR_FORMULARIO.tipoMovimiento,
    };
  
    const INDEX = this.agenteDatos.findIndex(
      (agente) => agente.numPatenteModal === this.selectedAgente.numPatenteModal
    );
    if (INDEX !== -1) {
      this.agenteDatos[INDEX] = MODIFICADO_AGENTE;
    } else {
      this.agenteDatos.push(MODIFICADO_AGENTE);
    }

    this.tramite30505Store.updateAgenteDatos(this.agenteDatos);
    this.abrirModal();
    this.datosTramite.reset();
    setTimeout(() => {
      this.ubicaccion.back();
    }, 3000);

  }
}