import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { of, Observable } from 'rxjs';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261101.query'
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261101.store';
import { DatosSolicitudService } from '../../../261101/services/datoSolicitude.service';
import { TramiteAsociadosComponent } from '../../../../shared/components/tramite-asociados/tramite-asociados.component';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos-new/pago-de-derechos.component';
import { DatosSolicitudComponent } from '../../components/datos-solicitude/datos-solicitud.component';
import { TercerosRelacionadosFabricanteComponent } from '../../components/terceros-relacionados-fabricante/terceros-relacionados-fabricante.component';


@Component({
  selector: 'solicitante',
  template: '<div></div>',
})
class MockSolicitanteComponent {}
interface DatosSolicitudServiceMockType {
  obtenerTramitesAsociados: jest.Mock<Observable<any>>;
  inicializaPagoDeDerechosDatosCatalogos: jest.Mock<void>;
  banco: { id: number; descripcion: string }[];
}

interface DatosProcedureStoreMockType {
  setClaveDeReferencia: jest.Mock<void>;
  setCadenaPagoDependencia: jest.Mock<void>;
  setBancoseleccionado: jest.Mock<void>;
  setLlaveDePago: jest.Mock<void>;
  setFecPago: jest.Mock<void>;
  setImpPago: jest.Mock<void>;
}

interface DatosProcedureQueryMockType {
  selectSolicitudPermiso$: Observable<{
    claveDeReferencia: string;
    cadenaPagoDependencia: string;
    bancoseleccionado: number;
    llaveDePago: string;
    fecPago: string;
    impPago: number;
  }>;
}

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let datosSolicitudServiceMock: DatosSolicitudServiceMockType;
  let datosProcedureStoreMock: DatosProcedureStoreMockType;
  let datosProcedureQueryMock: DatosProcedureQueryMockType;

  beforeEach(async () => {
    datosSolicitudServiceMock = {
      obtenerTramitesAsociados: jest.fn().mockReturnValue(of([])),
      inicializaPagoDeDerechosDatosCatalogos: jest.fn(),
      banco: [{ id: 1, descripcion: 'Banco 1' }],
    };

    datosProcedureStoreMock = {
      setClaveDeReferencia: jest.fn(),
      setCadenaPagoDependencia: jest.fn(),
      setBancoseleccionado: jest.fn(),
      setLlaveDePago: jest.fn(),
      setFecPago: jest.fn(),
      setImpPago: jest.fn(),
    };

    datosProcedureQueryMock = {
      selectSolicitudPermiso$: of({
        claveDeReferencia: '12345',
        cadenaPagoDependencia: 'DEPENDENCIA',
        bancoseleccionado: 1,
        llaveDePago: 'LLAVE123',
        fecPago: '2025-04-10',
        impPago: 1000,
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent, DatosSolicitudComponent, TercerosRelacionadosFabricanteComponent],
      imports: [ReactiveFormsModule, TramiteAsociadosComponent, PagoDeDerechosComponent],
      providers: [
        FormBuilder,
        { provide: DatosSolicitudService, useValue: datosSolicitudServiceMock },
        { provide: DatosProcedureStore, useValue: datosProcedureStoreMock },
        { provide: DatosProcedureQuery, useValue: datosProcedureQueryMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteAsociados on ngOnInit', () => {
    const tramiteAsociadosMock = [
      { id: 1, folioTramite: '12345', tipoTramite: 'Tipo A', estatus: 'Activo', fetchaAltaDeRegistro: '2025-04-10' },
    ];
    datosSolicitudServiceMock.obtenerTramitesAsociados.mockReturnValue(of(tramiteAsociadosMock));

    component.ngOnInit();
    expect(component.tramiteAsociados).toEqual(tramiteAsociadosMock);
  });

  it('should initialize form on crearformularioPagoDerechos', () => {
    component.crearformularioPagoDerechos();
    expect(component.formularioPagoDerechos).toBeDefined();
    expect(component.formularioPagoDerechos.get('claveDeReferencia')?.value).toBe('12345');
    expect(component.formularioPagoDerechos.get('cadenaPagoDependencia')?.value).toBe('DEPENDENCIA');
    expect(component.formularioPagoDerechos.get('banco')?.value).toBe(1);
    expect(component.formularioPagoDerechos.get('llaveDePago')?.value).toBe('LLAVE123');
    expect(component.formularioPagoDerechos.get('fecPago')?.value).toBe('2025-04-10');
    expect(component.formularioPagoDerechos.get('impPago')?.value).toBe(1000);
  });

  it('should select a tab and initialize banco on seleccionaTab', () => {
    component.seleccionaTab(4);
    expect(component.indice).toBe(4);
    expect(component.banco).toEqual([{ id: 1, descripcion: 'Banco 1' }]);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['notificadorDestruccion$'], 'next');
    const completeSpy = jest.spyOn(component['notificadorDestruccion$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});