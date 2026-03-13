/* eslint-disable @typescript-eslint/no-explicit-any */
import { Catalogo, CatalogoSelectComponent, ConsultaioQuery, REGEX_CORREO_ELECTRONICO_EXPORTADOR, TableComponent, TituloComponent} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatosSociosTable, DatosSociosTableExtranjeros } from '../../modelos/datos-empresa.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject,map, takeUntil } from 'rxjs';
import { AlertComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CatalogoServices } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DATOS_GENERALES_EXTRANJEROS } from '@ng-mf/data-access-user';
import { DATOS_GENERALES_SOCIOS } from '@ng-mf/data-access-user';
import { DatosEmpresaService } from '../../services/datos-empresa.service';
import { DatosPasos } from '@ng-mf/data-access-user';
import { InputRadioComponent } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { Tramite120602Query } from '../../estados/tramite-120602.query';
import { Tramite120602Store } from '../../estados/tramite-120602.store';
/**
 * Componente para gestionar los datos generales de socios.
 */
@Component({
  selector: 'app-datos-generales-socios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, BtnContinuarComponent, InputRadioComponent, AlertComponent, TableComponent, TablaDinamicaComponent, CatalogoSelectComponent,],
  templateUrl: './datos-generales-socios.component.html',
  styleUrl: './datos-generales-socios.component.scss',
})
export class DatosGeneralesSociosComponent implements OnInit, OnDestroy {

  /** Formulario para la solicitud del usuario */
  FormSolicitud!: FormGroup;

  /** Formulario para almacenar el recuento total de filas */
  formularioParaConteoTotal!: FormGroup;

  /** Pasos para la navegación en el asistente */
  pasos: ListaPasosWizard[] = PASOS;

  /** Índice del paso actual */
  indice: number = 1;

  /**
   * Objeto que almacena la configuración de los pasos del formulario.
   * Contiene el número total de pasos, el índice actual y los textos de los botones de navegación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Define el tipo de selección de la tabla como casilla de verificación (checkbox).
   */
  tablaCasilla = TablaSeleccion.CHECKBOX;

  /**
   * Índice de la fila seleccionada en la tabla. Por defecto, se inicializa en 1.
   */
  filaSeleccionada: number = 1;

  /** Configuración de la tabla para socios */
  configuracionTabla = DATOS_GENERALES_SOCIOS;

  /** Configuración de la tabla para socios extranjeros */
  configuracionTabla_Extranjeros = DATOS_GENERALES_EXTRANJEROS;

  /** Array de datos para socios */
  datosSocios: DatosSociosTable[] = [];

  /** Array de datos para socios extranjeros */
  datosExtranjeros : DatosSociosTableExtranjeros[] = [];

  /** 
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
   esFormularioSoloLectura: boolean = false; 

  /**
   * Campos de entrada regulares para personas mexicanas (Si + Física o Si + Moral)
   */
  camposEntradaRegulares: boolean = false;

  /**
   * Campos de entrada para persona física extranjera (No + Física)
   */
  camposPersonaFisicaExtranjera: boolean = false;

  /**
   * Campos de entrada para persona moral extranjera (No + Moral)
   */
  camposPersonaMoralExtranjera: boolean = false;

  /**
   * Array de catálogos de países.
   */
  catalogoPaises: Catalogo[] = [];

  /**
   * Identificador del trámite actual.
   * 
   * @remarks
   * Este valor representa el código único asociado al trámite que se está gestionando en el componente.
   */
  private tramites:string='120602';

  /** Notificador utilizado para cancelar suscripciones al destruir el componente.  
  *  Ayuda a prevenir fugas de memoria en flujos observables. */
  private destroyNotifier$: Subject<void> = new Subject();

/**
 * Indica si la carga de los accionistas está en proceso.
 * Se utiliza para mostrar o ocultar indicadores de carga en la interfaz.
 */
  private estaCargandoAccionistas = false; 

  /**
   * Constructor - inicializa el form builder.
   * @param fb - Instancia de FormBuilder
   */
  constructor(private fb: FormBuilder, private store: Tramite120602Store, private query: Tramite120602Query, private empresaService: DatosEmpresaService, private consultaioQuery: ConsultaioQuery,private catalogoService: CatalogoServices) {
    // Si es necesario, se puede agregar aquí la lógica del constructor.
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe()
  }

  /**
   * Guarda los datos del formulario de importador/exportador.
   * Deshabilita los campos si el formulario está en modo solo lectura.
   */

  guardarDatosFormulario(): void {
    if (this.esFormularioSoloLectura) {
    this.FormSolicitud.get('datosGeneralesSocios.nacionalidad')?.disable();
    this.FormSolicitud.get('datosGeneralesSocios.persona')?.disable();
    this.FormSolicitud.get('datosGeneralesSocios.cadenaDependencia')?.disable();
  }else if (!this.esFormularioSoloLectura){
    this.FormSolicitud.get('datosGeneralesSocios.nacionalidad')?.enable();
    this.FormSolicitud.get('datosGeneralesSocios.persona')?.enable();
    this.FormSolicitud.get('datosGeneralesSocios.cadenaDependencia')?.enable();
  }
}

/**
 * Inicializa el estado del formulario. 
 * Guarda los datos del formulario y actualiza su estado.
 */

  inicializarEstadoFormulario(): void {
  this.guardarDatosFormulario();
  this.actualizarEstadoFormulario();
}

/**
 * Ajusta el estado de solo lectura del formulario.
 * Deshabilita o habilita los campos según corresponda.
 */
actualizarEstadoFormulario(): void {
  if (this.esFormularioSoloLectura) {
    this.FormSolicitud.disable();
  } else {
    this.FormSolicitud.enable();
  }
}

  /**
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control a verificar.
   * @returns Verdadero si el control es inválido y está tocado o modificado, de lo contrario, falso.
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.FormSolicitud.get(nombreControl);
    return CONTROL ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) : false;
  }

  /**
   * Método para obtener el formulario de datos del solicitante.
   */
  get datosGeneralesSocios(): FormGroup {
    return this.FormSolicitud.get('datosGeneralesSocios') as FormGroup;
  } 

  /**
   * Hook del ciclo de vida - inicializa el componente y los formularios.
   */
  ngOnInit(): void {
  this.obtenerCatalogoPaises();

    this.FormSolicitud = this.fb.group({
      datosGeneralesSocios: this.fb.group({
        nacionalidad: ['', Validators.required],
        persona: ['', Validators.required],
        cadenaDependencia: ['', Validators.required],
        // Campos para persona física extranjera
        nombre: [''],
        apellidoPaterno: [''],
        pais: [''],
        codigoPostal: [''],
        estado: [''],
        correoElectronico: ['', [Validators.pattern(REGEX_CORREO_ELECTRONICO_EXPORTADOR), Validators.required]],
        taxId: [''],
        denominacion: [''],
      }),
    });

    this.formularioParaConteoTotal = this.fb.group({
      recuentoTotalDeFilas: [{ value: '', disabled: true }],
    });

    const TOTAL_ROW_COUNT = this.datosSocios.length;
    this.formularioParaConteoTotal.patchValue({ recuentoTotalDeFilas: TOTAL_ROW_COUNT });

    this.query.selectNacionalidad$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((data)=>{
      this.FormSolicitud.patchValue({
        datosGeneralesSocios: {
          nacionalidad: data
        }
      })
    });

    this.query.selectPersona$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((data)=>{
      this.FormSolicitud.patchValue({
        datosGeneralesSocios: {
          persona: data
        }
      })
    });

    this.query.selectCadenaDependencia$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((data)=>{
      this.FormSolicitud.patchValue({
        datosGeneralesSocios: {
          cadenaDependencia: data
        }
      })
    });
   this.inicializarEstadoFormulario();
   const NACIONALIDAD = this.FormSolicitud.get(['datosGeneralesSocios', 'nacionalidad'])?.value;
   const TIPO_PERSONA = this.FormSolicitud.get(['datosGeneralesSocios', 'persona'])?.value;
   this.actualizarBanderasCamposEntrada(NACIONALIDAD, TIPO_PERSONA);
  }

  /**
   * Agrega un nuevo socio a la lista de socios.
   * Dependiendo de los campos de entrada, agrega un socio regular o un socio extranjero.
   */
agregarSocio(): void {
  const VALOR_FORMULARIO = this.FormSolicitud.get('datosGeneralesSocios')?.value || {};
  const RFC = VALOR_FORMULARIO.cadenaDependencia || '';
  if (this.camposEntradaRegulares && RFC) {
  this.estaCargandoAccionistas = true;
    this.empresaService.getAccionistasByRFC(RFC)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response) => {
          this.estaCargandoAccionistas = false;
          if(response){
            this.aplicarAccionistasRespuesta(response);
          }
        }
      });
  }
  if (this.camposPersonaMoralExtranjera) {
    const NUEVO_SOCIO_EXTRANJERO: DatosSociosTableExtranjeros = {
      taxID: VALOR_FORMULARIO.taxId || '',
      razonSocial: VALOR_FORMULARIO.denominacion || '',
      nombre: '',
      apellidoPaterno: '',
      pais: this.getPaisDescription(VALOR_FORMULARIO.pais),
      estado: VALOR_FORMULARIO.estado || '',
      correo: VALOR_FORMULARIO.correoElectronico || '',
      codigoPostal: VALOR_FORMULARIO.codigoPostal || ''
    };
    this.datosExtranjeros.push(NUEVO_SOCIO_EXTRANJERO);
    this.datosExtranjeros = [...this.datosExtranjeros]; 
  }
  if (this.camposPersonaFisicaExtranjera) {
    const NUEVO_SOCIO_EXTRANJERO: DatosSociosTableExtranjeros = {
      taxID: VALOR_FORMULARIO.taxId || '',
      razonSocial: '', 
      nombre: VALOR_FORMULARIO.nombre || '',
      apellidoPaterno: VALOR_FORMULARIO.apellidoPaterno || '',
      pais: this.getPaisDescription(VALOR_FORMULARIO.pais),
      estado: VALOR_FORMULARIO.estado || '',
      correo: VALOR_FORMULARIO.correoElectronico || '',
      codigoPostal: VALOR_FORMULARIO.codigoPostal || ''
    };
    this.datosExtranjeros.push(NUEVO_SOCIO_EXTRANJERO);
    this.datosExtranjeros = [...this.datosExtranjeros]; 
  }
}

/**
 * Procesa la respuesta de la API de accionistas y actualiza 
 * el arreglo `datosSocios` con la información de cada persona relacionada.
 */
private aplicarAccionistasRespuesta(apiResponse: any): void {
  const DATOS = apiResponse?.datos || [];

  DATOS.forEach((item: any) => {
    const ACCIONISTA = item.personaRelacionada;
    if (!ACCIONISTA) {return;}

    const PERSONA_VALOR = ACCIONISTA.ideTipoPersona === 'TIPER.FI';

    const NUEVO_SOCIO: DatosSociosTable = {
      rfc: ACCIONISTA.rfc || '',
      razonsocial: PERSONA_VALOR ? (ACCIONISTA.razonSocial || '') : '',
      nombre: PERSONA_VALOR ? (ACCIONISTA.nombre || '') : '',
      apellidoPaterno: PERSONA_VALOR ? (ACCIONISTA.apellidoPaterno || '') : '',
      apellidoM: PERSONA_VALOR ? (ACCIONISTA.apellidoMaterno || '') : '',
      correo: ACCIONISTA.correoElectronico || ''
    };
    this.datosSocios.push(NUEVO_SOCIO);
    this.datosSocios = [...this.datosSocios];
  });
}

  /**
   * Actualiza las banderas booleanas basadas en la combinación de nacionalidad y tipo de persona.
   * - Si (mexicana) + Física o Moral = camposEntradaRegulares
   * - No (extranjera) + Física = camposPersonaFisicaExtranjera  
   * - No (extranjera) + Moral = camposPersonaMoralExtranjera
   */
  actualizarBanderasCamposEntrada(nacionalidad :string, tipoPersona:string): void {
    const NACIONALIDAD = nacionalidad; 
    const TIPO_PERSONA = tipoPersona; 

    // Resetear todas las banderas
    this.camposEntradaRegulares = false;
    this.camposPersonaFisicaExtranjera = false;
    this.camposPersonaMoralExtranjera = false;

    // Determinar qué campos mostrar según la combinación
    if (NACIONALIDAD === 'Si') { 
      this.camposEntradaRegulares = true;
    } 
    else if (NACIONALIDAD === 'No') { 
      if (TIPO_PERSONA === 'Si') { 
        this.camposPersonaFisicaExtranjera = true;
      } else if (TIPO_PERSONA === 'No') { 
        this.camposPersonaMoralExtranjera = true;
      }
    }
  }

  /**
   * Maneja el evento de cambio en la selección de una fila de la tabla.
   * Actualiza el índice de la fila seleccionada y el estado del formulario.
   */
  enCambioNacionalidad(nacionalidad:string): void {
      const PERSONA_VALUE = this.FormSolicitud.get(['datosGeneralesSocios','persona'])?.value;
      setTimeout(()=>{
        this.actualizarBanderasCamposEntrada(nacionalidad,PERSONA_VALUE);
      }, 300);
      const NACIONALIDAD_VALUE = this.FormSolicitud.get(['datosGeneralesSocios', 'nacionalidad'])?.value;
      this.store.setNacionalidad(NACIONALIDAD_VALUE);
  }

  /**
   * Maneja el evento de cambio en la selección de una fila de la tabla.
   */

  enCambioPersona(tipoPersona:string): void {
      const PERSONA_VALUE = this.FormSolicitud.get(['datosGeneralesSocios','persona'])?.value;
      this.store.setPersona(PERSONA_VALUE);
      setTimeout(()=>{
        this.actualizarBanderasCamposEntrada(this.FormSolicitud.get(['datosGeneralesSocios','nacionalidad'])?.value, tipoPersona);
      }, 300);
  }

   /**
   * Método para actualizar el valor del campo en el store.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.store.establecerDatos({ [campo]: VALOR });
   
  }
  /**
   * Maneja el evento de cambio en la cadena de dependencia.
   * Actualiza el estado del store con el nuevo valor de la cadena de dependencia.
   */

  enCambioCadenaDependencia(): void {
    this.store.setCadenaDependencia(this.FormSolicitud.get(['datosGeneralesSocios','cadenaDependencia'])?.value);
  }

/**
 * @description Obtiene el catálogo paises desde el servicio y asigna los datos a la variable `catalogoPaises`.
 * @returns {void} No devuelve ningún valor, solo actualiza el estado del componente.
 */
  obtenerCatalogoPaises(): void {
      this.catalogoService.paisesCatalogo(this.tramites)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          this.catalogoPaises = response?.datos ?? [];
        }
      });
}

  /**
   * Devuelve la descripción del país dado su ID.
   * @param paisId El ID del país.
   * @returns La descripción del país o el ID si no se encuentra.
   */
  getPaisDescription(paisClave: string | number): string {
    const PAIS = this.catalogoPaises.find(p => p.clave === paisClave);
    return PAIS ? PAIS.descripcion : paisClave as string;
  }

  /**
   * Hook del ciclo de vida - se ejecuta cuando el componente se destruye.
   * Libera los recursos y completa el Subject `destroyed$`.
   * @param {void}
   */

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
