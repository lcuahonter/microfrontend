import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  FormularioDinamico,
  SolicitanteComponent
} from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from '../../components/datos-del-tramite/datos-del-tramite.component';
import { Solicitud10301Service } from '../../services/solicitud10301.service';
import { Tramite10301Store } from '../../estados/tramite10301.store';

/**
 * Componente que representa el paso uno del trámite.
 */
@Component({
  selector: 'paso-uno', // Selector del componente
  templateUrl: './paso-uno.component.html', // Ruta del archivo de plantilla HTML
  standalone: true, // Indica que es un componente standalone
  imports: [SolicitanteComponent, CommonModule, DatosDelTramiteComponent, FormsModule, ReactiveFormsModule] // Importa módulos y componentes necesarios
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false; // Indica si hay datos de respuesta del servidor

  private destroyNotifier$: Subject<void> = new Subject(); // Subject para manejar la destrucción de suscripciones
  public consultaState!: ConsultaioState; // Estado de la consulta

  /**
   * Creates an instance of PasoUnoComponent.
   * 
   * @param solicitud10301Service - Servicio encargado de manejar la lógica relacionada con la solicitud 10301.
   * @param consultaQuery - Servicio utilizado para consultar el estado de la solicitud u otros datos relacionados.
   * 
   * La inicialización específica se realiza en métodos dedicados, manteniendo el constructor vacío.
   */
  constructor(
    private solicitud10301Service: Solicitud10301Service, // Servicio para manejar la solicitud
    private consultaQuery: ConsultaioQuery, // Servicio para consultar el estado
    public tramite10301Store: Tramite10301Store
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Referencia al componente de solicitante.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent; // Referencia al componente hijo Solicitante

  /**
   * Tipo de persona.
   */
  tipoPersona!: number; // Variable para almacenar el tipo de persona

  /**
   * Datos del formulario dinámico de la persona.
   */
  persona: FormularioDinamico[] = []; // Datos del formulario de persona

  /**
   * Datos del formulario dinámico del domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = []; // Datos del formulario de domicilio fiscal

  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1; // Índice de la pestaña activa

  /**
   * Método del ciclo de vida que se llama después de que las propiedades enlazadas de la directiva se inicializan.
   * 
   * - Se suscribe al observable `selectConsultaioState$` para mantener actualizado el estado local `consultaState`.
   * - Maneja la desuscripción automáticamente cuando el componente se destruye usando `takeUntil`.
   * - Si el componente está en modo actualización (`consultaState.update`), guarda los datos del formulario llamando a `guardarDatosFormulario()`.
   * - De lo contrario, establece `esDatosRespuesta` en `true` para habilitar el modo de datos de respuesta.
   */
  ngOnInit(): void {
    // Se ejecuta al inicializar el componente
    this.consultaQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyNotifier$), // Se desuscribe al destruir el componente
      map((seccionState) => {
        this.consultaState = seccionState; // Asigna el estado de la consulta
      })
    ).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario(); // Si está en modo actualización, guarda los datos del formulario
    } else {
      this.esDatosRespuesta = true; // Si no, activa el modo de datos de respuesta
    }
  }

  /**
   * Guarda los datos del formulario obteniendo la información desde el servicio y actualizando el estado del formulario.
   *
   * Este método llama a `getDatosDeTrtamitelDoc()` del `solicitud10301Service` para obtener los datos actuales.
   * Se suscribe al observable y, al recibir una respuesta, marca que hay datos de respuesta
   * y actualiza el estado del formulario usando `actualizarEstadoFormulario()`. La suscripción se elimina automáticamente
   * cuando el componente se destruye para evitar fugas de memoria.
   */
  guardarDatosFormulario(): void {
    // Método para guardar los datos del formulario
    this.solicitud10301Service
      .getDatosDeTrtamitelDoc().pipe(
        takeUntil(this.destroyNotifier$) // Se desuscribe al destruir el componente
      )
      .subscribe((respuesta) => {
        if (respuesta.success) {
          this.tramite10301Store.setManifesto(respuesta.datos.manifesto);
          this.tramite10301Store.setAduana(respuesta.datos.aduana);
          this.tramite10301Store.setNombre(respuesta.datos.nombre);
          this.tramite10301Store.setTipoMercancia(respuesta.datos.tipoMercancia);
          this.tramite10301Store.setUsoEspecifico(respuesta.datos.usoEspecifico);
          this.tramite10301Store.setMarca(respuesta.datos.marca);
          this.tramite10301Store.setModelo(respuesta.datos.modelo);
          this.tramite10301Store.setSerie(respuesta.datos.serie);
          this.tramite10301Store.setCalle(respuesta.datos.calle);
          this.tramite10301Store.setNumeroExterior(respuesta.datos.numeroExterior);
          this.tramite10301Store.setNumeroInterior(respuesta.datos.numeroInterior);
          this.tramite10301Store.setTelefono(respuesta.datos.telefono);
          this.tramite10301Store.setCorreoElectronico(respuesta.datos.correoElectronico);
          this.tramite10301Store.setCodigoPostal(respuesta.datos.codigoPostal);
          this.tramite10301Store.setEstado(respuesta.datos.estado);
          this.tramite10301Store.setColonia(respuesta.datos.colonia);
          this.tramite10301Store.setOpcion(respuesta.datos.opcion);
          this.tramite10301Store.setPais(respuesta.datos.pais);
          this.tramite10301Store.setDatosMercancia(respuesta.datos.mercanciaDatos);
        }
      });
  }

  /**
   * Selecciona la pestaña indicada por el índice.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i; // Cambia el índice de la pestaña activa
  }

  /**
   * Método del ciclo de vida que se llama cuando el componente es destruido.
   * 
   * Emite un valor y completa el subject `destroyNotifier$` para notificar y limpiar cualquier suscripción,
   * evitando fugas de memoria.
   *
   * @remarks
   * Este método forma parte de la interfaz de ciclo de vida `OnDestroy` de Angular.
   */
  ngOnDestroy(): void {
    // Se ejecuta al destruir el componente
    this.destroyNotifier$.next(); // Emite el evento de destrucción
    this.destroyNotifier$.complete(); // Completa el subject para limpiar suscripciones
  }
}
