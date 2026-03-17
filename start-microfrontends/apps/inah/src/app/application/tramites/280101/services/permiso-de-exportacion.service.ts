import { Solicitud280101State,Tramite280101Store } from '../../../estados/tramite/tramite280101.store';
import { Catalogo } from '@libs/shared/data-access-user/src'; // Importa la interfaz `Catalogo` para definir la estructura de los datos.
import { HttpClient } from '@angular/common/http'; // Importa el cliente HTTP para realizar solicitudes HTTP.
import { Injectable } from '@angular/core'; // Importa el decorador Injectable para inyección de dependencias.
import { Observable } from 'rxjs/internal/Observable'; // Importa la clase Observable para manejar flujos de datos asíncronos.



/**
 * Servicio para gestionar las operaciones relacionadas con el permiso de exportación.
 * 
 * Este servicio proporciona métodos para interactuar con recursos externos y manejar
 * datos relacionados con el flujo del trámite de exportación.
 * 
 * @providedIn 'any' - Define que el servicio puede ser proporcionado en cualquier módulo.
 */
@Injectable({
  providedIn: 'any',
})
export class PermisoDeExportacionService {
  /**
   * Índice utilizado para rastrear el paso actual en el flujo del trámite.
   * 
   * Este índice se actualiza dinámicamente para reflejar el progreso del usuario
   * en el proceso del trámite.
   */
  indice!: number;

  /**
   * Constructor del servicio.
   * 
   * @param http Cliente HTTP utilizado para realizar solicitudes a recursos externos.
   * Este cliente se inyecta automáticamente mediante el mecanismo de inyección de dependencias de Angular.
   */
  constructor(private http: HttpClient,private tramiteStore: Tramite280101Store) {
    // El constructor se utiliza para la inyección de dependencias.
    // Aquí se pueden inicializar variables o realizar configuraciones iniciales si es necesario.
    
  }

  /**
   * Obtiene el catálogo de aduanas desde un archivo JSON local.
   * 
   * Este método realiza una solicitud HTTP GET para recuperar los datos del catálogo
   * de aduanas desde un archivo JSON almacenado localmente.
   * 
   * @returns Un Observable que emite los datos del catálogo de aduanas en formato `Catalogo`.
   */
  getAduana(): Observable<Catalogo> {
    return this.http.get<Catalogo>('assets/json/120204/entidad-federativa.json');
  }

  /**
   * Obtiene los datos del permiso de exportación.
   *
   * Realiza una solicitud HTTP GET para recuperar la información del permiso de exportación
   * desde un archivo JSON localizado en los recursos de la aplicación.
   *
   * @returns Un Observable que emite la respuesta con los datos del permiso de exportación.
   */
  getPermisoExportacion(): Observable<Solicitud280101State> {
    return this.http.get<Solicitud280101State>('assets/json/280101/permiso-exportacion.json');
  }

 
  /**
   * Establece los datos del formulario con la información proporcionada.
   *
   * @param datos - Objeto que contiene los datos a asignar al formulario.
   */
  setDatosFormulario(datos: Solicitud280101State): void {
    this.tramiteStore.setModalidad(datos.modalidadOpcion);
    this.tramiteStore.setExposicionOpcion(datos.exposicionOpcion);
    this.tramiteStore.setNombre(datos.nombre);
    this.tramiteStore.setCantMonumentos(datos.cantMonumentos);
    this.tramiteStore.setAduana(datos.aduana);
    this.tramiteStore.setAduanaEntrada(datos.aduanaEntrada);
    this.tramiteStore.setPais(datos.pais);
    this.tramiteStore.setDescripcionClobGenerica(datos.descripcionClobGenerica);
    this.tramiteStore.setMunicipioOAlcadia(datos.municipioOAlcadia);
    this.tramiteStore.setLocalidad(datos.localidad);
    this.tramiteStore.setCodigoPostal(datos.codigoPostal);
    this.tramiteStore.setEstado(datos.estado);
    this.tramiteStore.setColonia(datos.colonia);
    this.tramiteStore.setCalle(datos.calle);
    this.tramiteStore.setNumeroExterior(datos.numeroExterior);
    this.tramiteStore.setNumeroInterior(datos.numeroInterior);
    this.tramiteStore.setMonumento(datos.monumentoTablaDatos[0]);
    }
}