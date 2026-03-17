
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, LoginQuery } from '@ng-mf/data-access-user';
import { DetalleSolicitudAvisos, ResiduoDetalle } from '../../../231002/models/detalle-solicitud.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoT231003Service } from '../../service/catalogo-t231003.service';
import { CommonModule } from '@angular/common';
import { DatoSolicitudStore } from '../../estados/tramites/dato-solicitud.store';
import { DatosSolicitudComponent } from '../../components/datos-solicitud/datos-solicitud.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResiduoPeligroso } from '../../../231002/models/aviso-catalogo.model';
import { SolicitanteComponent } from "@libs/shared/data-access-user/src";
/**
 * Decorador que define un componente de Angular.
 * - selector: Nombre que se utilizará en el HTML para referenciar este componente.
 * - templateUrl: Ruta del archivo HTML asociado al componente.
 */
@Component({
  standalone: true,
  selector: 'app-paso-uno-t231003',
  templateUrl: './paso-uno-t231003.component.html',
  imports: [SolicitanteComponent, DatosSolicitudComponent, CommonModule, ReactiveFormsModule],
})
export class PasoUnoT231003Component implements OnInit {

  /**
   * Índice de la pestaña seleccionada.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Indica si el formulario actual es válido.
   */
  @Input() esFormaValido!: boolean;

  @ViewChild('solicitud', { static: false })
  datosSolicitudComponent: DatosSolicitudComponent | undefined;


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

  /** RFC del usuario logueado */
  public rfcLogueado: string = '';

  constructor(private consultaQuery: ConsultaioQuery,
    private service: CatalogoT231003Service,
    private store: DatoSolicitudStore,
    private loginQuery: LoginQuery
  ) { }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    this.store.reset();
    this.obtenerDatosRfc();
    this.obtieneEstadoTramite();
  }

  /**
   * Selecciona una pestaña específica.
   *
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
     * Obtiene los datos IMMEX del solicitante.
     */
  obtenerDatosRfc(): void {
    this.loginQuery.selectRfc$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.store.update({
          rfc_solicitante: res
        });
        this.rfcLogueado = res;
      });
  }


  /**
   * Obtiene el estado del trámite y actualiza el store si está en modo lectura.
   */
  obtieneEstadoTramite(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.readonly) {
      this.store.update({
        esLecutra: true
      });
      this.guardarDatosFormulario(this.consultaState.folioTramite);
    }
  }

  /**
   * guarda los datos del formulario en el store.
   * @param folioTramite folio del trámite.
   */
  guardarDatosFormulario(folioTramite: string): void {
    this.service.getDetalleSolicitud(folioTramite).subscribe({
      next: (response) => this.setDetalle(response.datos)
    });
  }

  /**
   * setea el detalle de la solicitud en el store.
   * @param detalle detalle de la solicitud.
   */
  setDetalle(detalle: DetalleSolicitudAvisos): void {
    if (detalle) {
      this.store.update({
        rfc_solicitante: detalle.rfc_solicitante
      });

      this.store.update({
        residuos: [...PasoUnoT231003Component.mapearResiduos(detalle.residuos)]
      });

      this.store.actualizarSolicitudForm({
        descripcionGenerica1: detalle.descripcion_clob_generica1,
        numeroProgramaImmex: detalle.numero_programa_immex,
        numeroRegistroAmbiental: detalle.numero_registro_ambiental,
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
      if (detalle.descripcion_generica2) {
        this.store.actualizarLugarReciclaje({
          lugarReciclaje: detalle.descripcion_generica2,
          numeroAutorizacionEmpresaReciclaje: detalle.descripcion_generica3,
          reciclajeInstalaciones: detalle.empresa_mismo_grupo ? 'Si' : 'No',
        });
      }

      this.store.actualizarEmpresaTransportista({
        nombreEmpresaTransportistaResiduos: detalle.transporte.razon_social,
        numeroAutorizacionSemarnat: detalle.transporte.autorizacion_semarnat_transporte,
      });

      this.store.actualizarPrecaucionesManejo({
        precaucionesManejo: detalle.descripcion_clob_generica1,
      });
    }
  }


  /**
   * mapea los residuos del detalle de la solicitud al modelo de ResiduoPeligroso.
   * @param residuoDetalle el detalle de los residuos.
   * @returns lista de residuos mapeados.
   */
  static mapearResiduos(residuoDetalle: ResiduoDetalle[]): ResiduoPeligroso[] {
    return residuoDetalle.map((residuo: ResiduoDetalle) => ({
      id: 0,
      origenResiduoGeneracion: residuo.desc_boolean_generico1 !== 'false' ? 'Residuo (materia prima residual)' : 'Producción Industrial',
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
      tipoContenedorOtro: residuo.descripcion_tipo_contenedor_otros || '',
    })
    );
  }




  /**
   * Valida todos los formularios en el componente.
   * @returns si todos los formularios son válidos
   */
  validarTodosLosFormularios(): boolean {
    if (this.indice >= 2 && this.datosSolicitudComponent) {
      this.datosSolicitudComponent.marcarCamposcomoTocados();
      return this.datosSolicitudComponent.validaEsFormularioValido();
    }
    this.indice = 2;
    return false;
  }
}
