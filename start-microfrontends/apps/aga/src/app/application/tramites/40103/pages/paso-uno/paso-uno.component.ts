
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState, FormularioDinamico } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';

import { ChoferesComponent } from '../../components/choferes/choferes.component';
import { DirectorGeneralComponent } from '../../components/director-general/director-general.component';
import { SolicitanteComponent } from '../../components/solicitante/solicitante.component';
import { VehiculosComponent } from '../../components/vehiculos/vehiculos.component';

import { Chofer40103Service } from '../../estados/chofer40103.service';

import { ChoferesExtranjeros, DatosDelChoferNacional } from '../../models/registro-muestras-mercancias.model';
import { Chofer40103Query } from '../../estados/chofer40103.query';
import { Choferesnacionales40103State } from '../../estados/chofer40103.store';

@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Referencias a los componentes hijo para validación.
   */
  @ViewChild('solicitanteComponent') solicitanteComponent!: SolicitanteComponent;
  @ViewChild('directorGeneralComponent') directorGeneralComponent!: DirectorGeneralComponent;
  @ViewChild('choferesComponent') choferesComponent!: ChoferesComponent;
  @ViewChild('vehiculosComponent') vehiculosComponent!: VehiculosComponent;

  /**
   * Referencia al componente hijo `SolicitanteComponent` dentro de la plantilla.
   * Permite acceder a las propiedades y métodos públicos del componente hijo.
   * @deprecated Use solicitanteComponent instead
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;
  /**
   * Representa el tipo de persona asociado.
   * 
   * @type {number}
   * @remarks
   * Este valor puede ser utilizado para determinar el tipo de persona
   * (por ejemplo, física o moral) en el contexto de la aplicación.
   */
  tipoPersona!: number;
 /**
   * Booleano para mostrar u ocultar el componente de director general.
   */
  isShowDirector: boolean = false;

  /**
   * Arreglo que contiene objetos de tipo FormularioDinamico.
   * Representa la información relacionada con una persona en el formulario dinámico.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Arreglo que contiene los formularios dinámicos relacionados con el domicilio fiscal.
   * Este arreglo se utiliza para almacenar y gestionar los datos del formulario
   * en el paso uno del trámite.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice que representa un número inicial o posición en un flujo o proceso.
   * Se utiliza para controlar el estado o paso actual en la lógica de la aplicación.
   */
  indice: number = 1;

  /**
   * Indica si la validación es exitosa o no.
   * 
   * @type {boolean}
   * @default false
   */
  validacion: boolean = false;

  /**
   * Propiedad de entrada que representa el número de pedimento.
   * Este valor es proporcionado desde el componente padre y se utiliza
   * para mostrar o procesar información relacionada con el pedimento.
   */
  @Input() datosNroPedimento!: string;
  
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
  * @property {ConsultaioState} consultaDatos
  * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
  */
  consultaDatos!: ConsultaioState;

  /**
   * Gancho de ciclo de vida angular que se llama después de que la vista del componente se haya inicializado por completo.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
  }
  /**
   * Estado de validación de cada sección
   */
  private validacionStates = {
    solicitante: false,
    directorGeneral: false
  };

  /**
   * Selecciona una pestaña.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    // Validar la pestaña actual antes de cambiar
    this.validarTabActual();
    this.indice = i;
  }

  /**
   * Valida la pestaña actual y guarda el estado de validación
   */
  private validarTabActual(): void {
    switch (this.indice) {
      case 1: // Solicitante
        if (this.solicitanteComponent) {
          this.validacionStates.solicitante = this.solicitanteComponent.validarFormularios();
        }
        break;
      case 2: // Director General
        if (this.directorGeneralComponent) {
          this.validacionStates.directorGeneral = this.directorGeneralComponent.validarFormularios();
        }
        break;
      default:
        // No validation needed for other tabs
        break;
    }
  }

  /**
   * Constructor del componente PasoUnoComponent.
   * Inicializa el servicio Chofer40103Service y el query ConsultaioQuery.
   * 
   * @param chofer40103Service - Servicio para manejar la lógica de negocio relacionada con los choferes.
   * @param consultaQuery - Query para manejar el estado de la consulta.
   */
  constructor(        
    private chofer40103Service: Chofer40103Service,
    private consultaQuery: ConsultaioQuery,
    private chofer40103Query: Chofer40103Query
  ) {
    
  }

  /**
   * Método del ciclo de vida de Angular que se llama al inicializar el componente.
   * Se suscribe a los cambios en el estado de la consulta y actualiza los datos del chofer
   * y del director general si hay una actualización.
   *  * @remarks
   * Este método se ejecuta una vez que el componente ha sido inicializado y está listo para interactuar con el usuario.
   * Se utiliza para cargar datos iniciales y configurar el estado del componente.
   * @returns void
   **/
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$), 
      map((seccionState) => {
        this.consultaDatos = seccionState;
    })).subscribe();

      this.chofer40103Query.selectSolicitud$
          .pipe(takeUntil(this.destroyed$))
          .subscribe((data: Choferesnacionales40103State) => {
            this.isShowDirector = data?.isShowDirector;
          });
    
    if (this.consultaDatos.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.chofer40103Service
      .getDirectorGeneralData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        // Actualiza el estado del chofer40103Store con los datos del director general
        this.chofer40103Service.updateStateDirectorGeneralData(data);
        this.esDatosRespuesta = true;
      });

    this.chofer40103Service
      .obtenerTablaDatos<DatosDelChoferNacional>('mock-data-choferes-nacionales.json')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.chofer40103Service.updateDatosDelChoferNacional(response);
        this.chofer40103Service.updateDatosDelChoferNacionalModification(response);
        this.chofer40103Service.updateDatosDelChoferNacionalRetirada(response);
        this.esDatosRespuesta = true;
      });

    this.chofer40103Service
      .obtenerTablaDatos<ChoferesExtranjeros>('mock-data-choferes-extranjero.json')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.chofer40103Service.updateDatosDelChoferExtranjero(response);
        this.chofer40103Service.updateDatosDelChoferExtranjeroModification(response);
        this.chofer40103Service.updateDatosDelChoferExtranjeroRetirada(response);
        this.esDatosRespuesta = true;
      });
  }

  /**
   * Valida todos los formularios de los componentes del paso uno.
   * @returns {object} Objeto con los estados de validación de cada formulario.
   */
  public validarTodosLosFormularios(): { formularioUnoValido: boolean; formularioDosValido: boolean } {
    // Compruebe si todos los datos requeridos están cargados
    if (!this.esDatosRespuesta) {
      return {
        formularioUnoValido: false,
        formularioDosValido: true
      };
    }

    // Validar la pestaña actual primero
    this.validarTabActual();

    // Ahora valide todos los componentes requeridos utilizando los estados almacenados y los componentes actuales
    let SOLICITANTE_VALIDO = this.validacionStates.solicitante;
    let DIRECTOR_GENERAL_VALIDO = this.validacionStates.directorGeneral;

    // Si el componente actual está disponible, valídelo directamente
    if (this.indice === 1 && this.solicitanteComponent) {
      SOLICITANTE_VALIDO = this.solicitanteComponent.validarFormularios();
    }
    
    if (this.indice === 2 && this.directorGeneralComponent) {
      DIRECTOR_GENERAL_VALIDO = this.directorGeneralComponent.validarFormularios();
    }

    // Validación de Choferes y Vehículos eliminada - estas secciones ya no requieren validación para el botón Continuar

    const TODOS_VALIDOS = SOLICITANTE_VALIDO && DIRECTOR_GENERAL_VALIDO;

    return {
      formularioUnoValido: TODOS_VALIDOS,
      formularioDosValido: true // Se mantiene como true por compatibilidad
    };
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Se utiliza para limpiar recursos y evitar fugas de memoria.
   */
  ngOnDestroy(): void {

    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
