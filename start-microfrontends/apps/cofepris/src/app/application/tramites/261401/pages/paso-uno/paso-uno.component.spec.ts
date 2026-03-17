import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite2614Query } from '../../../../estados/queries/tramite2614.query';
import { Tramite2614Store } from '../../../../estados/tramites/tramite2614.store';
import { TramiteAsociados } from '../../../../shared/models/tramite-asociados.model';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TercerosRelacionadosComponent } from '../../../../shared/components/2614/terceros-relacionados/terceros-relacionados.component';
import { TramiteAsociadosComponent } from '../../../../shared/components/tramite-asociados/tramite-asociados.component';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos-new/pago-de-derechos.component';
import { SolicitudModificacionPermisoInternacionService } from '../../../../shared/services/shared2614/solicitud-modificacion-permiso-internacion.service';


describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let solicitudPermisoServiceMock: any;
  let Tramite2614StoreMock: any;
  let tramite261401QueryMock: any;

  beforeEach(async () => {
    // Mock services
    solicitudPermisoServiceMock = {
      obtenerTramitesAsociados: jest.fn().mockReturnValue(of([])),
      inicializaPagoDeDerechosDatosCatalogos: jest.fn(),
      banco: [{ id: 1, descripcion: 'Banco 1' }],
    };

    Tramite2614StoreMock = {
      setClaveDeReferencia: jest.fn(),
      setCadenaPagoDependencia: jest.fn(),
      setBancoseleccionado: jest.fn(),
      setLlaveDePago: jest.fn(),
      setFecPago: jest.fn(),
      setImpPago: jest.fn(),
    };

    tramite261401QueryMock = {
      selectSolicitud$: of({
        claveDeReferencia: '12345',
        cadenaPagoDependencia: 'DEPENDENCIA',
        bancoseleccionado: 1,
        llaveDePago: 'LLAVE123',
        fecPago: '2025-04-10',
        impPago: 1000,
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [ReactiveFormsModule,  TramiteAsociadosComponent, PagoDeDerechosComponent,TercerosRelacionadosComponent],
      providers: [
        FormBuilder,
        { provide: SolicitudModificacionPermisoInternacionService, useValue: solicitudPermisoServiceMock },
        { provide: Tramite2614Store, useValue: Tramite2614StoreMock },
        { provide: Tramite2614Query, useValue: tramite261401QueryMock },
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
    
    solicitudPermisoServiceMock.obtenerTramitesAsociados.mockReturnValue(of(tramiteAsociadosMock));
    
    const newFixture = TestBed.createComponent(PasoUnoComponent);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.tramiteAsociados).toEqual(tramiteAsociadosMock);
  });

  it('should initialize form on crearformularioPagoDerechos', () => {
    component.crearformularioPagoDerechos();
    expect(component.formularioPagoDerechos).toBeDefined();
    expect(component.formularioPagoDerechos.get('claveDeReferencia')?.value).toBe('12345');
    expect(component.formularioPagoDerechos.get('cadenaPagoDependencia')?.value).toBe('DEPENDENCIA');
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