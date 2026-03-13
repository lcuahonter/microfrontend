import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mocks for services and queries
const tramite270201StoreMock = {
  setOperacion: jest.fn(),
  setMovimiento: jest.fn(),
  setMotivo: jest.fn(),
  setPais: jest.fn(),
  setCiudad: jest.fn(),
  setTransporte: jest.fn(),
  setAduana: jest.fn(),
  setAutor: jest.fn(),
  setTitulo: jest.fn(),
  setTecnica: jest.fn(),
  setAlto: jest.fn(),
  setAncho: jest.fn(),
  setProfundidad: jest.fn(),
  setDiametro: jest.fn(),
  setVariables: jest.fn(),
  setAnoDeCreacion: jest.fn(),
  setAvaluo: jest.fn(),
  setMoneda: jest.fn(),
  setPropietario: jest.fn(),
  setFraccionArancelaria: jest.fn(),
  setDescripcionArancelaria: jest.fn(),
  setObraDeArte: jest.fn(),
};

const tramite270201QueryMock = {
  selectDatosSolicitud$: of({}),
};

const solicitudServiceMock = {
  getObraDeArteTabla: jest.fn(() => of({ columns: ['col1', 'col2'] })),
  getOperacionData: jest.fn(() => of([])),
  getMovimientoData: jest.fn(() => of([])),
  getPaisData: jest.fn(() => of([])),
  getTransporteData: jest.fn(() => of([])),
  getAduanaData: jest.fn(() => of([])),
  getMotivoData: jest.fn(() => of([])),
  getMonedaData: jest.fn(() => of([])),
  getArancelariaData: jest.fn(() => of([])),
};

const consultaioQueryMock = {
  selectConsultaioState$: of({ readonly: false }),
};

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let consoleWarnSpy: jest.SpyInstance;

  beforeAll(() => {
    // Suppress specific Angular warning in test output
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation((msg: any) => {
      if (
        typeof msg === 'string' &&
        msg.includes("It looks like you're using the disabled attribute with a reactive form directive")
      ) {
        return;
      }
      // For other warnings, call the original
      // @ts-ignore
      return console.warn(msg);
    });
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DatosDeLaSolicitudComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: 'Tramite270201Store', useValue: tramite270201StoreMock },
        { provide: 'Tramite270201Query', useValue: tramite270201QueryMock },
        { provide: 'SolicitudService', useValue: solicitudServiceMock },
        { provide: 'ConsultaioQuery', useValue: consultaioQueryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(DatosDeLaSolicitudComponent, {
        set: {
          providers: [
            { provide: 'Tramite270201Store', useValue: tramite270201StoreMock },
            { provide: 'Tramite270201Query', useValue: tramite270201QueryMock },
            { provide: 'SolicitudService', useValue: solicitudServiceMock },
            { provide: 'ConsultaioQuery', useValue: consultaioQueryMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle obra de arte modal and table', () => {
    const initialShowTableDiv = component.showTableDiv;
    const initialShowObraDeArteModal = component.showObraDeArteModal;
    component.toggleObraDeArte();
    expect(component.showTableDiv).toBe(!initialShowTableDiv);
    expect(component.showObraDeArteModal).toBe(!initialShowObraDeArteModal);
  });

  it('should call actualizarOperacion', () => {
    component.solicitudFormGroup = new FormBuilder().group({ tipoDeOperacion: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarOperacion();
    expect(tramite270201StoreMock.setOperacion).toHaveBeenCalled();
  });

  it('should call actualizarMovimiento', () => {
    component.solicitudFormGroup = new FormBuilder().group({ tipoDeMovimiento: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarMovimiento();
    expect(tramite270201StoreMock.setMovimiento).toHaveBeenCalled();
  });

  it('should call actualizarMotivo', () => {
    component.solicitudFormGroup = new FormBuilder().group({ motivo: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarMotivo();
    expect(tramite270201StoreMock.setMotivo).toHaveBeenCalled();
  });

  it('should call actualizarPais', () => {
    component.solicitudFormGroup = new FormBuilder().group({ pais: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarPais();
    expect(tramite270201StoreMock.setPais).toHaveBeenCalled();
  });

  it('should call actualizarCiudad', () => {
    component.solicitudFormGroup = new FormBuilder().group({ ciudad: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarCiudad();
    expect(tramite270201StoreMock.setCiudad).toHaveBeenCalled();
  });

  it('should call actualizarTransporte', () => {
    component.solicitudFormGroup = new FormBuilder().group({ medioTransporte: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarTransporte();
    expect(tramite270201StoreMock.setTransporte).toHaveBeenCalled();
  });

  it('should call actualizarAduana', () => {
    component.solicitudFormGroup = new FormBuilder().group({ aduanaEntrada: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarAduana();
    expect(tramite270201StoreMock.setAduana).toHaveBeenCalled();
  });

  it('should call actualizarAutor', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ autor: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarAutor();
    expect(tramite270201StoreMock.setAutor).toHaveBeenCalled();
  });

  it('should call actualizarTitulo', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ titulo: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarTitulo();
    expect(tramite270201StoreMock.setTitulo).toHaveBeenCalled();
  });

  it('should call actualizarTecnica', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ tecnicaDeRealizacion: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarTecnica();
    expect(tramite270201StoreMock.setTecnica).toHaveBeenCalled();
  });

  it('should call actualizarAlto', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ alto: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarAlto();
    expect(tramite270201StoreMock.setAlto).toHaveBeenCalled();
  });

  it('should call actualizarAncho', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ ancho: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarAncho();
    expect(tramite270201StoreMock.setAncho).toHaveBeenCalled();
  });

  it('should call actualizarProfundidad', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ profundidad: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarProfundidad();
    expect(tramite270201StoreMock.setProfundidad).toHaveBeenCalled();
  });

  it('should call actualizarDiametro', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ diametro: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarDiametro();
    expect(tramite270201StoreMock.setDiametro).toHaveBeenCalled();
  });

  it('should call actualizarVariables', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ variables: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarVariables();
    expect(tramite270201StoreMock.setVariables).toHaveBeenCalled();
  });

  it('should call actualizarAnoDeCreacion', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ anoDeCreacion: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarAnoDeCreacion();
    expect(tramite270201StoreMock.setAnoDeCreacion).toHaveBeenCalled();
  });

  it('should call actualizarAvaluo', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ avaluo: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarAvaluo();
    expect(tramite270201StoreMock.setAvaluo).toHaveBeenCalled();
  });

  it('should call actualizarMoneda', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ moneda: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarMoneda();
    expect(tramite270201StoreMock.setMoneda).toHaveBeenCalled();
  });

  it('should call actualizarPropietario', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ propietario: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarPropietario();
    expect(tramite270201StoreMock.setPropietario).toHaveBeenCalled();
  });

  it('should call actualizarFraccionArancelaria', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ fraccionArancelaria: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarFraccionArancelaria();
    expect(tramite270201StoreMock.setFraccionArancelaria).toHaveBeenCalled();
  });

  it('should call actualizarDescArancelaria', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({ descripcionArancelaria: ['test'] });
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.actualizarDescArancelaria();
    expect(tramite270201StoreMock.setDescripcionArancelaria).toHaveBeenCalled();
  });

  it('should add a row and update store on submitDeArteForm', () => {
    component.obraDeArteFormgroup = new FormBuilder().group({
      autor: ['autor'],
      titulo: ['titulo'],
      tecnicaDeRealizacion: ['tecnica'],
      medidas: ['1'],
      ancho: ['ancho'],
      alto: ['alto'],
      profundidad: ['prof'],
      diametro: ['diam'],
      variables: ['vars'],
      anoDeCreacion: ['2020'],
      avaluo: ['1000'],
      moneda: ['moneda'],
      propietario: ['prop'],
      fraccionArancelaria: ['fracc'],
      descripcionArancelaria: ['desc'],
    });
    // Use matching id values for test (string, not number)
    component.arancelariaData = [{ id: 1, descripcion: 'desc fracc' }];
    component.monedaData = [{ id:2, descripcion: 'desc moneda' }];
    component.obraDeArteRowData = [];
    component.showTableDiv = true;
    component.showObraDeArteModal = false;
    // Reset mock call count
    tramite270201StoreMock.setObraDeArte.mockClear();
    // Attach the mock directly to the component instance in case of context issues
    component['tramite270201Store'] = tramite270201StoreMock as any;
    component.submitDeArteForm();
    expect(component.obraDeArteRowData.length).toBe(1);
    expect(tramite270201StoreMock.setObraDeArte).toHaveBeenCalled();
    expect(component.showTableDiv).toBe(false);
    expect(component.showObraDeArteModal).toBe(true);
  });

  it('should destroy subscriptions on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroy$, 'next');
    const completeSpy = jest.spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});

