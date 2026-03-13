import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { LicitacionesVigentesComponent } from './licitaciones-vigentes.component';
import { LicitacionesDisponiblesService } from '../../services/licitaciones-disponibles.service';
import { Tramite120501Store } from '../../estados/tramites/tramite120501.store';
import { Tramite120501Query } from '../../estados/queries/tramite120501.query';
import { ConsultaioQuery, LoginQuery } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { AlertComponent } from '@ng-mf/data-access-user';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LicitacionesVigentesComponent', () => {
    let component: LicitacionesVigentesComponent;
    let fixture: ComponentFixture<LicitacionesVigentesComponent>;
    let mockService: jest.Mocked<LicitacionesDisponiblesService>;
    let mockStore: jest.Mocked<Tramite120501Store>;
    let mockQuery: jest.Mocked<Tramite120501Query>;
    let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
    let mockLoginQuery: jest.Mocked<LoginQuery>;

    const mockCatalogData = {
        codigo: '00',
        datos: [
            { clave: '1', descripcion: 'Test Entity' }
        ]
    } as any;

    const mockLicitacionData = {
        codigo: '00',
        datos: {
            licitaciones: [
                { idAsignacion: 1, numeroLicitacion: 'TEST-001' }
            ]
        }
    } as any;

    const mockLicitacionFormData = {
        codigo: '00',
        datos: {
            licitacionPublica: {
                numeroLicitacion: 'TEST-001',
                fechaConcurso: '2023-01-01',
                producto: 'Test Product',
                unidadMedidaTarifaria: 'KG',
                fechaInicioVigencia: '2023-01-01T00:00:00',
                fechaFinVigencia: '2023-12-31T23:59:59',
                fundamento: 'Test Fundamento',
                bloqueComercial: 'TLCAN',
                paises: 'Mexico',
                cantidadMaxima: 1000,
                idMecanismoAsignacion: 1
            },
            regimen: 'Importacion',
            fraccionArancelaria: '1234567890',
            maximoTransferir: 500,
            montoTransferir: 300,
            participantesLicitacion: [
                { rfc: 'TEST123456789', montoDisponible: 100 }
            ]
        }
    } as any;

    beforeEach(async () => {
        const serviceSpy = {
            entidadesFederativasCatalogo: jest.fn(),
            representacionFederalCatalogo: jest.fn(),
            getLicitacionesDisponiblesData: jest.fn(),
            getLicitacionesFormData: jest.fn(),
            fetchRFCData: jest.fn()
        } as any;

        const storeSpy = {
            actualizarEstado: jest.fn()
        } as any;

        const querySpy = {
            selectSolicitud$: of({})
        } as jest.Mocked<Tramite120501Query>;

        const consultaioQuerySpy = {
            selectConsultaioState$: of({ readonly: false })
        } as jest.Mocked<ConsultaioQuery>;

        const loginQuerySpy = {
            selectLoginState$: of({ rfc: 'TEST123456789' })
        } as jest.Mocked<LoginQuery>;

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                TituloComponent,
                CatalogoSelectComponent,
                AlertComponent,
                TablaDinamicaComponent,
                LicitacionesVigentesComponent,
                HttpClientTestingModule
            ],
            providers: [
                FormBuilder,
                { provide: LicitacionesDisponiblesService, useValue: serviceSpy },
                { provide: Tramite120501Store, useValue: storeSpy },
                { provide: Tramite120501Query, useValue: querySpy },
                { provide: ConsultaioQuery, useValue: consultaioQuerySpy },
                { provide: LoginQuery, useValue: loginQuerySpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LicitacionesVigentesComponent);
        component = fixture.componentInstance;
        mockService = TestBed.inject(LicitacionesDisponiblesService) as jest.Mocked<LicitacionesDisponiblesService>;
        mockStore = TestBed.inject(Tramite120501Store) as jest.Mocked<Tramite120501Store>;
        mockQuery = TestBed.inject(Tramite120501Query) as jest.Mocked<Tramite120501Query>;
        mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
        mockLoginQuery = TestBed.inject(LoginQuery) as jest.Mocked<LoginQuery>;

        mockService.entidadesFederativasCatalogo.mockReturnValue(of(mockCatalogData));
        mockService.getLicitacionesDisponiblesData.mockReturnValue(of(mockLicitacionData));
        mockService.getLicitacionesFormData.mockReturnValue(of(mockLicitacionFormData));
        mockService.representacionFederalCatalogo.mockReturnValue(of(mockCatalogData));
        mockService.fetchRFCData.mockReturnValue(of({ rfc: 'TEST123', montoAdjudicado: 100 }));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize component on ngOnInit', () => {
        jest.spyOn(component, 'inicializarEstadoFormulario');
        jest.spyOn(component, 'getEntidadFederativa');
        jest.spyOn(component, 'obtenerDatosDeTabla');

        component.ngOnInit();

        expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
        expect(component.getEntidadFederativa).toHaveBeenCalled();
        expect(component.obtenerDatosDeTabla).toHaveBeenCalled();
    });

    it('should get entidad federativa catalog', () => {
        component.getEntidadFederativa();

        expect(mockService.entidadesFederativasCatalogo).toHaveBeenCalled();
        expect(component.entidadFederativaOptions).toEqual(mockCatalogData.datos);
    });

    it('should get representacion federal catalog', () => {
        const cveEntidad = '01';
        component.getRepresentacionFederal(cveEntidad);

        expect(mockService.representacionFederalCatalogo).toHaveBeenCalledWith(expect.any(String), cveEntidad);
        expect(component.representacionFederalOptions).toEqual(mockCatalogData.datos);
    });

    it('should obtain table data', () => {
        component.obtenerDatosDeTabla();

        expect(mockService.getLicitacionesDisponiblesData).toHaveBeenCalledWith(component.loginRfc);
    });

    it('should fill form with licitacion data', () => {
        const idAsignacion = 1;
        jest.spyOn(component.detalledelaLicitacionForm, 'patchValue');
        
        component.fillFormLicitacionesFormData(idAsignacion);

        expect(mockService.getLicitacionesFormData).toHaveBeenCalled();
        expect(mockStore.actualizarEstado).toHaveBeenCalled();
    });

    it('should set valores store', () => {
        component.inicializarFormulario();
        const campo = 'entidadFederativa';
        const valor = '01';
        component.formulario.get(campo)?.setValue(valor);

        component.setValoresStore(component.formulario, campo);

        expect(mockStore.actualizarEstado).toHaveBeenCalledWith({ [campo]: valor });
    });

    it('should open modificar modal when not readonly', () => {
        component.esFormularioSoloLectura = false;
        const evento = { idAsignacion: 1 };
        jest.spyOn(component, 'fillFormLicitacionesFormData');

        component.abrirModificarModal(evento as any);

        expect(component.fillFormLicitacionesFormData).toHaveBeenCalledWith(1);
    });

    it('should not open modificar modal when readonly', () => {
        component.esFormularioSoloLectura = true;
        const evento = { idAsignacion: 1 };
        jest.spyOn(component, 'fillFormLicitacionesFormData');

        component.abrirModificarModal(evento as any);

        expect(component.fillFormLicitacionesFormData).not.toHaveBeenCalled();
    });

    it('should show seleccionar participante', () => {
        component.seleccionarParticipante();

        expect(component.showSeleccionarParticipante).toBe(true);
    });

    it('should agregar RFC1', () => {
        component.inicializarFormulario();
        component.adquiriente.get('rfc1')?.setValue('TEST123456789');

        component.agregarRFC1();

        expect(mockService.fetchRFCData).toHaveBeenCalledWith('TEST123456789', 0);
    });

    it('should mover RFC1', () => {
        component.inicializarFormulario();
        const selectedEntry = { rfc: 'TEST123', montoDisponible: 100 };
        component.datosParticipantes = [selectedEntry];
        jest.spyOn(component.adquiriente.get('rfc')!, 'setValue');

        component.moverRFC1(selectedEntry);

        expect(component.adquiriente.get('rfc')!.setValue).toHaveBeenCalledWith('TEST123');
        expect(component.datosParticipantes.length).toBe(0);
        expect(mockStore.actualizarEstado).toHaveBeenCalled();
    });

    it('should validate formulario - valid case', () => {
        component.inicializarFormulario();
        component.formulario.get('entidadFederativa')?.setValue('01');
        component.formulario.get('representacionFederal')?.setValue('01');
        component.adquiriente.get('montoRecibir')?.setValue(100);

        const result = component.validarFormulario();

        expect(result).toBe(true);
    });

    it('should validate formulario - invalid case', () => {
        component.inicializarFormulario();
        jest.spyOn(component.adquiriente, 'markAllAsTouched');
        jest.spyOn(component.formulario, 'markAllAsTouched');

        const result = component.validarFormulario();

        expect(result).toBe(false);
        expect(component.adquiriente.markAllAsTouched).toHaveBeenCalled();
        expect(component.formulario.markAllAsTouched).toHaveBeenCalled();
    });

    it('should check if control is invalid', () => {
        component.inicializarFormulario();
        const control = component.adquiriente.get('montoRecibir');
        control?.markAsTouched();
        control?.setErrors({ required: true });

        const result = component.isInvalid('montoRecibir');

        expect(result).toBe(true);
    });

    it('should handle getValorIndice with valid wizard component', () => {
        const mockWizardComponent = {
            siguiente: jest.fn(),
            atras: jest.fn()
        } as any;
        component.wizardComponent = mockWizardComponent;

        component.getValorIndice({ accion: 'cont', valor: 2 });

        expect(component.indice).toBe(2);
        expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    });

    it('should handle getValorIndice with atras action', () => {
        const mockWizardComponent = {
            siguiente: jest.fn(()=> of()),
            atras: jest.fn(()=> of())
        } as any;
        component.wizardComponent = mockWizardComponent;

        component.getValorIndice({ accion: 'atras', valor: 1 });

        expect(component.indice).toBe(1);
        expect(mockWizardComponent.atras).toHaveBeenCalled();
    });

    it('should clean up on destroy', () => {
        const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
        const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

        component.ngOnDestroy();

        expect(destroyedSpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
    });

    it('should initialize form in readonly mode', () => {
        component.esFormularioSoloLectura = true;
        jest.spyOn(component, 'guardarDatosFormulario');

        component.inicializarEstadoFormulario();

        expect(component.guardarDatosFormulario).toHaveBeenCalled();
    });

    it('should disable forms when guardarDatosFormulario called in readonly mode', () => {
        component.esFormularioSoloLectura = true;
        jest.spyOn(component, 'inicializarFormulario');
        
        component.guardarDatosFormulario();

        expect(component.inicializarFormulario).toHaveBeenCalled();
    });
});