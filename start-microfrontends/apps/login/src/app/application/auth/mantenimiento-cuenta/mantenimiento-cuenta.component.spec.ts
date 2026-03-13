import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MantenimientoCuentaComponent } from './mantenimiento-cuenta.component';
import { RecuperacionCuentaService } from '../../../estados/RecuperacionCuentaResponse';
import { RecuperacionStore } from '../../../estados/RecuperacionState.store';
import { Router } from '@angular/router';
import { TipoPersona } from '@libs/shared/data-access-user/src';

describe('MantenimientoCuentaComponent', () => {
    let component: MantenimientoCuentaComponent;
    let fixture: ComponentFixture<MantenimientoCuentaComponent>;
    let recuperacionService: jest.Mocked<RecuperacionCuentaService>;
    let router: jest.Mocked<Router>;

    beforeEach(async () => {
        // Crear mocks usando jest
        const routerMock = {
            navigate: jest.fn()
        } as unknown as Router;

        const serviceMock = {
            recuperarCuenta: jest.fn()
        } as unknown as RecuperacionCuentaService;

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                MantenimientoCuentaComponent
            ],
            providers: [
                FormBuilder,
                RecuperacionStore,
                { provide: Router, useValue: routerMock },
                { provide: RecuperacionCuentaService, useValue: serviceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MantenimientoCuentaComponent);
        component = fixture.componentInstance;
        recuperacionService = TestBed.inject(RecuperacionCuentaService) as jest.Mocked<RecuperacionCuentaService>;
        router = TestBed.inject(Router) as jest.Mocked<Router>;
        
        // Inicializar el formulario
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    // Escenario 1: Extranjero Persona Moral
    describe('Flujo Extranjero Persona Moral', () => {
        beforeEach(() => {
            // Configurar el formulario para persona moral extranjera
            component.formularioRecuperar.patchValue({
                nacionalidad: false,
                personaTipo: TipoPersona.MORAL
            });
            fixture.detectChanges();
        });

        it('debe validar persona moral extranjera con datos correctos', () => {
            // Simular llenado del formulario
            component.formularioRecuperar.patchValue({
                usuario: 'ABCD123456ABC',
                razonSocial: 'Empresa Test SA',
                codigoPostal: '12345',
                estado: 'Estado Test',
                pais: 'País Test'
            });
            fixture.detectChanges();

            expect(component['esValidaPersonaMoralExtranjera']()).toBe(true);
        });

        it('debe invalidar persona moral extranjera con datos incorrectos', () => {
            // Simular llenado incorrecto del formulario
            component.formularioRecuperar.patchValue({
                usuario: 'RFC-INVALIDO',
                razonSocial: '',
                codigoPostal: '',
                estado: '',
                pais: ''
            });
            fixture.detectChanges();

            expect(component['esValidaPersonaMoralExtranjera']()).toBe(false);
        });
    });
});