import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Personas } from '@libs/shared/data-access-user/src/core/models/31601/servicios-pantallas.model';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente `PersonaComponent`.
 * Este componente es responsable de manejar la interfaz relacionada con la visualización y carga de datos de personas.
 * Permite al usuario visualizar información sobre una persona a partir de un archivo JSON, cargado mediante un servicio HTTP.
 *
 * El componente utiliza el servicio `ServiciosPantallaService` para obtener los datos de las personas desde un archivo JSON,
 * y muestra esta información en la interfaz.
 *
 * Además, incluye el componente `TituloComponent` para mostrar un título en la pantalla.
 *
 * @component PersonaComponent
 * @selector app-persona
 * @templateUrl './persona.component.html'
 * @styleUrl './persona.component.scss'
 * @imports [
 *   HttpClientModule,
 *   FormsModule,
 *   CommonModule,
 *   TituloComponent
 * ]
 */
@Component({
  selector: 'app-persona', // Selector para usar este componente en plantillas HTML
  standalone: true, // Define que el componente puede funcionar de forma independiente (sin módulo específico)
  imports: [
    FormsModule, // Importación de módulo para trabajar con formularios
    CommonModule, // Módulo común de Angular para herramientas generales
    TituloComponent,
    TablaDinamicaComponent, // Componente para mostrar el título
  ],
  templateUrl: './persona.component.html', // Ruta a la plantilla HTML
  styleUrl: './persona.component.scss', // Ruta al archivo de estilos SCSS
})
export class PersonaComponent implements OnInit, OnDestroy {
  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 
   /**
     * Notificador para destruir las suscripciones.
     */
    private destroyNotifier$: Subject<void> = new Subject();
    
  /**
   * Array que contiene los datos de las personas cargadas desde el archivo JSON.
   * @type {Personas[]}
   */
  personaParas: Personas[] = [];

  /**
   * Configuración de las columnas para la tabla dinámica.
   * @type {ConfiguracionColumna<unknown>[]}
   */
  configuracionTabla: ConfiguracionColumna<Personas>[] = [
    { encabezado: 'RFC', clave: (item: Personas) => item.rfc, orden: 1 },
    { encabezado: 'CURP', clave: (item: Personas) => item.curp, orden: 2 },
    { encabezado: 'Nombre', clave: (item: Personas) => item.nombre, orden: 3 },
    {
      encabezado: 'Apellido Paterno',
      clave: (item: Personas) => item.apellidoPaterno,
      orden: 4,
    },
    {
      encabezado: 'Apellido Materno',
      clave: (item: Personas) => item.apellidoMaterno,
      orden: 5,
    },
  ];

  /**
   * Suscripción al observable que contiene los datos de las personas.
   * @type {Subscription}
   */
  private personaParasSubscription: Subscription = new Subscription();

  /**
   * Controla la visibilidad del contenido adicional.
   * @type {boolean}
   */
  showContent = false;

  /**
   * Método que alterna la visibilidad del contenido.
   * @returns {void}
   */
  toggleContent(): void {
    this.showContent = !this.showContent;
  }

  /**
   * Constructor del componente.
   * @param {HttpClient} http - Instancia del cliente HTTP para realizar peticiones.
   * @param {ServiciosPantallaService} pantallaSvc - Servicio para obtener los datos de las personas.
   */
  constructor(
    public http: HttpClient,
    private pantallaSvc: ServiciosPantallaService,
    private consultaioQuery: ConsultaioQuery
  ) {
     this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.loadPersonas();
      })
    )
    .subscribe()
  }

  /**
   * Método que se ejecuta cuando el componente se inicializa.
   * Se encarga de cargar los datos de las personas desde el archivo JSON.
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadPersonas(); // Carga las personas al inicializar el componente
  }

  /**
   * Método que realiza la carga de los datos de personas desde el archivo JSON.
   * El archivo JSON se encuentra en la ruta `assets/json/31601/personapara.json`.
   * Utiliza el servicio `pantallaSvc` para obtener los datos y asignarlos a la propiedad `personaParas` del componente.
   *
   * Este método hace uso de un observable y suscribe a él para recibir la respuesta y asignar los datos cargados a la propiedad `personaParas`.
   *
   * @method loadPersonas
   * @returns {void} No devuelve ningún valor. Solo asigna los datos a la propiedad `personaParas`.
   */
  loadPersonas(): void {
    // Realiza la solicitud HTTP para obtener los datos de personas desde el archivo JSON
    const PERSONAPARAS$ = this.pantallaSvc
      .getPersonapara() // Llama al servicio para obtener el array de personas
      .pipe(
        map((resp) => {
          // Asigna los datos obtenidos a la propiedad 'personaParas'
          this.personaParas = resp;
        })
      );

    // Suscribe al observable para que la asignación de los datos se ejecute
    this.personaParasSubscription = PERSONAPARAS$.subscribe(); 
  }

  /**
   * Método que se ejecuta cuando el componente se destruye.
   * Se encarga de desuscribirse de la suscripción al observable de personas.
   * @returns {void}
   */
  ngOnDestroy(): void {
    // Desuscribirse cuando el componente se destruya
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();

    if (this.personaParasSubscription) {
      this.personaParasSubscription.unsubscribe();
    }

  }
}