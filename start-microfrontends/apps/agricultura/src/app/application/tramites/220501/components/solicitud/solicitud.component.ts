import { Catalogo, CatalogosSelect, ConsultaioQuery } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, firstValueFrom, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { CarrosDeFerrocarril } from '../../../220502/models/solicitud-pantallas.model';
import { CarrosDeFerrocarrilComponent } from '../../../220502/shared/carros-de-ferrocarril/carros-de-ferrocarril.component';

import { DatosDelTramiteARealizarComponent } from '../../../220502/shared/datos-del-tramite-a-realizar/datos-del-tramite-a-realizar.component';
import { HistorialInspeccionFisica } from '../../../220502/models/solicitud-pantallas.model';
import { HistorialInspeccionFisicaComponent } from '../../../220502/shared/historial-inspeccion-fisica/historial-inspeccion-fisica.component';
import { MedioTransporteComponent } from '../medio-transporte/medio-transporte.component';
import { MercanciaTabla } from '../../models/pago-de-derechos.model';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { ResponsableInspeccionEnPuntoComponent } from '../../../220502/shared/responsable-inspeccion-en-punto/responsable-inspeccion-en-punto.component';
import { RevisionService } from '../../services/revision.service';
import { Solicitud } from '../../../220502/models/solicitud-pantallas.model'
import { Solicitud220501Query } from '../../estados/tramites220501.query';
import { Solicitud220501Store } from '../../estados/tramites220501.store';
import { SolicitudDatosComponent } from '../../../220502/shared/solicitud-datos/solicitud-datos.component';
import { SolicitudPantallasService } from '../../../220502/services/solicitud-pantallas.service';
import { TEXTOS } from '../../constantes/texto-enum';




/**
 * Componente para gestionar los datos de la solicitud.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SolicitudDatosComponent, DatosDelTramiteARealizarComponent, ResponsableInspeccionEnPuntoComponent,
    MedioTransporteComponent, CarrosDeFerrocarrilComponent, HistorialInspeccionFisicaComponent
  ],
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Referencia al componente MedioTransporteComponent
   */
  @ViewChild(MedioTransporteComponent) medioTransporteComponent!: MedioTransporteComponent;
 /**
  * Referencia al componente DatosDelTramiteARealizarComponent
  *  */ 
@ViewChild(DatosDelTramiteARealizarComponent)
datosTramite!: DatosDelTramiteARealizarComponent;
/**
 * Referencia al componente ResponsableInspeccionEnPuntoComponent
 */
@ViewChild(ResponsableInspeccionEnPuntoComponent)
responsableInsp!: ResponsableInspeccionEnPuntoComponent;
/**
 * Referencia al componente MedioTransporteComponent
 */
@ViewChild(MedioTransporteComponent)
medioTransporte!: MedioTransporteComponent;

  /**
   * Constantes de texto.
   */
  TEXTOS = TEXTOS;

  /**
   * Formulario para los datos de la solicitud.
   */
  form!: FormGroup;
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
  /** Información del catálogo para la selección del medio de transporte. */
  mediodetransporte: CatalogosSelect = {} as CatalogosSelect;

   /** Encabezados y datos para mostrar información de solicitud */
  hSolicitud: string[] = [ 'Fecha Creación',
             'Mercancía', 'Cantidad', 'Proovedor'];


  /**
   * Datos de las solicitudes.
   */
  dSolicitud: Solicitud[] = [];

  /**
   * Rango de días seleccionados.
   */
  selectRangoDias: string[] = [];

  /**
   * Formulario de datos de la solicitud.
   */
  datosDelaSolicitud!: FormGroup;

  /**
   * Lista de solicitudes.
   */
  solicitudes: Solicitud[] = [];

  /** Datos de vagones e historial de inspección física. */
  hCarroFerrocarril: string[] = ['Número de parcialidad/remesa','Cantidad de carros de ferrocarril'];
  /**
   * Lista de objetos que representan los carros de ferrocarril.
   */
  dCarrosDeFerrocarril: CarrosDeFerrocarril[] = [];

   /** Encabezados y datos para mostrar información de historial de inspección física. */
  hHistorialinspeccion: string[] = ['Número parcialidad/remesa','Fracción arancelaria','Nico','Cantidad total en UMT','Cantidad parcial en UTM','Saldo pendiente','Fecha de ingreso'];
  
/**
   * @property {number} procedimiento
   * @description
   * Almacena el identificador del procedimiento actual, asignado a partir de la
   * constante `PROCEDURE_ID`.
   * Se utiliza para asociar la lógica y las operaciones del componente con el
   * trámite correspondiente.
   *
   * @default PROCEDURE_ID (220501)
   */
  procedimiento: number = 220501;
  /**
   * Lista de objetos que representan el historial de inspecciones físicas.
   */
  dHistorialInspecciones: HistorialInspeccionFisica[] = [];

  /**
   * Indica si se debe mostrar la sección.
   */
  mostrarSeccion: boolean = true;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  formularioDeshabilitado: boolean = false;

  /**
   * Bandera que indica si la solicitud está en modo solo lectura.
   * @type {boolean}
   */
  esSolicitud: boolean = false;

  /**
   * Indica si el formulario es válido.
   */
  formValida!: boolean;

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios.
   * @param solicitudService Servicio para gestionar las pantallas de solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudPantallasService,
    private consultaioQuery: ConsultaioQuery,
    private solicitud220501Store: Solicitud220501Store,
     private solicitudQuery: Solicitud220501Query,
    private revisionService: RevisionService,
     private NOTIF: NotificacionesService,
      public solicitud220501Query: Solicitud220501Query,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.esSolicitud = seccionState.create;
          if(seccionState.readonly || seccionState.update){
             this.inicializarEstadoFormulario();
          }
        })
      )
      .subscribe();

    this.crearFormulario();

  }
  ngOnInit(): void {
         this.getTablaSolicitud()
        this.getMediosDeTransporte()
    this.solicitudQuery.certificadosAutorizados$.subscribe(value => {
        if (value) {
          if(this.solicitud220501Query.getValue().mercanciaLista[0]?.num_permiso_importacion!==value){
              this.getMercancia(String(value))

          }
          else{
             this.mercanciaLista=this.solicitud220501Query.getValue().mercanciaLista
          }
        
           this.getHistInspFisica(String(value))
           this.obtenerHistorialCarrosFerrocarri(String(value))
        }
      })

  } 

  /**
   * Método para inicializar el estado del formulario.
   * Si `formularioDeshabilitado` es `true`, deshabilita el formulario,
   * de lo contrario, lo habilita.
   */
  inicializarEstadoFormulario(): void {
   
    if (this.formularioDeshabilitado) {
      this.form?.disable();
    } else if (!this.formularioDeshabilitado) {
      this.form?.enable();
    }
  }

  /**
   * Método para crear el formulario de la solicitud.
   */
  crearFormulario(): void {
    this.form = this.fb.group({});
  }


  /**
   * Método para manejar el evento de selección de transporte.
   * @param value Valor booleano que indica si se debe mostrar la sección.
   */
  onTransporteSeleccionado(value: boolean): void {
    this.mostrarSeccion = value;
    this.solicitud220501Store.setMostrarSeccion(value);
  }

  /**
   * Método para validar el formulario.
   * @returns {boolean} Verdadero si el formulario es válido, falso en caso contrario.
   */
validarFormulario(): boolean {

  const MEDIOFORM= this.medioTransporteComponent.grupoFormularioPadre.get(
    this.medioTransporteComponent.claveDeControl
  ) as FormGroup;

  if (
    this.form.invalid ||
    !this.medioTransporteComponent.validarFormularioMedioTransporte()
  ) {
    this.formValida = true;
    this.form.markAllAsTouched();
    MEDIOFORM?.markAllAsTouched();
    return false;
  }

  this.formValida = this.form.valid;
  return this.form.valid;
}

/**
 * Marca todos los controles de los subcomponentes como tocados.
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
 * Verifica si todos los formularios de los subcomponentes son válidos.
 * @returns {boolean} Verdadero si todos los formularios son válidos, falso en caso contrario.
 */
get formValid(): boolean {
  return (
    (this.datosTramite?.grupoFormularioPadre?.valid ?? false) &&
    (this.responsableInsp?.grupoFormularioPadre?.valid ?? false) &&
    (this.medioTransporte?.grupoFormularioPadre?.valid ?? false)
  );
}

  /**
 * Método asíncrono para obtener la lista de mercancías asociadas a un certificado.
 * Utiliza la función del servicio `getDatosMercancia` y convierte el Observable en una Promesa.
 */
  public getMercancia(certificado: string): void {
  this.revisionService
    .getDatosMercancia(certificado)
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
  /**
 * Selecciona una mercancía y la agrega a la lista en el store.
 * @param item Objeto de tipo MercanciaTabla que será agregado a la lista.
 */
seleccionarMercancia(item: MercanciaTabla[]): void {
  this.solicitud220501Store.setMercanciaLista(item);
}
    // Obtiene el catálogo de medios de transporte y lo asigna al template correspondiente
       async getMediosDeTransporte(): Promise<void> {
      try {
        const DATA = await firstValueFrom(this.revisionService.getMediosDeTransporte().pipe(takeUntil(this.destroyed$)));
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
  this.revisionService
    .obtenerHistorialCarrosFerrocarri(certificado)
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
 * Obtiene el historial de inspección física desde el servicio
 * y agrega el arreglo `tbodyData` para mostrar los datos en la tabla.
 */
  getHistInspFisica(certificado: string): void {
  this.revisionService
    .getHistorialInspeccionFisica(certificado)
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
// Obtiene la tabla de solicitudes y la asigna a dSolicitud
 public getTablaSolicitud(): void {          
  this.revisionService
    .getTablaSolicitud()
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
    * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
    * Desuscribe el componente de todos los observables.
    * @returns {void}
    */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
