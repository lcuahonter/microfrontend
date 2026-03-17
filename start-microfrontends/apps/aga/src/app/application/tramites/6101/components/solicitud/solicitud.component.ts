import { CatalogoServices, ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Component, Input } from '@angular/core';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { DivideFraccion } from '../../models/solicitud.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { REGEX_IMPORTE_PAGO } from '@libs/shared/data-access-user/src';
import { REGEX_NUMEROS } from '@libs/shared/data-access-user/src';
import { Solicitud6101Query } from '../../estados/solicitud6101.query';
import { Solicitud6101State } from '../../estados/solicitud6101.store';
import { Solicitud6101Store } from '../../estados/solicitud6101.store';
import { SolicitudCatologo } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud/solicitud.service';
import { Subject } from 'rxjs';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
/**
 * Componente de Angular para el formulario de solicitud.
 * Se encarga de inicializar el formulario, sus valores y
 * de gestionar las interacciones del usuario con los campos del formulario.
 */
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
/**
 * Componente de Angular para el formulario de solicitud.
 * Se encarga de inicializar el formulario, sus valores y
 * de gestionar las interacciones del usuario con los campos del formulario.
 */
export class SolicitudComponent implements OnInit, OnDestroy {
  /** Formulario reactivo principal */
  solicitudForm!: FormGroup;

  /** Opciones para el catálogo de aduanas auxiliares */
  opcionAduanaAux: CatalogosSelect = {} as CatalogosSelect;

  /** Opciones para el catálogo de juntas técnicas derivadas */
  opcionJuntaTecnicaDerivada: CatalogosSelect = {} as CatalogosSelect;

  /** Sujeto para manejar la destrucción del componente y cancelar suscripciones */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Acción booleana usada posiblemente para el control de un sello u otra lógica */
  actionBean = {
    sello: false,
  };

  /** Estado actual de la solicitud */
  solicitud6101State: Solicitud6101State = {} as Solicitud6101State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

     /**
     * @property {ConsultaioState} consultaDatos
     * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
     */
    consultaDatos!: ConsultaioState;

    /**
     * Identificador del trámite actual, recibido como propiedad de entrada del componente.
     */
    @Input() tramiteId!: string;
    
  /**
   * Constructor con inyecciones de dependencias
   * @param fb - FormBuilder para crear el formulario
   * @param solicitudService - Servicio para obtener catálogos
   * @param solicitud6101Store - Store para manejar estado
   * @param solicitud6101Query - Query para seleccionar datos del estado
  * @param catalogoServices - Servicio para consultar catálogos de aduanas y juntas técnicas derivadas
   */
  constructor(
    private fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud6101Store: Solicitud6101Store,
    public solicitud6101Query: Solicitud6101Query,
    public consultaioQuery: ConsultaioQuery,
     private catalogoServices: CatalogoServices,
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.conseguirSolicitudCatologo();
    this.opcionAduanaAux = {
      catalogos: [],
      labelNombre: 'Aduana',
      primerOpcion: 'Seleccione un opción',
      required: true,
    };
    this.opcionJuntaTecnicaDerivada = {
        catalogos: [],
        labelNombre: 'Junta técnica derivada de',
        primerOpcion: 'Seleccione un opción',
        required: true,
      };
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario y se suscribe a cambios en el estado.
   */
  ngOnInit(): void {
    this.solicitud6101Query.seleccionarSolicitud$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitud6101State = seccionState;
        this.solicitudForm.patchValue({
          aduanaAux:this.solicitud6101State.aduanaAux
        })
      })
    )
    .subscribe();
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaDatos = seccionState;
        this.esFormularioSoloLectura = this.consultaDatos.readonly;
        this.guardarDatosFormulario();
      })
    )
    .subscribe();
    this.inicializarEstadoFormulario();
    this.obtenerLista();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

    obtenerLista(): void {
    this.obtenerListaAduanas();
    this.obtenerListaJuntasTecnicas();

  }
  
  /**
   * Obtiene la lista de aduanas desde el servicio de catálogos y actualiza la opción correspondiente.
   *  Este método consulta el catálogo de aduanas usando el ID del trámite actual y asigna los datos recibidos a la propiedad opcionAduanaAux.catalogos.
   */
  obtenerListaAduanas(): void {
    this.catalogoServices.aduanasCatalogo(this.tramiteId.toString()).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.opcionAduanaAux.catalogos = DATOS;
    });
  }

  /**
   * Obtiene la lista de juntas técnicas derivadas desde el servicio de catálogos y actualiza la opción correspondiente.
   * Este método consulta el catálogo de juntas técnicas usando el ID del trámite actual y asigna los datos recibidos a la propiedad opcionJuntaTecnicaDerivada.catalogos.
   */
  obtenerListaJuntasTecnicas(): void {
    this.catalogoServices.catalogojuntasTecnicas(this.tramiteId.toString()).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.opcionJuntaTecnicaDerivada.catalogos = DATOS;
    });
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.solicitudForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.solicitudForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `miembroEmpresaForm` con los datos del estado actual `solicitud32605State`.
   *
   * Este formulario recopila información detallada sobre un miembro de la empresa, como su nombre,
   * nacionalidad, RFC, tipo de persona y relación con la empresa.
   */
  inicializarFormulario(): void {
    this.solicitudForm = this.fb.group({
      aduanaAux: [this.solicitud6101State.aduanaAux, [Validators.required]],
      juntaTecnicaDerivada: [
        this.solicitud6101State.juntaTecnicaDerivada,
        [Validators.required],
      ],
      numeroPedimento: [this.solicitud6101State.numeroPedimento],
      nombreComercialMercancia: [
        this.solicitud6101State.nombreComercialMercancia,
        [
          Validators.required,
          Validators.maxLength(450),
          Validators.pattern(REGEX_IMPORTE_PAGO),
        ],
      ],
      descDetalladaMercancia: [
        this.solicitud6101State.descDetalladaMercancia,
        [
          Validators.required,
          Validators.maxLength(4000),
          Validators.pattern(REGEX_IMPORTE_PAGO),
        ],
      ],
      fraccionI: [
        this.solicitud6101State.fraccionI,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(10),
        ],
      ],
      capitulo: [{ value: this.solicitud6101State.capitulo, disabled: true }],
      partida: [{ value: this.solicitud6101State.partida, disabled: true }],
      subpartida: [
        { value: this.solicitud6101State.subpartida, disabled: true },
      ],
      subdivision: [
        { value: this.solicitud6101State.subdivision, disabled: true },
      ],
      fraccionII: [
        this.solicitud6101State.fraccionII,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(8),
        ],
      ],
      capituloII: [
        { value: this.solicitud6101State.capituloII, disabled: true },
      ],
      partidaII: [{ value: this.solicitud6101State.partidaII, disabled: true }],
      subpartidaII: [
        { value: this.solicitud6101State.subpartidaII, disabled: true },
      ],
      subdivisionII: [
        { value: this.solicitud6101State.subdivisionII, disabled: true },
      ],
      fraccionIII: [
        this.solicitud6101State.fraccionIII,
        [Validators.maxLength(10), Validators.minLength(8)],
      ],
      capituloIII: [
        { value: this.solicitud6101State.capituloIII, disabled: true },
      ],
      partidaIII: [
        { value: this.solicitud6101State.partidaIII, disabled: true },
      ],
      subpartidaIII: [
        { value: this.solicitud6101State.subpartidaIII, disabled: true },
      ],
      subdivisionIII: [
        { value: this.solicitud6101State.subdivisionIII, disabled: true },
      ],
      manifiestosSeleccionados: [false, [Validators.required]],
    });

    this.solicitud6101Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((respuesta: Solicitud6101State) => {
          this.solicitud6101State = respuesta;
          this.solicitudForm.patchValue(respuesta);
        })
      )
      .subscribe();
  }
  /**
   * Método que obtiene los catálogos desde el servicio
   */
  conseguirSolicitudCatologo(): void {
    this.solicitudService
      .conseguirSolicitudCatologo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (respuesta: SolicitudCatologo): void => {
          this.opcionAduanaAux = respuesta.aduana;
          this.opcionJuntaTecnicaDerivada = respuesta.juntaTecnicaDerivada;
        },
      });
  }

  /**
   * Maneja la selección de aduana
   * @param evento - Catálogo seleccionado
   */
  seleccionarAduana(evento: Catalogo): void {
    if (evento.clave !== undefined) {
      this.solicitud6101Store.actualizarAduanaAux(evento.clave);
    }
    // Optionally, handle the case where clave is undefined
  }

  /**
   * Maneja la selección de junta técnica derivada
   * @param evento - Catálogo seleccionado
   */
  seleccionarJuntaTecnicaDerivada(evento: Catalogo): void {
    if (evento.clave !== undefined) {
      this.solicitud6101Store.actualizarJuntaTecnicaDerivada(evento.clave);
    }
    // Optionally, handle the case where clave is undefined
  }

  /**
   * Maneja la entrada del número de pedimento y filtra caracteres no numéricos
   * @param evento - Evento del input
   */
  onNumeroPedimento(evento: Event): void {
    const ELEMENTO_DE_ENTRADA = evento.target as HTMLInputElement;
    const VALOR_DESINFECTADO = ELEMENTO_DE_ENTRADA.value.replace(
      REGEX_NUMEROS,
      ''
    );
    this.solicitud6101Store.actualizarNumeroPedimento(VALOR_DESINFECTADO);
  }

  /** Actualiza el nombre comercial de la mercancía */
  onNombreComercialMercancia(evento: Event): void {
    const ELEMENTO_DE_ENTRADA = evento.target as HTMLInputElement;
    this.solicitud6101Store.actualizarNombreComercialMercancia(
      ELEMENTO_DE_ENTRADA.value
    );
  }

  /** Actualiza la descripción detallada de la mercancía */
  onDescDetalladaMercancia(evento: Event): void {
    const ELEMENTO_DE_ENTRADA = evento.target as HTMLInputElement;
    this.solicitud6101Store.actualizarDescDetalladaMercancia(
      ELEMENTO_DE_ENTRADA.value
    );
  }

  /** Procesa la fracción I y actualiza sus partes */
  onFraccionI(evento: Event): void {
    const ELEMENTO_DE_ENTRADA = evento.target as HTMLInputElement;
    this.solicitud6101Store.actualizarFraccionI(ELEMENTO_DE_ENTRADA.value);
    const FRACCION = this.divideFraccion(ELEMENTO_DE_ENTRADA.value);
    this.solicitud6101Store.actualizarCapitulo(FRACCION.capitulo);
    this.solicitud6101Store.actualizarPartida(FRACCION.partida);
    this.solicitud6101Store.actualizarSubpartida(FRACCION.subpartida);
    this.solicitud6101Store.actualizarSubdivision(FRACCION.subdivision);
  }

  /** Procesa la fracción II y actualiza sus partes */
  onFraccionII(evento: Event): void {
    const ELEMENTO_DE_ENTRADA = evento.target as HTMLInputElement;
    this.solicitud6101Store.actualizarFraccionII(ELEMENTO_DE_ENTRADA.value);
    const FRACCION = this.divideFraccion(ELEMENTO_DE_ENTRADA.value);
    this.solicitud6101Store.actualizarCapituloII(FRACCION.capitulo);
    this.solicitud6101Store.actualizarPartidaII(FRACCION.partida);
    this.solicitud6101Store.actualizarSubpartidaII(FRACCION.subpartida);
    this.solicitud6101Store.actualizarSubdivisionII(FRACCION.subdivision);
  }

  /** Procesa la fracción III y actualiza sus partes */
  onFraccionIII(evento: Event): void {
    const ELEMENTO_DE_ENTRADA = evento.target as HTMLInputElement;
    this.solicitud6101Store.actualizarFraccionIII(ELEMENTO_DE_ENTRADA.value);
    const FRACCION = this.divideFraccion(ELEMENTO_DE_ENTRADA.value);
    this.solicitud6101Store.actualizarCapituloIII(FRACCION.capitulo);
    this.solicitud6101Store.actualizarPartidaIII(FRACCION.partida);
    this.solicitud6101Store.actualizarSubpartidaIII(FRACCION.subpartida);
    this.solicitud6101Store.actualizarSubdivisionIII(FRACCION.subdivision);
  }

  /** Actualiza el valor del checkbox de manifiestos seleccionados */
  onManifiesto(evento: Event): void {
    const ELEMENTO_DE_ENTRADA = evento.target as HTMLInputElement;
    this.solicitud6101Store.actualizarManifiestosSeleccionados(
      ELEMENTO_DE_ENTRADA.checked
    );
  }

  /**
   * Método para dividir una fracción arancelaria en sus componentes
   * @param str - Cadena de fracción
   * @returns Objeto con capitulo, partida, subpartida y subdivisión
   */
  // eslint-disable-next-line class-methods-use-this
  divideFraccion(valor: string): DivideFraccion {
    const LONGITUD_VALOR = valor.length;
    let capitulo = '';
    let partida = '';
    let subpartida = '';
    let subdivision = '';

    if (LONGITUD_VALOR === 10 || LONGITUD_VALOR === 8) {
      capitulo = valor.substr(0, 2);
      partida = valor.substr(0, 4);
      subpartida = valor.substr(0, 6);
      subdivision = LONGITUD_VALOR === 10 ? valor.substr(8, 2) : '00';
    }

    return {
      capitulo,
      partida,
      subpartida,
      subdivision,
    };
  }

  /**
   * Método de ciclo de vida que se ejecuta al destruir el componente
   * Se encarga de completar el subject y cancelar las suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
