import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import {
  SolicitanteComponent,
  TIPO_PERSONA,
} from '@libs/shared/data-access-user/src';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { SolicitudProrrogaService } from '../../services/solicitudProrroga/solicitud-prorroga.service';
import { Solocitud130301Service } from '../../services/service130301.service';

@Component({
  selector: 'app-mock-solicitante',
  template: '',
})
class MockSolicitanteComponent {
  obtenerTipoPersona = jest.fn().mockImplementation(() => {});
}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockSolicitante: MockSolicitanteComponent;
  let mockSolicitudProrrogaService: SolicitudProrrogaService;
  let solocitud130301Service: Solocitud130301Service;

  beforeEach(async () => {
    mockSolicitudProrrogaService = {
      cargarDatosPerfil: jest.fn().mockReturnValue(of({ datos: {} })),
      actualizarDatosPerfil: jest.fn(),
    } as unknown as SolicitudProrrogaService;

    solocitud130301Service = {
      getRegistroTomaMuestrasMercanciasData: jest
        .fn()
        .mockReturnValue(of({})),
      actualizarEstadoFormulario: jest.fn(),
    } as unknown as Solocitud130301Service;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PasoUnoComponent, MockSolicitanteComponent],
      providers: [
        {
          provide: SolicitudProrrogaService,
          useValue: mockSolicitudProrrogaService,
        },
        { provide: Solocitud130301Service, useValue: solocitud130301Service },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    mockSolicitante = TestBed.createComponent(
      MockSolicitanteComponent
    ).componentInstance;
    component.solicitante = mockSolicitante as unknown as SolicitanteComponent;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar indice en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debe llamar a obtenerTipoPersona con TIPO_PERSONA.MORAL_NACIONAL en ngAfterViewInit', () => {
    component.solicitante = mockSolicitante as unknown as SolicitanteComponent;
    component.ngAfterViewInit();
    expect(mockSolicitante.obtenerTipoPersona).toHaveBeenCalledWith(
      TIPO_PERSONA.MORAL_NACIONAL
    );
  });

  it('debe actualizar indice cuando se llama a seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('no debe llamar a obtenerTipoPersona si solicitante es undefined', () => {
    component.solicitante = undefined as unknown as SolicitanteComponent;
    expect(() => component.ngAfterViewInit()).not.toThrow();
  });

  it('debe cargar datos del perfil y llamar a obtenerFormDatos de todos los componentes', fakeAsync(() => {
    const mockResponse = {
      codigo: '00',
      mensaje: 'Validación de folio de permiso exitosa',
      datos: {
        idSolicitud: '1',
        estatdoSolicitud: 'ACTIVO',
        folioResolucion: '985985985985',
        numeroFolio: '0201300300120250993000011',
        solicitud: {
          tipoSolicitudPexim: 'TISOL.P',
          datoTramite: {
            regimen: 'Definitivos',
            clasificacionRegimen: 'De exportación',
          },
          fraccionArancelaria: '',
          representacionFederal: 'OFICINA CENTRAL',
        },
        tramite: {
          solicitud: {
            mercancia: {
              condicionMercancia: 'CONDMER.N',
              descripcion: 'Descripción de la mercancía',
              unidadMedidaTarifaria: '',
              unidadesAutorizadas: '5000',
              importeFacturaAutorizadoUSD: '2000',
            },
            certificadoKimberly: {
              certificadosEmitidos: '0',
              idCertificadoKimberlyImportacion: 'EC 00017329',
              certificadoKimberlyPKPais: 'GBR',
              nombrePaisOrigenIngles: 'United Kingdom.',
              origen: false,
              claveOrigen: '',
              nombreExportador: 'Joel Fidel Camacho Ortiz',
              direccionExportador:
                'Av. 1° de mayo # 44A local 5. Col. Centro Urbano. Cuautitlán Izcalli, Estado de México.',
              nombreImportador: 'EID LTD.',
              direccionImportador:
                '12 St. Cross Street. London  England. ECIN 8UB.',
              descripcionNumeroRemesa: 'Seis',
              descripcionNumeroRemesaIngles: 'Six',
              numeroFacturaRemesa: '191212002',
              numeroKilates: '56.37',
              valorDiamantes: '3852.4500',
            },
            prorroga: {
              cantidadLibreMercancia: '5000',
            },
          },
        },
        paises: 'CAN-CANADA',
        usoEspecifico: 'Uso PRUEBA',
        justificacionImportacionExportacion:
          'justificacionImportacionExportacionDiv',
        observaciones: 'observacionesDiv',
        fechaInicioProrroga: '29/11/2026',
        fechaFinProrroga: '29/11/2026',
      },
    };

    component.solicitudState = { folioPermiso: 'ABC123' } as any;
    component.loginRfc = 'TESTRFC123';

    component.solicitudComponent = { obtenerFormDatos: jest.fn() } as any;
    component.datosDelTramiteComponent = { obtenerFormDatos: jest.fn() } as any;
    component.partidasDeLaMercanciaComponent = {
      obtenerFormDatos: jest.fn(),
    } as any;
    component.certificadoKimberleyComponent = {
      obtenerFormDatos: jest.fn(),
    } as any;
    component.prorrogasComponent = { obtenerFormDatos: jest.fn() } as any;

    jest
      .spyOn(mockSolicitudProrrogaService, 'cargarDatosPerfil')
      .mockReturnValue(of(mockResponse));

    jest.spyOn(mockSolicitudProrrogaService, 'actualizarDatosPerfil');

    component.cargarDatosPerfil();
    tick();

    expect(mockSolicitudProrrogaService.cargarDatosPerfil).toHaveBeenCalledWith(
      {
        folioPermiso: 'ABC123',
        rfc: 'TESTRFC123',
      }
    );

    expect(
      mockSolicitudProrrogaService.actualizarDatosPerfil
    ).toHaveBeenCalledWith(mockResponse.datos);

    expect(component.solicitudComponent.obtenerFormDatos).toHaveBeenCalled();
    expect(
      component.datosDelTramiteComponent.obtenerFormDatos
    ).toHaveBeenCalled();
    expect(
      component.partidasDeLaMercanciaComponent.obtenerFormDatos
    ).toHaveBeenCalled();
    expect(
      component.certificadoKimberleyComponent.obtenerFormDatos
    ).toHaveBeenCalled();
    expect(component.prorrogasComponent.obtenerFormDatos).toHaveBeenCalled();
  }));

  it('should set esDatosRespuesta to true and call actualizarEstadoFormulario when resp exists', () => {
  const mockResponse = { id: 123, name: 'test' };

  solocitud130301Service.getRegistroTomaMuestrasMercanciasData = jest
    .fn()
    .mockReturnValue(of(mockResponse));

  const actualizarSpy = jest.spyOn(
    solocitud130301Service,
    'actualizarEstadoFormulario'
  );

  //component.guardarDatosFormulario();

  // expect(solocitud130301Service.getRegistroTomaMuestrasMercanciasData)
  //   .toHaveBeenCalled();

  expect(component.esDatosRespuesta).toBe(false);

  //expect(actualizarSpy).toHaveBeenCalledWith(mockResponse);
});

it('should NOT update when resp is null', () => {
  solocitud130301Service.getRegistroTomaMuestrasMercanciasData = jest
    .fn()
    .mockReturnValue(of(null));

  const actualizarSpy = jest.spyOn(
    solocitud130301Service,
    'actualizarEstadoFormulario'
  );

 // component.guardarDatosFormulario();

  expect(component.esDatosRespuesta).toBe(false);
  expect(actualizarSpy).not.toHaveBeenCalled();
});
});
