import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, forkJoin, map, takeUntil } from 'rxjs';
import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { PagoDeDerechosEntradaComponent } from '../../../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { Sanitario260906Store } from '../../../../estados/tramites/sanitario260906.store';
import { SanitarioService } from '../../services/sanitario.service';
import { TercerosRelacionadosFabSeccionComponent } from '../../../../shared/components/terceros-relacionados-fab-seccion/terceros-relacionados-fab-seccion.component';
import { TramitesAsociadosSeccionComponent } from '../../../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

/**
 * Componente principal para la gestión de datos del trámite 260906.
 * 
 * Este componente maneja la visualización y navegación entre diferentes secciones
 * de captura de datos para el trámite sanitario 260906, incluyendo:
 * - Datos de la solicitud y modificaciones
 * - Información de terceros relacionados (fabricantes, destinatarios, etc.)
 * - Pago de derechos
 * - Trámites asociados
 * 
 * Funcionalidades principales:
 * - Navegación por pestañas entre secciones
 * - Carga y guardado de datos del formulario
 * - Validación integral de todos los formularios
 * - Gestión del estado de consulta y actualización de datos
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit, OnDestroy {
  /**
   * Índice del subtítulo seleccionado.
   * Se utiliza para determinar qué sección de datos se muestra.
   * Inicialmente, el valor es 1.
   */
  indice: number = 1;

  /**
   * Referencia al componente de datos de la solicitud y modificación.
   * Se utiliza para acceder a los métodos de validación y manipulación
   * de datos del formulario de solicitud.
   */
  @ViewChild('datosdelmodificacion') datosdelmodificacion!: DatosDelSolicitudModificacionComponent;


  /**
   * Referencia al componente de trámites asociados.
   * Permite gestionar y validar información de trámites relacionados.
   */
  @ViewChild('tramitesAsociadosSeccion') tramitesAsociadosSeccion!: TramitesAsociadosSeccionComponent;

  /**
   * Cambia la pestaña activa en la interfaz de usuario.
   * 
   * Este método permite la navegación entre las diferentes secciones
   * del formulario (datos de solicitud, terceros relacionados, pago de derechos, etc.)
   * actualizando el índice de la pestaña seleccionada.
   *
   * @param i - Índice de la nueva pestaña a seleccionar (1-based)
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Estado actual de la consulta del trámite.
   * 
   * Contiene información sobre el modo de operación del componente,
   * incluyendo si se requiere actualización de datos o modo de solo lectura.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indicador de estado de carga de datos.
   * 
   * Determina si los datos del trámite han sido cargados exitosamente
   * y están listos para ser mostrados en la interfaz de usuario.
   * 
   * @default false
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para la gestión de suscripciones y prevención de fugas de memoria.
   * 
   * Se utiliza con el patrón `takeUntil` para cancelar automáticamente
   * todas las suscripciones activas cuando el componente se destruye.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Identificador único del trámite sanitario.
   * Corresponde al trámite 260906 para permisos sanitarios de importación.
   */
  public tramiteID: string = '260906';

  /**
   * Constructor del componente de datos del trámite 260906.
   * 
   * Inicializa las dependencias necesarias para la gestión de datos,
   * incluyendo servicios para obtener información del trámite,
   * consultas reactivas para el estado, y stores para el manejo del estado.
   * 
   * @param service - Servicio sanitario para operaciones de datos del trámite
   * @param consultaioQuery - Query reactiva para acceder al estado de consulta
   * @param tramiteStore - Store para gestionar el estado del trámite 260906
   * @param sanitarioStore - Store adicional para datos sanitarios (instancia duplicada)
   */
  constructor(
    private service: SanitarioService,
    private consultaioQuery: ConsultaioQuery,
    private tramiteStore: Sanitario260906Store,
    private sanitarioStore: Sanitario260906Store
  ) { }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Configura la suscripción al estado de consulta para determinar el modo
   * de operación del componente (consulta vs. actualización). Si el estado
   * indica que se debe actualizar, inicia la carga de datos del formulario;
   * de lo contrario, establece el componente en modo de respuesta directa.
   * 
   * Operaciones realizadas:
   * - Suscripción al estado de consulta reactivo
   * - Decisión del flujo de datos según el estado de actualización
   * - Iniciación de carga de datos si es necesario
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })
      )
      .subscribe();

    if (this.consultaDatos?.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Ejecuta la carga y guardado de datos del formulario desde los servicios.
   * 
   * Utiliza `forkJoin` para realizar llamadas paralelas a los servicios
   * de registro y pago de derechos, optimizando el tiempo de respuesta.
   * Una vez obtenidos los datos, actualiza el estado de los formularios
   * correspondientes y establece el componente en modo de respuesta.
   * 
   * Servicios consultados:
   * - Registro de toma de muestras de mercancías
   * - Pago de derechos del trámite
   * 
   * @remarks
   * Este método se ejecuta cuando el estado de consulta indica
   * que se requiere una actualización de datos.
   */
  guardarDatosFormulario(): void {
    forkJoin({
      registro: this.service.getRegistroTomaMuestrasMercanciasData(),
      permiso: this.service.getPagoDerechos()
    })
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(({ registro, permiso }) => {
        if (registro) {
          this.esDatosRespuesta = true;
          this.service.actualizarEstadoFormulario(registro);
        }
        if (permiso) {
          this.service.actualizarPagoDerechosFormulario(permiso);
        }
      });
  }

  /**
   * Obtiene y actualiza todos los datos del trámite desde el servicio de consulta.
   * 
   * Este método realiza una consulta completa al servicio para obtener
   * todos los datos existentes del trámite 260906 y los almacena en el store
   * correspondiente. La actualización incluye todos los campos del formulario:
   * 
   * - Datos personales y de contacto del solicitante
   * - Información del establecimiento y responsable sanitario
   * - Datos de productos y clasificaciones
   * - Información de terceros relacionados
   * - Datos de pago de derechos
   * - Configuraciones específicas del trámite
   * 
   * Solo actualiza el store si la respuesta del servicio es exitosa,
   * estableciendo además el componente en modo de respuesta directa.
   */
  public fetchGetDatosConsulta(): void {
    this.service
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.success) {
          this.esDatosRespuesta = true;

          this.tramiteStore.setRfcResponsableSanitario(respuesta?.datos?.rfcResponsableSanitario);
          this.tramiteStore.setDenominacion(respuesta?.datos?.denominacion);
          this.tramiteStore.setCorreo(respuesta?.datos?.correo);
          this.tramiteStore.setTipoOperacionJustificacion(respuesta?.datos?.tipoOperacionJustificacion);
          this.tramiteStore.setCodigoPostal(respuesta?.datos?.codigoPostal);
          this.tramiteStore.setEstado(respuesta?.datos?.estado);
          this.tramiteStore.setMuncipio(respuesta?.datos?.muncipio);
          this.tramiteStore.setLocalidad(respuesta?.datos?.localidad);
          this.tramiteStore.setColonia(respuesta?.datos?.colonia);
          this.tramiteStore.setCalle(respuesta?.datos?.calle);
          this.tramiteStore.setLada(respuesta?.datos?.lada);
          this.tramiteStore.setTelefono(respuesta?.datos?.telefono);
          this.tramiteStore.setClaveScianModal(respuesta?.datos?.claveScianModal);
          this.tramiteStore.setClaveDescripcionModal(respuesta?.datos?.claveDescripcionModal);
          this.tramiteStore.setAvisoCheckbox(respuesta?.datos?.avisoCheckbox);
          this.tramiteStore.setLicenciaSanitaria(respuesta?.datos?.licenciaSanitaria);
          this.tramiteStore.setRegimen(respuesta?.datos?.regimen);
          this.tramiteStore.setAduanasEntradas(respuesta?.datos?.aduanasEntradas);
          this.tramiteStore.setNumeroPermiso(respuesta?.datos?.numeroPermiso);
          this.tramiteStore.setTiempoPrograma(respuesta?.datos?.tiempoPrograma);
          this.tramiteStore.setClasificacion(respuesta?.datos?.clasificacion);
          this.tramiteStore.setEspecificarClasificacionProducto(respuesta?.datos?.especificarClasificacionProducto);
          this.tramiteStore.setDenominacionEspecifica(respuesta?.datos?.denominacionEspecifica);
          this.tramiteStore.setDenominacionDistintiva(respuesta?.datos?.denominacionDistintiva);
          this.tramiteStore.setDenominacionComun(respuesta?.datos?.denominacionComun);
          this.tramiteStore.setTipoDeProducto(respuesta?.datos?.tipoDeProducto);
          this.tramiteStore.setFormaFarmaceutica(respuesta?.datos?.formaFarmaceutica);
          this.tramiteStore.setEstadoFisico(respuesta?.datos?.estadoFisico);
          this.tramiteStore.setFraccionArancelaria(respuesta?.datos?.fraccionArancelaria);
          this.tramiteStore.setDescripcionFraccion(respuesta?.datos?.descripcionFraccion);
          this.tramiteStore.setCantidadUMT(respuesta?.datos?.cantidadUMT);
          this.tramiteStore.setUMT(respuesta?.datos?.UMT);
          this.tramiteStore.setCantidadUMC(respuesta?.datos?.cantidadUMC);
          this.tramiteStore.setUMC(respuesta?.datos?.UMC);
          this.tramiteStore.setPresentacion(respuesta?.datos?.presentacion);
          this.tramiteStore.setNumeroRegistro(respuesta?.datos?.numeroRegistro);
          this.tramiteStore.setFechaCaducidad(respuesta?.datos?.fechaCaducidad);
          this.tramiteStore.setCumplimiento(respuesta?.datos?.cumplimiento);
          this.tramiteStore.setRfc(respuesta?.datos?.rfc);
          this.tramiteStore.setNombre(respuesta?.datos?.nombre);
          this.tramiteStore.setApellidoPaterno(respuesta?.datos?.apellidoPaterno);
          this.tramiteStore.setApellidoMaterno(respuesta?.datos?.apellidoMaterno);
          this.tramiteStore.setTipoOperacion(respuesta?.datos?.tipoOperacion);
          this.tramiteStore.setInformacionConfidencial(respuesta?.datos?.informacionConfidencial);
          this.tramiteStore.setManifesto(respuesta?.datos?.manifesto);

          this.tramiteStore.setreferencia(respuesta?.datos?.referencia);
          this.tramiteStore.setcadenaDependencia(respuesta?.datos?.cadenaDependencia);
          this.tramiteStore.setbanco(respuesta?.datos?.banco);
          this.tramiteStore.setLlave(respuesta?.datos?.llave);
          this.tramiteStore.settipoFetch(respuesta?.datos?.tipoFetch);
          this.tramiteStore.setimporte(respuesta?.datos?.importe);
          this.tramiteStore.setSelectedEstado(respuesta?.datos?.selectedEstado);
          this.tramiteStore.setClave(respuesta?.datos?.setClave);
          this.tramiteStore.setDescripcion(respuesta?.datos?.setDescripcion);
          this.tramiteStore.setDespecificarClasificacion(respuesta?.datos?.setDespecificarClasificacion);
          this.tramiteStore.setFabricante(respuesta?.datos?.Fabricante);
          this.tramiteStore.setDestinatario(respuesta?.datos?.Destinatario);
          this.tramiteStore.setProveedor(respuesta?.datos?.Proveedor);
          this.tramiteStore.setFacturador(respuesta?.datos?.Facturador);
          this.tramiteStore.setTercerosNacionalidad(respuesta?.datos?.tercerosNacionalidad);
          this.tramiteStore.setTipoPersona(respuesta?.datos?.tipoPersona);
          this.tramiteStore.setRfc(respuesta?.datos?.rfc);
          this.tramiteStore.setCurp(respuesta?.datos?.curp);
          this.tramiteStore.setNombre(respuesta?.datos?.nombre);
          this.tramiteStore.setPrimerApellido(respuesta?.datos?.primerApellido);
          this.tramiteStore.setSegundoApellido(respuesta?.datos?.segundoApellido);
          this.tramiteStore.setDenominacionRazonSocial(respuesta?.datos?.denominacionRazonSocial);
          this.tramiteStore.setPais(respuesta?.datos?.pais);
          this.tramiteStore.setEstadoLocalidad(respuesta?.datos?.estadoLocalidad);
          this.tramiteStore.setMunicipioAlcaldia(respuesta?.datos?.municipioAlcaldia);
          this.tramiteStore.setLocalidad(respuesta?.datos?.localidad);
          this.tramiteStore.setEntidadFederativa(respuesta?.datos?.entidadFederativa);
          this.tramiteStore.setCodigoPostaloEquivalente(respuesta?.datos?.codigoPostaloEquivalente);
          this.tramiteStore.setColonia(respuesta?.datos?.colonia);
          this.tramiteStore.setColoniaoEquivalente(respuesta?.datos?.coloniaoEquivalente);
          this.tramiteStore.setCalle(respuesta?.datos?.calle);
          this.tramiteStore.setNumeroExterior(respuesta?.datos?.numeroExterior);
          this.tramiteStore.setNumeroInterior(respuesta?.datos?.numeroInterior);
          this.tramiteStore.setLada(respuesta?.datos?.lada);
          this.tramiteStore.setTelefono(respuesta?.datos?.telefono);
          this.tramiteStore.setCorreoElectronico(respuesta?.datos?.correoElectronico);
          this.tramiteStore.setExtranjeroCodigo(respuesta?.datos?.extranjeroCodigo);
          this.tramiteStore.setExtranjeroEstado(respuesta?.datos?.extranjeroEstado);
          this.tramiteStore.setExtranjeroColonia(respuesta?.datos?.extranjeroColonia);
          this.tramiteStore.setEstado(respuesta?.datos?.estado);
        }
      });
  }


  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Realiza la limpieza necesaria para prevenir fugas de memoria:
   * - Emite una señal de finalización a través del `destroyNotifier$`
   * - Completa el Subject para liberar todos los recursos asociados
   * - Cancela todas las suscripciones activas automáticamente
   * 
   * @remarks
   * Es fundamental para el correcto funcionamiento del patrón `takeUntil`
   * utilizado en las suscripciones del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Valida todos los datos de los formularios del trámite.
   * 
   * Ejecuta la validación integral de todas las secciones principales:
   * - Datos de la solicitud y modificaciones
   * - Terceros relacionados (fabricantes, destinatarios, proveedores, facturadores)
   * 
   * Este método es utilizado antes de permitir el envío o guardado
   * final del trámite para asegurar que toda la información requerida
   * esté completa y válida.
   * 
   * @returns `true` si todos los formularios son válidos, `false` en caso contrario
   */
  validarDatos(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.datosdelmodificacion?.formularioSolicitudValidacion() ?? false;
    return (DATOS_SOLICITUD_VALIDO) ? true : false;
  }
}
