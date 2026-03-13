/**
 * @fileoverview Componente para la página de datos del trámite 260402.
 * @description Este componente gestiona la visualización y guardado de los datos
 * para el trámite con ID 260402, organizando la información en pestañas.
 */
/* eslint-disable complexity */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { PagoDeDerechosEntradaComponent } from '../../../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { PropietarioComponent } from '../../../../shared/components/propietario/propietario.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { Solocitud260402Service } from '../../services/service260402.service';

/**
 * @description
 * Componente `Datos260402Component` encargado de manejar las pestañas (tabs) 
 * en la interfaz de usuario. Proporciona la funcionalidad de selección de pestañas.
 */
@Component({
  selector: 'app-datos-260402',
  standalone: false,
  templateUrl: './datos-260402.component.html',
})
export class Datos260402Component implements OnInit {
  /**
   * @description Indica si se están mostrando los datos de respuesta.
   */
  public esDatosRespuesta: boolean = false;
  /**
   * @description Estado actual de la consulta.
   */
  public consultaState!: ConsultaioState;
  /**
   * @description Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
 * @description Índice de la pestaña actualmente seleccionada.
 * @default 1
 */
  indice = 1;

  /** 
   * @description Referencia al componente hijo `SolicitanteComponent` para acceder a sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /** 
   * @description Identificador del trámite actual utilizado en el flujo del módulo.
   * @default '260402'
   */
  tramites: string = '260402';

  /**
   * Identificador numérico único del procedimiento asociado a este componente.
   * 
   * @type {number}
   * @memberof Datos260402Component
   * @example
   *
   * idProcedimiento = 260402;
   */
  idProcedimiento: number = 260402;
  
  /** 
   * @description Referencia al componente `PropietarioComponent`, utilizada para acceder a sus métodos y propiedades. 
   */
    @ViewChild(PropietarioComponent) propietarioComponent!: PropietarioComponent;

  /** 
   * @description Referencia al componente `PagoDeDerechosEntradaComponent` para interactuar con sus métodos y datos. 
   */
    @ViewChild(PagoDeDerechosEntradaComponent) pagoDeDerechosEntradaComponent!: PagoDeDerechosEntradaComponent;

  /**
   * @description Constructor del componente.
   * @param consultaQuery Servicio para consultar el estado de la solicitud.
   * @param solocitud220401Service Servicio para manejar operaciones relacionadas con el trámite 260402.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitud220401Service: Solocitud260402Service,
  ) {}

  /**
   * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta y, dependiendo de si hay una actualización,
   * guarda los datos del formulario o muestra la respuesta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
        .subscribe((seccionState) => {
          this.consultaState = seccionState
          if (this.consultaState.update) {
             this.guardarDatosFormulario()
             } else {
              this.esDatosRespuesta = true;
            }
        })
      
    
  }
  /**
   * @description Método para seleccionar una pestaña específica.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @description Método para guardar los datos del formulario.
   * Realiza llamadas a los servicios para obtener los datos de registro y pago de derechos,
   * y actualiza el estado del formulario según la respuesta.
   */
  guardarDatosFormulario(): void {
    const ID_SOLICITUDE = this.consultaState.id_solicitud;
    this.solocitud220401Service.getRegistroTomaMuestrasMercanciasData(ID_SOLICITUDE)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        this.esDatosRespuesta = true;
        const API_RESPONSE = doDeepCopy(response);
        if(esValidObject(API_RESPONSE.datos)) {
          const DATOS = API_RESPONSE.datos;
          const REGISTRO = this.mapDatosSolicitude(DATOS);
          const PAGO_DERECHOS = this.mapPagoDeDerechos(DATOS.pagoDeDerechos);
          this.solocitud220401Service.actualizarEstadoFormulario(REGISTRO);
          this.solocitud220401Service.actualizarPagoDerechosFormulario(PAGO_DERECHOS);
        }
      });
  }

  /** 
   * @description Mapea los datos de la solicitud recibidos desde la API a la estructura requerida por el formulario.
   * @param datos - Los datos de la solicitud obtenidos de la API.
   * @returns Un objeto con los campos mapeados para el formulario.
   */
  public mapDatosSolicitude(datos: any): any {
    const ESTABLECIMIENTO = datos.establecimiento || {};
    const DOMICILIO = ESTABLECIMIENTO.domicilio || {};
    const REPRESENTANTE_LEGAL = datos.representanteLegal || {};
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
   * @description Mapea los datos de pago de derechos recibidos desde la API a la estructura requerida por el formulario.
   * @param pagoDeDerechos - Los datos de pago de derechos obtenidos de la API.
   * @returns Un objeto con los campos mapeados para el formulario de pago de derechos.
   */
  public mapPagoDeDerechos(pagoDeDerechos: any): any {
    return {
      setClaveDeReferncia: pagoDeDerechos.claveDeReferencia || '',
      setCadenaDeLaDependencia: pagoDeDerechos.cadenaPagoDependencia || '',
      setLlaveDePago: pagoDeDerechos.llaveDePago || '',
      setFechaDePago: pagoDeDerechos.fecPago || '',
      setImporteDePago: pagoDeDerechos.impPago || '',
      setBanco: pagoDeDerechos.banco && pagoDeDerechos.banco.clave ? pagoDeDerechos.banco.clave : ''
    };
  }

/** 
 * @description Valida los formularios del componente de propietario y pago de derechos, devolviendo `true` si todos son correctos. 
 * @returns `true` si los formularios son válidos, `false` en caso contrario.
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
