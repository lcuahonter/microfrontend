import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vistas/terceros-relacionados-vista.component';
import { ImportacionRetornoSanitarioService } from '../../service/importacion-retorno-sanitario.service';
import { Tramite260104Query } from '../../estados/tramite260104Query.query';
import { Tramite260104Store } from '../../estados/tramite260104Store.store';
/**
 * Componente que representa el paso uno de un trámite.
 * 
 * @selector app-paso-uno
 * @templateUrl ./paso-uno.component.html
 * @styleUrl ./paso-uno.component.scss
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() confirmarSinPagoDeDerechos: number = 0;
  @ViewChild(ContenedorDeDatosSolicitudComponent)
  contenedorDeDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;

  @ViewChild(PagoDeDerechosContenedoraComponent)
  pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

  @ViewChild(TercerosRelacionadosVistaComponent)
  tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;
  tabs = [
    { id: 1, label: 'Solicitante' },
    { id: 2, label: 'Datos de la solicitud' },
    { id: 3, label: 'Terceros relacionados' },
    { id: 4, label: 'Pago de derechos' }
  ];

  /**
  * Constructor del componente. Se inyectan servicios y queries necesarios para el flujo de datos.
  * @param consultaQuery Consulta a los datos del store.
  * @param solocitud31601Service Servicio para carga y actualización de datos del formulario.
  */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private tramite260104Query: Tramite260104Query,
    private tramite260104Store: Tramite260104Store,
    private importacionRetornoSanitarioService: ImportacionRetornoSanitarioService
  ) {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$)).subscribe((seccionState) => {
      this.consultaState = seccionState;
      if (this.consultaState && this.consultaState.procedureId === '260104' &&
        this.consultaState.update) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
    });
  }

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;
  /**
   * Índice utilizado para realizar selecciones o identificaciones de elementos. 
   * Puede ser un número o estar indefinido.
   * @type {number | undefined}
   */
  indice: number | undefined = 1;
  /**
 * Hook de inicialización del componente. Verifica el estado de actualización del store
 * y carga datos en caso necesario.
 */
  ngOnInit(): void {
    this.tramite260104Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
    this.guardarDatosFormulario();

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.esDatosRespuesta = true;
        })
      )
      .subscribe();

  }

  /**
   * Cambia el índice de la pestaña activa basado en la selección del usuario.
   * @param i El índice de la pestaña seleccionada por el usuario.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
      const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
      if (CONFIRMAR_VALOR) {
        this.seleccionaTab(CONFIRMAR_VALOR);
      }
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    const ID_SOLICITUDE = this.consultaState.id_solicitud || '202893285';
    this.importacionRetornoSanitarioService
      .getRegistroTomaMuestrasMercanciasData(ID_SOLICITUDE).pipe(
        takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          const API_RESPONSE = doDeepCopy(resp);
          if (this.consultaState.readonly) {
            if (esValidObject(API_RESPONSE.datos)) {
              const REGISTRO = PasoUnoComponent.mapMostrarApiToStore(API_RESPONSE);
              this.importacionRetornoSanitarioService.actualizarEstadoFormulario(REGISTRO);
            }
          }
        }
      });
  }
  // eslint-disable-next-line complexity
  static mapMostrarApiToStore(api: any): any {
    const DATOS = api.datos || {};

    const PAGO_DE_DERECHOS = DATOS.pagoDeDerechos || {};
    const BANCO = PAGO_DE_DERECHOS.banco || {};
    const MAPPED_PAGO_DE_DERECHOS = {
      claveReferencia: PAGO_DE_DERECHOS.claveDeReferencia || '',
      cadenaDependencia: PAGO_DE_DERECHOS.cadenaPagoDependencia || '',
      llavePago: PAGO_DE_DERECHOS.llaveDePago || '',
      fechaPago: PAGO_DE_DERECHOS.fecPago || '',
      importePago: PAGO_DE_DERECHOS.impPago || '',
      banco: BANCO.clave || ''
    };

    const ESTABLECIMIENTO = DATOS.establecimiento || {};
    const DOMICILIO = ESTABLECIMIENTO.domicilio || {};
    const REPRESENTANTE_LEGAL = DATOS.representanteLegal || {};
    const SOLICITUD = DATOS.solicitud || {};
    const MAPPED_DATOS_SOLICITUD_FORM_STATE = {
      rfcSanitario: ESTABLECIMIENTO.rfcResponsableSanitario || '',
      denominacionRazon: ESTABLECIMIENTO.razonSocial || '',
      correoElectronico: ESTABLECIMIENTO.correoElectronico || '',
      codigoPostal: DOMICILIO.codigoPostal || '',
      entidadFederativa: DOMICILIO.entidadFederativa?.clave || '',
      municipioAlcaldia: DOMICILIO.descripcionMunicipio || '',
      localidad: DOMICILIO.informacionExtra || '',
      colonia: DOMICILIO.descripcionColonia || '',
      calleYNumero: DOMICILIO.calle || '',
      calle: DOMICILIO.calle || '',
      lada: DOMICILIO.lada || '',
      telefono: DOMICILIO.telefono || '',
      aviso: ESTABLECIMIENTO.avisoFuncionamiento || '',
      licenciaSanitaria: ESTABLECIMIENTO.numeroLicencia || '',
      regimen: SOLICITUD.regimen || '',
      adunasDeEntradas: ESTABLECIMIENTO.aduanas || '',
      aeropuerto: SOLICITUD.aduanaAIFA || false,
      publico: '', 
      representanteRfc: REPRESENTANTE_LEGAL.rfc || '',
      representanteNombre: REPRESENTANTE_LEGAL.nombre || '',
      apellidoPaterno: REPRESENTANTE_LEGAL.apellidoPaterno || '',
      apellidoMaterno: REPRESENTANTE_LEGAL.apellidoMaterno || '',
    };

    const TABLA_MERCANCIAS_CONFIG_DATOS = (DATOS.mercancias || []).map((m: any) => ({
      clasificacionProducto: m.idClasificacionProducto || '',
      especificarClasificacionProducto: m.nombreSubClasificacionProducto || '',
      denominacionEspecificaProducto: m.descDenominacionEspecifica || '',
      denominacionDistintiva: m.descDenominacionDistintiva || '',
      denominacionComun: m.descripcionMercancia || '',
      formaFarmaceutica: m.formaFarmaceuticaDescripcionOtros || '',
      estadoFisico: m.estadoFisicoDescripcionOtros || '',
      fraccionArancelaria: m.fraccionArancelaria?.clave || '',
      descripcionFraccion: m.fraccionArancelaria?.descripcion || '',
      unidadMedidaComercializacion: m.unidadMedidaComercial?.descripcion || '',
      cantidadUMC: m.cantidadUMCConComas || '',
      unidadMedidaTarifa: m.unidadMedidaTarifa?.descripcion || '',
      cantidadUMT: m.cantidadUMTConComas || '',
      presentacion: m.presentacion || '',
      numeroRegistroSanitario: m.registroSanitarioConComas || '',
      paisOrigen: m.nombreCortoPaisOrigen || '',
      paisProcedencia: m.nombreCortoPaisProcedencia || '',
      tipoProducto: m.tipoProductoDescripcionOtros || '',
      usoEspecifico: m.nombreCortoUsoEspecifico || '',
      fechaDeCaducidad: m.fechaCaducidadStr || '',
      id: m.idMercancia || undefined,
    }));

    const SCIAN_CONFIG_DATOS = (DATOS.datosSCIAN || []).map((s: any) => ({
      clave: s.cveScian || '',
      descripcion: s.descripcion || '',
    }));

    return {
      pagoDerechos: MAPPED_PAGO_DE_DERECHOS,
      datosSolicitudFormState: MAPPED_DATOS_SOLICITUD_FORM_STATE,
      tablaMercanciasConfigDatos: TABLA_MERCANCIAS_CONFIG_DATOS,
      scianConfigDatos: SCIAN_CONFIG_DATOS,
    };
  }
  /**
   * @description
   * Método que se encarga de validar el primer paso del flujo.
   *
   * Invoca al método `validarContenedor()` del componente hijo
   * `ContenedorDeDatosSolicitudComponent` para comprobar si los
   * datos del formulario son correctos.
   *
   * En caso de que el componente hijo no esté disponible o
   * retorne `null/undefined`, se devuelve `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el contenedor y su formulario interno son válidos.
   * - `false`: si el contenedor no es válido o no está disponible.
   */
  validarPasoUno(): boolean {
    const ES_TAB_VALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ES_TERCEROS_VALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
    const ES_PAGO_VALIDO = this.pagoDeDerechosContenedoraComponent.validarContenedor() ?? false;
    return (
      (ES_TAB_VALIDO && ES_TERCEROS_VALIDO && ES_PAGO_VALIDO) ? true : false

    );
  }
  /**
   * Hook de destrucción del componente. Limpia las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
