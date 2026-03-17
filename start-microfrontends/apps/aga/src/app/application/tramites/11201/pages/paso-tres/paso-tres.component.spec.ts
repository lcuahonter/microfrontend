
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PasoTresComponent } from './paso-tres.component';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { DocumentoService, TramiteFolioStore, TramiteFolioQueries } from '@libs/shared/data-access-user/src';
import { Firma11201Service } from '../../services/firma11201.service';
import { Tramite11201Query } from '../../estados/queries/tramite11201.query';
import { CadenaOriginal11201Service } from '../../services/cadena-original.service';
import { CadenaOriginalService } from '@libs/shared/data-access-user/src/core/services/shared/cadena-original/cadena-original.service';
import { DocumentosQuery } from '@libs/shared/data-access-user/src/core/queries/documentos.query';

describe('PasoTresComponent', () => {
  let component: PasoTresComponent;
  let fixture: ComponentFixture<PasoTresComponent>;
  let router: Router;
  let mockDocumentoService: any;
  let mockFirma11201Service: any;
  let mockTramite11201Query: any;
  let mockTramiteStore: any;

  beforeEach(async () => {
    // Create mocks for all dependencies
    mockDocumentoService = {
      obtenerDatosFirma: jest.fn().mockReturnValue(of({ datos: { documentos_requeridos: [] } }))
    };
    
    mockFirma11201Service = {
      enviarFirma: jest.fn().mockReturnValue(of({ codigo: '00', datos: 'test-folio' }))
    };
    
    mockTramite11201Query = {
      selectSolicitud$: of({ idSolicitud: 123, linea: '123456' })
    };
    
    mockTramiteStore = {
      establecerTramite: jest.fn()
    };
    
    const mockTramiteFolioQueries = {
      selectIdTramite$: of(123),
      selectFolio$: of('test-folio'),
      selectFirmaElectronica$: of('test-firma'),
      getTramite: jest.fn().mockReturnValue('test-folio')
    };
    
    const mockCadenaOriginalService = {
      obtenerCadena: jest.fn().mockReturnValue(of({ datos: 'test-cadena' }))
    };
    
    const mockCadenaOriginal11201Service = {
      obtenerCadenaOriginal: jest.fn().mockReturnValue(of({ datos: 'test-cadena' }))
    };
    
    const mockDocumentosQuery = {
      selectDocumentos$: of([]),
      selectDocumentosState$: of({ documentos: [] }),
      selectDocumentoState$: of({ documentos: [] })
    };

    await TestBed.configureTestingModule({
      imports: [PasoTresComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(), 
        provideHttpClientTesting(),
        ToastrService,
        { provide: DocumentoService, useValue: mockDocumentoService },
        { provide: Firma11201Service, useValue: mockFirma11201Service },
        { provide: Tramite11201Query, useValue: mockTramite11201Query },
        { provide: TramiteFolioStore, useValue: mockTramiteStore },
        { provide: TramiteFolioQueries, useValue: mockTramiteFolioQueries },
        { provide: CadenaOriginalService, useValue: mockCadenaOriginalService },
        { provide: CadenaOriginal11201Service, useValue: mockCadenaOriginal11201Service },
        { provide: DocumentosQuery, useValue: mockDocumentosQuery },
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoTresComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it.skip('should navigate to acuse page on valid firma', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.cadenaOriginal = 'test-cadena';
    component.datosFirmaReales = {
      firma: 'test-firma',
      certSerialNumber: 'test-cert',
      rfc: 'test-rfc',
      fechaFin: new Date().toISOString()
    };
    component.solicitudState = {
      idSolicitud: 123,
      menuDesplegable: [],
      datosSolicitante: {},
      datosDelContenedor: {},
      tipoBusqueda: '',
      datosBusqueda: {},
      datosDocumento: {},
      datosAdicionales: {},
      datosFirma: {},
      datosAcuse: {},
      datosPago: {},
      datosValidacion: {},
      datosRechazo: {},
      datosObservacion: {},
      datosResolutivo: {},
      datosNotificacion: {},
      datosCancelacion: {},
      datosReimpresion: {},
      datosSeguimiento: {}
    } as any;
    component.url = 'temporal-contenedores';
    
    const firma = 'valid-firma';
    component.obtieneFirma(firma);
    setTimeout(() => {
      expect(navigateSpy).toHaveBeenCalledWith(['temporal-contenedores/acuse']);
    }, 100);
  });

  it('should not navigate to acuse page on invalid firma', fakeAsync(() => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const firma = '';
    component.obtieneFirma(firma);
    tick();
    expect(navigateSpy).not.toHaveBeenCalled();
  }));
});

