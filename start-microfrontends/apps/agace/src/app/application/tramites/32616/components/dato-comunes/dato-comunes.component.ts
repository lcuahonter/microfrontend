import { ALERTA_COM, OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/32616/datos-comunes.enum';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AlertComponent, Catalogo, CatalogoSelectComponent, ConfiguracionColumna, InputRadioComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { INSTALACIONES_PRINCIPALES_TABLA, InstalacionesPrincipalesTablaInfo, MERCANCIA_TABLA, MercanciasInfo } from '@libs/shared/data-access-user/src/core/models/32616/dato-comunes.model';
import { Solicitud32616State, Tramite32616Store } from '../../estados/tramites/tramite32616.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { SolicitudDeRegistroInvocarService } from '../../services/solicitudDeRegistroInvocar/solicitud-de-registro-invocar.service';
import { Tramite32616Query } from '../../estados/queries/tramite32616.query';
import productivo from '@libs/shared/theme/assets/json/32616/productivo.json';
import serviciosAgace from '@libs/shared/theme/assets/json/32616/serviciosAgace.json';

/**
 * Componente para manejar los datos comunes del trámite 32616
 * 
 * Este componente se encarga de gestionar los formularios y tablas relacionadas
 * con la información común requerida para el trámite 32616.
 */
@Component({
  selector: 'app-dato-comunes',
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
  templateUrl: './dato-comunes.component.html',
  styleUrl: './dato-comunes.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DatoComunesComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Formulario principal para los datos comunes del trámite
   */
  datosComunesForma!: FormGroup;

  /**
   * Formulario para la tabla modal de mercancías
   */
  tablaModalForma!: FormGroup;

  /**
   * Formulario para la tabla modal de instalaciones principales
   */
  tablaDosModalForma!: FormGroup;

  /**
   * Formulario para información de miembros de la empresa
   */
  miembroDeLaEmpresa!: FormGroup;

  /**
   * Lista de sectores productivos obtenidos desde archivo JSON
   */
  sectorProductivoAgace: Catalogo[] = productivo;

  /**
   * Lista de servicios Agace obtenidos desde archivo JSON
   */
  serviciosAgace: Catalogo[] = serviciosAgace;

  /**
   * Estado actual de la solicitud del trámite
   */
  public solicitudState!: Solicitud32616State;

  /**
   * Constante de alertas utilizadas en el componente
   */
  alerta = ALERTA_COM;

  /**
   * Opciones para los botones de radio
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Subject para manejar la destrucción de observables
   */
  private destroyNotifier$: Subject<void> = new Subject();

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
  confirmInstance!: Modal;

  /**
   * Instancia del modal de tabla de mercancías
   */
  tablaInstance!: Modal;

  /**
   * Instancia del modal de instalaciones principales
   */
  instalacionesPrincipalesTablaInstance!: Modal;

  /**
   * Instancia del modal de miembros de la empresa
   */
  miembroDeLaEmpresaInstance!: Modal;

  /**
   * Bandera para mostrar campo de número de empleados
   */
  showSenaleCuentaEmpleados:boolean = false;

  /**
   * Bandera para mostrar campo "si al momento"
   */
  showSenaleSiAlMomento:boolean = false;

  /**
   * Bandera para indicar cambios en el formulario
   */
  changed:boolean = false;

  /**
   * Configuración de columnas para la tabla de mercancías
   */
  mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = MERCANCIA_TABLA;
/**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Datos para la tabla de mercancías
   */
  mercanciasTablaDatos: MercanciasInfo[] = [];

  /**
   * Configuración de columnas para la tabla de instalaciones principales
   */
  instalacionesPrincipalesTabla: ConfiguracionColumna<InstalacionesPrincipalesTablaInfo>[] = INSTALACIONES_PRINCIPALES_TABLA;

  /**
   * Datos para la tabla de instalaciones principales
   */
  instalacionesPrincipalesTablaDatos: InstalacionesPrincipalesTablaInfo[] = [];

  /**
   * Tipo de selección para las tablas (checkbox)
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Constructor del componente
   * 
   * @param fb Constructor de formularios
   * @param service Servicio para invocar registro
   * @param tramite32616Store Store para el trámite 32616
   * @param tramite32616Query Query para el trámite 32616
   */
  constructor(
    private fb: FormBuilder,
    private service: SolicitudDeRegistroInvocarService,
    private tramite32616Store: Tramite32616Store,
    private tramite32616Query: Tramite32616Query,
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
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
  inicializarEstadoFormulario(): void {
    this.tramite32616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
      this.crearFormulario();
     if (this.esFormularioSoloLectura) {
      Object.keys(this.datosComunesForma.controls)
        .map((key) => this.datosComunesForma.get(key))
        .map((control) => {
          control?.disable();
          return control;
        });
    } else {
      Object.keys(this.datosComunesForma.controls)
        .map((key) => this.datosComunesForma.get(key))
        .map((control) => {
          control?.enable();
          return control;
        });
    }
    
  }

  /**
   * Método de inicialización del componente
   */
  ngOnInit(): void {
    this.tramite32616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
      

    if(parseInt(this.solicitudState?.senaleCuentaEmpleados,10) === 1){
      this.showSenaleCuentaEmpleados = true;
    }
    if(parseInt(this.solicitudState?.senaleSiAlMomento,10) === 1){
      this.showSenaleSiAlMomento = true;
    }

    this.obtenerTablaDatos();
    this.obtenerInstalacionesPrincipalesTablaDatos();
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
  openConfirmModal(): void {
    if (this.confirmInstance) {
      this.confirmInstance.show();
    }
  }

  /**
   * Cierra el modal de confirmación
   */
  closeConfirmModal(): void {
    if (this.confirmInstance) {
      this.confirmInstance.hide();
    }
  }

  /**
   * Abre el modal de tabla de mercancías
   */
  openTablaModal(): void {
    if (this.tablaInstance) {
      this.tablaInstance.show();
    }
  }

  /**
   * Cierra el modal de tabla de mercancías
   */
  closeTablaModal(): void {
    if (this.tablaInstance) {
      this.tablaInstance.hide();
    }
  }

  /**
   * Abre el modal de miembros de la empresa
   */
  openMiembroDeLaEmpresaModal(): void {
    if (this.miembroDeLaEmpresaInstance) {
      this.miembroDeLaEmpresaInstance.show();
    }
  }

  /**
   * Cierra el modal de miembros de la empresa
   */
  closeMiembroDeLaEmpresaModal(): void {
    if (this.miembroDeLaEmpresaInstance) {
      this.miembroDeLaEmpresaInstance.hide();
    }
  }

  /**
   * Crea los datos para la tabla de mercancías
   */
  crearTablaDatos(): void {
    this.obtenerTablaDatos();
    this.closeTablaModal();
  }

  /**
   * Crea los datos para la tabla de instalaciones principales
   */
  crearTablaDosDatos(): void {
    this.obtenerInstalacionesPrincipalesTablaDatos();
    this.closeTablaDosModal();
  }

  /**
   * Abre el modal de tabla de instalaciones principales
   */
  openTablaDosModal(): void {
    if (this.instalacionesPrincipalesTablaInstance) {
      this.instalacionesPrincipalesTablaInstance.show();
    }
  }

  /**
   * Cierra el modal de tabla de instalaciones principales
   */
  closeTablaDosModal(): void {
    if (this.instalacionesPrincipalesTablaInstance) {
      this.instalacionesPrincipalesTablaInstance.hide();
    }
  }

  /**
   * Crea e inicializa los formularios del componente
   */
  crearFormulario(): void {
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
      novenoParrafoDelCff: [this.solicitudState?.novenoParrafoDelCff, Validators.required],
      digitalesEstanVigentes: [this.solicitudState?.digitalesEstanVigentes, Validators.required],
      ultimosDoceMeses: [this.solicitudState?.ultimosDoceMeses, Validators.required],
      prestacionDeServicios: [this.solicitudState?.prestacionDeServicios],
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
  obtenerTablaDatos(): void {
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
  obtenerInstalacionesPrincipalesTablaDatos(): void {
    this.service.obtenerInstalacionesPrincipalesTablaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.data;
        this.instalacionesPrincipalesTablaDatos.push(DATOS[0]);
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
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32616Store,
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
    if(campo === "senaleSiAlMomento"){
      if(parseInt(VALOR,10) === comprobarModalValor){
        this.showSenaleSiAlMomento = true;
      }else{
        this.showSenaleSiAlMomento = false;
      }
    }
    (this.tramite32616Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Maneja el evento de cambio de valor
   */
  enCambioDeValor(): void {
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