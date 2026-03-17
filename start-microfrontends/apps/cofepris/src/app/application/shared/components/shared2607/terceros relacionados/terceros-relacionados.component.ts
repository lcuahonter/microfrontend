/* eslint-disable complexity */
import { AlertComponent, CatalogoSelectComponent, Notificacion, NotificacionesComponent, Pedimento, REGEX_CORREO_ELECTRONICO, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Catalogo, CatalogosSelect } from '@ng-mf/data-access-user';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud260702State, Solicitud260702Store } from '../../../estados/stores/shared2607/tramites260702.store';
import { TEXTOS, TIPO_PERSONA_OPTION, TIPO_PERSONA_OPTIONS, TIPO_PERSONA_RADIO_OPTIONS } from '../../../constantes/constantes.enum';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery} from '@ng-mf/data-access-user';
import { DESTINATARIO_CONFIGURACION_TABLA } from '../../../constantes/column-config.enum';
import { Destinatario } from '../../../models/destinatario.model';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { Modal } from 'bootstrap';
import { RegistrarSolicitudMcpService } from '../../../services/shared2607/registrar-solicitud-mcp.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { Solicitud260702Query } from '../../../estados/queries/shared2607/tramites260702.query';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';

/**
 * Componente para gestionar los terceros relacionados en el trámite.
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [
    CommonModule,
    TercerosRelacionadosComponent,
    AlertComponent,
    TituloComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    NotificacionesComponent,
    InputRadioComponent,
  ],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
})
export class TercerosrelacionadosComponent implements OnInit, OnDestroy, OnChanges {

  /**
   * Tipo de trámite actual, recibido del padre.
   */
  @Input() tipoTramite: string = '';
  /** Formulario reactivo para gestionar los datos del fabricante */
  /** Indica si las tablas están deshabilitadas */
  botonDesactivarParaProrrogar: boolean = false;
  /** Formulario reactivo para gestionar los datos del fabricante */
  fabricanteForm!: FormGroup;
  /** Constantes de texto utilizadas en el componente */
  TEXTOS = TEXTOS;

  /** Formulario reactivo para gestionar los datos del destinatario */
  destinatarioForm!: FormGroup;

  /** Observable para manejar la destrucción del componente */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Conjunto de filas seleccionadas en la tabla */
  filasSeleccionadas: Set<number> = new Set();

  /** Fila seleccionada actualmente */
  selectedRow: Destinatario | null = null;

  /** Estado del destinatario que se está agregando */
  agregarDestinatarioState!: Solicitud260702State;

  /** Configuración para la selección de filas en la tabla */
  destinatarioSeleccionTabla = TablaSeleccion.CHECKBOX;

  /** Lista de destinatarios seleccionados */
  selectedDestinatario: Destinatario[] = [];

  /** Indica si el formulario es visible */
  esFormularioVisible = false;

  /** Datos del catálogo de países */
  public paisData: CatalogosSelect = {
    labelNombre: 'Pais',
    required: true,
    primerOpcion: 'Selecciona un medio de transporte',
    catalogos: [],
  };

  /**
   * Variable para almacenar el tipo de persona seleccionada (por ejemplo, 'fisica' o 'moral').
   */
  tipoPersonaSeleccionada: string = '';

  /**
   * Variable para almacenar el tipo de público.
   */
  tipoDePublicos: string = '';
  /**
   * Opciones de radio para seleccionar el tipo de persona.
   */
  tipoPersonaRadioOptions = TIPO_PERSONA_RADIO_OPTIONS;
  /**
   * Opciones de radio para seleccionar el tipo de persona.
   */
  tipoPersonaOption = TIPO_PERSONA_OPTIONS;
  /**
   * Opciones de radio para seleccionar el tipo de persona.
   */
  tipoPersonaOptions = TIPO_PERSONA_OPTION;
  /**
   * Notificación actual que se mostrará en el componente.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Índice del elemento que se eliminará de la lista.
   */
  elementoParaEliminar!: number;
/** 
 * Conjunto de filas seleccionadas en la tabla de fabricantes.
 */
filasSeleccionadasFabricante: Set<number> = new Set();

/** 
 * Conjunto de filas seleccionadas en la tabla de destinatarios.
 */
filasSeleccionadasDestinatario: Set<number> = new Set();
  /**
   * Lista de pedimentos gestionados en el componente.
   */
  pedimentos: Array<Pedimento> = [];
  /** Datos de la tabla de destinatarios */
  tableData2: Destinatario[] = [];

  /** Configuración de las columnas de la tabla */
  destinatarioConfiguracionTabla = DESTINATARIO_CONFIGURACION_TABLA;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** Datos de los pedimentos */
   tablaActual: string = '';

  /** Datos de los pedimentos */
   formTitle: string = ''; 

  /** Datos de los destinatarios para 260702 */
  destinatarioDatos: Destinatario[] = [];

  /** Datos de los fabricantes para 260702 */
  fabricanteDatos: Destinatario[] = [];
  /**
   * Identificador del procedimiento que se recibe como entrada desde el componente padre.
   */
   @Input() idProcedimiento!: number;

    /**
   * Indica si se ha activado el evento de continuar.
   * Este valor se utiliza para controlar el flujo de la solicitud
   * dependiendo de si el usuario ha decidido continuar con el proceso.
   */
   @Input() isContinuarTriggered: boolean = false;
  
  /**
   * Estado actual de la solicitud de tipo `Solicitud260702State`.
   * 
   * Esta propiedad almacena la información relacionada con el estado de la solicitud
   * en el componente de terceros relacionados. Es utilizada para gestionar y reflejar
   * los cambios en la interfaz de usuario conforme avanza el proceso de la solicitud.
   */
   solicitudState!: Solicitud260702State;
   /** Indica si se debe mostrar el botón en la interfaz de usuario. */
   public mostraBtn: boolean = true;
   /** Suscripción para manejar observables. */
  private subscription!: Subscription;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param registrarsolicitudmcp Servicio para registrar solicitudes MCP.
   * @param solicitud260702Store Almacén de estado para el trámite 260702.
   * @param solicitud260702Query Consulta de estado para el trámite 260702.
   */
  constructor(
    private fb: FormBuilder,
    private registrarsolicitudmcp: RegistrarSolicitudMcpService,
    private solicitud260702Store: Solicitud260702Store,
    private solicitud260702Query: Solicitud260702Query,
    private consultaioQuery: ConsultaioQuery,
    private service: RegistrarSolicitudMcpService,
    private validacionesService: ValidacionesFormularioService
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.crearFormTransporte();
   
    
  }

  /**
   * Crea el formulario reactivo para gestionar los datos del destinatario.
   */
  crearFormTransporte(): void {
    this.destinatarioForm = this.fb.group({
      agregarDestinatario: this.fb.group({
        tipoPersona: [
          this.agregarDestinatarioState?.tipoPersona || '',
          Validators.required,
        ],
      }),
      datosPersonales: this.fb.group({
        nombre: [this.agregarDestinatarioState?.nombre || '', Validators.required],
        primerApellido: [
          this.agregarDestinatarioState?.primerApellido || '',
          [Validators.required, Validators.maxLength(18), Validators.pattern('^[a-zA-Z0-9\\s,]*$')],
        ],
        segundoApellido: [
          this.agregarDestinatarioState?.segundoApellido || '',
          [Validators.maxLength(18), Validators.pattern('^[a-zA-Z0-9\\s,]*$')],
        ],
        pais: [this.agregarDestinatarioState?.pais || '', Validators.required],
        estado: [this.agregarDestinatarioState?.estado || '', Validators.required],
        codigopostal: [
          this.agregarDestinatarioState?.codigopostal || '',
          Validators.required,
        ],
        calle: [this.agregarDestinatarioState?.calle || '', Validators.required],
        numeroExterior: [
          this.agregarDestinatarioState?.numeroExterior || '',
          Validators.required,
        ],
        numeroInterior: [
          this.agregarDestinatarioState?.numeroInterior || '',
          Validators.required,
        ],
        lada: [this.agregarDestinatarioState?.lada || ''],
        telefono: [this.agregarDestinatarioState?.telefono || ''],
        correoElectronico: [this.agregarDestinatarioState?.correoElectronico || '',[Validators.pattern(REGEX_CORREO_ELECTRONICO)]],
      }),
    });
  }

  /**
   * Método para inicializar las validaciones específicas para los campos de teléfono y correo electrónico.
   */
  inicializarValidaciones(): void {
    const TELEFONOCONTROL= this.destinatarioForm.get(['datosPersonales', 'telefono']);
    const CORREOCONTROL= this.destinatarioForm.get(['datosPersonales', 'correoElectronico']);

    if (TELEFONOCONTROL) {
      TELEFONOCONTROL.setValidators([
        Validators.pattern('^[0-9]{10}$'),
        Validators.required,
      ]);
      TELEFONOCONTROL.updateValueAndValidity();
    }

    if (CORREOCONTROL) {
      CORREOCONTROL.setValidators([
        Validators.email, Validators.required]);
      CORREOCONTROL.updateValueAndValidity();
    }
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.subscription = this.validacionesService.message$
      .subscribe((msg) => {
        Promise.resolve().then(() => {
          this.mostraBtn = msg;
        });
      });
     this.solicitud260702Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        }),
      )
      .subscribe();
    if(this.solicitudState && 
      typeof this.solicitudState === 'object' && 
      this.solicitudState !== null && 
      'FabricantesTabla' in this.solicitudState) {
        const DATOS = this.solicitudState['FabricantesTabla'] as Destinatario[];
        DATOS.forEach((dato: Destinatario) => {
          const IS_ALREADY_ADDED = this.fabricanteDatos.some(
            (item: Destinatario) => item.rfc === dato.rfc
          );
          
          if(!IS_ALREADY_ADDED) {
            this.fabricanteDatos = [...this.fabricanteDatos, dato];
          }
        });
    }

    if(this.solicitudState && 
      typeof this.solicitudState === 'object' && 
      this.solicitudState !== null && 
      'DestinatariosTabla' in this.solicitudState) {
        const DATOS = this.solicitudState['DestinatariosTabla'] as Destinatario[];
        DATOS.forEach((dato: Destinatario) => {
          const IS_ALREADY_ADDED = this.fabricanteDatos.some(
            (item: Destinatario) => item.pais === dato.pais
          );
          
          if(!IS_ALREADY_ADDED) {
            this.destinatarioDatos = [...this.destinatarioDatos, dato];
          }
        });
    }
    this.inicializarEstadoFormulario();
    this.inicializarValidaciones();
    this.crearFormFabricante(); // Ensure fabricanteForm is initialized
  }
/**
   * Método para validar los campos del formulario y mostrar errores si son inválidos.
   */
  validarCamposFormulario(): void {
    Object.keys(this.destinatarioForm.controls).forEach((key) => {
      const CONTROL= this.destinatarioForm.get(key);
      if (CONTROL && CONTROL.invalid) {
        CONTROL.markAsTouched();
      }
    });
  }

  /**
   * Método para forzar la validación de todos los campos del formulario.
   */
  forzarValidacionFormulario(): void {
    Object.keys(this.destinatarioForm.controls).forEach((key) => {
      const GROUP= this.destinatarioForm.get(key) as FormGroup;
      if (GROUP) {
        Object.keys(GROUP.controls).forEach((field) => {
          const CONTROL= GROUP.get(field);
          if (CONTROL) {
            CONTROL.updateValueAndValidity();
          }
        });
      }
    });
  }

  /**
   * Detecta cambios en las propiedades de entrada del componente y ejecuta validaciones cuando se activa el botón continuar.
   */
  ngOnChanges(): void {
    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => {
        this.forzarValidacionFormulario();
        this.validarFormularios();
      });
    }
    if ((this.tipoTramite !== 'prorroga')) {
      this.botonDesactivarParaProrrogar = true;
    } else {
      this.botonDesactivarParaProrrogar = false;
    }
  }
  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    this.solicitud260702Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
         map((seccionState) => {
          this.agregarDestinatarioState = seccionState;
          if (this.esFormularioSoloLectura && seccionState.tableData2) {
            this.tableData2 = [...seccionState.tableData2];
          } else if (seccionState.tableData2) {
            this.tableData2 = [...seccionState.tableData2];
          }
        })
      )
      .subscribe();
      this.solicitud260702Query.selectSolicitud$
    .pipe(takeUntil(this.destroyed$))
    .subscribe(state => {

    });
    this.crearFormTransporte();
    this.getPaisData();
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.destinatarioForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.destinatarioForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

/**
 * Valida los formularios y la tabla de datos.
 * @returns `true` si todos los formularios y la tabla son válidos, `false` en caso contrario.
 */
  validarFormularios(): boolean {
    const FABRICANTE_VALID = (this.fabricanteDatos?.length ?? 0) > 0;
    const DESTINATARIO_VALID = (this.destinatarioDatos?.length ?? 0) > 0;
  const ES_VALIDO_FINAL = FABRICANTE_VALID && DESTINATARIO_VALID;
  this.solicitud260702Store.setFormValidity('tercerosRelacionados', ES_VALIDO_FINAL);
    return FABRICANTE_VALID && DESTINATARIO_VALID;
  }
  /**
   * Elimina un pedimento de la lista.
   * @param borrar Indica si se debe proceder con la eliminación.
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
      this.eliminarMercancias(); // Call the deletion logic
      this.abrirModal(0, true);
    }
  }
  /**
   * Abre un modal para mostrar una notificación.
   * @param i Índice del elemento seleccionado (por defecto 0).
   * @param isDeleted Indica si se debe mostrar la notificación de éxito tras la eliminación.
   */
  abrirModal(i: number = 0, isDeleted: boolean = false): void {
    if (isDeleted) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'success',
        modo: 'action',
        titulo: '',
        mensaje: 'Datos eliminados correctamente',
        cerrar: true,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else if (this.filasSeleccionadas && this.filasSeleccionadas.size > 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      this.elementoParaEliminar = i;
    }
  }

  /**
   * Obtiene los datos del catálogo de países.
   */
  getPaisData(): void { 
     if (this.idProcedimiento) {
    this.service
      .obtenerPaises(this.idProcedimiento?.toString())
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.paisData.catalogos = data.datos as Catalogo[];
      });
    } else {
      this.service
      .getPaisData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.paisData.catalogos = data as Catalogo[];
      });
    }
  }

  /**
   * Getter para obtener el tipo de persona seleccionado.
   */
  get selectedTipoPersona(): string | undefined {
    return this.agregarDestinatario.get('tipoPersona')?.value;
  }

  /**
   * Getter para obtener el formulario de agregar destinatario.
   */
  get agregarDestinatario(): FormGroup {
    return this.destinatarioForm.get('agregarDestinatario') as FormGroup;
  }

  /**
   * Guarda los datos del formulario en la tabla.
   */
onGuardar(): void {
  const FORM_DATA = this.destinatarioForm.value;

  /** Manejar únicamente las tablas de 'fabricante' y 'destinatario' */
  let targetTable: Destinatario[] = [];
  switch (this.tablaActual) {
    case 'fabricante':
      targetTable = this.fabricanteDatos;
      break;
    case 'destinatario':
      targetTable = this.destinatarioDatos;
      break;
    default:
      
      return;
  }

  /** Actualizar la fila existente si una fila está seleccionada */
  if (this.selectedRow) {
    const INDEX = targetTable.findIndex((row) => row.id === this.selectedRow?.id);
    if (INDEX !== -1) {
      const UPDATED_ROW = {
        ...targetTable[INDEX],
        ...FORM_DATA.agregarDestinatario,
        ...FORM_DATA.datosPersonales,
      };
      targetTable[INDEX] = UPDATED_ROW;

      if (this.tablaActual === 'fabricante') {        
         this.solicitud260702Store.setFabricanteDatos([...targetTable]);
      } else if (this.tablaActual === 'destinatario') {
                 this.solicitud260702Store.setFabricanteDatos([...targetTable]);
      }
    }
  } else {
    /** Agregar nueva fila si no se seleccionó ninguna fila */
    const NEW_ID =
      targetTable.length > 0
        ? Math.max(...targetTable.map((row) => row.id || 0)) + 1
        : 1;
    const NEW_ROW = {
      id: NEW_ID,
      ...FORM_DATA.agregarDestinatario,
      ...FORM_DATA.datosPersonales,
    };

    if (this.tablaActual === 'fabricante') {
           
      this.solicitud260702Store.setFabricanteDatos([...this.fabricanteDatos, NEW_ROW])
    } else if (this.tablaActual === 'destinatario') {
      
       this.solicitud260702Store.setDestinatarioDatos([...this.destinatarioDatos, NEW_ROW]);
    }
  }

  /** Restablecer el formulario y ocultarlo. */
  this.destinatarioForm.reset();
  this.esFormularioVisible = false;
  this.selectedRow = null;
}
  /**
   * Maneja el cambio de filas seleccionadas en la tabla.
   * @param filasSeleccionadas Filas seleccionadas.
   */
 enCambioDeFilasSeleccionadas(filasseleccionadas: Destinatario[], tableName: string): void {
  this.tablaActual = tableName;
  switch (tableName) {
    case 'fabricante':
      this.filasSeleccionadasFabricante = new Set(filasseleccionadas.map((row) => row.id));
      break;
    case 'destinatario':
      this.filasSeleccionadasDestinatario = new Set(filasseleccionadas.map((row) => row.id));
      break;
    default:
      console.error('Invalid table name. Only "fabricante" and "destinatario" are allowed.');
  }
}

  /**
 * Elimina la mercancía seleccionada de la tabla.
 */
eliminarMercancias(): void {
  let filasseleccionadas: Set<number>;

  /* Determinar las filas seleccionadas y la tabla objetivo según la tabla actual. */
  switch (this.tablaActual) {
    case 'fabricante':
      filasseleccionadas = this.filasSeleccionadasFabricante;
      this.fabricanteDatos = this.fabricanteDatos.filter(
        (row) => !filasseleccionadas.has(row.id)
      );
       
this.solicitud260702Store.setFabricanteDatos(this.fabricanteDatos)
      break;
    case 'destinatario':
      filasseleccionadas = this.filasSeleccionadasDestinatario;
      this.destinatarioDatos = this.destinatarioDatos.filter(
        (row) => !filasseleccionadas.has(row.id)
      );
       this.solicitud260702Store.setDestinatarioDatos(this.destinatarioDatos);
      break;
    default:
     
      return;
  }

  /** Limpiar las filas seleccionadas */
  filasseleccionadas.clear();

  /** Mostrar una notificación de éxito */
  this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'success',
    modo: 'action',
    titulo: '',
    mensaje: 'Datos eliminados correctamente',
    cerrar: false,
    tiempoDeEspera: 0,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };
}
editingRowId: number | null = null;
  /**
   * Abre el formulario para modificar las mercancías seleccionadas.
   */
openModificarMercancias(): void {
  let filasseleccionadas: Set<number>;

  switch (this.tablaActual) {
    case 'fabricante':
      filasseleccionadas = this.filasSeleccionadasFabricante;
      break;
    case 'destinatario':
      filasseleccionadas = this.filasSeleccionadasDestinatario;
      break;
    default:
    
      return;
  }

  if (filasseleccionadas.size === 1) {
    const SELECTED_ID = Array.from(filasseleccionadas)[0];
    const SELECTED_ROW_DATA = this.tablaActual === 'fabricante'
      ? this.fabricanteDatos.find((row) => row.id === SELECTED_ID)
      : this.destinatarioDatos.find((row) => row.id === SELECTED_ID);

    if (SELECTED_ROW_DATA) {
      this.destinatarioForm.patchValue({
        agregarDestinatario: {
          tipoPersona: SELECTED_ROW_DATA.tipoPersona,
        },
        datosPersonales: {
          nombre: SELECTED_ROW_DATA.nombre,
          primerApellido: SELECTED_ROW_DATA.primerApellido,
          segundoApellido: SELECTED_ROW_DATA.segundoApellido,
          denominacion: SELECTED_ROW_DATA.denominacion,
          pais: SELECTED_ROW_DATA.pais,
          domicilio: SELECTED_ROW_DATA.domicilio,
          estado: SELECTED_ROW_DATA.estado,
          codigopostal: SELECTED_ROW_DATA.codigopostal,
          calle: SELECTED_ROW_DATA.calle,
          numeroExterior: SELECTED_ROW_DATA.numeroExterior,
          numeroInterior: SELECTED_ROW_DATA.numeroInterior,
          lada: SELECTED_ROW_DATA.lada,
          telefono: SELECTED_ROW_DATA.telefono,
          correoElectronico: SELECTED_ROW_DATA.correoElectronico,
        },
      });

      this.selectedRow = SELECTED_ROW_DATA; 
      this.esFormularioVisible = true;
    } 
  } 
}
  /**
   * Abre el formulario para agregar nuevas mercancías.
   */
agregarMercancias(tableName: string, title: string): void {
  /* Validar el nombre de la tabla para permitir solo 'fabricante' y 'destinatario' */
  if (!['fabricante', 'destinatario'].includes(tableName)) {
    return;
  }

  /** Establecer la tabla actual y el título del formulario */
  this.tablaActual = tableName;
  this.formTitle = title;

  /** Restablecer el formulario y hacerlo visible */
  this.esFormularioVisible = true;
  this.destinatarioForm.reset();

  this.selectedRow = null; 
  
}

  /**
   * Cancela la visualización del formulario.
   */
  cancelarFormulario(): void {
    this.esFormularioVisible = false;
  }

  /**
   * Confirma la eliminación de las mercancías seleccionadas.
   */
  onConfirmarEliminacion(): void {
    this.eliminarMercancias();
    const MODAL_ELEMENT = document.getElementById('datoseliminadosModal');
    if (MODAL_ELEMENT) {
      const DATOS_ELIMINADOS_MODAL = new Modal(MODAL_ELEMENT);
      DATOS_ELIMINADOS_MODAL.show();
    }
    this.abrirModal();
  }

  /**
   * Limpia los datos del formulario.
   */
  limpiarFormulario(): void {
    this.destinatarioForm.reset();
  }

  /**
   * Maneja la acción de eliminación de las filas seleccionadas.
   * Si hay filas seleccionadas, abre un modal para confirmar la eliminación.
   */
/**
 * Elimina las filas seleccionadas de la tabla actual (fabricante o destinatario).
 */
enEliminado(tableName: string): void {
  this.tablaActual = tableName;

  let filasseleccionadas: Set<number>;
  switch (this.tablaActual) {
    case 'fabricante':
      filasseleccionadas = this.filasSeleccionadasFabricante;
      break;
    case 'destinatario':
      filasseleccionadas = this.filasSeleccionadasDestinatario;
      break;
    default:
    
      return;
  }

  if (filasseleccionadas.size > 0) {
     

  this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
       this.elementoParaEliminar = 0; 

  } else {
    console.warn('No rows selected for deletion.');
  }
}
  /**
   * Establece valores en el store a partir del formulario.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Método del store para actualizar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud260702Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud260702Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Establece el tipo de persona seleccionado.
   * @param value Valor seleccionado (cadena o número).
   */
  setTipoPersona(value: string | number): void {
    this.tipoPersonaSeleccionada = value.toString();
  }

 /**   * Establece el tipo de público seleccionado.
   * @param value Valor seleccionado (cadena o número).
   */
  setTipoPersonaFabricante(value: string | number): void {
    this.tipoDePublicos = value.toString();
  }
  /**
   * Método que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


  /** * Crea el formulario reactivo para gestionar los datos del fabricante.
   */

  crearFormFabricante(): void {
    this.fabricanteForm = this.fb.group({
      agregarFabricante: this.fb.group({
        tipoPersonaFabricante: ['', Validators.required],
        tipoPersona: ['', Validators.required],
        rfc: ['', Validators.required],
        curp: ['', Validators.required],
        pais: ['', Validators.required],
        estado: ['', Validators.required],
        municipio: ['', Validators.required],
       nombreFabricante: ['', Validators.required],
        localidad: ['', Validators.required],
        codigopostal: ['', Validators.required],
        colonia: ['', Validators.required],
        calle: ['', Validators.required],
         numeroExterior: ['', Validators.required],
        numeroInterior: [''],
        lada: [''],
        correoElectronico: ['', [Validators.pattern(REGEX_CORREO_ELECTRONICO)]],
        telefono: [''],
      }),
      datosFabricante: this.fb.group({
       
      }),
    });
  }



  /** Guarda los datos del fabricante en la tabla. */
  public guardarFabricante(): void {
    if(this.fabricanteForm.invalid) {
      this.fabricanteForm.markAllAsTouched();
      return;
    }
    const FORM_DATA = {
        id: 1,
        nombre: this.fabricanteForm.get('agregarFabricante.nombre')?.value || '',
        rfc: this.fabricanteForm.get('agregarFabricante.rfc')?.value || '',
        curp: this.fabricanteForm.get('agregarFabricante.curp')?.value || '',
        telefono: this.fabricanteForm.get('agregarFabricante.telefono')?.value || '',
        correoElectronico: this.fabricanteForm.get('agregarFabricante.correoElectronico')?.value || '',
        tipoPersona: this.fabricanteForm.get('agregarFabricante.tipoPersona')?.value || '',
        calle: this.fabricanteForm.get('agregarFabricante.calle')?.value || '',
        numeroExterior: this.fabricanteForm.get('agregarFabricante.numeroExterior')?.value || '',
        numeroInterior: this.fabricanteForm.get('agregarFabricante.numeroInterior')?.value || '',
        pais: this.fabricanteForm.get('agregarFabricante.pais')?.value || '',
        colonia: this.fabricanteForm.get('agregarFabricante.colonia')?.value || '',
        municipio: this.fabricanteForm.get('agregarFabricante.municipio')?.value || '',
        localidad: this.fabricanteForm.get('agregarFabricante.localidad')?.value || '',
        estado: this.fabricanteForm.get('agregarFabricante.estado')?.value || '',
        estado2: this.fabricanteForm.get('agregarFabricante.estado2')?.value || '',
        codigopostal: this.fabricanteForm.get('agregarFabricante.codigopostal')?.value || '',
        domicilio: this.fabricanteForm.get('agregarFabricante.domicilio')?.value || '',
        lada: this.fabricanteForm.get('agregarFabricante.lada')?.value || '', 
        primerApellido: this.fabricanteForm.get('agregarFabricante.primerApellido')?.value || '',
        segundoApellido: this.fabricanteForm.get('agregarFabricante.segundoApellido')?.value || '',
        denominacion: this.fabricanteForm.get('agregarFabricante.denominacion')?.value || '',
    };

    this.fabricanteDatos = [...this.fabricanteDatos, FORM_DATA];
    this.solicitud260702Store.setDynamicFieldValue('FabricantesTabla', this.fabricanteDatos);
    this.fabricanteForm.reset();
  }

  /** Guarda los datos del destinatario en la tabla. */
  public guardarDestinatario(): void {
    if(this.destinatarioForm.invalid) {
      this.destinatarioForm.markAllAsTouched();
      return;
    }
    const FORM_DATA = {
        id: 2,
        nombre: this.destinatarioForm.get('datosPersonales.nombre')?.value || '',
        rfc: this.destinatarioForm.get('datosPersonales.rfc')?.value || '',
        curp: this.destinatarioForm.get('datosPersonales.curp')?.value || '',
        telefono: this.destinatarioForm.get('datosPersonales.telefono')?.value || '',
        correoElectronico: this.destinatarioForm.get('datosPersonales.correoElectronico')?.value || '',
        tipoPersona: this.destinatarioForm.get('agregarDestinatario.tipoPersona')?.value || '',
        calle: this.destinatarioForm.get('datosPersonales.calle')?.value || '',
        numeroExterior: this.destinatarioForm.get('datosPersonales.numeroExterior')?.value || '',
        numeroInterior: this.destinatarioForm.get('datosPersonales.numeroInterior')?.value || '',
        pais: this.destinatarioForm.get('datosPersonales.pais')?.value || '',
        colonia: this.destinatarioForm.get('datosPersonales.colonia')?.value || '',
        municipio: this.destinatarioForm.get('datosPersonales.municipio')?.value || '',
        localidad: this.destinatarioForm.get('datosPersonales.localidad')?.value || '',
        estado: this.destinatarioForm.get('datosPersonales.estado')?.value || '',
        estado2: this.destinatarioForm.get('datosPersonales.estado2')?.value || '',
        codigopostal: this.destinatarioForm.get('datosPersonales.codigopostal')?.value || '',
        domicilio: this.destinatarioForm.get('datosPersonales.domicilio')?.value || '',
        lada: this.destinatarioForm.get('datosPersonales.lada')?.value || '', 
        primerApellido: this.destinatarioForm.get('datosPersonales.primerApellido')?.value || '',
        segundoApellido: this.destinatarioForm.get('datosPersonales.segundoApellido')?.value || '',
        denominacion: this.destinatarioForm.get('datosPersonales.denominacion')?.value || '',
    };
    this.destinatarioDatos = [...this.destinatarioDatos, FORM_DATA];
    this.solicitud260702Store.setDynamicFieldValue('DestinatariosTabla', this.destinatarioDatos);
    this.destinatarioForm.reset();
  }
}
