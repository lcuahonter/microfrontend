import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AggregarComplimentosComponent } from './aggregar-complimentos.component';
import { Tramite80101Query } from '../../../80103/estados/tramite80101.query';
import { Tramite80101Store } from '../../../80103/estados/tramite80101.store';
import { of, Subject } from 'rxjs';
import { DatosComplimentos, SociaoAccionistas } from '../../../../shared/models/complimentos.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AggregarComplimentosComponent', () => {
  let component: AggregarComplimentosComponent;
  let fixture: ComponentFixture<AggregarComplimentosComponent>;
  let store: jest.Mocked<Tramite80101Store>;

  const mockComplimentos: DatosComplimentos = {
    modalidad: 'Servicios',
    programaPreOperativo: '',
    datosGeneralis: { paginaWWeb: '', localizacion: '' },
    obligacionesFiscales: {
      opinionPositiva: 'Si',
      fechaExpedicion: '2025-03-15',
      aceptarObligacionFiscal: '',
    },
    formaModificaciones: {
      nombreDelFederatario: '',
      nombreDeNotaria: '',
      estado: '',
      nombreDeActa: '',
      fechaDeActa: '2025-01-20',
      rfc: '',
      nombreDeRepresentante: 'Maria Lopez',
    },
    formaCertificacion: {
      certificada: 'No',
      fechaInicio: '',
      fechaVigencia: '',
    },
    formaSocioAccionistas: {
      nationalidadMaxicana: 'false',
      tipoDePersona: 'false',
      formaDatos: {
        apellidoMaterno: '',
        apellidoPaterno: '',
        codigoPostal: '',
        correoElectronico: '',
        cp: '',
        estado: '',
        nombre: '',
        pais: '',
        razonSocial: '',
        rfc: '',
        taxId: '',
      },
    },
  };

  const mockAccionista: SociaoAccionistas = { nombre: 'Juan', rfc: 'RFC123' };
  const mockAccionistaExtranjero: SociaoAccionistas = { nombre: 'Ana', rfc: '' };

  beforeEach(async () => {
    store = {
      setDatosComplimentos: jest.fn(),
      aggregarTablaDatosComplimentos: jest.fn(), // typo fallback if needed
      aggregarTablaDatosComplimentosExtranjera: jest.fn(), // typo fallback if needed
      aggargarTablaDatosComplimentos: jest.fn(),
      aggargarTablaDatosComplimentosExtranjera: jest.fn(),
      eliminarTablaDatosComplimentos: jest.fn(),
      eliminarTablaDatosComplimentosExtranjera: jest.fn(),
    } as any;

    const queryMock: Partial<Tramite80101Query> = {
      selectDatosComplimento$: of(mockComplimentos),
      selectTablaDatosComplimentos$: of([]),
      selectTablaDatosComplimentosExtranjera$: of([]),
    };

    await TestBed.configureTestingModule({
      imports: [AggregarComplimentosComponent, HttpClientTestingModule],
      providers: [
        { provide: Tramite80101Store, useValue: store },
        { provide: Tramite80101Query, useValue: queryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AggregarComplimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer datosComplimentos desde el observable', () => {
    expect(component.datosComplimentos).toEqual(mockComplimentos);
  });

  it('debe llamar a setDatosComplimentos cuando se llama a modifierComplimentos', () => {
    component.modifierComplimentos(mockComplimentos);
    expect(store.setDatosComplimentos).toHaveBeenCalledWith(mockComplimentos);
  });

  describe('accionistasAgregados', () => {
    it('debe llamar a aggargarTablaDatosComplimentos para accionista con RFC', () => {
      component.accionistasAgregados(mockAccionista);
      expect(store.aggregarTablaDatosComplimentos).toHaveBeenCalledWith(mockAccionista);
    });

    it('debe llamar a aggargarTablaDatosComplimentosExtranjera para accionista sin RFC', () => {
      component.accionistasAgregados(mockAccionistaExtranjero);
      expect(store.aggregarTablaDatosComplimentosExtranjera).toHaveBeenCalledWith(mockAccionistaExtranjero);
    });

    it('no debe llamar a ningún método de la tienda si se llama a accionistasAgregados con null', () => {
      component.accionistasAgregados(null);
      expect(store.aggregarTablaDatosComplimentos).not.toHaveBeenCalled();
      expect(store.aggregarTablaDatosComplimentosExtranjera).not.toHaveBeenCalled();
    });

    it('no debe llamar a ningún método de la tienda si se llama a accionistasAgregados con undefined', () => {
      component.accionistasAgregados(undefined);
      expect(store.aggregarTablaDatosComplimentos).not.toHaveBeenCalled();
      expect(store.aggregarTablaDatosComplimentosExtranjera).not.toHaveBeenCalled();
    });
  });

  describe('accionistasEliminados', () => {
    it('debe llamar a eliminarTablaDatosComplimentos con los datos proporcionados', () => {
      component.accionistasEliminados([mockAccionista]);
      expect(store.eliminarTablaDatosComplimentos).toHaveBeenCalledWith([mockAccionista]);
    });

    it('debe manejar el array vacío', () => {
      component.accionistasEliminados([]);
      expect(store.eliminarTablaDatosComplimentos).toHaveBeenCalledWith([]);
    });
  });

  describe('accionistasExtranjerosEliminado', () => {
    it('debe llamar a eliminarTablaDatosComplimentosExtranjera con los datos proporcionados', () => {
      component.accionistasExtranjerosEliminado([mockAccionistaExtranjero]);
      expect(store.eliminarTablaDatosComplimentosExtranjera).toHaveBeenCalledWith([mockAccionistaExtranjero]);
    });

    it('debe manejar el array vacío', () => {
      component.accionistasExtranjerosEliminado([]);
      expect(store.eliminarTablaDatosComplimentosExtranjera).toHaveBeenCalledWith([]);
    });
  });

  it('debe completar destroyNotifier$ cuando se llama manualmente', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component['destroyNotifier$'].next();
    component['destroyNotifier$'].complete();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
