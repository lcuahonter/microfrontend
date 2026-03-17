/**
 * @fileoverview Componente para la gestión del formulario de asignación.
 * Este componente maneja la lógica y la presentación del formulario de asignación,
 * incluyendo la inicialización, la obtención de datos y la gestión de los controles del formulario.
 * @module AsignciontabComponent
 */
import { AbstractControl ,ValidationErrors} from '@angular/forms';
import { CatalogoServices, ConsultaioQuery, TituloComponent } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite120403State, Tramite120403Store } from '../../estados/store/tramite120403.store';
import { AsignacionRootResponse } from '../../models/expedicion-certificados-frontera.models';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component';
import { SolicitantetabComponent } from '../solicitantetab/solicitantetab.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite120403Query } from '../../estados/queries/tramite120403.query';
/**
 * Componente para la gestión del formulario de asignación.
 * @selector app-asignciontab
 * @standalone true
 * @imports [CommonModule, TituloComponent, ReactiveFormsModule, CatalogoSelectComponent, SolicitantetabComponent, InputRadioComponent]
 * @templateUrl ./asignciontab.component.html
 * @styleUrl ./asignciontab.component.scss
 */
@Component({
  selector: 'app-asignciontab',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, CatalogoSelectComponent,SolicitantetabComponent, InputRadioComponent],
  templateUrl: './asigncion-tab.component.html',
  styleUrls: ['./asigncion-tab.component.scss'],
})
export class AsignciontabComponent implements OnInit, OnChanges, OnDestroy {

    /**
     * Emisor de eventos para notificaciones de intentos de búsqueda
     */
  @Output() buscarIntento = new EventEmitter<{submitted: boolean, invalid: boolean,numTramite: string}>();

  /**
   * Indicador para rastrear si el formulario ha sido enviado
   */
  submitted = false;

  /**
   * Sujeto para manejar la destrucción del componente.
   */
  public destroyed$ = new Subject<void>();

  /**
   * Formulario de asignación.
   */
  asignacionForm!: FormGroup;

  /**
   * Valor seleccionado de asignación.
   */
  selectedAsigncion: string | number = '';

  /**
   * Valor seleccionado para el componente de radio.
   */
  selectedValue: string | number = 'no';

 /**
   * Opciones de radio para la asignación.
   */
   asignacionRadio = [
    {
      label: 'Ampliación de vigencia',
      value: 'vigencia'
    },
    {
      label: 'Amplicacion de monto',
      value: 'monto'
    }
  ];

   /**
   * Arreglo de montos que representa las filas de la tabla.
   * Each element corresponds to a record of type `Monto`.
   * Initialize as empty array instead of MONTO_DATOS
   */

   formaDato!:AsignacionRootResponse;

  /**
   * Estado de la solicitud.
   * Este estado se obtiene del store `Tramite120403Query`.
   */
  public solicitudState!: Tramite120403State;
  /**
   * Lista de asignaciones.
   */
  public solicitanteList: Catalogo[] =[];
  /**
   * Indica si el formulario es de solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /** Identificador único del procedimiento administrativo asociado al trámite de asignación directa. */
  private idProcedimiento: number = 120403;
/**
 * Constructor del componente.
 * @param fb FormBuilder para la creación del formulario.
 * @param service Servicio para obtener los datos de asignación.
 */
    @Input() isContinuarTriggered: boolean = false;
  /**
   * Constructor del componente.
   *  FormBuilder para la creación del formulario.
   *  Servicio para obtener los datos de asignación.
   */
  constructor(private fb: FormBuilder, private catalogoServices: CatalogoServices, 
    private tramite120403Store:Tramite120403Store,private tramite120403Query:Tramite120403Query,
     private consultaioQuery: ConsultaioQuery,private solicitudService:SolicitudService) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void { 
    this.obtenerEstadoSolicitud();
    this.inicializarEstadoFormulario();
      this.getAnoOficioDatos()
  }

  /**
   * Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * @return {void}
   * No retorna ningún valor.
   */
  ngOnChanges(): void { 
     if(this.isContinuarTriggered){
      this.validarFormularios();
    }
  }

  /**
   * Validador personalizado para comprobar si el valor es un número válido
   * @param control - El control de formulario a validar
   * @returns ValidationErrors o null
   */
  private static numeroValidoValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // No validar valores vacíos, dejar que el validador 'required' lo maneje
    }
    
    const VALUE = control.value.toString().trim();
    const ISVALIDNUMBER = /^\d+$/.test(VALUE); // Solo permite dígitos

    if (!ISVALIDNUMBER) {
      return { 
        numeroInvalido: { 
          valor: VALUE 
        } 
      };
    }
    
    return null;
  }

  /**
   * Inicializa el formulario de asignación.
   */
  initForm(): void {
    this.asignacionForm = this.fb.group({
      asignacionRadio: [this.solicitudState?.asignacionRadio || '', Validators.required],
      asignacionsolitud: [this.solicitudState?.asignacionsolitud || '', Validators.required],
      numTramite: [
        this.solicitudState?.numTramite || '', 
        [
          Validators.required, 
          Validators.maxLength(30),
          AsignciontabComponent.numeroValidoValidator
        ]
      ],
    });
    
  this.asignacionForm.updateValueAndValidity();
  }
  

/**
 * Obtiene los datos del catálogo de año de oficio relacionados con los trámites actuales.
 * Realiza una solicitud al servicio de catálogo utilizando los trámites seleccionados,
 * y asigna la respuesta al arreglo `anoOficioDatos` como una lista de objetos `Catalogo`.
 * La suscripción se cancela automáticamente al destruir el componente.
 */
getAnoOficioDatos():void{
 this.catalogoServices
      .asignacionCatalogo(this.idProcedimiento.toString())
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.solicitanteList = res.datos as Catalogo[];
      });

}

/**
 * @method obtenerEstadoSolicitud
 * @description
 * Método que obtiene el estado actual de la solicitud almacenado en la tienda `Tramite120403Query`.
 * Se suscribe al observable `selectTramite120403$` para recibir actualizaciones en tiempo real.
 * La suscripción se gestiona con `takeUntil(this.destroyed$)` para evitar fugas de memoria.
 *
 * @returns {void}
 * No retorna ningún valor, pero actualiza la variable `solicitudState` con los datos obtenidos.
 */
   obtenerEstadoSolicitud(): void {
    this.tramite120403Query.selectTramite120403$?.pipe(takeUntil(this.destroyed$))
      .subscribe((data: Tramite120403State) => {
        this.solicitudState = data;
      });
  }
  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.  
   * Ejecuta la lógica correspondiente según el estado del componente.
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.initForm();
    }
  }
  /**
   * Verifica si un control del formulario es inválido.
   * Identificador del control.
   * true si el control es inválido, false en caso contrario.
   */
  isInvalid(id: string): boolean | null {
    const CONTROL = this.asignacionForm.get(id);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : null;
  }

  /**
   * Obtiene el mensaje de error para el campo numTramite
   * @returns cadena con el mensaje de error correspondiente
   */
  getNumTramiteErrorMessage(): string {
    const CONTROL = this.asignacionForm.get('numTramite');
    if (CONTROL?.errors && CONTROL.touched) {
      if (CONTROL.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (CONTROL.errors['numeroInvalido']) {
        const VALOR = CONTROL.errors['numeroInvalido'].valor;
        return `El valor (${VALOR}) debe ser un número válido`;
      }
      if (CONTROL.errors['maxlength']) {
        return 'El número no puede exceder 30 caracteres';
      }
    }
    return '';
  }


 /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.initForm();
    if (this.esFormularioSoloLectura) {
      this.asignacionForm.disable();
    } else { 
      this.asignacionForm.enable();
 this.asignacionForm.updateValueAndValidity();
    } 
}
  /**
  * Obtiene el valor de un control en el formulario y lo pasa a un método del store para actualizar el estado.
  */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite120403Store.establecerDatos({ [campo]: VALOR });
     const CONTROL = form.get(campo);
    if (CONTROL) {
      CONTROL.updateValueAndValidity();
    }
    const ISVALID = this.validarFormularios();
    this.tramite120403Store.setFormValidity('asigncion', ISVALID);
  }

  /**
   * Inicia el proceso de búsqueda de datos.
   * Establece la bandera `buscarDatos` en true para indicar que se está ejecutando una búsqueda.
   * Este método se ejecuta cuando el usuario hace clic en el botón "Buscar" del formulario.
   * 
   * @returns {void} No retorna ningún valor.
   */
  buscar(): void {
    
    this.submitted = true;
    this.asignacionForm.updateValueAndValidity();
    const FORM = this.asignacionForm;
    this.buscarIntento.emit({
      submitted: this.submitted,
      invalid: this.asignacionForm.invalid,
      numTramite: this.solicitudState?.numTramite
          });

    if (FORM.valid) {
      this.tramite120403Store.setBuscarSection(true);
      this.getBuscarDatos();
        
    } else {
      this.asignacionForm.markAllAsTouched();
      this.tramite120403Store.setBuscarSection(false);
    }
  }

  getBuscarDatos():void{
    const PAYLOAD={
  "solicitud": {
    "solicitante": {
      "cveUsuario": "AAL0409235E6",
      "rfc": "AAL0409235E6",
      "razonSocial": "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
      "descripcionGiro": "Siembra, cultivo y cosecha de otros cultivos",
      "correoElectronico": "vucem2021@gmail.com",
      "telefono": "55-98764532",
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
        "colonia": {
          "clave": "00181210001",
          "nombre": "MIGUEL HIDALGO"
        },
        "localidad": {
          "clave": "00181210008",
          "nombre": "LOS MOCHIS"
        },
        "codigoPostal": "81210",
        "calle": "CAMINO VIEJO",
        "numeroExterior": "1353",
        "numeroInterior": ""
      }
    },
    "cveRolCapturista": "PersonaMoral",
    "cveUsuarioCapturista": "AAL0409235E6",
    "asignacion": {
      "tipoAsignacionDirecta": "TIASD.AV"
    },
    "asignacionBusqueda": {
      "anoAutorizacion": this.asignacionForm.get('asignacionsolitud')?.value,
      "numFolioAsignacion": this.asignacionForm.get('numTramite')?.value
    },
    "operacion": "ampliacion",
    "idSolicitud": "",
    "tramite": {
      "numFolioTramite": ""
    }
  },
  "puedeCapturarRepresentanteLegalCG": false,
  "obtenerDatosAsignacion": "Buscar"
}
this.solicitudService.getBuscarDatosDos(PAYLOAD)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((response) => {
     this.formaDato=response.datos;
    });
  }

  /**
   * Valida los formularios del componente.
   * @returns {boolean} Indica si los formularios son válidos.
   */
  validarFormularios(): boolean { 
  const ASIGNACIONFORM = this.asignacionForm.valid;
  if (!ASIGNACIONFORM) {
    this.asignacionForm.markAllAsTouched();
  }
  this.tramite120403Store.setFormValidity('asigncion', ASIGNACIONFORM);
  return ASIGNACIONFORM;
  }


  /**
   * Método de destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}