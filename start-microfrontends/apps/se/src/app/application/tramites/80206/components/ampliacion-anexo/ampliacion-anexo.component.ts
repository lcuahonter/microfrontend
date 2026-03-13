/**
 * El `AmpliacionAnexoComponent` es un componente de Angular diseñado para gestionar la funcionalidad del módulo "Ampliación de Servicios".
 * Maneja formularios reactivos, catálogos, y la interacción con el estado para la gestión de datos relacionados con fracciones arancelarias,
 * importaciones y servicios IMMEX.
 * Este componente proporciona funcionalidad para la ampliación de servicios, incluyendo la inicialización de formularios, 
 * la obtención de datos y la interacción con el estado para la gestión de fracciones arancelarias e importaciones.
 */

import {
  Catalogo,
  TablaSeleccion,
  doDeepCopy,
  esValidObject,
} from '@ng-mf/data-access-user';

import {
  Arancelaria,
  ArancelariaImportacion,
  Servicios
} from "../../models/datos-info.model";

import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';

import {
  CONFIGURACION_ARANCELARIAS,
  CONFIGURACION_ARANCELARIASIMPORTACION,
  TEXTOS_80206
} from "../../constantes/modificacion.constants";

import { OnDestroy, OnInit } from '@angular/core';
import { map,takeUntil} from 'rxjs/operators';
import { AmpliacionServiciosQuery } from '../../estados/tramite80206.query';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { AmpliacionServiciosState } from '../../estados/tramite80206.store';
import { ApiResponse } from "../../models/datos-info.model";
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '../../models/configuracion-columna.model';
import { HttpClient } from '@angular/common/http';
import { Input } from '@angular/core';
import { Subject } from 'rxjs';
import { Tramite80206Store } from '../../estados/tramite80206.store';

/**
 * El `AmpliacionAnexoComponent` es un componente de Angular diseñado para gestionar la funcionalidad 
 * del módulo "Ampliación de Servicios". Maneja formularios reactivos, catálogos, y la interacción 
 * con el estado para la gestión de datos relacionados con fracciones arancelarias, importaciones 
 * y servicios IMMEX.
 */
@Component({
  selector: 'app-ampliacion-servicios',
  templateUrl: './ampliacion-anexo.component.html',
  styleUrl: './ampliacion-anexo.component.scss',
})
export class AmpliacionAnexoComponent implements OnInit, OnDestroy {

  

  /**
   * Controla la visibilidad del modal de alerta.
   */
  mostrarAlerta: boolean = false;

  /**
   * Mensaje mostrado en el modal de alerta.
   */
  mensajeDeAlerta: string = 'Debe seleccionar una fracción de exportación';
  
    /**
     * Estado actual del trámite.
     */
    tramiteState: AmpliacionServiciosState = {} as AmpliacionServiciosState;
  

  /**
   * Formulario reactivo para la información de registro.
   */
  formularioInfoRegistro!: FormGroup;

  /**
   * Tipo de selección de tabla (radio button).
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.RADIO;

  /**
   * Fracción arancelaria.
   */
  fraccion: string = '';

  /**
   * Cantidad de bienes.
   */
  cantidad: string = '';

  /**
   * Fracción arancelaria para servicios IMMEX.
   */
  fraccionArancelaria: string = '';

  /**
   * Datos relacionados con la importación.
   */
  importacion: string = '';

  /**
   * Valor de los bienes.
   */
  valor: string = '';

  /**
   * Configuración de la tabla para servicios IMMEX.
   */
  configuracionTablaServicio: ConfiguracionColumna<Arancelaria>[] = CONFIGURACION_ARANCELARIAS;

  /**
   * Configuración de la tabla para importaciones.
   */
  configuracionTablaImportacion: ConfiguracionColumna<ArancelariaImportacion>[] = CONFIGURACION_ARANCELARIASIMPORTACION;

  /**
   * Lista de datos de servicios IMMEX.
   */
  datos: Arancelaria[] = [];

  /**
   * Datos de servicios IMMEX para el grid.
   */
  datosImmex: Arancelaria[] = [];

  /**
   * Datos de importación para el grid.
   */
  datosImportacion: ArancelariaImportacion[] = [];

  /**
   * Lista de domicilios seleccionados.
   */
  domiciliosSeleccionados: Arancelaria[] = [];

  /**
   * Lista de empresas seleccionadas.
   * empresasSeleccionados
   */
  
  /**
   * Formulario reactivo para datos adicionales.
   */
  forma!: FormGroup;

  /**
   * Lista de aduanas de ingreso.
   */
  aduanaDeIngreso!: Catalogo[];

  /**
   * Datos de entidades autorizadas.
   */
  autorizadosBodyData: [] = [];

  /**
   * Información sobre el registro actual.
   */
  infoRegistro!: Servicios;

  /**
   * Textos constantes para el componente.
   */
  TEXTOS = TEXTOS_80206;

  /**
   * Notificador para gestionar la destrucción o desuscripción de observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  @Input() esFormularioSoloLectura: boolean = false;

/**
 * Valor válido de fracción arancelaria para validaciones en el componente.
 * Utiliza la constante FRACCIONARANCELARIAVALIDO.
 */
  /**
   * Constructor del componente.
   */

  constructor(
    private fb: FormBuilder,
    private ampliacionServiciosService: AmpliacionServiciosService,
    private ampliacionServiciosQuery: AmpliacionServiciosQuery, 
    private tramite80206Store: Tramite80206Store,
    private readonly httpServicios: HttpClient
  ) {
   
    this.inicializarFormularioInfoRegistro();
  
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit():void {
   this.getDatos();
    this.suscribirseADatosImmex();
    this.suscribirseAFields();
  }
  /**
   * Activa el modal de alerta.
   */
  activarModal(): void {
    this.mostrarAlerta = true;
  }
  /**
   * Cierra el modal de alerta.
   */
  aceptar(): void {
    this.mostrarAlerta = false;
  }
  /**
   * Cambia el valor de un campo específico en el estado.
   */
  enCambioDeCampo(fieldName: string, newValue: string): void {
    switch (fieldName) {
      case 'fraccionArancelaria':
        this.tramite80206Store.setFraccionArancelaria(newValue);
        break;
      
      case 'fraccion':
        this.tramite80206Store.setRfcEmpresa(newValue);
        break;
      case 'cantidad':
        this.tramite80206Store.setCantidad(newValue);
        break;
      
      case 'valor':
        this.tramite80206Store.setValor(newValue);
        break;
      case 'importacion':
          this.tramite80206Store.setImportacion(newValue);
          break;
      default:
        break;
    }
  }

  

  /**
 * Se suscribe a los suscribirseAFields cambios en los campos del estado y actualiza las propiedades locales.
 */

  suscribirseAFields(): void {
   
    this.ampliacionServiciosQuery.selectSolicitudTramite$
         .pipe(
           takeUntil(this.destroyNotifier$),
           map((todosDatos: AmpliacionServiciosState) => {
             this.tramiteState = todosDatos;
             this.fraccion = todosDatos.fraccion;
             this.cantidad = todosDatos.cantidad;
             this.fraccionArancelaria = todosDatos.fraccionArancelaria;
             this.importacion = todosDatos.importacion;
             this.valor = todosDatos.valor;
             this.datos=this.tramiteState.datos;
          
           })
         )
         .subscribe();
  
  }
    
  
  /**
   * Obtiene los datos del servicio y actualiza el estado del formulario.
   */
  getDatos(): void {
    
    this.ampliacionServiciosService.getDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((respuesta) => {
       const RESPONSE = respuesta as unknown as ApiResponse;
      if (RESPONSE) {
        this.tramite80206Store.setInfoRegistro(RESPONSE.data.infoServicios);
        this.inicializarFormularioDesdeAlmacen();
      }
    })
  
  }
  /**
 * Se suscribe a los datos de IMMEX desde el store para mantener el componente actualizado.
 */
  suscribirseADatosImmex(): void {
    
    this.ampliacionServiciosQuery.selectSolicitudTramite$.pipe(takeUntil(this.destroyNotifier$)).subscribe((datos) => {
      this.datosImmex = datos.datosImmex;
      this.datosImportacion = datos.datosImportacion;
     
    });
  }
  
  /**
   * Inicializa el formulario a partir de los datos del store.
   */
  inicializarFormularioDesdeAlmacen(): void {
      this.formularioInfoRegistro = this.fb.group({
        seleccionaLaModalidad: [{ value: this.tramiteState.infoRegistro.seleccionaLaModalidad, disabled: true }],
        folio: [{ value: this.tramiteState.infoRegistro.folio, disabled: true }],
        ano: [{ value: this.tramiteState.infoRegistro.ano, disabled: true }],
      })
   
  }
  
  

  /**
   * Inicializa el formulario de información de registro.
   */
  
  inicializarFormularioInfoRegistro(): void {
    this.formularioInfoRegistro = this.fb.group({
      seleccionaLaModalidad: [{ value: '', disabled: true }],
      folio: [{ value: '', disabled: true }],
      ano: [{ value: '', disabled: true }],
    });
  }


  
  

  /**
   * Elimina servicios del grid.
   */
  eliminarServiciosGrid(): void {
    
    const INDICE = this.datosImmex.findIndex((item:Arancelaria) => item.fraccionArancelaria === this.domiciliosSeleccionados[0]?.['fraccionArancelaria']);
    if (INDICE !== -1) {
      const DATOS_IMMEX_ACTUALIZADOS = [...this.datosImmex];
      DATOS_IMMEX_ACTUALIZADOS.splice(INDICE, 1); 
      this.tramite80206Store.setDatosImmex(DATOS_IMMEX_ACTUALIZADOS); 
      this.domiciliosSeleccionados = [];
    }
  }

  get condicion(): boolean {
  if (!this.domiciliosSeleccionados?.length) {
    return false;
  }

  const SELECCIONADO = this.domiciliosSeleccionados[0]?.fraccionArancelaria;
  const INDICE = this.datosImmex.findIndex(
    (item: Arancelaria) => item.fraccionArancelaria === SELECCIONADO
  );

  return INDICE !== -1; 
}

/**
 * <span class="compodoc-span">Handles the delete attempt for selected export fractions.</span>
 * If no condition is met (i.e., no fractions are selected), sets an alert message and activates the modal dialog.
 *
 */
 onIntentarEliminar(): void {
  if (!this.condicion) {
    this.mensajeDeAlerta = 'Seleccione la(s) Fracción(es) de Exportación a eliminar.';
    this.activarModal();
  }
}


  /**
   * Elimina datos de importación seleccionados del grid.
   */
  eliminarImportacion(): void {
    if (this.domiciliosSeleccionados.length === 0) {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'Seleccione la(s) Fracción(es) de Importación a eliminar.';
    return;
  }
    const INDICE = this.datosImportacion.findIndex((item:ArancelariaImportacion) => item.fraccionArancelaria === this.domiciliosSeleccionados[0]?.['fraccionArancelaria']);
    if (INDICE !== -1) {
      const DATOS_IMPORTACION_ACTUALIZADOS = [...this.datosImportacion];
      DATOS_IMPORTACION_ACTUALIZADOS.splice(INDICE, 1); 
      this.tramite80206Store.setDatosImportacion(DATOS_IMPORTACION_ACTUALIZADOS); 
      this.domiciliosSeleccionados = [];
    }
  }
  /**
   * Actualiza el grid de empresas nacionales.
   */
 actualizaGridEmpresasNacionales(): void {
  if (!this.fraccionArancelaria || this.fraccionArancelaria.trim() === '') {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'Tiene que introducir la Fracción arancelaria';
    return;
  }
    this.obtenerInformacionFraccion();

}

/**
 * Obtiene la información de una fracción arancelaria ingresada por el usuario.
 * Realiza validaciones sobre el valor ingresado, verifica si la fracción ya existe en la lista,
 * y consulta la información correspondiente a través de un servicio externo.
 * Si la fracción es válida y no existe previamente, agrega los datos obtenidos a la lista de fracciones.
 * Muestra mensajes de alerta en caso de errores de validación, duplicidad o problemas en la consulta.
 * Este método es utilizado para gestionar la adición de fracciones arancelarias en el trámite 80206,
 * asegurando que la información ingresada sea válida y actualizada.
 */
obtenerInformacionFraccion(): void {
  const FRACCION_VALUE = this.fraccionArancelaria;
  
  if (!FRACCION_VALUE || FRACCION_VALUE.trim() === '') {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'Debe introducir una fracción arancelaria válida.';
    return;
  }

 if (!AmpliacionAnexoComponent.validarFormatoFraccion(FRACCION_VALUE)) {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'La fracción arancelaria no es válida o no esta vigente.';
    return;
  }

  const EXISTS = this.datosImmex.some(item => item.fraccionArancelaria === FRACCION_VALUE);
  if (EXISTS) {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'La fracción arancelaria que desea agregar a la lista ya existe.';
    return;
  }

  const PAYLOAD = {
    "fraccion": FRACCION_VALUE,
    "tipoSolicitud": 471
  };

  this.ampliacionServiciosService
    .obtenerInformacionFraccion(PAYLOAD)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        if (esValidObject(response)) {
          const API_DATOS = doDeepCopy(response);
          
          if (API_DATOS.codigo !== "00") {
            this.mostrarAlerta = true;
            this.mensajeDeAlerta = API_DATOS.error || API_DATOS.mensaje || 'La fracción arancelaria solicitada no existe.';
            return;
          }

          if (esValidObject(API_DATOS.datos)) {
            try {
              const CURRENT_COUNT = this.datosImmex.length;
              const RESPONSE: Arancelaria[] = this.ampliacionServiciosService
                .mapApiResponseToFraccionArancelaria([API_DATOS.datos], CURRENT_COUNT);
              
              this.tramite80206Store.setDatosImmex([...this.datosImmex, ...RESPONSE]);
              
              this.fraccionArancelaria = '';
              
            } catch (mappingError) {
              console.error('Error al mapear respuesta:', mappingError);
              this.mostrarAlerta = true;
              this.mensajeDeAlerta = 'Error al procesar la información de la fracción arancelaria.';
            }
          } else {
            this.mostrarAlerta = true;
            this.mensajeDeAlerta = 'No se encontraron datos para la fracción arancelaria especificada.';
          }
        }
      },
      error: (error) => {
        console.error('Error al obtener información de fracción:', error);
        this.mostrarAlerta = true;
        this.mensajeDeAlerta = 'Error al conectar con el servidor. Intente nuevamente.';
      }
    });
}

/**
 * Obtiene la información de una fracción arancelaria de importación ingresada por el usuario.
 * Realiza las siguientes validaciones:
 * Si las validaciones son exitosas, realiza una petición al servicio para obtener los datos de la fracción arancelaria.
 * Si la respuesta es válida, mapea y agrega la fracción a la lista de importaciones.
 * En caso de error o datos inválidos, muestra una alerta con el mensaje correspondiente.
 *
 */
obtenerInformacionFraccionImportacion(): void {
  const FRACCION_IMPORTACION_VALUE = this.importacion;

  if (!FRACCION_IMPORTACION_VALUE || FRACCION_IMPORTACION_VALUE.trim() === '') {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'Debe introducir una fracción arancelaria válida.';
    return;
  }

 if (!AmpliacionAnexoComponent.validarFormatoFraccion(FRACCION_IMPORTACION_VALUE)) {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'La fracción arancelaria no es válida o no esta vigente.';
    return;
  }

  const EXISTS = this.datosImmex.some(item => item.fraccionArancelaria === FRACCION_IMPORTACION_VALUE);
  if (EXISTS) {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'La fracción arancelaria que desea agregar a la lista ya existe.';
    return;
  }

  const PAYLOAD = {
    "fraccion": FRACCION_IMPORTACION_VALUE,
    "fraccionPadre": this.fraccionArancelaria,
    "tipoSolicitud": "14",
    "idPrograma": "121517",
    "idSolicitud": "202785257",
    "idProductoPadre": ""
  };

  this.ampliacionServiciosService
    .obtenerFraccionImportacion(PAYLOAD)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        if (esValidObject(response)) {
          const API_DATOS = doDeepCopy(response);
          
          if (API_DATOS.codigo !== "00") {
            this.mostrarAlerta = true;
            this.mensajeDeAlerta = API_DATOS.error || API_DATOS.mensaje || 'La fracción arancelaria solicitada no existe.';
            return;
          }

          if (esValidObject(API_DATOS.datos)) {
            try {
              const CURRENT_COUNT = this.datosImportacion.length;
              const RESPONSE: ArancelariaImportacion[] = this.ampliacionServiciosService
                .mapApiResponseToFraccionArancelariaImportacion([API_DATOS.datos], CURRENT_COUNT);

              this.tramite80206Store.setDatosImportacion([...this.datosImportacion, ...RESPONSE]);

              this.fraccionArancelaria = '';
              
            } catch (mappingError) {
              console.error('Error al mapear respuesta:', mappingError);
              this.mostrarAlerta = true;
              this.mensajeDeAlerta = 'Error al procesar la información de la fracción arancelaria.';
            }
          } else {
            this.mostrarAlerta = true;
            this.mensajeDeAlerta = 'No se encontraron datos para la fracción arancelaria especificada.';
          }
        }
      },
      error: (error) => {
        console.error('Error al obtener información de fracción:', error);
        this.mostrarAlerta = true;
        this.mensajeDeAlerta = 'Error al conectar con el servidor. Intente nuevamente.';
      }
    });
}
  /**
   * Cierra el modal de alerta.
   */
  cerrarModal():void{
    this.mostrarAlerta = false;

  }
   /**
   * Agrega datos de importación al grid.
   */
 agregarImportacion(): void {
  if (!this.importacion || this.importacion.trim() === '') {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'Tiene que introducir la Fracción arancelaria';
    return;
  }

  if (this.domiciliosSeleccionados.length === 0) {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'Debe seleccionar una fracción de exportación';
    return; 
  }

  if (!AmpliacionAnexoComponent.validarFormatoFraccion(this.importacion)) {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'La fracción arancelaria no es válida o no esta vigente.';
    return;
  }

  const EXISTS = this.datosImportacion.some(item => item.fraccion === this.importacion);
  if (EXISTS) {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'La fracción arancelaria que desea agregar a la lista ya existe.';
    return;
  }

  this.obtenerInformacionFraccionImportacion();
}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

 /**
   * Maneja los datos recibidos del componente hijo.
   */
  procesarDatosDelHijo(data: Catalogo): void { 
    
    this.tramite80206Store.setAduanaDeIngresoSeleccion(data?.id.toString() || '');
  }
  

  /**
   * Actualiza la lista de domicilios seleccionados.
   */
  seleccionarDomicilios(domicilios: Arancelaria): void {
    this.domiciliosSeleccionados = [domicilios];
  }
/**
 * Validates the format of the fraccion arancelaria
 */
  static validarFormatoFraccion(fraccion: string): boolean {
    const FRACCION_PATTERN = /^\d{8}$/;
    return FRACCION_PATTERN.test(fraccion);
  }
   /**
   * Valida todos los controles del formulario.
   *
   * Marca todos los controles como tocados y actualiza su estado de validación
   * para mostrar los errores correspondientes en la interfaz de usuario.
   * También valida los formularios de los componentes hijo.
   *
   */
  validarFormulario(): boolean {
     let isValid = true;

  // if (this.formularioInfoRegistro) {
  //   this.formularioInfoRegistro.markAllAsTouched();
  //   this.formularioInfoRegistro.updateValueAndValidity();

  //   if (this.formularioInfoRegistro.invalid) {
  //     isValid = false;
  //   }
  // } else {
  //   isValid = false;
  // }

 const HAS_IMMEX_DATA = this.datosImmex && this.datosImmex.length > 0;
  const HAS_IMPORTACION_DATA = this.datosImportacion && this.datosImportacion.length > 0;
  
  if (!HAS_IMMEX_DATA || !HAS_IMPORTACION_DATA) {
    isValid = false;
  }
 
  return isValid;
}
  
}