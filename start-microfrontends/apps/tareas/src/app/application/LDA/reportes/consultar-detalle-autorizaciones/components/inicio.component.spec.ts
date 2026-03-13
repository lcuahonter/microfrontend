import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarDetalleAutorizacionesComponent } from './inicio.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ConsultarDetalleAutorizacionesComponent', () => {
    let component: ConsultarDetalleAutorizacionesComponent;
    let fixture: ComponentFixture<ConsultarDetalleAutorizacionesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ConsultarDetalleAutorizacionesComponent,
                ReactiveFormsModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConsultarDetalleAutorizacionesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('Debe inicializar el formulario reactivo', () => {
        expect(component.FormConsulta).toBeDefined();
    });

    it('debe contener los controles del form', () => {
        const form = component.FormConsulta;

        expect(form.get('rfc_solicitante')).toBeDefined();
        expect(form.get('aduana')).toBeDefined();
        expect(form.get('fecha_inicio_vigencia')).toBeDefined();
        expect(form.get('fecha_fin_vigencia')).toBeDefined();
        expect(form.get('calle')).toBeDefined();
        expect(form.get('telefono')).toBeDefined();
        expect(form.get('lda')).toBeDefined();
        expect(form.get('ubicacion')).toBeDefined();
    });

    it('debe validar el RFC', () => {
        const control = component.FormConsulta.get('rfc_solicitante');
        expect(control).toBeDefined();

        control?.setValue('INVALIDO');
        expect(control?.valid).toBe(false);

        control?.setValue('ABC010203AAA');
        expect(control?.valid).toBe(true);
    });
});
