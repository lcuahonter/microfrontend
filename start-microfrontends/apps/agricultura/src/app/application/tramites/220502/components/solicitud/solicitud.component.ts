import {
  CargarDatosIniciales,
  CarrosDeFerrocarril,
  DatosDeMercancias,
  HistorialInspeccionFisica,
  Solicitud,
} from '../../models/solicitud-pantallas.model';
import { CatalogosSelect, ConsultaioQuery } from '@ng-mf/data-access-user';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, firstValueFrom, map, takeUntil } from 'rxjs';
import { CarrosDeFerrocarrilComponent } from '../../shared/carros-de-ferrocarril/carros-de-ferrocarril.component';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/tipo-solicitud.model';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteARealizarComponent } from '../../shared/datos-del-tramite-a-realizar/datos-del-tramite-a-realizar.component';
import { HistorialInspeccionFisicaComponent } from '../../shared/historial-inspeccion-fisica/historial-inspeccion-fisica.component';
import { MedioTransporteComponent } from '../../shared/medio-transporte/medio-transporte.component';
import { MercanciaTabla } from '../../models/medio-transporte.model';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { PROCEDURE_ID } from '../../constantes/constantes';
import { ResponsableInspeccionEnPuntoComponent } from '../../shared/responsable-inspeccion-en-punto/responsable-inspeccion-en-punto.component';
import { Solicitud220502Query } from '../../estados/tramites220502.query';
import { Solicitud220502Store } from '../../estados/tramites220502.store';
import { SolicitudDatosComponent } from '../../shared/solicitud-datos/solicitud-datos.component';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';




/**
 * Componente para gestionar la solicitud de trámite.
 */
@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HistorialInspeccionFisicaComponent,
    CarrosDeFerrocarrilComponent,
    SolicitudDatosComponent,
    ResponsableInspeccionEnPuntoComponent,
    DatosDelTramiteARealizarComponent,
    MedioTransporteComponent,
  ],
  providers: [SolicitudPantallasService],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
/** Componente para gestionar la solicitud de trámite */
export class SolicitudComponent implements OnInit, OnDestroy {
  @ViewChild(DatosDelTramiteARealizarComponent)
datosTramite!: DatosDelTramiteARealizarComponent;

@ViewChild(ResponsableInspeccionEnPuntoComponent)
responsableInsp!: ResponsableInspeccionEnPuntoComponent;
@ViewChild(MedioTransporteComponent)
medioTransporte!: MedioTransporteComponent;
  /** Grupo de formularios para manejar formularios reactivos.*/
  form!: FormGroup;

  /** Encabezados y datos para mostrar información de mercancías. */
  hMercanciaTabla: string[] = [];

  /** Datos de mercancías para mostrar en la tabla. */
  dMercanciaBody: DatosDeMercancias[] = [];

  /** Encabezados y datos para mostrar información de solicitud */
  hSolicitud: string[] = [ 'Fecha Creación',
             'Mercancía', 'Cantidad', 'Proovedor'];

  /** Datos de solicitud para mostrar en la tabla */
  dSolicitud: Solicitud[] = [];

  /** Información del catálogo para la selección del medio de transporte. */
  mediodetransporte: CatalogosSelect = {} as CatalogosSelect;

  /** Matriz para contener datos para cada fila de la tabla */
  tableData = {
    tableBody: [],
    tableHeader: [],
  };

  /** Datos de vagones e historial de inspección física. */
  hCarroFerrocarril: string[] = ['Número de parcialidad/remesa','Cantidad de carros de ferrocarril'];

  /** Datos de vagones e historial de inspección física. */
  dCarrosDeFerrocarril: CarrosDeFerrocarril[] = [];

  /** Encabezados y datos para mostrar información de historial de inspección física. */
  hHistorialinspeccion: string[] = ['Número parcialidad/remesa','Fracción arancelaria','Nico','Cantidad total en UMT','Cantidad parcial en UTM','Saldo pendiente','Fecha de ingreso'];

  /** Datos de historial de inspección física para mostrar en la tabla. */
  dHistorialInspecciones: HistorialInspeccionFisica[] = [];

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /** Bandera para deshabilitar el formulario */
  formularioDeshabilitado: boolean = false;

  /**
   * Bandera que indica si la solicitud está en modo solo lectura.
   * @type {boolean}
   */
  isSolicitud: boolean = false;

  /**
   * Evento que emite el valor booleano para indicar si los certificados están autorizados.
   *
   * > **Nota:** El valor `false` pasado al constructor de `EventEmitter` indica que
   * la emisión será sincrónica (no establece un valor por defecto).
   *
   * @type {EventEmitter<boolean>}
   */
  @Output() certificadosAutorizValor = new EventEmitter<boolean>(false);

  /**
   * @property {number} procedimiento
   * @description
   * Almacena el identificador del procedimiento actual, asignado a partir de la
   * constante `PROCEDURE_ID`.
   * Se utiliza para asociar la lógica y las operaciones del componente con el
   * trámite correspondiente.
   *
   * @default PROCEDURE_ID (220502)
   */
  procedimiento: number = PROCEDURE_ID;

  /**
   * @description
   * Lista general de mercancías disponibles en el componente.
   *
   * Esta colección contiene todas las mercancías cargadas o registradas,
   * y se utiliza como fuente principal para mostrar la tabla de mercancías
   * en la interfaz de usuario.
   *
   * A diferencia de `mercanciaSeleccionLista`, que solo guarda las
   * seleccionadas, esta propiedad mantiene el inventario completo.
   *
   * @type {MercanciaTabla[]}
   */
  mercanciaLista: MercanciaTabla[] = [] as MercanciaTabla[];

  /**
   * @constructor
   * Inyecta los servicios necesarios para la creación y gestión del formulario,
   * así como para la obtención y consulta de datos de la solicitud.
   *
   * @param fb - Servicio `FormBuilder` para crear y manejar formularios reactivos.
   * @param solicitudService - Servicio para obtener datos de la solicitud.
   * @param consultaioQuery - Servicio Query para consultar la información relacionada con la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudPantallasService /**Servicio para obtener datos de solicitud */,
    private consultaioQuery: ConsultaioQuery,
    private solicitudQuery: Solicitud220502Query,
    private NOTIF: NotificacionesService,
     public solicitud220502Store: Solicitud220502Store,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.isSolicitud = seccionState.create;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /** Gancho de ciclo de vida para cargar datos iniciales cuando se inicializa el componente */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();

    // Se suscribe al observable `certificadosAutorizados$` del query de solicitud.
// Este observable emite el número o identificador del certificado autorizado.
     this.solicitudQuery.certificadosAutorizados$.subscribe(value => {
        if (value) {
          this.getMercancia(String(value))
           this.getHistInspFisica(String(value))
           this.obtenerHistorialCarrosFerrocarri(String(value))
        }
      })
 }
  /**
 * Selecciona una mercancía y la agrega a la lista en el store.
 * @param item Objeto de tipo MercanciaTabla que será agregado a la lista.
 */
seleccionarMercancia(item: MercanciaTabla[]): void {
  this.solicitud220502Store.setMercanciaLista(item);
}
  // Obtiene la tabla de solicitudes y la asigna a dSolicitud
 public getTablaSolicitud(): void {
  this.solicitudService
    .getTablaSolicitud(this.procedimiento.toString())
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ? data.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      }

      // Asignar datos mapeados
      this.dSolicitud = data.datos;
    });
}

    /**
 * Obtiene el historial de inspección física desde el servicio
 * y agrega el arreglo `tbodyData` para mostrar los datos en la tabla.
 */
  getHistInspFisica(certificado: string): void {
  this.solicitudService
    .getHistorialInspeccionFisica(certificado,this.procedimiento.toString())
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {

      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ? data.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      }

      this.dHistorialInspecciones = data.datos.map(item => ({
        ...item,
        tbodyData: [
          item.numeroPartidaMercancia,
          item.fraccionArancelaria,
          item.nico,
          item.cantidadUmt,
          item.cantidadInspeccion,
          item.saldoPendiente,
          item.fechaInspeccionString
        ]
      }));
    });
}

/**
 * Método asíncrono para obtener la lista de mercancías asociadas a un certificado.
 * Utiliza la función del servicio `getDatosMercancia` y convierte el Observable en una Promesa.
 */
  public getMercancia(certificado: string): void {
  this.solicitudService
    .getDatosMercancia(certificado,this.procedimiento.toString())
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ? data.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      }

      this.mercanciaLista = data.datos;
      this.seleccionarMercancia(this.mercanciaLista )
    });
}
    // Obtiene el catálogo de medios de transporte y lo asigna al template correspondiente
       async getMediosDeTransporte(): Promise<void> {
      try {
        const DATA = await firstValueFrom(this.solicitudService.getMediosDeTransporte(this.procedimiento.toString()).pipe(takeUntil(this.destroyed$)));
          const CATALOGOTEMPLATE = (
              label: string,
              required: boolean,
              catalogos: Catalogo[]
            ): CatalogosSelect => ({
              labelNombre: label,
              required,
              primerOpcion: 'Selecciona un valor',
              catalogos,
            });
        
          this.mediodetransporte = CATALOGOTEMPLATE(
              'Medio de transport',
              true,
               DATA
            );
        } catch (error) {
        // Manejar error
      }
    }
    /**
 * Obtiene historial de carros de ferrocarril desde el servicio
 * y transforma la respuesta en un formato compatible con <ng-table>.
 */
obtenerHistorialCarrosFerrocarri(certificado: string): void {
  this.solicitudService
    .obtenerHistorialCarrosFerrocarri(certificado,this.procedimiento.toString())
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {

      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ? data.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      }

      const DATOS = data.datos ?? [];

this.dCarrosDeFerrocarril = DATOS.map((item) => ({
  idInspeccionFisica: item.idSolicitud ?? 0,
  numeroAutorizacion: '',
  numeroPartidaMercancia: String(item.numeroPartidaMercancia),
  numeroTotalCarros: item.numTotalCarros,
  tbodyData: [
    String(item.numeroPartidaMercancia),
    String(item.numTotalCarros)
  ]
}));
    });
}
  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormulario();
      this.cargarDatosIniciales();
        this.getTablaSolicitud()
        this.getMediosDeTransporte()
   
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.crearFormulario();
    this.cargarDatosIniciales();
      this.getTablaSolicitud()
      this.getMediosDeTransporte()
    
    if (this.formularioDeshabilitado) {
      this.form.disable();
    } else if (!this.formularioDeshabilitado) {
      this.form.enable();
    }
  }

  /**
   * Método para crear el formulario de la solicitud.
   */
  crearFormulario(): void {
    this.form = this.fb.group(
      {}
    ); /** Inicializar un grupo de formulario vacío y obtener datos de formulario utilizando formGroupName de un componente secundario. */
  }

  /**
   * Método para buscar y cargar datos iniciales del servicio.
   */
  cargarDatosIniciales(): void {
    this.solicitudService.getData().subscribe({
      next: (data: CargarDatosIniciales) => {
        this.hMercanciaTabla = data.hMerchandise;
        this.dMercanciaBody = data.dMercancia;
     },
    });
  }
 
 /**
   * Emite un evento indicando si los certificados han sido autorizados.
   *
   * @param evento - Valor booleano que indica el estado de autorización de los certificados.
   */
  certificadosAutorizEmitido(evento: boolean): void {
    this.certificadosAutorizValor.emit(evento);
  }


/**
 * Marca como tocados todos los controles de las secciones del formulario.
 */
public marcarTodosLosControles(): void {
  if (this.datosTramite) {
    this.datosTramite.marcarControlesComoTocados();
  }

  if (this.responsableInsp) {
    this.responsableInsp.marcarControlesComoTocados();
  }

  if (this.medioTransporte) {
    this.medioTransporte.marcarControlesComoTocados();
  }
}
/**
 * Indica si todos los grupos de formulario son válidos.
 */
get formValid(): boolean {
  return (
    (this.datosTramite?.grupoFormularioPadre?.valid ?? false) &&
    (this.responsableInsp?.grupoFormularioPadre?.valid ?? false) &&
    (this.medioTransporte?.grupoFormularioPadre?.valid ?? false)
  );
}
  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Desuscribe el componente de todos los observables.
   * @returns {void}
   * */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
