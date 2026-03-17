import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';

// Mock services and dependencies
const mockFormBuilder = new FormBuilder();
const mockChangeDetectorRef = { detectChanges: jest.fn() } as any;
const mockDomSanitizer = { bypassSecurityTrustUrl: jest.fn() } as any;

describe('SolicitudComponent', () => {
    let component: SolicitudComponent;
    let fixture: ComponentFixture<SolicitudComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, CatalogoSelectComponent, TituloComponent, HttpClientTestingModule],
            declarations: [SolicitudComponent],
            providers: [
                { provide: FormBuilder, useValue: mockFormBuilder },
                { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
                { provide: DomSanitizer, useValue: mockDomSanitizer },
                // Provide other required services as needed
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Assign patentes before component instantiation to avoid undefined errors
        (SolicitudComponent.prototype as any).patentes = { patentes: [], rfcs: [] };
        fixture = TestBed.createComponent(SolicitudComponent);
        component = fixture.componentInstance;
        // Minimal form structure for testing
        component.FormSolicitud = mockFormBuilder.group({
            datosImportadorExportador: mockFormBuilder.group({}),
            datosServicio: mockFormBuilder.group({ fechasSeleccionadas: mockFormBuilder.array([]) }),
            despacho: mockFormBuilder.group({}),
            pedimento: mockFormBuilder.array([]),
            personasResponsablesDespacho: mockFormBuilder.array([]),
            lineasCaptura: mockFormBuilder.array([]),
            mercancia: mockFormBuilder.group({}),
            pagoCaptura: mockFormBuilder.group({}),
            vehiculo: mockFormBuilder.group({ itemsVehiculo: mockFormBuilder.array([]) }),
            transporteArriboSalida: mockFormBuilder.group({}),
        });
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should return datosImportadorExportador FormGroup', () => {
        expect(component.datosImportadorExportador).toBeInstanceOf(FormGroup);
    });

    it('should return datosServicio FormGroup', () => {
        expect(component.datosServicio).toBeInstanceOf(FormGroup);
    });

    it('should return despacho FormGroup', () => {
        expect(component.despacho).toBeInstanceOf(FormGroup);
    });

    it('should return pedimento FormArray', () => {
        expect(component.pedimento).toBeInstanceOf(FormArray);
    });

    it('should return personasResponsablesDespacho FormArray', () => {
        expect(component.personasResponsablesDespacho).toBeInstanceOf(FormArray);
    });

    it('should return lineasCaptura FormArray', () => {
        expect(component.lineasCaptura).toBeInstanceOf(FormArray);
    });

    it('should return mercancia FormGroup', () => {
        expect(component.mercancia).toBeInstanceOf(FormGroup);
    });

    it('should return pagoCaptura FormGroup', () => {
        expect(component.pagoCaptura).toBeInstanceOf(FormGroup);
    });

    it('should return vehiculo FormGroup', () => {
        expect(component.vehiculo).toBeInstanceOf(FormGroup);
    });

    it('should return itemsVehiculo FormArray', () => {
        expect(component.itemsVehiculo).toBeInstanceOf(FormArray);
    });

    it('should return fechasSeleccionadas FormArray', () => {
        expect(component.fechasSeleccionadas).toBeInstanceOf(FormArray);
    });

    it('should have default values for boolean flags', () => {
        expect(component.colapsable).toBe(false);
        expect(component.mostrarRangoFechas).toBe(false);
        expect(component.isApoderado).toBe(false);
        expect(component.masDeUnaPatente).toBe(false);
        expect(component.masDeUnaEmpresa).toBe(false);
        expect(component.activarCatalogoDespacho).toBe(false);
        expect(component.desactivarSelectSeccionAduanera).toBe(false);
        expect(component.desactivarSelectRecinto).toBe(false);
    });

    it('should have default monto values as 0', () => {
        expect(component.montoACubrir).toBe(0);
        expect(component.montoPorDia).toBe(0);
        expect(component.montoPagadoLineas).toBe(0);
    });

    it('should have default muestraCertificaciones as true', () => {
        expect(component.muestraCertificaciones).toBe(true);
    });

    it('should have default activarCatalogoTipoOperacion as true', () => {
        expect(component.activarCatalogoTipoOperacion).toBe(true);
    });

    it('should have default activarRelacionSociedad and activarEncargoConferido as false', () => {
        expect(component.activarRelacionSociedad).toBe(false);
        expect(component.activarEncargoConferido).toBe(false);
    });

    it('should have default certificacionesDisabled, certificacionOEADisabled, revisionDisabled as true', () => {
        expect(component.certificacionesDisabled).toBe(true);
        expect(component.certificacionOEADisabled).toBe(true);
        expect(component.revisionDisabled).toBe(true);
    });

    it('should have default horaInicioUnmarked and horaFinUnmarked as false', () => {
        expect(component.horaInicioUnmarked).toBe(false);
        expect(component.horaFinUnmarked).toBe(false);
    });

    it('should have default resetearFechaInicioTouch as false', () => {
        expect(component.resetearFechaInicioTouch).toBe(false);
    });

    it('should have default mostarSelectTipoDespacho as false', () => {
        expect(component.mostarSelectTipoDespacho).toBe(false);
    });

    // Tests for RFC clearing functionality
    describe('RFC Field Clearing', () => {
        beforeEach(() => {
            // Setup form controls for RFC testing
            component.datosImportadorExportador.addControl('RFCImpExp', mockFormBuilder.control(''));
            component.datosImportadorExportador.addControl('nombre', mockFormBuilder.control(''));
            component.datosImportadorExportador.addControl('programa', mockFormBuilder.control(false));
            component.datosImportadorExportador.addControl('desProgramaFomento', mockFormBuilder.control(''));
            component.datosImportadorExportador.addControl('checkIMMEX', mockFormBuilder.control(false));
            component.datosImportadorExportador.addControl('desImmex', mockFormBuilder.control(''));
            component.datosImportadorExportador.addControl('industriaAutomotriz', mockFormBuilder.control(false));
            component.datosImportadorExportador.addControl('desIndustrialAutomotriz', mockFormBuilder.control(''));
            component.datosImportadorExportador.addControl('tipoEmpresaCertificadaA', mockFormBuilder.control(false));
            component.datosImportadorExportador.addControl('tipoEmpresaCertificadaAA', mockFormBuilder.control(false));
            component.datosImportadorExportador.addControl('tipoEmpresaCertificadaAAA', mockFormBuilder.control(false));
            component.datosImportadorExportador.addControl('certificacionOEA', mockFormBuilder.control(false));
            component.datosImportadorExportador.addControl('revision', mockFormBuilder.control(false));

            // Mock the store using bracket notation to access private property
            (component as any).tramite5701Store = {
                update: jest.fn(),
                setPrograma: jest.fn(),
                setDescripcionProgramaFomento: jest.fn(),
                setCheckIMMEX: jest.fn(),
                setDescripcionImmex: jest.fn(),
                setIndustriaAutomotriz: jest.fn(),
                setDescripcionIndustriaAutomotriz: jest.fn()
            };
        });

        it('should clear all RFC-related fields when desactivaCamposCertificaciones is called', () => {
            // Set some initial values
            component.datosImportadorExportador.patchValue({
                RFCImpExp: 'RFC123456789',
                nombre: 'Test Company',
                programa: true,
                desProgramaFomento: 'Test Program',
                checkIMMEX: true,
                desImmex: 'Test IMMEX',
                industriaAutomotriz: true,
                desIndustrialAutomotriz: 'Test Auto',
                tipoEmpresaCertificadaA: true,
                certificacionOEA: true
            });

            // Call the method
            component.desactivaCamposCertificaciones();

            // Verify all fields are cleared
            expect(component.datosImportadorExportador.get('RFCImpExp')?.value).toBe('');
            expect(component.datosImportadorExportador.get('nombre')?.value).toBe('');
            expect(component.datosImportadorExportador.get('programa')?.value).toBe(false);
            expect(component.datosImportadorExportador.get('desProgramaFomento')?.value).toBe('');
            expect(component.datosImportadorExportador.get('checkIMMEX')?.value).toBe(false);
            expect(component.datosImportadorExportador.get('desImmex')?.value).toBe('');
            expect(component.datosImportadorExportador.get('industriaAutomotriz')?.value).toBe(false);
            expect(component.datosImportadorExportador.get('desIndustrialAutomotriz')?.value).toBe('');
            expect(component.datosImportadorExportador.get('tipoEmpresaCertificadaA')?.value).toBe(false);
            expect(component.datosImportadorExportador.get('certificacionOEA')?.value).toBe(false);
            expect(component.datosImportadorExportador.get('revision')?.value).toBe(false);

            // Verify store update was called
            expect((component as any).tramite5701Store.update).toHaveBeenCalled();
        });

        it('should clear previous RFC data without clearing RFC and name in limpiarDatosPreviosRFC', () => {
            // Set some initial values including RFC and name
            component.datosImportadorExportador.patchValue({
                RFCImpExp: 'RFC123456789',
                nombre: 'Test Company',
                programa: true,
                desProgramaFomento: 'Test Program',
                checkIMMEX: true,
                desImmex: 'Test IMMEX',
                industriaAutomotriz: true,
                desIndustrialAutomotriz: 'Test Auto',
                tipoEmpresaCertificadaA: true,
                certificacionOEA: true
            });

            // Call the private method using bracket notation
            (component as any).limpiarDatosPreviosRFC();

            // Verify RFC and name are preserved
            expect(component.datosImportadorExportador.get('RFCImpExp')?.value).toBe('RFC123456789');
            expect(component.datosImportadorExportador.get('nombre')?.value).toBe('Test Company');

            // Verify certification fields are cleared
            expect(component.datosImportadorExportador.get('programa')?.value).toBe(false);
            expect(component.datosImportadorExportador.get('desProgramaFomento')?.value).toBe('');
            expect(component.datosImportadorExportador.get('checkIMMEX')?.value).toBe(false);
            expect(component.datosImportadorExportador.get('desImmex')?.value).toBe('');
            expect(component.datosImportadorExportador.get('industriaAutomotriz')?.value).toBe(false);
            expect(component.datosImportadorExportador.get('desIndustrialAutomotriz')?.value).toBe('');
            expect(component.datosImportadorExportador.get('tipoEmpresaCertificadaA')?.value).toBe(false);
            expect(component.datosImportadorExportador.get('certificacionOEA')?.value).toBe(false);
            expect(component.datosImportadorExportador.get('revision')?.value).toBe(false);

            // Verify store update was called
            expect((component as any).tramite5701Store.update).toHaveBeenCalled();
        });

        it('should disable certification checkboxes when desactivaCamposCertificaciones is called', () => {
            // Call the method
            component.desactivaCamposCertificaciones();

            // Verify all certification checkboxes are disabled
            expect(component.tipoEmpresaCertificadaADisabled).toBe(true);
            expect(component.tipoEmpresaCertificadaAADisabled).toBe(true);
            expect(component.tipoEmpresaCertificadaAAADisabled).toBe(true);
            expect(component.certificacionOEADisabled).toBe(true);
            expect(component.revisionDisabled).toBe(true);
            expect(component.certificacionesDisabled).toBe(true);
        });

        it('should clear tipoOperacion field when DD is unchecked via limpiaCamposDdaLda', () => {
            // Setup: Mock the despacho form with required fields including tipoOperacion
            const mockDespachoForm = mockFormBuilder.group({
                idAduanaDespacho: ['someValue'],
                aduanaDespacho: ['someValue'], 
                idSeccionDespacho: ['someValue'],
                seccionAduanera: ['someValue'],
                nombreRecinto: ['someValue'],
                relacionSociedad: [true],
                encargoConferido: [true],
                domicilioDespacho: ['someValue'],
                tipoDespacho: ['someValue'],
                tipoDespachoDescripcion: ['someValue'],
                tipoOperacion: [2] // Exportación value that should be cleared
            });

            // Spy on setValue calls to verify clearing behavior
            const setValueSpy = jest.spyOn(mockDespachoForm.get('tipoOperacion')!, 'setValue');
            
            // Mock the store update method to avoid dependency issues
            component.setValoresStore = jest.fn();
            
            // Override the component's despacho form getter
            Object.defineProperty(component, 'despacho', {
                get: () => mockDespachoForm,
                configurable: true
            });

            // Call the method that should clear the fields
            component.limpiaCamposDdaLda();

            // Verify tipoOperacion was reset to SIN_VALORES (-1)
            expect(setValueSpy).toHaveBeenCalledWith('-1');
            
            // Verify store was updated for tipoOperacion
            expect(component.setValoresStore).toHaveBeenCalledWith(
                mockDespachoForm, 
                'tipoOperacion', 
                'setTipoOperacion'
            );
        });
    });

    // Test for tipoOperacion reset when LDA/DD is unchecked
    describe('LDA/DD Checkbox Reset', () => {
        beforeEach(() => {
            // Setup despacho form controls for testing
            (component as any).despacho = mockFormBuilder.group({
                lda: [false],
                dd: [false],
                tipoOperacion: ['1'], // Set initial value to test reset
                tipoDespacho: ['1'],
                rfcDespachoLDA: [''],
                folioDDEX: ['']
            });
            
            // Mock required properties
            component.despachoSeleccionado = false;
            (component as any).tramite5701Store = {
                setLDA: jest.fn(),
                setDD: jest.fn()
            };
        });

        it('should reset tipoOperacion when unchecking LDA or DD', () => {
            // Set tipoOperacion to a specific value
            (component as any).despacho.get('tipoOperacion')?.setValue('importacion');
            expect((component as any).despacho.get('tipoOperacion')?.value).toBe('importacion');

            // Call the method that should reset tipoOperacion when unchecking
            component.activaDesactivaCheckLDA_DDEX('lda');

            // Verify tipoOperacion is reset to -1 (SIN_VALORES)
            expect((component as any).despacho.get('tipoOperacion')?.value).toBe('-1');
        });

        it('should reset tipoOperacion when limpiaCamposDdaLda is called', () => {
            // Set tipoOperacion to a specific value
            (component as any).despacho.get('tipoOperacion')?.setValue('exportacion');
            expect((component as any).despacho.get('tipoOperacion')?.value).toBe('exportacion');

            // Mock the store update method
            (component as any).setValoresStore = jest.fn();

            // Call the method that should reset tipoOperacion
            component.limpiaCamposDdaLda();

            // Verify tipoOperacion is reset to -1 (SIN_VALORES)
            expect((component as any).despacho.get('tipoOperacion')?.value).toBe('-1');
        });
    });
});