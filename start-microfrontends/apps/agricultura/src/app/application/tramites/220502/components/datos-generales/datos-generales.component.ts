import {
  ADUANA_INGRESO,
  CONFIGURACION_MERCANCIAS_COLUMNAS,
  EMPRESA_TRANSPORTISTA,
  ESTABLECIMIENTO,
  MERCANCIAS_LISTA,
  MOVILIZACION_NACIONAL,
  OFICIANA_INSPECCION,
  PUNTO_INSPECCION,
  PUNTO_VERIFICACION,
  REGIMEN_DESTINARAN,
} from '../../constantes/constantes';
import {
  Catalogo,
  CatalogosSelect,
  ConfiguracionColumna,
  ConsultaioQuery,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import { CatalogoSelectComponent, InputRadioComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud220502State, Solicitud220502Store } from '../../estados/tramites220502.store';
import { Subject, firstValueFrom, map, takeUntil } from 'rxjs';
import { CAPTURA_OPCIONES_DE_BOTON_DE_RADIO } from '../../enums/sagarpa.enum';
import { CommonModule } from '@angular/common';
import { MercanciasLista } from '../../models/datos-generales.model';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { Solicitud220502Query } from '../../estados/tramites220502.query';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';



/**
 * Componente para gestionar los datos generales.
 */
@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss'],
  standalone: true,
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    InputRadioComponent,
    CommonModule,
    TablaDinamicaComponent,
  ],
})
export class DatosGeneralesComponent implements OnDestroy {
  /**
   * Formulario principal.
   * @type {FormGroup}
   */
  forma!: FormGroup;

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
  direccionActual: number | null = 1;

  /**
   * Datos del dropdown.
   * @type {any[]}
   */
  dropdownData = [];

  /**
   * Selección de aduana de ingreso.
   * @type {CatalogosSelect}
   */
  aduanaIngreso: CatalogosSelect = ADUANA_INGRESO;

  /**
   * Selección de oficina de inspección.
   * @type {CatalogosSelect}
   */
  oficianaInspeccion: CatalogosSelect = OFICIANA_INSPECCION;

  /**
   * Selección de punto de inspección.
   * @type {CatalogosSelect}
   */
  puntoInspeccion: CatalogosSelect = PUNTO_INSPECCION;

  /**
   * Selección de establecimiento.
   * @type {CatalogosSelect}
   */
  establecimiento: CatalogosSelect = ESTABLECIMIENTO;

  /**
   * Selección de régimen al que se destinarán.
   * @type {CatalogosSelect}
   */
  regimenDestinaran: CatalogosSelect = REGIMEN_DESTINARAN;

  /**
   * Selección de movilización nacional.
   * @type {CatalogosSelect}
   */
  movilizacionNacional: CatalogosSelect = MOVILIZACION_NACIONAL;

  /**
   * Selección de punto de verificación.
   * @type {CatalogosSelect}
   */
  puntoVerificacion: CatalogosSelect = PUNTO_VERIFICACION;

  /**
   * Selección de empresa transportista.
   * @type {CatalogosSelect}
   */
  empresaTransportista: CatalogosSelect = EMPRESA_TRANSPORTISTA;
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

  /**
   * Estado de la solicitud 220502.
   * @type {Solicitud220502State}
   */
  solicitud220502State: Solicitud220502State = {} as Solicitud220502State;

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Variable para almacenar el opción de la opción seleccionada en el botón de radio.
   */
  esSolicitudFerrosopción!: string;

  /**
   * Variable que almacena las opciones disponibles para el botón de radio.
   */
  opcionDeBotonDeRadio = CAPTURA_OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Indica si el formulario está deshabilitado.
   */
  formularioDeshabilitado: boolean = true;

  /**
   * Índice actual de la fila.
   * @type {number}
   */
  indiceActual = 0;

  /**
   * Indica si la solicitud está relacionada con ferrocarril.
   *
   * - `0`: No es una solicitud ferroviaria.
   * - `1`: Es una solicitud ferroviaria.
   */
  esSolicitudFerrosValor: number = 0;

  /**
   * Tipo de selección de la tabla.
   * En este caso, se utiliza un checkbox para la selección de elementos.
   */
  tipoSeleccionTabla = TablaSeleccion.UNDEFINED;

  /**
   * Configuración de las columnas de la tabla.
   * Define el encabezado, la clave de acceso a los datos y el orden de las columnas.
   */
  configuracionColumnas: ConfiguracionColumna<MercanciasLista>[] =
    CONFIGURACION_MERCANCIAS_COLUMNAS;

  /**
   * Lista de pagos de derechos asociados a la solicitud.
   * Se inicializa como un array vacío con la estructura de `PagoDerechosLista`.
   */
  mercanciasLista: MercanciasLista[] =[];

  /**
   * @constructor
   * Inyecta los servicios necesarios para la creación y validación de formularios,
   * así como para la gestión y consulta del estado de la solicitud 220502.
   *
   * @param fb - Servicio `FormBuilder` para crear y manejar formularios reactivos.
   * @param solicitudPantallasService - Servicio para gestionar la información de las solicitudes en las pantallas.
   * @param validacionesService - Servicio para aplicar validaciones personalizadas a los formularios.
   * @param solicitud220502Store - Store que administra el estado de la solicitud 220502.
   * @param solicitud220502Query - Query para consultar el estado de la solicitud 220502.
   * @param consultaioQuery - Servicio Query para obtener datos adicionales de la solicitud.
   */
  constructor(
    private readonly fb: FormBuilder,
    private solicitudPantallasService: SolicitudPantallasService,
    private validacionesService: ValidacionesFormularioService,
    public solicitud220502Store: Solicitud220502Store,
    public solicitud220502Query: Solicitud220502Query,
    private consultaioQuery: ConsultaioQuery,
     private NOTIF: NotificacionesService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          if (seccionState.readonly || seccionState.update) {
            this.inicializarEstadoFormulario();
          }
        })
      )
      .subscribe();

    this.inicializarFormulario();
  }

  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
      this.forma?.disable();
    } else if (!this.formularioDeshabilitado) {
      this.forma?.enable();
    }
  }

  /**
   * Inicializa el formulario con los opciónes del estado de la solicitud 220502.
   * @returns {void}
   */
  inicializarFormulario(): void {
    this.forma = this.fb.group({
      foliodel: [
        { value: this.solicitud220502State.fetchapago, disabled: true },
      ],
      aduanaIngreso: [
        this.solicitud220502State.aduanaIngreso,
        Validators.required,
      ],
      oficinaInspeccion: [
        this.solicitud220502State.oficinaInspeccion,
        Validators.required,
      ],
      puntoInspeccion: [
        this.solicitud220502State.puntoInspeccion,
        Validators.required,
      ],
      ferrocarril: [this.solicitud220502State.ferrocarril],
      numeroguia: [
        { value: this.solicitud220502State.numeroguia, disabled: true },
        Validators.required,
      ],
      regimen: [this.solicitud220502State.regimen, Validators.required],
      coordenadas: [
        { value: this.solicitud220502State.coordenadas, disabled: true },
      ],
      movilizacion: [
        this.solicitud220502State.movilizacion,
        Validators.required,
      ],
      transporte: [
        { value: this.solicitud220502State.transporte, disabled: true },
      ],
      punto: [this.solicitud220502State.punto, [Validators.required]],
      nombreEmpresa: [
        this.solicitud220502State.nombreEmpresa,
        Validators.required,
      ],
    });

    this.solicitud220502Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((data: Solicitud220502State) => {
          this.solicitud220502State = data; })
                 )
    .subscribe();
    this.getEstablecimiento();
    this.getPuntoVerificacion();
    this.getEmpresaTransportista();
    this.actualizarDatosDelaSolicitud();
    this.inicializarEstadoFormulario();
     this.getDatosGeneralesRevision(String(this.solicitud220502State.certificadosAutorizados))
   
  }

  /**
   * Método para actualizar los datos de la solicitud.
   * Realiza una llamada al servicio `getDatosDelaSolicitud()` para obtener los datos
   * y luego actualiza el store con la respuesta recibida.
   */
  actualizarDatosDelaSolicitud(): void {
    this.solicitudPantallasService
      .getDatosDelaSolicitud()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: Solicitud220502State) => {
          this.solicitud220502Store.setFoliodel(resp.foliodel);
          this.solicitud220502Store.setFerrocarril(resp.ferrocarril);
          this.solicitud220502Store.setNumeroguia(resp.numeroguia);
          this.solicitud220502Store.setCoordenadas(resp.coordenadas);
          this.solicitud220502Store.setTransporte(resp.transporte);
          this.solicitud220502Store.setNombreEmpresa(resp.nombreEmpresa);
        },
      });
  }

  /**
   * Muestra u oculta el contenido colapsable.
   * @returns {void}
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Rota la fila en la dirección especificada.
   * @param {number} direction - La dirección de rotación.
   * @returns {void}
   */
  rotarFila(direction: number): void {
    const TOTALROWS = this.mercanciasLista.length;
    this.direccionActual = direction;
    this.indiceActual = (this.indiceActual + direction + TOTALROWS) % TOTALROWS;
  }

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
  getAduanaIngreso(match:string): void {
   this.solicitudPantallasService.getAduanaDeIngreso('220502')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        const FOUND_CATALOG = resp
        ?.find(el => el.clave === match);
          this.aduanaIngreso.catalogos = resp;
        this.forma.patchValue({
          aduanaIngreso:FOUND_CATALOG?.clave ?? ''
        })
       if (FOUND_CATALOG) {
  this.seleccionarAduanaIngreso(FOUND_CATALOG);
}
     });
  }

  /**
   * Obtiene la oficina de inspección.
   * Este método llama al servicio de revisión para obtener la oficina de inspección.
   * @returns {void}
   */
  getOficianaInspeccion(aduana:string,match:string): void {
    this.solicitudPantallasService
      .getOficinaInspeccionSanidadAgropecuaria(aduana,'220502')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
      
          this.oficianaInspeccion.catalogos = resp;
         const FOUND_CATALOG = resp
        ?.find(el => el.clave === match);
      
        this.aduanaIngreso.catalogos = resp;
        this.forma.patchValue({
          oficinaInspeccion:FOUND_CATALOG?.clave ?? ''
        })
       if (FOUND_CATALOG) {
  this.seleccionarOficianaInspeccion(FOUND_CATALOG);
}
});
  }

  /**
   * Obtiene el punto de inspección.
   * Este método llama al servicio de revisión para obtener el punto de inspección.
   * @returns {void}
   */
  getPuntoInspeccion(ins:string,match:string): void {
    this.solicitudPantallasService
      .getPuntosInspeccion(ins,'220502')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.puntoInspeccion.catalogos = resp;
                const FOUND_CATALOG = resp
        ?.find(el => el.clave === match);
       
        this.aduanaIngreso.catalogos = resp;
        this.forma.patchValue({
          puntoInspeccion:FOUND_CATALOG?.clave ?? ''
        })
       if (FOUND_CATALOG) {
  this.seleccionarPuntoInspeccion(FOUND_CATALOG);
}
   });
  }

  /**
   * Obtiene el establecimiento.
   * Este método llama al servicio de revisión para obtener el establecimiento.
   * @returns {void}
   */
  getEstablecimiento(): void {
    this.solicitudPantallasService
      .getEstablecimiento()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          this.establecimiento.catalogos = resp.data;
        }
      });
  }

  /**
   * Obtiene el régimen al que se destinarán las mercancías.
   * Este método llama al servicio de revisión para obtener el régimen.
   * @returns {void}
   */
  getRegimenDestinaran(match:string): void {
    this.solicitudPantallasService
      .getRegimenDestinaran()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.regimenDestinaran.catalogos = resp.datos;
         const FOUND_CATALOG = resp?.datos
        ?.find(el => el.clave === match);
       this.forma.patchValue({
          regimen:FOUND_CATALOG?.clave ?? ''
        })
       if (FOUND_CATALOG) {
  this.seleccionarRegimen(FOUND_CATALOG);
}});
  }

  /**
   * Obtiene la movilización nacional.
   * Este método llama al servicio de revisión para obtener la movilización nacional.
   * @returns {void}
   */
  getMovilizacionNacional(match:string): void {
    this.solicitudPantallasService
      .getMediosDeTransporte('220502')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.movilizacionNacional.catalogos = resp;
             const FOUND_CATALOG = resp
        ?.find(el => el.clave === match);
         this.aduanaIngreso.catalogos = resp;
        this.forma.patchValue({
          movilizacion:FOUND_CATALOG?.clave ?? ''
        })
       if (FOUND_CATALOG) {
  this.seleccionarMovilizacionNacional(FOUND_CATALOG);
} });
  }

  /**
   * Obtiene el punto de verificación.
   * Este método llama al servicio de revisión para obtener el punto de verificación.
   * @returns {void}
   */
  getPuntoVerificacion(): void {
    this.solicitudPantallasService
      .getPuntoVerificacion()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
      this.puntoVerificacion.catalogos = resp;
         });
  }

  /**
   * Obtiene la empresa transportista.
   * Este método llama al servicio de revisión para obtener la empresa transportista.
   * @returns {void}
   */
  getEmpresaTransportista(): void {
    this.solicitudPantallasService
      .getEmpresaTransportista()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          this.empresaTransportista.catalogos = resp.data;
        }
      });
  }

  /**
   * Selecciona una aduana de ingreso y actualiza el store con la descripción correspondiente.
   * @param event Objeto de tipo Catalogo que contiene la información de la aduana seleccionada.
   */
  seleccionarAduanaIngreso(event: Catalogo): void {
    this.solicitud220502Store.setAduanaIngreso(event.clave ?? '');
  }

  /**
   * Selecciona una oficina de inspección y actualiza el store con la descripción correspondiente.
   * @param event Objeto de tipo Catalogo que contiene la información de la oficina seleccionada.
   */
  seleccionarOficianaInspeccion(event: Catalogo): void {
    this.solicitud220502Store.setOficinaInspeccion(event.clave ?? '');
  }

  /**
   * Selecciona un punto de inspección y actualiza el store con la descripción correspondiente.
   * @param event Objeto de tipo Catalogo que contiene la información del punto seleccionado.
   */
  seleccionarPuntoInspeccion(event: Catalogo): void {
    this.solicitud220502Store.setPuntoInspeccion(event.clave ?? '');
  }

  /**
   * Método para seleccionar el régimen de la solicitud.
   * Actualiza el estado con el ID del régimen seleccionado.
   *
   * @param event - Objeto de tipo Catalogo que contiene la información del régimen seleccionado.
   */
  seleccionarRegimen(event: Catalogo): void {
    this.solicitud220502Store.setRegimen(event.clave ?? '');
  }

  /**
   * Selecciona una movilización nacional y actualiza el store con la descripción correspondiente.
   * @param event Objeto de tipo Catalogo que contiene la información de la movilización seleccionada.
   */
  seleccionarMovilizacionNacional(event: Catalogo): void {
    this.solicitud220502Store.setMovilizacion(event.clave ?? '');
  }

  /**
   * Método para seleccionar el punto de verificación.
   * Actualiza el estado con el ID del punto seleccionado.
   *
   * @param event - Objeto de tipo Catalogo que contiene la información del punto de verificación seleccionado.
   */
  seleccionarPuntoVerificacion(event: Catalogo): void {
    this.solicitud220502Store.setPunto(event.id);
  }
   /**
   * Carga la mercancía asociada al certificado.
   */
      public getMercancia(certificado: string): void {
  this.solicitudPantallasService
    .getDatosMercanciaRevision(certificado)
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
     this.mercanciasLista = data.datos;
    });
}

/**
 * Carga datos generales de la revisión y actualiza catálogos, formulario y store.
 */
        async getDatosGeneralesRevision(certificado:string): Promise<void> {
        try {
          const DATA = await firstValueFrom(this.solicitudPantallasService.getDatosGeneralesRevision(certificado).pipe(takeUntil(this.destroyed$)));
              this.getMercancia(String(DATA?.id_solicitud))
              this.getAduanaIngreso(DATA?.tramite?.aduana);
              this.getOficianaInspeccion(DATA?.tramite?.aduana,DATA?.tramite?.oficina_inspeccion)
              this.getPuntoInspeccion(DATA?.tramite?.oficina_inspeccion,DATA?.tramite?.punto_inspeccion );
              this.getMovilizacionNacional(DATA?.transporte?.medio_transporte)
              this.getRegimenDestinaran(DATA?.tramite?.regimen);

                     this.forma.patchValue({
            foliodel: DATA?.folio_tramite,
            numeroguia:DATA?.tramite?.numero_de_guia,
            ferrocarril:DATA?.tramite?.numero_carro_ferrocarril,
            transporte:DATA?.transporte?.identificacion_transporte,
            nombreEmpresa:DATA?.tramite?.numero_de_guia,
            })
          this.solicitud220502Store.setFoliodel(DATA?.folio_tramite);
          this.solicitud220502Store.setFerrocarril(DATA?.tramite?.numero_de_guia);
          this.solicitud220502Store.setNumeroguia(DATA?.tramite?.numero_carro_ferrocarril);
          this.solicitud220502Store.setTransporte(DATA?.transporte?.identificacion_transporte);
          this.solicitud220502Store.setIdSolicitud(String(DATA?.id_solicitud));  
              this.solicitud220502Store.setNombreEmpresa(DATA?.tramite?.numero_de_guia);     
        } catch (error) {
          // Manejar error
        }
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
