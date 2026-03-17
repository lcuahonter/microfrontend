import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { RetirosCofepris261702State, Tramite261702Store } from '../../../../estados/tramites/tramite261702.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { RepresentanteLegalComponent } from '../../components/representanteLegal/representanteLegal/representanteLegal.component';
import { RetirosCofeprisService } from '../../services/retiros-cofepris.service';
import { Tramite261702Query } from '../../../../estados/queries/tramite261702.query';
import { TramiteAsociados } from '../../../../shared/models/tramite-asociados.model';

/**
 * @component
 * @name PasoUnoComponent
 * @description
 * Componente que muestra la primera pestaña.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
})

export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * compo doc
   * Índice del subtítulo seleccionado.
   * Se utiliza para determinar qué sección de datos se muestra.
   * Inicialmente, el valor es 1.
   */
  indice: number = 1;

  /**
   * Observable utilizado para limpiar las suscripciones al destruir el componente.
   * Esto ayuda a evitar fugas de memoria.
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Estado de la consulta actual. */
  public consultaState!: ConsultaioState;

  /**
   * Referencia al componente hijo `RepresentanteLegalComponent` dentro de la plantilla.
   * 
   * Permite acceder a las propiedades y métodos públicos del componente `RepresentanteLegalComponent`
   * para interactuar con la información y acciones relacionadas al representante legal en el formulario.
   * 
   * @viewChild representanteLegal
   */
  @ViewChild('representanteLegal') representanteLegal!: RepresentanteLegalComponent;


  
  idSolicitud: number = 0;

  folio: string = '';

   /**
 * @Input pestanaDosFormularioValido
 * @description
 * Indica si los formularios asociados a la pestaña dos del wizard son válidos.
 * 
 * Funcionalidad:
 * - Recibe un valor booleano desde el componente padre para determinar la validez de los formularios en la pestaña dos.
 * - Este valor puede ser utilizado para habilitar o deshabilitar acciones relacionadas con la pestaña dos.
 * 
 * @type {boolean}
 * 
 * @example
 * <paso-uno [pestanaDosFormularioValido]="true"></paso-uno>
 */
  @Input() pestanaDosFormularioValido!: boolean;

/**
   * Estado que representa la información y el flujo de la cancelación de la petición 261702.
   * Utilizado para gestionar y almacenar los datos relevantes durante el proceso de cancelación
   * dentro del componente de pantallas.
   */
  cancelacionPeticion261702State!: RetirosCofepris261702State;

    /**
     * Lista de trámites asociados que se mostrarán en la tabla.
     */
    tramiteAsociados!: TramiteAsociados[];

  /**
   * compo doc
   * Constructor del componente.
   * Inicializa el servicio de cancelación de petición.
   *
   * @param cancelacionPeticionService - Servicio para gestionar la cancelación de la petición.
   */
  constructor(
    private retirosCofeprisService: RetirosCofeprisService,
    private consultaQuery: ConsultaioQuery,
    private ampliacionServiciosAdapter: AmpliacionServiciosAdapter,
    private tramite261702Store:Tramite261702Store,
    private tramite261702Query:Tramite261702Query
  ) {
    //no hacer nada
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Se suscribe a los cambios en los trámites asociados y actualiza la lista de trámites.
   *
   * @returns {void}
   */
  ngOnInit(): void {
  
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.notificadorDestruccion$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario(this.consultaState?.id_solicitud);
      this.tramite261702Store.setDynamicFieldValue('idSolicitud', this.consultaState?.id_solicitud);
      this.idSolicitud = Number(this.consultaState?.id_solicitud);
      this.esDatosRespuesta = true;
    } else {
      this.esDatosRespuesta = true;
    }

    this.tramite261702Query.selectRetiros$
          .pipe(
            takeUntil(this.notificadorDestruccion$),
            map((seccionState) => {
              this.cancelacionPeticion261702State = seccionState;
    
              if (
                this.cancelacionPeticion261702State &&
                typeof this.cancelacionPeticion261702State === 'object'
              ) {
                this.folio = this.cancelacionPeticion261702State['folio'] as string;
              }
            })
          )
          .subscribe();

     //this.getTramitesAsociadosDatos(this.folio);
    //this.getTramitesAsociadosDatos('0402601700120264001000021');
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(idSolicitud: string): void {
    this.retirosCofeprisService
      .getMostrarDatos(idSolicitud).pipe(
        takeUntil(this.notificadorDestruccion$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.pestanaDosFormularioValido = true;
          const MOSTARDATOS = this.ampliacionServiciosAdapter.reverseMapFromPayload(resp.datos as unknown as Record<string, unknown>);
          this.tramite261702Store.update(MOSTARDATOS);
        }
      });
  }

  /**
   * compo doc
   * Método para cambiar el índice del subtítulo seleccionado.
   *
   * @param i - Índice del nuevo subtítulo seleccionado.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tramite261702Store.updateTabSeleccionado(i);
  }


  /**
   * Valida los formularios asociados al representante legal y al permiso de cancelación.
   * 
   * Llama al método `validarFormulario()` en los objetos `representanteLegal` y `permisoCancelar`, 
   * si estos existen, para asegurar que ambos formularios sean validados correctamente.
   */
  validarFormularios(): void {
    this.representanteLegal?.validarFormulario();
  }

 /**
   * Obtiene los trámites asociados a un folio específico y actualiza la propiedad `tramiteAsociados` con los datos recibidos.
   *
   * @param follio - El folio para el cual se desean obtener los trámites asociados.
   *
   * @remarks
   * Este método realiza una petición al servicio `cancelacionPeticionService` para obtener los trámites asociados al folio proporcionado.
   * La suscripción se cancela automáticamente cuando se destruye el componente, utilizando el observable `notificadorDestruccion$`.
   */
getTramitesAsociadosDatos(folio: string): void {
  this.retirosCofeprisService
    .getTramitesAsociados(folio)
    .pipe(takeUntil(this.notificadorDestruccion$))
    .subscribe(resp => {
      if (!resp?.datos) {
        this.tramiteAsociados = [];
        this.tramite261702Store.setDynamicFieldValue('tramiteAsociados', []);
        return;
      }

      this.tramiteAsociados = (resp.datos as unknown[]).map(
        (item, index: number): TramiteAsociados => {
          const OBJ = item as Record<string, unknown>;
          return {
            id: index + 1,
            folioTramite: String(OBJ['folio']), 
            tipoTramite: String(OBJ['tipoTramite'] ?? ''),
            estatus: String(OBJ['estatus'] ?? ''),
            fetchaAltaDeRegistro: String(OBJ['fechaAltaRegistro'] ?? '')
          };
        }
      );

      this.tramite261702Store.setDynamicFieldValue('tramiteAsociados', this.tramiteAsociados);
      
    });
}

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}
