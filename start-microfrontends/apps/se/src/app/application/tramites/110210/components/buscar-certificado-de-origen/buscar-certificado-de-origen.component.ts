import { Catalogo, CertificadoDisponibles, ConsultaioQuery, LoginQuery, Notificacion, NotificacionesComponent,TituloComponent, doDeepCopy, esValidArray, esValidObject } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { BuscarCertificadoDeOrigenService } from '../../services/buscar-certificado-de-origen/buscar-certificado-de-origen.service';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CertificadoDisponiblesService } from '../../services/certificado-disponibles/certificadoDisponibles.service';
import { CommonModule } from '@angular/common';
import { ComplimentosService } from '../../../../shared/services/complimentos.service';

import { Tramite110210State, Tramite110210Store } from '../../estados/store/tramite110210.store';
import { Tramite110210Query } from '../../estados/queries/tramite110210.query';

/**
 * @descripcion
 * El componente `BuscarCertificadoDeOrigenComponent` es responsable de gestionar la lógica
 * y la interfaz de usuario para buscar certificados de origen en la aplicación.
 *
 * @selector app-buscar-certificado-de-origen
 * @templateUrl ./buscar-certificado-de-origen.component.html
 * @styleUrl ./buscar-certificado-de-origen.component.scss
 */
@Component({
  selector: 'app-buscar-certificado-de-origen',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, CatalogoSelectComponent, NotificacionesComponent],
  templateUrl: './buscar-certificado-de-origen.component.html',
  styleUrl: './buscar-certificado-de-origen.component.scss',
})
export class BuscarCertificadoDeOrigenComponent implements OnInit, OnDestroy {
  /**
   * Evento que se emite cuando no se encuentran datos.
   * @type {EventEmitter<void>}
   */
  @Output() noDatosError = new EventEmitter<void>();

  /**
   * Evento que se emite cuando se deshabilita el certificado.
   * @type {EventEmitter<void>}
   */
  @Output() disableCertificado = new EventEmitter<void>();
  /**
   * Formulario para buscar el certificado de origen.
   * @type {FormGroup}
   */
  buscarCertificadoDeOrigenFrom!: FormGroup;

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  nuevaNotificacion!: Notificacion;

  /**
   * Arreglo de objetos `Catalogo` que representa los países o bloques.
   * @type {Catalogo[]}
   */
  paisBloque: Catalogo[] = [];

  /**
   * Arreglo de objetos `Catalogo` que representa los tratados o acuerdos.
   * @type {Catalogo[]}
   */
  tratadoAcuerdo: Catalogo[] = [];

  /**
   * Subject que emite un evento cuando el componente es destruido,
   * permitiendo la desuscripción de observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();
  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando se establece en `true`, todos los controles del formulario y elementos interactivos
 * se deshabilitan, impidiendo que el usuario realice cambios. Esta propiedad normalmente se
 * configura según el estado de la aplicación, por ejemplo, al visualizar una solicitud enviada
 * o cuando el usuario no tiene permisos de edición.
 */
  esFormularioSoloLectura: boolean = false;

  /** Indica si el formulario ha sido actualizado.
   * Esta propiedad se utiliza para rastrear si el formulario ha sufrido cambios
   * desde su inicialización o la última vez que se guardaron los datos. 
   */

  update:boolean = false;
  /**
 * Estado actual de la sección del trámite 120501.
 * Esta propiedad almacena los datos del estado de la sección, obtenidos generalmente
 * desde el store o desde una consulta al backend. Se utiliza para inicializar y actualizar
 * los formularios del componente con los valores correspondientes a la solicitud en curso.
 */
   private seccionState!: Tramite110210State;

   
  // Valor de RFC de ejemplo
  public loginRfc: string = '';

  /**
   * Constructor del componente.
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {Tramite110210Store} tramite110210Store - Servicio para manejar el estado del trámite.
   * @param {Tramite110210Query} tramite110210Query - Servicio para consultar el estado del trámite.
   */
  constructor(private fb: FormBuilder, 
    private service: BuscarCertificadoDeOrigenService, 
    private tramite110210Store: Tramite110210Store, 
    private tramite110210Query: Tramite110210Query,
    private consultaioQuery: ConsultaioQuery,
    private certificadoService: CertificadoDisponiblesService,
    private complimentosService: ComplimentosService,
    private loginQuery: LoginQuery,
  ) {
    
     this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.update = seccionState.update;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

      this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.loginRfc = seccionState.rfc;
        })
      )
      .subscribe();
   
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Obtiene los valores del store y los asigna al formulario.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.getValoresStore();
    this.obtenerPaisBloque();
  }

   /**
 * Inicializa el estado de los formularios según el modo de solo lectura.
 *
 * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), llama a `guardarDatosFormulario()`
 * para deshabilitar todos los controles. En caso contrario, inicializa los formularios normalmente.
 */
   inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); 
    } else {
      this.inicializarFormulario();
    }
  }
      /**
   * Guarda y actualiza el estado de los formularios según el modo de solo lectura.
   *
   * Inicializa los formularios y luego los deshabilita si el formulario está en modo solo lectura,
   * o los habilita si está en modo edición.
   */
    guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.buscarCertificadoDeOrigenFrom.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.buscarCertificadoDeOrigenFrom.enable();
      } else {
        // No se requiere ninguna acción en el formulario
      }
  }

  /**
   * nicializa el formulario reactivo para la búsqueda de certificados de origen.
   * Llama al método para obtener el estado de la solicitud y configura el formulario con los valores actuales del estado de la sección.
   * Los campos incluyen país/bloque, tratado/acuerdo y clave de registro del productor, aplicando validaciones requeridas.
   */
  inicializarFormulario(): void {
    this.obtenerEstadoSolicitud();
    this.buscarCertificadoDeOrigenFrom = this.fb.group({
        paisBloqueClave: [this.seccionState?.paisBloqueClave],
        tratadoAcuerdoClave: [this.seccionState?.tratadoAcuerdoClave],
        cveRegistroProductor: [this.seccionState?.cveRegistroProductor, [Validators.required, Validators.maxLength(14)]],
      });
  }
    /**
   * Suscribe al observable `selectSolicitud$` del query `tramite120501Query` para obtener el estado actual de la solicitud y actualizar la propiedad `seccionState` con los datos recibidos. La suscripción se mantiene activa hasta que se emite un valor en `destroyed$`, evitando fugas de memoria.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite110210Query.selectTramite110210$?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Tramite110210State) => {
        this.seccionState = data;
      });
  }
  /**
 * @descripcion
 * Método que obtiene los datos de los países o bloques desde el servicio
 * y los asigna a la propiedad `paisBloque`.
 *
 * Este método utiliza un observable para suscribirse a los datos proporcionados
 * por el servicio `BuscarCertificadoDeOrigenService` y se asegura de desuscribirse
 * automáticamente cuando el componente se destruye, utilizando el operador `takeUntil`.
 *
 * @returns {void}
 */
  obtenerPaisBloque(): void {
    this.complimentosService.getPaisBloque().pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if(esValidObject(res)) {
          const RESPONSE = doDeepCopy(res);
          if(esValidArray(RESPONSE.datos)) {
            this.paisBloque = RESPONSE.datos;
          }
        }
      });  
  }

  /**
 * @descripcion
 * Método que obtiene los datos de los países o bloques desde el servicio
 * y los asigna a la propiedad `tratadoAcuerdo`.
 *
 * Este método utiliza un observable para suscribirse a los datos proporcionados
 * por el servicio `BuscarCertificadoDeOrigenService` y se asegura de desuscribirse
 * automáticamente cuando el componente se destruye, utilizando el operador `takeUntil`.
 *
 * @returns {void}
 */
  obtenerTratadoAcuerdo(countryCode: string): void {
    this.complimentosService.getTratadoAcuerdo(countryCode).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if(esValidObject(res)) {
          const RESPONSE = doDeepCopy(res);
          if(esValidArray(RESPONSE.datos)) {
            this.tratadoAcuerdo = RESPONSE.datos;
          }
        }
      });
  }

  /**
   * Establece los valores en el store.
   * @param {FormGroup} form - El formulario del cual se obtienen los valores.
   * @param {string} campo - El nombre del campo del formulario.
   * @param {keyof Tramite110210Store} metodoNombre - El nombre del método del store.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite110210Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite110210Store[metodoNombre] as (value: unknown) => void)(VALOR);
    if (campo === 'paisBloqueClave' && VALOR && VALOR !== '') {
      this.obtenerTratadoAcuerdo(VALOR);
    }
  }

  /**
   * Obtiene los valores del store y los asigna al formulario.
   */
  getValoresStore(): void {
    this.tramite110210Query.selectTramite110210$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.buscarCertificadoDeOrigenFrom.patchValue({
            cveRegistroProductor: seccionState.cveRegistroProductor,
            paisBloqueClave: seccionState.paisBloqueClave,
            tratadoAcuerdoClave: seccionState.tratadoAcuerdoClave,
          });
        })
      )
      .subscribe();
  }

  /**
   * Verifica si un control del formulario es inválido.
   * @param {string} nombreControl - Nombre del control del formulario.
   * @returns {boolean} - Retorna true si el control es inválido, de lo contrario false.
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.buscarCertificadoDeOrigenFrom.get(nombreControl);
    return CONTROL ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) : false;
  }

  /**
   * Actualiza el estado del grid de comercializadores de productos.
   */
  actualizaGridComercializadoresProductos(): void {
      const CVEREGISTROPRODUCTOR = this.buscarCertificadoDeOrigenFrom.get('cveRegistroProductor')?.value;
      const PAYLOAD = {
        "solicitud": {
          "solicitante": {
            "rfc": this.loginRfc ?? 'AAL0409235E6',
            "razonSocial": "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
            "descripcionGiro": "Siembra, cultivo y cosecha de otros cultivos",
            "correoElectronico": "vucem2021@gmail.com",
            "telefono": "55-98764532",
            "cveUsuario": this.loginRfc ?? 'AAL0409235E6',
            "domicilio": {
              "pais": {
                "clave": "MEX",
                "nombre": "ESTADOS UNIDOS MEXICANOS"
              },
              "entidadFederativa": {
                "clave": "SIN",
                "nombre": "SINALOA"
              },
              "delegacionMunicipio": {
                "clave": "25001",
                "nombre": "AHOME"
              },
              "localidad": {
                "clave": "00181210008",
                "nombre": "LOS MOCHIS"
              },
              "colonia": {
                "clave": "00181210001",
                "nombre": "MIGUEL HIDALGO"
              },
              "calle": "CAMINO VIEJO",
              "numeroExterior": "1353",
              "numeroInterior": "",
              "codigoPostal": "81210"
            }
          },
          "cveRolCapturista": "PersonaMoral",
          "cveUsuarioCapturista": this.loginRfc ?? 'AAL0409235E6',
          "clavePaisSeleccionado": "",
          "idTratadoAcuerdoSeleccionado": "",
          "discriminatorValue": "110210",
          "tramite": {
            "numFolioTramite": ""
          },
          "idSolicitud": ""
        },
        "puedeCapturarRepresentanteLegalCG": false,
        "datosMercancia": {
          "numeroCertificado": CVEREGISTROPRODUCTOR
        },
        "buscarCertificadosPorNumero": "Buscar Certificado",
        "buscarListaCertificados": "Buscar Certificado"
      };

      this.service.getCertificadosDisponibles(PAYLOAD).pipe(
        takeUntil(this.destroyed$)
      ).subscribe((response) => {
        if(esValidObject(response)) {
          const RESPONSE = doDeepCopy(response);
          if(esValidArray(RESPONSE.datos)) {
            if(RESPONSE.datos.length > 0){
              const DATOS: CertificadoDisponibles[] = []
              RESPONSE.datos.forEach((certificado: CertificadoDisponibles) => {
                const DATOSOBJ = {
                  idSolicitud: certificado.idSolicitud,
                  numeroCertificado: certificado.numeroCertificado,
                  fechaExpedicion: certificado.fechaExpedicion,
                  fechaVencimiento: certificado.fechaVencimiento,
                  rfc: this.loginRfc
                }
                DATOS.push(DATOSOBJ);
              });
              this.tramite110210Store.setSelectedDropdownValue(false);
              this.tramite110210Store.setCertificadosDisponibles(DATOS);
            }else{
              this.guardarObservacion();
            }  
          }else{
              this.guardarObservacion();
            } 
        }
      });
  }
  /**
   * Actualiza el estado del grid de comercializadores de catálogos.
   */
  actualizaGridComercializadoresCatalogs(): void {
    this.disableCertificado.emit();
    const PAISES = this.buscarCertificadoDeOrigenFrom.get('paisBloqueClave')?.value;
    const TRATADOS = this.buscarCertificadoDeOrigenFrom.get('tratadoAcuerdoClave')?.value;
    if(PAISES){

      const PAYLOAD = {
        "solicitud": {
          "solicitante": {
            "rfc": this.loginRfc ?? 'AAL0409235E6',
            "razonSocial": "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
            "descripcionGiro": "Siembra, cultivo y cosecha de otros cultivos",
            "correoElectronico": "vucem2021@gmail.com",
            "telefono": "55-98764532",
            "cveUsuario": this.loginRfc ?? 'AAL0409235E6',
            "domicilio": {
              "pais": {
                "clave": "MEX",
                "nombre": "ESTADOS UNIDOS MEXICANOS"
              },
              "entidadFederativa": {
                "clave": "SIN",
                "nombre": "SINALOA"
              },
              "delegacionMunicipio": {
                "clave": "25001",
                "nombre": "AHOME"
              },
              "localidad": {
                "clave": "00181210008",
                "nombre": "LOS MOCHIS"
              },
              "colonia": {
                "clave": "00181210001",
                "nombre": "MIGUEL HIDALGO"
              },
              "calle": "CAMINO VIEJO",
              "numeroExterior": "1353",
              "numeroInterior": "",
              "codigoPostal": "81210"
            }
          },
          "cveRolCapturista": "PersonaMoral",
          "cveUsuarioCapturista": this.loginRfc ?? 'AAL0409235E6',
          "clavePaisSeleccionado": PAISES ? PAISES : "",
          "idTratadoAcuerdoSeleccionado": TRATADOS ? TRATADOS : "",
          "discriminatorValue": "110210",
          "tramite": {
            "numFolioTramite": ""
          },
          "idSolicitud": ""
        },
        "puedeCapturarRepresentanteLegalCG": false,
        "datosMercancia": {
          "numeroCertificado": ''
        },
        "buscarCertificadosPorNumero": "Buscar Certificado",
        "buscarListaCertificados": "Buscar Certificado"
      };

      this.service.getCertificadosDisponibles(PAYLOAD).pipe(
        takeUntil(this.destroyed$)
      ).subscribe((response) => {
        if(esValidObject(response)) {
          const RESPONSE = doDeepCopy(response);
          if(esValidArray(RESPONSE.datos)) {
            if(RESPONSE.datos.length > 0){
              const DATOS: CertificadoDisponibles[] = []
              RESPONSE.datos.forEach((certificado: CertificadoDisponibles) => {
                const DATOSOBJ = {
                  idSolicitud: certificado.idSolicitud,
                  numeroCertificado: certificado.numeroCertificado,
                  fechaExpedicion: certificado.fechaExpedicion,
                  fechaVencimiento: certificado.fechaVencimiento,
                  idTratadoAcuerdo: TRATADOS,
                  paises: PAISES,
                  dropdownSeleccionado: true,
                  rfc: this.loginRfc
                }
                DATOS.push(DATOSOBJ);
              });
              this.tramite110210Store.setSelectedDropdownValue(true);
              this.tramite110210Store.setCertificadosDisponibles(DATOS);
            }else{
              this.noDatosError.emit();
              this.tramite110210Store.setCertificadosDisponibles([]);
            }  
          }else{
              this.noDatosError.emit();
              this.tramite110210Store.setCertificadosDisponibles([]);
            } 
        }
      });
    }
  }

  
  /**
   * El método `guardarObservacion` en la clase `DetalleVDictamenComponent` es responsable de
   * navegar a la ruta 'bandeja-de-tareas-pendientes' cuando es llamado. Este método se activa cuando
   * ocurre una acción o evento específico en el componente, como guardar una observación o completar
   * una tarea. Al llamar a `this.router.navigate(['bandeja-de-tareas-pendientes']);`, el método redirige
   * al usuario a la ruta 'bandeja-de-tareas-pendientes' dentro de la aplicación.
   * @method guardarObservacion
   * @description Navega a la bandeja de tareas pendientes.
   * @returns {void}
   * @memberof DetalleVDictamenComponent
   */
  guardarObservacion(): void {
    this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: "Corrija los siguientes errores:",
        mensaje: "(Número de certificado) es un campo requerido",
        cerrar: false,
        txtBtnAceptar: "Aceptar",
        txtBtnCancelar: "",
      };
  }
  /**
   * @method validarFormulario
   * @description
   * Valida el formulario de búsqueda de certificado de origen.
   * Comprueba si el formulario es válido según las reglas de validación configuradas.
   * Si el formulario es válido, retorna `true`.
   * Si el formulario es inválido, marca todos los controles como "tocados" para mostrar los errores de validación y retorna `false`.
   * 
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  validarFormulario(): boolean {
    if (this.buscarCertificadoDeOrigenFrom.valid) {
      return true;
    }
    this.buscarCertificadoDeOrigenFrom.markAllAsTouched();
    return false
  }

  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject destroyed$ para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}