import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarDictamen130Component } from './generar-dictamen.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { ValidacionesFormularioService } from '../../../core/services/shared/validaciones-formulario/validaciones-formulario.service';
import { By } from '@angular/platform-browser';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
// import { ANTECEDENTES_DICTAMEN } from '../../../core/constants/constantes-generales';

describe('GenerarDictamen130Component', () => {
    let component: GenerarDictamen130Component;
    let fixture: ComponentFixture<GenerarDictamen130Component>;
    let validacionesService: ValidacionesFormularioService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GenerarDictamen130Component, ReactiveFormsModule],
            providers: [
                FormBuilder,
                {
                    provide: ValidacionesFormularioService,
                    useValue: {
                        isValid: jasmine.createSpy('isValid').and.callFake((form, field) => {
                            const control = form.get(field);
                            return control && control.invalid && (control.dirty || control.touched);
                        })
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(GenerarDictamen130Component);
        component = fixture.componentInstance;
        validacionesService = TestBed.inject(ValidacionesFormularioService);
        fixture.detectChanges();
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debe inicializar el formulario con valores por defecto', () => {
        expect(component.dictamenForm).toBeDefined();
        expect(component.dictamenForm.get('cumplimiento')?.value).toBe('1');
        expect(component.dictamenForm.get('mensajeDictamen')?.value).toBe('');
        expect(component.dictamenForm.get('antecedentesReadonly')?.value).toBe(component.conformidad);
    });

    it('debe mostrar campos de fecha si cumplimiento es "1" (Aceptado)', () => {
        component.dictamenForm.get('cumplimiento')?.setValue('1');
        fixture.detectChanges();
        expect(component.mostrarCamposFecha).toBe(true);
        expect(component.dictamenForm.get('fechaInicioVigenciaAutorizada')?.validator).toBeTruthy();
        expect(component.dictamenForm.get('fechaFinVigenciaAutorizada')?.validator).toBeTruthy();
    });

    it('debe ocultar campos de fecha si cumplimiento es "2" (Rechazado)', () => {
        component.dictamenForm.get('cumplimiento')?.setValue('2');
        fixture.detectChanges();
        expect(component.mostrarCamposFecha).toBeFalsy();
        expect(component.dictamenForm.get('fechaInicioVigenciaAutorizada')?.validator).toBeNull();
        expect(component.dictamenForm.get('fechaFinVigenciaAutorizada')?.validator).toBeNull();
    });

    it('debe validar que mensajeDictamen no acepte solo espacios', () => {
        const control = component.dictamenForm.get('mensajeDictamen');
        control?.setValue('    ');
        expect(GenerarDictamen130Component.noSoloEspacios(control!)).toEqual({ soloEspacios: true });
        control?.setValue('Texto válido');
        expect(GenerarDictamen130Component.noSoloEspacios(control!)).toBeNull();
    });

    it('debe emitir evento "guardar" con datos válidos al llamar guardar()', () => {
        spyOn(component.enviarEvento, 'emit');
        component.dictamenForm.get('cumplimiento')?.setValue('2');
        component.dictamenForm.get('mensajeDictamen')?.setValue('Justificación válida');
        // Asegura que el campo antecedentesEditables tenga un valor válido si existe
        if (component.dictamenForm.get('antecedentesEditables')) {
            component.dictamenForm.get('antecedentesEditables')?.setValue('Antecedente válido');
        }
        // Cuando cumplimiento es '2', los campos de fecha pueden no ser requeridos, pero por si acaso, setéalos
        if (component.dictamenForm.get('fechaInicioVigenciaAutorizada')) {
            component.dictamenForm.get('fechaInicioVigenciaAutorizada')?.setValue('2024-01-01');
        }
        if (component.dictamenForm.get('fechaFinVigenciaAutorizada')) {
            component.dictamenForm.get('fechaFinVigenciaAutorizada')?.setValue('2024-12-31');
        }
        // Marca todos los controles como tocados para activar validaciones
        Object.values(component.dictamenForm.controls).forEach(control => {
            control.setErrors(null); // Limpia errores previos
            control.markAsTouched();
            control.updateValueAndValidity();
        });
        fixture.detectChanges();
        expect(component.dictamenForm.valid).toBe(true); // Asegura que el formulario es válido antes de guardar
        component.guardar();
        expect(component.enviarEvento.emit).toHaveBeenCalledWith({
            events: 'guardar',
            datos: {
                cumplimiento: '2',
                mensajeDictamen: 'Justificación válida'
            }
        });
    });

    it('no debe emitir evento "guardar" si el formulario es inválido', () => {
        spyOn(component.enviarEvento, 'emit');
        component.dictamenForm.get('mensajeDictamen')?.setValue('');
        component.guardar();
        expect(component.enviarEvento.emit).not.toHaveBeenCalled();
    });

    it('debe emitir evento "firmar" con datos válidos al llamar firmar()', () => {
        spyOn(component.enviarEvento, 'emit');
        component.dictamenForm.get('mensajeDictamen')?.setValue('Mensaje válido');
        component.dictamenForm.get('antecedentesEditables')?.setValue('Antecedente válido');
        component.dictamenForm.get('fechaInicioVigenciaAutorizada')?.setValue('2024-01-01');
        component.dictamenForm.get('fechaFinVigenciaAutorizada')?.setValue('2024-12-31');
        component.firmar();
        expect(component.enviarEvento.emit).toHaveBeenCalledWith(jasmine.objectContaining({ events: 'firmar' }));
    });

    it('debe emitir evento "guardar" al llamar guardarFirmar() si el formulario es válido', () => {
        spyOn(component.enviarEvento, 'emit');
        component.dictamenForm.get('mensajeDictamen')?.setValue('Mensaje válido');
        component.dictamenForm.get('antecedentesEditables')?.setValue('Antecedente válido');
        component.dictamenForm.get('fechaInicioVigenciaAutorizada')?.setValue('2024-01-01');
        component.dictamenForm.get('fechaFinVigenciaAutorizada')?.setValue('2024-12-31');
        component.guardarFirmar();
        expect(component.enviarEvento.emit).toHaveBeenCalledWith(jasmine.objectContaining({ events: 'guardar' }));
    });

    it('debe emitir evento "cancelar" al llamar cancelar()', () => {
        spyOn(component.enviarEvento, 'emit');
        component.cancelar();
        expect(component.enviarEvento.emit).toHaveBeenCalledWith({ events: 'cancelar', datos: null });
    });

    it('debe actualizar el campo antecedentesReadonly si cambia la conformidad', () => {
        component.dictamenForm.get('antecedentesReadonly')?.setValue('Valor anterior');
         component.ngOnChanges({
            conformidad: {
                currentValue: 'Nuevo valor de conformidad',
                previousValue: 'Valor anterior',
                firstChange: false,
                isFirstChange: () => false
            }
        });
        expect(component.dictamenForm.get('antecedentesReadonly')?.value).toBe('Nuevo valor de conformidad');
    });

    it('debe eliminar el control antecedentesEditables si isAntecedentes es false', () => {
        component.isAntecedentes = false;
        component.ngOnInit();
        expect(component.dictamenForm.get('antecedentesEditables')).toBeNull();
    });

    it('debe retornar true/false correctamente en isValid()', () => {
        component.dictamenForm.get('mensajeDictamen')?.setValue('');
        expect(component.isValid('mensajeDictamen')).toBe(true);
        component.dictamenForm.get('mensajeDictamen')?.setValue('Texto válido');
        expect(component.isValid('mensajeDictamen')).toBe(false);
    });
});