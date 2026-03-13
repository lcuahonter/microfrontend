import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule , Validators } from '@angular/forms';
import { Subject,map,takeUntil } from 'rxjs';

import { AVISO_RADIO, FUSION_CONFIGURACION_TABLA, FUSION_ESCISION_RADIO, SI_NO_RADIO } from '../../../../core/enums/30505/aviso-de-modificacion.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { FusionEscision, TABLE_ID } from '../../../../core/models/30505/aviso-modificacion.model';
import { InputRadioComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Solicitud30505State, Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';
/**
 * Componente encargado de gestionar la sección de Fusión o Escisión en el trámite 30505.
 *
 * Este componente implementa un formulario reactivo para capturar y mostrar información relacionada
 * con procesos de fusión o escisión de empresas, incluyendo datos de capacidad de almacenamiento,
 * número de carros, bienes, fechas de inspección, RFC, razón social, y vigencias.
 * 
 * Además, controla la visibilidad de diferentes secciones de la interfaz según los valores seleccionados,
 * permite la carga de datos de terceros relacionados, y sincroniza los datos del formulario con el store
 * correspondiente al trámite.
 *
 * @remarks
 * Utiliza servicios y stores para la gestión del estado y la obtención de datos externos.
 * Implementa los métodos de ciclo de vida de Angular `OnInit` y `OnDestroy` para la inicialización
 * y limpieza de recursos.
 *
 * @see FUSION_CONFIGURATION_TABLA
 * @see TablaSeleccion
 * @see Solicitud30505Store
 * @see Solicitud30505Query
 */
@Component({
  selector: 'app-fusion-o-escision',
  templateUrl: './fusion-o-escision.component.html',
  styleUrl:'./fusion-o-escision.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,TablaDinamicaComponent,TituloComponent,InputRadioComponent],
})

export class FusionOEscisionComponent implements OnInit , OnDestroy{

  /**
   * Representa el formulario reactivo utilizado en el componente para gestionar los datos de fusión o escisión.
   * Es una instancia de `FormGroup` que contiene los controles y validaciones del formulario.
   */
  formulario!: FormGroup;

  /**
   * Indica si el mensaje DV (Dígito Verificador) es visible en la interfaz de usuario.
   * 
   * @default false El mensaje no es visible por defecto.
   */
  dvMessageVisible: boolean = false;


  /**
   * Indica si el div completo es visible o no en la interfaz de usuario.
   * Cuando es `true`, el div se muestra; cuando es `false`, el div está oculto.
   */
  divCompletoVisible: boolean = false;
  /**
   * Indica si la certificación principal es visible en la interfaz de usuario.
   * 
   * Cuando es `true`, la certificación principal se muestra al usuario.
   * Cuando es `false`, la certificación principal permanece oculta.
   */
  conCertificacionPrincipalVisible: boolean = false;
  /**
   * Indica si el elemento relacionado con la certificación principal debe ser visible o no.
   * Cuando es `true`, el elemento no se muestra en la interfaz de usuario.
   */
  sinCertificacionPrincipalVisible: boolean = false;

  /**
   * Arreglo que almacena los datos relacionados con la fusión o escisión.
   * Cada elemento del arreglo es una instancia de la interfaz `FusionEscision`.
   * 
   * @type {FusionEscision[]}
   */
  gridFusionEscisionData: FusionEscision[] = [];

  /**
   * Configuración utilizada para la tabla de fusión.
   * 
   * Esta constante define la estructura, columnas y opciones de visualización
   * para la tabla relacionada con el proceso de fusión o escisión en el componente.
   * 
   * @see FUSION_CONFIGURACION_TABLA
   */
  FUSION_CONFIGURACION_TABLA = FUSION_CONFIGURACION_TABLA;

  /**
   * Referencia a la clase o interfaz `TablaSeleccion`.
   * 
   * Esta propiedad se utiliza para acceder a las funcionalidades o datos definidos en `TablaSeleccion`,
   * permitiendo su uso dentro del componente para la selección y manejo de tablas.
   * 
   * @see TablaSeleccion
   */
  tablaSeleccion = TablaSeleccion;
  
  /**
   * Identificador único de la tabla utilizada en el componente.
   * 
   * @remarks
   * Esta propiedad almacena el valor constante `TABLE_ID`, que se utiliza para identificar la tabla específica
   * dentro del componente de fusión o escisión.
   */
  tableId:string = TABLE_ID;

  /**
   * Opciones disponibles para el componente de radio botones.
   * 
   * Esta propiedad almacena las opciones que se mostrarán en el grupo de radio botones,
   * utilizando la constante `AVISO_RADIO`. Generalmente, estas opciones permiten al usuario
   * seleccionar entre diferentes alternativas relacionadas con el aviso de fusión o escisión.
   */
  radioOpciones = AVISO_RADIO;

  /**
   * Opciones disponibles para el radio de fusión o escisión.
   * 
   * Esta propiedad contiene las opciones que se mostrarán en el componente
   * para seleccionar entre los diferentes tipos de fusión o escisión.
   * 
   * @see FUSION_ESCISION_RADIO - Constante que define las opciones disponibles.
   */
  fusionEscisionOpciones = FUSION_ESCISION_RADIO;

  /**
   * Opciones disponibles para indicar si la empresa está fusionada o escindida.
   * Utiliza el conjunto de opciones definido en `SI_NO_RADIO`.
   * 
   * @remarks
   * Este arreglo se utiliza para mostrar opciones de selección (Sí/No) en la interfaz de usuario.
   */
  fusionadaOpciones = SI_NO_RADIO;

  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   * Se emite un valor y se completa cuando el componente es destruido, permitiendo limpiar recursos y evitar fugas de memoria.
   * 
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Representa el estado actual del aviso en el trámite 30505.
   * 
   * @type {Solicitud30505State}
   * @private
   */
  private avisoState!: Solicitud30505State;

  /**
   * Arreglo que contiene las fusiones o escisiones seleccionadas por el usuario.
   * 
   * Cada elemento del arreglo es una instancia de `FusionEscision`, que representa
   * una fusión o escisión específica dentro del trámite.
   */
  public selectedFusion:FusionEscision[] = [];

    /**
     * Indica si el componente debe estar en modo solo lectura.
     * Cuando es `true`, los campos y acciones estarán deshabilitados para evitar modificaciones.
     * Valor predeterminado: `false`.
     */
    @Input() soloLectura: boolean = false;

  /**
   * Constructor del componente FusionOEscision.
   * 
   * @param fb Instancia de FormBuilder para la creación y gestión de formularios reactivos.
   * @param router Servicio de Angular Router para la navegación entre rutas.
   * @param route Instancia de ActivatedRoute para acceder a información de la ruta activa.
   * @param tercerosService Servicio para la gestión de terceros relacionados.
   * @param tramiteStore Store para el manejo del estado de la solicitud 30505.
   * @param tramiteQuery Query para consultar el estado de la solicitud 30505.
   */
  constructor(private fb: FormBuilder,private router:Router,private route:ActivatedRoute,private tercerosService: TercerosRelacionadosService,private tramiteStore:Solicitud30505Store,private tramiteQuery:Solicitud30505Query) {  
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama al método `inicializarFormulario` para configurar el formulario inicial.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

/**
   * Inicializa el formulario reactivo del componente utilizando los datos del estado actual de la solicitud.
   * 
   * - Suscribe al observable `selectSolicitud$` para obtener el estado de la sección y asignarlo a `AvisoState`.
   * - Crea el formulario (`formulario`) con los valores iniciales provenientes de `AvisoState` y aplica las validaciones requeridas.
   * - Configura los campos del formulario, algunos de ellos deshabilitados según corresponda.
   * - Controla la visibilidad de ciertos elementos de la interfaz (`divCompletoVisible`, `sinCertificacionPrincipalVisible`, `conCertificacionPrincipalVisible`)
   *   en función de los valores de `numeroTotalCarros` y `cantidadBienes`.
   * - Asigna los datos de fusión o escisión a `gridFusionEscisionData`.
   * 
   * @remarks
   * Este método debe ser llamado durante la inicialización del componente para asegurar que el formulario refleje el estado actual de la solicitud.
   */
  inicializarFormulario():void{
    this.tramiteQuery.selectSolicitud$
            .pipe(
              takeUntil(this.destroyNotifier$),
              map((seccionState) => {
                this.avisoState = seccionState;
              })
            )
            .subscribe()
            
  this.formulario = this.fb.group({
      'capacidadAlmacenamiento': [this.avisoState?.capacidadAlmacenamiento2, Validators.required],
      'numeroTotalCarros': [this.avisoState?.numeroTotalCarros, Validators.required],
      'cantidadBienes': [this.avisoState?.cantidadBienes, Validators.required],
      'fechaInspeccion': [this.avisoState?.fechaInspeccion, Validators.required],
      'descripcionClobGenerica2': [this.avisoState?.descripcionClobGenerica2, Validators.required],
      'rfc': [this.avisoState?.rfcIdc, Validators.required],
      'razonSocial': [{ value: this.avisoState?.razonSocial,disabled:true}, Validators.required],
      'razonSocialSC':[this.avisoState?.razonSocialSC, Validators.required],
      'numFolioTramite': [{ value: this.avisoState?.numFolioTramite, disabled: true }, Validators.required],
      'fechaInicioVigencia': [{ value: this.avisoState?.fechaInicioVigencia, disabled: true }, Validators.required],
      'fechaFinVigencia': [{ value: this.avisoState?.fechafinVigencia2, disabled: true }, Validators.required]
    });
    
    if(this.avisoState?.numeroTotalCarros === "0" || this.avisoState?.numeroTotalCarros === '1'){
     this.divCompletoVisible = true; 
    }
    if(this.avisoState?.cantidadBienes === "0"){
    this.sinCertificacionPrincipalVisible = true;
    }
    if(this.avisoState?.cantidadBienes === "1"){
    this.conCertificacionPrincipalVisible = true;
    }
    this.gridFusionEscisionData = this.avisoState?.fusionEscisionData;
    if(this.soloLectura) {
      this.formulario.disable(); // Deshabilitar el formulario si está en modo solo lectura
    }
  }
  
   /**
   * Muestra los datos fusionados de la capacidad de almacenamiento.
   * 
   * Obtiene el valor del campo 'capacidadAlmacenamiento' del formulario y lo envía al store
   * mediante el método setAvisoDatos, asignándolo a la clave 'capacidadAlmacenamiento2'.
   *
   * @returns {void} No retorna ningún valor.
   */
  mostrarFusionada():void{
    const DATOS = this.formulario.get('capacidadAlmacenamiento')?.value;
    this.tramiteStore.setAvisoDatos('capacidadAlmacenamiento2',DATOS);
  }

  /**
   * Muestra u oculta el div completo según el valor del campo 'numeroTotalCarros' en el formulario.
   * 
   * - Si el valor es '1' o '0', muestra el div completo y reinicia los campos relacionados:
   *   'rfc', 'razonSocial', 'razonSocialSC', 'numFolioTramite', 'fechaInicioVigencia', 'fechaFinVigencia'.
   * - En cualquier otro caso, oculta el div completo.
   * 
   * Además, actualiza el aviso de datos en el store con el valor de 'numeroTotalCarros'.
   */
  mostrarFusionOEscision(): void {
    const VALOR = this.formulario.get('numeroTotalCarros')?.value;
    this.tramiteStore.setAvisoDatos('numeroTotalCarros',VALOR);
    if (VALOR === '1' || VALOR === '0'){
      this.divCompletoVisible = true;
      this.formulario.get('rfc')?.reset();
      this.formulario.get('razonSocial')?.reset();
      this.formulario.get('razonSocialSC')?.reset();
      this.formulario.get('numFolioTramite')?.reset();
      this.formulario.get('fechaInicioVigencia')?.reset();
      this.formulario.get('fechaFinVigencia')?.reset();
      }
   else { 
        this.divCompletoVisible = false;

    }
  }

  /**
   * Muestra u oculta los campos de certificación fusionada según el valor seleccionado en el formulario.
   *
   * - Si `cantidadBienes` es '1', muestra la certificación principal.
   * - Si `cantidadBienes` es '0', muestra la opción sin certificación principal y limpia los campos relacionados.
   *
   * Además, actualiza el aviso de datos en el store con el valor de `cantidadBienes`.
   *
   * @returns {void} No retorna ningún valor.
   */
  mostrarCertificacionFusionada(): void {
    const VALOR = this.formulario.get('cantidadBienes')?.value;
    this.tramiteStore.setAvisoDatos('cantidadBienes',VALOR);
    this.conCertificacionPrincipalVisible = (VALOR === '1');
    this.sinCertificacionPrincipalVisible = (VALOR === '0');

    if (!this.conCertificacionPrincipalVisible) {
      this.formulario.get('razonSocial')?.reset();
      this.formulario.get('razonSocialSC')?.reset();
      this.formulario.get('numFolioTramite')?.reset();
      this.formulario.get('fechaInicioVigencia')?.reset();
      this.formulario.get('fechaFinVigencia')?.reset();
    }
  }

 


  /**
   * Carga los datos de una persona relacionada con una fusión utilizando el RFC proporcionado en el formulario.
   * 
   * Si el RFC está presente en el formulario, realiza una solicitud al servicio `tercerosService` para obtener los datos de la persona.
   * Al recibir los datos, actualiza los campos correspondientes en el formulario y almacena los valores en el `tramiteStore`.
   * 
   * En caso de error al obtener los datos o si el RFC no está presente, muestra un mensaje de advertencia.
   * 
   * @remarks
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   */
  cargarDatosPersonaFusion(): void {
    const RFC = this.formulario.get('rfc')?.value;
    if (RFC) {
      this.tercerosService.obtenerDatosPersona(RFC).pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe(
          (datos)=> {
          
            this.formulario.patchValue({
              'razonSocial': datos.razonSocial,
              'numFolioTramite': datos.numFolioTramite,
              'fechaInicioVigencia': datos.fechaInicioVigencia,
              'fechaFinVigencia': datos.fechaFinVigencia
            });
            this.tramiteStore.setAvisoDatos('razonSocial',datos.razonSocial); 
            this.tramiteStore.setAvisoDatos('numFolioTramite',datos.numFolioTramite);
            this.tramiteStore.setAvisoDatos('fechaInicioVigencia',datos.fechaInicioVigencia);
            this.tramiteStore.setAvisoDatos('fechaFinVigencia2',datos.fechaFinVigencia);
          });
    } else {
      this.dvMessageVisible = true;
    }
  }

/**
 * Actualiza la fecha de inspección en el store del trámite.
 *
 * Obtiene el valor actual del campo 'fechaInspeccion' del formulario y lo envía al store
 * utilizando el método `setAvisoDatos`, junto con la clave 'fechaInspeccion'.
 *
 * @returns {void} No retorna ningún valor.
 */
 cambioFechaInspeccion():void{
   const VALOR = this.formulario.get('fechaInspeccion')?.value;
    this.tramiteStore.setAvisoDatos('fechaInspeccion',VALOR);
 }


  /**
   * Navega a la ruta relativa 'agregar-fusion-escision' para abrir el modal de fusión o escisión.
   *
   * Utiliza el enrutador de Angular para cambiar la ruta actual, manteniendo el contexto de la ruta activa.
   * Este método se utiliza para mostrar la interfaz de agregar una nueva fusión o escisión.
   */
  abrirModalFusionEscision(): void {
   this.router.navigate(['../agregar-fusion-escision'],{
        relativeTo: this.route,
      });
  }


 /**
   * Maneja el cambio del campo RFC en el formulario.
   * 
   * Obtiene el valor actual del RFC desde el formulario y actualiza el aviso de datos
   * en el store del trámite, especificando que el dato modificado es el RFC.
   *
   * @remarks
   * Este método debe ser llamado cuando el usuario modifica el campo RFC en el formulario.
   */
  cambioRFC():void{
    const RFC = this.formulario.get('rfc')?.value;
    this.tramiteStore.setAvisoDatos('rfc',RFC);
  }

   /**
   * Maneja el cambio en el campo "razonSocialSC" del formulario.
   * 
   * Obtiene el valor actualizado de la razón social secundaria (SC) desde el formulario
   * y lo envía al store de trámites para actualizar el aviso de datos correspondiente.
   *
   * @remarks
   * Este método se debe llamar cuando el usuario modifica el campo "razonSocialSC".
   */
  cambioRazonSocialSC():void{
    const RAZON_SOCIAL_SC = this.formulario.get('razonSocialSC')?.value;
    this.tramiteStore.setAvisoDatos('razonSocialSC',RAZON_SOCIAL_SC);
  }
   /**
   * Actualiza el aviso de datos en el store del trámite utilizando el valor del campo
   * 'descripcionClobGenerica2' del formulario.
   *
   * Obtiene el valor actual del campo 'descripcionClobGenerica2' del formulario y lo envía
   * al método setAvisoDatos del store del trámite, junto con el nombre del campo.
   *
   * @returns {void} No retorna ningún valor.
   */
  
  cambioDescClob():void{
    const VALOR = this.formulario.get('descripcionClobGenerica2')?.value;
    this.tramiteStore.setAvisoDatos('descripcionClobGenerica2',VALOR);
  }


  /**
   * Maneja el cambio en la fecha de inicio de vigencia.
   * 
   * Obtiene el valor actual del campo 'fechaInicioVigencia' del formulario
   * y actualiza el estado del trámite con este valor utilizando el método
   * setAvisoDatos del store.
   *
   * @returns {void} No retorna ningún valor.
   */
  cambioFechaInicio():void{
    const FECHA_INICIO = this.formulario.get('fechaInicioVigencia')?.value;
    this.tramiteStore.setAvisoDatos('fechaInicioVigencia',FECHA_INICIO);
  }


  /**
   * Maneja el cambio de la fecha de fin de vigencia en el formulario.
   * Obtiene el valor actualizado del campo 'fechaFinVigencia' y lo envía al store
   * para actualizar el aviso de datos correspondiente.
   *
   * @remarks
   * Este método debe ser llamado cuando el usuario modifica la fecha de fin de vigencia.
   */
  cambioFechaFin():void{
    const FECHA_FIN = this.formulario.get('fechaFinVigencia')?.value;
   this.tramiteStore.setAvisoDatos('fechaFinVigencia',FECHA_FIN);
  } 
   /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una señal a través de `destroyNotifier$` para notificar a los suscriptores y luego completa el observable.
   * Esto ayuda a prevenir fugas de memoria al cancelar suscripciones activas.
   */
  ngOnDestroy():void{
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Maneja la selección de datos de fusión o escisión.
   * 
   * Si existen datos en `gridFusionEscisionData`, actualiza la propiedad `selectedFusion`
   * con el evento recibido y pasa estos datos al servicio compartido `tercerosService`
   * mediante el método `setFusionada`.
   * 
   * @param evento - Arreglo de objetos `FusionEscision` seleccionados.
   */
  getFusionDatos(evento: FusionEscision[]): void {
    if(this.gridFusionEscisionData?.length > 0) {
      this.selectedFusion = evento;
      this.tercerosService.setFusionada(this.selectedFusion); // Pass data to the shared service
    }
  }

  /**
   * Elimina el primer elemento seleccionado de la lista de fusiones.
   *
   * Si existe al menos un elemento seleccionado en `selectedFusion`, 
   * este método llama a `removeFusionadoDato` del store para eliminar 
   * el primer elemento de la selección.
   */
   eliminarFusion():void {
    if (this.selectedFusion.length > 0) {
      this.tramiteStore.removeFusionadoDato(this.selectedFusion[0]);
    }
  }

  /**
   * Navega a la ruta relativa para modificar una fusión o escisión.
   *
   * Utiliza el enrutador de Angular para redirigir al usuario a la pantalla de modificación
   * de fusión o escisión, manteniendo el contexto de la ruta actual.
   */
  modificarFusion():void{
    this.router.navigate(['../modificar-fusion-escision'],{
        relativeTo: this.route,
      });
  }
}