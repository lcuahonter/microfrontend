import { AVISO, ConsultaioQuery, ConsultaioState, ERROR_FORMA_ALERT, JSONResponse, WizardService, doDeepCopy } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { DatosPasos, ListaPasosWizard, PASOS4, WizardComponent, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { Tramite80101State, Tramite80101Store } from '../../estados/tramite80101.store';
import { AccionBoton } from '../../models/nuevo-programa-industrial.model';
import { NuevoProgramaIndustrialService } from '../../services/nuevo-programa-industrial.service';
import { ServicioDeFormularioService } from '../../../../shared/services/forma-servicio/servicio-de-formulario.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import complimentos from '@libs/shared/theme/assets/json/shared/complimentos.json';
import empresasExtranjeras from '@libs/shared/theme/assets/json/shared/empresas-extranjeras.json';
import empresasNacionales from '@libs/shared/theme/assets/json/shared/empresas-nacionales.json';
import notarios from '@libs/shared/theme/assets/json/shared/notarios.json';
import planta from '@libs/shared/theme/assets/json/shared/planta.json';
import plantasSubmanufactureras from '@libs/shared/theme/assets/json/shared/plantas-submanufactureras.json';
import sociosAccionistas from '@libs/shared/theme/assets/json/shared/socios-accionistas.json';
/**
 * Obtiene el valor del índice de la acción del botón y actualiza el estado del componente.
 *
 * Este método se utiliza para manejar las acciones de los botones en el componente.
 * Dependiendo del valor y la acción proporcionados, actualiza el índice actual y
 * navega hacia adelante o hacia atrás en el componente Wizard.
 *
 * @param e - Un objeto de tipo `AccionBoton` que contiene dos propiedades:
 *   - `valor`: Un número que representa el índice al que se desea navegar. Debe estar entre 1 y 4.
 *   - `accion`: Una cadena que indica la acción a realizar. Puede ser:
 *     - `'cont'`: Para avanzar al siguiente paso en el Wizard.
 *     - `'atras'`: Para retroceder al paso anterior en el Wizard.
 *
 * @remarks
 * Si el valor proporcionado está fuera del rango permitido (menor que 1 o mayor que 4),
 * el método no realiza ninguna acción.
 *
 * @example
 * ```typescript
 * const accion: AccionBoton = { valor: 2, accion: 'cont' };
 * this.getValorIndice(accion); // Avanza al paso 2 en el Wizard.
 * ```
 */
@Component({
  selector: 'app-paso-capturar-solicitud',
  templateUrl: './paso-capturar-solicitud.component.html',
  providers: [ToastrService],
})
export class PasoCapturarSolicitudComponent implements OnInit, OnDestroy {

  /**
  * compo doc
  * Mensaje relacionado con el aviso de privacidad simplificado.
  * 
  * @type {string}
  * @memberof PantallasComponent
  */
    public avisoPrivacidadAlert: string = AVISO.Aviso;

  padreBtn: boolean = true;
  /**
   * Lista de pasos del wizard.
   * Esta propiedad almacena una lista de objetos que representan los pasos del wizard.
   * Cada objeto contiene información sobre el paso, como su título y descripción.
   */
  pasos: ListaPasosWizard[] = PASOS4;
  /**
   * Índice actual del paso en el wizard.
   * Este valor se utiliza para determinar qué paso se está mostrando actualmente.
   * El valor inicial es 1, lo que indica que el primer paso está activo al cargar el componente.
   */
  indice: number = 1;
 
  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;
 
  /**
   * Datos de los pasos del wizard.
   * Esta propiedad almacena información relacionada con el número de pasos, el índice actual,
   * y los textos de los botones "Anterior" y "Continuar".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /**
   * Componente Wizard utilizado para la navegación entre pasos.
   * Este componente permite al usuario avanzar o retroceder entre los pasos del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /**
 *
 * Una cadena que representa la clase CSS para una alerta de información.
 * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
 */
  public infoAlert = 'alert-info';
 
 
 
  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();
 
  /**
   * Evento que se emite para regresar a la sección de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe regresar a la sección de carga de documentos.
   */
  regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();
 
  /**
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;
 
  /**
 * Indica si la sección de carga de documentos está activa.
 * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
 */
  seccionCargarDocumentos: boolean = true;
 
  cargaEnProgreso: boolean = true;
 
  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();
 
  /** Indica si el botón Guardar debe mostrarse o estar habilitado en el formulario. */
  public btnGuardar: boolean = true;
 
  /** Indica la visibilidad del botón Guardar. */
  public btnGuardarVisible: string = 'visible';
 
  /**
   * Objeto base inmutable que representa la estructura inicial de un socio/accionista.
   */
  private complimentosBase = complimentos;
 
  /**
   * Objeto base inmutable que representa la estructura inicial de un plantas.
   */
  private plantasBase = planta;
 
  /** Listado de empresas nacionales utilizadas en el formulario de solicitud. */
  private empresasNacionales = empresasNacionales;
 
  /** Listado de empresas  extranjeras utilizadas en el formulario de solicitud. */
  private empresasExtranjeras = empresasExtranjeras;
 
  /**
   * Objeto base inmutable que representa la estructura inicial de un plantasSubmanufactureras.
   */
  private plantasSubmanufacturerasBase = plantasSubmanufactureras;
 
  /**
  * Objeto base inmutable que representa la estructura inicial de un notarios.
  */
  private notariosBase = notarios;
 
  /**
  * Objeto base inmutable que representa la estructura inicial de un sociosAccionistas.
  */
  private sociosAccionistas = sociosAccionistas;
 
  /**
  * URL de la página actual.
  */
  public solicitudState!: Tramite80101State;
  
  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  public consultaState!: ConsultaioState;
 
  /**
 * @property esFormaValido
 * @description
 * Indica si el formulario actual es válido. Se utiliza para habilitar o deshabilitar la navegación entre pasos en el wizard.
 * @type {boolean}
 * @default false
 */
  public esFormaValido!: boolean;
 
  /**
 * @property wizardService
 * @description
 * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
 * @type {WizardService}
 */
  wizardService = inject(WizardService);
 
  /**
 * @property formErrorAlert
 * @description
 * Contiene el mensaje de alerta que se muestra cuando ocurre un error en el formulario.
 * @type {string}
 */
  public formErrorAlert = ERROR_FORMA_ALERT;
 
  /**
   * Constructor de la clase PasoCapturarSolicitudComponent.
   *
   * @param tramiteQuery - Servicio de consulta para Tramite80101 que proporciona acceso a observables y datos relacionados.
   * @param seccion - Servicio de gestión de estado para manejar la sección y la validez del formulario.
   *
   * Este constructor inicializa el componente y configura una suscripción al observable `FormaValida$` del servicio `Tramite80101Query`.
   * Cuando se emite un valor desde el observable, se actualiza el estado de la sección y la validez del formulario
   * utilizando los métodos `establecerSeccion` y `establecerFormaValida` del servicio `SeccionLibStore`.
   * La suscripción se gestiona para que se complete automáticamente al destruir el componente mediante `takeUntil` y `destroyNotifier$`.
   */
  constructor(
    private nuevoProgramaIndustrialService: NuevoProgramaIndustrialService,
    private tramite80101Store: Tramite80101Store,
    private tramite80101Query: Tramite80101Query,
    private toastrService: ToastrService,
    private consultaQuery: ConsultaioQuery,
    private servicioDeFormularioService: ServicioDeFormularioService,
    
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }
 
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable `selectSeccionState$` para escuchar cambios en el estado de la sección,
   * actualizando la propiedad `solicitudState` con el nuevo estado recibido.
   * La suscripción se cancela automáticamente cuando se emite un valor en `destroyNotifier$`,
   * evitando fugas de memoria.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      ).subscribe();
 
    this.tramite80101Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      ).subscribe();
  }
 
  /**
 * @method verificarLaValidezDelFormulario
 * @description
 * Este método verifica la validez de los formularios dinámicos asociados a los pasos del wizard.
 * @returns {boolean} - Indica si todos los formularios son válidos.
 */
  verificarLaValidezDelFormulario(): boolean {
    const valid1 = this.servicioDeFormularioService.isFormValid('datosGeneralisForm') ?? false;
    const valid2 = this.servicioDeFormularioService.isFormValid('formaModificacionesForm') ?? false;
    const valid3 = this.servicioDeFormularioService.isFormValid('obligacionesFiscalesForm') ?? false;
    const valid4 = this.servicioDeFormularioService.isFormValid('federatariosCatalogoForm') ?? false;
    const validSocios = (this.servicioDeFormularioService.isArrayFilled('datosSocioAccionistas') ?? false) ||
                        (this.servicioDeFormularioService.isArrayFilled('datosSocioAccionistasExtrenjeros') ?? false);

    const arrayNames = ['anexoUnoTabla1', 'anexoUnoTabla2', 'federatariosDatostable', 'plantasImmexDatos', 'datosTablaSubfabricantesSeleccionadas', 'anexoTresTablaLista'];
    const arrayStatus = arrayNames.map(name => ({
      name,
      filled: this.servicioDeFormularioService.isArrayFilled(name)
    }));
    const validArrays = arrayStatus.every(arr => arr.filled);

   
    return valid1 && valid2 && valid3 && valid4 && validSocios && validArrays;
  }
 
  /** Verifica que todos los arreglos indicados estén llenos en el formulario del trámite 80101. */
  isAllArraysFilledIn80101(array: string[]): boolean {
    return array.every(item => this.servicioDeFormularioService.isArrayFilled(item));
  }
  /**
   * Obtiene el valor del índice de la acción del botón.
   * @param e - event$: Acción del botón.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor <= this.pasos.length) {
      const NEXT_INDEX =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
      if (!this.consultaState.readonly && e.accion === 'cont') {
        if (!this.consultaState.update) {
         this.esFormaValido = this.verificarLaValidezDelFormulario();
          if (!this.esFormaValido) {
            this.indice = e.valor;
            this.datosPasos.indice = e.valor;
            this.servicioDeFormularioService.markFormAsTouched('datosGeneralisForm');
            this.servicioDeFormularioService.markFormAsTouched('formaModificacionesForm');
            this.servicioDeFormularioService.markFormAsTouched('obligacionesFiscalesForm');
            this.servicioDeFormularioService.markFormAsTouched('federatariosCatalogoForm');
            return;
          }
        }
      this.shouldNavigate$()
          .subscribe((shouldNavigate) => {
            if (shouldNavigate) {
              this.indice = NEXT_INDEX;
              this.datosPasos.indice = NEXT_INDEX;
              this.wizardService.cambio_indice(NEXT_INDEX);
              this.wizardComponent.siguiente();
            } else {
              this.indice = e.valor;
              this.datosPasos.indice = e.valor;
            }
          });
      } else if (e.accion === 'cont') {
        this.shouldNavigate$()
          .subscribe((shouldNavigate) => {
            if (shouldNavigate) {
              this.indice = NEXT_INDEX;
              this.datosPasos.indice = NEXT_INDEX;
              this.wizardService.cambio_indice(NEXT_INDEX);
              this.wizardComponent.siguiente();
            } else {
              this.indice = e.valor;
              this.datosPasos.indice = e.valor;
            }
          });
      } else {
        this.indice = NEXT_INDEX;
        this.datosPasos.indice = NEXT_INDEX;
        this.wizardComponent.atras();
      }
    }
  }
 
  /**
 * Maneja la lógica para actualizar el índice del paso del wizard según el evento del botón de acción proporcionado.
 *
 * Este método obtiene el estado actual desde `nuevoProgramaIndustrialService`, lo guarda,
 * y muestra un mensaje de éxito o error dependiendo del código de respuesta. Si la respuesta es exitosa
 * y el valor del evento está dentro del rango válido (1 a 4), actualiza el índice del wizard y navega
 * hacia adelante o atrás según el tipo de acción.
 *
 * @param e - El evento del botón de acción que contiene el valor y el tipo de acción.
 */
  private shouldNavigate$(): Observable<boolean> {
    return this.nuevoProgramaIndustrialService.getAllState().pipe(
      take(1),
      switchMap(data => this.guardar(data)),
      map(response => {
        const DATOS = doDeepCopy(response);
        const OK = response.codigo === '00';
        if (OK) {
          this.toastrService.success(DATOS.mensaje);
        } else {
          this.padreBtn = true;
          this.toastrService.error(DATOS.mensaje);
        }
        return OK;
      })
    );
  }
 
  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.nuevoProgramaIndustrialService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
      });
  }
 
  /**
   * Guarda los datos proporcionados enviándolos al servidor mediante el servicio `nuevoProgramaIndustrialService`.
   *
   * @param data - Los datos que se desean guardar y enviar al servidor.
   * @returns void
   */
  guardar(data: Tramite80101State): Promise<JSONResponse> {
    const PLANTAS = this.nuevoProgramaIndustrialService.buildPlantas(data.plantasImmexTablaLista, this.plantasBase, data);
    const PLANTAS_SUBMANUFACTURERAS = this.nuevoProgramaIndustrialService.buildPlantasSubmanufactureras(
      Array.isArray(this.plantasSubmanufacturerasBase) ? this.plantasSubmanufacturerasBase : [this.plantasSubmanufacturerasBase],
      Array.isArray(data.empressaSubFabricantePlantas?.plantasSubfabricantesAgregar) ? data.empressaSubFabricantePlantas.plantasSubfabricantesAgregar : []
    );
    let SOLICITUD = this.nuevoProgramaIndustrialService.buildComplimentos(data as unknown as Record<string, unknown>, this.complimentosBase);
    ((SOLICITUD['notario'] as { entidadFederativa: string })).entidadFederativa = 'SON';
    const DECLARACION_SOLICUTUD_ENTRIES = this.nuevoProgramaIndustrialService.buildDeclaracionSolicitudEntries(data as unknown as Record<string, unknown>);
    const NOTARIOS = this.nuevoProgramaIndustrialService.buildDatosFederatarios(data.tablaDatosFederatarios, this.notariosBase);
    const ANEXO_ALL = this.nuevoProgramaIndustrialService.buildAnexo(data);
    const SOCIOS_ACCIONISTAS = this.nuevoProgramaIndustrialService.buildSociosAccionistas(
      Array.isArray(data.tablaDatosComplimentos) ? data.tablaDatosComplimentos : [],
      Array.isArray(data.tablaDatosComplimentosExtranjera) ? data.tablaDatosComplimentosExtranjera : [],
      Array.isArray(this.sociosAccionistas) ? this.sociosAccionistas[0] : this.sociosAccionistas
    );
function convertTestadoRecursive(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertTestadoRecursive);
  } else if (obj && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (key === 'testado') {
        newObj[key] = obj[key] === '1';
      } else {
        newObj[key] = convertTestadoRecursive(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}
const plantArray = convertTestadoRecursive(Array.isArray(PLANTAS) ? [...PLANTAS] : [PLANTAS]);
const plantasSubmanufactureras = convertTestadoRecursive([...PLANTAS_SUBMANUFACTURERAS]);
const PAYLOAD = {

   "cveRolCapturista":"PersonaMoral",
    "tipoDeSolicitud": "guardar",
    "idSolicitud": 0,
    "idTipoTramite": 80101,
    "rfc": "AAL0409235E6",
    "cveUnidadAdministrativa": data.datosFederatarios.estadoDos ?? "8101",
    "costoTotal": 10000.5,
    "certificadoSerialNumber": "1234567890ABCDEF",
    "certificado": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A",
    "numeroFolioTramiteOriginal": "TRM-2023-00001",
    "nombre": "Juan",
    "apPaterno": "Pérez",
    "apMaterno": "López",
    "telefono": "5551234567",
    "solicitud": SOLICITUD,
    "notarios":[...NOTARIOS],
    "planta": plantArray,
    "capacidadProduccion": [
        {
            "unidadMedidaTarifaria": "2",
            "capacidadInstalada": "000000000000010125",
            "porccentajeUtilizado": 40,
            "descripcionUnidadMedida": "test",
            "fraccionCap": "test",
            "cveFraccion": "string"
        }
    ],
    "plantasSubmanufactureras": plantasSubmanufactureras,

    "plantasControladoras": [
        {
            "idPlanta": "123",
            "calle": "Main St",
            "numeroInterior": "A",
            "numeroExterior": "10",
            "codigoPostal": "12345",
            "colonia": "FRACC. CUAUHTEMOC",
            "delegacionMunicipio": "MunicipioX",
            "entidadFederativa": "EntidadY",
            "pais": "Mexico",
            "rfc": "RFC123456",
            "domicilioFiscal": "Fiscal Address",
            "razonSocial": "Empresa S.A.",
            "claveEntidadFederativa": "SIN",
            "clavePlantaEmpresa": "PLT01",
            "clavePais": "MEX",
            "claveDelegacionMunicipio": "25001",
            "estatus": true,
            "desEstatus": "Activo",
            "localidad": "Localidad1",
            "telefono": "5551234567",
            "fax": "5557654321",
            "idDireccion": "DIR123",
            "testadoP": 1,
            "empresaCalle": "Empresa St",
            "empresaNumeroInterior": "B",
            "empresaNumeroExterior": "20",
            "empresaCodigoPostal": "54321",
            "empresaColonia": "EmpColonia",
            "empresaDelegacionMunicipio": "EmpMunicipio",
            "empresaEntidadFederativa": "EmpEntidad",
            "empresaPais": "Mexico",
            "empresaClaveEntidadFederativa": "EF02",
            "empresaClavePlantaEmpresa": "PLT02",
            "empresaClavePais": "MX",
            "empresaClaveDelegacionMunicipio": "DM02",
            "empresaCorreoElectronico": "empresa@email.com",
            "empresaTipo": "Tipo1",
            "permaneceMercancia": "Si",
            "rfcActivo": "RFC654321",
            "domiciliosInscritos": "2",
            "personaMoralISR": "Si",
            "opinionSAT": "Positiva",
            "fecha32D": "2024-06-01",
            "firmantes": [
                {
                    "idPlantaF": "FIRM01",
                    "tipoFirmante": "Representante Legal",
                    "descTipoFirmante": "Legal Representative"
                }
            ],
            "datosComplementarios": [
                {
                    "idPlantaC": "C01",
                    "idDato": "D01",
                    "amparoPrograma": "ProgramaX",
                    "tipoDocumento": "DocType1",
                    "descDocumento": "Documento de respaldo",
                    "descripcionOtro": "Otro documento",
                    "documentoRespaldo": "Respaldo.pdf",
                    "descDocRespaldo": "Descripción respaldo",
                    "respaldoOtro": "Otro respaldo",
                    "fechaFirma": "2024-01-01",
                    "fechaVigencia": "2025-01-01",
                    "fechaFirmaRespaldo": "2024-01-02",
                    "fechaVigenciaRespaldo": "2025-01-02"
                }
            ],
            "montos": [
                {
                    "idPlantaM": "M01",
                    "idMonto": "MON01",
                    "tipo": "Inversión",
                    "descTipo": "Inversión inicial",
                    "cantidad": "1000",
                    "descripcion": "Monto de inversión",
                    "monto": "500000",
                    "testado": "1",
                    "descTestado": "Testado OK"
                }
            ],
            "listaCapacidad": [
                {
                    "idPlantaCa": "CA01",
                    "idCapacidad": "CAP01",
                    "claveServicio": "1",
                    "descripcionServicio": "Servicio de producción",
                    "cveTipoServicio": "TS01",
                    "tipoServicio": "Producción",
                    "fraccion": "FR01",
                    "fraccionVista": "Fracción Vista",
                    "umt": "UMT01",
                    "descripcion": "Capacidad instalada",
                    "capacidadEfectiva": "10000",
                    "calculo": "Manual",
                    "turnos": "3",
                    "horasTurno": "8",
                    "cantidadEmpleados": "50",
                    "cantidadMaquinaria": "10",
                    "descripcionMaquinaria": "Maquinaria industrial",
                    "capacidadMensual": "300000",
                    "capacidadAnual": "3600000",
                    "testado": "1",
                    "descTestado": "Testado OK"
                }
            ],
            "datosEmpleados": [
                {
                    "idPlantaE": "E01",
                    "idEmpleados": "EMP01",
                    "totalEmpleados": "100",
                    "directos": "80",
                    "cedula": "CED123",
                    "fechaCedula": "2024-01-10",
                    "indirectos": "20",
                    "contrato": "ContratoX",
                    "objetoContrato": "Objeto del contrato",
                    "fechaFirma": "2024-01-15",
                    "fechaFinVigencia": "2025-01-15",
                    "rfcEmpresa": "RFCEMP123",
                    "razonEmpresa": "Empresa Empleadora",
                    "testado": true,
                    "descTestado": "Testado OK"
                }
            ]
        }
    ],
    "plantasTerciarizadoras": [
        {
            "idPlanta": "123",
            "calle": "Main St",
            "numeroInterior": "A",
            "numeroExterior": "10",
            "codigoPostal": "12345",
            "colonia": "FRACC. CUAUHTEMOC",
            "delegacionMunicipio": "MunicipioX",
            "entidadFederativa": "EntidadY",
            "pais": "Mexico",
            "rfc": "RFC123456",
            "domicilioFiscal": "Fiscal Address",
            "razonSocial": "Empresa S.A.",
            "claveEntidadFederativa": "SIN",
            "clavePlantaEmpresa": "PLT01",
            "clavePais": "MEX",
            "claveDelegacionMunicipio": "25001",
            "estatus": true,
            "desEstatus": "Activo",
            "localidad": "Localidad1",
            "telefono": "5551234567",
            "fax": "5557654321",
            "idDireccion": "DIR123",
            "testadoP": 1,
            "empresaCalle": "Empresa St",
            "empresaNumeroInterior": "B",
            "empresaNumeroExterior": "20",
            "empresaCodigoPostal": "54321",
            "empresaColonia": "EmpColonia",
            "empresaDelegacionMunicipio": "EmpMunicipio",
            "empresaEntidadFederativa": "EmpEntidad",
            "empresaPais": "Mexico",
            "empresaClaveEntidadFederativa": "EF02",
            "empresaClavePlantaEmpresa": "PLT02",
            "empresaClavePais": "MX",
            "empresaClaveDelegacionMunicipio": "DM02",
            "empresaCorreoElectronico": "empresa@email.com",
            "empresaTipo": "Tipo1",
            "permaneceMercancia": "Si",
            "rfcActivo": "RFC654321",
            "domiciliosInscritos": "2",
            "personaMoralISR": "Si",
            "opinionSAT": "Positiva",
            "fecha32D": "2024-06-01",
            "firmantes": [
                {
                    "idPlantaF": "FIRM01",
                    "tipoFirmante": "Representante Legal",
                    "descTipoFirmante": "Legal Representative"
                }
            ],
            "datosComplementarios": [
                {
                    "idPlantaC": "C01",
                    "idDato": "D01",
                    "amparoPrograma": "ProgramaX",
                    "tipoDocumento": "DocType1",
                    "descDocumento": "Documento de respaldo",
                    "descripcionOtro": "Otro documento",
                    "documentoRespaldo": "Respaldo.pdf",
                    "descDocRespaldo": "Descripción respaldo",
                    "respaldoOtro": "Otro respaldo",
                    "fechaFirma": "2024-01-01",
                    "fechaVigencia": "2025-01-01",
                    "fechaFirmaRespaldo": "2024-01-02",
                    "fechaVigenciaRespaldo": "2025-01-02"
                }
            ],
            "montos": [
                {
                    "idPlantaM": "M01",
                    "idMonto": "MON01",
                    "tipo": "Inversión",
                    "descTipo": "Inversión inicial",
                    "cantidad": "1000",
                    "descripcion": "Monto de inversión",
                    "monto": "500000",
                    "testado": "1",
                    "descTestado": "Testado OK"
                }
            ],
            "listaCapacidad": [
                {
                    "idPlantaCa": "CA01",
                    "idCapacidad": "CAP01",
                    "claveServicio": "1",
                    "descripcionServicio": "Servicio de producción",
                    "cveTipoServicio": "TS01",
                    "tipoServicio": "Producción",
                    "fraccion": "FR01",
                    "fraccionVista": "Fracción Vista",
                    "umt": "UMT01",
                    "descripcion": "Capacidad instalada",
                    "capacidadEfectiva": "10000",
                    "calculo": "Manual",
                    "turnos": "3",
                    "horasTurno": "8",
                    "cantidadEmpleados": "50",
                    "cantidadMaquinaria": "10",
                    "descripcionMaquinaria": "Maquinaria industrial",
                    "capacidadMensual": "300000",
                    "capacidadAnual": "3600000",
                    "testado": "1",
                    "descTestado": "Testado OK"
                }
            ],
            "datosEmpleados": [
                {
                    "idPlantaE": "E01",
                    "idEmpleados": "EMP01",
                    "totalEmpleados": "100",
                    "directos": "80",
                    "cedula": "CED123",
                    "fechaCedula": "2024-01-10",
                    "indirectos": "20",
                    "contrato": "ContratoX",
                    "objetoContrato": "Objeto del contrato",
                    "fechaFirma": "2024-01-15",
                    "fechaFinVigencia": "2025-01-15",
                    "rfcEmpresa": "RFCEMP123",
                    "razonEmpresa": "Empresa Empleadora",
                    "testado": true,
                    "descTestado": "Testado OK"
                }
            ]
        }
    ],
     "productoExportacionDtoList": [
        {
            "testado": true,
            "claveServicioImmex": null,
            "tipoFraccion": "TIPD.EX",
            "claveProductoExportacion": 343,
            "visible": true,
            "fraccionPadre": null,
            "replica": true,
            "activo": true,
            "idProductoExp": null,
            "complemento": {
                "anexoII": "NO SENSIBLE",
                "tipo": "EXPORTACION",
                "unidadMedida": "Kilogramo",
                "categoria": "TICAT.MP",
                "descripcion": "DEJ JLFKDSFDSFSDF",
                "valorMensual": "12",
                "valorAnual": "432",
                "volumenMensual": "5435",
                "volumenAnual": "534",
                "testado": true,
                "fecFinVigencia": "2025-09-07",
                "volumenAnualSolicitado": null
            },
            "fraccionCompuesta": null,
            "cveServicioImmex": {
                "claveServicio": null,
                "nombre": "ABASTECIMIENTO, ALMACENAJE O DISTRIBUCION DE MERCANCIAS",
                "tipoServicio": "TISIMMEX.TN",
                "blnActivo": true,
                "fechaInicioVigencia": "2025-09-07",
                "fechaFinVigencia": "2025-09-07"
            },
            "cveSector": null,
            "idSectorProsecSol": 0,
            "blnFraccionSeleccionada": 0,
            "descripcionTestado": null,
            "proyectosImmex": [
                {
                    "tipoDocumento": "TIDPI.CM",
                    "descripcion": null,
                    "fechaFirma": "04/09/2025",
                    "fechaVigencia": "04/09/2025",
                    "rfcFirmante": "AAL0409235E6",
                    "razonFirmante": "SILVA",
                    "testado": true,
                    "fecFinVigencia": "2025-09-07"
                }
            ],
            "proyectosClientes": [
                {
                    "paisOrigen": "AUSTIRA",
                    "rfcProveedor": "WERWSV",
                    "razonProveedor": "WER QWER QW",
                    "paisDestino": "ANTARTIDA",
                    "rfcClient": "AAL0409235E6",
                    "razonCliente": "CLICNTE UNO ",
                    "domicilioCliente": null,
                    "testado": true,
                    "fecFinVigencia": "2025-09-07"
                }
            ],
            "fraccionArancelaria": {
                "fraccionPadre": "string",
                "descripcionFraccionPadre": "string",
                "tipoFraccion": "string",
                "exenta": true,
                "fraccionCompuesta": "string",
                "claveFraccionPadre": "string",
                "unidadMedida": "string",
                "fraccionConcatenada": "string",
                "descripcionTestado": "string",
                "testado": true,
                "tipoOperacion": "string",
                "valorMonedaMensual": "string",
                "valorMonedaAnual": "string",
                "valorProduccionMensual": "string",
                "valorProduccionAnual": "string",
                "valorProduccionAnualSolicitada": "string",
                "claveCategoria": "string",
                "descripcionCategoria": "string",
                "mensaje": "string",
                "descripcionUsuario": "string",
                "umt": "string",
                "idFraccion": "string",
                "idProducto": "string",
                "idProductoPadre": "string",
                "claveProductoExportacion": 0,
                "descripcionServicio": "string",
                "rowID": "string",
                "cveFraccion": "61032301",
                "capitulo": "string",
                "partida": "string",
                "subPartida": "string",
                "descripcion": "string",
                "fechaCaptura": "2025-09-07T12:43:35.647Z",
                "fechaInicioVigencia": "2025-09-07T12:43:35.647Z",
                "fechaFinVigencia": "2025-09-07T12:43:35.647Z",
                "cveUsuario": "string",
                "cveCapituloFraccion": "string",
                "cvePartidaFraccion": "string",
                "cveSubPartidaFraccion": "string",
                "activo": true,
                "activoAnexo28": true,
                "decretoImmex": true,
                "sector": [
                    {
                        "cveSector": "string",
                        "nombre": "string",
                        "productorIndirecto": 0,
                        "ampliacionMercancias": 0,
                        "fechaInicioVigencia": "2025-09-07T12:43:35.647Z",
                        "fechaFinVigencia": "2025-09-07T12:43:35.647Z",
                        "blnActivo": 0
                    }
                ],
                "cveServicioImmex": {
                    "claveServicio": 1,
                    "nombre": "string",
                    "tipoServicio": "string",
                    "fechaInicioVigencia": "2025-09-07T12:43:35.647Z",
                    "fechaFinVigencia": "2025-09-07T12:43:35.647Z",
                    "blnActivo": true
                },
                "listaProveedores": [
                    {
                        "idProveedor": "string",
                        "paisOrigen": "string",
                        "rfcProveedor": "string",
                        "razonProveedor": "string",
                        "paisDestino": "string",
                        "rfcCliente": "string",
                        "razonCliente": "string",
                        "domicilio": "string",
                        "testado": true,
                        "idProductoP": "string",
                        "descTestado": "string"
                    }
                ],
                "listaProyecto": [
                    {
                        "idProyecto": "string",
                        "tipoDocumento": "string",
                        "descDocumento": "string",
                        "otro": "string",
                        "fechaIncio": "string",
                        "fechaFin": "string",
                        "firmante": {
                            "idFirmante": "string",
                            "rfc": "string",
                            "razonSocial": "string",
                            "claveFraccion": "string"
                        },
                        "testado": "string",
                        "idProducto": "string",
                        "descTestado": "string"
                    }
                ],
                "nicoDtos": [
                    {
                        "claveNico": "00",
                        "descripcion": "string",
                        "testadoNico": "string",
                        "testadoInt": true
                    }
                ]
            }
        }
    ],
    "mercanciaImportacion":  [
        {
          "listaProveedores": [
            ...(Array.isArray(ANEXO_ALL.anexo['proveedorCliente']) ? ANEXO_ALL.anexo['proveedorCliente'] : [])
          ],
          "complemento": {
            ...(typeof ANEXO_ALL.anexo['datosParaNavegar'] === 'object' && ANEXO_ALL.anexo['datosParaNavegar'] !== null ? ANEXO_ALL.anexo['datosParaNavegar'] : {})
          },
          "anexoI": Array.isArray(ANEXO_ALL.anexo['tableDos']) ? [...ANEXO_ALL.anexo['tableDos']] : []
        },
      ],
    "anexoII":Array.isArray(ANEXO_ALL.anexo['ANEXOII']) ? [...ANEXO_ALL.anexo['ANEXOII']] : [],
    "anexoIII": Array.isArray(ANEXO_ALL.anexo['ANEXOIII']) ? [...ANEXO_ALL.anexo['ANEXOIII']] : [],
    "fraccionesSensibles": [
        {
            "claveSencible": 0,
            "complemento": "00001",
            "unidadMedidaTarifaria": "1",
            "cantidad": "300000.0",
            "valor": "20000.00",
            "fraccionPadre": "61032301",
            "descUnidadMedida": null,
            "fechaInicioVigencia": "2025-09-07",
            "fechaFinVigencia": "2025-09-07",
            "cveFraccion": "string"
        }
    ],
    "fraccionesTextiles": [
        {
            "proyeccionExportacion": 120000.0,
            "numeroTrabajadores": 8,
            "maximoImportaciones": 120000.0,
            "factorAmpliacion": 0.00,
            "maxImportaciones": null,
            "proyeccionConsulta": null,
            "fechaInicioVigencia": "2025-09-07",
            "fechaFinVigencia": "2025-09-07"
        }
    ],
    "servicios": [
        {
            "tipoServicio": "TIFRP.EX",
            "testado": true,
            "claveServicio": 1,
            "descripcion": null,
            "descripcionTipo": null,
            "descripcionTestado": null,
            "estatus": true,
            "desEstatus": null,
            "fecIniVigencia": "2025-09-07",
            "fecFinVigencia": "2025-09-07"
        }
    ],
    "empresasNacionales": [
        {
            "tipoEmpresa": "1",
            "caracterEmpresa": "",
            "montoExportacionesUSD": 0,
            "numeroProgramaDGCESE": "",
            "porcentajeParticipacionAccionaria": 0,
            "porcentajeParticionAccionariaExt": 0,
            "nombre": "",
            "apellidoPaterno": "",
            "apellidoMaterno": "",
            "razonSocial": "COMPA¿A MEXICANA DE TRAJES, S.A. DE C.V.",
            "rfc": "MTR8012148K9",
            "certificada": false,
            "correoElectronico": "trafico@mextrajes.com",
            "idDireccionSol": 112053,
            "testado": false,
            "fechaInicioVigencia": "2025-09-07",
            "fechaFinVigencia": "2025-09-07",
            "blnActivo": true,
            "idServicio": "0",
            "descripcionServicio": "",
            "domicilioCompleto": "",
            "numeroPrograma": "",
            "tiempoPrograma": "",
            "descripcionTestado": "",
            "idCompuestoEmpresa": "",
            "idServicioAutorizado": 0,
            "domicilioSolicitud": {
                "codigoPostal": "w93w9393",
                "informacionExtra": "3939393"
            }
        }
    ],
    "sectoresImmex": [
        {
            "idSolicitud": 0,
            "idAtributo": 0,
            "cveEnumeracionH": "string",
            "cveEnumeracion": "string",
            "blnEstado": true,
            "descGenerica1": "string",
            "importeGenerico1": 0,
            "fecGenerica1": "2025-09-07"
        }
    ],
    "actividadProductivaTres": [
        {
            "idSolicitud": 0,
            "idAtributo": 0,
            "cveEnumeracionH": "string",
            "cveEnumeracion": "string",
            "blnEstado": 0,
            "fecGenerica1": "2025-09-03",
            "descGenerica1": "string",
            "importeGenerico1": 0
        }
    ],
    "sociosAccionistas": [...SOCIOS_ACCIONISTAS],
    "fraccionesAnexoDos": [
        {
            "claveFraccion": "02101999",
            "descripcion": "FDSF DSFS",
            "testado": true,
            "fecFinVigencia": null,
            "descTestado": null,
            "idFraccion": null
        }
    ],
    "fraccionesAnexoTres": [
        {
            "claveFraccion": "02101999",
            "descripcion": "FDSF DSFS",
            "testado": true,
            "fecFinVigencia": null,
            "descTestado": null,
            "idFraccion": null
        }
    ],
    "empresasExtranjeras": [
        {
            "tipoEmpresa": "1",
            "caracterEmpresa": "",
            "montoExportacionesUSD": 0,
            "numeroProgramaDGCESE": "",
            "porcentajeParticipacionAccionaria": 0,
            "porcentajeParticionAccionariaExt": 0,
            "nombre": "",
            "apellidoPaterno": "",
            "apellidoMaterno": "",
            "razonSocial": "COMPA¿A MEXICANA DE TRAJES, S.A. DE C.V.",
            "rfc": "MTR8012148K9",
            "certificada": false,
            "correoElectronico": "trafico@mextrajes.com",
            "idDireccionSol": 112053,
            "testado": false,
            "fechaInicioVigencia": "2025-09-07",
            "fechaFinVigencia": "2025-09-07",
            "blnActivo": true,
            "idServicio": "0",
            "descripcionServicio": "",
            "domicilioCompleto": "",
            "numeroPrograma": "",
            "tiempoPrograma": "",
            "descripcionTestado": "",
            "idCompuestoEmpresa": "",
            "idServicioAutorizado": 0,
            "domicilioSolicitud": {
                "codigoPostal": "dhdjjd",
                "informacionExtra": "83938"
            }
        }
    ],
    "programaImmex": {
        "folioPrograma": "string",
        "tipoPrograma": "string",
        "movimientoProgramaSE": "string",
        "rfc": "MTR8012148K9",
        "anioPrograma": 0,
        "fechaInicioVigencia": "2025-09-03",
        "fechaFinVigencia": "2025-09-03",
        "actividadProductiva": "string",
        "fechaSuspension": "2025-09-03",
        "modalidad": "string",
        "numeroImmex": "string",
        "resolucionId": 0,
        "unidadAdministrativaId": 0
    },
   "declaracionSolicitudEntities": DECLARACION_SOLICUTUD_ENTRIES,
    "claveModalidadActual": "MOD-123",
    "datosCertificacion": "CERT-001",
    "montoImportaciones": 500000,
    "factorAmpliacion": 1.2,
    "proyeccion": 750000,
    "trabajadores": 150,
    "id_solicitud": 12345,
    "discriminatorValue": "80101",
    "certificacion_sat": "CERTIFICADO",
    "unidadAdministrativaRepresentacionFederal": {
        "clave": "string",
        "idDependencia": 0,
        "claveEntidad": "string",
        "claveUnidadAdminR": "string",
        "ideTipoUnidadAdministrativa": "string",
        "nivel": 0,
        "acronimo": "string",
        "nombre": "string",
        "descripcion": "string",
        "fechaInicioVigencia": "2025-09-08",
        "fechaFinVigencia": "2025-09-08",
        "activo": true,
        "idDireccion": 0,
        "fronteriza": true
    },
    "programaAutorizadoEconomia": {
        "idProgramaAutorizado": 0,
        "folioPrograma": "string",
        "tipoPrograma": "string",
        "movimientoProgramaSE": "string",
        "rfc": "MTR8012148K9",
        "anioPrograma": 0,
        "resolucionId": 0,
        "unidadAdministrativaId": 0,
        "fechaInicioVigencia": "2025-09-08",
        "fechaFinVigencia": "2025-09-08",
        "actividadProductiva": "string",
        "fechaSuspension": "2025-09-08"
    },
    "domicilio": {
        "idDomicilio": 0,
        "calle": "string",
        "numeroExterior": "string",
        "numeroInterior": "string",
        "codigoPostal": "string",
        "informacionExtra": "string",
        "clave": "string",
        "cveLocalidad": "string",
        "cveDelegMun": "string",
        "cveEntidad": "string",
        "cvePais": "string",
        "ciudad": "string",
        "telefono": "string",
        "fax": "string",
        "municipio": "string",
        "colonia": "string",
        "descUbicacion": "string",
        "cveCatalogo": "string",
        "telefonos": "string",
        "tipoDomicilio": 0
    },
    "solicitante": {
        "idPersonaPersonaSolicitudR": 0,
        "idSolicitud": 202734824,
        "nombre": "",
        "apellidoMaterno": "",
        "apellidoPaterno": "",
        "razonSocial": "AGRICOLA ALPE S DE RL DE CV",
        "rfc": "AAL0409235E6",
        "curp": "",
        "ideTipoPersonaSol": "TIPERS.SL",
        "correoElectronico": "vucem.soporte.aplicativo@ultrasist.com.mx",
        "cedulaProfesional": "",
        "nss": "",
        "telefono": "8154563",
        "descripcionGiro": "Siembra, cultivo y cosecha de papa",
        "cvePaisOrigen": "",
        "idDireccionSol": 260833725,
        "tipoPatenteAgente": "",
        "recif": "",
        "puesto": "",
        "tipoAgente": "",
        "numeroPatente": "",
        "numeroIdentificacionFiscal": "",
        "personaMoral": false,
        "extranjero": false,
        "organismoPublico": false,
        "cveUsuario": "AAL0409235E6",
        "paginaWeb": "",
        "ideGenerica1": "",
        "rfcExtranjero": "",
        "codAutorizacion": "",
        "actividadProductiva": "",
        "estadoEvaluacionEntidad": "AUTORIZADO",
        "estadoEntidad": "AUTORIZADO",
        "original": false,
        "modificado": false,
        "numeroRegistro": "",
        "concentimientoInstalacionRecuperacion": false,
        "cveCatalogo": "",
        "alquilado": false,
        "volumenAlmacenaje": 0,
        "capacidadAlmacenaje": 0,
        "descripcionDetalladaActividadEconomica": "",
        "activo": false,
        "generico1": false,
        "area": "",
        "cveNacionalidad": "",
        "clasificacionArancelaria": "",
        "infoAdicional": false,
        "montoImportacion": 0,
        "montoExportacion": 0,
        "pctParticAccionaria": 0,
        "ampliacionModelos": false,
        "ampliacionPaises": false,
        "fecFallecimiento": "2025-09-07"
    }
}
    return new Promise((resolve, reject) => {
      this.nuevoProgramaIndustrialService.guardarDatosPost(PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        if(esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
          if(getValidDatos(API_RESPONSE.datos.id_solicitud)) {
            this.tramite80101Store.setIdSolicitud(API_RESPONSE.datos.id_solicitud);
          } else {
            this.tramite80101Store.setIdSolicitud(0);
          }
        }
        resolve(response);
      }, error => {
        reject(error);
      });
      });
  }
 
 
 
 
  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }
 
  /**
  * Método para manejar el evento de carga de documentos.
  * Actualiza el estado del botón de carga de archivos.
  *  carga - Indica si la carga de documentos está activa o no.
  * {void} No retorna ningún valor.
  */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }
 
  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
 
  /**
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
 
  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }
 
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }
 
 
  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}