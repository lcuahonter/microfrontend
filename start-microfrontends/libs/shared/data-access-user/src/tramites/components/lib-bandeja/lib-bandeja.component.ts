import { BandejaDeTareasPendientes, SeleccionadoDepartamento, SeleccionadoTramite } from '../../../core/models/shared/bandeja-de-tareas-pendientes.model';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActivarTareaRequest } from '../../../core/models/shared/bandeja-tarea-activar.model';
import { BandejaDeSolicitudeService } from '../../../core/services/consultagenerica/bandeja-tareas-pendientes.service';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '../../../core/models/shared/configuracion-columna.model';
import { ConsultaioStore } from '../../../core/estados/consulta.store';
import { FormasDinamicasComponent } from '../formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { TablaAcciones } from '../../../core/enums/tabla-seleccion.enum';
import { TablaDinamicaComponent } from '../tabla-dinamica/tabla-dinamica.component';
import { TipoSolicitud } from '../../../core/enums/tipoSolicitud.enum';
import { TramiteDetails } from '../../../core/models/tramiteDetails';
import { map } from 'rxjs';
import tramiteDetailsData from '@libs/shared/theme/assets/json/tramiteList.json';

import { ModeloDeFormaDinamica } from '../../../core/models/shared/forms-model';

import { BandejaDeSolicitudes, SolicitudesPendientesRequest } from '../../../core/models/shared/lib-bandeja.model';
import { TABLADECONFIGUACIONFUNCIONARIO, TABLADECONFIGUACIONSOLICITANTE } from '../../../core/enums/bandeja-de-solicitudes-funcionario-solicitante.enum';
import { MensajesExito } from '../../../core/enums/mensajes-bandeja-tareas-pendientes.enum';
import moment from 'moment';

import { formatearFechaYyyyMmDd } from '../../../core/utils/utilerias';


const INPUT_FORMAT = 'DD/MM/YYYY';
const FORMAT_DATE = 'YYYY-MM-DD';

/**
 * Interfaz base para los elementos de la bandeja.
 * Define las propiedades mínimas requeridas para que un objeto sea considerado como registro de la bandeja.
 */
interface BandejaRegistroBase {
  /** Número de procedimiento asociado al trámite */
  numeroDeProcedimiento: string;
  /** Nombre del departamento relacionado al trámite */
  departamento: string;
  /** ID del trámite */
  id_solicitud?: string;
  /** Fecha inicial */
  fecha?: string;
  /** Fecha de actualización */
  fechaActualizacion?: string;
}
/*
 * Componente LibBandejaComponent
 * Este componente es reutilizable para mostrar una bandeja dinámica con tabla, paginación y formularios.
 * Permite navegar a diferentes rutas dependiendo del origen del trámite y mostrar configuraciones dinámicas.
 */


@Component({
  selector: 'lib-bandeja',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    RouterModule,
    TablaDinamicaComponent,
  ],
  templateUrl: './lib-bandeja.component.html',
  styleUrl: './lib-bandeja.component.scss',
  encapsulation: ViewEncapsulation.None,
})
/*
 * Clase genérica LibBandejaComponent<T>
 * Este componente representa una bandeja reutilizable con tabla dinámica, formularios y navegación basada en datos.
 * Se puede utilizar con cualquier tipo de datos que se especifique mediante el tipo genérico <T>.
 * Implementa la interfaz OnInit para inicializar la lógica al montar el componente.
 */


export class LibBandejaComponent<T extends BandejaRegistroBase> implements OnInit, OnChanges {
  /**
   *  Título mostrado en el encabezado de la bandeja 
   */
  @Input() public titulo!: string;
  /** Indica si la bandeja debe mostrar el formulario dinámico 
   * 
   */
  @Input() public tieneBandeja: boolean = false;
  /** 
   * Título de la tabla dentro de la bandeja 
   */
  @Input() public tablaTitulo!: string;
  /**
   * Configuración de columnas para la tabla 
   */
  @Input() configuracionTabla: ConfiguracionColumna<T>[] = [];
  /**
   * Datos que se muestran en la tabla 
   */
  @Input() configuracionTablaDatos: T[] = [];
  /**
    * Datos que se usan en el formulario de la bandeja 
    */
  @Input() public bandejaSolicitudeDatos: ModeloDeFormaDinamica[] = [];
  /**
   * Propiedad de entrada que contiene un arreglo de objetos de datos a duplicar.
   */
  @Input() public duplicarDatos: T[] = [];
  /**
   * EventEmitter que emite un evento cada vez que un valor cambia en el componente.
   */
  @Output() obtenerNombreDelDepartamento: EventEmitter<{ campo: string; valor: string}> = new EventEmitter<{ campo: string; valor: string}>();
  /**
   * Propiedad de entrada que contiene la información del departamento actualmente seleccionado.
   */
  @Input() public seleccionadoDepartamento: SeleccionadoDepartamento = {
    tieneDepartamento: false,
    numeroDeProcedimiento: '',
    nombreDelDepartamento: '',
  };
  /** 
  * Indica si la bandeja es de solicitudes
  */
  @Input() public isBandejaSolicitudes: boolean = false;
  /**
   * Nombre del RFC asociado al trámite
   */
  @Input() public rfcNombre: string = '';
  /**
   * EventEmitter que emite un evento para obtener los datos de la bandeja de solicitudes.
   */ 
  @Output() getDatosBandejaSolicitudes = new EventEmitter<SolicitudesPendientesRequest>();
  /**
   * URL a la que se navega al seleccionar un trámite 
   */
  public procedureUrl!: string;
  /**
   * Indica si el formulario es válido 
   */
  public hasValidForm: boolean = false;
  /**
   * Formulario reactivo principal que contiene otro formGroup 
   */
  public dinamicasBandejaForma: FormGroup = new FormGroup({
    bandejaSolicitudeFormGroup: new FormGroup({}),
  });
  /** 
   * Acciones disponibles en la tabla (editar, etc.) 
   */
  public tablaAcciones: TablaAcciones[] = [TablaAcciones.EDITAR];
  /**
   * Copia original de la configuración de la tabla 
   */
  public originalConfiguracionTabla: T[] = [];
  /**
   * Lista de detalles de trámite desde JSON 
   */
  public tramiteData: TramiteDetails[] = [];
  /**
   * Controla si la sección de país de origen está colapsada o no 
   */
  public paisDeOriginColapsable = false;
  /**
   * Total de elementos en la tabla 
   */
  public totalItems: number = 0;
  /**
   * Página actual en la paginación 
   */
  public currentPage: number = 1;
  /**
   * Cantidad de elementos por página 
   */
  public itemsPerPage: number = 5;
  /**
   * Datos del cuerpo para miembros de la empresa paginados 
   */
  public miembroDeLaEmpresaBodyData: unknown[] = [];
  /**
   * Indica si la configuración de datos de la tabla está disponible.
   */
  public tieneConfiguracionTablaDatos: boolean = true;

  /** 
   * Indica si se debe mostrar el mensaje de éxito
   */
  labelExitoMensaje: string | null = null;


  /**
   * Evento que emite un valor booleano para indicar si el usuario es funcionario.
   * Se utiliza para notificar a componentes padres sobre el estado de funcionario.
   */
  @Output() banderafuncionario = new EventEmitter<boolean>();

  /*
   * Constructor que inyecta Router y ConsultaioStore
   */
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private consultaioStore: ConsultaioStore,
    private bandejaDeSolicitudeService: BandejaDeSolicitudeService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configuracionTablaDatos']) {
      this.configuracionTablaDatos = changes['configuracionTablaDatos'].currentValue;
      this.duplicarDatos = changes['configuracionTablaDatos'].currentValue;
    }
  }

  /*
   * Método del ciclo de vida OnInit
   * Valida si la bandeja contiene formulario y aplica filtro a columnas
   */
  ngOnInit(): void {
    this.mostrarColapsable(1);
    this.filterConfiguracionTabla();

    const TIPOMENSAJE = localStorage.getItem('mensajeExito');

    if (TIPOMENSAJE) {
      if (TIPOMENSAJE === 'OBSERVACION') {
        this.labelExitoMensaje = MensajesExito.OBSERVACION;
      }

      if (TIPOMENSAJE === 'DICTAMEN') {
        this.labelExitoMensaje = MensajesExito.DICTAMEN;
      }

      if (TIPOMENSAJE === 'REQUERIMIENTO') {
        this.labelExitoMensaje = MensajesExito.REQUERIMIENTO;
      }

      // Mostrar solo 5 segundos
      setTimeout(() => {
        this.labelExitoMensaje = null;
        localStorage.removeItem('mensajeExito');
      }, 8000);
    }

  }

  /*
   * Getter que retorna el formGroup interno
   */
  get bandejaSolicitudeFormGroup(): FormGroup {
    return this.dinamicasBandejaForma.get(
      'bandejaSolicitudeFormGroup'
    ) as FormGroup;
  }
  /*
   * Filtra la configuración de columnas para ocultar ciertas columnas no necesarias
   */
  public filterConfiguracionTabla(): void {
    this.configuracionTabla = this.configuracionTabla.filter(
      (item) =>
        item.encabezado !== 'Departamento' &&
        item.encabezado !== 'Número de procedimiento' &&
        item.encabezado !== 'Origin'
    );
  }

  /*
   * Maneja el cambio de selección de un departamento
   * Emite el evento con el campo y valor del departamento seleccionado
   */
  borrar(): void {
    this.dinamicasBandejaForma.reset();
    this.configuracionTablaDatos = [];
    this.hasValidForm = false;
    this.tieneConfiguracionTablaDatos = false;
    this.seleccionadoDepartamento = {
      tieneDepartamento: false,
      numeroDeProcedimiento: '',
      nombreDelDepartamento: '',
    };
  }
  /*
   * Envía los datos del formulario. Marca el formulario como válido si no hay errores
   */
  public filterDatos(): void {
    const BANDEJA_SOLICITUDE_FORM_GROUP: FormGroup | null = this.dinamicasBandejaForma.get('bandejaSolicitudeFormGroup') as FormGroup | null;
    const SOLICITUD_ID_CONTROL = BANDEJA_SOLICITUDE_FORM_GROUP?.get('solicitudId');
    const FECHA_INICIAL = BANDEJA_SOLICITUDE_FORM_GROUP?.get('fechaInicial');
    const FECHA_FINAL = BANDEJA_SOLICITUDE_FORM_GROUP?.get('fechaFinal');
    const BODYRQ: SolicitudesPendientesRequest = {
      rfc: this.rfcNombre,
      rol_actual: 'PersonaMoral',
      rfc_Solicitante: this.rfcNombre,
      id_solicitud: SOLICITUD_ID_CONTROL?.value ?? '',
      fecha_inicio: FECHA_INICIAL?.value ?? '',
      fecha_fin: FECHA_FINAL?.value ?? '',
      certificado: {
        cert_serial_number: '',
        tipo_certificado: ''
      }
    };
    // Si no hay datos en los 3 campos, resetea la tabla con los datos originales
    if (!SOLICITUD_ID_CONTROL?.value && !FECHA_INICIAL?.value && !FECHA_FINAL?.value) {
      this.getDatosBandejaSolicitudes.emit(BODYRQ);
      return;
    }
    if (SOLICITUD_ID_CONTROL?.value) {
      this.getDatosBandejaSolicitudes.emit(BODYRQ);
      this.hasValidForm = true;
      this.tieneConfiguracionTablaDatos = true;
      return;
    }
    if (!FECHA_INICIAL?.value) {
      FECHA_INICIAL?.addValidators(Validators.required);
      FECHA_INICIAL?.setErrors({ required: true, initialDateRequired: true });
      FECHA_INICIAL?.markAsTouched();
      FECHA_INICIAL?.updateValueAndValidity();
      return;
    }
    if (!FECHA_FINAL?.value) {
      FECHA_FINAL?.addValidators(Validators.required);
      FECHA_FINAL?.setErrors({ required: true, initialDateRequired: true });
      FECHA_FINAL?.markAsTouched();
      FECHA_FINAL?.updateValueAndValidity();
      return;
    }
    const BODY_FECHA: SolicitudesPendientesRequest = {
      ...BODYRQ,
      fecha_inicio: moment(FECHA_INICIAL?.value, INPUT_FORMAT).format(FORMAT_DATE),
      fecha_fin: moment(FECHA_FINAL.value, INPUT_FORMAT).format(FORMAT_DATE),
    };
    this.getDatosBandejaSolicitudes.emit(BODY_FECHA);
    this.hasValidForm = true;
    this.tieneConfiguracionTablaDatos = this.configuracionTablaDatos.length > 0;
  }

  /*
  * Maneja el clic sobre una fila de solicitud en la tabla.
  */
  public onFilaSolicitudClick(event: T): void {
    const ROW_OBJETO = event as unknown as BandejaDeSolicitudes;
    this.tramiteData = tramiteDetailsData.filter(
      (v) => v.tramite === Number(ROW_OBJETO.numeroDeProcedimiento) && v.department === ROW_OBJETO.departamento.toLowerCase()
    );
    this.consultaioStore.establecerConsultaio(
      String(ROW_OBJETO.numeroDeProcedimiento),
      '',
      this.tramiteData[0].department,
      '',
      ROW_OBJETO.tipoDeTramite,
      '',
      false,
      false,
      true,
      '',
      '',
      ROW_OBJETO.id_solicitud,
      ''
    );
    this.router.navigate([`/${this.tramiteData[0].linkDashboard}`]);
    // Falta hacer la petición para obtener los datos de la solicitud
  }

  /*
   * Maneja el clic sobre una fila de la tabla.
   * Navega a la ruta correspondiente dependiendo del origen del trámite
   */
  // eslint-disable-next-line complexity
  public onFilaClickTareas(event: T): void {
    const ROW_OBJETO = event as unknown as SeleccionadoTramite;
    const PROCEDURE: number = Number(
      ROW_OBJETO.numeroDeProcedimiento
    );
    const ORIGIN: string = ROW_OBJETO.origin; // Inicializar ORIGEN con un valor predeterminado
    this.tramiteData = tramiteDetailsData.filter(
      (v) => v.tramite === PROCEDURE
    );
    this.procedureUrl = this.tramiteData[0].linkDashboard;
    this.consultaioStore.establecerConsultaio(
      String(PROCEDURE),
      ORIGIN,
      this.tramiteData[0].department,
      ROW_OBJETO.folioTramite,
      ROW_OBJETO.tipoDeTramite,
      ROW_OBJETO.estadoDeTramite,
      !this.tieneBandeja ? false : true,
      false,
      true,
      ROW_OBJETO.action_id,
      ROW_OBJETO.current_user,
      ROW_OBJETO.id_solicitud,
      ROW_OBJETO.nombre_pagina,
    ); 
    if (!this.tieneBandeja) {
      this.router.navigate([this.procedureUrl]);
    }
    if (ORIGIN === 'FLUJO_FUNCIONARIO_ATENDER_REQUERIMIENTO' || ORIGIN === 'AtenderRequerimiento') {
      this.router.navigate([
        `/${this.tramiteData[0].department}/proceso-requerimiento`,
      ]);
    } else if(ORIGIN === 'CONFIRMAR_NOTIFICACION_RESOLUCION' && this.tramiteData[0].tramite === 130118 || ORIGIN === 'ConfirmarNotificacionRes') {
      this.router.navigate([`/${this.tramiteData[0].department}/confirmar-notificacion`]);
    } else if(ORIGIN === 'CONFIRMAR_NOTIFICACION_REQUERIMIENTO' && this.tramiteData[0].tramite === 130118 || ORIGIN === 'ConfirmarNotificacionReq') {
      this.router.navigate([`/${this.tramiteData[0].department}/confirmar-notificacion`]);
    }
    else if (ORIGIN === 'FLUJO_FUNCIONARIO_CONFIRMAR-NOTIFICACION') {
      this.router.navigate(['/confirmar-notificacion']);
    } else if (ORIGIN === 'FLUJO_FUNCIONARIO_CONFIRMAR-RESOLUCION') {
      this.router.navigate(['/confirmar-resolucion']);
    } else if((ORIGIN === 'REGISTRAR_OPINION' || ORIGIN === 'RegistrarOpinion' ) && (this.tramiteData[0].tramite === 80101 || this.tramiteData[0].tramite === 80102 || this.tramiteData[0].tramite === 80103 || this.tramiteData[0].tramite === 80104 || this.tramiteData[0].tramite === 130113)) {
      this.router.navigate([`/${this.tramiteData[0].department}/registrar-opinion`]);
    }
    else if ((ORIGIN === 'FLUJO_FUNCIONARIO_EVALUAR' || (ORIGIN === 'EvaluarSolicitud' || ORIGIN === 'RegistrarOpinion'))) {
      this.router.navigate([`/${this.tramiteData[0].department}/evaluar`]);
    } else if ((ORIGIN === 'FLUJO_FUNCIONARIO_AUTORIZACION')) {
      this.router.navigate([`/${this.tramiteData[0].department}/autorizar`]);
    }else if(ORIGIN === 'FLUJO_FUNCIONARIO_VERIFICAR-REQUERIMIENTO-RESOLUCION' || ORIGIN === 'VERIFICAR_DICTAMEN' || ORIGIN === 'VerificarDictamen') {
      this.router.navigate([`/${this.tramiteData[0].department}/verificar-dictamen`]);
    }
    // eslint-disable-next-line no-dupe-else-if
    else if(ORIGIN === 'FLUJO_FUNCIONARIO_VERIFICAR-REQUERIMIENTO-RESOLUCION' || ORIGIN === 'VERIFICAR_DICTAMEN' || ORIGIN === 'VerificarDictamen') {
      this.router.navigate([`/${this.tramiteData[0].department}/verificar-dictamen`]);
    }
    else if (ORIGIN === 'SUBSECUENTES') {
      this.router.navigate(['/subsecuentes']);
    // eslint-disable-next-line no-dupe-else-if
    } else if(ORIGIN === 'VERIFICAR_DICTAMEN') {
      this.router.navigate([`/${this.tramiteData[0].department}/verificar-dictamen`]);
    } else if ((ORIGIN === 'AUTORIZAR_DICTAMEN' || ORIGIN === 'AutorizarDictamen')) {
      this.router.navigate([`/${this.tramiteData[0].department}/autorizar-dictamen`]);
    }
    else if ((ORIGIN === 'AUTORIZAR_REQUERIMIENTO' || ORIGIN === 'AutorizarRequerimiento')) {
              this.router.navigate([`/${this.tramiteData[0].department}/autorizar-requerimiento`]);
      
    }else if ((ORIGIN === 'VERIFICAR_REQUERIMIENTO' || ORIGIN === 'VerificarRequerimiento')) {
              this.router.navigate([`/${this.tramiteData[0].department}/verificar-requerimiento`]);

    }
    else if(ORIGIN === 'CONFIRMAR_NOTIFICACION_REQUERIMIENTO' || ORIGIN === 'ConfirmarNotificacionReq') {
      this.router.navigate([`/${this.tramiteData[0].department}/confirmar-notificacion`]);
    }
    else if(ORIGIN === 'CONFIRMAR_NOTIFICACION_ESTRADOS' || ORIGIN === 'ConfirmarNotificacionEstrados') {
      this.router.navigate([`/${this.tramiteData[0].department}/confirmar-notificacion`]);
    }
  }
  /*
  * Maneja el clic sobre una fila en la tabla y delega la acción al método correspondiente.
  */
  public onFilaClick(event: T): void {
    if (this.isBandejaSolicitudes) {
      this.onFilaSolicitudClick(event);
      return;
    }
    this.activarTarea(event);
  }
  /*
   * Alterna la visibilidad del contenido colapsable basado en el orden
   */
  public mostrarColapsable(orden: number): void {
    if (orden === 1) {
      this.paisDeOriginColapsable = !this.paisDeOriginColapsable;
    }
    Promise.resolve().then(() => {
      if (this.paisDeOriginColapsable) {
        const FORMA_GROUP = this.dinamicasBandejaForma.get('bandejaSolicitudeFormGroup');
        if (FORMA_GROUP) {
          FORMA_GROUP.get('rfc')?.setValue(this.rfcNombre);
        }
      }
    });
  }
  /*
   * Cambia la página actual en la tabla
   */
  public onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }
  /*
   * Actualiza los datos visibles de la tabla según la paginación
   */
  public updatePagination(): void {
    const START_INDEX = (this.currentPage - 1) * this.itemsPerPage;
    this.miembroDeLaEmpresaBodyData = this.miembroDeLaEmpresaBodyData.slice(
      START_INDEX,
      START_INDEX + this.itemsPerPage
    );
  }
  /**
   * Cambia el número de elementos por página y reinicia la página actual
   */
  public onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Maneja la selección de un departamento emitiendo la información del departamento seleccionado
   * y reseteando el control de formulario 'procedimiento' si ya hay un departamento seleccionado.
   *
   * @param event - Un objeto que contiene el campo seleccionado (`campo`) y su valor (`valor`).
   */
  public obtenerDepartamento(event: { campo: string; valor: string }): void {
    this.obtenerNombreDelDepartamento.emit({ campo: event.campo, valor: event.valor });
    if (this.seleccionadoDepartamento.tieneDepartamento) {
      this.bandejaSolicitudeFormGroup.get('procedimiento')?.setValue('');
    }
    if (event.campo === 'folio') {
      this.aplicarReglaFolioVsFechas(event.valor);
    }
  }

  /**
   * Valida y aplica la regla entre el campo 'folio' y los campos de fecha en el formulario.
   * Si el campo 'folio' tiene un valor, deshabilita los campos de fecha y los limpia.
   * Si el campo 'folio' está vacío, habilita los campos de fecha.
   * @param folio 
   */
  private aplicarReglaFolioVsFechas(folio: string): void {
    
    const DESHABILITAR_FECHAS = Boolean(folio) && folio.trim() !== '';

    if (DESHABILITAR_FECHAS) {
      this.bandejaSolicitudeFormGroup.get('fechaInicial')?.setValue(null);
      this.bandejaSolicitudeFormGroup.get('fechaFinal')?.setValue(null);
    }

    this.bandejaSolicitudeDatos = this.bandejaSolicitudeDatos.map(campo => {
      if (campo.campo === 'fechaInicial' || campo.campo === 'fechaFinal') {
        return {
          ...campo,
          habilitado: !DESHABILITAR_FECHAS
        };
      }
      return campo;
    });
  }

  public obtenerProcedure(event: { campo: string; valor: string }): void {
    this.obtenerNombreDelDepartamento.emit({ campo: event.campo, valor: event.valor });
  }

  /**
   * Emite un evento para obtener el nombre del departamento basado en el tipo de solicitud seleccionado.
   *
   * @param event Objeto que contiene el campo y el valor seleccionados.
   *   - campo: El nombre del campo relacionado con la solicitud.
   *   - valor: El valor seleccionado para el campo.
   */
  public obtenerTipoSolicitud(event: { campo: string; valor: string }): void {
    this.obtenerNombreDelDepartamento.emit({ campo: event.campo, valor: event.valor });
  }

  /**
   * Filtra y procesa los datos de la bandeja según el tipo de solicitud seleccionado.
   *
   * Dependiendo del valor de 'tipoSolicitud' en el formulario, ejecuta una lógica diferente:
   * - Si es '1' (solicitante), obtiene el RFC y los roles del formulario y los asigna al cuerpo de la petición.
   * - Si es '2' (funcionario), utiliza valores predeterminados para RFC y roles, realiza una petición al servicio y actualiza la configuración de la tabla.
   * - Si es '3', filtra los datos duplicados según el departamento y número de procedimiento seleccionados.
   *
   * Actualiza los estados internos como la validez del formulario y la existencia de datos en la tabla de configuración.
   */
  public enviarDatos(): void {
    const BANDEJA_SOLICITUDE_FORM_GROUP: FormGroup | null = this.dinamicasBandejaForma.get('bandejaSolicitudeFormGroup') as FormGroup | null;
    const TIPO_SOLICITUD = BANDEJA_SOLICITUDE_FORM_GROUP?.controls['tipoSolicitud']?.value;
    const RFC = BANDEJA_SOLICITUDE_FORM_GROUP?.controls['rfc']?.value;
    const FECHA_INICIAL = formatearFechaYyyyMmDd(BANDEJA_SOLICITUDE_FORM_GROUP?.controls['fechaInicial']?.value);
    const FECHA_FINAL = formatearFechaYyyyMmDd(BANDEJA_SOLICITUDE_FORM_GROUP?.controls['fechaFinal']?.value);
    const FOLIO = BANDEJA_SOLICITUDE_FORM_GROUP?.controls['folio']?.value;

    const BODY = {
      rfc_usuario: "",
      roles: [""],
      certificado: {
        cert_serial_number: "",
        tipo_certificado: ""
      },
      fecha_inicio: "",
      fecha_fin: "",
      numero_folio: ""
    };
    this.revisarTipoDeSolicitud();
    if (TIPO_SOLICITUD === TipoSolicitud.SOLICITANTE) {
      this.banderafuncionario.emit(false);
      BODY.rfc_usuario = RFC;
      BODY.roles = ["PersonaFisica"];
      BODY.certificado = {
        cert_serial_number: "20001000000100001815",
        tipo_certificado: "TIPCE.02"
      };
      BODY.fecha_inicio = FECHA_INICIAL;
      BODY.fecha_fin = FECHA_FINAL;
      BODY.numero_folio = FOLIO;
      
      this.bandejaDeSolicitudeService.postBandejaTareas(BODY).pipe(
        map((datos: BandejaDeTareasPendientes[]) => {
          this.configuracionTablaDatos = datos as unknown as T[];
        })
      ).subscribe();
      this.hasValidForm = true
      if (this.configuracionTablaDatos.length > 0) {
        this.tieneConfiguracionTablaDatos = true;
      } else {
        this.configuracionTablaDatos = this.duplicarDatos;
        this.tieneConfiguracionTablaDatos = false;
      }
    }

    if (TIPO_SOLICITUD === TipoSolicitud.FUNCIONARIO) {
      this.banderafuncionario.emit(true);
      BODY.rfc_usuario = RFC;
      BODY.roles = ["Dictaminador", "Autorizador", "Verificador"];
      BODY.fecha_inicio = FECHA_INICIAL;
      BODY.fecha_fin = FECHA_FINAL;
      BODY.numero_folio = FOLIO;

        this.bandejaDeSolicitudeService.postBandejaTareas(BODY).pipe(
        map((datos: BandejaDeTareasPendientes[]) => {
          this.configuracionTablaDatos = datos as unknown as T[];
        })
      ).subscribe();
      this.hasValidForm = true
      if (this.configuracionTablaDatos.length > 0) {
        this.tieneConfiguracionTablaDatos = true;
      } else {
        this.configuracionTablaDatos = this.duplicarDatos;
        this.tieneConfiguracionTablaDatos = false;
      }
    }
    
    if (TIPO_SOLICITUD === TipoSolicitud.ADMIN) {
      this.configuracionTablaDatos = this.duplicarDatos;
      this.configuracionTablaDatos = this.configuracionTablaDatos.filter((item) => {
        return (
          Number(item.numeroDeProcedimiento) === Number(this.seleccionadoDepartamento.numeroDeProcedimiento) &&
          item.departamento.toLowerCase() === this.seleccionadoDepartamento.nombreDelDepartamento.toLowerCase()
        );
      });
      this.hasValidForm = this.bandejaSolicitudeFormGroup.valid;
      if (this.configuracionTablaDatos.length > 0) {
        this.tieneConfiguracionTablaDatos = true;
      } else {
        this.configuracionTablaDatos = this.duplicarDatos;
        this.tieneConfiguracionTablaDatos = false;
      }
    }
  }

  /**
   * Restablece el formulario `bandejaSolicitudeFormGroup` a su estado inicial,
   * actualiza su validez y reinicia las banderas de estado relacionadas del componente.
   *
   * - Establece `hasValidForm` en `false`.
   * - Establece `tieneConfiguracionTablaDatos` en `false`.
   */
  public enLimpiar(): void {
    this.bandejaSolicitudeFormGroup.reset();
    this.bandejaSolicitudeFormGroup.updateValueAndValidity();
    this.hasValidForm = false;
    this.tieneConfiguracionTablaDatos = false;
  }


  revisarTipoDeSolicitud(): void {
    const TIPO_SOLICITUD = this.bandejaSolicitudeFormGroup?.controls['tipoSolicitud']?.value;

    if (TIPO_SOLICITUD === TipoSolicitud.SOLICITANTE || TIPO_SOLICITUD === TipoSolicitud.ADMIN) {
      // Lógica para el tipo de solicitud "Solicitante y Admin"

      this.configuracionTabla = TABLADECONFIGUACIONSOLICITANTE as unknown as ConfiguracionColumna<T>[];

    } else if (TIPO_SOLICITUD === TipoSolicitud.FUNCIONARIO) {
      // Lógica para el tipo de solicitud "Funcionario"
      this.configuracionTabla = TABLADECONFIGUACIONFUNCIONARIO as unknown as ConfiguracionColumna<T>[];
    } 
  }

  /**
   * Filtra los datos de la tabla por el valor del folioTramite.
   * Si el término de búsqueda está vacío, restaura los datos originales.
   * @param $event El término de búsqueda ingresado.
   */
  onSearchChanged($event: string): void {
    if (!$event || !$event.trim()) {
      this.configuracionTablaDatos = [...this.duplicarDatos];
      return;
    }
    const SEARCH_TERM = $event.trim().toLowerCase();
    this.configuracionTablaDatos = this.duplicarDatos.filter((item: T) => {
      // Busca solo por la propiedad 'folioTramite'
      if (typeof item === 'object' && item !== null && 'folioTramite' in item) {
        const FOLIO = (item as { folioTramite?: string }).folioTramite;
        return FOLIO && FOLIO.toString().toLowerCase().includes(SEARCH_TERM);
      }
      return false;
    });
  }

  /**
   * Activa una tarea basada en el evento proporcionado.
   * Realiza una llamada al servicio para activar la tarea y maneja la respuesta.
   * @param event El evento que contiene los datos necesarios para activar la tarea.
   */
  activarTarea(event: T): void {
    const ROW_OBJETO = event as unknown as SeleccionadoTramite;
    const PAYLOAD: ActivarTareaRequest = {
      action_id: ROW_OBJETO.action_id,
      folio_tramite: ROW_OBJETO.folioTramite,
      id_tarea: ROW_OBJETO.id_tarea ?? '',
      user_name: ROW_OBJETO.current_user,
      rfc_solicitante: ROW_OBJETO.current_user,
      rol_actual: ROW_OBJETO.rol_actual ?? '',
    }
    this.bandejaDeSolicitudeService.postActivarTarea(PAYLOAD).subscribe({
      next: (response) => {
        if(response.codigo === '00'){
          this.onFilaClickTareas(event);
        }
      },
      error: (_) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
  }
}
