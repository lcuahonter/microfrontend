import { Component, EventEmitter, ViewChild, inject } from '@angular/core';
import { Subject, map, take, takeUntil } from 'rxjs';

import { DatosPasos, JSONResponse, WizardComponent, WizardService, esValidObject, getValidDatos} from '@libs/shared/data-access-user/src';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { PASOS } from '@libs/shared/data-access-user/src/tramites/constantes/303/pasos.enums';

import { ALERTA_COM, ERROR_FORMA_ALERT, ERROR_LICITACION_NO_SELECCIONADA, REQUISITOS } from '../../constantes/expedicion-certificado.enum';
import { Expedicion120204State, Expedicion120204Store } from '../../estados/tramites/expedicion120204.store';
import { DatosComponent } from '../datos/datos.component';
import { Expedicion120204Query } from '../../estados/queries/expedicion120204.query';
import { ExpedicionCertificadoService } from '../../services/expedicion-certificado.service';
import { LoginQuery } from '@libs/shared/data-access-user/src/core/queries/login.query';
import { ToastrService } from 'ngx-toastr';

/**
 * Componente para la página de solicitud de expedición.
 * Este componente gestiona el flujo de pasos en un asistente (wizard) 
 * y permite la navegación entre ellos.
 */
@Component({
  selector: 'app-solicitud-expedicion',
  templateUrl: './solicitud-expedicion-page.component.html',
  styleUrls: ['./solicitud-expedicion-page.component.scss'],
})
export class SolicitudExpedicionPageComponent {

  /**
   * @property formErrorAlert
   * @description
   * Contiene el mensaje de alerta que se muestra cuando ocurre un error en el formulario.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * @property licitacionErrorAlert
   * @description
   * Contiene el mensaje de alerta que se muestra cuando no se ha seleccionado una licitación.
   */
  public licitacionErrorAlert = ERROR_LICITACION_NO_SELECCIONADA;

  /**
   * @property esFormaValido
   * @description
   * Indica si el formulario actual es válido. Se utiliza para habilitar o deshabilitar la navegación entre pasos en el wizard.
   */
  public esFormaValido!: boolean;

  /**
   * @property licitacionSeleccionada
   * @description
   * Indica si se ha seleccionado una licitación de la tabla.
   */
  public licitacionSeleccionada: boolean = false;

  /**
   * Constante que asigna el texto de alerta definido en `ALERTA_COM`.
   */
  TEXTOSR = ALERTA_COM;

  /**
   * Lista de pantallas o pasos del asistente.
   * Se inicializa con la entidad correspondiente.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice actual del paso en el asistente.
   * Por defecto, comienza en 1.
   */
  indice: number = 1;

  /**
   * Textos de requisitos utilizados en el componente.
   */
  public TEXTOS = REQUISITOS;

  /**
   * Referencia al componente del asistente (wizard).
   * Se utiliza para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente de datos.
   * Se utiliza para acceder a los subcomponentes y validaciones.
   */
  @ViewChild('datosComponent') datosComponent!: DatosComponent;

  /**
   * Servicio del wizard para gestionar la lógica y el estado del componente wizard.
   */
  wizardService = inject(WizardService);

  /**
   * Datos relacionados con los pasos del asistente.
   * Incluye el número total de pasos, el índice actual y los textos de los botones.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud 110219.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   *
   * @type {Solicitud110219State}
   * @public
   */
  public solicitudState!: Expedicion120204State;

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * Indica si la carga de datos está en progreso.
   * Se utiliza para mostrar indicadores de carga o deshabilitar acciones mientras se realiza una operación asíncrona.
   */
  cargaEnProgreso: boolean = true;

  /**
   * RFC del usuario autenticado obtenido del estado de login.
   * Se utiliza para identificar al solicitante en las operaciones de guardado y consulta.
   * @type {string}
   */
  loginRfc: string = '';

  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

  /**
   * Constructor del componente.
   */
  constructor(
    public servicioDeFormularioService: ExpedicionCertificadoService,
    private query: Expedicion120204Query,
    private store: Expedicion120204Store,
    private toastr: ToastrService,
    private loginQuery: LoginQuery
  ) {
      this.query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$)).subscribe((solicitud) => {
          this.solicitudState = solicitud;
        });
      this.loginQuery.selectLoginState$.pipe(takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.loginRfc = seccionState.rfc;
      })).subscribe();
  }

  /**
   * @method verificarLaValidezDelFormulario
   * @description
   * Este método verifica la validez de los formularios dinámicos asociados a los pasos del wizard.
   * @returns {boolean} - Indica si todos los formularios son válidos.
   */
  verificarLaValidezDelFormulario(): boolean {
   
    return (
      (this.servicioDeFormularioService.isFormValid('datosForm') ?? false)
    );
  }

  /**
   * Maneja la navegación entre los pasos del wizard basada en la acción del botón.
   * 
   * Este método procesa las acciones de navegación del usuario en el wizard,
   * valida los formularios cuando es necesario y controla el flujo entre pasos.
   * Para el paso 1, verifica que se haya seleccionado una licitación y valida
   * los formularios antes de permitir continuar.
   * 
   * @param e - Objeto AccionBoton que contiene la acción ('cont' o 'atras') y el valor del índice.
   * @returns {void} No retorna ningún valor.
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    this.licitacionSeleccionada = false;
    
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      
      // Validar si se ha seleccionado una licitación cuando estamos en la pestaña de expedición certificados
      if (this.datosComponent) {
        // Verificar si hay una expedición component y si mostrarSeccionDetalle es true
        const EXPEDICION_COMPONENT = this.datosComponent.obtenerComponenteExpedicion();
        if (EXPEDICION_COMPONENT && EXPEDICION_COMPONENT.mostrarSeccionDetalle) {
          this.licitacionSeleccionada = true;
          this.esFormaValido = true;
        } else {
          // No hay licitación seleccionada, mostrar error
          this.licitacionSeleccionada = false;
          this.esFormaValido = false;
        }
      } else {
        // Si no estamos en la pestaña de expedición certificados, permitir continuar
        this.licitacionSeleccionada = true;
        this.esFormaValido = true;
      }
      
      const ISVALID = this.validarTodosFormulariosPasoUno();
      if (!ISVALID) {
        this.esFormaValido = false;
        // eslint-disable-next-line no-useless-return
        return;
      }
      this.obtenerDatosDelStore()
    }
    else if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
   * Ejecuta la navegación física entre los pasos del wizard.
   * 
   * Este método actualiza los índices del wizard y ejecuta la transición
   * visual hacia adelante o atrás según la acción especificada.
   * 
   * @param e - Objeto AccionBoton que contiene la acción y el valor del índice de destino.
   * @returns {void} No retorna ningún valor.
   */
  pasoNavegarPor(e: AccionBoton): void {
    this.indice = e.valor;
    this.datosPasos.indice = e.valor;
    if (e.valor > 0 && e.valor < 5) {
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Obtiene el estado completo del formulario desde el store y ejecuta el guardado.
   * 
   * Este método recupera todos los datos del estado actual del formulario
   * mediante el servicio y los pasa al método de guardado para persistir
   * la información en el servidor.
   * 
   * @returns {void} No retorna ningún valor.
   */
  obtenerDatosDelStore(): void {
    this.servicioDeFormularioService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data);
      });
  }

  /**
   * Guarda los datos de la solicitud de expedición en el servidor.
   * 
   * Este método construye el payload completo con toda la información necesaria
   * para la solicitud de expedición de certificados, incluyendo datos del solicitante,
   * licitación, representación federal, importador, productor y montos del certificado.
   * Maneja la respuesta del servidor y actualiza el estado según el resultado.
   * 
   * @param item - Estado completo de la expedición con todos los datos del formulario.
   * @returns {Promise<JSONResponse>} Promise que resuelve con la respuesta del servidor
   *                                 o rechaza en caso de error.
   */
  guardar(item: Expedicion120204State): Promise<JSONResponse> {
    const PAYLOAD = {
      "rfc_solicitante": this.loginRfc,
      "id_solcitud": item.idSolicitud,
      "solicitante": {
          "rfc": this.loginRfc,
          "correo_electronico": "vucem2.5@hotmail.com",
          "nombre": "CORPORACION MEXICANA DE COMPUTO S DE RL DE CV",
          "actividad_economica": "Fabricación de partes de sistemas de dirección y de suspensión para vehículos automotrices",
          "domicilio": {
              "pais": "ESTADOS UNIDOS MEXICANOS",
              "codigo_postal": "06700",
              "estado": "QUERÉTARO",
              "municipio_alcaldia": "EL MARQUES",
              "localidad": "EL MARQUES",
              "colonia": "PARQUE IND B QUINTANA",
              "calle": "Av. Insurgentes Sur",
              "numero_exterior": "123",
              "numero_interior": "Piso 5, Oficina A",
              "lada": "",
              "telefono": "909/917-1445",
              "informacionExtra": "Dirección completa del solicitante"
          }
      },
      "gridLicitacion": {
          "participante": {
              "licitacionPublica": {
                  "numeroLicitacion": item.numeraDelicitacion,
                  "fechaConcurso": item.fechaFinVigenciaCupo,
                  "mecanismoAsignacion": {
                      "idMecanismoAsignacion": "123",
                      "requiereImportador": true,
                      "requiereProductor": true,
                      "fraccionesPorExpedir": true
                  }
              }
          },
          "idAsignacion": 74001
      },
      "representacionFederal": {
          "entidadFederativa": {
              "entidad": {
                  "clave": item.entidadFederativa
              }
          },
          "unidadAdministrativaRepresentacionFederal": {
              "clave": item.representacionFederal
          }
      },
      "importador": {
          "nombre": item.numeraDelicitacion,
          "rfc":this.loginRfc,
          "idPersonaSolicitud": 123,
          "domicilio": {
              "informacionExtra": "Dirección completa del importador"
          }
      },
      "productorCupos": {
          "nombre": "item.descripcionDelProducto",
          "rfc":this.loginRfc,
          "idPersonaSolicitud": 123,
          "domicilio": {
              "informacionExtra": "Dirección completa del productor"
          }
      },
      "fraccionArancelariaSolicitud": {
          "fraccionArancelaria": {
              "idClave": item.fraccionArancelaria,
              "clave": "1234.56.78"
          }
      },
      "montos_certificado": [
          {
              "idExpedicion": 1,
              "cantidad": item.totalAExpedir,
              "certificadoAprobado": 1,
              "descripcionMercancia": "Descripción de la mercancía a importar"
          }
      ]
  };
  
    return new Promise((resolve, reject) => {
      this.servicioDeFormularioService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          if (esValidObject(response) && esValidObject(response['datos'])) {
            const DATOS = response['datos'] as { id_solicitud?: number };
            if (getValidDatos(DATOS.id_solicitud)) {
              this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              this.pasoNavegarPor({ accion: 'cont', valor: 2 });
            } else {
              this.store.setIdSolicitud(0);
            }
          }
          resolve({
            id: response['id'] ?? 0,
            descripcion: response['descripcion'] ?? '',
            codigo: response['codigo'] ?? '',
            mensaje: 'Operación exitosa.',
            data: response['data'] ?? response['datos'] ?? null,
            ...response,
          } as JSONResponse);
        },
        (error) => {
          reject(error);
          this.toastr.error('Error al buscar los datos del formulario.', 'Error');
        }
      );
    });
  }

  /**
   * @method validarTodosFormulariosPasoUno
   * @description
   * Valida todos los formularios del componente `PasoUnoComponent`.
   * Si la referencia al componente no existe, retorna `true` (no hay formularios que validar).
   * Llama al método `validarFormularios()` del componente hijo y retorna `false` si algún formulario es inválido.
   * Retorna `true` si todos los formularios son válidos.
   *
   * @returns {boolean} Indica si todos los formularios del paso uno son válidos.
   */
  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.datosComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.datosComponent.validarFormularios();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }

  /**
   * Maneja la lógica para avanzar al siguiente paso del wizard.
   * 
   * Este método verifica que el formulario sea válido antes de permitir
   * el avance al siguiente paso. Actualiza los índices correspondientes
   * y ejecuta la transición en el componente wizard.
   * 
   * @param e - Objeto AccionBoton que contiene la información del paso actual.
   * @returns {void} No retorna ningún valor.
   */
  public continuar(e: AccionBoton): void {
    if (this.esFormaValido) {
      this.indice = e.valor + 1;
      this.datosPasos.indice = e.valor + 1;
      this.wizardService.cambio_indice(this.datosPasos.indice);
      this.wizardComponent.siguiente();
    }
    
  }

  /**
   * Maneja el estado del componente de carga de documentos.
   * 
   * Este método actualiza el estado del botón de carga de archivos
   * basándose en el estado de la carga de documentos. Habilita o
   * deshabilita la funcionalidad según sea necesario.
   * 
   * @param carga - Indica si la carga de documentos está activa (true) o inactiva (false).
   * @returns {void} No retorna ningún valor.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Dispara el evento de carga de archivos hacia los componentes hijos.
   * 
   * Este método emite un evento que notifica a los componentes de carga
   * de documentos que deben iniciar el proceso de selección y carga de archivos.
   * 
   * @returns {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Maneja el resultado del proceso de carga de documentos.
   * 
   * Este método actualiza la visibilidad de la sección de carga de documentos
   * basándose en si la carga se realizó exitosamente o no. Oculta la sección
   * cuando la carga es exitosa y la mantiene visible en caso contrario.
   * 
   * @param cargaRealizada - Indica si la carga de documentos fue exitosa (true) o falló (false).
   * @returns {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * Actualiza el indicador de progreso de carga de documentos.
   * 
   * Este método controla el estado de carga en progreso, utilizado para
   * mostrar indicadores visuales como spinners o barras de progreso
   * durante las operaciones asíncronas de carga de documentos.
   * 
   * @param carga - Indica si hay una operación de carga en progreso (true) o completada (false).
   * @returns {void} No retorna ningún valor.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Maneja el estado de documentos obligatorios faltantes.
   * 
   * Este método actualiza la bandera que indica si existen documentos
   * obligatorios sin cargar, lo cual determina si se debe habilitar
   * la opción de saltar al paso de firma directamente.
   * 
   * @param enBlanco - Indica si hay documentos obligatorios sin cargar (true) o todos están cargados (false).
   * @returns {void} No retorna ningún valor.
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

    /**
   * Permite saltar directamente al paso de firma en el wizard.
   * 
   * Este método proporciona una navegación rápida al paso de firma,
   * omitiendo pasos intermedios cuando es permitido por las reglas de negocio.
   * Actualiza los índices correspondientes y ejecuta la transición.
   * 
   * @returns {void} No retorna ningún valor.
   */
  saltar(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.siguiente();
  }
  /**
   * Navega hacia atrás en el wizard al paso anterior.
   * 
   * Este método ejecuta la transición hacia atrás en el wizard,
   * actualiza el índice actual basándose en la posición del wizard
   * y sincroniza los datos de pasos correspondientes.
   * 
   * @returns {void} No retorna ningún valor.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Navega hacia adelante en el wizard al siguiente paso.
   * 
   * Este método ejecuta la transición hacia adelante en el wizard,
   * realiza las validaciones necesarias de documentos cargados,
   * actualiza el índice actual y sincroniza los datos de pasos.
   * 
   * @returns {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
}
