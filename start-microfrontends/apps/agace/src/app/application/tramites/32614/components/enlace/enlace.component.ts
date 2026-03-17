import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Solicitud32614TercerosState, Tramite32614TercerosStore } from '../../estados/tramites/tramite32614_terceros.store';
import { TableBodyData, TableComponent } from '@ng-mf/data-access-user';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { SolicitudDeRegistroInvocarService } from '../../services/solicitudDeRegistroInvocar/solicitud-de-registro-invocar.service';
import { Subject } from 'rxjs';
import { TERCEROS, TERCEROS_TABLA } from '../../constants/terceros.enum';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite32614TercerosQuery } from '../../estados/queries/terceros.query';
import enlace from '@libs/shared/theme/assets/json/31601/enlace.json';
import enlaceData from '@libs/shared/theme/assets/json/31601/enlace-data.json';
import operativo from '@libs/shared/theme/assets/json/32614/operativo-tabla.json';
import { TercerosTablaInfo } from '@libs/shared/data-access-user/src/core/models/32614/dato-comunes.model';
/**
 * Componente encargado de gestionar la información del enlace del trámite 32614.
 */
@Component({
  selector: 'app-enlace',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    TituloComponent,
    ReactiveFormsModule,
    FormsModule,
    TablaDinamicaComponent
  ],
  templateUrl: './enlace.component.html',
  styleUrl: './enlace.component.scss',
})
export class EnlaceComponent implements OnInit, OnDestroy {
  /**
   * Encabezados de la tabla de enlace.
   */
  public enlaceHeaderData: string[] = [];

  
  /** Tipo de tabla utilizada para mostrar número de empleados (checkbox) */
  public tablaSeleccionCheckbox = TablaSeleccion.CHECKBOX;

  /**
   * Cuerpo de la tabla de enlace.
   */
  public enlanceBodyData: TableBodyData[] = operativo.operativo.tableBody;

  /**
   * Datos de la tabla de enlace cargados desde archivo JSON.
   */
  public enlaceTableData = enlace;

  /**
   * Formulario reactivo para los datos del representante/enlace.
   */
  public enlace!: FormGroup;

  /**
   * Datos predefinidos del representante cargados desde JSON.
   */
  public representativeData = enlaceData;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual de la solicitud del trámite.
   */
  public solicitudState!: Solicitud32614TercerosState;

  /**
   * Sujeto para notificar destrucción y cancelar suscripciones activas.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Controla la visibilidad del modal.
   */
  public modal: string = 'modal';
  
  /** Configuración de columnas para la tabla de número de empleados */
  public numeroDeEmpleadosConfiguracionColumnas: ConfiguracionColumna<TercerosTablaInfo>[] = TERCEROS;

  /** Lista completa de número de empleados */
  public numeroDeEmpleadosLista: TercerosTablaInfo[] = TERCEROS_TABLA as TercerosTablaInfo[];
  
  /** Lista de empleados seleccionados en la tabla */
  public seleccionarNumeroDeEmpleadosLista: TercerosTablaInfo[] = [] as TercerosTablaInfo[];
  
  /** Indica si el modal está en modo de edición (true) o creación (false). */
  public esModalEdicion: boolean = false;

  /**
   * Referencia al botón de cierre del modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Constructor del componente.
   * 
   * @param fb Instancia de FormBuilder para crear formularios.
   * @param tramite32614Store Store para modificar el estado del trámite.
   * @param tramite32614Query Query para consultar el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32614Store: Tramite32614TercerosStore,
    private tramite32614Query: Tramite32614TercerosQuery,
    private consultaioQuery: ConsultaioQuery,
    private service: SolicitudDeRegistroInvocarService,
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
   * Método del ciclo de vida que se ejecuta al iniciar el componente.
   * Inicializa el formulario y carga los datos del encabezado de la tabla.
   */
  ngOnInit(): void {
    this.tramite32614Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.getEnlace();
  }

/**
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
  inicializarEstadoFormulario(): void {
    this.tramite32614Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
      this.getRegistroForm();
     if (this.esFormularioSoloLectura) {
      Object.keys(this.enlace.controls)
        .map((key) => this.enlace.get(key))
        .map((control) => {
          control?.disable();
          return control;
        });
    } else {
      Object.keys(this.enlace.controls)
        .map((key) => this.enlace.get(key))
        .map((control) => {
          control?.enable();
          return control;
        });
    }
  }

  /**
   * Carga los encabezados de la tabla de enlace desde los datos JSON.
   */
  public getEnlace(): void {
    this.enlaceHeaderData = this.enlaceTableData?.tableHeader;
  }

  /**
   * Abre el modal y carga el formulario con los datos del representante.
   */
  public abrirModal(): void {
    this.esModalEdicion = false; // Set mode to "add"
    this.modal = 'show';
    this.getRegistroForm();
  }

    /** Guarda la selección de número de empleados hecha por el usuario.*/
  seleccionarNumeroDeEmpleadosDato(evento: TercerosTablaInfo[]): void {
    this.seleccionarNumeroDeEmpleadosLista = evento;
  }

  /**
   * Inicializa el formulario con validadores y datos del estado o los datos predeterminados.
   */
  public getRegistroForm(): void {
    this.enlace = this.fb.group({
      resigtroFedral: [
        this.solicitudState?.resigtroFedral && this.solicitudState?.resigtroFedral !== ''
          ? this.solicitudState?.resigtroFedral
          : this.representativeData?.resigtro,
        Validators.required,
      ],
      rfc: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      cargo: [
        this.solicitudState?.cargo && this.solicitudState?.cargo !== ''
          ? this.solicitudState?.cargo
          : this.representativeData?.cargo,
        Validators.required,
      ],
      cuidad: ['', Validators.required],
      telefonoEnlace: [
        this.solicitudState?.telefonoEnlace && this.solicitudState?.telefonoEnlace !== ''
          ? this.solicitudState?.telefonoEnlace
          : this.representativeData?.telefono,
        Validators.required,
      ],
      correoEnlace: [
        this.solicitudState?.correoEnlace && this.solicitudState?.correoEnlace !== ''
          ? this.solicitudState?.correoEnlace
          : this.representativeData?.correo,
        Validators.required,
      ],
      suplente: [this.solicitudState?.suplente, Validators.required],
    });

    this.patchData();
  }

  /**
   * Parchea el formulario con los datos predefinidos del representante.
   */
  public patchData(): void {
    this.enlace.patchValue({
      rfc: this.representativeData?.rfc,
      nombre: this.representativeData?.nombre,
      apellidoPaterno: this.representativeData?.apellidoPaterno,
      apellidoMaterno: this.representativeData?.apellidoMaterno,
      cuidad: this.representativeData?.cuidad,
    });

    this.enlace.get('rfc')?.disable();
    this.enlace.get('nombre')?.disable();
    this.enlace.get('apellidoPaterno')?.disable();
    this.enlace.get('apellidoMaterno')?.disable();
    this.enlace.get('cuidad')?.disable();
  }

  /**
   * Establece un valor en el store del trámite.
   * 
   * @param form Formulario reactivo que contiene el valor.
   * @param campo Nombre del campo a obtener.
   * @param metodoNombre Nombre del método en el store a invocar.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32614TercerosStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32614Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  
  /** Muestra el modal de subcontratados y carga los datos del primer empleado seleccionado en el formulario modal. */
  modificarSubcontratados(): void {
    if (this.seleccionarNumeroDeEmpleadosLista.length !== 0) {
      this.esModalEdicion = true; // Set mode to "edit"
      this.modal = 'show'; // Open the modal
      
     this.enlace.patchValue({
        rfc: this.seleccionarNumeroDeEmpleadosLista[0]?.rfc,
        nombre: this.seleccionarNumeroDeEmpleadosLista[0]?.nombre,
        apellidoPaterno: this.seleccionarNumeroDeEmpleadosLista[0]?.apellidoPaterno,
        apellidoMaterno: this.seleccionarNumeroDeEmpleadosLista[0]?.apellidoMaterno,
        ciudad: this.seleccionarNumeroDeEmpleadosLista[0]?.ciudadOEstadoDeResidencia,
        cargo: this.seleccionarNumeroDeEmpleadosLista[0]?.cargoOPuesto,
        telefonoEnlace: this.seleccionarNumeroDeEmpleadosLista[0]?.telefono,
        correoEnlace: this.seleccionarNumeroDeEmpleadosLista[0]?.correoElectronico,
        suplente: this.seleccionarNumeroDeEmpleadosLista[0]?.suplente,
      });
    }
  }

  
  /** Elimina los registros de número de empleados seleccionados.*/
  eliminarNumeroDeEmpleadosDato(): void {
    if (this.seleccionarNumeroDeEmpleadosLista.length > 0) {
    
      this.numeroDeEmpleadosLista = this.numeroDeEmpleadosLista.filter(item => {
        
        return !this.seleccionarNumeroDeEmpleadosLista.some(selectedItem =>
          selectedItem.rfc === item.rfc &&
          selectedItem.nombre === item.nombre &&
          selectedItem.apellidoPaterno === item.apellidoPaterno &&
          selectedItem.apellidoMaterno === item.apellidoMaterno &&
          selectedItem.ciudadOEstadoDeResidencia === item.ciudadOEstadoDeResidencia &&
          selectedItem.cargoOPuesto === item.cargoOPuesto &&
          selectedItem.telefono === item.telefono &&
          selectedItem.correoElectronico === item.correoElectronico &&
          selectedItem.suplente === item.suplente
        );
      });

      this.seleccionarNumeroDeEmpleadosLista = [];
    }
  }

  
  /** Guarda o actualiza el registro de número de empleados en la lista y muestra el modal de confirmación. */
  aceptarModalUno(): void {
    if (!this.esModalEdicion) {
      
      const NUEVO_EMPLEADO: TercerosTablaInfo = {
        rfc: this.enlace.get('rfc')?.value,
        nombre: this.enlace.get('nombre')?.value,
        apellidoPaterno: this.enlace.get('apellidoPaterno')?.value,
        apellidoMaterno: this.enlace.get('apellidoMaterno')?.value,
        ciudadOEstadoDeResidencia: this.enlace.get('ciudad')?.value,
        cargoOPuesto: this.enlace.get('cargo')?.value,
        telefono: this.enlace.get('telefonoEnlace')?.value,
        correoElectronico: this.enlace.get('correoEnlace')?.value,
        suplente: this.enlace.get('suplente')?.value,
      };
      
      
      this.numeroDeEmpleadosLista = [...this.numeroDeEmpleadosLista, NUEVO_EMPLEADO];
    } else {
      
      const INDICE = this.numeroDeEmpleadosLista.findIndex((item) => item.rfc === this.seleccionarNumeroDeEmpleadosLista?.[0]?.rfc);
      if (INDICE >= 0) {
       
        this.numeroDeEmpleadosLista = this.numeroDeEmpleadosLista.map((item, index) => {
          if (index === INDICE) {
            return {
              rfc: this.enlace.get('rfc')?.value,
              nombre: this.enlace.get('nombre')?.value,
              apellidoPaterno: this.enlace.get('apellidoPaterno')?.value,
              apellidoMaterno: this.enlace.get('apellidoMaterno')?.value,
              ciudadOEstadoDeResidencia: this.enlace.get('ciudad')?.value,
              cargoOPuesto: this.enlace.get('cargo')?.value,
              telefono: this.enlace.get('telefonoEnlace')?.value,
              correoElectronico: this.enlace.get('correoEnlace')?.value,
              suplente: this.enlace.get('suplente')?.value,
            };
          }
          return item;
        });
      }
    }
      
    this.seleccionarNumeroDeEmpleadosLista = [];
    this.modal = 'hide';
    this.enlace.reset();
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
