import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PermisoSanitarioSolicitanteComponent } from './permiso-sanitario-solicitante';
import { TOAST_CONFIG, ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegistroSolicitudService } from '@libs/shared/data-access-user/src';
import { Tramite260910Store } from '../../estados/tramite260910Store.store';
import { Tramite260910Query } from '../../estados/tramite260910Query.query';
import { DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { DomicilioQuery } from '../../../../shared/estados/queries/domicilio.query';
import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';

@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('PermisoSanitarioSolicitanteComponent', () => {
  let componente: PermisoSanitarioSolicitanteComponent;
  let fixture: ComponentFixture<PermisoSanitarioSolicitanteComponent>;

  // Mock para ToastrService
  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn()
  };

  // Mocks for all required services
  const mockTramiteStore = {
    update: jest.fn(),
    add: jest.fn()
  };

  const mockTramiteQuery = {
    selectActive: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    getValue: jest.fn().mockReturnValue({}),
    selectTramiteState$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) }
  };

  const mockRegistroSolicitudService = {
    registrarSolicitud: jest.fn().mockReturnValue({ subscribe: jest.fn() })
  };

  const mockDatosDelSolicitudStore = {
    update: jest.fn(),
    add: jest.fn()
  };

  const mockDatosDelSolicitudQuery = {
    selectActive: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    getValue: jest.fn().mockReturnValue({}),
    selectSolicitud$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) }
  };

  const mockRepresentanteLegalQuery = {
    selectActive: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    getValue: jest.fn().mockReturnValue({}),
    selectSolicitud$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) }
  };

  const mockManifestoQuery = {
    selectActive: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
    getValue: jest.fn().mockReturnValue({}),
    selectSolicitud$: { pipe: jest.fn().mockReturnValue({ subscribe: jest.fn() }) }
  };

  const mockManifestoStore = {
    update: jest.fn(),
    add: jest.fn()
  };

  const mockDomicilioStore = {
    update: jest.fn(),
    add: jest.fn()
  };

  // Mock para PasoUnoPagesComponent
  const mockPasoUnoComponent = {
    collectFormValues: jest.fn().mockReturnValue({
      solicitante: { nombre: 'Juan' },
      datosSolicitud: [{ campo: 'valor' }],
      tercerosRelacionados: [],
      pagoDeDerechos: [],
      tramitesAsociados: []
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermisoSanitarioSolicitanteComponent, MockWizardComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Tramite260910Store, useValue: mockTramiteStore },
        { provide: Tramite260910Query, useValue: mockTramiteQuery },
        { provide: RegistroSolicitudService, useValue: mockRegistroSolicitudService },
        { provide: DatosDelSolicituteSeccionStateStore, useValue: mockDatosDelSolicitudStore },
        { provide: DatosDelSolicituteSeccionQuery, useValue: mockDatosDelSolicitudQuery },
        { provide: DomicilioQuery, useValue: mockRepresentanteLegalQuery },
        { provide: DatosDomicilioLegalQuery, useValue: mockManifestoQuery },
        { provide: DatosDomicilioLegalStore, useValue: mockManifestoStore },
        { provide: DomicilioStore, useValue: mockDomicilioStore },
        { provide: TOAST_CONFIG, useValue: {
          timeOut: 5000,
          positionClass: 'toast-top-right',
          preventDuplicates: false,
          iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
          }
        } }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PermisoSanitarioSolicitanteComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();

    // Mock de wizardComponent
    componente.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as any;
  });

  it('should create', () => {
    expect(componente).toBeTruthy();
  });

});
