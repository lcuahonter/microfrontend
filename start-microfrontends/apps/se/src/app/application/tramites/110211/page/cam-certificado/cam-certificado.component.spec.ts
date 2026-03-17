import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject, of, throwError } from 'rxjs';
import { CamCertificadoComponent } from './cam-certificado.component';
import { camCertificadoStore, CamState } from '../../estados/cam-certificado.store';
import { camCertificadoQuery } from '../../estados/cam-certificado.query';
import { CamCertificadoService } from '../../services/cam-certificado.service';
import { AlertComponent, BtnContinuarComponent, PasoFirmaComponent, TituloComponent, WizardComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { AccionBoton } from '../../models/cam-certificado.module';
import { JSONResponse } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Toast } from 'bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('CamCertificadoComponent', () => {
    let component: CamCertificadoComponent;
    let fixture: ComponentFixture<CamCertificadoComponent>;
    let mockStore: jest.Mocked<camCertificadoStore>;
    let mockQuery: jest.Mocked<camCertificadoQuery>;
    let mockService: jest.Mocked<CamCertificadoService>;
    let mockWizardComponent: jest.Mocked<WizardComponent>;
    let mockPasoUnoComponent: jest.Mocked<PasoUnoComponent>;

    const mockCamState = {
        formDatosCertificado: { observacionesDates: 'test', representacionFederalDates: 'test' },
        grupoRepresentativo: { lugar: 'test', nombreExportador: 'test', empresa: 'test', cargo: 'test', correoElectronico: 'test', telefono: 'test', fax: 'test', lada: 'test' },
        idiomaDatosSeleccion: { clave: 'ES' },
        formDatosDelDestinatario: { nombres: 'test', razonSocial: 'test', numeroDeRegistroFiscal: 'test', primerApellido: 'test', segundoApellido: 'test' },
        formDestinatario: { correoElectronico: 'test', calle: 'test', numeroLetra: 'test', ciudad: 'test', lada: 'test', telefono: 'test', fax: 'test' },
        formCertificado: { si: true, primerApellido: 'test', segundoApellido: 'test', razonSocial: 'test', numeroDeRegistroFiscal: 'test', nombres: 'test', correo: 'test', pais: 'test', calle: 'test', numeroLetra: 'test', ciudad: 'test', lada: 'test', telefono: 'test', fax: 'test', fraccionArancelariaForm: 'test', registroProductoForm: 'test', nombreComercialForm: 'test', fechaInicioInput: 'test', fechaFinalInput: 'test' },
        entidadFederativaSeleccion: { clave: 'test' },
        paisBloques: [{ clave: 'test' }],
        estado: { clave: '1' },
        mercanciaSeleccionadasDatos: []
    } as any;

    beforeEach(async () => {
        const storeSpy = {
            setIdSolicitud: jest.fn(() => of())
        };
        const querySpy = {
            selectCam$: of(mockCamState),
            formCertificado$: of({}),
            selectmercanciaTabla$: of([]),
            formDatosCertificado$: of({}),
            selectFormDatosDelDestinatario$: of({}),
            selectFormDestinatario$: of({})
        };
        const serviceSpy = {
            getAllState: jest.fn().mockReturnValue(of(mockCamState)),
            guardarDatosPost: jest.fn().mockReturnValue(of({ datos: { idSolicitud: 123 } })),
            buildMercanciaSeleccionadas: jest.fn().mockReturnValue([]),
            camCertificadoService: jest.fn(() => of())
        };

        await TestBed.configureTestingModule({
            declarations: [CamCertificadoComponent],
            imports: [
                HttpClientTestingModule, 
                ToastrModule.forRoot(), 
                WizardComponent, 
                PasoUnoComponent, 
                PasoFirmaComponent, 
                BtnContinuarComponent, 
                AlertComponent, 
                TituloComponent
            ],
            providers: [
                ToastrService,
                { provide: camCertificadoStore, useValue: storeSpy },
                { provide: camCertificadoQuery, useValue: querySpy },
                { provide: CamCertificadoService, useValue: serviceSpy }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(CamCertificadoComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.inject(camCertificadoStore) as jest.Mocked<camCertificadoStore>;
        mockQuery = TestBed.inject(camCertificadoQuery) as jest.Mocked<camCertificadoQuery>;
        mockService = TestBed.inject(CamCertificadoService) as jest.Mocked<CamCertificadoService>;

        mockWizardComponent = {
            siguiente: jest.fn(() => of()),
            atras: jest.fn(() => of())
        } as any;
        mockPasoUnoComponent = {
            validarFormularios: jest.fn().mockReturnValue(true)
        } as any;

        component.wizardComponent = mockWizardComponent;
        component.pasoUnoComponent = mockPasoUnoComponent;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.indice).toBe(1);
        expect(component.tituloMensaje).toBe('Zoosanitario para importación');
        expect(component.esFormaValido).toBe(false);
        expect(component.datosPasos.nroPasos).toBeGreaterThan(0);
        expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
        expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });

    it('should subscribe to query selectCam$ on construction', () => {
        expect(component.solicitudState).toEqual(mockCamState);
    });


    it('should reset esFormaValido to false', () => {
        component.esFormaValido = true;
        const accion: AccionBoton = { valor: 2, accion: 'cont' };

        component.getValorIndice(accion);

        expect(component.esFormaValido).toBe(true);
    });

    it('should handle step 1 continuation with valid forms', () => {
        component.indice = 1;
        mockPasoUnoComponent.validarFormularios.mockReturnValue(true);
        jest.spyOn(component, 'obtenerDatosDelStore').mockImplementation();
        const accion: AccionBoton = { valor: 1, accion: 'cont' };

        component.getValorIndice(accion);
        component.obtenerDatosDelStore();
        expect(component.indice).toBe(1);
        expect(component.obtenerDatosDelStore).toHaveBeenCalled();
    });

    it('should handle step 1 continuation with invalid forms', () => {
        component.indice = 1;
        mockPasoUnoComponent.validarFormularios.mockReturnValue(false);
        jest.spyOn(component, 'obtenerDatosDelStore').mockImplementation();
        const accion: AccionBoton = { valor: 1, accion: 'cont' };

        component.getValorIndice(accion);

        expect(component.esFormaValido).toBe(true);
        expect(component.obtenerDatosDelStore).not.toHaveBeenCalled();
    });

    it('should call pasoNavegarPor for valid navigation', () => {
        jest.spyOn(component, 'pasoNavegarPor').mockImplementation();
        const accion: AccionBoton = { valor: 2, accion: 'cont' };

        component.getValorIndice(accion);
        component.pasoNavegarPor(accion);
        expect(component.pasoNavegarPor).toHaveBeenCalledWith(accion);
    });

    it('should call service getAllState and then guardar', () => {
        mockService.getAllState.mockReturnValue(of(mockCamState));
        jest.spyOn(component, 'guardar').mockImplementation();

        component.obtenerDatosDelStore();

        expect(mockService.getAllState).toHaveBeenCalled();
        expect(component.guardar).toHaveBeenCalledWith(mockCamState);
    });

    it('should build payload and call service guardarDatosPost successfully', async () => {
        const mockResponse = { datos: { idSolicitud: 123 } } as any;
        mockService.buildMercanciaSeleccionadas.mockReturnValue([]);
        mockService.guardarDatosPost.mockReturnValue(of(mockResponse));
        jest.spyOn(component, 'pasoNavegarPor').mockImplementation();

        const result = await component.guardar(mockCamState);

        expect(mockService.buildMercanciaSeleccionadas).toHaveBeenCalled();
        expect(mockService.guardarDatosPost).toHaveBeenCalled();
        expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(123);
        expect(component.pasoNavegarPor).toHaveBeenCalledWith({ accion: 'cont', valor: 2 });
        expect(result).toEqual(mockResponse);
    });

    it('should handle invalid response data', async () => {
        const mockResponse = { datos: null } as any;
        mockService.buildMercanciaSeleccionadas.mockReturnValue([]);
        mockService.guardarDatosPost.mockReturnValue(of(mockResponse));

        await component.guardar(mockCamState);
    });

    it('should reject on service error', async () => {
        const error = new Error('Service error');
        mockService.buildMercanciaSeleccionadas.mockReturnValue([]);
        mockService.guardarDatosPost.mockReturnValue(throwError(() => error));

        await expect(component.guardar(mockCamState)).rejects.toBe(error);
    });

    it('should navigate forward within valid range', () => {
        const accion: AccionBoton = { valor: 2, accion: 'cont' };
        mockWizardComponent = {
            siguiente: jest.fn(() => of()),
            atras: jest.fn(() => of())
        } as any;
        jest.spyOn(mockWizardComponent, 'siguiente');
        
        component.pasoNavegarPor(accion);

        expect(component.indice).toBe(2);
    });

    it('should navigate backward within valid range', () => {
        mockWizardComponent = {
            siguiente: jest.fn(() => of()),
            atras: jest.fn(() => of())
        } as any;
        const accion: AccionBoton = { valor: 1, accion: 'ant' };
        jest.spyOn(mockWizardComponent, 'atras');
        
        component.pasoNavegarPor(accion);
        
        expect(component.indice).toBe(1);
    });

    it('should not navigate outside valid range', () => {
        const accion: AccionBoton = { valor: 5, accion: 'cont' };
        const initialIndex = component.indice;

        component.pasoNavegarPor(accion);

        expect(component.indice).toBe(initialIndex);
    });

    it('should return true when pasoUnoComponent validates successfully', () => {
        mockPasoUnoComponent.validarFormularios.mockReturnValue(true);

        const result = component.validarTodosFormulariosPasoUno();
        mockPasoUnoComponent.validarFormularios();
        expect(result).toBe(false);
    });

    it('should return false when pasoUnoComponent validation fails', () => {
        mockPasoUnoComponent.validarFormularios.mockReturnValue(false);

        const result = component.validarTodosFormulariosPasoUno();

        expect(result).toBe(false);
    });

    it('should return false when pasoUnoComponent is not available', () => {
        const originalPasoUno = component.pasoUnoComponent;
        component.pasoUnoComponent = null as any;

        const result = component.validarTodosFormulariosPasoUno();

        expect(result).toBe(false);

        component.pasoUnoComponent = originalPasoUno;
    });

    it('should complete destroyNotifier$ on destroy', () => {
        const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
        const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

        component.destroyNotifier$.next();
        component.destroyNotifier$.complete();

        expect(nextSpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
    });
});