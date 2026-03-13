import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  DatosPasos, SeccionLibQuery, SeccionLibState,
  SeccionLibStore,
} from '@ng-mf/data-access-user';
import { ReplaySubject, combineLatest, map, take, takeUntil } from 'rxjs';
import { Solicitud290201State, Solicitud290201Store } from '../../../../estados/tramites/tramites290201.store';
import { GuadarResponse } from '../../models/fila-model';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { WizardComponent } from '@libs/shared/data-access-user/src';

import { OCTA_TEMPO } from '../../constants/octova-tempora.enum';
import { Solicitud290201Query } from '../../../../estados/queries/tramites290201.query';

import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { RegistrarSolicitudService } from '../../services/registrar-solicitud.service';


interface AccionBoton {
  accion: string;
  valor: number;
}
/**
 * Payload para guardar o actualizar una solicitud de café.
 * Incluye datos generales del trámite, lotes y terceros relacionados.
 */
interface PayloadGuardarCafe {
  /** Identificador de la solicitud (nulo para nueva solicitud) */
  id_solicitud: number | null;

  /** Formas de presentación del café */
  formas_cafe: string;

  /** Tipos de café */
  tipos_cafe: string;

  /** Calidad del café */
  calidad_cafe: string;

  /** Procesos aplicados al café */
  procesos_cafe: string;

  /** Certificaciones del café */
  certificaciones_cafe: string;

  /** Clave de la aduana */
  clave_aduana: string;

  /** País de procedencia */
  pais_procedencia: string;

  /** Entidades asociadas a la solicitud */
  entidades_solicitud: string;

  /** Descripción genérica adicional */
  descripcion_generica1: string;

  /** Lista de lotes del café */
  lote: LotePayload[];

  /** Lista de terceros relacionados */
  terceros: TerceroPayload[];
}

/**
 * Payload que representa un lote de café dentro de la solicitud.
 */
interface LotePayload {
  /** Identificador de la mercancía */
  id_mercancia: number | null;

  /** Número de lote */
  numero_lote: string | null;

  /** Cantidad en unidad de medida comercial */
  cantidad_umc: string | null;

  /** Unidad de medida comercial */
  unidad_medida_comercial: string | null;

  /** Importe total del componente */
  importe_total_componente: string | null;

  /** Moneda del importe */
  moneda: string | null;

  /** Descripción de la mercancía */
  descripcion_mercancia: string;

  /** Indicador booleano genérico */
  boolean_generico1: boolean;

  /** Fecha de salida del lote */
  fecha_salida: string | null;

  /** Condición secundaria de almacenamiento */
  condicion_almacenamiento_secundario: string | null;

  /** Campo genérico adicional */
  generica2: string | null;

  /** Marcas de embarque */
  marcas_embarque: string | null;

  /** Descripción del tratamiento aplicado */
  descripcion_tratamiento: string | null;

  /** Indica si el lote fue aceptado */
  aceptada: boolean;

  /** Cantidad en la presentación */
  cantidad_presentacion: string | null;

  /** Número de oficio para casos especiales */
  numero_oficio_caso_especial: string | null;

  /** Condición primaria de almacenamiento */
  condicion_almacenamiento_primario: string | null;

  /** Otras especificaciones del producto */
  descripcion_otras_especificaciones: string | null;

  /** Identificador de fracción arancelaria */
  id_fraccion_gob: string | null;

  /** Campo genérico */
  generica1: string | null;

  /** Lista de detalles o marcas asociadas */
  detalles_marca: string[];
}

/**
 * Payload que representa a un tercero relacionado con la solicitud.
 */
interface TerceroPayload {
  /** Identificador del tercero */
  id_tercero: number | null;

  /** Tipo de tercero */
  tipo_tercero: string;

  /** RFC del tercero */
  rfc: string | null;

  /** Nombre del tercero */
  nombre: string | null;

  /** Apellido paterno */
  apellido_paterno: string | null;

  /** Apellido materno */
  apellido_materno: string | null;

  /** Correo electrónico */
  correo_electronico: string | null;

  /** Teléfono de contacto */
  telefono: string | null;

  /** Indicador de persona moral */
  persona_moral: boolean | null;

  /** Indicador de persona física no contribuyente */
  fisica_no_contribuyente: boolean | null;

  /** Indicador de extranjero */
  extranjero: boolean | null;

  /** Denominación (persona moral) */
  denominacion: string | null;

  /** Razón social */
  razon_social: string | null;

  /** CURP */
  curp: string | null;

  /** Calle del domicilio */
  calle: string | null;

  /** Número interior */
  numero_interior: string | null;

  /** Número exterior */
  numero_exterior: string | null;

  /** Información adicional del domicilio */
  informacion_extra: string | null;

  /** Código postal */
  codigo_postal: string | null;

  /** Clave de colonia */
  col_clave: string | null;

  /** Clave de delegación o municipio */
  deleg_mun_clave: string | null;

  /** Clave de localidad */
  loc_clave: string | null;

  /** Clave de entidad federativa */
  entidad_clave: string | null;

  /** Clave del país */
  pais_clave: string | null;
}





/**
 * Flags de certificaciones o marcas del café.
 */
interface DetallesMarcaFlags {
  calidadEspecial?: boolean;
  cafePractices?: boolean;
  avesMigratorias?: boolean;
  codigoComunidad?: boolean;
  comercioJusto?: boolean;
  euregap?: boolean;
  rainforestAlliance?: boolean;
  sistemaQ?: boolean;
  tasqNespresso?: boolean;
  utzCertified?: boolean;
  otros?: boolean;
}



@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
})
export class SolicitudPageComponent implements OnDestroy, OnInit {
  /**
   * Lista de pasos del asistente (wizard).
   */
  pasos: ListaPasosWizard[] = OCTA_TEMPO;

  /**
   * Índice actual del paso seleccionado en el asistente.
   */
  indice: number = 1;

  /**
   * Estado de la sección actual.
   */
  public seccion!: SeccionLibState;

  
  /**
   * Referencia al componente del asistente (wizard).
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /** Sujeto para manejar la destrucción del componente */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /**
   * Datos de configuración para los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente.
   * 
   * @param seccionQuery Servicio para consultar el estado de la sección.
   * @param seccionStore Servicio para gestionar el estado de la sección.
   */
  constructor(
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
        private solicitud290201Query: Solicitud290201Query,
        private solicitud290201Store:Solicitud290201Store,
            private notificacionService: NotificacionesService,
             private registrarsolicitud: RegistrarSolicitudService,
  ) { }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la sección y actualiza la propiedad `seccion`.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Selecciona una pestaña específica en el asistente.
   * 
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * Obtiene el valor del índice del paso actual y realiza la acción correspondiente.
   * 
   * @param e Objeto que contiene la acción ('cont' para continuar o 'atras' para retroceder) y el valor del índice.
   */
esFormaValido= false;
getValorIndice(e: AccionBoton): void {

  /**
   * CASO ESPECIAL:
   * Paso 1 + Continuar → llamar API
   * NO mover wizard hasta éxito
   */
  if (e.accion === 'cont' && e.valor === 1) {
 
    this.solicitud290201Store.update({ isSubmitted: true });


    const STATE = this.solicitud290201Query.getValue();
    const IS_TAB_VALID = STATE.tabDatosTramiteValid;
    
   
    const HAS_CAFE_DATA = (STATE.datosCafeGuardados || []).length > 0;
    const HAS_TABLE_DATA = (STATE.tableData || []).length > 0;

    
    if (!IS_TAB_VALID || !HAS_CAFE_DATA || !HAS_TABLE_DATA) {
      this.notificacionService.showNotification({
        tipoNotificacion: 'toastr',
        categoria: 'danger',
        mensaje: 'Por favor, complete todos los campos obligatorios.',
        titulo: 'Formulario Incompleto',
        modo: '',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar'
      });
      this.indice = 1; 
      return; 
    }
    
 
    this.solicitud290201Query
      .select()
      .pipe(take(1))
      .subscribe(tramiteState => {
        const PAYLOAD = SolicitudPageComponent._buildPayload(tramiteState);

        this.registrarsolicitud
          .guardarDatosCafe(PAYLOAD, '290201')
          .subscribe({
            next: (res: GuadarResponse<string>) => {
              if (res.codigo !== '00') {
                this.indice = 1;
                this.notificacionService.showNotification({
                  tipoNotificacion: 'toastr',
                  categoria: 'danger',
                  mensaje: res.mensaje ?? '',
                  titulo: 'Error',
                  modo: '',
                  cerrar: true,
                  txtBtnAceptar: 'Aceptar',
                  txtBtnCancelar: 'Cancelar',
                });
                return;
              }

              if (res.datos) {
                this.solicitud290201Store.setIdSolicitud(res.datos);
              }
              this.solicitud290201Store.update({ isSubmitted: false });
              this.wizardComponent.siguiente();
              this.indice = 2;
              this.datosPasos.indice = this.indice;
            },
            error: () => {
              this.indice = 1;
            }
          });
      });

    return; 
  }

  this.indice = e.valor;

  if (e.accion === 'cont') {
    this.indice += 1;
    this.wizardComponent.siguiente();
  } else {
    this.indice -= 1;
    this.wizardComponent.atras();
  }
  this.datosPasos.indice = this.indice;
}

private static _buildPayload(tramiteState: Solicitud290201State): PayloadGuardarCafe {
  return {
    id_solicitud: null,

    formas_cafe: tramiteState.formasdelcafe,
    tipos_cafe: tramiteState.tipos,
    calidad_cafe: tramiteState.calidad,
    procesos_cafe: tramiteState.procesos,
    certificaciones_cafe: tramiteState.certifications,

    clave_aduana: tramiteState.adunadesalida,
    pais_procedencia: tramiteState.paisdestino,
    entidades_solicitud: tramiteState.entidaddeprocedencia,
    descripcion_generica1: tramiteState.ciclocafetalero,

    lote: tramiteState.datosCafeGuardados.map((item): LotePayload => {
      const DATOS = item.datosDelTramiteRealizar;

      return {
       id_mercancia: null,

  numero_lote: DATOS.lote ?? null, // Lote
  cantidad_umc: DATOS.cantidad ?? null, // Cantidad
  unidad_medida_comercial: DATOS.unidaddemedida ?? null, // Unidad de medida
  importe_total_componente: DATOS.precioapplicable ?? null, // Precio applicable
  moneda: DATOS.dolar ?? null,

  descripcion_mercancia: DATOS.otrasmarcas ?? null, // Otras marcas

  boolean_generico1: DATOS.elcafe === '1', // Café con características especiales
  fecha_salida: SolicitudPageComponent._formatFecha(DATOS.fechaexportacion),

  condicion_almacenamiento_secundario: DATOS.paisdeimportacion ?? null, // País de importación
  generica2: DATOS.mediodetransporte ?? null, // Medio de transporte
  marcas_embarque: DATOS.Identificadordel ?? null, // Identificador del medio de transporte
  descripcion_tratamiento: DATOS.observaciones ?? null, // Observaciones

  aceptada: DATOS.utilizoCafeComo === '1', // Utilizó café como materia prima importada
  cantidad_presentacion: DATOS.cantidadutilizada ?? null,
  numero_oficio_caso_especial: DATOS.numerodepedimento ?? null,

  condicion_almacenamiento_primario: DATOS.paisdeimportacion ?? null,
  descripcion_otras_especificaciones: DATOS.otrasCaracteristicas ?? null,
  id_fraccion_gob: DATOS.fraccionarancelaria ?? null,

  generica1: DATOS.envasadoen ?? null, // Envasado
  detalles_marca: SolicitudPageComponent.buildDetallesMarca(
    DATOS as unknown as DetallesMarcaFlags
  )
      };
    }),

  terceros: tramiteState.tableData.map((row): TerceroPayload => {
  const DATOS = row.datosDelTramiteRealizar;
  const ISMORAL = DATOS.tipoPersona === 'moral';

  return {
    id_tercero: null,
    tipo_tercero: 'DESTINATARIO',
    rfc: null,

    nombre: ISMORAL
      ? DATOS.denominacion ?? null
      : DATOS.nombre ?? null,

    apellido_paterno: ISMORAL ? null : DATOS.primerApellido ?? null,
    apellido_materno: ISMORAL ? null : DATOS.segundoApellido ?? null,

    correo_electronico: DATOS.correoelectronico ?? null,
    telefono: DATOS.telefono !== null ? String(DATOS.telefono) : null,

  
    persona_moral: ISMORAL,
    fisica_no_contribuyente: null,
    extranjero: null,

    denominacion: null,
    razon_social: null,
    curp: null,

    calle: DATOS.domicilio ?? null,
    numero_interior: null,
    numero_exterior: null,
    informacion_extra: null,

    codigo_postal:  String(DATOS.codigopostal) ?? null,
    col_clave: null,
    deleg_mun_clave: null,
    loc_clave: null,
    entidad_clave: null,
    pais_clave: null
  };
})
  };
}
private static buildDetallesMarca(DATOS: {
  calidadEspecial?: boolean;
  cafePractices?: boolean;
  avesMigratorias?: boolean;
  codigoComunidad?: boolean;
  comercioJusto?: boolean;
  euregap?: boolean;
  rainforestAlliance?: boolean;
  sistemaQ?: boolean;
  tasqNespresso?: boolean;
  utzCertified?: boolean;
  otros?: boolean;
}): string[] {
  const BOOLEAN_FLAGS: Record<string, boolean> = {
    calidadEspecial: DATOS.calidadEspecial ?? false,
    cafePractices: DATOS.cafePractices ?? false,
    avesMigratorias: DATOS.avesMigratorias ?? false,
    codigoComunidad: DATOS.codigoComunidad ?? false,
    comercioJusto: DATOS.comercioJusto ?? false,
    euregap: DATOS.euregap ?? false,
    rainforestAlliance: DATOS.rainforestAlliance ?? false,
    sistemaQ: DATOS.sistemaQ ?? false,
    tasqNespresso: DATOS.tasqNespresso ?? false,
    utzCertified: DATOS.utzCertified ?? false,
    otros: DATOS.otros ?? false,
  };
  return Object.keys(BOOLEAN_FLAGS).filter(key => BOOLEAN_FLAGS[key]);
}
private static _formatFecha(fecha?: string): string | null {
  if (!fecha) {
    return null;
  }

 
  const NORMALIZED = fecha.replace(/-/g, '/');
  const PARTS = NORMALIZED.split('/');

 
  if (PARTS.length === 3 && PARTS[0].length === 4) {
    const [ANIO, MES, DIA] = PARTS;
    return `${ANIO}-${MES.padStart(2, '0')}-${DIA.padStart(2, '0')}`;
  }


  if (PARTS.length === 3) {
    const [DIA, MES, ANIO] = PARTS;
    return `${ANIO}-${MES.padStart(2, '0')}-${DIA.padStart(2, '0')}`;
  }

  return null;
}

   /** Limpia los recursos al destruir el componente */
   ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
