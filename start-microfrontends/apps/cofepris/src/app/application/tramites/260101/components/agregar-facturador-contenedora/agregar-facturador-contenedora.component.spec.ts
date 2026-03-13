import { TestBed } from '@angular/core/testing';
import { AgregarFacturadorContenedoraComponent } from './agregar-facturador-contenedora.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  Tramite260101Store,
  Tramite260101State,
} from '../../estados/tramite260101Store.store';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';
import { Facturador } from '../../../../shared/models/terceros-relacionados.model';
import { TABLA_OPCION_DATA } from '../../../../shared/constantes/datos-solicitud.enum';
import { CommonModule } from '@angular/common';
import { AgregarFacturadorComponent } from '../../../../shared/components/agregar-facturador/agregar-facturador.component';
import {
  HttpClientTestingModule,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('AgregarFacturadorContenedoraComponent', () => {
  let component: AgregarFacturadorContenedoraComponent;
  let fixture: any;
  let mockStore: jest.Mocked<Tramite260101Store>;
  let mockQuery: Partial<Tramite260101Query>;
  let mockActivatedRoute: any;

  const mockState: Tramite260101State = {
    facturadorTablaDatos: [
      {
        nacionalidad: 'Mexicana',
        tipoPersona: 'Física',
        nombreRazonSocial: 'Juan Pérez López',
        rfc: 'PELJ800101XXX',
        curp: 'PELJ800101HDFLRN09',
        telefono: '5544332211',
        correoElectronico: 'juan.perez@example.com',
        calle: 'Av. Insurgentes Sur',
        numeroExterior: '1234',
        numeroInterior: '5B',
        pais: 'México',
        colonia: 'Del Valle',
        municipioAlcaldia: 'Benito Juárez',
        localidad: 'Ciudad de México',
        entidadFederativa: 'CDMX',
        estadoLocalidad: 'Ciudad de México',
        codigoPostal: '03100',
        coloniaEquivalente: 'Col. Del Valle Centro',
        nombres: 'Juan',
        primerApellido: 'Pérez',
        segundoApellido: 'López',
        razonSocial: 'Servicios Pérez S.A. de C.V.',
        lada: '55',
      },
    ],
    facturadorTablaModificaDatos: [
      {
        nacionalidad: 'Mexicana',
        tipoPersona: 'Física',
        nombreRazonSocial: 'Juan Pérez López',
        rfc: 'PELJ800101XXX',
        curp: 'PELJ800101HDFLRN09',
        telefono: '5544332211',
        correoElectronico: 'juan.perez@example.com',
        calle: 'Av. Insurgentes Sur',
        numeroExterior: '1234',
        numeroInterior: '5B',
        pais: 'México',
        colonia: 'Del Valle',
        municipioAlcaldia: 'Benito Juárez',
        localidad: 'Ciudad de México',
        entidadFederativa: 'CDMX',
        estadoLocalidad: 'Ciudad de México',
        codigoPostal: '03100',
        coloniaEquivalente: 'Col. Del Valle Centro',
        nombres: 'Juan',
        primerApellido: 'Pérez',
        segundoApellido: 'López',
        razonSocial: 'Servicios Pérez S.A. de C.V.',
        lada: '55',
      },
    ],
    destinatarioFinalTablaDatos: [],
    proveedorTablaDatos: [],
    fabricanteTablaDatos: [],
    destinatarioFinalTablaModificaDatos: [],
    proveedorTablaModificaDatos: [],
    fabricanteTablaModificaDatos: [],
    datosSolicitudFormState: {
      rfcSanitario: '',
      denominacionRazon: '',
      correoElectronico: '',
      codigoPostal: '',
      estado: '',
      municipioAlcaldia: '',
      localidad: '',
      colonia: '',
      calle: '',
      lada: '',
      telefono: '',
      aviso: '',
      licenciaSanitaria: '',
      regimen: '',
      adunasDeEntradas: '',
      aeropuerto: false,
      publico: 'si',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      manifiestosCasillaDeVerificacion: false,
    },
    mercanciaForm: {
      clasificacionProducto: '',
      especificarClasificacionProducto: '',
      denominacionEspecificaProducto: '',
      denominacionDistintiva: '',
      denominacionComun: '',
      tipoProducto: '',
      formaFarmaceutica: '',
      estadoFisico: '',
      fraccionArancelaria: '',
      descripcionFraccion: '',
      cantidadUmtValor: '',
      cantidadUmt: '',
      cantidadUmcValor: '',
      cantidadUmc: '',
      presentacion: '',
      numeroRegistroSanitario: '',
      fechaCaducidad: '',
      paisDeOriginDatos: [],
      paisDeProcedenciaDatos: [],
    },
    opcionConfigDatos: TABLA_OPCION_DATA,
    scianConfigDatos: [],
    tablaMercanciasConfigDatos: [],
    seleccionadoopcionDatos: [],
    seleccionadoScianDatos: [],
    seleccionadoTablaMercanciasDatos: [],
    opcionesColapsableState: false,
    pagoDerechos: {
      claveReferencia: '',
      cadenaDependencia: '',
      estado: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    },
    tabSeleccionado: 1,
  };

  beforeEach(async () => {
    mockStore = {
      updateFacturadorTablaDatos: jest.fn(),
    } as any;

    mockQuery = {
      selectTramiteState$: of(mockState),
    };

    mockActivatedRoute = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [
        AgregarFacturadorContenedoraComponent,
        CommonModule,
        HttpClientTestingModule,
        AgregarFacturadorComponent,
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: Tramite260101Store, useValue: mockStore },
        { provide: Tramite260101Query, useValue: mockQuery },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarFacturadorContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteState and facturadorTablaDatos from query', () => {
    expect(component.tramiteState).toEqual(mockState);
    expect(component.facturadorTablaDatos).toEqual(
      mockState.facturadorTablaDatos
    );
  });

  it('should clear facturadorTablaDatos when update param is "false"', () => {
    mockActivatedRoute.queryParams = of({ update: 'false' });
    component.ngOnInit();
    expect(component.facturadorTablaDatos).toEqual([]);
  });

  it('should set facturadorTablaDatos to facturadorTablaModificaDatos when update param is "true"', () => {
    component.tramiteState = mockState;
    mockActivatedRoute.queryParams = of({ update: 'true' });
    component.ngOnInit();
    expect(component.facturadorTablaDatos).toEqual(
      mockState.facturadorTablaModificaDatos
    );
  });

  it('should call store.updateFacturadorTablaDatos when updateFacturadorTablaDatos is called', () => {
    const facturadores: Facturador[] = [];
    component.updateFacturadorTablaDatos(facturadores);
    expect(mockStore.updateFacturadorTablaDatos).toHaveBeenCalledWith(
      facturadores
    );
  });

  it('should not modify facturadorTablaDatos if update param is not present', () => {
    mockActivatedRoute.queryParams = of({});
    component.facturadorTablaDatos = [
      { nombreRazonSocial: 'Test' } as Facturador,
    ];
    component.tramiteState = mockState;
    component.ngOnInit();
    expect(component.facturadorTablaDatos).toEqual([
      { nombreRazonSocial: 'Test' },
    ]);
  });

  it('should handle multiple calls to ngOnInit with different params', () => {
    mockActivatedRoute.queryParams = of({ update: 'false' });
    component.facturadorTablaDatos = [
      { nombreRazonSocial: 'Test' } as Facturador,
    ];
    component.ngOnInit();
    expect(component.facturadorTablaDatos).toEqual([]);
    mockActivatedRoute.queryParams = of({ update: 'true' });
    component.tramiteState = mockState;
    component.ngOnInit();
    expect(component.facturadorTablaDatos).toEqual(
      mockState.facturadorTablaModificaDatos
    );
  });

  it('should call updateFacturadorTablaDatos with correct arguments', () => {
    const facturadores: Facturador[] = [
      { nombreRazonSocial: 'Nuevo Facturador' } as Facturador,
    ];
    component.updateFacturadorTablaDatos(facturadores);
    expect(mockStore.updateFacturadorTablaDatos).toHaveBeenCalledWith(
      facturadores
    );
  });

  it('should not throw error if tramiteState is undefined when update param is "true"', () => {
    component.tramiteState = undefined as any;
    mockActivatedRoute.queryParams = of({ update: 'true' });
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should update facturadorTablaDatos to empty array if tramiteState is undefined and update param is "true"', () => {
    component.tramiteState = undefined as any;
    mockActivatedRoute.queryParams = of({ update: 'true' });
    component.ngOnInit();
    expect(component.facturadorTablaDatos).toEqual([
      {
        calle: 'Av. Insurgentes Sur',
        codigoPostal: '03100',
        colonia: 'Del Valle',
        coloniaEquivalente: 'Col. Del Valle Centro',
        correoElectronico: 'juan.perez@example.com',
        curp: 'PELJ800101HDFLRN09',
        entidadFederativa: 'CDMX',
        estadoLocalidad: 'Ciudad de México',
        lada: '55',
        localidad: 'Ciudad de México',
        municipioAlcaldia: 'Benito Juárez',
        nacionalidad: 'Mexicana',
        nombreRazonSocial: 'Juan Pérez López',
        nombres: 'Juan',
        numeroExterior: '1234',
        numeroInterior: '5B',
        pais: 'México',
        primerApellido: 'Pérez',
        razonSocial: 'Servicios Pérez S.A. de C.V.',
        rfc: 'PELJ800101XXX',
        segundoApellido: 'López',
        telefono: '5544332211',
        tipoPersona: 'Física',
      },
    ]);
  });
});
