/* eslint-disable complexity */

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Subject, forkJoin, map, takeUntil } from 'rxjs';
import { PagoDeDerechosEntradaComponent } from '../../../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { PropietarioComponent } from '../../../../shared/components/propietario/propietario.component';
import { Solicitud260401Service } from '../../services/service260401.service';
import { TercerosRelacionadosProcedenciaComponent } from '../../../../shared/components/terceros-relacionados-procedencia/terceros-relacionados-procedencia.component';


  interface Banco {
    clave?: string;
    [key: string]: unknown;
  }
/**
 * @comdoc
 * Componente para manejar los datos del territorio en la solicitud 260401.
 * 
 * Este componente es responsable de manejar los datos del territorio en la solicitud.
 * Permite la navegación entre los pasos de la solicitud y la actualización del índice del paso actual.
 * @implements {AfterViewInit}
 * @implements {OnInit}
 */
@Component({
  selector: 'app-datos-territorio',
  templateUrl: './datos-territorio.component.html',
})
export class DatosTerritorioComponent implements AfterViewInit, OnInit {

  /**
   * @comdoc
   * Indica si se están mostrando los datos de respuesta.
   * @type {boolean}
   */
  public esDatosRespuesta: boolean = false;
  /**
   * @comdoc
   * Estado actual de la consulta.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;
  /**
   * @comdoc
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /**
   * @comdoc
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   * @type {SolicitanteComponent}
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /** 
   * @comdoc
   * Código del trámite que identifica el proceso actual,  
   * utilizado para configurar la lógica y comportamiento del componente. 
   * @type {string}
   */
  tramites: string = '260401';

  /**
   * @property {number} idProcedimiento - Identificador único del procedimiento asociado a este trámite.
   *
   * @description
   * [Compodoc] Almacena el ID del procedimiento específico (260401) que corresponde al trámite actual.
   */

  idProcedimiento: number = 260401;

  /** 
   * @comdoc
   * Referencia al componente de pago de derechos  
   * para interactuar con sus métodos y datos desde este componente. 
   * @type {PagoDeDerechosEntradaComponent}
   */
  @ViewChild(PagoDeDerechosEntradaComponent) pagoDeDerechosEntradaComponent!: PagoDeDerechosEntradaComponent;

  /** 
   * @comdoc
   * Referencia al componente de terceros relacionados con la procedencia,  
   * usada para acceder a sus métodos y datos desde este componente. 
   * @type {TercerosRelacionadosProcedenciaComponent}
   */
  @ViewChild(TercerosRelacionadosProcedenciaComponent) tercerosRelacionadosProcedenciaComponent!: TercerosRelacionadosProcedenciaComponent;

  /** 
   * @comdoc
   * Referencia al componente de propietario,  
   * utilizada para acceder a sus métodos y propiedades desde este componente. 
   * @type {PropietarioComponent}
   */
  @ViewChild(PropietarioComponent) propietarioComponent!: PropietarioComponent;

  /**
   * @comdoc
   * Constructor del componente.
   *
   * Se inyectan los siguientes servicios:
   * - `ConsultaioQuery`: Servicio para consultar y acceder al estado de la solicitud desde la capa de estado (por ejemplo, usando Akita).
   * - `Solicitud260401Service`: Servicio que maneja las operaciones relacionadas con la solicitud 260401, como guardar, actualizar o recuperar información.
   *
   * @param {ConsultaioQuery} consultaQuery Servicio para acceder al estado reactivo de la solicitud.
   * @param {Solicitud260401Service} solicitud260401Service Servicio que gestiona las operaciones del proceso 260401.
   */
  constructor(private consultaQuery: ConsultaioQuery, private solicitud260401Service: Solicitud260401Service) {
    // Constructor del componente, se pueden inyectar servicios aquí si es necesario.
  }

   /**
    * @comdoc
    que se ejecuta al inicializar el componente.
    * Se suscribe al estado de consulta y, dependiendo de si hay una actualización,
    * guarda los datos del formulario o muestra la respuesta.
    * @returns {void}
    */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
        .subscribe((seccionState) => {
          this.consultaState = seccionState
          if (this.consultaState.update) {
             this.guardarDatosFormulario();
             } else {
              this.esDatosRespuesta = true;
            }
        })
  }

  /**
   * @comdoc
   * Método para guardar los datos del formulario.
   * Realiza llamadas a los servicios para obtener los datos de registro y pago de derechos,
   * y actualiza el estado del formulario según la respuesta.
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    const ID_SOLICITUDE = this.consultaState.id_solicitud || '203007285';
    this.solicitud260401Service.getRegistroTomaMuestrasMercanciasData(ID_SOLICITUDE)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        this.esDatosRespuesta = true;
        const API_RESPONSE = doDeepCopy(response);
        if(esValidObject(API_RESPONSE.datos)) {
          const DATOS = API_RESPONSE.datos;
          const REGISTRO:any = DatosTerritorioComponent.mapDatosSolicitude(DATOS);
          const PAGO_DERECHOS:any = DatosTerritorioComponent.mapPagoDeDerechos(DATOS.pagoDeDerechos);
          this.solicitud260401Service.actualizarEstadoFormulario(REGISTRO);
          this.solicitud260401Service.actualizarPagoDerechosFormulario(PAGO_DERECHOS);
        }
      });
  }

  /** 
   * @comdoc
   * Mapea los datos de la solicitud recibidos desde la API a la estructura requerida por el formulario.
   *
   * @param {any} datos - Los datos de la solicitud obtenidos de la API.
   * @returns {Record<string, any>} Un objeto con los campos mapeados para el formulario.
   */

  static mapDatosSolicitude(datos: any): Record<string, any> {
    const ESTABLECIMIENTO = datos.establecimiento ?? {};
    const DOMICILIO = ESTABLECIMIENTO.domicilio ?? {};
    const REPRESENTANTE_LEGAL = datos.representanteLegal ?? {};
    return {
      establecimientoDenominacionRazonSocial: ESTABLECIMIENTO.razonSocial || '',
      establecimientoCorreoElectronico: ESTABLECIMIENTO.correoElectronico || '',
      establecimientoDomicilioCodigoPostal: DOMICILIO.codigoPostal || '',
      establecimientoDomicilioEstado: DOMICILIO.entidadFederativa?.clave || '',
      establecimientoMunicipioYAlcaldia: DOMICILIO.descripcionMunicipio || '',
      establecimientoDomicilioLocalidad: DOMICILIO.informacionExtra || '',
      establecimientoDomicilioColonia: DOMICILIO.descripcionColonia || '',
      establecimientoDomicilioCalle: DOMICILIO.calle || '',
      establecimientoDomicilioLada: DOMICILIO.lada || '',
      establecimientoDomicilioTelefono: DOMICILIO.telefono || '',
      rfcDelProfesionalResponsable: ESTABLECIMIENTO.rfcResponsableSanitario || '',
      nombreDelProfesionalResponsable: '',
      representanteRfc: REPRESENTANTE_LEGAL.rfc || '',
      representanteNombre: REPRESENTANTE_LEGAL.nombre || '',
      apellidoPaterno: REPRESENTANTE_LEGAL.apellidoPaterno || '',
      apellidoMaterno: REPRESENTANTE_LEGAL.apellidoMaterno || '',
      informacionConfidencialRadio: datos.solicitud?.informacionConfidencial ? 'Si' : 'No',
      aduanaDeSalida: ESTABLECIMIENTO.aduanas && ESTABLECIMIENTO.aduanas.length > 0 ? ESTABLECIMIENTO.aduanas[0] : '',
      regimenAlQueSeDestinaraLaMercancía: datos.solicitud?.regimen || '',
      noDeLicenciaSanitariaObservaciones: '',
      noDeLicenciaSanitaria: ESTABLECIMIENTO.numeroLicencia || '',
      fechaPago: ''
    };
  }

  /** 
   * @comdoc
   * Mapea los datos de pago de derechos recibidos desde la API a la estructura requerida por el formulario.
   *
   * @param {Record<string, unknown>} pagoDeDerechos - Los datos de pago de derechos obtenidos de la API.
   * @returns {Record<string, unknown>} Un objeto con los campos mapeados para el formulario de pago de derechos.
   */

  static mapPagoDeDerechos(pagoDeDerechos: Record<string, unknown>): Record<string, unknown> {
    const BANCO = pagoDeDerechos['banco'] as Banco | undefined;
    return {
      setClaveDeReferncia: pagoDeDerechos['claveDeReferencia'] || '',
      setCadenaDeLaDependencia: pagoDeDerechos['cadenaPagoDependencia'] || '',
      setLlaveDePago: pagoDeDerechos['llaveDePago'] || '',
      setFechaDePago: pagoDeDerechos['fecPago'] || '',
      setImporteDePago: pagoDeDerechos['impPago'] || '',
      setBanco: BANCO?.clave || ''
    };
  }

  /**
   * @comdoc
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   * @returns {void}
   */
  ngAfterViewInit() :void{
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  /**
   * @comdoc
   * Índice actual del subtítulo seleccionado en la interfaz.
   * @type {number}
   */
  indice: number = 1;

  /**
   * @comdoc
   * Método para actualizar el índice del subtítulo seleccionado.
   * 
   * @param {number} i - Índice de la pestaña seleccionada.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** 
   * @comdoc
   * Valida los formularios del componente de propietario,  
   * devolviendo `true` si todos son correctos o `false` en caso contrario. 
   * @returns {boolean} `true` si los formularios son válidos, de lo contrario `false`.
   */
  public validarFormularios(): boolean { 
    const PROPIETARIO_VALIDO = this.propietarioComponent?.validarFormularios?.() ?? false;
    return PROPIETARIO_VALIDO; 
    }
  
  /** Valida los formularios del componente de pago de derechos */
  public validarPagoDerechos(): boolean {
    return this.pagoDeDerechosEntradaComponent?.validarPagoDerechosFormularios?.();
  }

  public isPagoDerechosValid(): boolean {
    return this.pagoDeDerechosEntradaComponent?.validarFormulario(); 
  }
}
