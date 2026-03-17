import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { of, throwError, Subject } from 'rxjs';
import { Modal } from 'bootstrap';
import { CertificadoOrigenComponent } from './certificado-origen.component';
import { CamCertificadoService } from '../../services/cam-certificado.service';
import { camCertificadoStore } from '../../estados/cam-certificado.store';
import { camCertificadoQuery } from '../../estados/cam-certificado.query';
import { SeccionLibQuery, ConsultaioQuery, Catalogo } from '@libs/shared/data-access-user/src';
import { CertificadoDeOrigenComponent } from '../../../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { MercanciaComponent } from '../../../../shared/components/mercancia/mercancia.component';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

const mockModalInstance = {
    show: jest.fn(() => of()),
    hide: jest.fn(() => of())
};

(global as any).Modal = jest.fn().mockImplementation(() => mockModalInstance);

describe('CertificadoOrigenComponent', () => {
    let component: CertificadoOrigenComponent;
    let fixture: ComponentFixture<CertificadoOrigenComponent>;
    let mockCamCertificadoService: jest.Mocked<CamCertificadoService>;
    let mockStore: jest.Mocked<camCertificadoStore>;
    let mockQuery: jest.Mocked<camCertificadoQuery>;
    let mockToastr: jest.Mocked<ToastrService>;
    let mockSeccionQuery: jest.Mocked<SeccionLibQuery>;
    let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
    let mockCertificadoDeOrigenComponent: jest.Mocked<CertificadoDeOrigenComponent>;
    let mockMercanciaComponent: jest.Mocked<MercanciaComponent>;

    const mockCatalogo: Catalogo[] = [
        { id: 1, clave: 'MX', descripcion: 'México' },
        { id: 2, clave: 'US', descripcion: 'Estados Unidos' }
    ];

    const mockMercancia: Mercancia = {
        id: 1,
        fraccionArancelaria: '12345678',
        numeroDeRegistrodeProductos: 'REG001',
        numeroRegistroProducto: 'PROD001',
        fechaExpedicion: '2024-01-01',
        fechaVencimiento: '2024-12-31',
        nombreTecnico: 'Producto Técnico',
        nombreComercial: 'Producto Comercial',
        fraccionNaladi: 'NAL001',
        fraccionNaladiSa93: 'SA93001',
        fraccionNaladiSa96: 'SA96001',
        fraccionNaladiSa02: 'SA02001',
        criterioParaConferirOrigen: 'Criterio A',
        valorDeContenidoRegional: '60%',
        normaOrigen: 'TLCAN',
        cantidad: '100',
        umc: 'KG',
        tipoFactura: 'Comercial',
        valorMercancia: '1000',
        fechaFinalInput: '2024-06-01',
        numeroFactura: 'FAC001',
        unidadMedidaMasaBruta: 'KG',
        complementoClasificacion: 'Complemento',
        complementoDescripcion: 'Descripción',
        nalad: 'NALAD001',
        fechaFactura: '2024-01-15',
        marca: 'Marca Test',
        nombreIngles: 'English Name',
        otrasInstancias: 'Otras',
        criterioParaTratoPreferencial: 'Preferencial',
        numeroDeSerie: 'SER001'
    };

    const mockCamState = {
        estado: { clave: 'MX', descripcion: 'México' },
        paisBloques: [{ clave: 'US', descripcion: 'Estados Unidos' }],
        disponiblesDatos: [mockMercancia],
        mercanciaTabla: [mockMercancia]
    };

    beforeEach(async () => {
        const camCertificadoServiceSpy = {
            obtenerMenuDesplegable: jest.fn(),
            buscarMercanciasCert: jest.fn()
        } as any;

        const storeSpy = {
            setFormCertificadoGenric: jest.fn(),
            setFormCertificado: jest.fn(),
            setEstado: jest.fn(),
            setBloque: jest.fn(),
            setFormMercancia: jest.fn(),
            setMercanciaSeleccionadasDatos: jest.fn(),
            setDisponsiblesDatos: jest.fn(),
            setMercanciaTabla: jest.fn(),
            setFormValida: jest.fn()
        } as any;

        const querySpy = {
            formCertificado$: of({
                si: false,
                entidadFederativa: '',
                bloque: '',
                fraccionArancelariaForm: '',
                registroProductoForm: '',
                nombreComercialForm: '',
                fechaInicioInput: '',
                fechaFinalInput: '',
                nombres: '',
                primerApellido: '',
                segundoApellido: '',
                numeroDeRegistroFiscal: '',
                razonSocial: '',
                pais: '',
                calle: '',
                numeroLetra: '',
                ciudad: '',
                lada: '',
                telefono: '',
                fax: '',
                correo: ''
            }),
            selectCam$: of(mockCamState)
        } as any;

        const toastrSpy = {
            error: jest.fn()
        } as any;

        const seccionQuerySpy = {
            selectSeccionState$: of({}),
            formCertificado$: of({})
        } as any;

        const consultaioQuerySpy = {
            selectConsultaioState$: of({ readonly: false })
        } as any;

        const certificadoDeOrigenComponentSpy = {
            validarFormularios: jest.fn()
        } as any;

        const mercanciaComponentSpy = {} as any;

        await TestBed.configureTestingModule({
            imports: [CertificadoOrigenComponent, CommonModule, HttpClientTestingModule, ToastrModule.forRoot()],
            providers: [
                { provide: CamCertificadoService, useValue: camCertificadoServiceSpy },
                { provide: camCertificadoStore, useValue: storeSpy },
                { provide: camCertificadoQuery, useValue: querySpy },
                { provide: ToastrService, useValue: toastrSpy },
                { provide: SeccionLibQuery, useValue: seccionQuerySpy },
                { provide: ConsultaioQuery, useValue: consultaioQuerySpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CertificadoOrigenComponent);
        component = fixture.componentInstance;

        mockCamCertificadoService = TestBed.inject(CamCertificadoService) as jest.Mocked<CamCertificadoService>;
        mockStore = TestBed.inject(camCertificadoStore) as jest.Mocked<camCertificadoStore>;
        mockQuery = TestBed.inject(camCertificadoQuery) as jest.Mocked<camCertificadoQuery>;
        mockToastr = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
        mockSeccionQuery = TestBed.inject(SeccionLibQuery) as jest.Mocked<SeccionLibQuery>;
        mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;

        component.certificadoDeOrigenComponent = certificadoDeOrigenComponentSpy;
        component.mercanciaComponent = mercanciaComponentSpy;
        mockCertificadoDeOrigenComponent = certificadoDeOrigenComponentSpy;
        mockMercanciaComponent = mercanciaComponentSpy;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.estado).toEqual([]);
        expect(component.pais).toEqual([]);
        expect(component.disponiblesDatos).toEqual([]);
        expect(component.fromMercanciasDisponibles).toBe(false);
        expect(component.mercanciasDisponibles).toBe(true);
        expect(component.cargoDeMercancias).toBe(true);
        expect(component.idProcedimiento).toBe(110211);
        expect(component.datosTabla$).toEqual([]);
        expect(component.datosTablaUno$).toEqual([]);
        expect(component.operador).toBe(true);
        expect(component.tablaSeleccionEvent).toBe(false);
        expect(component.esFormularioSoloLectura).toBe(false);
    });


    it('should subscribe to section state and cam state', () => {
        component.ngOnInit();

        expect(component.datosTablaUno$).toEqual(mockCamState.disponiblesDatos);
        expect(component.datosTabla$).toEqual(mockCamState.mercanciaTabla);
    });


    it('should call store.setFormCertificadoGenric with correct parameters', () => {
        const event = {
            formGroupName: 'test',
            campo: 'testField',
            valor: 'testValue',
            storeStateName: 'testState'
        };

        component.setValoresStore(event);

        expect(mockStore.setFormCertificadoGenric).toHaveBeenCalledWith({ testField: 'testValue' });
    });

    beforeEach(() => {
        component['certificadoState'] = mockCamState as any;
    });

    it('should fetch and map mercancia data successfully', () => {
        const mockResponse = {
            datos: [{
                idMercancia: 1,
                fraccionArancelaria: '12345678',
                nombreTecnico: 'Test Product',
                tratadoAplicable: { nombreTratado: 'TLCAN' }
            }]
        };

        mockCamCertificadoService.buscarMercanciasCert.mockReturnValue(of(mockResponse as any));

        component.conseguirDisponiblesDatos();

        expect(mockCamCertificadoService.buscarMercanciasCert).toHaveBeenCalled();
        expect(mockStore.setDisponsiblesDatos).toHaveBeenCalled();
    });

    it('should handle error and show toastr message', () => {
        mockCamCertificadoService.buscarMercanciasCert.mockReturnValue(throwError(() => new Error('Error')));

        component.conseguirDisponiblesDatos();

        expect(mockToastr.error).toHaveBeenCalledWith('Error al buscar Mercancia');
    });

    it('should update datosTabla$ with provided data', () => {
        const mercancias = [mockMercancia];

        component.guardarClicado(mercancias);

        expect(component.datosTabla$).toEqual(mercancias);
    });

    it('should call store.setFormCertificado with form data', () => {
        const formData = { field1: 'value1', field2: 'value2' };

        component.obtenerDatosFormulario(formData);

        expect(mockStore.setFormCertificado).toHaveBeenCalledWith(formData);
    });

    it('should call store.setEstado with selected estado', () => {
        const estado = mockCatalogo[0];

        component.tipoEstadoSeleccion(estado);

        expect(mockStore.setEstado).toHaveBeenCalledWith(estado);
    });

    it('should call store.setBloque with selected estado in array', () => {
        const estado = mockCatalogo[0];

        component.tipoSeleccion(estado);

        expect(mockStore.setBloque).toHaveBeenCalledWith([estado]);
    });

    it('should set selected data and show modal', () => {
        const mockModal = { show: jest.fn() } as any;
        component.modalInstance = mockModal;

        component.abrirModificarModal(mockMercancia, true);

        expect(component.datosSeleccionados).toEqual(mockMercancia);
        expect(component.fromMercanciasDisponibles).toBe(true);
        expect(mockStore.setFormMercancia).toHaveBeenCalledWith({ ...mockMercancia });
        expect(mockStore.setMercanciaSeleccionadasDatos).toHaveBeenCalledWith([mockMercancia]);
        expect(mockModal.show).toHaveBeenCalled();
    });

    it('should not show modal if modalInstance is not available', () => {
        component.modalInstance = undefined as any;

        component.abrirModificarModal(mockMercancia, true);

        expect(component.datosSeleccionados).toEqual(mockMercancia);
    });

    it('should hide modal and set tablaSeleccionEvent to true', () => {
        const mockModal = { hide: jest.fn() } as any;
        component.modalInstance = mockModal;

        component.cerrarModificarModal();

        expect(component.tablaSeleccionEvent).toBe(true);
        expect(mockModal.hide).toHaveBeenCalled();
    });

    it('should not change tablaSeleccionEvent if modalInstance is not available', () => {
        component.modalInstance = undefined as any;
        component.tablaSeleccionEvent = false;

        component.cerrarModificarModal();

        expect(component.tablaSeleccionEvent).toBe(false);
    });

    it('should initialize modal instance when modifyModal is available', () => {
        const mockElementRef = {
            nativeElement: document.createElement('div')
        } as ElementRef;
        component.modifyModal = mockElementRef;

        component.ngAfterViewInit();

        expect(component.modalInstance).toBeDefined();
    });

    it('should call conseguirDisponiblesDatos when esFormularioSoloLectura is true', () => {
        component.esFormularioSoloLectura = true;
        jest.spyOn(component, 'conseguirDisponiblesDatos').mockImplementation(() => { });

        component.ngAfterViewInit();

        expect(component.conseguirDisponiblesDatos).toHaveBeenCalled();
    });

    it('should call store.setMercanciaTabla with mercancia in array', () => {
        component.emitmercaniasDatos(mockMercancia);

        expect(mockStore.setMercanciaTabla).toHaveBeenCalledWith([mockMercancia]);
    });

    it('should call store.setFormValida with validation state', () => {
        component.setFormValida(true);

        expect(mockStore.setFormValida).toHaveBeenCalledWith({ certificado: true });
    });

    it('should return true when certificado component validation passes', () => {
        mockCertificadoDeOrigenComponent.validarFormularios.mockReturnValue(true);

        const result = component.validarFormularios();

        expect(result).toBe(true);
        expect(mockCertificadoDeOrigenComponent.validarFormularios).toHaveBeenCalled();
    });

    it('should return false when certificado component validation fails', () => {
        mockCertificadoDeOrigenComponent.validarFormularios.mockReturnValue(false);

        const result = component.validarFormularios();

        expect(result).toBe(false);
        expect(mockCertificadoDeOrigenComponent.validarFormularios).toHaveBeenCalled();
    });

    it('should complete destroyNotifier$ subject', () => {
        jest.spyOn(component['destroyNotifier$'], 'next');
        jest.spyOn(component['destroyNotifier$'], 'complete');

        component.ngOnDestroy();

        expect(component['destroyNotifier$'].next).toHaveBeenCalled();
        expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
    });
});
