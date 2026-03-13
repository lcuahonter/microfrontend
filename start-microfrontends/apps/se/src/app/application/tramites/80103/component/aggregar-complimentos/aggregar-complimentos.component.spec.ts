import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AggregarComplimentosComponent } from './aggregar-complimentos.component';
import { of, Subject } from 'rxjs';
import { Tramite80101Store } from '../../estados/tramite80101.store';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosComplimentos, SociaoAccionistas } from '../../../../shared/models/complimentos.model';
import { HttpClientModule } from '@angular/common/http';

describe('AggregarComplimentosComponent', () => {
  let component: AggregarComplimentosComponent;
  let fixture: ComponentFixture<AggregarComplimentosComponent>;

  const MOCK_DATOS: DatosComplimentos = {
    modalidad: 'General',
    programaPreOperativo: 'Sí',
    datosGeneralis: {
      paginaWWeb: 'https://empresa.com',
      localizacion: 'Ciudad'
    },
    obligacionesFiscales: {
      opinionPositiva: 'Sí',
      fechaExpedicion: '2024-05-01',
      aceptarObligacionFiscal: 'Sí'
    },
    formaModificaciones: {
      nombreDelFederatario: 'Lic. Pérez',
      nombreDeNotaria: 'Notaría 12',
      estado: 'CDMX',
      nombreDeActa: 'Acta 123',
      fechaDeActa: '2024-04-01',
      rfc: 'RFC123456ABC',
      nombreDeRepresentante: 'María López'
    },
    formaCertificacion: {
      certificada: 'Sí',
      fechaInicio: '2023-01-01',
      fechaVigencia: '2025-01-01'
    },
    formaSocioAccionistas: {
      nationalidadMaxicana: 'Sí',
      tipoDePersona: 'Moral',
      formaDatos: {
        campo1: 'valor1'
      }
    }
  };


  const MOCK_ACCIONISTA_NACIONAL: SociaoAccionistas = {
    nombre: 'Juan',
    rfc: 'JUAX123456M01'
  };


  const MOCK_ACCIONISTA_EXTRANJERO: SociaoAccionistas = {
    nombre: 'Anna',
    rfc: ''
  };


  const mockTramiteQuery = {
    selectConsultaioState$: of({ readonly: false }),
    selectTablaDatosComplimentos$: of([]),
    selectTablaDatosComplimentosExtranjera$: of([]),
    selectDatosComplimento$: of(MOCK_DATOS)
  };

  const mockTramiteStore = {
    setDatosComplimentos: jest.fn(),
    aggregarTablaDatosComplimentos: jest.fn(),
    aggregarTablaDatosComplimentosExtranjera: jest.fn(),
    eliminarTablaDatosComplimentos: jest.fn(),
    eliminarTablaDatosComplimentosExtranjera: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggregarComplimentosComponent,HttpClientModule],
      providers: [
        { provide: Tramite80101Store, useValue: mockTramiteStore },
        { provide: Tramite80101Query, useValue: mockTramiteQuery },
        { provide: ConsultaioQuery, useValue: mockTramiteQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AggregarComplimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and initialize observables', () => {
    expect(component).toBeTruthy();
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.datosComplimentos).toEqual(MOCK_DATOS);
  });

  it('should call store.setDatosComplimentos when modifierComplimentos is triggered', () => {
    component.modifierComplimentos(MOCK_DATOS);
    expect(mockTramiteStore.setDatosComplimentos).toHaveBeenCalledWith(MOCK_DATOS);
  });

  it('should call aggregarTablaDatosComplimentos for nacional accionista', () => {
    component.accionistasAgregados(MOCK_ACCIONISTA_NACIONAL);
    expect(mockTramiteStore.aggregarTablaDatosComplimentos).toHaveBeenCalledWith(MOCK_ACCIONISTA_NACIONAL);
  });

  it('should call aggregarTablaDatosComplimentosExtranjera for extranjero accionista', () => {
    component.accionistasAgregados(MOCK_ACCIONISTA_EXTRANJERO);
    expect(mockTramiteStore.aggregarTablaDatosComplimentosExtranjera).toHaveBeenCalledWith(MOCK_ACCIONISTA_EXTRANJERO);
  });

  it('should call eliminarTablaDatosComplimentos on accionistasEliminados', () => {
    const MOCK_LIST: SociaoAccionistas[] = [MOCK_ACCIONISTA_NACIONAL];
    component.accionistasEliminados(MOCK_LIST);
    expect(mockTramiteStore.eliminarTablaDatosComplimentos).toHaveBeenCalledWith(MOCK_LIST);
  });

  it('should call eliminarTablaDatosComplimentosExtranjera on accionistasExtranjerosEliminado', () => {
    const MOCK_LIST: SociaoAccionistas[] = [MOCK_ACCIONISTA_EXTRANJERO];
    component.accionistasExtranjerosEliminado(MOCK_LIST);
    expect(mockTramiteStore.eliminarTablaDatosComplimentosExtranjera).toHaveBeenCalledWith(MOCK_LIST);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
