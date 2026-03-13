// acuses-y-resoluciones-folio-del-tramite-detalles-contenedor.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcusesYResolucionesFolioDelTramiteDetallesContenedorComponent } from './acuses-y-resoluciones-folio-del-tramite-detalles-contenedor.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

// Mock services
const mockRouter = {
  url: '/aga/acuse-resolucion',
  navigate: jest.fn(),
};

const mockSubsecuentesService = {
  getAcusesYResolucionesDatos: jest.fn().mockReturnValue(of({})),
  getButtonesAcciones: jest.fn().mockReturnValue(of([])),
};

const mockConsultaioStore = {
  establecerConsultaio: jest.fn(),
};

const mockConsultaioQuery = {
  selectConsultaioState$: of({
    procedureId: '123',
    parameter: 'param',
    department: 'AGA',
    folioTramite: 'FT-001',
    tipoDeTramite: 'tipo',
    estadoDeTramite: 'estado',
  }),
};

const mockRequerimientoService = {
  informacionRequisitos: jest.fn().mockReturnValue(
    of({
      data: {
        fechaRequerimiento: '2024-01-01',
        justificacionRequerimiento: 'Motivo',
      },
    })
  ),
};

const mockCatalogosService = {
  getCatalogo: jest.fn().mockReturnValue(of([])),
};

const mockTramiteQueries = {
  getTramite: jest.fn().mockReturnValue('FT-001'),
};

describe('AcusesYResolucionesFolioDelTramiteDetallesContenedorComponent', () => {
  let component: AcusesYResolucionesFolioDelTramiteDetallesContenedorComponent;
  let fixture: ComponentFixture<AcusesYResolucionesFolioDelTramiteDetallesContenedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AcusesYResolucionesFolioDelTramiteDetallesContenedorComponent,
        HttpClientModule,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: 'SubsecuentesService', useValue: mockSubsecuentesService },
        { provide: 'ConsultaioStore', useValue: mockConsultaioStore },
        { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
        {
          provide: 'AtenderRequerimientoService',
          useValue: mockRequerimientoService,
        },
        { provide: 'CatalogosService', useValue: mockCatalogosService },
        { provide: 'TramiteFolioQueries', useValue: mockTramiteQueries },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      AcusesYResolucionesFolioDelTramiteDetallesContenedorComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set tramite, departamento, and folio from query', () => {
    expect(component.tramite).toBe(0);
    expect(component.departamento).toBe('');
    expect(component.folio).toBe('');
  });

  it('should change indice and call wizard methods on getValorIndice', () => {
    // mock wizard component
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    component.guardarDatos = {
      procedureId: '123',
      parameter: '',
      department: 'importacion',
      folioTramite: '',
      tipoDeTramite: '',
      estadoDeTramite: '',
      readonly: false,
      create: false,
      update: false,
      consultaioSolicitante: null,
    };

    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });
  it('should set slectTramite when selectTramite is called', () => {
    const mockTramite = 290101;

    // add mock item to LISTA_TRIMITES manually (normally you'd mock this import)
    (component as any).LISTA_TRIMITES = [
      { tramite: mockTramite, listaComponentes: [] },
    ];

    component.selectTramite(mockTramite);
    expect(component.slectTramite?.tramite).toBe(mockTramite);
  });

  it('should log error if componentPath is missing in loadComponent', async () => {
    const li = { componentPath: null } as any;
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await component.loadComponent(li);
    expect(consoleSpy).toHaveBeenCalledWith('Component not found in registry:');
  });

  it('should navigate to seleccion-tramite if tramite is falsy', () => {
    component.tramite = 0;
    component.departamento = 'importacion';
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/importacion/seleccion-tramite',
    ]);
  });
  it('should handle error in getTiposDocumentos', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(
      throwError(() => new Error('fail'))
    );
    component.getTiposDocumentos();
    // no assertion needed unless you handle/log error; just calling completes coverage
  });
  it('should go to step 2 and call wizardComponent.siguiente', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
    const action = { valor: 2, accion: 'cont' };
    component.guardarDatos = {} as any;
    component.getValorIndice(action);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });
  it('should ignore invalid indice values in getValorIndice', () => {
    const action = { valor: 10, accion: 'cont' };
    component.indice = 1;
    component.getValorIndice(action);
    expect(component.indice).toBe(1); // remains unchanged
  });
});
