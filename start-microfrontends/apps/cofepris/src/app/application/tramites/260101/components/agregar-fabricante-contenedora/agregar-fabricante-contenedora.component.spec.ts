import { TestBed } from '@angular/core/testing';
import { AgregarFabricanteContenedoraComponent } from './agregar-fabricante-contenedora.component';
import { Tramite260101Store } from '../../estados/tramite260101Store.store';
import { Tramite260101Query } from '../../estados/tramite260101Query.query';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { CommonModule } from '@angular/common';
import { AgregarFabricanteComponent } from '../../../../shared/components/agregar-fabricante/agregar-fabricante.component';
import {
  HttpClientTestingModule,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TABLA_OPCION_DATA } from '../../../../shared/constantes/datos-solicitud.enum';

describe('AgregarFabricanteContenedoraComponent', () => {
  let component: AgregarFabricanteContenedoraComponent;
  let fixture: any;
  let mockStore: jest.Mocked<Tramite260101Store>;
  let mockQuery: Partial<Tramite260101Query>;
  let mockActivatedRoute: any;

  const mockState = {
    destinatarioFinalTablaDatos: [],
    facturadorTablaDatos: [],
    proveedorTablaDatos: [],
    fabricanteTablaDatos: [],
    destinatarioFinalTablaModificaDatos: [],
    facturadorTablaModificaDatos: [],
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
      updateFabricanteTablaDatos: jest.fn(() => of()),
    } as any;

    mockQuery = {
      selectTramiteState$: of(),
    };

    mockActivatedRoute = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [
        AgregarFabricanteContenedoraComponent,
        CommonModule,
        HttpClientTestingModule,
        AgregarFabricanteComponent,
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: Tramite260101Store, useValue: mockStore },
        { provide: Tramite260101Query, useValue: mockQuery },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarFabricanteContenedoraComponent);
    component = fixture.componentInstance;
    component.tramiteState = mockState as any;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteState and fabricanteTablaDatos from query', () => {
    expect(component.tramiteState).toEqual(mockState as any);
    expect(component.fabricanteTablaDatos).toEqual(
      mockState.fabricanteTablaDatos
    );
  });

  it('should clear fabricanteTablaDatos if queryParams.update is "false"', () => {
    mockActivatedRoute.queryParams = of({ update: 'false' });
    component.ngOnInit();
    expect(component.fabricanteTablaDatos).toEqual([]);
  });

  it('should set fabricanteTablaDatos to fabricanteTablaModificaDatos if queryParams.update is "true"', () => {
    mockActivatedRoute.queryParams = of({ update: 'true' });
    component.tramiteState = mockState as any;
    component.ngOnInit();
    expect(component.fabricanteTablaDatos).toEqual(
      mockState.fabricanteTablaModificaDatos
    );
  });

  it('should call store.updateFabricanteTablaDatos when updateFabricanteTablaDatos is called', () => {
    const fabricantes: Fabricante[] = [];
    component.updateFabricanteTablaDatos(fabricantes);
    expect(mockStore.updateFabricanteTablaDatos).toHaveBeenCalledWith(
      fabricantes
    );
  });

  it('should not modify fabricanteTablaDatos if queryParams.update is undefined', () => {
    mockActivatedRoute.queryParams = of({});
    component.tramiteState = mockState as any;
    component.fabricanteTablaDatos = [];
    component.tramiteState = mockState as any;
    component.ngOnInit();
    expect(component.fabricanteTablaDatos).toEqual(
      mockState.fabricanteTablaDatos
    );
  });

  it('should handle empty tramiteState.fabricanteTablaModificaDatos when update is "true"', () => {
    mockActivatedRoute.queryParams = of({ update: 'true' });
    component.tramiteState = { fabricanteTablaModificaDatos: [] } as any;
    component.ngOnInit();
    expect(component.fabricanteTablaDatos).toEqual([]);
  });

  it('should not throw if tramiteState is undefined and update is "true"', () => {
    mockActivatedRoute.queryParams = of({ update: 'true' });
    component.tramiteState = undefined as any;
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should call updateFabricanteTablaDatos with correct argument', () => {
    const fabricantes: Fabricante[] = [];
    component.updateFabricanteTablaDatos(fabricantes);
    expect(mockStore.updateFabricanteTablaDatos).toHaveBeenCalledWith(
      fabricantes
    );
  });

  it('should not call updateFabricanteTablaDatos if event is undefined', () => {
    component.updateFabricanteTablaDatos(undefined as any);
    expect(mockStore.updateFabricanteTablaDatos).toHaveBeenCalledWith(
      undefined
    );
  });
});
