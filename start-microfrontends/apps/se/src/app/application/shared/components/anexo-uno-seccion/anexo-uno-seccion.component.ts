/*
/AnexoUnoSeccionComponent
*/
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject,map,takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';

import { AnexoUnoEncabezado } from '../../models/nuevo-programa-industrial.model';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ANEXO_FRACION_ANARELARIA,
  ANEXO_I_SERVICIO_CATALOGO,
  COMPLEMENTAR_FRACCION_CATALOGO_DATOS,
  PAIS_DESTINO_CATALOG,
  TABLA_ANEXO_PRODUCTO_FRACCION,
  TABLA_PROYECTO_IMMEX,
  TABLE_PROVEEDOR_CLIENTE,
} from '../../constantes/complementos-seccion.enum';
import {
  AnexoFraccionAnarelaria,
  AnexoUnoProducto,
  ProveedorCliente,
  ProyectoImmex,
} from '../../models/complimentos-seccion.model';
import { CargaDeFraccionesComponent } from '../carga-de-fracciones/carga-de-fracciones.component';
import { CargaPorArchivoComponent } from '../carga-por-archivo/carga-por-archivo.component';
import { CargaProveedoresClientesComponent } from '../carga-proveedores-clientes/carga-proveedores-clientes.component';

import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { ComplementosSeccionState, ComplementosSeccionStore } from '../../../estados/tramites/complementos-seccion.store';
import { ANEXO_UNO_ALERTA } from '../../constantes/anexo-dos-y-tres.enum';
import { ComplementarQuery } from '../../../estados/queries/complementar.query';
import { ComplementosSeccionQuery } from '../../../estados/queries/complementos-seccion.query';
import { ComplimentosService } from '../../services/complimentos.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
/**
 * compodoc
 * @class AnexoUnoSeccionComponent
 * @description Componente que gestiona la sección del Anexo Uno. Este componente incluye formularios y tablas dinámicas para capturar y mostrar datos relacionados con el Anexo Uno.
 */
@Component({
  selector: 'app-anexo-uno-seccion',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    AlertComponent,
    NotificacionesComponent,
    CargaPorArchivoComponent,
    CargaDeFraccionesComponent,
    CargaProveedoresClientesComponent
  ],
  templateUrl: './anexo-uno-seccion.component.html',
  styleUrl: './anexo-uno-seccion.component.scss',
})
/*
  * Componente que gestiona la sección del Anexo Uno. Este componente incluye formularios y tablas dinámicas para capturar y mostrar datos relacionados con el Anexo Uno.
  *
  * @class AnexoUnoSeccionComponent
  * @implements {OnInit, OnDestroy}
  */

export class AnexoUnoSeccionComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
 /**
  *  * compodoc
 * @property {Subject<void>} destroyNotifier$
 * Notificador utilizado para manejar la destrucción o desuscripción de observables.
 * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
 */
private destroyNotifier$: Subject<void> = new Subject();

/**
 *  * compodoc
 * @property {FormGroup} anexoDosFormGroup
 * Formulario reactivo utilizado para capturar datos relacionados con el Anexo Dos.
 */
public anexoDosFormGroup!: FormGroup;

/**
 *  * compodoc
 * @property {FormGroup} proyectoForm
 * Formulario reactivo utilizado para capturar datos relacionados con el Proyecto IMMEX.
 */
public proyectoForm!: FormGroup;

/**
 *  * compodoc
 * @property {FormGroup} anexoUnoFormGroup
 * Formulario reactivo utilizado para capturar datos relacionados con el Anexo Uno.
 */
public anexoUnoFormGroup!: FormGroup;

/**
 *  * compodoc
 * @property {FormGroup} formularioProveedorCliente
 * Formulario reactivo utilizado para capturar datos de proveedores y clientes.
 */
public formularioProveedorCliente!: FormGroup;
  /** Indica si el formulario debe mostrarse en modo solo lectura.  
 *  Controla la habilitación o deshabilitación de los campos. */
  esFormularioSoloLectura: boolean = false;

/**
 * @property {Notificacion} nuevaUnoNotificacion
 * @description Propiedad que almacena la configuración de la notificación para el contexto "Uno".
 * Se utiliza para mostrar alertas o mensajes relacionados con las fracciones del anexo uno.
 */
public nuevaUnoNotificacion!: Notificacion;

/**
 * @property {Notificacion} nuevaDosNotificacion
 * @description Propiedad que almacena la configuración de la notificación para el contexto "Dos".
 * Se utiliza para mostrar alertas o mensajes relacionados con las fracciones del anexo dos.
 */
public nuevaDosNotificacion!: Notificacion;

/**
 * @property {AnexoUnoProducto | null} selectedFraccionRowUno
 * @description Almacena la fracción arancelaria seleccionada del anexo uno.
 * Puede ser un objeto de tipo `AnexoUnoProducto` o `null` si no hay selección.
 */
public selectedFraccionRowUno: AnexoUnoProducto | null = null;

/**
 * @property {AnexoFraccionAnarelaria | null} selectedFraccionRowDos
 * @description Almacena la fracción arancelaria seleccionada del anexo dos.
 * Puede ser un objeto de tipo `AnexoFraccionAnarelaria` o `null` si no hay selección.
 */
public selectedFraccionRowDos: AnexoFraccionAnarelaria | null = null;

/**
 * @property {'anexoUno' | 'anexoDos' | null} activeComplementarContext
 * @description Indica el contexto activo para complementar fracciones arancelarias.
 * Puede tomar los valores 'anexoUno', 'anexoDos' o `null` cuando no hay contexto activo.
 */
activeComplementarContext: 'anexoUno' | 'anexoDos' | null = null;

/**
 * @property {'cliente' | 'proveedor'} proveedorClienteModalContext
 * @description Define el contexto actual del modal para seleccionar entre cliente o proveedor.
 * Por defecto está establecido en 'cliente'.
 */
proveedorClienteModalContext: 'cliente' | 'proveedor' = 'cliente';

/**
 * @property {boolean} mostrarProveedorPorArchivoPopup
 * @description Indica si el popup para seleccionar proveedor por archivo está visible o no.
 * Valor inicial: `false` (oculto).
 */
public mostrarProveedorPorArchivoPopup: boolean = false;

/**  
 * Bandera booleana que indica si el popup para la carga de fracciones debe mostrarse.  
 * Se utiliza para controlar la visibilidad del componente emergente en la interfaz.  
 */
public mostrarCargaDeFraccionesPopup: boolean = false;

/** Controla la visibilidad del modal de carga por archivo. */
public mostrarCargaPorArchivoModal: boolean = false;

/** Controla la visibilidad del popup de proveedores y clientes. */
public mostrarProveedorClientesPopup: boolean = false;

/** Evento que emite la lista de productos del Anexo Uno cuando se devuelve la llamada. */
@Output() obtenerAnexoUnoDevolverLaLlamada: EventEmitter<
    AnexoUnoProducto[]
  > = new EventEmitter<AnexoUnoProducto[]>(true);

/** Evento que emite la lista de fracciones Anarelaria del Anexo Dos al devolver la llamada. */
@Output() obtenerAnexoDosDevolverLaLlamada: EventEmitter<
  AnexoFraccionAnarelaria[]
> = new EventEmitter<AnexoFraccionAnarelaria[]>(true);



  /**
   * Evento que emite una lista de objetos `ProyectoImmex` al componente padre.
   * 
   * @event
   * @type {EventEmitter<ProyectoImmex[]>}
   * @description
   * Se dispara cuando se requiere enviar la lista actualizada de proyectos IMMEX
   * desde este componente hacia el componente que lo contiene.
   */
  @Output() obtenerProyectoImmexTablaLista: EventEmitter<
    ProyectoImmex[]
  > = new EventEmitter<ProyectoImmex[]>(true);


    /**
     * Evento que emite información sobre proveedores o clientes obtenidos.
     * 
     * @event
     * @typeParam data - Arreglo de objetos de tipo `ProveedorCliente` que contiene los proveedores o clientes obtenidos.
     * @typeParam id - (Opcional) Identificador asociado a la obtención de los datos.
     * 
     * @remarks
     * Este evento se dispara cuando se requiere enviar la información de proveedores o clientes seleccionados
     * hacia el componente padre. El parámetro `id` es opcional y puede ser utilizado para identificar la fuente
     * o contexto de la obtención.
     */
    @Output() obtenerProveedorCliente: EventEmitter<
      {data:ProveedorCliente[], id?:string}
    > = new EventEmitter<{data:ProveedorCliente[], id?:string}>(true);

/**
   * Estado de la solicitud 221601, que contiene los valores actuales de la solicitud.
   */
  public complementarState!: ComplementarState;

  /**
 * Lista de datos de clientes que se muestran en la tabla dinámica del Anexo Uno.
 */
clienteTablaLista: ProveedorCliente[] = [];

/**
 * 
 * @constructor
 * @description Constructor que inicializa el componente y el servicio FormBuilder para crear formularios reactivos.
 * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
 */
constructor(private fb: FormBuilder,
  private complementosSeccionStore: ComplementosSeccionStore,
  private complementosSeccionQuery: ComplementosSeccionQuery,
  private consultaioQuery: ConsultaioQuery,
  private complimentosService: ComplimentosService,
  private complementarStore: ComplementarStore,
  private complementarQuery: ComplementarQuery,
  private servicioDeFormularioService: ServicioDeFormularioService,
){ 
       this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        
          this.inicializarCertificadoFormulario();
        })
      )
      .subscribe();
    }
/**
   * Método que se ejecuta cuando el componente es inicializado.
   * 
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   */
  ngOnInit(): void {
    this.complementarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.complementarState = seccionState as ComplementarState;
        })
      )
      .subscribe();

    this.inicializarCertificadoFormulario();

    if (!(this.complementarState.tipoCategoriaOptions.length)) {
      this.obtenertipoCatagoriaOptions('ENU_TIPO_CATEGORIA');
    } else {
      this.catagoriaSeleccionDatos = [...this.complementarState.tipoCategoriaOptions];
    }
    
    if (!(this.complementarState.paisOptions.length)) {
      this.obtenerPaisOptions();
    } else {
      this.paisDestinoCatalog = [...this.complementarState.paisOptions];
    }

    if (!(this.complementarState.tipoDocumentoOptions.length)) {
      this.obtenerTipoDocumentoOptions(102);
    } else {
      this.tipoDeDocumenteCatalog = [...this.complementarState.tipoDocumentoOptions];
    }
  }

  /** Obtiene y actualiza las opciones del catálogo de tipo de categoría desde el servicio. */
  obtenertipoCatagoriaOptions(tipo: string): void {
    this.complimentosService.getTipoCategoria(tipo)
    .pipe(
      takeUntil(this.destroyNotifier$)
    )
    .subscribe((res) => {
      this.complementarStore.setTipoCategoriaOptions(res.datos);
      this.catagoriaSeleccionDatos = res.datos;
    });
  }

  /** Obtiene y actualiza las opciones del catálogo de pais desde el servicio. */
  obtenerPaisOptions(): void {
    this.complimentosService.getPais()
    .pipe(
      takeUntil(this.destroyNotifier$)
    )
    .subscribe((res) => {
      this.complementarStore.setPaisOptions(res.datos);
      this.paisDestinoCatalog = res.datos;
    });
  }

  /** Obtiene y actualiza las opciones del catálogo de tipo de documento desde el servicio. */
  obtenerTipoDocumentoOptions(id: number): void {
     this.complimentosService.getTipoDocumento(id)
    .pipe(
      takeUntil(this.destroyNotifier$)
    )
    .subscribe((res) => {
      this.complementarStore.setTipoDocumentoOptions(res.datos);
      this.tipoDeDocumenteCatalog = res.datos;
    });
  }

 /**
   * Método para inicializar el formulario reactivo con los datos de la solicitud.
   * 
   * Este método configura los campos del formulario con los valores actuales del estado de la solicitud
   * y aplica las validaciones necesarias. También deshabilita ciertos campos y establece valores predeterminados.
   */
  inicializarCertificadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
     this.crearFormularioAnexoUno();
    }  
  }
    /**
   * @comdoc
   * Guarda los datos del formulario de combinación requerida.
   * 
   * Inicializa el formulario y ajusta su estado de habilitación según si es de solo lectura.
   * - Si el formulario es de solo lectura, lo deshabilita.
   * - Si no es de solo lectura, lo habilita.
   * - Si no aplica ninguna de las condiciones anteriores, no realiza ninguna acción adicional.
   */
  guardarDatosFormulario(): void {
      this.crearFormularioAnexoUno();
      if (this.esFormularioSoloLectura) {
        this.anexoUnoFormGroup.disable();
        this.formularioProveedorCliente.disable(); 
        this.proyectoForm.disable(); 
        this.anexoDosFormGroup.disable();   
         this.complimentarForm.disable();      
      } else {
        this.anexoUnoFormGroup.enable();  
        this.formularioProveedorCliente.enable();
        this.proyectoForm.enable();
        this.anexoDosFormGroup.enable();     
        this.complimentarForm.enable(); 
      }
  }
/**
 * @method actualizarControl
 * @description Actualiza dinámicamente el valor de un control en un formulario específico y lo sincroniza con la tienda o servicio correspondiente.
 * @param {string} formName - El nombre del formulario que contiene el control.
 * @param {string} controlName - El nombre del control que se desea actualizar.
 */
actualizarControl(formName: string, controlName: string): void {
  let formGroup: FormGroup;

  // Determinar qué formulario utilizar
  switch (formName) {
    case 'anexoUnoFormGroup':
      formGroup = this.anexoUnoFormGroup;
      break;
    case 'formularioProveedorCliente':
      formGroup = this.formularioProveedorCliente;
      break;
    case 'proyectoForm':
      formGroup = this.proyectoForm;
      break;
    case 'anexoDosFormGroup':
      formGroup = this.anexoDosFormGroup;
      break;
    case 'complimentarForm':
      formGroup = this.complimentarForm;
      break;
    default:
      console.warn('Formulario no encontrado:', formName);
      return;
  }

  // Obtener el valor actualizado del control
  const UPDATED_VALUE = {
    [controlName]: formGroup.get(controlName)?.value,
  };

  // Actualizar la tienda o el servicio con el valor actualizado
  this.complementosSeccionStore.update(UPDATED_VALUE);
  this.complementosSeccionStore.setDynamicFieldValue(controlName, UPDATED_VALUE[controlName]);
  
}
/**
 *  * compodoc
 * @method ngOnDestroy
 * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
 * Se utiliza para limpiar las suscripciones activas y liberar recursos.
 */
ngOnDestroy(): void {
  this.destroyNotifier$.next();
  this.destroyNotifier$.complete();
}

/**
 *  * compodoc
 * @property {Catalogo[]} catagoriaSeleccionDatos
 * Datos del catálogo utilizados para la selección de categorías en la sección de complementos.
 */
catagoriaSeleccionDatos: Catalogo[] = [];

/**
 *  * compodoc
 * @property {ProyectoImmex[]} proyectoImmexTablaLista
 * Lista de datos relacionados con el Proyecto IMMEX que se muestran en la tabla dinámica.
 */
proyectoImmexTablaLista: ProyectoImmex[] = [];

/** Lista de productos para el Anexo Uno que se muestra en la tabla. */
@Input() anexoUnoTablaLista: AnexoUnoProducto[] = [];

/**
 *  * compodoc
 * @property {ProveedorCliente[]} proveedorTablaLista
 * Lista de datos de proveedores y clientes que se muestran en la tabla dinámica.
 */
proveedorTablaLista: ProveedorCliente[] = [];

/**
 *  * compodoc
 * @property {AnexoUnoEncabezado[]} fracionArancelaria
 * Lista de encabezados relacionados con las fracciones arancelarias.
 */
fracionArancelaria: AnexoUnoEncabezado[] = [];

/** Lista de fracciones anarelaria para el Anexo Fracción. */
@Input() anexoFraccionAnarelaria: AnexoFraccionAnarelaria[] = [];


/**
 * Objeto que almacena los datos relacionados con proveedores o clientes.
 * 
 * @property {ProveedorCliente[]} data - Lista de objetos de tipo ProveedorCliente.
 * @property {string} [id] - Identificador opcional asociado a los datos.
 */
proveedorClienteDatos: {data: ProveedorCliente[], id?: string} = {data: [], id: ''};

/**
 *  * compodoc
 * @property {string} anexoUnoAlerta
 * Mensaje de alerta utilizado en la sección del Anexo Uno.
 */
public anexoUnoAlerta = ANEXO_UNO_ALERTA;
  /**
   * Formulario para complementar fracción.
   */
  public complimentarForm!: FormGroup;
/**
 *  * compodoc
 * @method agregarAnexoUno
 * @description Método que agrega un nuevo producto al Anexo Uno. Valida el formulario y, si es válido, agrega los datos a la lista de productos del Anexo Uno.
 */
agregarAnexoUno(): void {
  if (this.anexoUnoFormGroup.valid) {
    const FORM_DATA = this.anexoUnoFormGroup.value;
    const FRACCION = (this.anexoUnoTablaLista.length + 1).toString();

    const DEFAULTS = {
      fraccion: FRACCION,
      anexoII: 'NO SENSIBLE',
      tipo: 'EXPORTACION',
      umt: 'Pieza'
    };

    this.anexoUnoTablaLista.push({ ...DEFAULTS, ...FORM_DATA });
    this.anexoUnoTablaLista = [...this.anexoUnoTablaLista];
    this.obtenerAnexoUnoDevolverLaLlamada.emit(this.anexoUnoTablaLista);
    this.anexoUnoFormGroup.reset();
  } else {
    this.abrirUnoModal();
  }
}

/**
 * @method abrirUnoModal
 * @description Muestra una notificación de alerta indicando que es necesario introducir la fracción arancelaria.
 * Configura los parámetros de la notificación con estilo y comportamiento específicos.
 */
  abrirUnoModal(): void {
    this.nuevaUnoNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        'Tiene que introducir la Fracción arancelaria',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

/**
 * @method setAnexoUnoLista
 * @description Establece la fila seleccionada para el listado de fracciones del 'anexoUno'.
 * Asigna el evento recibido a la propiedad `selectedFraccionRowUno` o `null` si el evento es nulo.
 * 
 * @param {AnexoUnoProducto | null} event - Objeto que representa la fracción seleccionada o null.
 */
setAnexoUnoLista(event: AnexoUnoProducto | null): void{
  this.selectedFraccionRowUno = event ? event : null;
}

/**
 * @method abrirComplementarFraccionModalUno
 * @description Abre el modal para complementar la fracción arancelaria del 'anexoUno' si hay una fracción seleccionada.
 * Si no hay ninguna fracción seleccionada, muestra una notificación de advertencia solicitando la selección.
 */
abrirComplementarFraccionModalUno(): void {
  if (this.selectedFraccionRowUno) {
    this.activeComplementarContext = 'anexoUno';

    const ELEMENTO_MODAL = document.getElementById('complementarFuncionModal');
    if (ELEMENTO_MODAL){
    const MODAL = new Modal(ELEMENTO_MODAL);
    MODAL.show();
    }
  } else {
    this.nuevaUnoNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe seleccionar la fracción arancelaria del producto',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}

/**
 * Abre el modal "Proyecto IMMEX" si hay una fracción seleccionada del Anexo Uno.
 * Si no hay selección, muestra una notificación de alerta indicando que se debe seleccionar una fracción arancelaria.
 */
abrirProyectoImmexModal(): void {
  if (this.selectedFraccionRowUno) {
    this.activeComplementarContext = 'anexoUno';

    const ELEMENTO_MODAL = document.getElementById('proyectoImmexModal');
    if (ELEMENTO_MODAL) {
      const MODAL = new Modal(ELEMENTO_MODAL);
      MODAL.show();
    }
  } else {
    this.nuevaUnoNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe seleccionar la fracción arancelaria del producto',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}

/**
 *  * compodoc
 * @method agregarFraccionAnarelaria
 * @description Método que agrega una nueva fracción arancelaria al Anexo Dos. Valida el formulario y, si es válido, agrega los datos a la lista de fracciones arancelarias.
 */
agregarFraccionAnarelaria(): void {
  if (this.anexoDosFormGroup.valid) {
    const FORM_DATA = this.anexoDosFormGroup.value;
    const FRACCION = (this.anexoFraccionAnarelaria.length + 1).toString();
    const DEFAULTS = {
      anexoFraccion: FRACCION,
      anexoDos: 'NO SENSIBLE',
      tipo: 'IMPORTACION',
      umt: 'Pieza'
    };

    const ROW: AnexoFraccionAnarelaria = {
      ...DEFAULTS,
      anexoFraccionExportacion: FORM_DATA.fraccionArancelarias,
      anexoDescripcionComercialExportacion: FORM_DATA.anexoDosDescripcion,
      anexoFraccionImportacion: '', 
      anexoDescripcionComercialImportacion: '', 
      catagoria: '', 
      valorEnMonedaMensual: '', 
      valorEnMonedaAnual: '', 
      volumenMensual: '',
      volumenAnual: ''
    };

    this.anexoFraccionAnarelaria.push(ROW);
    this.anexoFraccionAnarelaria = [...this.anexoFraccionAnarelaria]
    this.obtenerAnexoDosDevolverLaLlamada.emit(this.anexoFraccionAnarelaria);
    this.anexoDosFormGroup.reset();
  } else {
    this.abrirDosModal();
    console.warn('El formulario no es válido. Por favor, complete todos los campos requeridos.');
  }
}

/**
 * @method abrirDosModal
 * @description Muestra una notificación de alerta indicando que es necesario introducir la fracción arancelaria.
 * Configura los parámetros de la notificación con estilo y comportamiento específicos.
 */
  abrirDosModal(): void {
    this.nuevaDosNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        'Tiene que introducir la Fracción arancelaria',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

/**
 * @method setAnexoDosLista
 * @description Establece la fila seleccionada para el listado de fracciones del 'anexoDos'.
 * Asigna el evento recibido a la propiedad `selectedFraccionRowDos` o `null` si el evento es nulo.
 * 
 * @param {AnexoFraccionAnarelaria | null} event - Objeto que representa la fracción seleccionada o null.
 */
setAnexoDosLista(event: AnexoFraccionAnarelaria | null): void{
  this.selectedFraccionRowDos = event ? event : null;
}

/**
 * @method abrirComplementarFraccionModalDos
 * @description Abre el modal para complementar la fracción arancelaria del 'anexoDos' si hay una fracción seleccionada.
 * Si no hay ninguna fracción seleccionada, muestra una notificación de advertencia solicitando la selección.
 */
abrirComplementarFraccionModalDos(): void {
  if (this.selectedFraccionRowDos) {
    this.activeComplementarContext = 'anexoDos';

    const ELEMENTO_MODAL = document.getElementById('complementarFuncionModal');
    if (ELEMENTO_MODAL) {
      const MODAL = new Modal(ELEMENTO_MODAL);
      MODAL.show();
    }
  } else {
    this.nuevaDosNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe seleccionar la fracción arancelaria del producto',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}

/**
 * @method guardarComplementarFraccion
 * @description Valida y guarda los datos del formulario de complementar fracción según el contexto activo ('anexoUno' o 'anexoDos').
 * Actualiza la lista correspondiente con los valores capturados en el formulario, incluyendo la categoría y valores mensuales y anuales.
 * Si el formulario es válido, realiza la actualización y posteriormente resetea el formulario y cierra el modal correspondiente.
 */
guardarComplementarFraccion(): void {
  if (this.complimentarForm.valid) {
    const FORMULARIO_VALOR = this.complimentarForm.value;

    let catDescripcion = '';
    if (typeof FORMULARIO_VALOR.catagoria === 'object' && FORMULARIO_VALOR.catagoria !== null) {
      catDescripcion = FORMULARIO_VALOR.catagoria.descripcion;
    } else {
      const CATAGORIA = this.catagoriaSeleccionDatos.find(cat => String(cat.id) === String(FORMULARIO_VALOR.catagoria));
      catDescripcion = CATAGORIA ? CATAGORIA.descripcion : '';
    }

    if (this.activeComplementarContext === 'anexoUno' && this.selectedFraccionRowUno) {
    const IDX = this.anexoUnoTablaLista.findIndex(row => row === this.selectedFraccionRowUno);
    if (IDX !== -1) {
      this.anexoUnoTablaLista[IDX] = {
        ...this.anexoUnoTablaLista[IDX],
        categoria:catDescripcion,
        valorModedaMensual: FORMULARIO_VALOR.monedaNacionalMensual,
        valorModedaAnual: FORMULARIO_VALOR.monedaNacionalDeDosPeriodos,
        valorMensual: FORMULARIO_VALOR.volumenMensual,
        valorAnual: FORMULARIO_VALOR.twoPeriodVolume
      };
      this.anexoUnoTablaLista = [...this.anexoUnoTablaLista];
    }
    } else if (this.activeComplementarContext === 'anexoDos' && this.selectedFraccionRowDos) {
    const IDX = this.anexoFraccionAnarelaria.findIndex(row => row === this.selectedFraccionRowDos);
    if (IDX !== -1) {
      this.anexoFraccionAnarelaria[IDX] = {
        ...this.anexoFraccionAnarelaria[IDX],
        catagoria:catDescripcion,
        valorEnMonedaMensual: FORMULARIO_VALOR.monedaNacionalMensual,
        valorEnMonedaAnual: FORMULARIO_VALOR.monedaNacionalDeDosPeriodos,
        volumenMensual: FORMULARIO_VALOR.volumenMensual,
        volumenAnual: FORMULARIO_VALOR.twoPeriodVolume
      };
      this.anexoFraccionAnarelaria = [...this.anexoFraccionAnarelaria];
    }
  }
    this.complimentarForm.reset();

    const ELEMENTO_MODAL = document.getElementById('complementarFuncionModal');
    if (ELEMENTO_MODAL) {
      const MODAL = Modal.getOrCreateInstance(ELEMENTO_MODAL);
      MODAL.hide();
    }
  } 
  else if (this.complimentarForm.invalid) {
    this.complimentarForm.markAllAsTouched();
    this.nuevaUnoNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action', 
      titulo: '',
      mensaje: 'Debe completar todos los campos obligatorios',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}




/**
 * Abre el modal para seleccionar o ingresar datos de un proveedor o cliente, dependiendo del contexto proporcionado.
 * 
 * @param context Indica si el modal se abrirá en el contexto de 'cliente' o 'proveedor'.
 * 
 * Si existe información previa en `proveedorClienteDatos`, se actualiza el identificador con el contexto actual.
 * 
 * El modal solo se muestra si hay una fracción arancelaria seleccionada correspondiente al contexto:
 * - Para 'cliente', se verifica `selectedFraccionRowUno`.
 * - Para 'proveedor', se verifica `selectedFraccionRowDos`.
 * 
 * Si no hay una fracción seleccionada, se muestra una notificación de alerta indicando que es necesario seleccionar una fracción arancelaria para continuar.
 */
abrirProveedorClienteModal(context: 'cliente' | 'proveedor'): void {
  if (this.proveedorClienteDatos) {
    this.proveedorClienteDatos.id = context;

  }
  const SELECT_ROW =
    context === 'cliente'
      ? Boolean(this.selectedFraccionRowUno)
      : Boolean(this.selectedFraccionRowDos);

  if (SELECT_ROW) {
    this.proveedorClienteModalContext = context;
    const ELEMENTO_MODAL = document.getElementById('proveedorClienteModal');
    if (ELEMENTO_MODAL) {
      const MODAL = new Modal(ELEMENTO_MODAL);
      MODAL.show();
    }
  } else {
    this.nuevaDosNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe seleccionar una fracción arancelaria para continuar',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}

/**
 * @method abrirProveedorPorArchivo
 * @description Abre el popup o ventana modal relacionado con la carga de proveedor por archivo,
 * estableciendo la propiedad que controla su visibilidad a `true`.
 */
abrirProveedorPorArchivo(): void {
  if (this.selectedFraccionRowUno) {
  this.mostrarProveedorClientesPopup = true;
  } else {
     this.nuevaUnoNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe ingresar las fracciones del producto y de la mercancia previamente',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
  }
}
}

/**
 * Método que habilita la visualización del modal para la carga por archivo.
 * Establece la bandera correspondiente en `true` para mostrar el modal emergente.
 */
abrirCargaPorArchivo(): void {
  this.mostrarCargaPorArchivoModal = true;
}

/**
 * @method cerrarProveedorPorArchivo
 * @description Cierra el popup o ventana modal relacionado con la carga de proveedor por archivo,
 * estableciendo la propiedad que controla su visibilidad a `false`.
 */
cerrarProveedorPorArchivo(): void {
  this.mostrarProveedorPorArchivoPopup = false;
}

/**
 * Método que cierra el popup para la carga de fracciones.
 * Cambia la bandera correspondiente a `false` para ocultar el componente emergente.
 */
cerrarCargaDeFracciones(): void {
  this.mostrarCargaDeFraccionesPopup = false;
}

/**
 * Método que maneja la aceptación de la carga por archivo.
 * Cierra el modal de carga por archivo y abre el popup de carga de fracciones.
 */
onAceptarCargaPorArchivo(): void{
  this.mostrarCargaPorArchivoModal = false;
  this.mostrarCargaDeFraccionesPopup = true;
}

/**
 * Método que maneja la cancelación de la carga por archivo.
 * Cierra el modal de carga por archivo estableciendo la bandera en false.
 */
onCancelarCargaPorArchivo(): void {
  this.mostrarCargaPorArchivoModal = false;
}

/**
 * Método que cierra el popup de proveedores y clientes.
 * Establece la bandera correspondiente en false para ocultar el popup.
 */
cerrarProveedorClientesPopup(): void {
  this.mostrarProveedorClientesPopup = false;
}

/**
 * @method selectedRowFields
 * @description Getter que devuelve un objeto con los campos seleccionados de la fila activa
 * según el contexto actual ('anexoUno' o 'anexoDos'). Si no hay una fila seleccionada en el contexto activo,
 * devuelve un objeto vacío.
 * @returns {Object} Un objeto con las propiedades: fraccionArancelaria, anexoII, tipo y umt, con valores
 * extraídos de la fila seleccionada o cadenas vacías si no existen.
 */
get selectedRowFields(): { [key: string]: string } {
  if (this.activeComplementarContext === 'anexoUno' && this.selectedFraccionRowUno) {
    return {
      fraccionArancelaria: this.selectedFraccionRowUno.fraccionArancelaria || '',
      anexoII: this.selectedFraccionRowUno.anexoII || '',
      tipo: this.selectedFraccionRowUno.tipo || '',
      umt: this.selectedFraccionRowUno.umt || '',
    };
  }
  if (this.activeComplementarContext === 'anexoDos' && this.selectedFraccionRowDos) {
    return {
      fraccionArancelaria: this.selectedFraccionRowDos.anexoFraccionExportacion || '',
      anexoII: this.selectedFraccionRowDos.anexoDos || '',
      tipo: this.selectedFraccionRowDos.tipo || '',
      umt: this.selectedFraccionRowDos.umt || '',
    };
  }
  return {};
}

/**
 * @method eliminarAnexoUno
 * @description Elimina la fracción seleccionada del listado de fracciones de exportación (Anexo 1),
 * si hay una fila seleccionada. Si no se ha seleccionado ninguna fracción, muestra una notificación
 * de advertencia al usuario indicando que debe seleccionar al menos una fracción para eliminar.
 */
eliminarAnexoUno(): void {
  if (this.selectedFraccionRowUno) {
    const INDEX = this.anexoUnoTablaLista.findIndex(row => row === this.selectedFraccionRowUno);
    if (INDEX !== -1) {
      this.anexoUnoTablaLista.splice(INDEX, 1);
      this.anexoUnoTablaLista = [...this.anexoUnoTablaLista];
    }
  } else {
    this.nuevaUnoNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Seleccione la(s) fracción(es) de Exportación a eliminar',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}

/**
 * @method eliminarAnexoDos
 * @description Elimina la fracción seleccionada del listado de fracciones de exportación (Anexo 2),
 * si hay una fila seleccionada. Si no se ha seleccionado ninguna fracción, muestra una notificación
 * de advertencia al usuario indicando que debe seleccionar al menos una fracción para eliminar.
 */
eliminarAnexoDos(): void {
  if (this.selectedFraccionRowDos) {
    const INDEX = this.anexoFraccionAnarelaria.findIndex(row => row === this.selectedFraccionRowDos);
    if (INDEX !== -1) {
      this.anexoFraccionAnarelaria.splice(INDEX, 1);
      this.anexoFraccionAnarelaria = [...this.anexoFraccionAnarelaria];
    }
  } else {
    this.nuevaDosNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Seleccione la(s) fracción(es) de Exportación a eliminar',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}

/**
 *  * compodoc
 * @method agregarProyectoImmex
 * @description Método que agrega un nuevo proyecto IMMEX. Valida el formulario y, si es válido, transforma los datos para que coincidan con la configuración de la tabla y los agrega a la lista de proyectos IMMEX.
 */
agregarProyectoImmex(): void {
  if (this.proyectoForm.valid) {
    const FORM_DATA = this.proyectoForm.value;

    // Transformar los datos del formulario para que coincidan con la configuración de la tabla
    const TRANSFORMED_DATA = {
      encabezadoFraccion: FORM_DATA.descripcion, // Mapea 'descripcion' a 'encabezadoFraccion'
      encabezadoTipoDocument: FORM_DATA.tipoDeDocumente, // Mapea 'tipoDeDocumente' a 'encabezadoTipoDocument'
      encabezadoDescripcionOtro: FORM_DATA.descripcion, // Mapea 'descripcion' a 'encabezadoDescripcionOtro'
      encabezadoFechaFirma: FORM_DATA.fechaDeFirma, // Mapea 'fechaDeFirma' a 'encabezadoFechaFirma'
      encabezadoFechaVigencia: FORM_DATA.fechaDeVigencia, // Mapea 'fechaDeVigencia' a 'encabezadoFechaVigencia'
      encabezadoRfc: FORM_DATA.rfcTaxId, // Mapea 'rfcTaxId' a 'encabezadoRfc'
      encabezadoRazonFirmante: FORM_DATA.razonSocial, // Mapea 'razonSocial' a 'encabezadoRazonFirmante'
    };

    // Agregar los datos transformados a la lista de proyectos IMMEX
    this.proyectoImmexTablaLista.push(TRANSFORMED_DATA);
    this.proyectoImmexTablaLista = [...this.proyectoImmexTablaLista];
    this.setProyectoImmex();

    // Reiniciar el formulario
    this.proyectoForm.reset();
  } else {
    console.warn('El formulario no es válido. Por favor, complete todos los campos requeridos.');
  }
}

/**
 * compodoc
 * @method agregarProveedorCliente
 * @description Método que agrega un nuevo proveedor o cliente. Valida el formulario y, si es válido, agrega los datos a la lista de proveedores y clientes.
 */
agregarProveedorCliente(): void {
    if (this.formularioProveedorCliente.valid) {
    const FORM_DATA = this.formularioProveedorCliente.value;

    const TRANSFORMED_DATA = {
      ...FORM_DATA,
      rfcTaxClient: this.proveedorClienteModalContext === 'cliente' ? FORM_DATA.rfc : '',
      rfcTaxIdProveedor: this.proveedorClienteModalContext === 'proveedor' ? FORM_DATA.rfc : '',
      razonsocialCliente: this.proveedorClienteModalContext === 'cliente' ? FORM_DATA.razonSocialCliente : '',
      razonSocialProveedor: this.proveedorClienteModalContext === 'proveedor' ? FORM_DATA.razonSocialCliente : '',
      fraccion: this.proveedorClienteModalContext === 'cliente' 
        ? this.selectedFraccionRowUno?.fraccionArancelaria || ''
        : this.selectedFraccionRowDos?.anexoFraccionExportacion || '',
      paisDestino: this.proveedorClienteModalContext === 'cliente' ? FORM_DATA.paisDestino : '',
      paisDeOrigen: this.proveedorClienteModalContext === 'proveedor' ? FORM_DATA.paisDestino : '',
      descripcionComercial: FORM_DATA.descripcionComercial
    };

    if (this.proveedorClienteModalContext === 'cliente') {
      this.clienteTablaLista.push(TRANSFORMED_DATA);
      this.clienteTablaLista = [...this.clienteTablaLista];
    } else {
      this.proveedorTablaLista.push(TRANSFORMED_DATA);
      this.proveedorTablaLista = [...this.proveedorTablaLista];
    }

    if (this.proveedorClienteDatos) {
      this.proveedorClienteDatos.data = this.proveedorClienteModalContext === 'cliente' 
        ? this.clienteTablaLista 
        : this.proveedorTablaLista;
      this.proveedorClienteDatos.id = this.proveedorClienteModalContext;
      
      this.obtenerProveedorCliente.emit({
        data: this.proveedorClienteDatos.data ?? [],
        id: this.proveedorClienteDatos.id
      });
    }

    this.formularioProveedorCliente.reset();
  }
}
  /**
   * compodoc
   *
   * @property tablaSeleccion
   * Configuración para la tabla de selección.
   * @type {TablaSeleccion}
   */
/**
 * compodoc
 * @property {TablaSeleccion} tablaSeleccion
 * Configuración para la tabla de selección. Define el tipo de selección que se puede realizar en las tablas dinámicas.
 */
tablaSeleccion = TablaSeleccion;

/**
 * compodoc
 * @property {any[]} tablaSociaAccionistas
 * Configuración de la tabla para mostrar los datos relacionados con los socios accionistas en el Anexo Uno.
 */
tablaSociaAccionistas = TABLA_ANEXO_PRODUCTO_FRACCION;

/**
 * compodoc
 * @property {any[]} tableProveedorCliente
 * Configuración de la tabla para mostrar los datos relacionados con los proveedores y clientes.
 */
tableProveedorCliente = TABLE_PROVEEDOR_CLIENTE;

/**
 * compodoc
 * @property {any[]} tableFracionAnarelaria
 * Configuración de la tabla para mostrar los datos relacionados con las fracciones arancelarias.
 */
tableFracionAnarelaria = ANEXO_FRACION_ANARELARIA;

/**
 * compodoc
 * @property {any[]} tablaProyectoImmex
 * Configuración de la tabla para mostrar los datos relacionados con los proyectos IMMEX.
 */
tablaProyectoImmex = TABLA_PROYECTO_IMMEX;

/**
 * compodoc
 * @property {Catalogo[]} paisDestinoCatalog
 * Catálogo que contiene los datos de los países de destino.
 */
public paisDestinoCatalog: Catalogo[] = [];

/**
 * compodoc
 * @property {Catalogo[]} tipoDeDocumenteCatalog
 * Catálogo que contiene los datos de los tipos de documentos disponibles.
 */
public tipoDeDocumenteCatalog: Catalogo[] = [];

  /**
   * Estado de la solicitud 250101, que contiene los valores actuales de la solicitud.
   */
  public solicitudState!: ComplementosSeccionState;


  /**
   * Crea y configura los formularios reactivos utilizados en el componente.
   * 
   * - `anexoUnoFormGroup`: Formulario para capturar información relacionada con la fracción arancelaria y su descripción.
   * - `formularioProveedorCliente`: Formulario para capturar datos del proveedor o cliente, incluyendo descripción comercial, país de destino, RFC y razón social.
   * - `proyectoForm`: Formulario para capturar información del proyecto, como descripción, tipo de documento, fechas relevantes, RFC/Tax ID y razón social.
   * - `anexoDosFormGroup`: Formulario para capturar información adicional relacionada con la fracción arancelaria y su descripción.
   * - `complimentarForm`: Formulario para capturar datos complementarios, como categoría, descripción, valores en moneda nacional y volúmenes mensuales.
   * 
   * Cada formulario incluye validaciones específicas según los requisitos de los campos.
   */
  crearFormularioAnexoUno(): void {
    this.complementosSeccionQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as ComplementosSeccionState;
        })
      )
      .subscribe();
    this.anexoUnoFormGroup = this.fb.group({
      fraccionArancelaria: [this.solicitudState['fraccionArancelaria'], Validators.required],
      descripcion: [this.solicitudState['descripcion'], [Validators.required, Validators.maxLength(1000)]],
    });
    this.formularioProveedorCliente = this.fb.group({
      descripcionComercial: [this.solicitudState['descripcionComercial'], Validators.required],
      paisDestino: [this.solicitudState['paisDestino'], Validators.required],
      rfc: [this.solicitudState['rfc'], Validators.required],
      razonSocialCliente: [this.solicitudState['razonSocialCliente'], Validators.required],
    });
    this.proyectoForm = this.fb.group({
      textDescripcion: [this.solicitudState['textDescripcion'], Validators.required],
      tipoDeDocumente: [this.solicitudState['tipoDeDocumente'], Validators.required],
      fechaDeFirma: [this.solicitudState['fechaDeFirma'], Validators.required],
      fechaDeVigencia: [this.solicitudState['fechaDeVigencia'], Validators.required],
      rfcTaxId: [0, Validators.required],
      razonSocial: [this.solicitudState['razonSocial'], Validators.required],
    });
    this.anexoDosFormGroup = this.fb.group({
      fraccionArancelarias: [this.solicitudState['fraccionArancelarias'], Validators.required],
      anexoDosDescripcion: [this.solicitudState['anexoDosDescripcion'], [Validators.required, Validators.maxLength(1000)]],
    });
    this.complimentarForm = this.fb.group({
      catagoria: [this.solicitudState['catagoria'], Validators.required],
      complimentarDescripcion: [this.solicitudState['complimentarDescripcion'], Validators.required],
      monedaNacionalMensual: [this.solicitudState['monedaNacionalMensual'], Validators.required],
      monedaNacionalDeDosPeriodos: [this.solicitudState['monedaNacionalDeDosPeriodos'], Validators.required],
      volumenMensual: [this.solicitudState['volumenMensual'], Validators.required],
      twoPeriodVolume: [this.solicitudState['twoPeriodVolume'], Validators.required],
    });
  }

    /** Sincroniza los datos de las tablas de Anexo Dos y Tres con el servicio de formularios al detectar cambios. */
  ngOnChanges(): void {
    if (this.anexoUnoTablaLista.length === 0) {
        this.servicioDeFormularioService.registerArray('anexoUnoTabla1', this.anexoUnoTablaLista);
      } else {
        this.servicioDeFormularioService.setArray('anexoUnoTabla1', this.anexoUnoTablaLista);
      }

      if (this.anexoFraccionAnarelaria.length === 0) {
        this.servicioDeFormularioService.registerArray('anexoUnoTabla2', this.anexoFraccionAnarelaria);
      } else {
        this.servicioDeFormularioService.setArray('anexoUnoTabla2', this.anexoFraccionAnarelaria);
      }
  }

  /**
   * Emite el evento `obtenerProyectoImmexTablaLista` con la lista de proyectos IMMEX proporcionada.
   *
   * @param event - Arreglo de objetos `ProyectoImmex` que representa la lista de proyectos IMMEX seleccionados.
   */
  setProyectoImmex(): void {
    this.obtenerProyectoImmexTablaLista.emit(this.proyectoImmexTablaLista);
}

  /**
   * Restringe la entrada del usuario a solo dígitos.
   * @param event 
   * @param controlName 
   */
  onSoloDigitosInput(event: Event, controlName: string): void {
    const INPUT = event.target as HTMLInputElement;
    const DIGITS = INPUT.value.replace(/[^0-9]/g, '');
    INPUT.value = DIGITS;
    this.complimentarForm.get(controlName)?.setValue(DIGITS, { emitEvent: false });
  }
}