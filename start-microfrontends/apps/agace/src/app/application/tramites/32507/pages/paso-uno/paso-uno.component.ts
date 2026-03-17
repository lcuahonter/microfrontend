import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  Notificacion,
  SolicitanteStore,
} from '@ng-mf/data-access-user';
import { DatosGeneralesModel } from '@libs/shared/data-access-user/src/core/models/datos-generales.model';
import {
  Tramite32507State,
  Tramite32507Store,
} from '../../../../estados/tramites/tramite32507.store';
import { map, takeUntil } from 'rxjs';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { CommonModule } from '@angular/common';
import { AvisoTabla, AvisoTablaResponse, DatosSolicitante } from '../../models/aviso-traslado.model';
import { EntregaActaService } from '../../services/entrega-acta.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { Tramite32507Query } from '../../../../estados/queries/tramite32507.query';


/**
 * Componente PasoUnoComponent
 *
 * Este componente representa el primer paso de un flujo o formulario.
 * Incluye la lógica para cambiar entre pestañas o secciones mediante un índice.
 *
 * Componentes utilizados:
 * - SolicitanteComponent: Componente que permite capturar o mostrar datos del solicitante.
 * - AvisoComponent: Componente que muestra avisos o notificaciones relevantes.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  imports: [CommonModule, ReactiveFormsModule, AvisoComponent, SolicitanteComponent],
  standalone: true,
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
   * Referencia al componente AvisoComponent para acceso desde componentes padre.
   */
  @ViewChild('avisoComponentRef') avisoComponentRef!: AvisoComponent;

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para notificar y completar las suscripciones activas al destruir el componente, evitando fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Tramite32503State} tramiteState
   * @description Estado actual del trámite 32503, que contiene toda la información relevante del proceso.
   */
  public tramiteState!: Tramite32507State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esDatosRespuesta: boolean = false;

  /**
   * Nueva notificación para mostrar mensajes de error o información al usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

  /**
   * Bandera para hacer la llamada de Adace solamente una vez
   */
  private datosConsultaEjecutado: boolean = false;

  /**
   * @constructor
   * @description Constructor del componente. Se utiliza para la inyección de dependencias.
   */
  constructor(
    public store: Tramite32507Store,
    public tramiteQuery: Tramite32507Query,
    public entregaActaService: EntregaActaService,
    private consultaioQuery: ConsultaioQuery
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * @method ngOnInit
   *  @description Método del ciclo de vida que se ejecuta al inicializar el componente.
   *  Este método se suscribe a los estados del store `Tramite32505Store` y `ConsultaioQuery` para obtener los datos de la solicitud y la consulta.
   *  Si la consulta está marcada como `update`, se llama al método `fetchGetDatosConsulta` para obtener los datos de consulta.
   *   @returns {void}
   *  @memberof PasoUnoComponent
   *  @description Este método se ejecuta una vez que el componente ha sido inicializado y se utiliza para configurar la lógica de suscripción a los estados del store.
   *   @returns {void}
   *  @memberof PasoUnoComponent
   *   @description Este método se encarga de inicializar el componente, suscribiéndose a los estados del store y obteniendo los datos necesarios para el funcionamiento del componente.
   *   * @returns {void}
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.tramiteState = seccionState;
      })
    );

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })
      )
      .subscribe();

    if (this.consultaDatos.update) {
      this.getDatosAviso(this.consultaDatos.id_solicitud);
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * @method getDatosAviso
   * @description Método para obtener los datos de consulta desde el servicio `DatosTramiteService` y actualizar el estado del store `Tramite11201Store`.
   *
   * Este método realiza una solicitud HTTP para obtener los datos de consulta y, si la respuesta es exitosa, actualiza múltiples propiedades del store con los datos recibidos.
   * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   *
   * @returns {void}
   */
  public getDatosAviso(idSolicitud: string): void {
    this.entregaActaService
      .getDatosAviso(idSolicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        // if (respuesta.success) {
        if (respuesta.codigo === '00') {
          this.esDatosRespuesta = true;
          this.store.setAvisoFormularioAdace(respuesta.datos.adace);
          this.store.setAvisoFormularioLevantaActa(respuesta.datos.adace);
          this.store.setAvisoFormularioValorAnioProgramaImmex(respuesta.datos.valor_anio_programa_immex);
          this.store.setAvisoFormularioValorProgramaImmex(respuesta?.datos?.valor_programa_immex);
          this.store.setAvisoFormularioTipoBusqueda(respuesta.datos.tipo_busqueda);
          this.store.setAvisoFormularioLevantaActa(respuesta.datos.levanta_acta);
          const MERCANCIAS = PasoUnoComponent.parsearAvisoTablaResponse(respuesta.datos.mercancias);
          this.store.setTablaDeDatos(MERCANCIAS);
        }
      });
  }

  /**
   * @method parsearAvisoTablaResponse
   * @description Parsea un array de AvisoTablaResponse (snake_case del backend) a AvisoTabla (camelCase del frontend)
   *
   * @param {AvisoTablaResponse[]} avisos - Array de avisos en formato del backend
   * @returns {AvisoTabla[]} Array de avisos parseado al formato del frontend
   */
  private static parsearAvisoTablaResponse(avisos: AvisoTablaResponse[]): AvisoTabla[] {
    return avisos.map((aviso) => ({
      idTransaccionVUCEM: aviso.id_transaccion_vucem,
      cantidad: aviso.cantidad,
      pesoKg: aviso.peso_kg,
      cveUnidadMedida: aviso.cve_unidad_medida,
      descripcionUnidadMedida: aviso.descripcion_unidad_medida,
      descripcion: aviso.descripcion,
      siIdTransaccion: aviso.si_id_transaccion === "1" ? "Si" : "No",
    }));
  }

  /**
   * @method fetchGetDatosConsulta
   * @description Método para obtener los datos de consulta desde el servicio `DatosTramiteService` y actualizar el estado del store `Tramite11201Store`.
   *
   * Este método realiza una solicitud HTTP para obtener los datos de consulta y, si la respuesta es exitosa, actualiza múltiples propiedades del store con los datos recibidos.
   * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   *
   * @returns {void}
   */
  public fetchGetDatosConsulta(estado: string): void {
    this.entregaActaService
      .getDatosConsulta(estado)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (respuesta) => {
          if (respuesta.codigo === '00') {
            this.esDatosRespuesta = true;
            this.store.setAvisoFormularioAdace(respuesta.datos.descripcion);
            this.store.setCveUnidadAdministrativa(respuesta.datos.cveParametro);
          }
        },
        error: (error) => {
          const MENSAJE = error?.error?.error || 'Error inesperado al consultar adace.';
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        },
      });
  }

  /**
   * Método que se ejecuta cuando los datos generales del solicitante han sido cargados
   * @param datosGenerales - Datos generales obtenidos del servicio
   */
  public onDatosGeneralesLoaded(datosGenerales: DatosGeneralesModel): void {
    const IDENTIFICACION = datosGenerales.datos.identificacion;
    const UBICACION = datosGenerales.datos.ubicacion;

    // Mapear al formato DatosSolicitante del trámite 32507
    // let datosSolicitante: DatosSolicitante;
    const DATOS_SOLICITANTE: DatosSolicitante = {
      rfc: datosGenerales.datos.rfc_original || '',
      denominacion:
        IDENTIFICACION.razon_social ||
        `${IDENTIFICACION.nombre || ''} ${IDENTIFICACION.ap_paterno || ''} ${IDENTIFICACION.ap_materno || ''}`.trim(),
      actividadEconomica: IDENTIFICACION.d_sit_cont_dom || '',
      correoElectronico: IDENTIFICACION.email || '',
      pais: UBICACION.pais_residencia || '',
      codigoPostal: UBICACION.cp || '',
      entidadFederativa: UBICACION.d_ent_fed || '',
      municipio: UBICACION.d_municipio || '',
      localidad: UBICACION.d_localidad || '',
      colonia: UBICACION.d_colonia || '',
      calle: UBICACION.calle || '',
      nExt: UBICACION.n_exterior || '',
      nInt: UBICACION.n_interior || '',
      lada: UBICACION.t_tel_1 || '',
      telefono: UBICACION.telefono_1 || '',
      adace: '', // la asignaremos despues
      tipoPersona: IDENTIFICACION.tipo_persona,
      cveEntidadFederativa: UBICACION.c_ent_fed,
    };

    // Actualizar el store del trámite
    this.store.setDatosSolicitante(DATOS_SOLICITANTE);
    this.fetchGetDatosConsulta(UBICACION.d_ent_fed);
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta al destruir el componente.
   *
   * Este método emite un valor en el `destroyNotifier$` para notificar la destrucción del componente y completa el `Subject` para liberar recursos y evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Método para cambiar el índice actual.
   * Permite navegar entre diferentes pestañas o secciones.
   *
   * @param i - Nuevo índice seleccionado.
   */
  indice: number = 1;

  /**
   * Índice actual del paso o pestaña seleccionada.
   * Se usa para mostrar u ocultar secciones del componente.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Activa programáticamente la pestaña de Aviso (indice=2).
   *
   * Este método es llamado por el componente padre (solicitante-page)
   * cuando necesita validar el formulario de aviso pero el usuario
   * no ha visitado esa pestaña previamente.
   */
  public activarPestañaAviso(): void {
    this.seleccionaTab(2);
  }

  /**
   * Obtiene la referencia al componente AvisoComponent.
   *
   * Este método es usado por el componente padre (solicitante-page)
   * para acceder a los métodos de validación del componente aviso.
   *
   * @returns {AvisoComponent | undefined} La referencia al componente AvisoComponent, o undefined si no está disponible.
   */
  public obtenerComponenteAviso(): AvisoComponent | undefined {
    return this.avisoComponentRef;
  }
}
