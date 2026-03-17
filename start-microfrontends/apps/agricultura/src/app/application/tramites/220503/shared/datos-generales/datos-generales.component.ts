import {
  CAPTURA_OPCIONES_DE_BOTON_DE_RADIO,
  CONFIGURACION_COLUMNAS_TABLA,
  MERCANCIA,
} from '../../enums/sagarpa.enum';
import {
  CatalogoSelectComponent,
  CatalogosSelect,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatosGeneralesRevision, RevisionService } from '../../services/revision.service';
import {forkJoin,map,takeUntil} from 'rxjs';

import { Catalogo } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';

import{ ConsultaioQuery} from '@ng-mf/data-access-user'
import { FOLIODELLBL } from '../../constantes/importador-exportador.enum';
import { FilaSolicitudTabla } from '../../models/datos-generales.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


import { Solicitud220503Query } from '../../estados/tramites220503.query';
import { Solicitud220503State } from '../../estados/tramites220503.store';
import { Solicitud220503Store } from '../../estados/tramites220503.store';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { Subject } from 'rxjs';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Validators } from '@angular/forms';


/**
 * Componente para gestionar los datos generales.
 */
@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent
    
  ],
})
export class DatosGeneralesComponent implements OnInit, OnDestroy,OnChanges {
  @Input() isActive: boolean = false;
   @Input() datosGeneralesRevision!:DatosGeneralesRevision ;



 
  /**
   * Formulario principal.
   * @type {FormGroup}
   */
  forma!: FormGroup;

  /**
   * Se asigna el valor de `FOLIODELLBL` a la variable `foliodelLbl`.
   * Esto permite utilizar la constante `FOLIODELLBL` en la lógica del código.
   */
  foliodelLbl = FOLIODELLBL;

  /**
   * Opciones de rango de días.
   * @type {string[]}
   */
  selectRangoDias: string[] = [];

  /**
   * Indica si el contenido es colapsable.
   * @type {boolean}
   */
  colapsable: boolean = false;

  /**
   * Formulario de datos de la solicitud.
   * @type {FormGroup}
   */
  datosDelaSolicitud!: FormGroup;

  /**
   * Dirección actual de rotación.
   * @type {number | null}
   */
  currentDirection: number | null = 1;

  /**
   * Datos del dropdown.
   * @type {any[]}
   */
  dropdownData = [];

  /**
   * Selección de aduana de ingreso.
   * @type {CatalogosSelect}
   */
  aduanaIngreso: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Selección de oficina de inspección.
   * @type {CatalogosSelect}
   */
  oficianaInspeccion: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Selección de punto de inspección.
   * @type {CatalogosSelect}
   */
  puntoInspeccion: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Selección de establecimiento.
   * @type {CatalogosSelect}
   */
  establecimiento: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Selección de régimen al que se destinarán.
   * @type {CatalogosSelect}
   */
  regimenDestinaran: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Selección de movilización nacional.
   * @type {CatalogosSelect}
   */
  movilizacionNacional: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Selección de punto de verificación.
   * @type {CatalogosSelect}
   */
  puntoVerificacion: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Selección de empresa transportista.
   * @type {CatalogosSelect}
   */
  empresaTransportista: CatalogosSelect = {} as CatalogosSelect;
  /**
   * Aduana de ingreso seleccionada.
   * @type {Catalogo}
   */
  aduanadeIngreso!: Catalogo;

  /**
   * Oficina de inspección seleccionada.
   * @type {Catalogo}
   */
  oficianadeInspeccion!: Catalogo;

  /**
   * Punto de inspección seleccionado.
   * @type {Catalogo}
   */
  puntodeInspeccion!: Catalogo;

  /**
   * Establecimiento seleccionado.
   * @type {Catalogo}
   */
  establecimientode!: Catalogo;

  /**
   * Régimen al que se destinarán las mercancías seleccionado.
   * @type {Catalogo}
   */
  regimendeDestinaran!: Catalogo;

  /**
   * Movilización nacional seleccionada.
   * @type {Catalogo}
   */
  movilizaciondeNacional!: Catalogo;

  /**
   * Punto de verificación seleccionado.
   * @type {Catalogo}
   */
  puntodeVerificacion!: Catalogo;

  /**
   * Empresa transportista seleccionada.
   * @type {Catalogo}
   */
  empresadeTransportista!: Catalogo;

  Solicitud220503State: Solicitud220503State = {} as Solicitud220503State;

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Variable para almacenar el valor de la opción seleccionada en el botón de radio.
   */
  esSolicitudFerrosValor!: string;

  /**
   * Variable que almacena las opciones disponibles para el botón de radio.
   */
  opcionDeBotonDeRadio = CAPTURA_OPCIONES_DE_BOTON_DE_RADIO;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;
  /**
   * Configuración de las columnas de la tabla.
   * @type {ConfiguracionColumna[]}
   */
  configuracionColumnasTabla= CONFIGURACION_COLUMNAS_TABLA;

  constructor(
    private readonly fb: FormBuilder,
    private revisionService: RevisionService,
    private validacionesService: ValidacionesFormularioService,
    public Solicitud220503Store: Solicitud220503Store,
    public Solicitud220503Query: Solicitud220503Query,
    private consultaioQuery: ConsultaioQuery,
      private solicitudService: SolicitudPantallasService,
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

  ngOnInit(): void {
      forkJoin([
    this.getAduanaIngreso('220503'),
    this.getEstablecimiento(),
    this.getRegimenDestinaran('220503'),
    this.getMovilizacionNacional('220503'),
    this.getPuntoVerificacion('220503'),
    this.getEmpresaTransportista()
  ]).subscribe(() => {
    this.inicializarEstadoFormulario(); 
  });

  }

ngOnChanges(changes: SimpleChanges): void {
  const REVISION_DATA = changes['datosGeneralesRevision']?.currentValue;

  if (REVISION_DATA) {
     const IDSOLICITUD = String(this.Solicitud220503Query.getValue().id_solicitud);

  this.getDatosGeneralesRevisionDocumental(
 '220503',
 IDSOLICITUD
)
   
    const { tramite: TRAMITE, transporte: TRANSPORTE, folio_tramite: FOLIO_TRAMITE } = REVISION_DATA;
    const TRAMITE_ID = '220503'; 

   
    if (TRAMITE.aduana) {
      this.getOficianaInspeccion(TRAMITE_ID, TRAMITE.aduana);
    }
    
    if (TRAMITE.oficina_inspeccion) {
      this.getPuntoInspeccion(TRAMITE_ID, TRAMITE.oficina_inspeccion);
    }

   
    this.Solicitud220503Store.update({
      foliodel: FOLIO_TRAMITE,
      aduanaIngreso: TRAMITE.aduana,
      oficinaInspeccion: TRAMITE.oficina_inspeccion,
      puntoInspeccion: TRAMITE.punto_inspeccion,
      regimen: TRAMITE.regimen,
      numeroguia: TRAMITE.numero_de_guia,
      movilizacion: TRANSPORTE.medio_transporte,
      transporte: TRANSPORTE.identificacion_transporte,
      punto: TRANSPORTE.punto_verificacion,
      nombreEmpresa: TRANSPORTE.razon_social
    });

    
    if (this.forma) {
      this.forma.patchValue({
        foliodel: FOLIO_TRAMITE,
        aduanaIngreso: TRAMITE.aduana,
        oficinaInspeccion: TRAMITE.oficina_inspeccion,
        puntoInspeccion: TRAMITE.punto_inspeccion,
        regimen: TRAMITE.regimen,
        numeroguia: TRAMITE.numero_de_guia,
        movilizacion: TRANSPORTE.medio_transporte,
        transporte: TRANSPORTE.identificacion_transporte,
        punto: TRANSPORTE.punto_verificacion,
        nombreEmpresa: TRANSPORTE.razon_social
      }, { emitEvent: false }); 
    }
  }
}

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
 this.forma = this.fb.group({
      foliodel: [
        { value: this.Solicitud220503State.fetchapago || '', disabled: true },
      ],
      aduanaIngreso: [
        this.Solicitud220503State.aduanaIngreso || '',
        Validators.required, 
      ],
      oficinaInspeccion: [
        this.Solicitud220503State.oficinaInspeccion || '',
        Validators.required,
      ],
      puntoInspeccion: [
        this.Solicitud220503State.puntoInspeccion || '',
        Validators.required,
      ],
      claveUCON: [
        { value: this.Solicitud220503State.claveUCON || '', disabled: true },
      ],
      establecimientoTIF: [
        this.Solicitud220503State.establecimientoTIF || '',
        Validators.required,
      ],
      nombre: [this.Solicitud220503State.nombre || '', Validators.required],
      numeroguia: [
        { value: this.Solicitud220503State.numeroguia || '', disabled: true },
        Validators.required,
      ],
      regimen: [this.Solicitud220503State.regimen || '', Validators.required],

      movilizacion: [
        this.Solicitud220503State.movilizacion || '',
        Validators.required,
      ],
      transporte: [
        { value: this.Solicitud220503State.transporte || '', disabled: true },
      ],
      punto: [this.Solicitud220503State.punto || '', [Validators.required]],
      nombreEmpresa: [
        this.Solicitud220503State.nombreEmpresa || '',
        Validators.required,
      ],
    });
this.forma.disable();
    this.Solicitud220503Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((data: Solicitud220503State) => {
          this.Solicitud220503State = data;
          this.forma.patchValue({
            foliodel: this.Solicitud220503State.foliodel || '',
            aduanaIngreso: this.Solicitud220503State.aduanaIngreso || '',
            oficinaInspeccion: this.Solicitud220503State.oficinaInspeccion || '',
            puntoInspeccion: this.Solicitud220503State.puntoInspeccion || '',
            claveUCON: this.Solicitud220503State.claveUCON || '',
            establecimientoTIF: this.Solicitud220503State.establecimientoTIF || '',
            nombre: this.Solicitud220503State.nombre || '',
            numeroguia: this.Solicitud220503State.numeroguia || '',
            regimen: this.Solicitud220503State.regimen || '',
            movilizacion: this.Solicitud220503State.movilizacion || '',
            transporte: this.Solicitud220503State.transporte || '',
            punto: this.Solicitud220503State.punto || '',
            nombreEmpresa: this.Solicitud220503State.nombreEmpresa || '',
          });
        })
      )
      .subscribe();


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
        this.forma.disable();
      } 
  }

  /**
   * Método para actualizar los datos de la solicitud.
   * Realiza una llamada al servicio `getDatosDelaSolicitud()` para obtener los datos
   * y luego actualiza el store con la respuesta recibida.
   */
  actualizarDatosDelaSolicitud(): void {
    this.revisionService
      .getDatosDelaSolicitud()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: Solicitud220503State) => {
          this.Solicitud220503Store.setFoliodel(resp.foliodel);
          this.Solicitud220503Store.setClaveUCON(resp.claveUCON);
          this.Solicitud220503Store.setEstablecimientoTIF(
            resp.establecimientoTIF
          );
          this.Solicitud220503Store.setNombre(resp.nombre);
          this.Solicitud220503Store.setNumeroguia(resp.numeroguia);
          this.Solicitud220503Store.setTransporte(resp.transporte);
          this.Solicitud220503Store.setNombreEmpresa(resp.nombreEmpresa);
        },
      });
  }

  /**
   * Filas de datos.
   * @type {Row[]}
   */
  tablaFilaDatos: FilaSolicitudTabla[] = [];

  /**
   * Muestra u oculta el contenido colapsable.
   * @returns {void}
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }
  /**
   * Índice actual de la fila.
   * @type {number}
   */
  currentIndex = 0;


  /**
   * Verifica si un campo del formulario es válido.
   * @param {FormGroup} form - El formulario.
   * @param {string} field - El campo a verificar.
   * @returns {boolean} - Verdadero si el campo es válido, falso en caso contrario.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) === true;
  }

  /**
   * Obtiene la aduana de ingreso.
   * Este método llama al servicio de revisión para obtener la aduana de ingreso.
   * @returns {void}
   */
getAduanaIngreso(tramite: string): void {
  this.solicitudService
    .getAduanaIngresoData(tramite)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.aduanaIngreso = {
        labelNombre: 'Aduana de ingreso',
        required: false,
        primerOpcion: 'Selecciona un valor',
        catalogos: resp.datos,
      };
    });
}

  /**
   * Obtiene la oficina de inspección.
   * Este método llama al servicio de revisión para obtener la oficina de inspección.
   * @returns {void}
   */
getOficianaInspeccion(tramite: string, clave: string): void {
  this.solicitudService
    .getOficinasInspeccionSanidadData(tramite, clave)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.oficianaInspeccion = {
        labelNombre: 'Oficina de Inspección de Sanidad Agropecuaria',
        required: false,
        primerOpcion: 'Selecciona un valor',
        catalogos: resp.datos,
      };
    });
}

  /**
   * Obtiene el punto de inspección.
   * Este método llama al servicio de revisión para obtener el punto de inspección.
   * @returns {void}
   */
  getPuntoInspeccion(tramite: string, clave: string): void {
  this.solicitudService
    .getPuntosInspeccionData(tramite, clave)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.puntoInspeccion = {
        labelNombre: 'Punto de inspección',
        required: false,
        primerOpcion: 'Selecciona un valor',
        catalogos: resp.datos,
      };
    });
}

  /**
   * Obtiene el establecimiento.
   * Este método llama al servicio de revisión para obtener el establecimiento.
   * @returns {void}
   */
  getEstablecimiento(): void {
    this.revisionService
      .getEstablecimiento()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;

          this.establecimiento = {
            labelNombre: 'Establecimiento TIF',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }
  /**
   * Obtiene el régimen al que se destinarán las mercancías.
   * Este método llama al servicio de revisión para obtener el régimen.
   * @returns {void}
   */
 getRegimenDestinaran(tramite: string): void {
  this.revisionService
    .getRegimenDestinaran(tramite)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.regimenDestinaran = {
        labelNombre: 'Régimen al que se destinarán las mercancías',
        required: false,
        primerOpcion: 'Selecciona un valor',
        catalogos: resp.datos,
      };
    });
}

  /**
   * Obtiene la movilización nacional.
   * Este método llama al servicio de revisión para obtener la Datos para movilización nacional:.
   * @returns {void}
   */
 getMovilizacionNacional(tramite: string): void {
  this.solicitudService
    .getCatalogoMedioTransporte(tramite)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.movilizacionNacional = {
        labelNombre: 'Datos para movilización nacional',
        required: false,
        primerOpcion: 'Selecciona un valor',
        catalogos: resp.datos,
      };
    });
}

  /**
   * Obtiene el punto de verificación.
   * Este método llama al servicio de revisión para obtener el punto de verificación.
   * @returns {void}
   */
getPuntoVerificacion(tramite: string): void {
  this.revisionService
    .getPuntoVerificacion(tramite)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.puntoVerificacion = {
        labelNombre: 'Punto de verificación federal',
        required: false,
        primerOpcion: 'Selecciona un valor',
        catalogos: resp.datos,
      };
    });
}
  /**
   * Obtiene la empresa transportista.
   * Este método llama al servicio de revisión para obtener la empresa transportista.
   * @returns {void}
   */
  getEmpresaTransportista(): void {
    this.revisionService
      .getEmpresaTransportista()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;

          this.empresaTransportista = {
            labelNombre: 'Nombre de la empresa transportista',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

 
  /**
   * Selecciona una aduana de ingreso y actualiza el store con la descripción correspondiente.
   * @param event Objeto de tipo Catalogo que contiene la información de la aduana seleccionada.
   */
  seleccionarAduanaIngreso(event: Catalogo): void {
    this.Solicitud220503Store.setAduanaIngreso(event.id);
  }

  /**
   * Selecciona una oficina de inspección y actualiza el store con la descripción correspondiente.
   * @param event Objeto de tipo Catalogo que contiene la información de la oficina seleccionada.
   */
  seleccionarOficianaInspeccion(event: Catalogo): void {
    this.Solicitud220503Store.setOficinaInspeccion(event.id);
  }

  /**
   * Selecciona un punto de inspección y actualiza el store con la descripción correspondiente.
   * @param event Objeto de tipo Catalogo que contiene la información del punto seleccionado.
   */
  seleccionarPuntoInspeccion(event: Catalogo): void {
    this.Solicitud220503Store.setPuntoInspeccion(event.id);
  }

  /**
   * Método para seleccionar el régimen de la solicitud.
   * Actualiza el estado con el ID del régimen seleccionado.
   *
   * @param event - Objeto de tipo Catalogo que contiene la información del régimen seleccionado.
   */
  seleccionarRegimen(event: Catalogo): void {
    this.Solicitud220503Store.setRegimen(event.id);
  }

  /**
   * Selecciona una movilización nacional y actualiza el store con la descripción correspondiente.
   * @param event Objeto de tipo Catalogo que contiene la información de la movilización seleccionada.
   */
  seleccionarMovilizacionNacional(event: Catalogo): void {
    this.Solicitud220503Store.setMovilizacion(event.id);
  }

  /**
   * Método para seleccionar el punto de verificación.
   * Actualiza el estado con el ID del punto seleccionado.
   *
   * @param event - Objeto de tipo Catalogo que contiene la información del punto de verificación seleccionado.
   */
  seleccionarPuntoVerificacion(event: Catalogo): void {
    this.Solicitud220503Store.setPunto(event.id);
  }
getDatosGeneralesRevisionDocumental(
  tramite: string,
  certificado: string
): void {
  this.revisionService
    .getDatosGeneralesRevisionDocumental(tramite, certificado)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

    
      this.tablaFilaDatos = resp.datos.map((item) => ({
        Partida: item.numero_partida,
        Tiporequisito: item.tipo_requisito,
        Requisito: item.requisito,
        Certificado: item.num_cert_intern,
        Fraccion: item.fraccion_arancelaria,
        Descripcion: item.desc_de_la_frac,
        Nico: item.nico,
      }));
    });
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
