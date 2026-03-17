import { Catalogo, CatalogoSelectComponent, ConsultaioState, Notificacion, SolicitanteService, TituloComponent, NotificacionesComponent, CategoriaMensaje, REGEX_RFC, TablaDinamicaComponent, TablaSeleccion, ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DatosGeneralesModel } from '@libs/shared/data-access-user/src/core/models/datos-generales.model';
import { tap } from 'rxjs';
import { RfcConsulta } from '../../shared/models/rfc-consulta.model';


@Component({
  selector: 'datos-manifestacion',
  standalone: true,
  imports: [
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    CommonModule,
    TooltipModule,
    NotificacionesComponent,
    TablaDinamicaComponent
],
  templateUrl: './datos-manifestacion.component.html',
  styleUrl: './datos-manifestacion.component.css',
})
export class DatosManifestacionComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo para capturar los datos que regresa la busqueda.
   * Incluye validaciones para campos obligatorios y opcionales.
   * @type {FormGroup}
   */
  formularioDatosManifestacion!: FormGroup;

    /**
   * Grupo de formularios para los detalles adicionales de la mercancía.
   * @type {FormGroup}
   * @memberof MercanciaSolicitudComponent
   */
  formularioRfcConsulta!: FormGroup;

    /**
   * Bandera que indica si se debe mostrar la confirmación para eliminar datos de la tabla.
   * @type {boolean}
   * @memberof MercanciaSolicitudComponent
   */
  eliminarDatosTabla: boolean = false;

  /**
  * catalogo de tipo de figura para los rfc.
  */
  tipoFiguraList: Catalogo[] = [
    { id: 1, clave: 'A1', descripcion: 'Registro activo' },
    { id: 2, clave: 'B2', descripcion: 'Registro inactivo' },
    { id: 3, clave: 'C3', descripcion: 'Pendiente de validación' }

  ];

    /**
   * Formulario reactivo para capturar los datos para la busqueda.
   * Incluye validaciones para campos obligatorios y opcionales.
   * @type {FormGroup}
   */
  formularioBusquedaRfcImportador!: FormGroup;
  
/** para obtener los datos del RFC ingresado  */
    datosGenerales?: DatosGeneralesModel;

  /**
   * Nueva notificación para mostrar mensajes de error o información al usuario.
   */
  nuevaNotificacion: Notificacion | null = null;

    /**
   * Tipo de selección para la tabla principal.
   * @type {TablaSeleccion}
   */
  tipoSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

    /**
   * Configuración de columnas para la tabla de detalles.
   * @type {ConfiguracionColumna<RfcConsulta>[]}
   */
  configuracionColumnas: ConfiguracionColumna<RfcConsulta>[] = [
    { encabezado: 'RFC de consulta', clave: (fila) => fila.rfc, orden: 1 },
    { encabezado: 'Nombre o Razón Social', clave: (fila) => fila.nombreRazonSocial, orden: 2 },
    { encabezado: 'Tipo Figura', clave: (fila) => fila.tipoFiguraDescripcion, orden: 3 },
  ];

    /**
   * Datos del cuerpo de la tabla de detalles.
   * @type {RfcConsulta[]}
   */
  cuerpoTablaRfcConsulta: RfcConsulta[] = [];

      /**
   * Datos del cuerpo de la tabla de detalles.
   * @type {RfcConsulta[]}
   */
  rfcConsultaSeleccionados: RfcConsulta[] = [];

     /**
   * Constructor del componente datos-manifestacion.
   * Inicializa los servicios necesarios y establece la suscripción al estado del formulario.
   *
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos de Angular
   * @param {ImportacionDeAcuiculturaService} importacionDeAcuiculturaServices - Servicio para obtener datos de catálogos y actualizar el store
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de solo lectura del formulario
   * @param catalogosService
   * @param consultaSolicitudService
   */
  constructor(
    private solicitanteServicio: SolicitanteService,
    private readonly fb: FormBuilder,
  ) {
    this.formularioDatosManifestacion = this.fb.group({
      rfc: [ {value: '', disabled: true}, Validators.required],      
      nombreRazonSocial: [ {value: '', disabled: true}, Validators.required]
    }); 

    this.formularioBusquedaRfcImportador = this.fb.group({
      rfcBusqueda: [ '', [Validators.required, Validators.maxLength(13), Validators.pattern(REGEX_RFC)]],      
    });

    this.formularioRfcConsulta = this.fb.group({
      rfc: ['', [Validators.required, Validators.maxLength(13), Validators.pattern(REGEX_RFC)]],
      tipoFigura: ['', Validators.required]     
    }); 
  }
  

ngOnInit(): void {
  const rfcControl = this.formularioBusquedaRfcImportador.get('rfcBusqueda');

  rfcControl?.valueChanges.subscribe(value => {
    if (value) {
      rfcControl.setValue(value.toUpperCase(), { emitEvent: false });
    }
  });
}

  /**
   * Establece los valores del formulario en el servicio de almacenamiento correspondiente.
   * Actualiza el estado global con los datos actuales del formulario de movilización.
   * 
   * @public
   * @method setValoresStore
   * @memberof DatosParaMovilizacionComponent
   * @returns {void}
   */
  setValoresStore(): void {
    // const VALOR = this.formularioMovilizacion.value;
    // (this.importacionDeAcuiculturaServices.actualizarFormularioMovilizacion as (value: FormularioMovilizacion) => void)(
    //   VALOR
    // );
  }

    /**
   * Busca en el servicio el rfc ingresado
   * 
   * @public
   * @returns {void}
   */
  buscarRFC(): void {
    this.formularioBusquedaRfcImportador.updateValueAndValidity();
    this.formularioBusquedaRfcImportador.markAllAsTouched();

    if (this.formularioBusquedaRfcImportador.valid) {
      this.getDatosGenerales(this.formularioBusquedaRfcImportador.get('rfcBusqueda')?.value)
    }
    else {
      this.creaNotificacion('El RFC no cumple con el formato de persona física o moral.', CategoriaMensaje.ERROR);
      this.formularioDatosManifestacion.reset();
    }
  }

  /**
   * Obtiene los datos generales del solicitante con una peticion get.
   * @returns void
   */
  getDatosGenerales(RFC: string): void {
    
// primero validar que el rfc ingresado sea el mismo de la sesion si no no hacer nada

      this.solicitanteServicio
        .getDatosGeneralesAPI(RFC)
        .pipe(
          tap((response) => {
            if (response) {
              this.datosGenerales = response;   
              if(this.datosGenerales?.datos?.rfc_original)
              {
                if(this.datosGenerales?.datos?.identificacion?.tipo_persona === 'F'){
                this.datosGenerales.datos.identificacion.razon_social = this.datosGenerales?.datos?.identificacion?.nombre 
                + ' ' + this.datosGenerales?.datos?.identificacion?.ap_paterno 
                + ' ' + this.datosGenerales?.datos?.identificacion?.ap_materno;
                }
                this.formularioDatosManifestacion.patchValue({
                  rfc: this.datosGenerales?.datos?.rfc_original,
                  nombreRazonSocial: this.datosGenerales.datos.identificacion.razon_social
                });
              }   
              else {
                this.datosGenerales = undefined;
                this.creaNotificacion('No se encontraron datos para el RFC proporcionado.', CategoriaMensaje.ERROR);
              }    
            }
          })
        )
        .subscribe();
    
  }

    /**
   * Obtiene los datos generales del solicitante con una peticion get.
   * @returns void
   */
  creaNotificacion(mensaje: string, categoria : CategoriaMensaje): void {
    
      this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: categoria,
            modo: 'action',
            titulo: '',
            mensaje: mensaje,
            cerrar: false,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
      }
    
  }

    /**
   * Maneja la selección de elementos en la tabla de detalles.
   * Almacena el primer elemento seleccionado para operaciones posteriores.
   * 
   * @public
   * @method seleccionTabla
   * @param {RfcConsulta[]} event - Array de detalles seleccionados de la tabla
   * @returns {void}
   */
  seleccionTabla(event: RfcConsulta[]): void {
    this.rfcConsultaSeleccionados = event || {} as RfcConsulta;
  }

    /**
   * Agrega una nueva fila de detalle a la tabla de detalles.
   * Toma los valores del formulario de detalles y los añade a la tabla local.
   * 
   * @public
   * @method agregarFilaDetalle
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  agregarFilaRfcConsulta(): void {

   this.formularioRfcConsulta.updateValueAndValidity();
    this.formularioRfcConsulta.markAllAsTouched();

    if (this.formularioRfcConsulta.valid) {
      this.getDatosRfcConsulta(this.formularioRfcConsulta.get('rfc')?.value)
    }
    else {

      if (this.formularioRfcConsulta.get('tipoFigura')?.value == null || this.formularioRfcConsulta.get('tipoFigura')?.value == '') {
        this.creaNotificacion('Debes seleccionar el tipo de figura.', CategoriaMensaje.ERROR);
        return;
      }
      this.creaNotificacion('El RFC no cumple con el formato de persona física o moral.', CategoriaMensaje.ERROR);

      // this.formularioRfcConsulta.reset();
    }    
  }

    /**
   * Inicia el proceso de eliminación de una fila de detalle.
   * Muestra una notificación de confirmación antes de proceder con la eliminación.
   * 
   * @public
   * @method eliminarFilaDetalle
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  eliminarFilaDetalle(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Eliminar datos de la tabla',
      mensaje: '¿Está seguro que desea eliminar estos datos?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };

    this.eliminarDatosTabla = true;
  }

    /**
   * Ejecuta la eliminación de datos de la tabla basado en la confirmación del usuario.
   * Si el usuario confirma, elimina el elemento seleccionado de la tabla de detalles.
   * 
   * @public
   * @method eliminarPedimentoDatos
   * @param {boolean} borrar - Indica si se debe proceder con la eliminación
   * @memberof MercanciaSolicitudComponent
   * @returns {void}
   */
  eliminarRfcConsulta(borrar: boolean): void {
    if (borrar && this.eliminarDatosTabla) {
      this.eliminarDatosTabla = false;
      this.cuerpoTablaRfcConsulta = this.cuerpoTablaRfcConsulta.filter(
        item => !this.rfcConsultaSeleccionados.includes(item)
      );
    } else {
      this.eliminarDatosTabla = false;
    }
  }

  /**
   * Obtiene los datos para llenar la tabla de rfc consulta.
   * @returns void
   */
  getDatosRfcConsulta(RFC: string): void {
    
      this.solicitanteServicio
        .getDatosGeneralesAPI(RFC)
        .pipe(
          tap((response) => {
            if (response) {
              this.datosGenerales = response;   
              if(this.datosGenerales?.datos?.rfc_original)
              {
                if(this.datosGenerales?.datos?.identificacion?.tipo_persona === 'F'){
                this.datosGenerales.datos.identificacion.razon_social = this.datosGenerales?.datos?.identificacion?.nombre 
                + ' ' + this.datosGenerales?.datos?.identificacion?.ap_paterno 
                + ' ' + this.datosGenerales?.datos?.identificacion?.ap_materno;
                }
                const seleccionado = this.tipoFiguraList.find(
                  item => item.id === Number(this.formularioRfcConsulta.get('tipoFigura')?.value)
                );

                const descripcion = seleccionado?.descripcion ?? '';
                var nuevoDetalle = this.formularioRfcConsulta.getRawValue() as RfcConsulta;
                nuevoDetalle.nombreRazonSocial = this.datosGenerales.datos.identificacion.razon_social;
                nuevoDetalle.tipoFigura = this.formularioRfcConsulta.get('tipoFigura')?.value;
                nuevoDetalle.tipoFiguraDescripcion = descripcion;
                if (nuevoDetalle.rfc || nuevoDetalle.rfc  .trim() != '') {
                this.cuerpoTablaRfcConsulta = [...this.cuerpoTablaRfcConsulta, nuevoDetalle];
                this.formularioRfcConsulta.reset();
                }
              }   
              else {
                this.datosGenerales = undefined;
                this.creaNotificacion('No se encontraron datos para el RFC proporcionado.', CategoriaMensaje.ERROR);
              }    
            }
          })
        )
        .subscribe();
    
  }

  ngOnDestroy(): void {
    // Lógica de limpieza del componente}
}
}
