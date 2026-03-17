import { CancelacionPeticion261701State, Tramite261701Store } from '../../estados/store/tramite261701.store';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfiguracionColumna, ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { CONFIGURACIONCOLUMNA } from '../../constantes/cancelacion-peticion.enum';
import { CancelacionPeticionService } from '../../services/cancelacion-peticion.service';
import { PermisoCancelarComponent } from '../../components/permiso-cancelar/permiso-cancelar.component';
import { RepresentanteLegalComponent } from '../../components/representante-legal/representante-legal.component';
import { Tramite261701Query } from '../../estados/query/tramite261701.query';
import { TramiteAsociados } from '../../../../shared/models/tramite-asociados.model';

/**
 * @component
 * @name PasoUnoComponent
 * @description
 * Componente que muestra la primera pestaña.
 */
@Component({
  selector: 'app-paso-uno',
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
  public isApiCallComplete: boolean = false;
  /**
   * Configuración de las columnas de la tabla para mostrar los trámites asociados.
   */
  configuracionTabla: ConfiguracionColumna<TramiteAsociados>[] =
    CONFIGURACIONCOLUMNA;

  /**
   * Lista de trámites asociados que se mostrarán en la tabla.
   */
  tramiteAsociados!: TramiteAsociados[];

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

  /**
   * Referencia al componente hijo PermisoCancelarComponent.
   * 
   * Esta propiedad utiliza el decorador `@ViewChild` para obtener una instancia del componente
   * PermisoCancelarComponent dentro de la plantilla de este componente padre. Permite acceder
   * a los métodos y propiedades públicos del componente hijo para interactuar con su funcionalidad.
   */
  @ViewChild('permisoCancelar') permisoCancelar!: PermisoCancelarComponent;

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
   * Estado que representa la información y el flujo de la cancelación de la petición 261701.
   * Utilizado para gestionar y almacenar los datos relevantes durante el proceso de cancelación
   * dentro del componente de pantallas.
   */
  cancelacionPeticion261701State!: CancelacionPeticion261701State;

  /**
   * compo doc
   * Constructor del componente.
   * Inicializa el servicio de cancelación de petición.
   *
   * @param cancelacionPeticionService - Servicio para gestionar la cancelación de la petición.
   */
  constructor(
    private cancelacionPeticionService: CancelacionPeticionService,
    private consultaQuery: ConsultaioQuery,
    private ampliacionServiciosAdapter: AmpliacionServiciosAdapter,
    private tramite261701Store:Tramite261701Store,
    private tramite261701Query:Tramite261701Query
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
    this.cancelacionPeticionService
      .obtenerTramitesAsociados()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((tramiteAsociados) => {
        this.tramiteAsociados = tramiteAsociados;
      });

    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.notificadorDestruccion$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario(this.consultaState?.id_solicitud);
      this.tramite261701Store.establecerDatos('idSolicitud', this.consultaState?.id_solicitud);
      this.idSolicitud = Number(this.consultaState?.id_solicitud);
    } else {
      this.esDatosRespuesta = true;
    }

    this.tramite261701Query.selectSolicitudDeRegistroTpl$
          .pipe(
            takeUntil(this.notificadorDestruccion$),
            map((seccionState) => {
              this.cancelacionPeticion261701State = seccionState;
    
              if (
                this.cancelacionPeticion261701State &&
                typeof this.cancelacionPeticion261701State === 'object'
              ) {
                this.folio = this.cancelacionPeticion261701State['folio'] as string;
              }
            })
          )
          .subscribe();
    //this.getTramitesAsociadosDatos(this.folio);
    this.getTramitesAsociadosDatos('0402601700120264001000021');
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(idSolicitud: string): void {
    this.cancelacionPeticionService
      .getMostrarDatos(idSolicitud).pipe(
        takeUntil(this.notificadorDestruccion$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.pestanaDosFormularioValido = true;
          const MOSTARDATOS = this.ampliacionServiciosAdapter.reverseMapFromPayload(resp.datos as unknown as Record<string, unknown>);
          this.tramite261701Store.update(MOSTARDATOS);
        }
      });
  }

/**
   * Selecciona una pestaña específica en el flujo del trámite.
   *
   * @param i - Índice de la pestaña que se desea seleccionar.
   * 
   * Llama al método `updateTabSeleccionado` del store para actualizar el estado de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tramite261701Store.updateTabSeleccionado(i);
  }

  /**
   * Valida los formularios asociados al representante legal y al permiso de cancelación.
   * 
   * Llama al método `validarFormulario()` en los objetos `representanteLegal` y `permisoCancelar`, 
   * si estos existen, para asegurar que ambos formularios sean validados correctamente.
   */
  validarFormularios(): void {
    this.representanteLegal?.validarFormulario();
    this.permisoCancelar?.validarFormulario();
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
  this.cancelacionPeticionService
    .getTramitesAsociados(folio)
    .pipe(takeUntil(this.notificadorDestruccion$))
    .subscribe(resp => {
      this.isApiCallComplete = true;
      if (!resp || !resp.datos) {
        this.tramiteAsociados = [];
        this.tramite261701Store.establecerDatos('tramiteAsociados', []);
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

      this.tramite261701Store.establecerDatos('tramiteAsociados', this.tramiteAsociados);
      
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
