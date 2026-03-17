import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoUnoComponent } from './paso-uno.component';
import { of } from 'rxjs';
import { Component } from '@angular/core';

@Component({selector: 'solicitante', template: ''})
class MockSolicitanteComponent {}

class MockSolicitud32604Store {
  actualizarIdPersonaSolicitud = jest.fn();
  actualizarRfcTercero = jest.fn();
  actualizarRfc = jest.fn();
  actualizarNombre = jest.fn();
  actualizarApellidoPaterno = jest.fn();
  actualizarApellidoMaterno = jest.fn();
  actualizarTelefono = jest.fn();
  actualizarCorreoElectronico = jest.fn();
  actualizarEnlaceRfcTercero = jest.fn();
  actualizarEnlaceRfc = jest.fn();
  actualizarEnlaceNombre = jest.fn();
  actualizarEnlaceApellidoPaterno = jest.fn();
  actualizarEnlaceApellidoMaterno = jest.fn();
  actualizarEnlaceCiudadEstado = jest.fn();
  actualizarEnlaceCargo = jest.fn();
  actualizarEnlaceTelefono = jest.fn();
  actualizarEnlaceCorreoElectronico = jest.fn();
  actualizarEnlaceSuplente = jest.fn();
  actualizar2089 = jest.fn();
  actualizar2090 = jest.fn();
  actualizar2091 = jest.fn();
  actualizar2042 = jest.fn();
  actualizar2043 = jest.fn();
  actualizar2044 = jest.fn();
  actualizarFechaInicioComercio = jest.fn();
  actualizarFechaPago = jest.fn();
  actualizarMonto = jest.fn();
  actualizarOperacionesBancarias = jest.fn();
  actualizarLlavePago = jest.fn();
  actualizarTransportistaRFC = jest.fn();
  actualizarTransportistaRFCModifTrans = jest.fn();
  actualizarTransportistaRazonSocial = jest.fn();
  actualizarTransportistaDomicilio = jest.fn();
  actualizarTransportistaCaat = jest.fn();
  actualizarTransportistaIdDomicilio = jest.fn();
  actualizarTransportistaIdRFC = jest.fn();
  actualizarTransportistaIdRazonSocial = jest.fn();
  actualizarTransportistaIdCaat = jest.fn();
  actualizarMiembroCaracterDe = jest.fn();
  actualizarMiembroTributarMexico = jest.fn();
  actualizarMiembroNacionalidad = jest.fn();
  actualizarMiembroRFC = jest.fn();
  actualizarMiembroRegistroFederal = jest.fn();
  actualizarMiembroNombreCompleto = jest.fn();
  actualizarMiembroTipoPersonaMuestra = jest.fn();
  actualizarMiembroNombre = jest.fn();
  actualizarMiembroApellidoPaterno = jest.fn();
  actualizarMiembroApellidoMaterno = jest.fn();
  actualizarMiembroNombreEmpresa = jest.fn();
  actualizarSubcontrataRFCBusqueda = jest.fn();
  actualizarSubcontrataRFC = jest.fn();
  actualizarSubcontrataRazonSocial = jest.fn();
  actualizarSubcontrataEmpleados = jest.fn();
  actualizarSubcontrataBimestre = jest.fn();
  actualizarPrincipales = jest.fn();
  actualizarMunicipio = jest.fn();
  actualizarTipoDeInstalacion = jest.fn();
  actualizarEntidadFederativa = jest.fn();
  actualizarRegistroSESAT = jest.fn();
  actualizarDescripcion = jest.fn();
  actualizarCodigoPostal = jest.fn();
  actualizarProcesoProductivo = jest.fn();
  actualizarGoceDelInmueble = jest.fn();
  actualizarEmpresa = jest.fn();
  actualizarComercioExterior = jest.fn();
  actualizarMutuo = jest.fn();
  actualizarCatseleccionados = jest.fn();
  actualizarServicio = jest.fn();
  actualizar190 = jest.fn();
  actualizar191 = jest.fn();
  actualizar199 = jest.fn();
  actualizarEmpleados = jest.fn();
  actualizarBimestre = jest.fn();
  actualizar2034 = jest.fn();
  actualizar236 = jest.fn();
  actualizar237 = jest.fn();
  actualizar238 = jest.fn();
  actualizar239 = jest.fn();
  actualizar240 = jest.fn();
  actualizar243 = jest.fn();
  actualizar244 = jest.fn();
  actualizar245 = jest.fn();
  actualizarIndiqueTodos = jest.fn();
  actualizar246 = jest.fn();
  actualizarFile1 = jest.fn();
  actualizarFile2 = jest.fn();
  actualizar247 = jest.fn();
  actualizar248 = jest.fn();
  actualizarIdentificacion = jest.fn();
  actualizarLugarDeRadicacion = jest.fn();
  actualizar249 = jest.fn();
  actualizar250 = jest.fn();
  actualizar251 = jest.fn();
  actualizarCheckbox1 = jest.fn();
  actualizarCheckbox2 = jest.fn();
  actualizarCheckbox3 = jest.fn();
  actualizarActualmente2 = jest.fn();
  actualizarActualmente1 = jest.fn();
}
class MockConsultaioQuery {
  selectConsultaioState$ = of({ update: false });
}
interface IEmpresasComercializadorasService {
  guardarDatosFormulario: (...args: any[]) => any;
}

class MockEmpresasComercializadorasService implements IEmpresasComercializadorasService {
  guardarDatosFormulario() { return { pipe: () => ({ subscribe: () => {} }) }; }
}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent, MockSolicitanteComponent],
      imports: [require('@angular/common').CommonModule],
      providers: [
        { provide: require('../../estados/solicitud32604.store').Solicitud32604Store, useClass: MockSolicitud32604Store },
        { provide: require('@ng-mf/data-access-user').ConsultaioQuery, useClass: MockConsultaioQuery },
        { provide: require('../../services/empresas-comercializadoras.service').EmpresasComercializadorasService, useClass: MockEmpresasComercializadorasService }
      ],
      schemas: [require('@angular/core').NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call guardarDatosFormulario and update store and esDatosRespuesta', () => {
    const mockForm = {
      idPersonaSolicitud: 'id1',
      rfcTercero: 'rfcT',
      rfc: 'rfc',
      nombre: 'nombre',
      apellidoPaterno: 'apPat',
      apellidoMaterno: 'apMat',
      telefono: 'tel',
      correoElectronico: 'mail',
      agregarEnlaceRfcTercero: 'enlace1',
      agregarEnlaceRfc: 'enlace2',
      agregarEnlaceNombre: 'enlace3',
      agregarEnlaceApellidoPaterno: 'enlace4',
      agregarEnlaceApellidoMaterno: 'enlace5',
      agregarEnlaceCiudadEstado: 'enlace6',
      agregarEnlaceCargo: 'enlace7',
      agregarEnlaceTelefono: 'enlace8',
      agregarEnlaceCorreoElectronico: 'enlace9',
      agregarEnlaceSuplente: true,
      '2089': 1,
      '2090': 2,
      '2091': 3,
      '2042': 4,
      '2043': 5,
      '2044': 6,
      fechaInicioComercio: 'fecha1',
      fechaPago: 'fecha2',
      monto: '100',
      operacionesBancarias: 'op',
      llavePago: 'llave',
      transportistaRFC: 'trfc',
      transportistaRFCModifTrans: 'trfcmod',
      transportistaRazonSocial: 'trs',
      transportistaDomicilio: 'tdom',
      transportistaCaat: 'tcaat',
      transportistaIdDomicilio: 'tidom',
      transportistaIdRFC: 'tirfc',
      transportistaIdRazonSocial: 'tirs',
      transportistaIdCaat: 'ticaat',
      miembroCaracterDe: 'carac',
      miembroTributarMexico: 1,
      miembroNacionalidad: 'nac',
      miembroRfc: 'mrfc',
      miembroRegistroFederal: 'mrf',
      miembroNombreCompleto: 'mnc',
      miembroTipoPersonaMuestra: 'mtp',
      miembroNombre: 'mn',
      miembroApellidoPaterno: 'map',
      miembroApellidoMaterno: 'mam',
      miembroNombreEmpresa: 'mne',
      subcontrataRFCBusqueda: 'subrfc',
      subcontrataRFC: 'subrfc2',
      subcontrataRazonSocial: 'subrs',
      subcontrataEmpleados: 'subemp',
      subcontrataBimestre: 2,
      principales: 3,
      municipio: 'mun',
      tipoDeInstalacion: 4,
      entidadFederativa: 'ent',
      registroSESAT: 'reg',
      descripcion: 'desc',
      codigoPostal: 'cp',
      procesoProductivo: 5,
      goceDelInmueble: 6,
      empresa: 7,
      comercioExterior: 8,
      mutuo: 9,
      catseleccionados: 10,
      servicio: 11,
      '190': 12,
      '191': 13,
      '199': 14,
      empleados: 'emps',
      bimestre: 15,
      '2034': 16,
      '236': 17,
      '237': 18,
      '238': 19,
      '239': 20,
      '240': 21,
      '243': 22,
      '244': 23,
      '245': 24,
      indiqueTodos: 25,
      '246': 26,
      file1: 'file1',
      file2: 'file2',
      '247': 27,
      '248': 28,
      identificacion: 'ident',
      lugarDeRadicacion: 'lugar',
      '249': 29,
      '250': 30,
      '251': 31,
      checkbox1: true,
      checkbox2: false,
      checkbox3: true,
      actualmente2: 'act2',
      actualmente1: 'act1',
    };
    const mockResp = { datos: { solicitudFormulario: mockForm } };
    const mockService = TestBed.inject(require('../../services/empresas-comercializadoras.service').EmpresasComercializadorasService) as IEmpresasComercializadorasService;
      jest.spyOn(mockService, 'guardarDatosFormulario').mockReturnValue({
        pipe: () => ({
          subscribe: (fn: any) => fn(mockResp)
        })
      });
    const store = component.store;
    // Espiar todos los métodos de actualización de la tienda
    Object.keys(mockForm).forEach((key) => {
      const methodName = {
        'idPersonaSolicitud': 'actualizarIdPersonaSolicitud',
        'rfcTercero': 'actualizarRfcTercero',
        'rfc': 'actualizarRfc',
        'nombre': 'actualizarNombre',
        'apellidoPaterno': 'actualizarApellidoPaterno',
        'apellidoMaterno': 'actualizarApellidoMaterno',
        'telefono': 'actualizarTelefono',
        'correoElectronico': 'actualizarCorreoElectronico',
        'agregarEnlaceRfcTercero': 'actualizarEnlaceRfcTercero',
        'agregarEnlaceRfc': 'actualizarEnlaceRfc',
        'agregarEnlaceNombre': 'actualizarEnlaceNombre',
        'agregarEnlaceApellidoPaterno': 'actualizarEnlaceApellidoPaterno',
        'agregarEnlaceApellidoMaterno': 'actualizarEnlaceApellidoMaterno',
        'agregarEnlaceCiudadEstado': 'actualizarEnlaceCiudadEstado',
        'agregarEnlaceCargo': 'actualizarEnlaceCargo',
        'agregarEnlaceTelefono': 'actualizarEnlaceTelefono',
        'agregarEnlaceCorreoElectronico': 'actualizarEnlaceCorreoElectronico',
        'agregarEnlaceSuplente': 'actualizarEnlaceSuplente',
        '2089': 'actualizar2089',
        '2090': 'actualizar2090',
        '2091': 'actualizar2091',
        '2042': 'actualizar2042',
        '2043': 'actualizar2043',
        '2044': 'actualizar2044',
        'fechaInicioComercio': 'actualizarFechaInicioComercio',
        'fechaPago': 'actualizarFechaPago',
        'monto': 'actualizarMonto',
        'operacionesBancarias': 'actualizarOperacionesBancarias',
        'llavePago': 'actualizarLlavePago',
        'transportistaRFC': 'actualizarTransportistaRFC',
        'transportistaRFCModifTrans': 'actualizarTransportistaRFCModifTrans',
        'transportistaRazonSocial': 'actualizarTransportistaRazonSocial',
        'transportistaDomicilio': 'actualizarTransportistaDomicilio',
        'transportistaCaat': 'actualizarTransportistaCaat',
        'transportistaIdDomicilio': 'actualizarTransportistaIdDomicilio',
        'transportistaIdRFC': 'actualizarTransportistaIdRFC',
        'transportistaIdRazonSocial': 'actualizarTransportistaIdRazonSocial',
        'transportistaIdCaat': 'actualizarTransportistaIdCaat',
        'miembroCaracterDe': 'actualizarMiembroCaracterDe',
        'miembroTributarMexico': 'actualizarMiembroTributarMexico',
        'miembroNacionalidad': 'actualizarMiembroNacionalidad',
        'miembroRfc': 'actualizarMiembroRFC',
        'miembroRegistroFederal': 'actualizarMiembroRegistroFederal',
        'miembroNombreCompleto': 'actualizarMiembroNombreCompleto',
        'miembroTipoPersonaMuestra': 'actualizarMiembroTipoPersonaMuestra',
        'miembroNombre': 'actualizarMiembroNombre',
        'miembroApellidoPaterno': 'actualizarMiembroApellidoPaterno',
        'miembroApellidoMaterno': 'actualizarMiembroApellidoMaterno',
        'miembroNombreEmpresa': 'actualizarMiembroNombreEmpresa',
        'subcontrataRFCBusqueda': 'actualizarSubcontrataRFCBusqueda',
        'subcontrataRFC': 'actualizarSubcontrataRFC',
        'subcontrataRazonSocial': 'actualizarSubcontrataRazonSocial',
        'subcontrataEmpleados': 'actualizarSubcontrataEmpleados',
        'subcontrataBimestre': 'actualizarSubcontrataBimestre',
        'principales': 'actualizarPrincipales',
        'municipio': 'actualizarMunicipio',
        'tipoDeInstalacion': 'actualizarTipoDeInstalacion',
        'entidadFederativa': 'actualizarEntidadFederativa',
        'registroSESAT': 'actualizarRegistroSESAT',
        'descripcion': 'actualizarDescripcion',
        'codigoPostal': 'actualizarCodigoPostal',
        'procesoProductivo': 'actualizarProcesoProductivo',
        'goceDelInmueble': 'actualizarGoceDelInmueble',
        'empresa': 'actualizarEmpresa',
        'comercioExterior': 'actualizarComercioExterior',
        'mutuo': 'actualizarMutuo',
        'catseleccionados': 'actualizarCatseleccionados',
        'servicio': 'actualizarServicio',
        '190': 'actualizar190',
        '191': 'actualizar191',
        '199': 'actualizar199',
        'empleados': 'actualizarEmpleados',
        'bimestre': 'actualizarBimestre',
        '2034': 'actualizar2034',
        '236': 'actualizar236',
        '237': 'actualizar237',
        '238': 'actualizar238',
        '239': 'actualizar239',
        '240': 'actualizar240',
        '243': 'actualizar243',
        '244': 'actualizar244',
        '245': 'actualizar245',
        'indiqueTodos': 'actualizarIndiqueTodos',
        '246': 'actualizar246',
        'file1': 'actualizarFile1',
        'file2': 'actualizarFile2',
        '247': 'actualizar247',
        '248': 'actualizar248',
        'identificacion': 'actualizarIdentificacion',
        'lugarDeRadicacion': 'actualizarLugarDeRadicacion',
        '249': 'actualizar249',
        '250': 'actualizar250',
        '251': 'actualizar251',
        'checkbox1': 'actualizarCheckbox1',
        'checkbox2': 'actualizarCheckbox2',
        'checkbox3': 'actualizarCheckbox3',
        'actualmente2': 'actualizarActualmente2',
        'actualmente1': 'actualizarActualmente1',
      }[key];
      if (methodName && (store as any)[methodName]) {
        jest.spyOn(store as any, methodName);
      }
    });

    component.guardarDatosFormulario();

    expect(component.esDatosRespuesta).toBe(true);
    Object.keys(mockForm).forEach((key) => {
      const methodName = {
        'idPersonaSolicitud': 'actualizarIdPersonaSolicitud',
        'rfcTercero': 'actualizarRfcTercero',
        'rfc': 'actualizarRfc',
        'nombre': 'actualizarNombre',
        'apellidoPaterno': 'actualizarApellidoPaterno',
        'apellidoMaterno': 'actualizarApellidoMaterno',
        'telefono': 'actualizarTelefono',
        'correoElectronico': 'actualizarCorreoElectronico',
        'agregarEnlaceRfcTercero': 'actualizarEnlaceRfcTercero',
        'agregarEnlaceRfc': 'actualizarEnlaceRfc',
        'agregarEnlaceNombre': 'actualizarEnlaceNombre',
        'agregarEnlaceApellidoPaterno': 'actualizarEnlaceApellidoPaterno',
        'agregarEnlaceApellidoMaterno': 'actualizarEnlaceApellidoMaterno',
        'agregarEnlaceCiudadEstado': 'actualizarEnlaceCiudadEstado',
        'agregarEnlaceCargo': 'actualizarEnlaceCargo',
        'agregarEnlaceTelefono': 'actualizarEnlaceTelefono',
        'agregarEnlaceCorreoElectronico': 'actualizarEnlaceCorreoElectronico',
        'agregarEnlaceSuplente': 'actualizarEnlaceSuplente',
        '2089': 'actualizar2089',
        '2090': 'actualizar2090',
        '2091': 'actualizar2091',
        '2042': 'actualizar2042',
        '2043': 'actualizar2043',
        '2044': 'actualizar2044',
        'fechaInicioComercio': 'actualizarFechaInicioComercio',
        'fechaPago': 'actualizarFechaPago',
        'monto': 'actualizarMonto',
        'operacionesBancarias': 'actualizarOperacionesBancarias',
        'llavePago': 'actualizarLlavePago',
        'transportistaRFC': 'actualizarTransportistaRFC',
        'transportistaRFCModifTrans': 'actualizarTransportistaRFCModifTrans',
        'transportistaRazonSocial': 'actualizarTransportistaRazonSocial',
        'transportistaDomicilio': 'actualizarTransportistaDomicilio',
        'transportistaCaat': 'actualizarTransportistaCaat',
        'transportistaIdDomicilio': 'actualizarTransportistaIdDomicilio',
        'transportistaIdRFC': 'actualizarTransportistaIdRFC',
        'transportistaIdRazonSocial': 'actualizarTransportistaIdRazonSocial',
        'transportistaIdCaat': 'actualizarTransportistaIdCaat',
        'miembroCaracterDe': 'actualizarMiembroCaracterDe',
        'miembroTributarMexico': 'actualizarMiembroTributarMexico',
        'miembroNacionalidad': 'actualizarMiembroNacionalidad',
        'miembroRfc': 'actualizarMiembroRFC',
        'miembroRegistroFederal': 'actualizarMiembroRegistroFederal',
        'miembroNombreCompleto': 'actualizarMiembroNombreCompleto',
        'miembroTipoPersonaMuestra': 'actualizarMiembroTipoPersonaMuestra',
        'miembroNombre': 'actualizarMiembroNombre',
        'miembroApellidoPaterno': 'actualizarMiembroApellidoPaterno',
        'miembroApellidoMaterno': 'actualizarMiembroApellidoMaterno',
        'miembroNombreEmpresa': 'actualizarMiembroNombreEmpresa',
        'subcontrataRFCBusqueda': 'actualizarSubcontrataRFCBusqueda',
        'subcontrataRFC': 'actualizarSubcontrataRFC',
        'subcontrataRazonSocial': 'actualizarSubcontrataRazonSocial',
        'subcontrataEmpleados': 'actualizarSubcontrataEmpleados',
        'subcontrataBimestre': 'actualizarSubcontrataBimestre',
        'principales': 'actualizarPrincipales',
        'municipio': 'actualizarMunicipio',
        'tipoDeInstalacion': 'actualizarTipoDeInstalacion',
        'entidadFederativa': 'actualizarEntidadFederativa',
        'registroSESAT': 'actualizarRegistroSESAT',
        'descripcion': 'actualizarDescripcion',
        'codigoPostal': 'actualizarCodigoPostal',
        'procesoProductivo': 'actualizarProcesoProductivo',
        'goceDelInmueble': 'actualizarGoceDelInmueble',
        'empresa': 'actualizarEmpresa',
        'comercioExterior': 'actualizarComercioExterior',
        'mutuo': 'actualizarMutuo',
        'catseleccionados': 'actualizarCatseleccionados',
        'servicio': 'actualizarServicio',
        '190': 'actualizar190',
        '191': 'actualizar191',
        '199': 'actualizar199',
        'empleados': 'actualizarEmpleados',
        'bimestre': 'actualizarBimestre',
        '2034': 'actualizar2034',
        '236': 'actualizar236',
        '237': 'actualizar237',
        '238': 'actualizar238',
        '239': 'actualizar239',
        '240': 'actualizar240',
        '243': 'actualizar243',
        '244': 'actualizar244',
        '245': 'actualizar245',
        'indiqueTodos': 'actualizarIndiqueTodos',
        '246': 'actualizar246',
        'file1': 'actualizarFile1',
        'file2': 'actualizarFile2',
        '247': 'actualizar247',
        '248': 'actualizar248',
        'identificacion': 'actualizarIdentificacion',
        'lugarDeRadicacion': 'actualizarLugarDeRadicacion',
        '249': 'actualizar249',
        '250': 'actualizar250',
        '251': 'actualizar251',
        'checkbox1': 'actualizarCheckbox1',
        'checkbox2': 'actualizarCheckbox2',
        'checkbox3': 'actualizarCheckbox3',
        'actualmente2': 'actualizarActualmente2',
        'actualmente1': 'actualizarActualmente1',
      }[key];
      if (methodName && (store as any)[methodName]) {
        expect((store as any)[methodName]).toHaveBeenCalledWith(mockForm[key as keyof typeof mockForm]);
      }
    });
  });
});
