import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroUsuarioSinfielComponent } from './registro-usuario-sinfiel.component';
import { RegistroUsuarioSinFielService } from '../../core/service/registro-usuario-sinfiel.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('RegistroUsuarioSinfielComponent', () => {
  let component: RegistroUsuarioSinfielComponent;
  let fixture: ComponentFixture<RegistroUsuarioSinfielComponent>;
  let registroService: jest.Mocked<RegistroUsuarioSinFielService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const routerMock = {
        navigate: jest.fn()
    } as unknown as Router;

    const serviceMock = {
        autenticarUsuario_sinFiel: jest.fn()
    } as unknown as RegistroUsuarioSinFielService;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegistroUsuarioSinfielComponent],
      providers: [
                FormBuilder,
                { provide: Router, useValue: routerMock },
                { provide: RegistroUsuarioSinFielService, useValue: serviceMock }
            ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroUsuarioSinfielComponent);
    component = fixture.componentInstance;
    registroService = TestBed.inject(RegistroUsuarioSinFielService) as jest.Mocked<RegistroUsuarioSinFielService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
     * Suite de pruebas para el formulario de login
     */
    describe('Formulario de Login', () => {
        it('debe inicializar el formulario con campos vacíos', () => {
            // Verificar estado inicial del formulario
            expect(component.loginForm.get('usuario')?.value).toBe('');
            expect(component.loginForm.get('contrasena')?.value).toBe('');
            expect(component.loginForm.valid).toBeFalsy();
        });

        it('debe marcar el formulario como válido cuando se llenan todos los campos requeridos', () => {
            // Simular llenado del formulario
            component.loginForm.patchValue({
                usuario: 'usuario123',
                contrasena: 'password123'
            });

            // Verificar validez del formulario
            expect(component.loginForm.valid).toBeTruthy();
            expect(component.loginForm.get('usuario')?.errors).toBeNull();
            expect(component.loginForm.get('contrasena')?.errors).toBeNull();
        });

        it('debe marcar el formulario como inválido cuando los campos están vacíos', () => {
            // Simular touch de campos
            Object.keys(component.loginForm.controls).forEach(key => {
                const control = component.loginForm.get(key);
                control?.markAsTouched();
            });

            // Verificar invalidez del formulario
            expect(component.loginForm.valid).toBeFalsy();
            expect(component.loginForm.get('usuario')?.errors?.['required']).toBeTruthy();
            expect(component.loginForm.get('contrasena')?.errors?.['required']).toBeTruthy();
        });
    });

});
