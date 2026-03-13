import { ALERTA_COM, OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/32615/datos-comunes.enum';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AlertComponent, Catalogo, CatalogoSelectComponent, ConfiguracionColumna, InputRadioComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InstalacionesPrincipalesTablaInfo, InventariosInfo, MercanciasInfo } from '@libs/shared/data-access-user/src/core/models/32615/dato-comunes.model';
import { INSTALACIONES_PRINCIPALES_TABLA, INVENTARIOS_TABLA, MERCANCIA_TABLA} from '@libs/shared/data-access-user/src/tramites/constantes/32615/datos-comunes.enum';
import { Solicitud32615State, Tramite32615Store } from '../../../../estados/tramites/tramite32615.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import {RecintoFiscalizadoService} from '../../services/recinto-fiscalizado.service';
import { Tramite32615Query } from '../../../../estados/queries/tramite32615.query';
import productivo from '@libs/shared/theme/assets/json/32615/productivo.json';
import serviciosAgace from '@libs/shared/theme/assets/json/32615/serviciosAgace.json';

/**
 * Componente para manejar los datos comunes del trámite 32615
 *
 * Este componente se encarga de gestionar los formularios y tablas relacionadas
 * con la información común requerida para el trámite 32615.
 */
@Component({
  selector: 'app-datos-comunes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    AlertComponent,
    InputRadioComponent,
    TablaDinamicaComponent,
    TituloComponent
  ],
  templateUrl: './datos-comunes.component.html',
  styleUrl: './datos-comunes.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DatosComunesComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Formulario principal para los datos comunes del trámite
   */
  public datosComunesForma!: FormGroup;

  /**
   * Formulario para la tabla modal de mercancías
   */
  public tablaModalForma!: FormGroup;

  /**
   * Formulario para la tabla modal de instalaciones principales
   */
  public tablaDosModalForma!: FormGroup;

  /**
   * Formulario para información de miembros de la empresa
   */
  public miembroDeLaEmpresa!: FormGroup;

  /**
   * Lista de sectores productivos obtenidos desde archivo JSON
   */
  public sectorProductivoAgace: Catalogo[] = productivo;

  /**
   * Lista de servicios Agace obtenidos desde archivo JSON
   */
  public serviciosAgace: Catalogo[] = serviciosAgace;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual de la solicitud del trámite
   */
  public solicitudState!: Solicitud32615State;

  /**
   * Constante de alertas utilizadas en el componente
   */
  public alerta = ALERTA_COM;

  /**
   * Opciones para los botones de radio
   */
  public opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Subject para manejar la destrucción de observables
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al modal de confirmación
   */
  @ViewChild('confirmModal', { static: false }) confirmModal!: ElementRef;

  /**
   * Referencia al modal de tabla de mercancías
   */
  @ViewChild('tablaModal', { static: false }) tablaModal!: ElementRef;

  /**
   * Referencia al modal de tabla de instalaciones principales
   */
  @ViewChild('instalacionesPrincipalesTablaModal', { static: false }) instalacionesPrincipalesTablaModal!: ElementRef;

  /**
   * Referencia al modal de miembros de la empresa
   */
  @ViewChild('miembroDeLaEmpresaModal', { static: false }) miembroDeLaEmpresaModal!: ElementRef;

  /**
   * Instancia del modal de confirmación
   */
  public confirmInstance!: Modal;

  /**
   * Instancia del modal de tabla de mercancías
   */
  public tablaInstance!: Modal;

  /**
   * Instancia del modal de instalaciones principales
   */
  public instalacionesPrincipalesTablaInstance!: Modal;

  /**
   * Instancia del modal de miembros de la empresa
   */
  public miembroDeLaEmpresaInstance!: Modal;

  /**
   * Bandera para mostrar campo de número de empleados
   */
  public showSenaleCuentaEmpleados:boolean = false;

  /**
   * Bandera para mostrar campo "si al momento"
   */
  public showSenaleSiAlMomento:boolean = false;

  /**
   * Bandera para indicar cambios en el formulario
   */
  public changed:boolean = false;

  /**
   * Configuración de columnas para la tabla de mercancías
   */
  public mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = MERCANCIA_TABLA;

  /**
   * Datos para la tabla de mercancías
   */
  public mercanciasTablaDatos: MercanciasInfo[] = [];

   /** Lista de empleados seleccionados en la tabla */
  public seleccionarMercanciasTablaDatos: MercanciasInfo[] =
    [] as MercanciasInfo[];

  /**
   * Configuración de columnas para la tabla de instalaciones principales
   */
  public instalacionesPrincipalesTabla: ConfiguracionColumna<InstalacionesPrincipalesTablaInfo>[] = INSTALACIONES_PRINCIPALES_TABLA;

  /** Lista de empleados seleccionados en la tabla */
  public seleccionarInstalacionesPrincipalesTablaDatos: InstalacionesPrincipalesTablaInfo[] =
    [] as InstalacionesPrincipalesTablaInfo[];

  /**
   * Configuración de columnas para la tabla de inventarios
   */
  public inventariosTabla: ConfiguracionColumna<InventariosInfo>[] = INVENTARIOS_TABLA;

  /**
   * Datos para la tabla de inventarios
   */
  public inventariosTablaDatos: InventariosInfo[] = [];

  /** Lista de empleados seleccionados en la tabla */
  public seleccionarInventariosTablaDatos: InventariosInfo[] =
    [] as InventariosInfo[];

  /**
   * Datos para la tabla de instalaciones principales
   */
  public instalacionesPrincipalesTablaDatos: InstalacionesPrincipalesTablaInfo[] = [];

  /**
   * Tipo de selección para las tablas (checkbox)
   */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Constructor del componente
   * 
   * @param fb Constructor de formularios
   * @param service Servicio para invocar registro
   * @param tramite32615Store Store para el trámite 32615
   * @param tramite32615Query Query para el trámite 32615
   */
  constructor(
    private fb: FormBuilder,
    private service: RecintoFiscalizadoService,
    private tramite32615Store: Tramite32615Store,
    private tramite32615Query: Tramite32615Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método de inicialización del componente
   */
  ngOnInit(): void {      
    this.inicializarEstadoFormulario();

    if(parseInt(this.solicitudState?.senaleCuentaEmpleados,10) === 1){
      this.showSenaleCuentaEmpleados = true;
    }
    if(parseInt(this.solicitudState?.senaleSiAlMomento,10) === 1){
      this.showSenaleSiAlMomento = true;
    }

    this.obtenerTablaDatos();
    this.obtenerInstalacionesPrincipalesTablaDatos();
    this.obtenerInventariosTablaDatos();
  }

  /**
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
  public inicializarEstadoFormulario(): void {
    this.tramite32615Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      Object.keys(this.datosComunesForma.controls).forEach((key) => {
        this.datosComunesForma.get(key)?.disable();
      });
    } else {
      Object.keys(this.datosComunesForma.controls).forEach((key) => {
        this.datosComunesForma.get(key)?.enable();
      });
    }

    if (this.esFormularioSoloLectura) {
      Object.keys(this.tablaModalForma.controls).forEach((key) => {
        this.tablaModalForma.get(key)?.disable();
      });
    } else {
      Object.keys(this.tablaModalForma.controls).forEach((key) => {
        this.tablaModalForma.get(key)?.enable();
      });
    }

    if (this.esFormularioSoloLectura) {
      Object.keys(this.tablaDosModalForma.controls).forEach((key) => {
        this.tablaDosModalForma.get(key)?.disable();
      });
    } else {
      Object.keys(this.tablaDosModalForma.controls).forEach((key) => {
        this.tablaDosModalForma.get(key)?.enable();
      });
    }

    if (this.esFormularioSoloLectura) {
      Object.keys(this.miembroDeLaEmpresa.controls).forEach((key) => {
        this.miembroDeLaEmpresa.get(key)?.disable();
      });
    } else {
      Object.keys(this.miembroDeLaEmpresa.controls).forEach((key) => {
        this.miembroDeLaEmpresa.get(key)?.enable();
      });
    }
  }

  /**
   * Método que se ejecuta después de que la vista ha sido inicializada
   */
  ngAfterViewInit(): void {
    // Inicializa los modales
    if (this.confirmModal) {
      this.confirmInstance = new Modal(this.confirmModal.nativeElement);
    }
    if (this.tablaModal) {
      this.tablaInstance = new Modal(this.tablaModal.nativeElement);
    }
    if (this.instalacionesPrincipalesTablaModal) {
      this.instalacionesPrincipalesTablaInstance = new Modal(this.instalacionesPrincipalesTablaModal.nativeElement);
    }
    if (this.miembroDeLaEmpresaModal) {
      this.miembroDeLaEmpresaInstance = new Modal(this.miembroDeLaEmpresaModal.nativeElement);
    }
  }

  /**
   * Abre el modal de confirmación
   */
  public openConfirmModal(): void {
    if (this.confirmInstance) {
      this.confirmInstance.show();
    }
  }

  /**
   * Cierra el modal de confirmación
   */
  public closeConfirmModal(): void {
    if (this.confirmInstance) {
      this.confirmInstance.hide();
    }
  }

  /**
   * Abre el modal de tabla de mercancías
   */
  public openTablaModal(): void {
    if (this.tablaInstance) {
      this.tablaInstance.show();
    }
  }

  /**
   * Cierra el modal de tabla de mercancías
   */
  public closeTablaModal(): void {
    if (this.tablaInstance) {
      this.tablaInstance.hide();
    }
  }

  /**
   * Abre el modal de miembros de la empresa
   */
  public openMiembroDeLaEmpresaModal(): void {
    if (this.miembroDeLaEmpresaInstance) {
      this.miembroDeLaEmpresaInstance.show();
    }
  }

  /**
   * Cierra el modal de miembros de la empresa
   */
  public closeMiembroDeLaEmpresaModal(): void {
    if (this.miembroDeLaEmpresaInstance) {
      this.miembroDeLaEmpresaInstance.hide();
    }
  }

  /**
   * Crea los datos para la tabla de mercancías
   */
  public crearTablaDatos(): void {
    //this.obtenerTablaDatos();
    const VALUE = this.tablaModalForma.value;
    const MERCANCIA: MercanciasInfo = {
      numero_de_empleados: VALUE.numeroDeEmpleadosForma,
      rfc: VALUE.rfc,
      denominacion_social: VALUE.registroFederalDeContribuyentes,
      bimestre: VALUE.bimestreForma,
    }
    this.mercanciasTablaDatos.push(MERCANCIA)
    this.closeTablaModal();
  }

  /**
   * Crea los datos para la tabla de instalaciones principales
   */
  public crearTablaDosDatos(): void {
    const VALUE = this.tablaDosModalForma.value;
    const INSTALACION: InstalacionesPrincipalesTablaInfo = {
      instalaciones_principales: VALUE.instalacionesPrincipales,
      tipo_de_instalacion: VALUE.tipoDeInstalcion,
      entidad_federativa: VALUE.entidadFederativa,
      colonia: VALUE.colonia,
      codigo_postal: VALUE.codigoPostal,
      registro_ante_se_sat: VALUE.registroAnte,
      proceso_productivo: VALUE.procesoProductivo,
      acredita_el_uso_y_goce_del_inmueble: '',
      realiza_operaciones_de_comercio_exterior: '',
      reconocimiento_mutuo_instalacion_c_tpat: '',
      perfil_de_la_empresa: '',
      perfil_del_recinto_fiscalizado_estrategico: '',
      perfil_del_auto_transportista_terrestre: '',
      perfil_del_transportista_ferroviario: '',
      perfil_del_recinto_fiscalizado: '',
      perfil_de_mensajeria_y_paqueteria: '',
      perfil_almacen_general: '',
      municipio_o_delegacion: ''
    }
    this.instalacionesPrincipalesTablaDatos.push(INSTALACION)
    this.closeTablaDosModal();
  }

  /**
   * Abre el modal de tabla de instalaciones principales
   */
  public openTablaDosModal(): void {
    if (this.instalacionesPrincipalesTablaInstance) {
      this.instalacionesPrincipalesTablaInstance.show();
    }
  }

  /**
   * Cierra el modal de tabla de instalaciones principales
   */
  public closeTablaDosModal(): void {
    if (this.instalacionesPrincipalesTablaInstance) {
      this.instalacionesPrincipalesTablaInstance.hide();
    }
  }

  /**
   * Crea e inicializa los formularios del componente
   */
  public crearFormulario(): void {
    this.datosComunesForma = this.fb.group({
      sectorProductivo: [this.solicitudState?.sectorProductivo],
      servicio: [this.solicitudState?.servicio],
      solicitudDeInspeccion: [this.solicitudState?.solicitudDeInspeccion, Validators.required],
      indiqueAutorizo: [this.solicitudState?.indiqueAutorizo, Validators.required],
      senaleCuentaEmpleados: [this.solicitudState?.senaleCuentaEmpleados, Validators.required],
      numeroDeEmpleados: [this.solicitudState?.numeroDeEmpleados],
      bimestre: [this.solicitudState?.bimestre],
      cumpleConLaObligacion: [this.solicitudState?.cumpleConLaObligacion, Validators.required],
      acreditaRealizar: [this.solicitudState?.acreditaRealizar, Validators.required],
      senaleSiAlMomento: [this.solicitudState?.senaleSiAlMomento, Validators.required],
      acreditaCumplir: [this.solicitudState?.acreditaCumplir, Validators.required],
      fraccionVI: [this.solicitudState?.fraccionVI, Validators.required],
      cuartoParrafoDelCff: [this.solicitudState?.cuartoParrafoDelCff, Validators.required],
      novenoParrafoDelCff: [this.solicitudState?.novenoParrafoDelCff, Validators.required],
      digitalesEstanVigentes: [this.solicitudState?.digitalesEstanVigentes, Validators.required],
      ultimosDoceMeses: [this.solicitudState?.ultimosDoceMeses, Validators.required],
      articuloDelCff: [this.solicitudState?.articuloDelCff, Validators.required],
      exportadoresSectorial: [this.solicitudState?.exportadoresSectorial, Validators.required],
      archivoNacionales: [this.solicitudState?.archivoNacionales],
      proveedores: [this.solicitudState?.proveedores],
      solicitudDeCertificacion: [this.solicitudState?.solicitudDeCertificacion, Validators.required],
      controlInventarios: [this.solicitudState?.controlInventarios, Validators.required],
      nombreDelSistema: [this.solicitudState?.nombreDelSistema, Validators.required],
      lugarDeRadicacion: [this.solicitudState?.lugarDeRadicacion, Validators.required],
      previstas: [this.solicitudState?.previstas],
      delCffLasReglas: [this.solicitudState?.delCffLasReglas, Validators.required],
      conformidad: [this.solicitudState?.conformidad, Validators.required],
      esquemaIntegralCertificacion: [this.solicitudState?.esquemaIntegralCertificacion, Validators.required],
      modificadasRevocadas: [this.solicitudState?.modificadasRevocadas, Validators.required]
    });

    this.tablaModalForma = this.fb.group({
      rfc: [this.solicitudState?.rfc, Validators.required],
      registroFederalDeContribuyentes: [{value: '', disabled: true}, Validators.required],
      razonSocial: [{value: '', disabled: true}, Validators.required],
      numeroDeEmpleadosForma: [this.solicitudState?.numeroDeEmpleadosForma, Validators.required],
      bimestreForma: [this.solicitudState?.bimestreForma, Validators.required],
    });

    this.tablaDosModalForma = this.fb.group({
      instalacionesPrincipales: [this.solicitudState?.instalacionesPrincipales, Validators.required],
      municipioAlcaldia: [{value: this.solicitudState?.municipioAlcaldia, disabled: true}],
      tipoDeInstalcion: [this.solicitudState?.tipoDeInstalcion, Validators.required],
      entidadFederative: [{value: '', disabled: true}],
      registroAnte: [{value: '', disabled: true}],
      colonia: [{value: '', disabled: true}],
      codigoPostal: [{value: '', disabled: true}],
      procesoProductivo: [this.solicitudState?.procesoProductivo, Validators.required],
      acreditacionDelUso: [this.solicitudState?.acreditacionDelUso, Validators.required],
      prefilMensajeria: [this.solicitudState?.prefilMensajeria]
    });

    this.miembroDeLaEmpresa = this.fb.group({
      enSeCaracter: [this.solicitudState?.enSeCaracter, Validators.required],
      obligadoTributar: [this.solicitudState?.obligadoTributar, Validators.required],
      nacionalidad: [this.solicitudState?.nacionalidad, Validators.required]
    });
  }

  /**
   * Obtiene los datos para la tabla de mercancías
   */
  public obtenerTablaDatos(): void {
    this.service.obtenerTablaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.data;
        this.mercanciasTablaDatos.push(DATOS[0]);
      });
  }

  /**
   * Obtiene los datos para la tabla de instalaciones principales
   */
  public obtenerInstalacionesPrincipalesTablaDatos(): void {
    this.service.obtenerInstalacionesPrincipalesTablaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.data;
        this.instalacionesPrincipalesTablaDatos.push(DATOS[0]);
      });
  }

  /**
   * Obtiene los datos para la tabla de inventarios
   */
  public obtenerInventariosTablaDatos(): void {
    this.service.obtenerInventariosTablaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.data;
        this.inventariosTablaDatos.push(DATOS[0]);
      });
  }

  /**
   * Establece valores en el store del trámite
   * 
   * @param form Formulario reactivo
   * @param campo Nombre del campo en el formulario
   * @param metodoNombre Nombre del método en el store
   * @param comprobarModal Indica si se debe comprobar el modal
   * @param comprobarModalValor Valor para comprobar el modal
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32615Store,
    comprobarModal?: boolean,
    comprobarModalValor?: number
  ): void {
    const VALOR = form.get(campo)?.value;
    if(comprobarModal && parseInt(VALOR,10) === comprobarModalValor){
      this.openConfirmModal();
    }
    if(campo === "senaleCuentaEmpleados"){
      if(parseInt(VALOR,10) === comprobarModalValor){
        this.showSenaleCuentaEmpleados = true;
      }else{
        this.showSenaleCuentaEmpleados = false;
      }
    }
    if(campo === "sectorProductivo"){
      this.datosComunesForma.get('servicio')?.setValue('');
      (this.tramite32615Store['setServicio'] as (value: unknown) => void)('');
    }
    if(campo === "servicio"){
      this.datosComunesForma.get('sectorProductivo')?.setValue('');
      (this.tramite32615Store['setSectorProductivo'] as (value: unknown) => void)('');
    }
    if(campo === "senaleSiAlMomento"){
      if(parseInt(VALOR,10) === comprobarModalValor){
        this.showSenaleSiAlMomento = true;
      }else{
        this.showSenaleSiAlMomento = false;
      }
    }
    (this.tramite32615Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

    /**
   * Guarda la selección de Mercancias datos hecha por el usuario.
   */
  seleccionarMercanciasTabla(evento: MercanciasInfo[]): void {
    this.seleccionarMercanciasTablaDatos = evento;
  }

    /**
   * Guarda la selección de Mercancias datos hecha por el usuario.
   */
  seleccionarInstalacionesPrincipalesTabla(evento: InstalacionesPrincipalesTablaInfo[]): void {
    this.seleccionarInstalacionesPrincipalesTablaDatos = evento;
  }

    /**
   * Guarda la selección de Mercancias datos hecha por el usuario.
   */
  seleccionarInventariosTabla(evento: InventariosInfo[]): void {
    this.seleccionarInventariosTablaDatos = evento;
  }

  /**
   * Elimina los registros de Mercancias seleccionados.
   */
  eliminarMercanciasTabla(): void {
    if (this.seleccionarMercanciasTablaDatos.length > 0) {
      this.seleccionarMercanciasTablaDatos.forEach((elemento) => {
        const INDICE = this.mercanciasTablaDatos.findIndex(
          (inv) => inv.numero_de_empleados === elemento.numero_de_empleados
        );
        if (INDICE !== -1) {
          this.mercanciasTablaDatos.splice(INDICE, 1);
        }
      });
    }
  }

    /**
   * Elimina los registros de Mercancias seleccionados.
   */
  eliminarInstalacionesPrincipales(): void {
    if (this.seleccionarInstalacionesPrincipalesTablaDatos.length > 0) {
      this.seleccionarInstalacionesPrincipalesTablaDatos.forEach((elemento) => {
        const INDICE = this.instalacionesPrincipalesTablaDatos.findIndex(
          (inv) => inv.tipo_de_instalacion === elemento.tipo_de_instalacion
        );
        if (INDICE !== -1) {
          this.instalacionesPrincipalesTablaDatos.splice(INDICE, 1);
        }
      });
    }
  }

  
    /**
   * Elimina los registros de Mercancias seleccionados.
   */
  eliminarInventariosTabla(): void {
    if (this.seleccionarInventariosTablaDatos.length > 0) {
      this.seleccionarInventariosTablaDatos.forEach((elemento) => {
        const INDICE = this.inventariosTablaDatos.findIndex(
          (inv) => inv.nombre === elemento.nombre
        );
        if (INDICE !== -1) {
          this.inventariosTablaDatos.splice(INDICE, 1);
        }
      });
    }
  }

  /**
   * Maneja el evento de cambio de valor
   */
  public enCambioDeValor(): void {
    this.changed = !this.changed;
  }

  /**
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}