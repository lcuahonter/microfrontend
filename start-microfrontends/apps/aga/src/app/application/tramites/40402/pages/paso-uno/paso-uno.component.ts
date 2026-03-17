import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  ConsultaioQuery,
  ConsultaioState,
  FormularioDinamico
  } from '@ng-mf/data-access-user';
  
import { AsignarPersonaComponent } from '../../components/asignar-persona/asignar-persona/asignar-persona.component';
import { DatosTramiteComponent } from '../../components/datos-tramite/datos-tramite.component';
import { SolicitanteComponent } from '../../components/solicitante/solicitante.component';

import {FormControl, FormGroup, Validators } from '@angular/forms';

import {
  DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL,
  PERSONA_MORAL_NACIONAL
} from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';

import { Subject } from 'rxjs';

import { map, takeUntil } from 'rxjs/operators';

import { Tramite40402Store } from '../../estados/tramite40402.store';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';

import { DatosTramiteService } from '../../services/datos-tramite.service';

/**
 * Componente para el primer paso del trámite.
 * 
 * @class PasoUnoComponent
 * @implements {AfterViewInit, OnDestroy, OnInit}
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements AfterViewInit, OnDestroy, OnInit {
  /**
   * Indica si el formulario de DatosTramite es válido tras intentar continuar.
   */
  public mostrarErrorDatosTramite: boolean = false;

    /**
   * Constructor del componente.
   * 
   * @constructor
   * @param {TransportacionMaritimaService} service Servicio de transporte marítimo
   * @param {ConsultaioQuery} consultaioQuery Consulta de estado del trámite
   * @param {Tramite40402Store} store Almacén de estado del trámite
   */
  constructor(
    private datosTramiteService: DatosTramiteService,
    private service: TransportacionMaritimaService,
    public consultaioQuery: ConsultaioQuery,
    private store: Tramite40402Store
  ) {
    // No hay lógica adicional en el constructor por ahora
  }

  /**
   * Método que se llama al hacer clic en "Continuar".
   * Valida el formulario de DatosTramite, marca todos los campos como tocados y muestra alerta si es inválido.
   */
  public continuar(): void {
  const ES_VALIDO = this.datosTramiteService.validarFormulario();
  this.mostrarErrorDatosTramite = !ES_VALIDO;
  }
  /**
   * Marca todos los formularios hijos como tocados y retorna si todos son válidos.
   * Similar a validarDestinatarioFormulario en 220402.
   * @returns {boolean} true si todos los formularios son válidos, false si falta capturar campos.
   */
  /**
   * Valida únicamente el formulario de datos-tramite.component
   * Marca todos los campos como tocados y retorna si es válido.
   * @returns {boolean} true si el formulario es válido, false si falta capturar campos.
   */
  public validarFormulariosPasoUno(): boolean {
  return this.datosTramiteService.validarFormulario();
  }
  /**
   * Índice del paso actual en el asistente.
   * @type {number}
   */
  @Input() indice: number = 1;

  /**
   * Referencia al componente Solicitante.
   * @type {SolicitanteComponent}
   */
    /**
     * Referencia al componente Solicitante.
     * Permite acceder a los métodos y propiedades del componente Solicitante desde este componente padre.
     */
    @ViewChild('Solicitante', { static: false }) Solicitante?: SolicitanteComponent;
    /**
     * Referencia al componente DatosTramite.
     * Permite validar y manipular el formulario de datos del trámite.
     */
    @ViewChild('DatosTramite', { static: false }) DatosTramite?: DatosTramiteComponent;
    /**
     * Referencia al componente AsignarPersona.
     * Permite acceder a la lógica de asignación de persona en el trámite.
     */
    @ViewChild('AsignarPersona', { static: false }) AsignarPersona?: AsignarPersonaComponent;

    /** Form groups para cada tab (debes ajustar los controles según tus necesidades) */
  public grupoFormularioUno: FormGroup = new FormGroup({
    campoUno: new FormControl('', Validators.required)
  });
  /**
   * Grupo de formulario para la segunda pestaña del asistente.
   *
   * Contiene el campo:
   * - campoDos: Campo requerido para la segunda sección del formulario.
   *
   * @type {FormGroup}
   */
  public grupoFormularioDos: FormGroup = new FormGroup({    
    campoDos: new FormControl('', Validators.required)
  });

/**
 * Valida el formulario de datos-tramite usando la lógica estricta del componente hijo.
 * Devuelve true solo si todos los campos requeridos están llenos y válidos.
 */
public validarFormularios(): boolean {
  const RESULTADO = this.datosTramiteService.validarFormulario();
  return RESULTADO;
}

  /**
   * Valida un FormGroup, marcando todos sus controles como tocados para mostrar errores de validación.
   * @param {FormGroup | undefined} formGroup - El FormGroup a validar.
   * @returns {boolean} true si el FormGroup es válido, true si es undefined, false si es inválido.
   */
  private static validarFormGroup(formGroup: FormGroup | undefined): boolean {
    if (formGroup) {
      Object.values(formGroup.controls).forEach(control => control.markAsTouched());
      return formGroup.valid;
    }
    return true;
  }

  /**
   * Valida un formulario dentro de un componente, marcando todos los campos como tocados y ejecutando una función opcional para mostrar errores.
   * @param {Record<string, unknown>} comp - El componente que contiene el formulario.
   * @param {string} formProp - El nombre de la propiedad del formulario dentro del componente.
   * @param {string} mostrarErroresProp - El nombre de la función para mostrar errores (opcional).
   * @returns {boolean} true si el formulario es válido o el componente es undefined, false si es inválido.
   */
  private static validarCompForm(
    comp: Record<string, unknown>,
    formProp: string,
    mostrarErroresProp: string
  ): boolean {
    if (comp && comp[formProp] instanceof FormGroup) {
      (comp[formProp] as FormGroup).markAllAsTouched();
      if (typeof comp[mostrarErroresProp] === 'function') {
        (comp[mostrarErroresProp] as () => void)();
      }
      return (comp[formProp] as FormGroup).valid;
    }
    return true;
  }

  /**
  * Valida todos los formularios de los componentes hijos del paso uno.
  * Marca todos los campos como tocados para mostrar errores de validación.
  * @returns {{ formularioUnoValido: boolean; formularioDosValido: boolean }} Un objeto con la validez de los formularios de la pestaña 1 y 2.
  */
  public validarTodosLosFormularios(): { formularioUnoValido: boolean; formularioDosValido: boolean } {
    const VALIDAR_COMPONENTE_FORMULARIO = (componente: unknown, propiedadFormulario: string): boolean => {
      if (
        componente &&
        typeof componente === 'object' &&
        propiedadFormulario in componente &&
        (componente as Record<string, unknown>)[propiedadFormulario] instanceof FormGroup
      ) {
        ((componente as Record<string, unknown>)[propiedadFormulario] as FormGroup).markAllAsTouched();
        return ((componente as Record<string, unknown>)[propiedadFormulario] as FormGroup).valid;
      }
      return true;
    };

    const FORMULARIO_UNO_VALIDO = VALIDAR_COMPONENTE_FORMULARIO(this.DatosTramite, 'formulario') &&
                                 VALIDAR_COMPONENTE_FORMULARIO(this.Solicitante, 'solicitudForm');
    const FORMULARIO_DOS_VALIDO = VALIDAR_COMPONENTE_FORMULARIO(this.AsignarPersona, 'formulario');

    return {
      formularioUnoValido: FORMULARIO_UNO_VALIDO,
      formularioDosValido: FORMULARIO_DOS_VALIDO
    };
  }


  /**
   * Tipo de persona asociada al trámite.
   * 
   * @type {number}
   */
  tipoPersona!: number;

  /**
   * Configuración del formulario dinámico para persona.
   * 
   * @type {FormularioDinamico[]}
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración del formulario dinámico para domicilio fiscal.
   * 
   * @type {FormularioDinamico[]}
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Estado de validación del formulario.
   * 
   * @type {boolean}
   */
  validacion: boolean = false;

  /**
   * Datos del número de pedimento.
   * 
   * @type {string}
   */
  @Input() datosNroPedimento!: string;

  /**
   * Datos de consulta del trámite.
   * 
   * @type {ConsultaioState}
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indicador de respuesta de datos obtenida.
   * 
   * @type {boolean}
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para gestionar la destrucción de suscripciones.
   * 
   * @type {Subject<void>}
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Inicialización del componente.
   * 
   * @method ngOnInit
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
      this.fetchGetDatosConsulta();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Hook de ciclo de vida después de la inicialización de la vista.
   * 
   * @method ngAfterViewInit
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
  }

  /**
   * Selecciona una pestaña por índice.
   * 
   * @method seleccionaTab
   * @param {number} i Índice de la pestaña a seleccionar
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene datos de consulta del servicio.
   * 
   * @method fetchGetDatosConsulta
   */
  public fetchGetDatosConsulta(): void {
    this.service
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.success) {
          this.esDatosRespuesta = true;
          this.store.setSeguroNumero(respuesta?.datos?.seguroNumero);
          this.store.setNombrePFE(respuesta?.datos?.nombrePFE);
          this.store.setApellidoPaternoPFE(respuesta?.datos?.apellidoPaternoPFE);
          this.store.setApellidoMaternoPFE(respuesta?.datos?.apellidoMaternoPFE);
          this.store.setCorreoPFE(respuesta?.datos?.correoPFE);
          this.store.setPaisPFE(respuesta?.datos?.paisPFE);
          this.store.setCodigoPostalPFE(respuesta?.datos?.codigoPostalPFE);
          this.store.setCiudadPFE(respuesta?.datos?.ciudadPFE);
          this.store.setEstadoPFE(respuesta?.datos?.estadoPFE);
          this.store.setCallePFE(respuesta?.datos?.callePFE);
          this.store.setNumeroExteriorPFE(respuesta?.datos?.numeroExteriorPFE);
          this.store.setNumeroInteriorPFE(respuesta?.datos?.numeroInteriorPFE);

          this.store.setPersonaFisicaExtranjeraTabla(respuesta?.datos?.personaFisicaExtranjeraTabla);
          this.store.setPersonaMoralExtranjeraTabla(respuesta?.datos?.personaMoralExtranjeraTabla);

          this.store.setDenominacionPME(respuesta?.datos?.denominacionPME);
          this.store.setCorreoPME(respuesta?.datos?.correoPME);
          this.store.setPaisPME(respuesta?.datos?.paisPME);
          this.store.setCodigoPostalPME(respuesta?.datos?.codigoPostalPME);
          this.store.setCiudadPME(respuesta?.datos?.ciudadPME);
          this.store.setEstadoPME(respuesta?.datos?.estadoPME);
          this.store.setCallePME(respuesta?.datos?.callePME);
          this.store.setNumeroExteriorPME(respuesta?.datos?.numeroExteriorPME);
          this.store.setNumeroInteriorPME(respuesta?.datos?.numeroInteriorPME);

          this.store.setNombreDG(respuesta?.datos?.nombreDG);
          this.store.setApellidoPaternoDG(respuesta?.datos?.apellidoPaternoDG);
          this.store.setApellidoMaternoDG(respuesta?.datos?.apellidoMaternoDG);

          this.store.setTipoDeCaatAerea(respuesta?.datos?.tipoDeCaatAerea);
          this.store.setIdeCodTransportacionAerea(respuesta?.datos?.ideCodTransportacionAerea);
          this.store.setCodIataIcao(respuesta?.datos?.codIataIcao);
        }
      });
  }

  /**
   * Destrucción del componente.
   * 
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}