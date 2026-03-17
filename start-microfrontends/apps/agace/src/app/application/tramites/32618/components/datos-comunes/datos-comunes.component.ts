import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionAporteColumna } from '@libs/shared/data-access-user/src';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { DOMICILIOS_CONFIGURACION_COLUMNAS } from '../../constants/solicitud.enum';

import { Domicilios, SolicitudCatologoSelectLista } from '../../models/solicitud.model';
import { ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { INVENTARIOS_CONFIGURACION } from '../../constants/solicitud.enum';
import { InputRadio } from '../../models/solicitud.model';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { InstalacionesPrincipalesComponent } from '../instalaciones-principales/instalaciones-principales.component';
import { Inventarios } from '../../models/solicitud.model';
import { MiembroDeLaEmpresaComponent } from '../miembro-de-la-empresa/miembro-de-la-empresa.component';
import { Modal } from 'bootstrap';
import { NUMERO_DE_EMPLEADOS_CONFIGURACION } from '../../constants/solicitud.enum';
import { Notificacion } from '@libs/shared/data-access-user/src';
import { NumeroDeEmpleados } from '../../models/solicitud.model';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Pedimento } from '@libs/shared/data-access-user/src';
import { ReactiveFormsModule } from '@angular/forms';
import { SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS } from '../../constants/solicitud.enum';


import { SeccionSociosIC } from '../../models/solicitud.model';
import { SeccionSubcontratadosComponent } from '../seccion-subcontratados/seccion-subcontratados.component';

import { SolicitudQuery } from '../../estados/solicitud.query';
import { SolicitudRadioLista } from '../../models/solicitud.model';
import { SolicitudState } from '../../estados/solicitud.store';
import { SolicitudStore} from '../../estados/solicitud.store';
import { SolicitudeService } from '../../services/solicitude.service';

import { Subject } from 'rxjs';
import { TablaConEntradaComponent } from '@libs/shared/data-access-user/src';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { ToastrModule } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente principal para la gestión de datos comunes de la solicitud.
 * Este componente se encarga de mostrar y gestionar las secciones relacionadas
 * con miembros de la empresa, subcontratados, instalaciones principales y otros
 * datos necesarios en el flujo de la solicitud.
 */
@Component({
  selector: 'app-datos-comunes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    InputRadioComponent,
    InstalacionesPrincipalesComponent,
    TituloComponent,
    TablaDinamicaComponent,
     MiembroDeLaEmpresaComponent,
     SeccionSubcontratadosComponent,
    TablaConEntradaComponent,
    ToastrModule,
  ],
  templateUrl: './datos-comunes.component.html',
  styleUrl: './datos-comunes.component.scss',
})
/**
 * Componente principal para la gestión de datos comunes de la solicitud.
 * Este componente se encarga de mostrar y gestionar las secciones relacionadas
 * con miembros de la empresa, subcontratados, instalaciones principales y otros
 * datos necesarios en el flujo de la solicitud.
 */
export class DatosComunesComponent implements OnInit, OnDestroy {
  /** Formulario principal que contiene los datos comunes del componente */
  datosComunesForm!: FormGroup;

  /** Subject para manejar la destrucción del componente y evitar fugas de memoria */
  private destroy$: Subject<void> = new Subject<void>();

  /** Modelo para la opción de tipo sí/no representado como radio button */
  sinoOpcion: InputRadio = {} as InputRadio;

  /** Catálogo para el sector productivo */
  sectorProductivo: CatalogosSelect = {} as CatalogosSelect;

  /** Catálogo para el tipo de servicio */
  servicio: CatalogosSelect = {} as CatalogosSelect;

  /** Catálogo para seleccionar el bimestre */
  bimestre: CatalogosSelect = {} as CatalogosSelect;

  /** Catálogo con opción para indicar "todos" */
  indiqueTodos: CatalogosSelect = {} as CatalogosSelect;

  /** Estado actual del formulario 32605 */
  solicitudState: SolicitudState = {} as SolicitudState;

  /** Tipo de tabla utilizada para mostrar número de empleados (checkbox) */
  numeroDeEmpleadosTabla = TablaSeleccion.CHECKBOX;

  /** Configuración de columnas para la tabla de número de empleados */
  numeroDeEmpleadosConfiguracionColumnas: ConfiguracionColumna<NumeroDeEmpleados>[] =
    NUMERO_DE_EMPLEADOS_CONFIGURACION;

  /** Lista completa de número de empleados */
  numeroDeEmpleadosLista: NumeroDeEmpleados[] = [] as NumeroDeEmpleados[];

  /** Lista de empleados seleccionados en la tabla */
  seleccionarNumeroDeEmpleadosLista: NumeroDeEmpleados[] =
    [] as NumeroDeEmpleados[];

  /** Configuración de columnas para la tabla de domicilios */
  domiciliosConfiguracionColumnas: ConfiguracionColumna<Domicilios>[] =
    DOMICILIOS_CONFIGURACION_COLUMNAS;

  /** Datos de los domicilios disponibles */
  domiciliosDatos: Domicilios[] = [] as Domicilios[];

  /** Domicilios seleccionados por el usuario */
  seleccionarDomiciliosDatos: Domicilios[] = [] as Domicilios[];

  /** Configuración de columnas para la tabla de inventarios */
  inventariosConfiguracionColumnas: ConfiguracionAporteColumna<Inventarios>[] =
    INVENTARIOS_CONFIGURACION;

  /** Datos de inventarios registrados */
  inventariosDatos: Inventarios[] = [] as Inventarios[];

  /** Inventarios seleccionados por el usuario */
  seleccionarInventarios: Inventarios[] = [] as Inventarios[];

  /** Configuración de columnas para la sección de socios IC */
  seccionSociosICConfiguracionColumnas: ConfiguracionColumna<SeccionSociosIC>[] =
    SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS;

  /** Lista de socios IC registrados */
  listaSeccionSociosIC: SeccionSociosIC[] = [] as SeccionSociosIC[];

  /** Lista de socios IC seleccionados por el usuario */
  seleccionarListaSeccionSociosIC: SeccionSociosIC[] = [] as SeccionSociosIC[];

  /**
   * Referencia al modal para agregar miembros de la empresa.
   */
  @ViewChild('modalAgregarMiembrosEmpresa', { static: false })
  modalElement!: ElementRef;

  /**
   * Referencia al modal de la sección de subcontratados.
   */
  @ViewChild('modalSeccionSubcontratados', { static: false })
  modalSeccionSubcontratadosElement!: ElementRef;

  /**
   * Referencia al modal de instalaciones principales.
   */
  @ViewChild('modalInstalacionesPrincipales', { static: false })
  modalInstalacionesPrincipalesElement!: ElementRef;

  /**
   * Notificación utilizada para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Índice o identificador del elemento que se desea eliminar de la tabla de pedimentos.
   */
  elementoParaEliminar!: number;

  /**
   * Lista de pedimentos ingresados por el usuario.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente donde se inicializan servicios y se cargan catálogos necesarios.
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: SolicitudeService,
    public solicitudStore: SolicitudStore,
    public solicitudQuery: SolicitudQuery,
    public consultaioQuery: ConsultaioQuery
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
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.conseguirOpcionDeRadio();
    this.conseguirOpcionDeRadio();
    this.conseguirSolicitudCatologoSelectLista();
    this.conseguirInventarios();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario `datosComunesForm` con valores del estado actual
   * y suscribe a los cambios del store para mantener los datos sincronizados.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosComunesForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.datosComunesForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `datosComunesForm` con los valores actuales del estado `solicitudState`.
   *
   * Este formulario contiene una amplia variedad de campos que representan diferentes datos
   * requeridos por la solicitud 32605. Los valores iniciales de cada control se obtienen
   * directamente del estado actual gestionado por el store.
   *
   */
  inicializarFormulario(): void {
    this.datosComunesForm = this.fb.group({
      catseleccionados: [this.solicitudState.catseleccionados],
      servicio: [this.solicitudState.servicio],
      '190': [this.solicitudState['190']],
      '191': [this.solicitudState['191']],
      '199': [this.solicitudState['199']],
      empleados: [this.solicitudState.empleados],
      bimestre: [this.solicitudState.bimestre],
      '2034': [this.solicitudState['2034']],
      '236': [this.solicitudState['236']],
      '237': [this.solicitudState['237']],
      '238': [this.solicitudState['238']],
      '239': [this.solicitudState['239']],
      '240': [this.solicitudState['240']],
      '243': [this.solicitudState['243']],
      '244': [this.solicitudState['244']],
      '245': [this.solicitudState['245']],
      indiqueTodos: [this.solicitudState.indiqueTodos],
      '246': [this.solicitudState['246']],
      file1: [this.solicitudState.file1],
      file2: [this.solicitudState.file2],
      '247': [this.solicitudState['247']],
      '248': [this.solicitudState['248']],
      identificacion: [this.solicitudState.identificacion],
      lugarDeRadicacion: [this.solicitudState.lugarDeRadicacion],
      '249': [this.solicitudState['249']],
      '250': [this.solicitudState['250']],
      '251': [this.solicitudState['251']],
      checkbox1: [this.solicitudState.checkbox1],
      checkbox2: [this.solicitudState.checkbox2],
      checkbox3: [this.solicitudState.checkbox3],
      actualmente2: [this.solicitudState.actualmente2],
      actualmente1: [this.solicitudState.actualmente1],
    });

    /**
     * Suscripción al estado de solicitud en el store para mantener
     * sincronizados los datos del formulario con el estado global.
     */
    this.solicitudQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: SolicitudState) => {
          this.solicitudState = respuesta;
          this.datosComunesForm.patchValue({
            catseleccionados: this.solicitudState.catseleccionados,
            servicio: this.solicitudState.servicio,
            '190': this.solicitudState['190'],
            '191': this.solicitudState['191'],
            '199': this.solicitudState['199'],
            empleados: this.solicitudState.empleados,
            bimestre: this.solicitudState.bimestre,
            '2034': this.solicitudState['2034'],
            '236': this.solicitudState['236'],
            '237': this.solicitudState['237'],
            '238': this.solicitudState['238'],
            '239': this.solicitudState['239'],
            '240': this.solicitudState['240'],
            '243': this.solicitudState['243'],
            '244': this.solicitudState['244'],
            '245': this.solicitudState['245'],
            indiqueTodos: this.solicitudState.indiqueTodos,
            '246': this.solicitudState['246'],
            file1: this.solicitudState.file1,
            file2: this.solicitudState.file2,
            '247': this.solicitudState['247'],
            '248': this.solicitudState['248'],
            identificacion: this.solicitudState.identificacion,
            lugarDeRadicacion: this.solicitudState.lugarDeRadicacion,
            '249': this.solicitudState['249'],
            '250': this.solicitudState['250'],
            '251': this.solicitudState['251'],
            checkbox1: this.solicitudState.checkbox1,
            checkbox2: this.solicitudState.checkbox2,
            checkbox3: this.solicitudState.checkbox3,
            actualmente2: this.solicitudState.actualmente2,
            actualmente1: this.solicitudState.actualmente1,
          });
          this.numeroDeEmpleadosLista =
            this.solicitudState.numeroDeEmpleadosLista;
          this.domiciliosDatos = this.solicitudState.domiciliosDatos;
          this.listaSeccionSociosIC =
            this.solicitudState.listaSeccionSociosIC;
        })
      )
      .subscribe();
  }

  /**
   * Método para obtener la opción de radio (sí/no) desde el servicio.
   * Se suscribe al observable y asigna el resultado a `sinoOpcion`.
   */
  conseguirOpcionDeRadio(): void {
    this.solicitudService
      .conseguirOpcionDeRadio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudRadioLista) => {
          this.sinoOpcion = respuesta.requisitos;
        },
      });
  }

  /**
   * Método para obtener los catálogos del formulario desde el servicio.
   * Se asignan los valores correspondientes a sus propiedades.
   */
  conseguirSolicitudCatologoSelectLista(): void {
    this.solicitudService
      .conseguirSolicitudCatologoSelectLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudCatologoSelectLista) => {
          this.sectorProductivo = respuesta.sectorProductivo;
          this.servicio = respuesta.servicio;
          this.bimestre = respuesta.bimestre;
          this.indiqueTodos = respuesta.indiqueTodos;
        },
      });
  }

  /**
   * Método para obtener los datos de inventarios desde el servicio.
   * Los resultados se asignan a la propiedad `inventariosDatos`.
   */
  conseguirInventarios(): void {
    this.solicitudService
      .conseguirInventarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: Inventarios[]) => {
          this.inventariosDatos = respuesta;
        },
      });
  }

  /**
   * Muestra el modal para agregar miembros de la empresa.
   * Se utiliza el elemento del DOM referenciado como modalElement.
   */
  agregarMiembrosEmpresa(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Muestra el modal para agregar subcontratados a la empresa.
   * Utiliza el elemento referenciado como modalSeccionSubcontratadosElement.
   */
  agregarSubcontratados(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(
        this.modalSeccionSubcontratadosElement.nativeElement
      );
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Muestra el modal para agregar instalaciones principales de la empresa.
   * Utiliza el elemento referenciado como modalInstalacionesPrincipalesElement.
   */
  agregarInstalacionesPrincipales(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(
        this.modalInstalacionesPrincipalesElement.nativeElement
      );
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Actualiza la lista de miembros de la empresa con un nuevo registro recibido como evento.
   * También actualiza el store y agrega un objeto pedimento por defecto.
   * Muestra un modal con mensaje de éxito al usuario.
   *
   * @param {SeccionSociosIC} evento - Datos del nuevo miembro de la empresa.
   */
  eventoActualizarMiembro(evento: SeccionSociosIC): void {
    this.listaSeccionSociosIC = [...this.listaSeccionSociosIC, evento];
    this.solicitudStore.actualizarListaSeccionSociosIC(
      this.listaSeccionSociosIC
    );
    const PEDIMENTO = {
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: 'Por evaluar',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false,
    };
    this.abrirModal('Datos guardados correctamente.');
    this.pedimentos.push(PEDIMENTO);
  }

  /**
   * Muestra una notificación en forma de modal con el mensaje proporcionado.
   * También almacena el índice de un elemento que se desea eliminar.
   *
   * @param {string} mensaje - El mensaje a mostrar en el modal.
   * @param {number} [i=0] - El índice del elemento a eliminar (opcional, por defecto 0).
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Agrega un nuevo subcontratado a la lista y actualiza el estado global en el store.
   *
   * @param {NumeroDeEmpleados} evento - Datos del subcontratado a agregar.
   */
  seccionSubcontratados(evento: NumeroDeEmpleados): void {
    this.numeroDeEmpleadosLista = [...this.numeroDeEmpleadosLista, evento];
    this.solicitudStore.actualizarNumeroDeEmpleadosLista(
      this.numeroDeEmpleadosLista
    );
  }

  /**
   * Agrega una nueva instalación principal a la lista y actualiza el store.
   * También agrega un objeto pedimento por defecto y muestra un mensaje de éxito.
   *
   * @param {Domicilios} evento - Datos de la instalación principal a agregar.
   */
  instalacionesPrincipales(evento: Domicilios): void {
    this.domiciliosDatos = [...this.domiciliosDatos, evento];
    this.solicitudStore.actualizarDomiciliosDatos(this.domiciliosDatos);
    const PEDIMENTO = {
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: 'Por evaluar',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false,
    };
    this.abrirModal('Datos guardados correctamente.');
    this.pedimentos.push(PEDIMENTO);
  }
  /**
   * Actualiza el valor del catálogo seleccionado en el estado global.
   *
   * @param {Catalogo} valor - Elemento del catálogo seleccionado.
   */
  actualizarCatseleccionados(valor: Catalogo): void {
    this.solicitudStore.actualizarCatseleccionados(valor.id);
  }

  /**
   * Actualiza el servicio seleccionado en el estado global.
   *
   * @param {Catalogo} valor - Elemento del catálogo correspondiente al servicio.
   */
  actualizarServicio(valor: Catalogo): void {
    this.solicitudStore.actualizarServicio(valor.id);
  }

  /**
   * Actualiza el campo '190' en el estado global.
   *
   * @param {string | number} valor - Valor numérico o de texto para el campo 190.
   */
  actualizar190(valor: string | number): void {
    this.solicitudStore.actualizar190(valor);
  }

  /**
   * Actualiza el campo '191' en el estado global.
   *
   * @param {string | number} valor - Valor numérico o de texto para el campo 191.
   */
  actualizar191(valor: string | number): void {
    this.solicitudStore.actualizar191(valor);
  }

  /**
   * Actualiza el campo '199' en el estado global.
   *
   * @param {string | number} valor - Valor numérico o de texto para el campo 199.
   */
  actualizar199(valor: string | number): void {
    this.solicitudStore.actualizar199(valor);
  }

  /**
   * Actualiza el número de empleados ingresado.
   *
   * @param {Event} valor - Evento de entrada del usuario.
   */
  actualizarEmpleados(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarEmpleados(VALOR);
  }

  /**
   * Actualiza el valor del bimestre seleccionado en el estado global.
   *
   * @param {Catalogo} valor - Elemento del catálogo correspondiente al bimestre.
   */
  actualizarBimestre(valor: Catalogo): void {
    this.solicitudStore.actualizarBimestre(valor.id);
  }

  /**
   * Actualiza el campo '2034' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 2034.
   */
  actualizar2034(valor: string | number): void {
    this.solicitudStore.actualizar2034(valor);
  }

  /**
   * Actualiza el campo '236' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 236.
   */
  actualizar236(valor: string | number): void {
    this.solicitudStore.actualizar236(valor);
  }

  /**
   * Actualiza el campo '237' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 237.
   */
  actualizar237(valor: string | number): void {
    this.solicitudStore.actualizar237(valor);
  }

  /**
   * Actualiza el campo '239' y, si el valor es 1, agrega un pedimento y muestra una advertencia.
   *
   * @param {string | number} valor - Valor para el campo 239.
   */
  actualizar239(valor: string | number): void {
    this.solicitudStore.actualizar239(valor);
    if (valor === 1) {
      const PEDIMENTO = {
        patente: 0,
        pedimento: 0,
        aduana: 0,
        idTipoPedimento: 0,
        descTipoPedimento: 'Por evaluar',
        numero: '',
        comprobanteValor: '',
        pedimentoValidado: false,
      };
      this.abrirModal(
        'Es un requisito obligatorio para acceder a Registro en el Esquema de Certificacion de Empresas, de conformidad con la regla 7.1.1. de las RGCE.'
      );
      this.pedimentos.push(PEDIMENTO);
    }
  }

  /**
   * Actualiza el campo '240' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 240.
   */
  actualizar240(valor: string | number): void {
    this.solicitudStore.actualizar240(valor);
  }

  /**
   * Actualiza el campo '243' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 243.
   */
  actualizar243(valor: string | number): void {
    this.solicitudStore.actualizar243(valor);
  }

  /**
   * Actualiza el campo '244' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 244.
   */
  actualizar244(valor: string | number): void {
    this.solicitudStore.actualizar244(valor);
  }

  /**
   * Actualiza el campo '245' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 245.
   */
  actualizar245(valor: string | number): void {
    this.solicitudStore.actualizar245(valor);
  }

  /**
   * Actualiza el valor seleccionado en el campo "indique todos" en el estado global.
   *
   * @param {Catalogo} valor - Elemento del catálogo correspondiente.
   */
  actualizarIndiqueTodos(valor: Catalogo): void {
    this.solicitudStore.actualizarIndiqueTodos(valor.id);
  }

  /**
   * Actualiza el campo '246' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 246.
   */
  actualizar246(valor: string | number): void {
    this.solicitudStore.actualizar246(valor);
  }

  /**
   * Actualiza el valor del archivo 1 desde un input file.
   *
   * @param {Event} valor - Evento de cambio del input.
   */
  actualizarFile1(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarFile1(VALOR);
  }

  /**
   * Actualiza el valor del archivo 2 desde un input file.
   *
   * @param {Event} valor - Evento de cambio del input.
   */
  actualizarFile2(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarFile2(VALOR);
  }

  /**
   * Actualiza el campo '247' en el estado global.
   */
  actualizar247(valor: string | number): void {
    this.solicitudStore.actualizar247(valor);
  }

  /**
   * Actualiza el campo '248' en el estado global.
   */
  actualizar248(valor: string | number): void {
    this.solicitudStore.actualizar248(valor);
  }

  /**
   * Actualiza el valor del campo de identificación.
   */
  actualizarIdentificacion(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarIdentificacion(VALOR);
  }

  /**
   * Actualiza el valor del lugar de radicación.
   */
  actualizarLugarDeRadicacion(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarLugarDeRadicacion(VALOR);
  }

  /**
   * Actualiza el campo '249' en el estado global.
   */
  actualizar249(valor: string | number): void {
    this.solicitudStore.actualizar249(valor);
  }

  /**
   * Actualiza el campo '250' en el estado global.
   */
  actualizar250(valor: string | number): void {
    this.solicitudStore.actualizar250(valor);
  }

  /**
   * Actualiza el campo '251' en el estado global.
   */
  actualizar251(valor: string | number): void {
    this.solicitudStore.actualizar251(valor);
  }

  /**
   * Actualiza el valor del checkbox 1.
   */
  actualizarCheckbox1(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).checked;
    this.solicitudStore.actualizarCheckbox1(VALOR);
  }

  /**
   * Actualiza el valor del checkbox 2.
   */
  actualizarCheckbox2(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).checked;
    this.solicitudStore.actualizarCheckbox2(VALOR);
  }

  /**
   * Actualiza el valor del checkbox 3.
   */
  actualizarCheckbox3(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).checked;
    this.solicitudStore.actualizarCheckbox3(VALOR);
  }

  /**
   * Actualiza el campo 'Actualmente2' en el estado global.
   */
  actualizarActualmente2(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarActualmente2(VALOR);
  }

  /**
   * Actualiza el campo 'Actualmente1' en el estado global.
   */
  actualizarActualmente1(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarActualmente1(VALOR);
  }

  /**
   * Guarda la selección de inventarios hecha por el usuario.
   */
  seleccionarInventariosDatos(evento: Inventarios[]): void {
    this.seleccionarInventarios = evento;
  }

  /**
   * Elimina los inventarios seleccionados de la lista.
   */
  eliminarInventariosDatos(): void {
    if (this.seleccionarInventarios.length > 0) {
      this.seleccionarInventarios.forEach((elemento) => {
        const INDICE = this.inventariosDatos.findIndex(
          (inv) => inv.nombre === elemento.nombre
        );
        if (INDICE !== -1) {
          this.inventariosDatos.splice(INDICE, 1);
        }
      });
    }
  }

  /**
   * Guarda la selección de socios hecha por el usuario.
   */
  seleccionarlistaSeccionSociosIC(evento: SeccionSociosIC[]): void {
    this.seleccionarListaSeccionSociosIC = evento;
  }

  /**
   * Elimina los socios seleccionados de la lista.
   */
  eliminarlistaSeccionSociosIC(): void {
    if (this.seleccionarListaSeccionSociosIC.length > 0) {
      this.seleccionarListaSeccionSociosIC.forEach((elemento) => {
        const INDICE = this.listaSeccionSociosIC.findIndex(
          (inv) => inv.nombre === elemento.nombre
        );
        if (INDICE !== -1) {
          this.listaSeccionSociosIC.splice(INDICE, 1);
        }
      });
    }
  }

  /**
   * Guarda la selección de domicilios hecha por el usuario.
   */
  seleccionarDomiciliosDato(evento: Domicilios[]): void {
    this.seleccionarDomiciliosDatos = evento;
  }

  /**
   * Elimina los domicilios seleccionados de la lista.
   */
  eliminarDomiciliosDatos(): void {
    if (this.seleccionarDomiciliosDatos.length > 0) {
      this.seleccionarDomiciliosDatos.forEach((elemento) => {
        const INDICE = this.domiciliosDatos.findIndex(
          (inv) => inv.tipoInstalacion === elemento.tipoInstalacion
        );
        if (INDICE !== -1) {
          this.domiciliosDatos.splice(INDICE, 1);
        }
      });
    }
  }

  /**
   * Guarda la selección de número de empleados hecha por el usuario.
   */
  seleccionarNumeroDeEmpleadosDato(evento: NumeroDeEmpleados[]): void {
    this.seleccionarNumeroDeEmpleadosLista = evento;
  }

  /**
   * Elimina los registros de número de empleados seleccionados.
   */
  eliminarNumeroDeEmpleadosDato(): void {
    if (this.seleccionarNumeroDeEmpleadosLista.length > 0) {
      this.seleccionarNumeroDeEmpleadosLista.forEach((elemento) => {
        const INDICE = this.numeroDeEmpleadosLista.findIndex(
          (inv) => inv.numeroDeEmpleados === elemento.numeroDeEmpleados
        );
        if (INDICE !== -1) {
          this.numeroDeEmpleadosLista.splice(INDICE, 1);
        }
      });
    }
  }

  /**
   * Limpia y completa la señal de destrucción para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
