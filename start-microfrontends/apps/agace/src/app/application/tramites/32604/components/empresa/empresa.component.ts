import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Modal } from 'bootstrap';

import { Catalogo, CatalogoSelectComponent, InputRadioComponent, REGEX_RFC, TituloComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery} from '@ng-mf/data-access-user';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';
import { Solicitud32604Store } from '../../estados/solicitud32604.store';

import { InputRadio, MiembroEmpresa, SeccionSociosIC, SolicitudRadioLista } from '../../models/empresas-comercializadoras.model';

/**
 * Interface para los datos del formulario
 */
interface DatosFormularioEmpresa {
  caracterDe?: string;
  nacionalidad?: string;
  nombreCompleto?: string;
  registroFederalContribuyentes?: string;
  instalacionesPrincipales?: string;
  tipoPersona?: string;
  nombreEmpresa?: string;
  nombreS?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
}

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    InputRadioComponent,
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export class EmpresaComponent implements OnInit, OnDestroy, OnChanges {
   /** Modelo para la opción de tipo sí/no representado como radio button */
    sinoOpcion: InputRadio = {} as InputRadio;
    
    /** Formulario reactivo para el componente empresa */
    empresaForm!: FormGroup;
  
    /** Subject para manejar la destrucción del componente y evitar fugas de memoria */
    private destroy$: Subject<void> = new Subject<void>();

    /** Mensaje de error que se mostrará en el modal */
    mensajeError: string = '';

    /** Control de visibilidad de campos basado en la selección del radio button */
    instalacionesPrincipalesValue: string = '';

    /**
     * Getter para verificar si se debe mostrar los campos cuando se selecciona "Sí"
     */
    get mostrarCamposSi(): boolean {
      const VALOR = this.instalacionesPrincipalesValue;
      if (!VALOR) {
        return false;
      }
      // Verificar el valor como string
      return VALOR === '1' || VALOR.toLowerCase() === 'sí' || VALOR.toLowerCase() === 'si';
    }

    /**
     * Getter para verificar si se debe mostrar los campos cuando se selecciona "No"
     */
    get mostrarCamposNo(): boolean {
      const VALOR = this.instalacionesPrincipalesValue;
      if (!VALOR) {
        return false;
      }
      // Verificar el valor como string
      return VALOR === '2' || VALOR.toLowerCase() === 'no';
    }

    /**
     * Getter para verificar si el tipo de persona seleccionado es "Física"
     */
    get tipoPersonaEsFisica(): boolean {
      const TIPO_PERSONA = this.empresaForm?.get('tipoPersona')?.value;
      return TIPO_PERSONA === 'Física' || TIPO_PERSONA === 'Fisica';
    }

    /**
     * Getter para verificar si el tipo de persona seleccionado es "Moral"
     */
    get tipoPersonaEsMoral(): boolean {
      const TIPO_PERSONA = this.empresaForm?.get('tipoPersona')?.value;
      return TIPO_PERSONA === 'Moral';
    }

    /**
     * Datos del miembro a modificar
     */
    @Input() miembroAModificar: SeccionSociosIC | null = null;

    /**
     * Emisor de eventos para enviar el miembro modificado al componente padre
     */
    @Output() miembroModificado = new EventEmitter<SeccionSociosIC>();

    /**
     * Emisor de eventos para notificar al componente padre que debe cerrar el modal
     */
    @Output() cerrarModalEvento = new EventEmitter<void>();

    /**
     * Referencia al modal de error.
     * ViewChild que permite acceder al elemento DOM del modal de error
     * para mostrar mensajes cuando no se encuentra el RFC.
     */
    @ViewChild('modalError', { static: false })
    elementoModalError!: ElementRef;
  
    /**
   * Lista de contenedores.
   */
    contenedores: {
      catalogos: Catalogo[];
      labelNombre: string;
      primerOpcion: string;
    };

  /**
   * Lista de nacionalidad.
   */
    nacionalidad: {
      catalogos: Catalogo[];
      labelNombre: string;
      primerOpcion: string;
    };
  /**
   * Lista de tipo de persona.
   */
    tipoPersona: {
      catalogos: Catalogo[];
      labelNombre: string;
      primerOpcion: string;
    };    
  
    /**
     * Constructor de la clase EmpresaComponent.
     * 
     * @param fb Instancia de FormBuilder para la creación y gestión de formularios reactivos.
     * @param empresasComercializadorasService Servicio para operaciones relacionadas con empresas comercializadoras.
     * @param solicitud32604Store Store para el manejo del estado de la solicitud 32604.
     * @param solicitud32604Query Query para consultar el estado de la solicitud 32604.
     * @param consultaioQuery Query para consultar información adicional relacionada.
     * @param http Cliente HTTP para realizar peticiones a archivos JSON.
     * 
     * Inicializa los objetos `contenedores` y `nacionalidad` con valores predeterminados para los catálogos y etiquetas.
     */
    constructor(
      public fb: FormBuilder,
      public empresasComercializadorasService: EmpresasComercializadorasService,
      public solicitud32604Store: Solicitud32604Store,
      public solicitud32604Query: Solicitud32604Query,
      public consultaioQuery: ConsultaioQuery,
      private http: HttpClient
    ) {
      this.contenedores = {
        catalogos: [],
        labelNombre: 'En su caracter de',
        primerOpcion: 'Seleccione una opción',
      };
      this.nacionalidad = {
        catalogos: [],
        labelNombre: 'Nacionalidad',
        primerOpcion: 'Seleccione una opción',
      };
      this.tipoPersona = {
        catalogos: [],
        labelNombre: 'Tipo de persona',
        primerOpcion: 'Seleccione una opción',
      };
      
      this.inicializarFormulario();
    }
  
    /**
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     * 
     * Realiza las siguientes acciones al iniciar:
     * - Obtiene la opción seleccionada del radio button.
     * - Carga los catálogos necesarios para el componente.
     * - Carga la nacionalidad correspondiente.
     */
    ngOnInit(): void {
      this.conseguirOpcionDeRadio();
      this.cargarCatalogos();
      this.cargarNacionalidad();
      this.cargarTipoPersona();
    }

    /**
     * Método del ciclo de vida que se ejecuta cuando las propiedades de entrada cambian.
     * 
     * Detecta cambios en miembroAModificar y resetea el formulario cuando se pasa de
     * modo modificación a modo agregar (null).
     */
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['miembroAModificar']) {
        if (!this.miembroAModificar && this.empresaForm) {
          // Si miembroAModificar es null, estamos en modo "agregar", resetear el formulario
          this.empresaForm.reset();
          this.instalacionesPrincipalesValue = '';
          this.actualizarValidacionesCampos();
        }
      }
    }

    /**
     * Llena el formulario con los datos del miembro a modificar
     */
    llenarFormularioConDatos(): void {
      if (this.miembroAModificar && this.empresaForm) {
        // Buscar el ID del carácter en el catálogo
        let caracterDeId = '';
        if (this.miembroAModificar.caracterDe && this.contenedores.catalogos.length > 0) {
          const CARACTER_ENCONTRADO = this.contenedores.catalogos.find(
            item => item.descripcion === this.miembroAModificar?.caracterDe || 
                    item.id.toString() === this.miembroAModificar?.caracterDe
          );
          caracterDeId = CARACTER_ENCONTRADO ? CARACTER_ENCONTRADO.id.toString() : '';
        }

        // Buscar el ID de la nacionalidad en el catálogo
        let nacionalidadId = '';
        if (this.miembroAModificar.nacionalidad && this.nacionalidad.catalogos.length > 0) {
          const NACIONALIDAD_ENCONTRADA = this.nacionalidad.catalogos.find(
            item => item.descripcion === this.miembroAModificar?.nacionalidad || 
                    item.id.toString() === this.miembroAModificar?.nacionalidad
          );
          nacionalidadId = NACIONALIDAD_ENCONTRADA ? NACIONALIDAD_ENCONTRADA.id.toString() : '';
        }

        // Buscar el ID del tipo de persona en el catálogo
        let tipoPersonaId = '';
        if (this.miembroAModificar.tipoPersona && this.tipoPersona.catalogos.length > 0) {
          const TIPO_PERSONA_ENCONTRADO = this.tipoPersona.catalogos.find(
            item => item.descripcion === this.miembroAModificar?.tipoPersona || 
                    item.id.toString() === this.miembroAModificar?.tipoPersona
          );
          tipoPersonaId = TIPO_PERSONA_ENCONTRADO ? TIPO_PERSONA_ENCONTRADO.id.toString() : '';
        }

        // Temporalmente habilitar campos deshabilitados para poder establecer valores
        this.empresaForm.get('registroFederalContribuyentes')?.enable();
        this.empresaForm.get('nombreCompleto')?.enable();
        
        this.empresaForm.patchValue({
          caracterDe: caracterDeId,
          rfcBusqueda: this.miembroAModificar.rfc || '',
          instalacionesPrincipales: this.convertirRadioDescripcionAId(this.miembroAModificar.tributarMexico || 'No'),
          registroFederalContribuyentes: this.miembroAModificar.rfc || '',
          nacionalidad: nacionalidadId,
          tipoPersona: tipoPersonaId,
          nombreCompleto: this.miembroAModificar.nombreCompleto || ''
        });
        
        // Establecer la propiedad de control de visibilidad con el valor de ID
        this.instalacionesPrincipalesValue = this.convertirRadioDescripcionAId(this.miembroAModificar.tributarMexico || 'No');
        
        // Actualizar las validaciones de los campos según el valor cargado
        this.actualizarValidacionesCampos();
        
        // Volver a deshabilitar los campos después de establecer los valores
        this.empresaForm.get('registroFederalContribuyentes')?.disable();
        this.empresaForm.get('nombreCompleto')?.disable();
      }
    }
  
    /**
     * Actualiza el campo '190' en el estado global y controla la visibilidad de campos.
     *
     * @param {string | number} valor - Valor numérico o de texto para el campo 290.
     */
    actualizar290(valor: string | number): void {
      this.solicitud32604Store.actualizar290(valor);
      this.instalacionesPrincipalesValue = valor.toString();
      this.actualizarValidacionesCampos();
    }

    /**
     * Maneja el cambio en la selección del tipo de persona.
     * Se ejecuta cuando el usuario selecciona un tipo de persona.
     */
    onTipoPersonaChange(): void {
      this.actualizarValidacionesTipoPersona();
    }

    /**
     * Actualiza las validaciones de los campos según la visibilidad
     */
    private actualizarValidacionesCampos(): void {
      if (!this.empresaForm) { 
        return;
      }

      if (this.mostrarCamposSi) {
        // Cuando se muestra "Sí", hacer requeridos los campos relacionados
        this.empresaForm.get('rfcBusqueda')?.enable();
        // Mantener registroFederalContribuyentes y nombreCompleto siempre deshabilitados
        this.empresaForm.get('registroFederalContribuyentes')?.disable();
        this.empresaForm.get('nombreCompleto')?.disable();
        this.empresaForm.get('tipoPersona')?.disable();
        this.empresaForm.get('tipoPersona')?.clearValidators();
        this.empresaForm.get('tipoPersona')?.updateValueAndValidity();
        
        // Deshabilitar campos específicos de tipo persona cuando se muestra "Sí"
        this.deshabilitarCamposTipoPersona();
      } else if (this.mostrarCamposNo) {
        // Cuando se muestra "No", hacer requerido el tipo de persona
        this.empresaForm.get('tipoPersona')?.enable();
        this.empresaForm.get('rfcBusqueda')?.disable();
        // Mantener registroFederalContribuyentes y nombreCompleto siempre deshabilitados
        this.empresaForm.get('registroFederalContribuyentes')?.disable();
        this.empresaForm.get('nombreCompleto')?.disable();
        
        // Actualizar validaciones según el tipo de persona seleccionado
        this.actualizarValidacionesTipoPersona();
      } else {
        // Cuando no hay selección, deshabilitar todos los campos condicionales
        this.empresaForm.get('rfcBusqueda')?.disable();
        this.empresaForm.get('registroFederalContribuyentes')?.disable();
        this.empresaForm.get('nombreCompleto')?.disable();
        this.empresaForm.get('tipoPersona')?.disable();
        this.deshabilitarCamposTipoPersona();
      }
    }

    /**
     * Actualiza las validaciones según el tipo de persona seleccionado
     */
    private actualizarValidacionesTipoPersona(): void {
      if (this.tipoPersonaEsFisica) {
        // Habilitar y hacer requeridos los campos para persona física
        this.empresaForm.get('nombreS')?.enable();
        this.empresaForm.get('nombreS')?.setValidators([Validators.required]);
        this.empresaForm.get('apellidoPaterno')?.enable();
        this.empresaForm.get('apellidoPaterno')?.setValidators([Validators.required]);
        this.empresaForm.get('apellidoMaterno')?.enable();
        // apellidoMaterno no es requerido según la especificación
        this.empresaForm.get('apellidoMaterno')?.clearValidators();
        
        // Deshabilitar campos de persona moral
        this.empresaForm.get('nombreEmpresa')?.disable();
        this.empresaForm.get('nombreEmpresa')?.clearValidators();
      } else if (this.tipoPersonaEsMoral) {
        // Habilitar y hacer requerido el campo para persona moral
        this.empresaForm.get('nombreEmpresa')?.enable();
        this.empresaForm.get('nombreEmpresa')?.setValidators([Validators.required]);
        
        // Deshabilitar campos de persona física
        this.empresaForm.get('nombreS')?.disable();
        this.empresaForm.get('nombreS')?.clearValidators();
        this.empresaForm.get('apellidoPaterno')?.disable();
        this.empresaForm.get('apellidoPaterno')?.clearValidators();
        this.empresaForm.get('apellidoMaterno')?.disable();
        this.empresaForm.get('apellidoMaterno')?.clearValidators();
      } else {
        // Si no hay tipo persona seleccionado, deshabilitar todos
        this.deshabilitarCamposTipoPersona();
      }
      
      // Actualizar la validez de todos los campos modificados
      this.empresaForm.get('nombreS')?.updateValueAndValidity();
      this.empresaForm.get('apellidoPaterno')?.updateValueAndValidity();
      this.empresaForm.get('apellidoMaterno')?.updateValueAndValidity();
      this.empresaForm.get('nombreEmpresa')?.updateValueAndValidity();
    }

    /**
     * Deshabilita todos los campos específicos de tipo persona
     */
    private deshabilitarCamposTipoPersona(): void {
      this.empresaForm.get('nombreS')?.disable();
      this.empresaForm.get('nombreS')?.clearValidators();
      this.empresaForm.get('apellidoPaterno')?.disable();
      this.empresaForm.get('apellidoPaterno')?.clearValidators();
      this.empresaForm.get('apellidoMaterno')?.disable();
      this.empresaForm.get('apellidoMaterno')?.clearValidators();
      this.empresaForm.get('nombreEmpresa')?.disable();
      this.empresaForm.get('nombreEmpresa')?.clearValidators();
      
      this.empresaForm.get('nombreS')?.updateValueAndValidity();
      this.empresaForm.get('apellidoPaterno')?.updateValueAndValidity();
      this.empresaForm.get('apellidoMaterno')?.updateValueAndValidity();
      this.empresaForm.get('nombreEmpresa')?.updateValueAndValidity();
    }
  
      /**
       * Método para obtener la opción de radio (sí/no) desde el servicio.
       * Se suscribe al observable y asigna el resultado a `sinoOpcion`.
       */
      conseguirOpcionDeRadio(): void {
        this.empresasComercializadorasService
          .conseguirOpcionDeRadio()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (respuesta: SolicitudRadioLista) => {
              this.sinoOpcion = respuesta.requisitos;
            },
          });
      }
  
        /**
     * Cargar catálogos de datos.
     */
    cargarCatalogos(): void {
      this.empresasComercializadorasService
        .getContenedores()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.contenedores.catalogos = data.data;
          // Llenar el formulario después de que los catálogos estén cargados
          this.verificarYLlenarFormulario();
        });
    }

    /**
     * Cargar catálogos de datos.
     */
    cargarNacionalidad(): void {
      this.empresasComercializadorasService
        .getNationalidad()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.nacionalidad.catalogos = data.data;
          // Llenar el formulario después de que los catálogos estén cargados
          this.verificarYLlenarFormulario();
        });
    }

    /**
     * Cargar catálogos de tipo de persona.
     */
    cargarTipoPersona(): void {
      this.empresasComercializadorasService
        .getTipPersona()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.tipoPersona.catalogos = data.data;
          // Llenar el formulario después de que los catálogos estén cargados
          this.verificarYLlenarFormulario();
        });
    }

    /**
     * Verifica si ambos catálogos están cargados y llena el formulario si están disponibles
     */
    private verificarYLlenarFormulario(): void {
      if (this.contenedores.catalogos.length > 0 && 
          this.nacionalidad.catalogos.length > 0 && 
          this.tipoPersona.catalogos.length > 0 && 
          this.miembroAModificar) {
        this.llenarFormularioConDatos();
      }
    }

    /**
     * Inicializa el formulario reactivo de empresa con validaciones.
     */
    private inicializarFormulario(): void {
      this.empresaForm = this.fb.group({
        caracterDe: ['', [Validators.required]],
        rfcBusqueda: ['', [Validators.required, Validators.pattern(REGEX_RFC)]],
        instalacionesPrincipales: ['', [Validators.required]],
        registroFederalContribuyentes: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(REGEX_RFC)]],
        nacionalidad: ['', [Validators.required]],
        tipoPersona: ['', [Validators.required]],
        nombreCompleto: [{ value: '', disabled: true }, [Validators.required]],
        nombreS: [''],
        apellidoPaterno: [''],
        apellidoMaterno: [''],
        nombreEmpresa: ['']
      });
      
      // Inicializar el estado de los campos condicionales
      this.actualizarValidacionesCampos();
    }

    /**
     * Valida el formulario y procesa el envío si es válido.
     * Si el formulario no es válido, marca todos los campos como touched para mostrar errores.
     */
    validarYEnviarFormulario(): void {
      if (this.empresaForm.valid) {
        // Procesar el formulario válido
        // Aquí iría la lógica para procesar los datos del formulario
        this.procesarFormularioValido();
      } else {
        // Marcar todos los campos como touched para mostrar errores de validación
        this.marcarCamposComoTocados();
      }
    }

    /**
     * Convierte la descripción del radio button a su ID correspondiente.
     * @param descripcion La descripción del radio button (ej: "Sí", "No")
     * @returns El ID correspondiente o la descripción original si no se encuentra
     */
    private convertirRadioDescripcionAId(descripcion: string): string {
      if (!this.sinoOpcion.radioOptions) {
        return descripcion;
      }
      
      const OPCION_ENCONTRADA = this.sinoOpcion.radioOptions.find(
        opcion => opcion.label.toLowerCase() === descripcion.toLowerCase()
      );
      
      return OPCION_ENCONTRADA ? String(OPCION_ENCONTRADA.value) : descripcion;
    }

    /**
     * Convierte el ID del radio button a su descripción correspondiente.
     * @param value El valor/ID del radio button
     * @returns La descripción correspondiente o el valor original si no se encuentra
     */
    private convertirRadioIdADescripcion(value: string | number): string {
      if (!this.sinoOpcion.radioOptions) {
        return String(value);
      }
      
      const OPCION_ENCONTRADA = this.sinoOpcion.radioOptions.find(
        opcion => String(opcion.value) === String(value)
      );
      
      return OPCION_ENCONTRADA ? OPCION_ENCONTRADA.label : String(value);
    }

    /**
     * Convierte el ID del catálogo a su descripción correspondiente.
     * @param catalogId El ID del catálogo
     * @param catalogos El array de catálogos donde buscar
     * @returns La descripción correspondiente o el ID original si no se encuentra
     */
    private static convertirCatalogoIdADescripcion(catalogId: string | number, catalogos: Catalogo[]): string {
      if (!catalogos || catalogos.length === 0) {
        return String(catalogId);
      }
      
      const CATALOGO_ENCONTRADO = catalogos.find(
        catalogo => String(catalogo.id) === String(catalogId)
      );
      
      return CATALOGO_ENCONTRADO ? CATALOGO_ENCONTRADO.descripcion : String(catalogId);
    }

    /**
     * Procesa el formulario cuando es válido.
     */
    private procesarFormularioValido(): void {
      if (!this.empresaForm.valid) {
        return;
      }

      const DATOS_FORMULARIO = this.empresaForm.getRawValue();
      
      if (this.miembroAModificar) {
        this.procesarModificacionMiembro(DATOS_FORMULARIO);
      } else {
        this.procesarNuevoMiembro(DATOS_FORMULARIO);
      }
    }

    /**
     * Procesa la modificación de un miembro existente
     */
    private procesarModificacionMiembro(datosFormulario: DatosFormularioEmpresa): void {
      const MIEMBRO_MODIFICADO = this.crearMiembroModificado(datosFormulario);
      this.miembroModificado.emit(MIEMBRO_MODIFICADO);
      this.cerrarModalConDelay();
    }

    /**
     * Procesa la creación de un nuevo miembro
     */
    private procesarNuevoMiembro(datosFormulario: DatosFormularioEmpresa): void {
      const NUEVO_MIEMBRO = this.crearNuevoMiembro(datosFormulario);
      this.miembroModificado.emit(NUEVO_MIEMBRO);
      this.resetearFormularioCompleto();
      this.cerrarModalConDelay();
    }

    /**
     * Crea un objeto de miembro modificado con los datos del formulario
     */
    private crearMiembroModificado(datosFormulario: DatosFormularioEmpresa): SeccionSociosIC {
      const MIEMBRO_BASE = this.miembroAModificar;
      if (!MIEMBRO_BASE) {
        throw new Error('No hay miembro para modificar');
      }

      return {
        ...MIEMBRO_BASE,
        caracterDe: EmpresaComponent.convertirCatalogoIdADescripcion(datosFormulario.caracterDe || '', this.contenedores.catalogos) || MIEMBRO_BASE.caracterDe,
        nacionalidad: EmpresaComponent.convertirCatalogoIdADescripcion(datosFormulario.nacionalidad || '', this.nacionalidad.catalogos) || MIEMBRO_BASE.nacionalidad,
        nombreCompleto: datosFormulario.nombreCompleto || MIEMBRO_BASE.nombreCompleto,
        rfc: datosFormulario.registroFederalContribuyentes || MIEMBRO_BASE.rfc,
        tributarMexico: this.convertirRadioIdADescripcion(datosFormulario.instalacionesPrincipales || '') || MIEMBRO_BASE.tributarMexico,
        tipoPersona: EmpresaComponent.convertirCatalogoIdADescripcion(datosFormulario.tipoPersona || '', this.tipoPersona.catalogos) || MIEMBRO_BASE.tipoPersona,
        nombreEmpresa: this.obtenerNombreEmpresaParaModificacion(datosFormulario),
        nombre: this.obtenerNombreParaModificacion(datosFormulario)
      };
    }

    /**
     * Crea un objeto de nuevo miembro con los datos del formulario
     */
    private crearNuevoMiembro(datosFormulario: DatosFormularioEmpresa): SeccionSociosIC {
      return {
        caracterDe: EmpresaComponent.convertirCatalogoIdADescripcion(datosFormulario.caracterDe || '', this.contenedores.catalogos) || '',
        nacionalidad: EmpresaComponent.convertirCatalogoIdADescripcion(datosFormulario.nacionalidad || '', this.nacionalidad.catalogos) || '',
        nombreCompleto: datosFormulario.nombreCompleto || '',
        rfc: datosFormulario.registroFederalContribuyentes || '',
        tipoPersonaMuestra: this.obtenerTipoPersonaMuestra(datosFormulario),
        tributarMexico: this.convertirRadioIdADescripcion(datosFormulario.instalacionesPrincipales || '') || 'No',
        nombreEmpresa: this.obtenerNombreEmpresa(datosFormulario),
        nombre: this.obtenerNombre(datosFormulario),
        tipoPersona: EmpresaComponent.convertirCatalogoIdADescripcion(datosFormulario.tipoPersona || '', this.tipoPersona.catalogos) || ''
      };
    }

    /**
     * Obtiene el tipo de persona muestra según las condiciones
     */
    private obtenerTipoPersonaMuestra(datosFormulario: DatosFormularioEmpresa): string {
      return this.mostrarCamposNo ? 
        EmpresaComponent.convertirCatalogoIdADescripcion(datosFormulario.tipoPersona || '', this.tipoPersona.catalogos) || '' : '';
    }

    /**
     * Obtiene el nombre de empresa según el tipo de persona
     */
    private obtenerNombreEmpresa(datosFormulario: DatosFormularioEmpresa): string {
      if (this.tipoPersonaEsMoral) {
        return datosFormulario.nombreEmpresa || '';
      }
      if (this.tipoPersonaEsFisica) {
        return EmpresaComponent.concatenarNombresIndividuales(datosFormulario);
      }
      return datosFormulario.nombreCompleto || '';
    }

    /**
     * Obtiene el nombre según el tipo de persona
     */
    private obtenerNombre(datosFormulario: DatosFormularioEmpresa): string {
      if (this.tipoPersonaEsFisica) {
        return EmpresaComponent.concatenarNombresIndividuales(datosFormulario);
      }
      if (this.tipoPersonaEsMoral) {
        return datosFormulario.nombreEmpresa || '';
      }
      return datosFormulario.nombreCompleto || '';
    }

    /**
     * Obtiene el nombre de empresa para modificación
     */
    private obtenerNombreEmpresaParaModificacion(datosFormulario: DatosFormularioEmpresa): string {
      const MIEMBRO_BASE = this.miembroAModificar;
      if (!MIEMBRO_BASE) {
        return '';
      }

      if (this.tipoPersonaEsMoral) {
        return datosFormulario.nombreEmpresa || MIEMBRO_BASE.nombreEmpresa || '';
      }
      if (this.tipoPersonaEsFisica) {
        return EmpresaComponent.concatenarNombresIndividuales(datosFormulario);
      }
      return datosFormulario.nombreCompleto || MIEMBRO_BASE.nombreEmpresa || '';
    }

    /**
     * Obtiene el nombre para modificación
     */
    private obtenerNombreParaModificacion(datosFormulario: DatosFormularioEmpresa): string {
      const MIEMBRO_BASE = this.miembroAModificar;
      if (!MIEMBRO_BASE) {
        return '';
      }

      if (this.tipoPersonaEsFisica) {
        return EmpresaComponent.concatenarNombresIndividuales(datosFormulario);
      }
      if (this.tipoPersonaEsMoral) {
        return datosFormulario.nombreEmpresa || MIEMBRO_BASE.nombre || '';
      }
      return datosFormulario.nombreCompleto || MIEMBRO_BASE.nombre || '';
    }

    /**
     * Concatena los nombres individuales (nombres, apellido paterno, apellido materno)
     */
    private static concatenarNombresIndividuales(datosFormulario: DatosFormularioEmpresa): string {
      return `${datosFormulario.nombreS || ''} ${datosFormulario.apellidoPaterno || ''} ${datosFormulario.apellidoMaterno || ''}`.trim();
    }

    /**
     * Resetea el formulario completamente después de agregar un miembro
     */
    private resetearFormularioCompleto(): void {
      this.empresaForm.reset();
      this.instalacionesPrincipalesValue = '';
      this.actualizarValidacionesCampos();
    }

    /**
     * Cierra el modal con un pequeño delay
     */
    private cerrarModalConDelay(): void {
      setTimeout(() => {
        this.cerrarModalEvento.emit();
      }, 100);
    }

    /**
     * Marca todos los campos del formulario como touched para mostrar errores de validación.
     */
    private marcarCamposComoTocados(): void {
      this.empresaForm.markAllAsTouched();
    }

    /**
     * Cancela la acción actual y cierra el modal sin Aceptar.
     */
    cancelarAccion(): void {
      this.empresaForm.reset();
      this.instalacionesPrincipalesValue = '';
      this.cerrarModalEvento.emit();
    }

    /**
     * Método público para resetear el formulario.
     * Útil para limpiar el formulario cuando se abre el modal para agregar un nuevo miembro.
     */
    public resetearFormulario(): void {
      if (this.empresaForm) {
        this.empresaForm.reset();
        this.instalacionesPrincipalesValue = '';
        this.actualizarValidacionesCampos();
      }
    }

    /**
     * Busca un miembro en el archivo JSON basado en el carácter de y RFC.
     * Prellenará el formulario con los datos encontrados.
     */
    public buscarMiembro(): void {
      const CARACTER_DE = this.empresaForm?.get('caracterDe')?.value;
      const RFC_BUSQUEDA = this.empresaForm?.get('rfcBusqueda')?.value;

      if (!CARACTER_DE || !RFC_BUSQUEDA) {
        this.mostrarModalError('Debe capturar todos los datos marcados como obligatorios.');
        return;
      }

      // Cargar el archivo JSON y buscar el miembro
      this.http.get<MiembroEmpresa[]>('assets/json/32604/miembro-empresa.json').subscribe({
        next: (miembros) => {
          // Convertir ambos valores a string para asegurar compatibilidad
          const CARACTER_DE_STR = String(CARACTER_DE);
          const RFC_BUSQUEDA_STR = String(RFC_BUSQUEDA).toUpperCase();
          
          const MIEMBRO_ENCONTRADO = miembros.find(miembro => 
            String(miembro.caracterDe) === CARACTER_DE_STR && 
            String(miembro.rfc).toUpperCase() === RFC_BUSQUEDA_STR
          );

          if (MIEMBRO_ENCONTRADO) {
            // Temporalmente habilitar campos deshabilitados para poder establecer valores
            this.empresaForm?.get('registroFederalContribuyentes')?.enable();
            this.empresaForm?.get('nombreCompleto')?.enable();
            
            // Si se encuentra el miembro, prellenar el formulario
            this.empresaForm?.patchValue({
              instalacionesPrincipales: MIEMBRO_ENCONTRADO.instalacionesPrincipales,
              registroFederalContribuyentes: MIEMBRO_ENCONTRADO.registroFederalContribuyentes,
              nacionalidad: MIEMBRO_ENCONTRADO.nacionalidad,
              nombreCompleto: MIEMBRO_ENCONTRADO.nombreCompleto
            });
            
            // Actualizar el control de visibilidad DESPUÉS de patchValue y actualizar290
            this.actualizar290(MIEMBRO_ENCONTRADO.instalacionesPrincipales);
            this.instalacionesPrincipalesValue = MIEMBRO_ENCONTRADO.instalacionesPrincipales;
            
            // Volver a deshabilitar los campos después de establecer los valores
            this.empresaForm?.get('registroFederalContribuyentes')?.disable();
            this.empresaForm?.get('nombreCompleto')?.disable();
          } else {
            // Solo mostrar el modal si NO se encuentra el registro
            this.mostrarModalError('El contribuyente no fue encontrado. Favor de verificar el RFC.');
          }
        },
        error: (error) => {
          console.error('Error al cargar los datos de miembros:', error);
          this.mostrarModalError('Error al buscar los datos del miembro.');
        }
      });
    }

    /**
     * Muestra el modal de error con el mensaje especificado.
     * @param mensaje El mensaje de error a mostrar en el modal
     */
  public mostrarModalError(mensaje: string): void {
      // Actualizar el mensaje en el modal
      this.mensajeError = mensaje;
      
      if (this.elementoModalError) {
        const MODAL_INSTANCIA = new Modal(this.elementoModalError.nativeElement, {
          backdrop: true,
          keyboard: true,
          focus: true
        });
        MODAL_INSTANCIA.show();
      }
    }

    /**
     * Cierra el modal de error.
     */
  public cerrarModalError(): void {
      if (this.elementoModalError) {
        const MODAL_INSTANCIA = Modal.getInstance(this.elementoModalError.nativeElement);
        if (MODAL_INSTANCIA) {
          MODAL_INSTANCIA.hide();
        }
      }
    }

    /**
     * Método del ciclo de vida que se ejecuta cuando el componente se destruye.
     * Completa el subject destroy$ para cancelar todas las suscripciones activas.
     */
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

}
