import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudImportacionAmbulanciaComponent } from './solicitud-importacion-ambulancia.component';
import { BtnContinuarComponent, SolicitanteComponent, WizardComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SolicitudImportacionAmbulanciaService } from '../../services/solicitud-importacion-ambulancia.service';
import { Tramite130116Store } from '../../../../estados/tramites/tramites130116.store';
import { Tramite130116Query } from '../../../../estados/queries/tramite130116.query';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitudImportacionAmbulanciaComponent', () => {
  let component: SolicitudImportacionAmbulanciaComponent;
  let fixture: ComponentFixture<SolicitudImportacionAmbulanciaComponent>;
  let mockToastrService: any;
  let mockSolicitudImportacionAmbulanciaService: any;
  let mockStore: any;
  let mockQuery: any;

  beforeEach(async () => {
    mockToastrService = {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn()
    };

    mockSolicitudImportacionAmbulanciaService = {
      getDatosDeLaSolicitud: jest.fn(),
      actualizarEstadoFormulario: jest.fn(),
      guardarDatos: jest.fn()
    };

    mockStore = {
      actualizarEstado: jest.fn()
    };

    mockQuery = {
      selectSolicitud$: of({})
    };

    await TestBed.configureTestingModule({
      imports: [WizardComponent, BtnContinuarComponent, SolicitanteComponent, HttpClientModule],
      declarations: [SolicitudImportacionAmbulanciaComponent, PasoUnoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: SolicitudImportacionAmbulanciaService, useValue: mockSolicitudImportacionAmbulanciaService },
        { provide: Tramite130116Store, useValue: mockStore },
        { provide: Tramite130116Query, useValue: mockQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudImportacionAmbulanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.pantallasPasos.length).toBeGreaterThan(0);
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice and call wizardComponent.siguiente() on getValorIndice with accion "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    // Set indice to something other than 1 to trigger pasoNavegarPor
    component.indice = 2;
    const accionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(accionBoton);

    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras() on getValorIndice with accion "atras"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    const accionBoton = { accion: 'atras', valor: 2 };
    component.getValorIndice(accionBoton);

    expect(component.indice).toBe(accionBoton.valor);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent methods if valor is out of range', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    const accionBoton = { accion: 'cont', valor: 5 };
    component.getValorIndice(accionBoton);

    expect(component.indice).not.toBe(accionBoton.valor);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});
