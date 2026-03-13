import { Catalogo, ConsultaioQuery } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent,CatalogosSelect } from '@libs/shared/data-access-user/src';
import { ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Subject,distinctUntilChanged, filter, } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { DatosDelTramiteRealizar } from '../../models/solicitud-pantallas.model';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { InputFecha } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@ng-mf/data-access-user';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PagoDeDerechoComponent } from '../../../../shared/components/pago-de-derecho/pago-de-derecho.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud220503Query } from '../../estados/tramites220503.query';
import { Solicitud220503State } from '../../estados/tramites220503.store';
import { Solicitud220503Store } from '../../estados/tramites220503.store';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente para gestionar los datos del trámite a realizar.
 */
@Component({
  selector: 'app-datos-del-tramite-a-realizar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (): ControlContainer =>
        inject<ControlContainer>(ControlContainer, { skipSelf: true }),
    },
  ],
  providers: [SolicitudPantallasService],
  templateUrl: './datos-del-tramite-a-realizar.component.html',
  styleUrl: './datos-del-tramite-a-realizar.component.scss',
})
/** Componente para gestionar los datos del trámite a realizar */
export class DatosDelTramiteARealizarComponent implements OnInit, OnDestroy {
  /**
   * Clave de entrada utilizada para identificar el control dentro del grupo de formulario principal.
   */
  @Input() claveDeControl: string = '';

  /**
   * Inyecta el contenedor de control del formulario principal.
   */
  parentContainer = inject(ControlContainer);

  /**
   * Getter para acceder al grupo de formularios principal.
   */
  get grupoFormularioPadre(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  configuracionFechaFinVigencia: InputFecha = {
    labelNombre: 'Fecha de Inicio de Vigencia',
    required: true,
    habilitado: true,
  };

  /**
   * Opciones de selección de formulario para diferentes datos del catálogo.
   */
  certificadosAutorizados: CatalogosSelect = {} as CatalogosSelect;

  /** Opciones de selección de formulario para diferentes datos del catálogo. */
  horaDeInspeccion: CatalogosSelect = {} as CatalogosSelect;

  /** Opciones de selección de formulario para diferentes datos del catálogo. */
  aduanaDeIngreso: CatalogosSelect = {} as CatalogosSelect;

  /** Opciones de selección de formulario para diferentes datos del catálogo. */
  sanidadAgropecuaria: CatalogosSelect = {} as CatalogosSelect;

  /** Opciones de selección de formulario para diferentes datos del catálogo. */
  puntoDeInspeccion: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Campo de entrada de fecha inicializado con la constante FECHA_INSPECCION.
   */
  fechaInicioInput: InputFecha = {
    labelNombre: 'Fecha de Inicio de Vigencia',
    required: false,
    habilitado: false,
  };

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();
/**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;
  /**
   * Estado de la solicitud para gestionar los datos relacionados con la solicitud 220502.
   * Se inicializa como un objeto vacío con la estructura de `Solicitud220503State`.
   */
  Solicitud220503State: Solicitud220503State = {} as Solicitud220503State;

  /** Constructor para inyectar el servicio de solicitud de pantallas. */
  constructor(
    private solicitudService: SolicitudPantallasService,
    private Solicitud220503Store: Solicitud220503Store,
    private Solicitud220503Query: Solicitud220503Query,
    private cdRef: ChangeDetectorRef,
      private consultaioQuery: ConsultaioQuery,
       private NOTIF: NotificacionesService
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
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }

  /**
   * Gancho de ciclo de vida que inicializa los controles de formulario cuando se carga el componente.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.getHorasInspeccionData('220503')
    this.getAduanaIngresoData('220503')
    this.getCertificadosPendientes('220503')
    this.setupStateListener();
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
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
this.datosServicio.disable();
      } else if (!this.esFormularioSoloLectura) {
      this.datosServicio.enable();
      } else {
        // No se requiere ninguna acción en el formulario
      }
  }
    /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    if (this.claveDeControl) {
      this.grupoFormularioPadre.addControl(
        this.claveDeControl,
        new FormGroup({
          certificadosAutorizados: new FormControl(
            this.Solicitud220503State.certificadosAutorizados || '',
            [Validators.required]
          ),
          horaDeInspeccion: new FormControl(
            this.Solicitud220503State.horaDeInspeccion || '',
            [Validators.required]
          ),
          aduanaDeIngreso: new FormControl(
            this.Solicitud220503State.aduanaDeIngreso || '',
       
          ),
          sanidadAgropecuaria: new FormControl(
            this.Solicitud220503State.sanidadAgropecuaria || '',
          ),
          puntoDeInspeccion: new FormControl(
            this.Solicitud220503State.puntoDeInspeccion || '',

          ),
          fechaDeInspeccion: new FormControl(
            this.Solicitud220503State.fechaDeInspeccion || PagoDeDerechoComponent.formatDate(),
             [Validators.required]
            ),
        })
      );
    this.actualizarDatosIniciales();
      this.Solicitud220503Query.selectSolicitud$
        .pipe(
          takeUntil(this.destroyed$),
          map((res: Solicitud220503State) => {
            this.Solicitud220503State = res;
            const FORM_GROUP = this.grupoFormularioPadre.get(
              this.claveDeControl
            ) as FormGroup;

            if (FORM_GROUP) {
              FORM_GROUP.patchValue({
                certificadosAutorizados:
                  this.Solicitud220503State.certificadosAutorizados || '',
                horaDeInspeccion: this.Solicitud220503State.horaDeInspeccion || '',
                aduanaDeIngreso: this.Solicitud220503State.aduanaDeIngreso || '',
                sanidadAgropecuaria:
                  this.Solicitud220503State.sanidadAgropecuaria || '',
                puntoDeInspeccion: this.Solicitud220503State.puntoDeInspeccion || '',
                fechaDeInspeccion: this.Solicitud220503State.fechaDeInspeccion || '',
              });
            }
          })
        )
        .subscribe();
    }
  }

  /**
   * Maneja la selección de 'Certificados Autorizados' y actualiza el control del formulario.
   * @param e El artículo del catálogo seleccionado.
   */
  certificadosSeleccion(e: Catalogo): void {
    this.actualizarFormValue('certificadosAutorizados', e.descripcion);
  }

  /**
   * Maneja la selección de 'Hora de Inspección' y actualiza el control del formulario.
   * @param e El artículo del catálogo seleccionado.
   */
  horaDeSeleccion(e: Catalogo): void {
    this.actualizarFormValue('horaDeInspeccion', e.descripcion);
  }

  /**
   * Maneja la selección de 'Aduana de Ingreso' y actualiza el control del formulario.
   * @param e El artículo del catálogo seleccionado.
   */
  aduanaDeSeleccion(e: Catalogo): void {
    this.actualizarFormValue('aduanaDeIngreso', e.descripcion);
  }

  /**
   * Maneja la selección de 'Sanidad Agropecuaria' y actualiza el control del formulario.
   * @param e El artículo del catálogo seleccionado.
   */
  sanidadSeleccion(e: Catalogo): void {
    this.actualizarFormValue('sanidadAgropecuaria', e.descripcion);
  }

  /**
   * Maneja la selección de 'Punto de Inspección' y actualiza el control del formulario.
   * @param e El artículo del catálogo seleccionado.
   */
  puntoDeSeleccion(e: Catalogo): void {
    this.actualizarFormValue('puntoDeInspeccion', e.descripcion);
  }

  /**
   * Actualiza un control de formulario específico con un nuevo valor.
   * @param nombreDeControl El nombre del control a actualizar.
   * @param value El nuevo valor a establecer.
   */
  private actualizarFormValue(nombreDeControl: string, value: string): void {
    if (
      this.claveDeControl &&
      this.grupoFormularioPadre.contains(this.claveDeControl)
    ) {
      this.grupoFormularioPadre.controls[this.claveDeControl].patchValue({
        [nombreDeControl]: value,
      });
    }
  }

  /**
   * Actualiza los datos iniciales de los campos del formulario según la información proporcionada.
   *
   * @param data - El objeto de datos que contiene valores para diferentes campos de catálogo.
   */
  actualizarDatosIniciales(): void {
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

    this.certificadosAutorizados = CATALOGOTEMPLATE(
      'Certificados autorizados pendientes',
      true,
    []
    );
    this.horaDeInspeccion = CATALOGOTEMPLATE(
      'Hora de inspección',
      true,
     []
    );
    this.aduanaDeIngreso = CATALOGOTEMPLATE(
      'Aduana de ingreso',
      false,
  []
    );
    this.sanidadAgropecuaria = CATALOGOTEMPLATE(
      'Oficina de inspección de Sanidad Agropecuaria',
      false,
      []
    );
    this.puntoDeInspeccion = CATALOGOTEMPLATE(
      'Punto de inspección',
      false,
     []
    );
    this.cdRef.detectChanges();
  }

  /**
   * Carga datos del catálogo inicial para las selecciones de formulario.
   */


  /**
   * Getter para acceder al grupo de formularios 'datosServicio'.
   */
  get datosServicio(): FormGroup {
    return this.grupoFormularioPadre.get('datosServicio') as FormGroup;
  }

  /**
   * Maneja los cambios en el campo de fecha de inicio.
   * @param nuevo_valor El nuevo valor de fecha seleccionado.
   */
  cambioFechaInicio(nuevo_valor: string): void {
    this.Solicitud220503Store.setFechaDeInspeccion(nuevo_valor);
  }
  /**
   * Establece los certificados autorizados en el estado de la solicitud.
   * @param event Objeto de tipo Catalogo que contiene el ID del certificado autorizado.
   */
  setCertificadosAutorizados(event: Catalogo): void {
    this.Solicitud220503Store.setCertificadosAutorizados(event.clave??'');
    this.getCertificadoDatos('220503',event.clave??'')
  }

  /**
   * Define la hora de inspección en la solicitud.
   * @param event Objeto de tipo Catalogo que contiene el ID de la hora de inspección.
   */
  setHoraDeInspeccion(event: Catalogo): void {
    this.Solicitud220503Store.setHoraDeInspeccion(event.clave??"");
  }

  /**
   * Asigna la aduana de ingreso en el estado de la solicitud.
   * @param event Objeto de tipo Catalogo que contiene el ID de la aduana de ingreso.
   */
  setAduanaDeIngreso(event: Catalogo): void {
    this.Solicitud220503Store.setAduanaDeIngreso(event.clave??'');
  }

  /**
   * Establece la sanidad agropecuaria en la solicitud.
   * @param event Objeto de tipo Catalogo que contiene el ID de la sanidad agropecuaria.
   */
  setSanidadAgropecuaria(event: Catalogo): void {
    this.Solicitud220503Store.setSanidadAgropecuaria(event.clave??"");
  }

  /**
   * Define el punto de inspección en la solicitud.
   * @param event Objeto de tipo Catalogo que contiene el ID del punto de inspección.
   */
  setPuntoDeInspeccion(event: Catalogo): void {
    this.Solicitud220503Store.setPuntoDeInspeccion(event.clave??'');
  }
validarFormularios():boolean{
if(this.grupoFormularioPadre.valid){
  return true;
}
  this.grupoFormularioPadre.markAllAsTouched();
  return false;

}
/**
 * Carga el catálogo de horas de inspección desde el servicio
 * y asigna los datos a la propiedad del componente.
 *
 * @param tramite - Identificador del trámite.
 */
getHorasInspeccionData(tramite: string): void {
  this.solicitudService
    .getHorasInspeccionData(tramite)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.horaDeInspeccion.catalogos = data.datos;
    });
}

/**
 * Carga el catálogo de aduanas de ingreso y asigna los datos
 * a la propiedad correspondiente del componente.
 *
 * @param tramite - Identificador del trámite.
 */
getAduanaIngresoData(tramite: string): void {
  this.solicitudService
    .getAduanaIngresoData(tramite)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.aduanaDeIngreso.catalogos = data.datos;
    });
}

/**
 * Carga el catálogo de certificados pendientes y asigna los datos
 * a la propiedad correspondiente del componente.
 *
 * @param tramite - Identificador del trámite.
 */
getCertificadosPendientes(tramite: string): void {
  this.solicitudService
    .getCertificadosPendientes(tramite)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.certificadosAutorizados.catalogos = data.datos;
    });
}
// Evento que enviará información al componente padre
// - En éxito: clave + medioDeTransporte
// - En error: solo clave
@Output() certificadoResultado = new EventEmitter<{
  clave: string;
  medioDeTransporte?: string;
}>();
/**
 * Carga los datos de un certificado y los asigna
 * a la propiedad correspondiente del componente.
 *
 * @param tramite - Identificador del trámite.
 * @param clave - Clave o identificador del certificado.
 */
getCertificadoDatos(tramite: string, clave: string): void {
  this.solicitudService
    .getCertificadoDatos(tramite, clave)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {

      //  Caso de error: el servicio no respondió correctamente
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });

        // Se emite únicamente la clave al componente padre
        this.certificadoResultado.emit({ clave });
        return;
      }

      //  Caso de éxito: se procesa la información recibida
      const FORM_GROUP = this.grupoFormularioPadre.get(
        this.claveDeControl
      ) as FormGroup;

      // Se asigna la aduana de ingreso al formulario
      FORM_GROUP?.get('aduanaDeIngreso')
        ?.setValue(data?.datos?.aduana_de_ingreso);

      // Se guarda la aduana de ingreso en el store
      this.Solicitud220503Store.setAduanaDeIngreso(
        data?.datos?.aduana_de_ingreso
      );

      // Se cargan las oficinas de inspección según la aduana
      this.getOficinasInspeccionSanidadData(
        '220503',
        data?.datos?.aduana_de_ingreso,
        data?.datos?.ofic_de_insp_agro
      );

      // Se cargan los puntos de inspección
      this.getPuntosInspeccionData(
        '220503',
        data?.datos?.ofic_de_insp_agro,
        data?.datos?.punto_de_inspeccion
      );

      // Se emite al componente padre la clave y el medio de transporte
      this.certificadoResultado.emit({
        clave,
        medioDeTransporte: data?.datos?.medio_de_transporte
      });

      // Se guarda la identificación de transporte en el store
      this.Solicitud220503Store.setIdentificacionTransporte(data?.datos?.ident_de_transporte??'');
    });
}

/**
 * Carga el catálogo de oficinas de inspección de sanidad y,
 * adicionalmente, asigna el valor de la aduana de ingreso
 * al control correspondiente del formulario.
 *
 * @param tramite - Identificador del trámite.
 * @param clave - Clave utilizada para consultar las oficinas.
 * @param aduanaIngreso - Valor a asignar al control aduanaDeIngreso.
 */
getOficinasInspeccionSanidadData(
  tramite: string,
  clave: string,
  aduanaIngreso: string
): void {
  this.solicitudService
    .getOficinasInspeccionSanidadData(tramite, clave)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      // Asignar catálogo
      this.sanidadAgropecuaria.catalogos = data.datos;


      // Asignar aduana de ingreso al formulario
      const FORM_GROUP = this.grupoFormularioPadre.get(
        this.claveDeControl
      ) as FormGroup;

      FORM_GROUP?.get('sanidadAgropecuaria')?.setValue(aduanaIngreso);
      this.Solicitud220503Store.setSanidadAgropecuaria(aduanaIngreso);
    });
}

/**
 * Carga el catálogo de puntos de inspección y asigna
 * el valor seleccionado al control puntoDeInspeccion del formulario.
 *
 * @param tramite - Identificador del trámite.
 * @param clave - Clave de la oficina OISA.
 * @param puntoInspeccion - Valor a asignar al control del formulario.
 */
getPuntosInspeccionData(
  tramite: string,
  clave: string,
  puntoInspeccion: string
): void {
  this.solicitudService
    .getPuntosInspeccionData(tramite, clave)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      // Asignar catálogo
      this.puntoDeInspeccion.catalogos = data.datos;

      // Asignar valor al formulario
      const FORM_GROUP = this.grupoFormularioPadre.get(
        this.claveDeControl
      ) as FormGroup;
 this.Solicitud220503Store.setPuntoDeInspeccion(puntoInspeccion);
      FORM_GROUP?.get('puntoDeInspeccion')?.setValue(puntoInspeccion);
    });
}

/**
 * Escucha cambios en el Store para hidratar el formulario automáticamente.
 */
private setupStateListener(): void {
  this.Solicitud220503Query.selectSolicitud$
    .pipe(
      takeUntil(this.destroyed$),       
      map(state => state.certificadosAutorizados),
   distinctUntilChanged((prev, curr) => String(prev) === String(curr)),          
      filter(id => Boolean(id))   
    )
    .subscribe((certificateId) => {
      // Dispara la carga de datos y catálogos dependientes
      this.getCertificadoDatos('220503', certificateId.toString());
    });
}
  /**
   * Gancho de ciclo de vida para limpiar los controles de formulario cuando se destruye el componente.
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Desuscribe el componente de todos los observables.
   * @returns {void}
   */
  ngOnDestroy(): void {
    if (
      this.claveDeControl &&
      this.grupoFormularioPadre.contains(this.claveDeControl)
    ) {
      this.grupoFormularioPadre.removeControl(this.claveDeControl);
    }
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
