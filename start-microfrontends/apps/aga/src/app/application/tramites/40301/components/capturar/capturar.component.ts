import { AGENT_CATALOG, META_INFO_40301 } from '../../enum/caat-naviero.enum';
import { Catalogo, ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite40301State, Tramite40301Store } from '../../estados/tramite40301.store';
import { CapturarService } from '../../services/capturar.service'; 
import { Tramite40301Query } from '../../estados/tramite40301.query';

@Component({
  selector: 'app-capturar',
  templateUrl: './capturar.component.html',
  styleUrls: ['./capturar.component.scss']
})
export class CapturarComponent implements OnInit, OnDestroy {
  /**
   * Una instancia de FormGroup utilizada para gestionar el estado y la validación del formulario
   * en el componente Capturar. Este formulario probablemente está asociado con la captura
   * de datos para un proceso específico de "solicitud".
   */
  solicitudForm!: FormGroup;
  /**
   * Representa el título del componente.
   * Se espera que esta propiedad se inicialice más tarde y contenga un valor de tipo cadena.
   */
  titulo: string = META_INFO_40301.titulo;

  /**
   * Representa la etiqueta para el tipo de agente.
   * Esta propiedad se utiliza para almacenar una etiqueta descriptiva
   * asociada con el tipo de agente en la aplicación.
   */
  tipoAgenteLabel: string = META_INFO_40301.tipoAgenteLabel;

  /**
   * Representa el identificador único para el trámite actual (procedimiento o proceso).
   * Se espera que esta propiedad se asigne con un valor de tipo cadena que identifique
   * de manera única un trámite específico dentro de la aplicación.
   */
  idTramite!: string;
  /**
   * Un arreglo de cadenas que representa los roles asignados al usuario.
   * Esto puede ser utilizado para determinar los permisos o niveles de acceso
   * del usuario dentro de la aplicación.
   */
  rolesUsuario: string[] = META_INFO_40301.roles;

  /**
   * Representa un catálogo de agentes.
   * Este arreglo contiene una lista de objetos `Catalogo`, que pueden ser utilizados
   * para almacenar y gestionar datos relacionados con agentes dentro del componente.
   */
  agentCatalog: Catalogo[] = AGENT_CATALOG;

  /**
   * Subject para destruir el notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud del trámite.
   */
  public solicitudState!: Tramite40301State;
  /**
   * Estado de la consulta de datos.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario es de solo lectura.
   * Se utiliza para determinar si el formulario debe ser editable o no.
   */
  soloLectura: boolean = false;

  /**
   * Constructor del componente CapturarComponent.
   */
  constructor(
    private fb: FormBuilder,
    private capturarService: CapturarService,
    private tramite40301Store: Tramite40301Store,
    private tramite40301Query: Tramite40301Query, 
    private consultaioQuery: ConsultaioQuery
  ) {
  }

  ngOnInit(): void {

    this.tramite40301Query.selectSolicitud$
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe((state) => {
        this.solicitudState = state;
      });

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
        })
      )
      .subscribe();

    this.establecerSolicitudForm();

    if(this.soloLectura) {
      this.solicitudForm.disable();
    }
    this.suscribirseAlEstado();
  }

  /**
   * ## establecerSolicitudForm
   * 
   * Establece la estructura del formulario reactivo para los datos del trámite.
   * 
   * ### Funcionalidad
   * Crea un grupo de formularios con validaciones para los campos requeridos.
   */
  public establecerSolicitudForm(): void {
    // Inicializar el formulario reactivo
    this.solicitudForm = this.fb.group({
      cveFolioCaat: [{ value: this.solicitudState?.cveFolioCaat, disabled: true }],
      rol: [{ value: this.solicitudState?.rol, disabled: true }],
      tipoAgente: [{ value: this.solicitudState?.tipoAgente, disabled: this.soloLectura }, [Validators.required]],
      directorGeneralNombre: [{ value: this.solicitudState?.directorGeneralNombre, disabled: this.soloLectura }, [Validators.required, Validators.maxLength(200)]],
      primerApellido: [{ value: this.solicitudState?.primerApellido, disabled: this.soloLectura }, [Validators.required, Validators.maxLength(200)]],
      segundoApellido: [{ value: this.solicitudState?.segundoApellido, disabled: this.soloLectura }, [Validators.maxLength(200)]],
    });
  }

  /**
   * Lee e inicializa la información de metadatos requerida para el componente.
   * 
   * Este método realiza las siguientes acciones:
   * 1. Recupera información de metadatos como el título y la etiqueta del tipo de agente
   *    desde el `capturarService` y los asigna a las propiedades respectivas del componente.
   * 2. Obtiene los roles del usuario actual y los almacena en la propiedad `rolesUsuario`.
   * 3. Recupera el catálogo de agentes y lo asigna a la propiedad `agentCatalog`.
   * 
   * Todas las suscripciones se cancelan automáticamente cuando el componente se destruye
   * utilizando el notificador `destruirNotificador$`.
   */
  public readMetaInfo(): void {

    this.capturarService
      .getCatalogo()
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((agentCatalog: Catalogo[]) => {
          this.agentCatalog = agentCatalog;
        })
      )
      .subscribe();
  }

  /**
   * ## suscribirseAlEstado
   * 
   * Se suscribe al estado de la solicitud para actualizar el formulario automáticamente.
   * 
   * ### Funcionalidad
   * Utiliza el servicio para obtener el estado actual de la solicitud y parchea los valores en el formulario.
   */
  public suscribirseAlEstado(): void {
    this.capturarService
      .getTramiteState()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe({
        next: (state) => {
          this.solicitudForm.patchValue(state);
        },
      });
  }

  /**
   * @method isFormValid
   * @description
   * Verifica si el formulario dentro del componente `CapturarComponent` es válido.
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  isFormValid(): boolean {
    return this.solicitudForm?.valid;
  }

  /**
   * Método para limpiar el formulario de agente.
   */
  limpiarAgente(): void {
    this.solicitudForm.reset();
    this.tramite40301Store.reset();
  }

  /**
   * Método para obtener el valor del campo tipoAgente.
   * @returns string
   */
  conTipoAgenteData(control: string): void {
    // Obtener el valor del control tipoAgente desde el formulario
    const AGENT = this.solicitudForm.get(control)?.value;
    this.tramite40301Store.setTipoAgente(AGENT);
  }

  /**
   * Actualiza el nombre del Director General en el store.
   *
   * Este método obtiene el valor actual del campo `directorGeneralNombre` del formulario `solicitudForm`
   * y lo envía al store `tramite40301Store` mediante el método `setDirectorGeneralNombre`.
   */
  public actualizarDirectorGeneralNombre(control: string): void {
    const DIRECTOR_GENERAL_NOMBRE = this.solicitudForm.get(control)?.value;
    this.tramite40301Store.setDirectorGeneralNombre(DIRECTOR_GENERAL_NOMBRE);
  }

  /**
   * Actualiza el primer apellido en el store.
   *
   * Este método obtiene el valor actual del campo `primerApellido` del formulario `solicitudForm`
   * y lo envía al store `tramite40301Store` mediante el método `setPrimerApellido`.
   */
  public actualizarPrimerApellido(control: string): void {
    const PRIMER_APELLIDO = this.solicitudForm.get(control)?.value;
    this.tramite40301Store.setPrimerApellido(PRIMER_APELLIDO);
  }

  /**
   * Actualiza el segundo apellido en el store.
   *
   * Este método obtiene el valor actual del campo `segundoApellido` del formulario `solicitudForm`
   * y lo envía al store `tramite40301Store` mediante el método `setSegundoApellido`.
   */
  public actualizarApellidoMaterno(control: string): void {
    const SEGUNDO_APELLIDO = this.solicitudForm.get(control)?.value;
    this.tramite40301Store.setSegundoApellido(SEGUNDO_APELLIDO);
  }

  /**
   * Maneja el envío del formulario.
   */
  onSubmit(): void {
    if (this.solicitudForm.valid) {
      // Aquí puedes manejar el envío del formulario, como enviar los datos a un servicio o API
    }
  }

  /**
   * Se ejecuta al destruir el componente para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}