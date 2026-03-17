import { TestBed } from '@angular/core/testing';
import { DestinatarioDeComponent } from './destinatario-de.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite110207Store } from '../../state/Tramite110207.store';
import { Tramite110207Query } from '../../state/Tramite110207.query';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DestinatarioService } from '../../../../shared/services/destinatario.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DestinatarioComponent } from '../../../../shared/components/destinatario/destinatario.component';
import { DatosDelDestinatarioComponent } from '../../../../shared/components/datos-del-destinatario/datos-del-destinatario.component';
import { DetallesDelTransporteComponent } from '../../../../shared/components/detalles-del-transporte/detalles-del-transporte.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('DestinatarioDeComponent', () => {
    let component: DestinatarioDeComponent;
    let fixture: any;
    let storeMock: jest.Mocked<Tramite110207Store>;
    let tramiteQueryMock: Partial<Tramite110207Query>;
    let seccionQueryMock: Partial<SeccionLibQuery>;
    let seccionStoreMock: Partial<SeccionLibStore>;
    let consultaQueryMock: Partial<ConsultaioQuery>;
    let destinatarioServiceMock: Partial<DestinatarioService>;

    beforeEach(async () => {
        storeMock = {
            setDestinatarioForm: jest.fn(() => of()),
            setFormDestinatario: jest.fn(() => of()),
            setFormDatosDelDestinatario: jest.fn(() => of()),
            setMedioDeTransporteSeleccion: jest.fn(() => of()),
            setPaisDestinSeleccion: jest.fn(() => of()),
        } as any;

        tramiteQueryMock = {
            selectDestinatarioForm$: of({ medioDeTransporte: 'Aereo' }),
            selectFormDestinatario$: of({ nombre: 'Juan' }),
            selectFormDatosDelDestinatario$: of({ apellido: 'Perez' }),
            selectPaisDestino$: of([]),
            selectMedioDeTransporte$: of([]),
        };

        seccionQueryMock = {
            selectSeccionState$: of({ seccion: [true], formaValida: [true] }),
        };

        seccionStoreMock = {};

        consultaQueryMock = {
            selectConsultaioState$: of({
             procedureId: '',
              parameter: '',
              department: '',
              folioTramite: '',
              tipoDeTramite: '',
              estadoDeTramite: '',
              readonly: true,
              create: true,
              update: true,
              consultaioSolicitante: null,
              action_id: '',
              current_user: '',
              id_solicitud: '',
              nombre_pagina: '',
              idSolicitudSeleccionada: '',
            }),
        };

        destinatarioServiceMock = {
            getPaisDestino: jest.fn(() => of()),
            getTransporte: jest.fn(() => of()),
        };

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                CommonModule,
                DestinatarioComponent,
                DatosDelDestinatarioComponent,
                DetallesDelTransporteComponent,
                HttpClientTestingModule,
                DestinatarioDeComponent,
                ToastrModule.forRoot(),
            ],
            declarations: [],
            providers: [
                FormBuilder,
                { provide: Tramite110207Store, useValue: storeMock },
                { provide: Tramite110207Query, useValue: tramiteQueryMock },
                { provide: SeccionLibQuery, useValue: seccionQueryMock },
                { provide: SeccionLibStore, useValue: seccionStoreMock },
                { provide: ConsultaioQuery, useValue: consultaQueryMock },
                { provide: DestinatarioService, useValue: destinatarioServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DestinatarioDeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with medioDeTransporte control', () => {
        expect(component.destinatarioForm.contains('medioDeTransporte')).toBeTruthy();
    });

    it('should set esFormularioSoloLectura from consultaQuery', () => {
        component.ngOnInit();
        expect(component.esFormularioSoloLectura).toBe(false);
    });

    it('should validateAll return true when all forms are valid', () => {
        component.destinatarioForm.setValue({ medioDeTransporte: 'Aereo' });
        component.destinatarioForm.markAsTouched();
        component.destinatarioForm.markAsDirty();
       component.destinatarioComponent = {
            markAllFieldsTouched: jest.fn(),
            formDestinatario: { valid: true }
        } as any;
        component.datosDelDestinatarioComponent = {
            markAllFieldsTouched: jest.fn(),
            formDatosDelDestinatario: { valid: true }
        } as any;
        expect(component.validateAll()).toBeTruthy();
    });

    it('should validateAll return false when destinatarioForm is invalid', () => {
        component.destinatarioForm.get('medioDeTransporte')?.setValue('');
        component.destinatarioForm.get('medioDeTransporte')?.markAsTouched();
        component.destinatarioForm.get('medioDeTransporte')?.markAsDirty();
        component.destinatarioForm.get('medioDeTransporte')?.setErrors({ required: true });
        expect(component.validateAll()).toBeFalsy();
    });

    it('should call setFormValida and setFormValidaDestinatario', () => {
        component.setFormValida(true);
        expect(component.datosDelDestinatarioValido).toBeTruthy();
        component.setFormValidaDestinatario(false);
        expect(component.destinatarioValido).toBeFalsy();
    });

    it('should call store.setFormDatosDelDestinatario in setValoresStore', () => {
        component.setValoresStore({
            formGroupName: 'datos',
            campo: 'nombre',
            valor: undefined,
            storeStateName: 'datosDelDestinatario'
        });
        expect(storeMock.setFormDatosDelDestinatario).toHaveBeenCalledWith({ nombre: undefined });
    });

    it('should call store.setFormDestinatario in setValoresStoreDe', () => {
        component.setValoresStoreDe({
            formGroupName: 'destinatario',
            campo: 'apellido',
            valor: undefined,
            storeStateName: 'destinatario'
        });
        expect(storeMock.setFormDestinatario).toHaveBeenCalledWith({ apellido: undefined });
    });

    it('should call store.setFormDestinatario in formDestinatarioFunc', () => {
        component.formDestinatarioFunc({ nombre: 'Juan' });
        expect(storeMock.setFormDestinatario).toHaveBeenCalledWith({ nombre: 'Juan' });
    });

    it('should call store.setFormDatosDelDestinatario in detosDelDestinatarioFunc', () => {
        component.detosDelDestinatarioFunc({ apellido: 'Perez' });
        expect(storeMock.setFormDatosDelDestinatario).toHaveBeenCalledWith({ apellido: 'Perez' });
    });

    it('should call store.setMedioDeTransporteSeleccion in medioDeTransporteSeleccion', () => {
        const catalogo = { id: 1, nombre: 'Aereo' } as any;
        component.medioDeTransporteSeleccion(catalogo);
        expect(storeMock.setMedioDeTransporteSeleccion).toHaveBeenCalledWith(catalogo);
    });

    it('should call store.setPaisDestinSeleccion in paisDestinSeleccion', () => {
        const catalogo = { id: 2, nombre: 'Mexico' } as any;
        component.paisDestinSeleccion(catalogo);
        expect(storeMock.setPaisDestinSeleccion).toHaveBeenCalledWith(catalogo);
    });

    it('should complete destroyNotifier$ on ngOnDestroy', () => {
        const spyNext = jest.spyOn(component.destroyNotifier$, 'next');
        const spyComplete = jest.spyOn(component.destroyNotifier$, 'complete');
        component.ngOnDestroy();
        expect(spyNext).toHaveBeenCalled();
        expect(spyComplete).toHaveBeenCalled();
    });
});