import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarObservacionComponent } from './generar-observacion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ValidacionesFormularioService } from '../../../core/services/shared/validaciones-formulario/validaciones-formulario.service';

describe('GenerarObservacionComponent', () => {
    let component: GenerarObservacionComponent;
    let fixture: ComponentFixture<GenerarObservacionComponent>;
    let validacionesServiceMock: any;

    beforeEach(async () => {
        validacionesServiceMock = {
            isValid: jest.fn().mockReturnValue(true)
        };

        await TestBed.configureTestingModule({
            imports: [CommonModule, FormsModule, ReactiveFormsModule, GenerarObservacionComponent],
            declarations: [],
            providers: [
                { provide: ValidacionesFormularioService, useValue: validacionesServiceMock }
            ]
        })
            .overrideComponent(GenerarObservacionComponent, {
                set: {
                    providers: [
                        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock }
                    ]
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(GenerarObservacionComponent);
        component = fixture.componentInstance;
        component.botonRegresar = 'Regresar';
        component.botonGenerar = 'Generar Observacion';
        fixture.detectChanges();
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debe inicializar el formulario correctamente en ngOnInit', () => {
        component.ngOnInit();
        expect(component.observacionForm).toBeDefined();
        expect(component.observacionForm.get('justificacionObservacion')?.value).toBe('');
    });

    it('debe emitir el evento de generar cuando el formulario es válido', () => {
        const spy = jest.spyOn(component.enviarEvento, 'emit');
        component.ngOnInit();
        component.observacionForm.get('justificacionObservacion')?.setValue('Justificación de observación válida');
        component.generarObservacion();
        expect(spy).toHaveBeenCalledWith({
            datos: {
                justificacionObservacion: 'Justificación de observación válida'
            },
            events: 'generar'
        });
    });

    it('no debe emitir el evento de generar si el formulario es inválido', () => {
        const spy = jest.spyOn(component.enviarEvento, 'emit');
        component.ngOnInit();
        component.observacionForm.get('justificacionObservacion')?.setValue('');
        component.generarObservacion();
        expect(spy).not.toHaveBeenCalled();
    });

    it('debe emitir el evento de regresar al hacer click en regresar', () => {
        const spy = jest.spyOn(component.enviarEvento, 'emit');
        component.regresar();
        expect(spy).toHaveBeenCalledWith({ events: 'regresar', datos: null });
    });

    it('debe validar la longitud máxima del campo de justificación', () => {
        component.ngOnInit();
        const longText = 'a'.repeat(2001); // Más de 2000 caracteres
        component.observacionForm.get('justificacionObservacion')?.setValue(longText);
        expect(component.observacionForm.get('justificacionObservacion')?.hasError('maxlength')).toBe(true);
    });

    it('debe mostrar los botones con el texto correcto', () => {
        fixture.detectChanges();
        const btnRegresar = fixture.debugElement.query(By.css('.btn-default')).nativeElement;
        const btnGenerar = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
        expect(btnRegresar.textContent).toContain('Regresar');
        expect(btnGenerar.textContent).toContain('Generar Observacion');
    });

    it('debe marcar todos los campos como tocados al generarObservacion', () => {
        component.ngOnInit();
        const spy = jest.spyOn(component.observacionForm, 'markAllAsTouched');
        component.generarObservacion();
        expect(spy).toHaveBeenCalled();
    });

    it('isValid debe delegar en el servicio de validaciones', () => {
        component.ngOnInit();
        component.isValid('justificacionObservacion');
        expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.observacionForm, 'justificacionObservacion');
    });
});