import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificacionPermisoLabComponent } from './modificacion-permiso-lab.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccionBoton } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http';
import { ToastrService, TOAST_CONFIG, ToastrConfig } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

describe('ModificacionPermisoLabComponent', (): void => {
  let component: ModificacionPermisoLabComponent;
  let fixture: ComponentFixture<ModificacionPermisoLabComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [ModificacionPermisoLabComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() } },
        { provide: TOAST_CONFIG, useValue: {} as ToastrConfig },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { 
              paramMap: { get: jest.fn() }, 
              data: {} 
            }, 
            params: { subscribe: jest.fn() }, 
            queryParams: { subscribe: jest.fn() } 
          } 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificacionPermisoLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as any;

    // Mock or initialize required properties to avoid undefined errors
    (component as any).pagoDeDerechos = {};
  });

  it('debería crear el componente', (): void => {
    expect(component).toBeTruthy();
  });

  it('debería actualizar el índice y llamar "siguiente" si la acción es "cont"', (): void => {
    const EVENTO: AccionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(EVENTO);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debería actualizar el índice y llamar "atras" si la acción no es "cont"', (): void => {
    const EVENTO: AccionBoton = { accion: 'back', valor: 3 };
    component.getValorIndice(EVENTO);
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('no debería cambiar el índice ni llamar métodos si el valor está fuera de rango', (): void => {
    const EVENTO: AccionBoton = { accion: 'cont', valor: 6 };
    const VALOR_ANTERIOR = component.indice;
    component.getValorIndice(EVENTO);
    expect(component.indice).toBe(VALOR_ANTERIOR);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});
