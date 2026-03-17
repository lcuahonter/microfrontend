import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, SolicitanteQuery, SolicitanteState, TablaDinamicaComponent, TablaSeleccion, TituloComponent, doDeepCopy, esValidArray, esValidObject } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Solicitud80306State, Tramite80306Store } from '../../../../estados/tramites/tramite80306.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CONFIGURACION_MODIFICACION } from '../../constantes/modificacion.enum';
import { CommonModule } from '@angular/common';
import { DatosDelModificacion } from '../../estados/models/datos-tramite.model';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80306Query } from '../../estados/tramite80306.query';
import { TramiteState } from '../../estados/tramite80306.store';

/**
 * Componente para gestionar la modificación del trámite 80306.
 */
@Component({
  selector: 'app-modificacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TituloComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './modificacion.component.html',
  styleUrl: './modificacion.component.scss',
})
/**   * Clase del componente ModificacionComponent.
 * Proporciona la funcionalidad para gestionar la modificación del trámite 80306,
 * incluyendo un formulario reactivo y una tabla dinámica para mostrar los datos de modificación.
 */
export class ModificacionComponent implements OnInit, OnDestroy, OnChanges {
  
  /** Estado de datos del solicitante */
  solicitanteState!: SolicitanteState;

      /**
     * Estado actual de la solicitud del trámite 80302
     * @type {TramiteState}
     * @description Almacena el estado completo de la solicitud, incluyendo información
     * relevante para el proceso de firma electrónica y validaciones
     */
    public solicitudState!: TramiteState;
  
    /**
   * Constructor de la clase ModificacionComponent.
   * @param fb - Instancia de FormBuilder para crear formularios reactivos.
   * @param solicitudService - Servicio para manejar la lógica de modificación utilizando Immer.
   * @param tramite80306Store - Store para gestionar el estado del trámite 80306.
   * @param tramite80306Query - Query para consultar el estado del trámite 80306.
   * @param solicitanteQuery - Query para consultar el estado del solicitante.
   * @param toastr - Servicio para mostrar notificaciones al usuario.
   */
  constructor(
    private fb: FormBuilder,
    private solicitudService: ImmerModificacionService,
    private tramite80306Store: Tramite80306Store,
    private tramite80306Query: Tramite80306Query,
    private solicitanteQuery: SolicitanteQuery,
    private toastr: ToastrService,
  ) {
    this.solicitanteQuery.selectSeccionState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitanteState = seccionState;
      })
    )
    .subscribe();
    
    this.tramite80306Query.selectSolicitud$
    .pipe(takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
    ).subscribe();
  }

  /**
   * Grupo de formulario para el formulario de solicitud.
   */
  modificacionForm!: FormGroup;

  /**
   * Observable para notificar la destrucción del componente.
   * Se utiliza para cancelar suscripciones activas y evitar fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   * Contiene los datos relacionados con la modificación del trámite.
   */
  public derechoState: Solicitud80306State = {} as Solicitud80306State;

  /**
   * Representa la tabla de selección utilizada en el componente de modificación.
   * Esta tabla se utiliza para gestionar y mostrar los datos seleccionados
   * en el contexto de los trámites específicos.
   */
  TablaSeleccion = TablaSeleccion;
  

  /**
   * Configuración de las columnas de la tabla dinámica.
   * Define las propiedades de cada columna, como encabezado, clave y orden.
   */
  public encabezadoDeTabla: ConfiguracionColumna<DatosDelModificacion>[] = CONFIGURACION_MODIFICACION;

  /**
   * Define los datos que se mostrarán en la tabla dinámica.
   */
  datosTabla: DatosDelModificacion[] = [];

          /**
   * Identificador de la solicitud en formato cadena.
   * Se utiliza para almacenar el ID de solicitud como cadena.
   * @type {string}
   * @memberof DatosComplimentariaComponent
   */
  /**
   * @property {string} buscarIdSolicitudString
   */
  buscarIdSolicitudString!: string;

    /**   * Indica si se deben ocultar las pestañas en la interfaz.
   * @type {boolean}
   */
  @Input() showTabs: boolean = true;

  /**   * Indica si se deben mostrar los campos en la interfaz.
   * @type {boolean}
   */
  public showFields: boolean = true;

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario, carga los datos de modificación y los datos de la tabla.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.loadDatosModificacion();
    this.obtenerSolicitudId();
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }

  /**   * Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * Actualiza la visibilidad de los campos según el valor de `showTabs`.
   */
  ngOnChanges(): void {
    this.showFields = !this.showTabs;
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales del estado.
   */
  inicializarFormulario(): void {
    this.modificacionForm = this.fb.group({
      rfc: [this.solicitanteState?.rfc_original, []],
      federal: ['', []],
      tipo: [this.solicitanteState?.tipo_sociedad, []],
      programa: [this.solicitanteState?.email, []],
    });
  }

  /**
   * Carga los datos de modificación desde el servicio.
   * Actualiza el estado del trámite y los valores del formulario.
   */
  loadDatosModificacion(): void {
    this.solicitudService.getDatosModificacion().pipe(takeUntil(this.destroyNotifier$)).subscribe((datos) => {
        (this.tramite80306Store.setDatosModificacion as (valor: unknown) => void)(datos);
        this.setFormValues();
      });
  }

  /**
   * Cargar datos de la tabla.
   *
   * Este método obtiene los datos de la tabla desde el servicio `datosTramiteService`
   * y los almacena en la propiedad `datosTabla`. Utiliza `takeUntil` para cancelar la suscripción
   * cuando el componente se destruye, evitando fugas de memoria.
   *
   * @example
   * // Llamar al método para cargar los datos de la tabla
   * this.loadDatosTablaData();
   */
  loadDatosTablaData(): void {
    const PAYLOAD = {
      "id_solcitud": this.buscarIdSolicitudString,
      "rfc":"AAL0409235E6",
      "folio_programa":this.solicitudState.selectedFolioPrograma,
      "tipo_programa":"TICPSE.IMMEX"
    }
    this.solicitudService.obtenerBuscarServicios(PAYLOAD)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((data) =>
    {
      if(esValidObject(data)) {
        const RESPONSE = doDeepCopy(data);
        if(esValidArray(RESPONSE.datos)) {
          this.datosTabla = RESPONSE.datos;
        }
      }
    });
  }

     /**
       * Obtiene el ID de la solicitud desde el servicio.
       * Almacena el ID en la propiedad `buscarIdSolicitud` y llama a los métodos
       * para obtener los datos relacionados.
       * 
       * @returns {void}
       * @memberof DatosComplimentariaComponent
       */
      obtenerSolicitudId(): void {
        const PAYLOAD = {
          "idPrograma": this.solicitudState.selectedIdPrograma,
          "tipoPrograma": this.solicitudState.selectedTipoPrograma
        };
        this.solicitudService
          .obtenerSolicitudId(PAYLOAD) // Llama al servicio para obtener los datos de operaciones.
          .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando el componente se destruye.
          .subscribe(
            (data) => {
              if(esValidObject(data)) {
                const RESPONSE = doDeepCopy(data);
                this.buscarIdSolicitudString = RESPONSE.datos?.buscaIdSolicitud.split(',')
                .map((id:string) => id.trim())
                .filter((id:string) => id !== '' && id !== '0') // remove empty and zero
                .join(',');
                this.loadDatosTablaData()
              }
            },
            () => {
              this.toastr.error('Error al cargar las operaciones'); // Manejo de errores.
            }
          );
      }
  
  

  /**
   * Establece los valores del formulario utilizando los datos de modificación.
   */
  setFormValues(): void {
    this.modificacionForm.get('rfc')?.setValue(this.solicitanteState?.rfc_original);
    this.modificacionForm.get('federal')?.setValue('');
    this.modificacionForm.get('tipo')?.setValue(this.solicitanteState?.tipo_sociedad);
    this.modificacionForm.get('programa')?.setValue(this.solicitanteState?.email);
  }

  /**
   * Establecer valores en el store del trámite.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite80306Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite80306Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

}
