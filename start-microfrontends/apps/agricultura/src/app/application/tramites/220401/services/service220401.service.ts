import { Agregar220401Store, Solicitud220401State } from '../../../estados/tramites/agregar220401.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Solocitud220401Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient, private tramite301Store: Agregar220401Store,) {
    // Lógica de inicialización si es necesario
  }

  actualizarEstadoFormulario(DATOS: Solicitud220401State): void {
    this.tramite301Store.setCertificada(DATOS.certificada);
    this.tramite301Store.setidentificationDelTransporte(DATOS.identificationDelTransporte);
    this.tramite301Store.setJustificacion(DATOS.Justificacion);
    this.tramite301Store.setnumerodeContenedor(DATOS.numerodeContenedor);
    this.tramite301Store.setfetchdeEmbarque(DATOS.fechdeEmbarque);
    this.tramite301Store.setnumerodeFlejes(DATOS.numerodeFlejes);
    this.tramite301Store.setdatoscertificado(DATOS.datoscertificado);
    this.tramite301Store.setfraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite301Store.setfechaCaducidad(DATOS.fechaCaducidad);
    this.tramite301Store.setnombreIdentificacion(DATOS.nombreIdentificacion);
    this.tramite301Store.setraza(DATOS.raza);
    this.tramite301Store.setedadAnimal(DATOS.edadAnimal);
    this.tramite301Store.setcolor(DATOS.color);
    this.tramite301Store.setnumeroAutorizacionCITES(DATOS.numeroAutorizacionCITES);
    this.tramite301Store.setaduana(DATOS.aduana);
    this.tramite301Store.setosia(DATOS.osia);
    this.tramite301Store.setsexo(DATOS.sexo);
    this.tramite301Store.setotro(DATOS.otro);
    this.tramite301Store.setpuntoIngreso(DATOS.puntoIngreso);
    this.tramite301Store.setnombreEstablecimientoCheck(DATOS.nombreEstablecimientoCheck);
    this.tramite301Store.setnumeroAutorizacionCheck(DATOS.numeroAutorizacionCheck);
    this.tramite301Store.settipoActividadCheck(DATOS.tipoActividadCheck);
    this.tramite301Store.setotroCheck(DATOS.otroCheck);
    this.tramite301Store.setfechaArribo(DATOS.fechaArribo);
    this.tramite301Store.setexentoDePago(DATOS.exentoDePago);
    this.tramite301Store.setllaveDePago(DATOS.llaveDePago);
    this.tramite301Store.setfechaPago(DATOS.fechaPago);
    this.tramite301Store.setBanco(DATOS.Banco);
    this.tramite301Store.setespecie(DATOS.especie);
    this.tramite301Store.setfuncionZootecnica(DATOS.funcionZootecnica);
    this.tramite301Store.setmercancia(DATOS.mercancia);
    this.tramite301Store.setpaisDestino(DATOS.paisDestino);
    this.tramite301Store.setnombreEstablecimiento(DATOS.nombreEstablecimiento);
    this.tramite301Store.settipoActividad(DATOS.tipoActividad);
    this.tramite301Store.setaduanaSalida(DATOS.aduanaSalida);
    this.tramite301Store.setoisaSalida(DATOS.oisaSalida);
    this.tramite301Store.setregimenMercancia(DATOS.regimenMercancia);
    this.tramite301Store.setpaisOrigen(DATOS.paisOrigen);
    this.tramite301Store.setexentoPago(DATOS.exentoPago);
    this.tramite301Store.setTratamiento(DATOS.tratamiento);
    this.tramite301Store.settipoDeTransporte(DATOS.tipoDeTransporte);
    this.tramite301Store.setPresentacion(DATOS.presentacion);  
  }

  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud220401State> {
    return this.http.get<Solicitud220401State>('assets/json/220401/serviciosExtraordinarios.json');
  }

}
