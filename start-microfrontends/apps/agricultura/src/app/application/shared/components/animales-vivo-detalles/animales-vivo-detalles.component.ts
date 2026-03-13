import { AnimalesEventos, DatosDeLaSolicitud, Sensible } from '../../models/datos-de-la-solicitue.model';
import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FilaSolicitud, FraccionArancelariaDecripcionModel } from '../../../tramites/220201/models/220201/capturar-solicitud.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CONFIGURACION_SENSIBLES } from '../../constantes/datos-de-la-solicitue.enum';
import { CargaDetalleMercanciaComponent } from '../carga-masiva-detalle-mercancia/carga-detalle-mercancia.component';
import { CommonModule } from '@angular/common';
import { RegistroSolicitudService } from '../../../tramites/220201/services/220201/registro-solicitud/registro-solicitud.service';
import { Subject } from 'rxjs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-animales-vivo-detalles',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, TituloComponent, ReactiveFormsModule, TablaDinamicaComponent, NotificacionesComponent, CargaDetalleMercanciaComponent, TooltipModule],
  templateUrl: './animales-vivo-detalles.component.html',
  styleUrl: './animales-vivo-detalles.component.scss',

})
export class AnimalesVivoDetallesComponent implements OnInit, OnDestroy {


  /**
   * Representa el formulario reactivo utilizado para gestionar los datos de la mercancía
   * en el componente de detalles de animales vivos.
   * 
   * @type {FormGroup}
   */
  mercanciaForm!: FormGroup;

  /**
   * Representa el formulario reactivo utilizado para gestionar los detalles específicos
   * de los animales vivos, como número de lote, color de pelaje, edad, etc.
   * 
   * @type {FormGroup}
   */
  detalleForm!: FormGroup;

  /**
   * Datos de la solicitud que se recibirán como entrada en el componente.
   * 
   * @type {DatosDeLaSolicitud}
   */
  @Input() catalogosDatos!: DatosDeLaSolicitud;

  /**
   * Lista de datos sensibles que se mostrarán en la tabla de detalles de animales vivos.
   * 
   * @type {Sensible[]}
   */
  @Input() sensiblesTablaDatos: Sensible[] = [];

  /**
   * Datos del formulario de solicitud de animales vivos.
   * Este objeto contiene la información relacionada con la solicitud de animales vivos,
   * como los detalles de la mercancía y los datos específicos de los animales.
   * 
   * @type {AnimalesFormularioSolicitud}
   */
  @Input() formularioSolicitud!: FilaSolicitud;

  /**
   * Evento que se emite cuando se agregan datos al formulario de solicitud de animales vivos.
   * Este evento permite al componente padre recibir los datos del formulario para su procesamiento.
   * 
   * @type {EventEmitter<AnimalesEventos>}
   */
  @Output() agregarDatosFormulario = new EventEmitter<AnimalesEventos>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es true, los campos del formulario no serán editables por el usuario.
   * 
   * @type {boolean}
   */
  esSoloLectura: boolean = true;

  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   * 
   * @type {Subject<void>}
   * @private
   */
  private destroy$ = new Subject<void>();

  /**
   * Configuración de las columnas de la tabla que muestra los datos sensibles.
   * Utiliza una constante predefinida para definir la estructura de la tabla.
   * 
   * @type {ConfiguracionColumna<Sensible>[]}
   */
  public configuracionSensiblesTabla: ConfiguracionColumna<Sensible>[] = CONFIGURACION_SENSIBLES;

  /**
   * Define el tipo de selección de la tabla, en este caso, se utiliza un checkbox para seleccionar filas.
   * 
   * @type {TablaSeleccion}
   */
  public tablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Almacena los datos sensibles seleccionados en la tabla.
   * Esta propiedad se utiliza para realizar operaciones como eliminar o procesar los datos seleccionados.
   * 
   * @type {Sensible[]}
   */
  public sensiblesTablaSeleccionada: Sensible[] = [];
  /**
   * Evento que se emite para cerrar el componente de detalles de animales vivos.
   * Permite al componente padre manejar la acción de cierre del modal o sección.
   * 
   * @type {EventEmitter<void>}
   */
  @Output() cerrar = new EventEmitter<void>();
  /**
   * @ignore
   * @description
   * Evento emitido por el componente AnimalesVivoDetallesComponent.
   * 
   * Este EventEmitter se utiliza para notificar a los componentes padres cuando ocurre una acción relevante
   * dentro del componente de detalles de animales vivos.
   * 
   * @event
   */
  @Output() animalesVivoDetallesComponent = new EventEmitter<void>();

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion | null;

  /**
   * Obtiene el grupo de formulario 'datosServicio' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'datosServicio'.
   */
  get datosServicio(): FormGroup {
    return this.detalleForm?.get('detalleForm') as FormGroup;
  }

  /**
   * Guarda el tipo de proceso que se eligió y de acuerdo a lo elegido se tomá decision en el modal.
   */
  public procesoModal!: string;

  /**
   * Almacena los datos relacionados con el archivo.
   * 
   * El tipo es desconocido (`unknown`) hasta que se asigne un valor específico.
   * Puede contener información relevante sobre un archivo cargado o procesado en el componente.
   */
  datosArchivo: unknown = null;

  /**
   * Bandera que indica si la ventana ha terminado de cargarse.
   * Se utiliza para controlar la visualización o inicialización de componentes dependientes de la carga.
   */
  banderaCargaVentana: boolean = false;

  /**
   * El número total de registros que se mostrarán o procesarán.
   * 
   * Esta propiedad de entrada permite que el componente padre especifique cuántos registros
   * son relevantes para el contexto actual. Por defecto es 0 si no se proporciona.
   */
  @Input() cantidadRegistros: number = 0;

  /**
   * Constructor del componente.
   * 
   * @param fb FormBuilder para crear formularios reactivos.
   */
  constructor(
    private fb: FormBuilder,
    private registroSolicitudService: RegistroSolicitudService
  ) {
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se crea el formulario reactivo y se configuran los campos necesarios.
   */
  ngOnInit(): void {
    this.crearFormulario();
  }


  /**
   * Crea e inicializa los formularios reactivos `mercanciaForm` y `detalleForm` 
   * utilizando FormBuilder. Cada formulario contiene los campos necesarios para 
   * capturar la información relacionada con los detalles de animales vivos y 
   * mercancía, aplicando las validaciones requeridas en cada campo según corresponda.
   *
   * - `mercanciaForm`: Incluye campos como tipo de requisito, requisito, número de certificado,
   *   fracción arancelaria, descripción, cantidad, unidad de medida, especie, uso, país de origen y procedencia, entre otros.
   * - `detalleForm`: Incluye campos para detalles específicos del animal como número de lote, color de pelaje,
   *   edad, fase de desarrollo, función zootécnica, nombre de la mercancía, número de identificación, raza,
   *   nombre científico y sexo (este último es obligatorio).
   *
   * @returns {void} No retorna ningún valor. Inicializa los formularios como propiedades del componente.
   */
  crearFormulario(): void {
    this.mercanciaForm = this.fb.group({
      id: [0, Validators.required],
      noPartida: ['0'],
      tipoRequisito: ['', Validators.required],
      descripcionTipoRequisito: [''],
      requisito: ['', Validators.required],
      numeroCertificadoInternacional: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      fraccionArancelaria: ['', Validators.required],
      clave_fraccion: [''],
      descripcionFraccion: ['', [Validators.required]],
      nico: ['', Validators.required],
      descripcionNico: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000), Validators.pattern(/^[a-zA-Z0-9 ]*$/)]],
      cantidadUMT: ['', [Validators.required, Validators.max(999999999999.999), Validators.pattern(/^\d{1,12}(\.\d{1,3})?$/)]],
      umt: ['', Validators.required],
      clave_umt: [''],
      descripcionUMT: [''],
      cantidadUMC: ['', [Validators.required, Validators.pattern(/^\d{1,12}(\.\d{1,3})?$/)]],
      umc: ['', Validators.required],
      descripcionUMC: [''],
      especie: ['', Validators.required],
      descripcionEspecie: [''],
      uso: ['', Validators.required],
      descripcionUso: [''],
      paisDeOrigen: ['', Validators.required],
      descripcionPaisDeOrigen: [''],
      paisDeProcedencia: ['', Validators.required],
      descripcionPaisDeProcedencia: [''],
      sensibles: this.fb.array([]),
      modificado: [false], 
    });

    this.detalleForm = this.fb.group({
      numeroLote: ['', [Validators.maxLength(16), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      colorPelaje: [''],
      edadAnimal: [''],
      faseDesarrollo: [''],
      funcionZootecnica: [''],
      nombreMercancia: [''],
      numeroIdentificacion: [''],
      raza: [''],
      nombreCientifico: [''],
      sexo: [''],
    });

    if (this.formularioSolicitud) {

      this.mercanciaForm.patchValue({
        ...this.formularioSolicitud
      });
      this.sensiblesTablaDatos = [...(this.formularioSolicitud.sensibles || [])];
    }
  }


  /**
   * Agrega un nuevo detalle a la lista `sensiblesTablaDatos` utilizando los valores actuales del formulario `detalleForm`.
   * Cada campo del formulario se asigna a la propiedad correspondiente del nuevo objeto.
   * Después de agregar el detalle, el formulario se reinicia para permitir la entrada de nuevos datos.
   *
   * @returns {void} No retorna ningún valor.
   */
  agregarDetalle(): void {

      const V = this.detalleForm.value;

        const TIENEALGVALOR =Boolean(V.numeroLote) ||
                      Boolean(V.colorPelaje) ||
                      Boolean(V.edadAnimal) ||
                      Boolean(V.faseDesarrollo) ||
                      Boolean(V.funcionZootecnica) ||
                      Boolean(V.nombreMercancia) ||
                      Boolean(V.numeroIdentificacion) ||
                      Boolean(V.raza) ||
                      Boolean(V.nombreCientifico) ||
                      Boolean(V.sexo);

          if (!TIENEALGVALOR) {
            // NO guardar si todo está vacío
            this.nuevaNotificacion = {
                  tipoNotificacion: 'alert',
                  categoria: 'danger',
                  modo: 'action',
                  titulo: '',
                  mensaje: 'Debe capturar al menos un campo.',
                  cerrar: false,
                  txtBtnAceptar: 'Aceptar',
                  txtBtnCancelar: '',
                };
            this.detalleForm.reset();
            return;
          }


    const SEXO_CATALOGO = this.catalogosDatos.sexoList.find(
      (item: Catalogo) => item.clave === this.detalleForm.value.sexo
    );
    const DETALLE = { 
          noPartida: String(this.sensiblesTablaDatos.length + 1), 
          NumeroLote: this.detalleForm.value.numeroLote, 
          ColorPelaje: this.detalleForm.value.colorPelaje, 
          EdadAnimal: this.detalleForm.value.edadAnimal, 
          FaseDesarrollo: this.detalleForm.value.faseDesarrollo, 
          FuncionZootecnica: this.detalleForm.value.funcionZootecnica, 
          NombreMercancia: this.detalleForm.value.nombreMercancia, 
          NumeroIdentificacion: this.detalleForm.value.numeroIdentificacion, 
          Raza: this.detalleForm.value.raza, 
          NombreCientifico: this.detalleForm.value.nombreCientifico, 
          Sexo: SEXO_CATALOGO ? SEXO_CATALOGO.descripcion : '', 
          SexoClave: this.detalleForm.value.sexo, 
          Especie: this.detalleForm.value.especie, 
          Uso: this.detalleForm.value.uso, 
          PaisDeOrigen: this.detalleForm.value.paisDeOrigen, 
          PaisDeProcedencia: this.detalleForm.value.paisDeProcedencia, 
          umt: this.detalleForm.value.umt, 
          umc: this.detalleForm.value.umc, }; 

        this.sensiblesTablaDatos = [...this.sensiblesTablaDatos, DETALLE];
        this.detalleForm.reset();
  }

  /**
   * Elimina los elementos seleccionados de la tabla de datos sensibles.
   * 
   * Esta función filtra los elementos de `sensiblesTablaDatos` eliminando aquellos que están presentes
   * en `sensiblesTablaSeleccionada`. Después de la eliminación, limpia la selección estableciendo 
   * `sensiblesTablaSeleccionada` como un arreglo vacío.
   *
   * @returns {void} No retorna ningún valor.
   */
  eliminarDetalle(): void {

      if (this.sensiblesTablaSeleccionada.length === 0) {
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: 'Debe seleccionar al menos un registro para eliminar.',
          cerrar: false,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        return;
      }

    this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
        cerrar: false,
        tamanioModal: 'md',
        txtBtnCancelar: 'Cancelar',
        txtBtnAceptar: 'Aceptar',
      };
      this.procesoModal = 'eliminar_solicitud';
  }

  /**
   * Limpia los datos relacionados con los animales vivos.
   * 
   * Este método vacía el arreglo `sensiblesTablaDatos` y reinicia el formulario `mercanciaForm`,
   * dejando ambos en su estado inicial. Útil para restablecer el formulario y los datos de la tabla
   * cuando se requiere comenzar una nueva operación o descartar los cambios actuales.
   */
  limpiarAnimalesVivo(): void {
    this.sensiblesTablaDatos = [];
    this.mercanciaForm.reset();
    this.mercanciaForm.get('modificado')?.setValue(false);
  }

  /**
 * Navega a la ubicación anterior en el historial de navegación.
 * Utiliza el servicio de ubicación para retroceder una página.
 */
  cancelar(): void {
    this.cerrar.emit();
  }

  /**
   * Método para agregar animales a la lista de datos sensibles.
   * Actualmente no implementa ninguna funcionalidad, pero se puede extender en el futuro.
   */
  // eslint-disable-next-line complexity
  agregarAnimales(): void {
    if (this.mercanciaForm.invalid) {
      this.mercanciaForm.markAllAsTouched();
    }
    else {      
      const FUEMODIFICADO = this.mercanciaForm.get('modificado')?.value as boolean;
      const SENSIBLES_FORM_ARRAY = this.mercanciaForm.get('sensibles') as FormArray;
      // Formatea cantidadUMC a dos decimales si es un número válido
      let cantidadUMCValue = this.mercanciaForm.get('cantidadUMC')?.value || '';
      if (cantidadUMCValue !== '' && !isNaN(Number(cantidadUMCValue))) {
        cantidadUMCValue = Number(cantidadUMCValue).toFixed(2);
      }

      this.mercanciaForm.patchValue({
        noPartida: FUEMODIFICADO ? this.mercanciaForm.get('noPartida')?.value : this.cantidadRegistros + 1,
        id: FUEMODIFICADO ? (parseInt(this.mercanciaForm.get('id')?.value || '0', 10) + 1) : parseInt(this.mercanciaForm.get('id')?.value || '0', 10),
        modificado: false,
        descripcionTipoRequisito: this.catalogosDatos.tipoRequisitoList.find(item => item.clave === this.mercanciaForm.get('tipoRequisito')?.value)?.descripcion || '',        
        descripcionEspecie: this.catalogosDatos.especieList.find(item => item.clave === this.mercanciaForm.get('especie')?.value)?.descripcion || '',
        descripcionUMT: this.mercanciaForm.get('umt')?.value || '',
        cantidadUMC: cantidadUMCValue,
        descripcionUMC: this.catalogosDatos.umcList.find(item => item.clave === this.mercanciaForm.get('umc')?.value)?.descripcion || '',
        descripcionUso: this.catalogosDatos.usoList.find(item => item.clave === this.mercanciaForm.get('uso')?.value)?.descripcion || '',
        descripcionPaisDeOrigen: this.catalogosDatos.paisOrigenList.find(item => item.clave === this.mercanciaForm.get('paisDeOrigen')?.value)?.descripcion || '',
        descripcionPaisDeProcedencia: this.catalogosDatos.paisDeProcedenciaList.find(item => item.clave === this.mercanciaForm.get('paisDeProcedencia')?.value)?.descripcion || '',
        certificadoInternacionalElectronico: this.mercanciaForm.get('numeroCertificadoInternacional')?.value || '',
        fraccionArancelaria: this.mercanciaForm.get('fraccionArancelaria')?.value || '',
        descripcionFraccion: this.mercanciaForm.get('descripcionFraccion')?.value || '',
        nico: this.mercanciaForm.get('nico')?.value || '',
        umt: this.mercanciaForm.get('clave_umt')?.value || '',
        umc: this.mercanciaForm.get('umc')?.value || '',
        tipoPlanta: this.mercanciaForm.get('tipoPlanta')?.value || '',
        plantaAutorizadaOrigen: this.mercanciaForm.get('plantaAutorizadaOrigen')?.value || '',
        tipoPresentacionDescripcion: this.mercanciaForm.get('tipoPresentacion')?.value || '',
      });

 
      SENSIBLES_FORM_ARRAY.clear();
      this.sensiblesTablaDatos.forEach(detalle => {
        SENSIBLES_FORM_ARRAY.push(this.fb.group(detalle));
      });
      const NUEVOS_SENSIBLES = this.mercanciaForm.getRawValue();
      // Si hay un registro seleccionado, actualízalo en sensiblesTablaDatos
      if (this.sensiblesTablaSeleccionada.length === 1) {
        const SELECCIONADO = this.sensiblesTablaSeleccionada[0];
        const INDEX = this.sensiblesTablaDatos.findIndex(item => item === SELECCIONADO);

        if (INDEX !== -1) {
          this.sensiblesTablaDatos[INDEX] = { ...NUEVOS_SENSIBLES, noPartida: SELECCIONADO.noPartida };
        }
        this.sensiblesTablaSeleccionada = [];
      } else {
        // Si no hay selección, agrega normalmente
        this.agregarDatosFormulario.emit(
          {
        formulario: NUEVOS_SENSIBLES,
        tablaDatos: this.sensiblesTablaDatos
          }
        );
      }
      this.cerrar.emit();
    }

  }

  /**
   * Actualiza los datos almacenados en el store.
   * @method setValoresStore
   */
  setValoresStoreFraccion(): void {
    const VALOR = this.mercanciaForm.value.fraccionArancelaria;
    this.registroSolicitudService.obtieneFraccionArancelariaDescripcion(220201, VALOR).subscribe(
      (response: BaseResponse<FraccionArancelariaDecripcionModel>) => {
        if (response && response.codigo === '00' && response.datos) {          
          this.mercanciaForm.get('descripcionFraccion')?.setValue(response.datos.descripcion);
        } else {
          this.mercanciaForm.get('descripcionFraccion')?.setValue('');
        }
      }
    );

    this.registroSolicitudService.obtieneUnidadMedida(220201, VALOR).subscribe(
        (response: BaseResponse<Catalogo>) => {
          if (response && response.codigo === '00' && response.datos) {
            this.mercanciaForm.get('clave_umt')?.setValue(response.datos.cve_unidad_medida);   
            this.mercanciaForm.get('umt')?.setValue(response.datos.descripcion);
          } else {
            this.mercanciaForm.get('umt')?.setValue('');
          }
        }
      );
    
  }

  /**
   * Actualiza la descripción del NICO en el formulario `mercanciaForm`.
   * 
   * Este método obtiene la fracción arancelaria y el NICO seleccionados en el formulario,
   * consulta la descripción correspondiente a través del servicio `registroSolicitudService`
   * y actualiza el campo `descripcionNico` en el formulario. Si la respuesta es exitosa,
   * se asigna la descripción obtenida; en caso contrario, se limpia el campo.
   */
  setValoresStoreFraccionNico(): void {
    const VALOR_FRACCION = this.mercanciaForm.value.fraccionArancelaria;
    const VALOR_NICO = this.mercanciaForm.value.nico;
    this.registroSolicitudService.obtieneNicoDescripcion(220201, VALOR_FRACCION, VALOR_NICO).subscribe(
      (response: BaseResponse<Catalogo>) => {
        if (response && response.codigo === '00' && response.datos) {
          this.mercanciaForm.get('descripcionNico')?.setValue(response.datos);
        } else {
          this.mercanciaForm.get('descripcionNico')?.setValue('');
        }
      }
    );
  }

  
  /**
   * Abre el modal para la carga masiva de animales vivos.
   * Establece la bandera 'banderaCargaVentana' en true para mostrar el componente/modal correspondiente.
   */
  abrirModalCargaMasivaAnimales(): void {
    this.banderaCargaVentana = true;
  }

  /**
   * Cierra el modal de carga masiva de animales.
   * 
   * Establece la bandera `banderaCargaVentana` en `false` para ocultar la ventana modal
   * utilizada en la carga masiva de animales vivos.
   */
  cerrarModalCargaMasivaAnimales(): void {
    this.banderaCargaVentana = false;    
  }

  /**
   * Limpia los datos de la tabla de cargas masivas de animales.
   * 
   * Esta función vacía el arreglo `sensiblesTablaDatos`, eliminando todos los registros actuales
   * de la tabla relacionada con cargas masivas de animales vivos.
   */
  limpiarTablaCargasMasivasAnimales(): void {
    this.sensiblesTablaDatos = [];
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de destruir el componente.
   * Emite una señal a través del observable `destroy$` para notificar a los suscriptores que deben limpiar recursos y cancelar suscripciones.
   * Posteriormente, completa el observable para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Maneja la confirmación de acciones en un modal, dependiendo del proceso actual.
   * 
   * @param confirmar Indica si el usuario ha confirmado la acción en el modal.
   * 
   * Si el proceso actual es 'eliminar_solicitud' y el usuario confirma,
   * elimina los elementos seleccionados de la tabla de datos sensibles,
   * limpia la selección y reinicia el proceso del modal.
   */
  confirmacionModal(confirmar: boolean): void {
    switch (this.procesoModal) {
      case 'eliminar_solicitud':
        {
          if (confirmar) {
            this.sensiblesTablaDatos = this.sensiblesTablaDatos.filter((item) => !this.sensiblesTablaSeleccionada.includes(item));
            this.sensiblesTablaSeleccionada = [];
            this.procesoModal = '';
          }
          break;
        }
      default:
        break;
    }
  }



  
  /**
   * Recibe una lista de objetos y los transforma en instancias del tipo `Sensible`.
   * 
   * @param lista - Arreglo de objetos donde cada objeto representa los datos de un animal vivo,
   *               con claves como 'Numero de lote', 'Color/Pelaje', 'Edad animal', etc.
   * 
   * El método mapea cada objeto de la lista a un objeto del tipo `Sensible`, asegurando que
   * cada propiedad esté presente (o vacía si falta en el objeto original), y agrega los nuevos
   * elementos al arreglo `sensiblesTablaDatos`.
   * 
   */
  recibirLista(lista: Record<string, string>[]): void {

    const NUEVOS_SENSIBLES: Sensible[] = lista.map((item, idx) => ({
      noPartida: String(this.sensiblesTablaDatos.length + idx + 1),
      NumeroLote: item['Numero de lote'] || '',
      ColorPelaje: item['Color/Pelaje'] || '',
      EdadAnimal: item['Edad animal'] || '',
      FaseDesarrollo: item['Fase de desarrollo'] || '',
      FuncionZootecnica: item['Función zootécnica'] || '',
      NombreMercancia: item['Nombre de la mercancía'] || '',
      NumeroIdentificacion: item['Número de identificación'] || '',
      Raza: item['Raza'] || '',
      NombreCientifico: item['Nombre científico'] || '',
      Sexo: item['Sexo'] || '',
      SexoClave: item['SexoClave'] || ''
    }));
    this.sensiblesTablaDatos = [...this.sensiblesTablaDatos, ...NUEVOS_SENSIBLES];
  }

}

