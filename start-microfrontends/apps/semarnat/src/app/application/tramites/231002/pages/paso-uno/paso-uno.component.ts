import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { DetalleSolicitudAvisos, ResiduoDetalle } from './../../models/detalle-solicitud.model';
import { map, takeUntil } from 'rxjs';
import { CatalogoT231002Service } from '../../services/catalogo-t231002.service';
import { CommonModule } from '@angular/common';
import { DatoSolicitudStore } from '../../estados/tramites/dato-solicitud.store';
import { DatosSolicitudComponent } from '../../components/datos-solicitud/datos-solicitud.component';
import { ResiduoPeligroso } from '../../models/aviso-catalogo.model';
import { Subject } from 'rxjs';

/**
 * Componente que representa la sección de solicitud de datos del solicitante.
 *
 * Este componente permite gestionar la información del solicitante en el formulario y
 * proporciona la funcionalidad de selección de pestañas dentro de la interfaz.
 *
 * - selector: Nombre que se utilizará en el HTML para referenciar este componente.
 * - templateUrl: Ruta del archivo HTML asociado al componente.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent, DatosSolicitudComponent],
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario actual es válido.
   */
  @Input() esFormaValido!: boolean;

  /**
   * Índice de la pestaña seleccionada.
   *
   * Esta propiedad indica cuál de las pestañas del formulario está seleccionada en un
   * momento dado, permitiendo controlar la navegación entre las diferentes secciones.
   *
   * @type {number}
   */
  indice: number = 2;

  @ViewChild('solicitud', { static: false })
  datosSolicitudComponent: DatosSolicitudComponent | undefined;

  /**
   * Selecciona una pestaña específica.
   *
   * Este método actualiza el valor de `indice` para seleccionar la pestaña correspondiente
   * y cambiar la vista dentro del formulario.
   *
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Subject para gestionar la destrucción de suscripciones.
   * @type {Subject<void>}
   */
  private destroy$ = new Subject<void>();

  /**
   * Estado actual de la consulta (lectura/edición).
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Constructor para inyección de dependencias.
   * @param consultaQuery Query para estado de consulta
   * @param mercanciasDesmontadasOSinMontarService Servicio para operaciones de mercancías
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private service: CatalogoT231002Service,
    private store: DatoSolicitudStore
  ) { }

  /**
   * Inicialización del componente:
   * - Configura suscripción al estado de consulta
   * - Carga datos iniciales si es necesario
   */
  ngOnInit(): void {
    this.configurarSuscripcionEstadoConsulta();
  }


  /**
   * Configura la suscripción al estado de consulta:
   * - Actualiza el estado local
   * - Carga datos si está en modo actualización
   */
  private configurarSuscripcionEstadoConsulta(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.readonly) {
      this.indice = 1;
      this.guardarDatosFormulario(this.consultaState.folioTramite);
    }
  }

  guardarDatosFormulario(folioTramite: string): void {
    this.service.getDetalleSolicitud(folioTramite).subscribe({
      next: (response) => this.setDetalle(response.datos),
      error: (error) => console.error(error),
    });
  }

  setDetalle(detalle: DetalleSolicitudAvisos): void {
    if (detalle) {
      this.store.update({
        rfc_solicitante: detalle.rfc_solicitante,
      });
      this.store.actualizarResiduosPeligrosos([...this.mapearResiduos(detalle.residuos)]);

      this.store.actualizarSolicitudForm({
        ideGenerica1: detalle.boolean_generico ? 'primera_vez' : 'subsecuente',
        numeroRegistroAmbiental: detalle.numero_registro_ambiental,
        numeroProgramaImmex: detalle.numero_programa_immex,
        descripcionGenerica1: detalle.descripcion_generica1,
        domicilio: '',
      });

      if (detalle.empresa_reciclaje) {
        this.store.actualizarEmpresaReciclaje({
          correoElectronico: detalle.empresa_reciclaje.correo_electronico,
          nombreEmpresa: detalle.empresa_reciclaje.nombre,
          representanteLegal: detalle.empresa_reciclaje.razon_social,
          telefono: detalle.empresa_reciclaje.telefono,
          requiereEmpresa: detalle.empresa_controladora ? 'Si' : 'No',
        });
      }

      this.store.actualizarLugarReciclaje({
        codigoPostal: detalle.destinatario.codigo_postal,
        destinoDomicilio: detalle.destinatario.domicilio,
        pais: detalle.destinatario.pais,
        razonSocial: detalle.destinatario.razon_social,
      });

      if (detalle.transporte) {
        this.store.actualizarEmpresaTransportista({
          nombreEmpresaTransportistaResiduos: detalle.transporte.razon_social,
          numeroAutorizacionSemarnat: detalle.transporte.autorizacion_semarnat_transporte,
        });
      }

      this.store.actualizarPrecaucionesManejo({
        clave: detalle.aduana_salida.clave,
        precaucionesManejo: detalle.descripcion_clob_generica1,
      });
    }
  }


  mapearResiduos(residuoDetalle: ResiduoDetalle[]): ResiduoPeligroso[] {
    return residuoDetalle.map((residuo: ResiduoDetalle) => ({
      id: 0,
      origenResiduoGeneracion: residuo.desc_boolean_generico1 !== 'false' ? 'Residuo (materia prima residual)' : 'Residuo generado del proceso',
      nombreResiduo: residuo.descripcion_mercancia,
      acotacion: residuo.nombre_quimico,
      cantidad: residuo.cantidadUMT,
      cantidadLetra: residuo.cantidad_letra,
      numeroManifiesto: residuo.numero_manifiesto || '',
      capacidad: residuo.capacidad,
      materiasPrimasRelacionadas: [],
      desc_especie: '',
      fraccionCve: residuo.fraccion_arancelaria,
      fraccionDesc: '',
      nicoCve: '',
      nicoDesc: residuo.desc_nico,
      unidadMedidaCve: '',
      unidadMedidaDesc: residuo.descripcion_umc,
      residuoCve: residuo.cve_clasificacion,
      residuoDesc: '',
      residuoNombre: '',
      residuoNombreDesc: residuo.nom_clasificacion,
      residuoDescCve: '',
      residuoDescDesc: residuo.desc_clasificacion,
      residuoOtro: residuo.desc_otra_clasificacion || '',
      cretiCve: '',
      cretiDesc: residuo.desc_atributo,
      estadoFisicoCve: '',
      estadoFisicoDesc: residuo.desc_estado_fisico,
      estadoFisicoOtro: residuo.desc_otro_estado_fisico,
      tipoContenedorCve: '',
      tipoContenedorDesc: residuo.desc_tipo_contenedor,
      tipoContenedorOtro: residuo.descripcion_tipo_contenedor_otros,
    })
    );
  }

  /**
   * Valida todos los formularios en el componente.
   * @returns si todos los formularios son válidos
   */
  validarTodosLosFormularios(): boolean {
    if (this.indice >= 2 && this.datosSolicitudComponent) {
      this.datosSolicitudComponent.marcarCamposComoTocados();
      return this.datosSolicitudComponent.validarFormulario();
    }
    this.indice = 2;
    return false;
  }

  /**
   * Limpieza al destruir el componente:
   * - Completa el subject de destrucción
   * - Cancela suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
