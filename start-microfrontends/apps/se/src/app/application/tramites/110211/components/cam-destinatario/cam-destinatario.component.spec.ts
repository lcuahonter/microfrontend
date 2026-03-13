import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CamDestinatarioComponent } from './cam-destinatario.component';
import { camCertificadoStore } from '../../estados/cam-certificado.store';
import { camCertificadoQuery } from '../../estados/cam-certificado.query';
import { ConsultaioQuery, SeccionLibQuery, TituloComponent } from '@ng-mf/data-access-user';
import { DatosDelDestinatarioComponent } from '../../../../shared/components/datos-del-destinatario/datos-del-destinatario.component';
import { DestinatarioComponent } from '../../../../shared/components/destinatario/destinatario.component';
import { RepresentanteLegalExportadorComponent } from '../../../../shared/components/representante-legal-exportador/representante-legal-exportador.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CamDestinatarioComponent', () => {
    let component: CamDestinatarioComponent;
    let fixture: ComponentFixture<CamDestinatarioComponent>;
    let mockStore: jest.Mocked<camCertificadoStore>;
    let mockQuery: jest.Mocked<camCertificadoQuery>;
    let mockSeccionQuery: jest.Mocked<SeccionLibQuery>;
    let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
    let formBuilder: FormBuilder;

    beforeEach(async () => {
        mockStore = {
            setFormDatosDelDestinatario: jest.fn(()=> of()),
            setFormDestinatario: jest.fn(()=> of()),
            setFormValida: jest.fn(()=> of()),
            setGrupoRepresentativoNombreExportador: jest.fn(()=> of()),
        } as any;

        mockQuery = {
            selectFormDatosDelDestinatario$: of({}),
            selectFormDestinatario$: of({}),
            selectCam$: of({}),
            selectGrupoRepresentativo$: of({
                lugar: '',
                nombreExportador: '',
                empresa: '',
                cargo: '',
                lada: '',
                telefono: '',
                fax: '',
                correoElectronico: '',
            }),
        } as any;

        mockSeccionQuery = {
            selectSeccionState$: of({ readonly: false })
        } as any;

        mockConsultaioQuery = {
            selectConsultaioState$: of({ readonly: false })
        } as any;

        await TestBed.configureTestingModule({
            imports: [CamDestinatarioComponent,
                CommonModule,
                ReactiveFormsModule,
                DatosDelDestinatarioComponent,
                TituloComponent,
                DestinatarioComponent,
                RepresentanteLegalExportadorComponent,
                HttpClientTestingModule
            ],
            providers: [
                FormBuilder,
                { provide: camCertificadoStore, useValue: mockStore },
                { provide: camCertificadoQuery, useValue: mockQuery },
                { provide: SeccionLibQuery, useValue: mockSeccionQuery },
                { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CamDestinatarioComponent);
        component = fixture.componentInstance;
        formBuilder = TestBed.inject(FormBuilder);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.esFormularioSoloLectura).toBe(false);
        expect(component.idProcedimiento).toBe(110211);
    });

    it('should subscribe to form data streams in constructor', () => {
        const testFormData = { campo1: 'valor1' };
        mockQuery.selectFormDatosDelDestinatario$ = of(testFormData);
        mockQuery.selectFormDestinatario$ = of(testFormData);

        const newComponent = new CamDestinatarioComponent(
            formBuilder,
            mockStore,
            mockQuery,
            mockSeccionQuery,
            mockConsultaioQuery
        );

        expect(newComponent.formDatosDelDestinatarioValues).toEqual(testFormData);
        expect(newComponent.formDestinatarioValues).toEqual(testFormData);
    });

    it('should set readonly state from consultaio query', () => {
        mockConsultaioQuery.selectConsultaioState$ = of({
            readonly: true,
            procedureId: '123',
            parameter: 'test',
            department: 'HR',
            folioTramite: '456',
            tipoDeTramite: 'type',
            estadoDeTramite: 'state',
            create: true,
            update: false,
            consultaioSolicitante: null,
            action_id: 'action_1',
            current_user: 'user_1',
            id_solicitud: 'solicitud_1',
            nombre_pagina: 'pagina_1',
            idSolicitudSeleccionada: 'solicitud_2'
        });

        new CamDestinatarioComponent(
            formBuilder,
            mockStore,
            mockQuery,
            mockSeccionQuery,
            mockConsultaioQuery
        );

        expect(component.esFormularioSoloLectura).toBe(false); // Initial value before subscription
    });

    it('should call store method dynamically in setValoresStore1', () => {
        const testMethod = 'testMethod';
        const testValue = 'testValue';

        (mockStore as any)[testMethod] = jest.fn();

        component.setValoresStore1({
            formGroupName: 'test',
            campo: 'test',
            VALOR: testValue,
            METODO_NOMBRE: testMethod
        });

        expect((mockStore as any)[testMethod]).toHaveBeenCalledWith(testValue);
    });

    it('should handle setValoresStoreRepresentante', () => {
        const event = {
            formGroupName: 'test',
            campo: 'nombre',
            VALOR: 'Juan Perez',
            METODO_NOMBRE: 'test'
        };

        component.setValoresStoreRepresentante(event);

        expect(mockStore.setGrupoRepresentativoNombreExportador).toHaveBeenCalledWith({
            nombre: 'Juan Perez'
        });
    });

    it('should update store in datosDelDestinatarioFunc', () => {
        const testData = { nombre: 'test', email: 'test@test.com' };

        component.datosDelDestinatarioFunc(testData);

        expect(mockStore.setFormDatosDelDestinatario).toHaveBeenCalledWith(testData);
    });

    it('should update store in setValoresStoreDatos', () => {
        const event = {
            formGroupName: 'test',
            campo: 'nombre',
            valor: 'Juan',
            storeStateName: 'test'
        };

        component.setValoresStoreDatos(event);

        expect(mockStore.setFormDatosDelDestinatario).toHaveBeenCalledWith({
            nombre: 'Juan'
        });
    });

    it('should update store in setValoresStoreDe', () => {
        const event = {
            formGroupName: 'test',
            campo: 'direccion',
            valor: 'Calle 123',
            storeStateName: 'test'
        };

        component.setValoresStoreDe(event);

        expect(mockStore.setFormDestinatario).toHaveBeenCalledWith({
            direccion: 'Calle 123'
        });
    });

    it('should update form validation in setFormValida', () => {
        component.setFormValida(true);

        expect(mockStore.setFormValida).toHaveBeenCalledWith({
            destinatrio: true
        });
    });

    it('should update form validation in setFormValidaDestinatario', () => {
        component.setFormValidaDestinatario(false);

        expect(mockStore.setFormValida).toHaveBeenCalledWith({
            datosDestinatario: false
        });
    });

    it('should handle setValoresStore with form group', () => {
        const form = formBuilder.group({
            testField: 'testValue'
        });
        const methodName = 'setFormDatosDelDestinatario' as keyof camCertificadoStore;

        component.setValoresStore(form, 'testField', methodName);

        expect(mockStore[methodName]).toHaveBeenCalledWith('testValue');
    });

    it('should validate all child components in validarFormularios', () => {
        const mockDatosComponent = {
            validarFormularios: jest.fn().mockReturnValue(true)
        } as any;
        const mockDestinatarioComp = {
            validarFormularios: jest.fn().mockReturnValue(true)
        } as any;
        const mockRepresentanteComp = {
            validarFormularios: jest.fn().mockReturnValue(true)
        } as any;

        component.datosDelDestinatarioComponent = mockDatosComponent;
        component.destinatarioComponent = mockDestinatarioComp;
        component.representanteLegalExportadorComponent = mockRepresentanteComp;

        const result = component.validarFormularios();

        expect(result).toBeTruthy();
        expect(mockDatosComponent.validarFormularios).toHaveBeenCalled();
        expect(mockDestinatarioComp.validarFormularios).toHaveBeenCalled();
        expect(mockRepresentanteComp.validarFormularios).toHaveBeenCalled();
    });

    it('should return false when any child component is invalid', () => {
        const mockDatosComponent = {
            validarFormularios: jest.fn().mockReturnValue(false)
        } as any;

        component.datosDelDestinatarioComponent = mockDatosComponent;

        const result = component.validarFormularios();

        expect(result).toBe(false);
    });

    it('should return false when child components are not available', () => {
        component.datosDelDestinatarioComponent = undefined as any;
        component.destinatarioComponent = undefined as any;
        component.representanteLegalExportadorComponent = undefined as any;

        const result = component.validarFormularios();

        expect(result).toBe(false);
    });

    it('should complete destroy notifier on ngOnDestroy', () => {
        const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
        const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

        component.ngOnDestroy();

        expect(nextSpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
    });
});