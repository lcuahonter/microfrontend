import { Solicitud31601State, Tramite31601Store } from '../../../estados/tramites/tramite31601.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MencioneConfiguracionItem } from '../enum/mencione-tabla.enum';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de manejar la lógica relacionada con la solicitud del trámite 31601.
 * Se encarga de actualizar el estado de la solicitud en el store y de obtener datos precargados desde archivos JSON.
 */
@Injectable({
  providedIn: 'root',
})
export class Solocitud31601Service {
  /**
   * URL base del servidor principal.
   */
  urlServer = ENVIRONMENT.URL_SERVER;

  /**
   * URL base del servidor que contiene los catálogos auxiliares en formato JSON.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a servicios o archivos locales.
   * @param tramite31601Store Store personalizado para el manejo del estado del trámite 31601.
   */
  constructor(
    private http: HttpClient,
    private tramite31601Store: Tramite31601Store
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 31601.
   */
  actualizarEstadoFormulario(DATOS: Solicitud31601State): void {
    this.tramite31601Store.setAutorizacionIVAIEPS(DATOS.autorizacionIVAIEPS);
    this.tramite31601Store.setRegimen_0(DATOS.regimen_0);
    this.tramite31601Store.setRegimen_1(DATOS.regimen_1);
    this.tramite31601Store.setRegimen_2(DATOS.regimen_2);
    this.tramite31601Store.setRegimen_3(DATOS.regimen_3);
    this.tramite31601Store.setSectorProductivo(DATOS.sectorProductivo);
    this.tramite31601Store.setServicio(DATOS.servicio);
    this.tramite31601Store.setPreOperativo(DATOS.preOperativo);
    this.tramite31601Store.setIndiqueSi(DATOS.indiqueSi);
    this.tramite31601Store.setSenale(DATOS.senale);
    this.tramite31601Store.setEmpPropios(DATOS.empPropios);
    this.tramite31601Store.setBimestre(DATOS.bimestre);
    this.tramite31601Store.setSenaleSi(DATOS.senaleSi);
    this.tramite31601Store.setSeMomento(DATOS.seMomento);
    this.tramite31601Store.setCumplir(DATOS.cumplir);
    this.tramite31601Store.setIndique(DATOS.indique);
    this.tramite31601Store.setEncuentra(DATOS.encuentra);
    this.tramite31601Store.setDelMismo(DATOS.delMismo);
    this.tramite31601Store.setSenaleMomento(DATOS.senaleMomento);
    this.tramite31601Store.setEnCaso(DATOS.enCaso);
    this.tramite31601Store.setComboBimestresIDCSeleccione(DATOS.comboBimestresIDCSeleccione);
    this.tramite31601Store.setIngresar(DATOS.ingresar);
    this.tramite31601Store.setEncuentraSus(DATOS.encuentraSus);
    this.tramite31601Store.setRegistrosQue(DATOS.registrosQue);
    this.tramite31601Store.setRegistrosQue2(DATOS.registrosQue2);
    this.tramite31601Store.setMomentoIngresar(DATOS.momentoIngresar);
    this.tramite31601Store.setIndiqueCuenta(DATOS.indiqueCuenta);
    this.tramite31601Store.setIndiqueCheck(DATOS.indiqueCheck);
    this.tramite31601Store.setNombreDel(DATOS.nombreDel);
    this.tramite31601Store.setLugarDeRadicacion(DATOS.lugarDeRadicacion);
    this.tramite31601Store.setContabilidad(DATOS.contabilidad);
    this.tramite31601Store.setRmfRadio(DATOS.rmfRadio);
    this.tramite31601Store.setVinculacionRegistroCancelado(DATOS.vinculacionRegistroCancelado);
    this.tramite31601Store.setProveedoresListadoSAT(DATOS.proveedoresListadoSAT);
    this.tramite31601Store.setResigtroReprestantante(DATOS.resigtroReprestantante);
    this.tramite31601Store.setRfcReprestantante(DATOS.rfcReprestantante);
    this.tramite31601Store.setNombreReprestante(DATOS.nombreReprestante);
    this.tramite31601Store.setApellidoPaterno(DATOS.apellidoPaterno);
    this.tramite31601Store.setApellidoMaterno(DATOS.apellidoMaterno);
    this.tramite31601Store.setCargo(DATOS.cargo);
    this.tramite31601Store.setCuidad(DATOS.cuidad);
    this.tramite31601Store.setTelefonoReprestantante(DATOS.telefonoReprestantante);
    this.tramite31601Store.setCorreoReprestantante(DATOS.correoReprestantante);
    this.tramite31601Store.setSuplente(DATOS.suplente);
    this.tramite31601Store.setTipoDocumento(DATOS.tipoDocumento);
    this.tramite31601Store.setResigtro(DATOS.resigtro);
    this.tramite31601Store.setTelefono(DATOS.telefono);
    this.tramite31601Store.setCorreo(DATOS.correo);
    this.tramite31601Store.setImportaciones(DATOS.importaciones);
    this.tramite31601Store.setInfraestructuraIndique(DATOS.infraestructuraIndique);
    this.tramite31601Store.setUltimosMeses(DATOS.ultimosMeses);
    this.tramite31601Store.setOperacionesmeses(DATOS.operacionesmeses);
    this.tramite31601Store.setValor(DATOS.valor);
    this.tramite31601Store.setTransferencias(DATOS.transferencias);
    this.tramite31601Store.setTransferenciasVir(DATOS.transferenciasVir);
    this.tramite31601Store.setRetornos(DATOS.retornos);
    this.tramite31601Store.setRetornosSe(DATOS.retornosSe);
    this.tramite31601Store.setConstancias(DATOS.constancias);
    this.tramite31601Store.setConstanciasDe(DATOS.constanciasDe);
    this.tramite31601Store.setEmpleadosPropiosRegimen(DATOS.empleadosPropiosRegimen);
    this.tramite31601Store.setNumeroEmpleadosUno(DATOS.numeroEmpleadosUno);
    this.tramite31601Store.setNumeroEmpleadosDos(DATOS.numeroEmpleadosDos);
    this.tramite31601Store.setNumeroEmpleadosTres(DATOS.numeroEmpleadosTres);
    this.tramite31601Store.setComboBimestresUno(DATOS.comboBimestresUno);
    this.tramite31601Store.setComboBimestresDos(DATOS.comboBimestresDos);
    this.tramite31601Store.setComboBimestresTres(DATOS.comboBimestresTres);
    this.tramite31601Store.setProveedorCumplimiento(DATOS.proveedorCumplimiento);
    this.tramite31601Store.setDeclaracionISR(DATOS.declaracionISR);
    this.tramite31601Store.setCancelacion(DATOS.cancelacion);
    this.tramite31601Store.setCumplimientoReglas(DATOS.cumplimientoReglas);
    this.tramite31601Store.setRecintoFiscalizado(DATOS.recintoFiscalizado);
    this.tramite31601Store.setRecintoEstrategico(DATOS.recintoEstrategico);
    this.tramite31601Store.setCumplimientoLineamientos(DATOS.cumplimientoLineamientos);
    this.tramite31601Store.setManifieste(DATOS.manifieste);
    this.tramite31601Store.setIndiqueIva(DATOS.indiqueIva);
    this.tramite31601Store.setEmpleados(DATOS.empleados);
    this.tramite31601Store.setInfraestructura(DATOS.infraestructura);
    this.tramite31601Store.setMonto(DATOS.monto);
    this.tramite31601Store.setAntiguedad(DATOS.antiguedad);
    this.tramite31601Store.setTipoDe(DATOS.tipoDe);
    this.tramite31601Store.setValorPesos(DATOS.valorPesos);
    this.tramite31601Store.setDescripcion(DATOS.descripcion);
    this.tramite31601Store.setHaContado(DATOS.haContado);
    this.tramite31601Store.setEnCasoIva(DATOS.enCasoIva);
    this.tramite31601Store.setEnlaceTablaDatos([{
        id: '1',
        rfc: DATOS.rfcReprestantante || '',
        nombre: DATOS.nombreReprestante || '',
        apellidoPaterno: DATOS.apellidoPaterno || '',
        apellidoMaterno: DATOS.apellidoMaterno || '',
        cargo: DATOS.cargo || '',
        telefono: DATOS.telefonoReprestantante || '',
        correo: DATOS.correoReprestantante || '',
        suplente: DATOS.suplente || '',
        estadoResidencia: DATOS.estadoResidencia || '',
        registroFederal : DATOS.registroFederaldeContribuyentes || '',
    }]);
    this.tramite31601Store.setEstadoResidencia(DATOS.estadoResidencia);
this.tramite31601Store.setCancelacionProcedimiento(DATOS.cancelacionProcedimiento);
this.tramite31601Store.setCumpleLineamientos(DATOS.cumpleLineamientos);
this.tramite31601Store.setNombre(DATOS.nombre);
this.tramite31601Store.setRfcDatos(DATOS.rfcDatos);
this.tramite31601Store.setIndiques(DATOS.indiques);
this.tramite31601Store.setCuenta(DATOS.cuenta);
this.tramite31601Store.setMismo(DATOS.mismo);
this.tramite31601Store.setEmpresa(DATOS.empresa);
this.tramite31601Store.setPropios(DATOS.propios);
this.tramite31601Store.setEmpleadoss(DATOS.empleadoss);
this.tramite31601Store.setSocios(DATOS.socios);
this.tramite31601Store.setEncuentras(DATOS.encuentras);
this.tramite31601Store.setCumplido(DATOS.cumplido);
this.tramite31601Store.setProcedimiento(DATOS.procedimiento);
this.tramite31601Store.setDeterminan(DATOS.determinan);
this.tramite31601Store.setTransferenciasDatos(DATOS.transferenciasDatos);
this.tramite31601Store.setTransferenciasdos(DATOS.transferenciasdos);
this.tramite31601Store.setRetornosDatos(DATOS.retornosDatos);
this.tramite31601Store.setRetornosdos(DATOS.retornosdos);
this.tramite31601Store.setConstanciasDatos(DATOS.constanciasDatos);
this.tramite31601Store.setConstanciasdos(DATOS.constanciasdos);
this.tramite31601Store.setMonedaTotal(DATOS.monedaTotal);
this.tramite31601Store.setPorcentajeTotal(DATOS.porcentajeTotal);
this.tramite31601Store.setCapture(DATOS.capture);
this.tramite31601Store.setDeEmpleados(DATOS.deEmpleados);
this.tramite31601Store.setBimestreDatos(DATOS.bimestreDatos);
this.tramite31601Store.setNumeroDeEmpleados(DATOS.numeroDeEmpleados);
this.tramite31601Store.setBimestredos(DATOS.bimestredos);
this.tramite31601Store.setNumeroDatos(DATOS.numeroDatos);
this.tramite31601Store.setBimestres(DATOS.bimestres);

  }

  /**
   * Obtiene los datos precargados desde un archivo JSON relacionado con el registro de toma de muestras de mercancías.
   * Este archivo contiene información que se puede utilizar para precargar el estado del formulario.
   * 
   * @returns Observable con la estructura del estado de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud31601State> {
    return this.http.get<Solicitud31601State>('assets/json/31601/registro_toma_muestras_mercancias.json');
  }

  /**
   * Obtiene los datos de configuración de menciones desde un archivo JSON.
   * Este archivo contiene una lista de menciones que se pueden utilizar en el trámite 31601.
   * */
  getMencioneDatos(): Observable<MencioneConfiguracionItem[]> {
    return this.http.get<MencioneConfiguracionItem[]>('assets/json/31601/mencione.json');
  }
}
