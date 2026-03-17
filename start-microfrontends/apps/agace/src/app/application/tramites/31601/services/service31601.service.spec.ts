import { Solocitud31601Service } from './service31601.service';
import { Tramite31601Store, Solicitud31601State } from '../../../estados/tramites/tramite31601.store';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('Solocitud31601Service', () => {
  let service: Solocitud31601Service;
  let mockStore: any;
  let mockHttp: any;

  beforeEach(() => {
    mockStore = {};
    [
      'setAutorizacionIVAIEPS', 'setRegimen_0', 'setRegimen_1', 'setRegimen_2', 'setRegimen_3',
      'setSectorProductivo', 'setServicio', 'setPreOperativo', 'setIndiqueSi', 'setSenale',
      'setEmpPropios', 'setBimestre', 'setSenaleSi', 'setSeMomento', 'setCumplir', 'setIndique',
      'setEncuentra', 'setDelMismo', 'setSenaleMomento', 'setEnCaso', 'setComboBimestresIDCSeleccione',
      'setIngresar', 'setEncuentraSus', 'setRegistrosQue', 'setRegistrosQue2', 'setMomentoIngresar',
      'setIndiqueCuenta', 'setIndiqueCheck', 'setNombreDel', 'setLugarDeRadicacion', 'setContabilidad',
      'setRmfRadio', 'setVinculacionRegistroCancelado', 'setProveedoresListadoSAT', 'setResigtroReprestantante',
      'setRfcReprestantante', 'setNombreReprestante', 'setApellidoPaterno', 'setApellidoMaterno', 'setCargo',
      'setCuidad', 'setTelefonoReprestantante', 'setCorreoReprestantante', 'setSuplente', 'setTipoDocumento',
      'setResigtro', 'setTelefono', 'setCorreo', 'setImportaciones', 'setInfraestructuraIndique',
      'setUltimosMeses', 'setOperacionesmeses', 'setValor', 'setTransferencias', 'setTransferenciasVir',
      'setRetornos', 'setRetornosSe', 'setConstancias', 'setConstanciasDe', 'setEmpleadosPropiosRegimen',
      'setNumeroEmpleadosUno', 'setNumeroEmpleadosDos', 'setNumeroEmpleadosTres', 'setComboBimestresUno',
      'setComboBimestresDos', 'setComboBimestresTres', 'setProveedorCumplimiento', 'setDeclaracionISR',
      'setCancelacion', 'setCumplimientoReglas', 'setRecintoFiscalizado', 'setRecintoEstrategico',
      'setCumplimientoLineamientos', 'setManifieste', 'setIndiqueIva', 'setEmpleados', 'setInfraestructura',
      'setMonto', 'setAntiguedad', 'setTipoDe', 'setValorPesos', 'setDescripcion', 'setHaContado', 'setEnCasoIva','setEnlaceTablaDatos','setEstadoResidencia','setCancelacionProcedimiento','setCumpleLineamientos','setNombre','setRfcDatos','setRfcDatos', 'setIndiques', 'setCuenta', 'setMismo', 'setEmpresa',
      'setPropios', 'setEmpleadoss', 'setSocios', 'setEncuentras', 'setCumplido', 'setProcedimiento',
      'setDeterminan', 'setTransferenciasDatos', 'setTransferenciasdos', 'setRetornosDatos', 'setRetornosdos',
      'setConstanciasDatos', 'setConstanciasdos', 'setMonedaTotal', 'setPorcentajeTotal', 'setCapture',
      'setDeEmpleados', 'setBimestreDatos', 'setNumeroDeEmpleados', 'setBimestredos', 'setNumeroDatos', 'setBimestres'
    ].forEach(method => {
      mockStore[method] = jest.fn();
    });

    mockHttp = {
      get: jest.fn()
    };

    service = new Solocitud31601Service(mockHttp as any, mockStore as Tramite31601Store);
  });

  it('debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe llamar a todos los setters del store en actualizarEstadoFormulario con los tipos correctos', () => {
    const datos: Solicitud31601State = {
      nombreCompleto: 'Nombre',
      tipoDePersonaMiembro: 'Física',
      nombreMiembro: 'Juan',
      apellidoPaternoMiembro: 'Pérez',
      apellidoMaternoMiembro: 'López',
      nombreDeLaEmpresaMiembro: 'Empresa SA',
      miembrosSeleccionados: [],
      autorizacionIVAIEPS: 'aut',
      regimen_0: true,
      regimen_1: false,
      regimen_2: true,
      regimen_3: false,
      sectorProductivo: 'Industrial',
      servicio: 'Servicio',
      preOperativo: true,
      indiqueSi: false,
      senale: true,
      empPropios: '10',
      bimestre: '1',
      senaleSi: false,
      seMomento: true,
      cumplir: false,
      indique: true,
      encuentra: false,
      delMismo: true,
      senaleMomento: false,
      enCaso: true,
      comboBimestresIDCSeleccione: 'Bim1',
      ingresar: false,
      encuentraSus: true,
      registrosQue: 'Reg1',
      registrosQue2: 'Reg2',
      momentoIngresar: false,
      indiqueCuenta: true,
      nombreDel: 'Nombre',
      lugarDeRadicacion: 'Ciudad',
      contabilidad: false,
      rmfRadio: true,
      vinculacionRegistroCancelado: false,
      proveedoresListadoSAT: true,
      indiqueCheck: false,
      resigtro: 'Reg',
      telefono: '1234567890',
      correo: 'correo@dominio.com',
      manifieste: 'Manifiesto',
      indiqueIva: 'IVA',
      empleados: true,
      infraestructura: false,
      monto: true,
      antiguedad: false,
      tipoDe: 'Tipo',
      valorPesos: '1000',
      descripcion: 'Desc',
      haContado: 'Sí',
      enCasoIva: 'Caso',
      numeroOperacion: 'OP123',
      banco: 'Banco',
      llavePago: 'Llave',
      importaciones: 'Import',
      infraestructuraIndique: 'Indique',
      ultimosMeses: 'Meses',
      operacionesmeses: 'OpMeses',
      valor: 'Valor',
      transferencias: 1,
      transferenciasVir: 2,
      retornos: 3,
      retornosSe: 4,
      constancias: 5,
      constanciasDe: 6,
      empleadosPropiosRegimen: 'Regimen',
      numeroEmpleadosUno: 7,
      numeroEmpleadosDos: 8,
      numeroEmpleadosTres: 9,
      comboBimestresUno: 'Uno',
      comboBimestresDos: 'Dos',
      comboBimestresTres: 'Tres',
      proveedorCumplimiento: 'Proveedor',
      declaracionISR: 'ISR',
      cancelacion: 'Cancel',
      cumplimientoReglas: 'Reglas',
      recintoFiscalizado: 'Fiscal',
      recintoEstrategico: 'Estrategico',
      cumplimientoLineamientos: 'Lineamientos',
      squemaIntegral: 'Integral',
      sidoModificadas: 'No',
      ensucaracterde: 'Carácter',
      rfc: 'RFC123',
      obligadoaTributarenMexico: 'Sí',
      nacionalidad: 'Mexicana',
      registroFederaldeContribuyentes: 'RFC456',
      resigtroReprestantante: 'RegRep',
      rfcReprestantante: 'RFCRep',
      nombreReprestante: 'NombreRep',
      apellidoPaterno: 'Paterno',
      apellidoMaterno: 'Materno',
      cuidad: 'CDMX',
      cargo: 'Cargo',
      telefonoReprestantante: '0987654321',
      correoReprestantante: 'rep@dominio.com',
      suplente: 'Suplente',
      tipoDocumento: 'INE',
      mencioneDatos: [],
      enlaceDatos: [],
      estadoResidencia: '',
      controlInventariosDatos: [],
      cancelacionProcedimiento: '',
      cumpleLineamientos: '',
      nombre: '',
      rfcDatos: '',
      indiques: '',
      cuenta: '',
      mismo: '',
      empresa: '',
      propios: '',
      empleadoss: '',
      socios: '',
      encuentras: '',
      cumplido: '',
      procedimiento: '',
      determinan: '',
      transferenciasDatos: '',
      transferenciasdos: '',
      retornosDatos: '',
      retornosdos: '',
      constanciasDatos: '',
      constanciasdos: '',
      monedaTotal: '',
      porcentajeTotal: '',
      capture: '',
      deEmpleados: '',
      bimestreDatos: '',
      numeroDeEmpleados: '',
      bimestredos: '',
      numeroDatos: '',
      bimestres: '',
      fechaPago: '',
      acredite: '',
      principales: '',
      municipio: '',
      instalacion: '',
      federativa: '',
      registro: '',
      colonia: '',
      postal: '',
      proceso: '',
      inmueble: '',
      federativaSeleccionada: ''
    };

    service.actualizarEstadoFormulario(datos);

    Object.keys(mockStore).forEach(key => {
      expect(mockStore[key]).toHaveBeenCalled();
    });
  });

  it('debe llamar a http.get con la URL correcta en getRegistroTomaMuestrasMercanciasData', () => {
    const mockResponse = { foo: 'bar' };
    mockHttp.get.mockReturnValue(of(mockResponse));
    const obs$ = service.getRegistroTomaMuestrasMercanciasData();
    expect(mockHttp.get).toHaveBeenCalledWith('assets/json/31601/registro_toma_muestras_mercancias.json');
    obs$.subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
  });
});