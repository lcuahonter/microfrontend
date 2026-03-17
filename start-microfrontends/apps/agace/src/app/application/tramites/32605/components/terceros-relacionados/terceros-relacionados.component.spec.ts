import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { RepresentanteLegalComponent } from '../representante-legal/representante-legal.component';
import { EnlaceOperativoComponent } from '../enlace-operativo/enlace-operativo.component';
import { PersonasNotificacionesComponent } from '../personas-notificaciones/personas-notificaciones.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let fixture: ComponentFixture<TercerosRelacionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
    CommonModule,
    HttpClientTestingModule,
    TercerosRelacionadosComponent, 
    RepresentanteLegalComponent,
    EnlaceOperativoComponent,
    PersonasNotificacionesComponent,
    ],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar app-representante-legal', () => {
    const el = fixture.nativeElement.querySelector('app-representante-legal');
    expect(el).toBeTruthy();
  });

  it('debería renderizar app-enlace-operativo', () => {
    const el = fixture.nativeElement.querySelector('app-enlace-operativo');
    expect(el).toBeTruthy();
  });

  it('debería renderizar app-personas-notificaciones', () => {
    const el = fixture.nativeElement.querySelector('app-personas-notificaciones');
    expect(el).toBeTruthy();
  });

  describe('ViewChild Referencias', () => {
    it('debe tener referencia al componente representanteLegalComponent', () => {
      fixture.detectChanges();
      expect(component.representanteLegalComponent).toBeDefined();
    });

    it('debe tener referencia al componente enlaceOperativoComponent', () => {
      fixture.detectChanges();
      expect(component.enlaceOperativoComponent).toBeDefined();
    });
  });

  describe('validarFormulario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debe retornar true cuando ambos formularios son válidos', () => {
      const mockRepresentanteLegal = {
        validarFormularioRepresentante: jest.fn().mockReturnValue(true)
      };
      const mockEnlaceOperativo = {
        validarFormulario: jest.fn().mockReturnValue(true),
        enlaceOperativoDataForm: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      };

      component.representanteLegalComponent = mockRepresentanteLegal as any;
      component.enlaceOperativoComponent = mockEnlaceOperativo as any;

      const result = component.validarFormulario();

      expect(result).toBeTruthy();
      expect(mockRepresentanteLegal.validarFormularioRepresentante).toHaveBeenCalled();
      expect(mockEnlaceOperativo.validarFormulario).toHaveBeenCalled();
    });

    it('debe retornar false cuando el formulario del representante legal es inválido', () => {
      const mockRepresentanteLegal = {
        validarFormularioRepresentante: jest.fn().mockReturnValue(false)
      };
      const mockEnlaceOperativo = {
        validarFormulario: jest.fn().mockReturnValue(true),
        enlaceOperativoDataForm: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      };

      component.representanteLegalComponent = mockRepresentanteLegal as any;
      component.enlaceOperativoComponent = mockEnlaceOperativo as any;

      const result = component.validarFormulario();

      expect(result).toBeFalsy();
      expect(mockRepresentanteLegal.validarFormularioRepresentante).toHaveBeenCalled();
    });

    it('debe retornar false cuando el componente representanteLegalComponent no existe', () => {
      const mockEnlaceOperativo = {
        validarFormulario: jest.fn().mockReturnValue(true),
        enlaceOperativoDataForm: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      };

      component.representanteLegalComponent = null as any;
      component.enlaceOperativoComponent = mockEnlaceOperativo as any;

      const result = component.validarFormulario();

      expect(result).toBeFalsy();
    });

    it('debe retornar false cuando el enlace operativo no tiene datos válidos', () => {
      const mockRepresentanteLegal = {
        validarFormularioRepresentante: jest.fn().mockReturnValue(true)
      };
      const mockEnlaceOperativo = {
        validarFormulario: jest.fn().mockReturnValue(false),
        enlaceOperativoDataForm: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      };

      component.representanteLegalComponent = mockRepresentanteLegal as any;
      component.enlaceOperativoComponent = mockEnlaceOperativo as any;

      const result = component.validarFormulario();

      expect(result).toBeFalsy();
      expect(mockEnlaceOperativo.validarFormulario).toHaveBeenCalled();
    });

    it('debe retornar false cuando el formulario de enlace operativo es inválido', () => {
      const mockRepresentanteLegal = {
        validarFormularioRepresentante: jest.fn().mockReturnValue(true)
      };
      const mockEnlaceOperativo = {
        validarFormulario: jest.fn().mockReturnValue(true),
        enlaceOperativoDataForm: {
          invalid: true,
          markAllAsTouched: jest.fn()
        }
      };

      component.representanteLegalComponent = mockRepresentanteLegal as any;
      component.enlaceOperativoComponent = mockEnlaceOperativo as any;

      const result = component.validarFormulario();

      expect(result).toBeFalsy();
      expect(mockEnlaceOperativo.enlaceOperativoDataForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('debe retornar false cuando el componente enlaceOperativoComponent no existe', () => {
      const mockRepresentanteLegal = {
        validarFormularioRepresentante: jest.fn().mockReturnValue(true)
      };

      component.representanteLegalComponent = mockRepresentanteLegal as any;
      component.enlaceOperativoComponent = null as any;

      const result = component.validarFormulario();

      expect(result).toBeFalsy();
    });

    it('debe retornar false cuando ambos componentes no existen', () => {
      component.representanteLegalComponent = null as any;
      component.enlaceOperativoComponent = null as any;

      const result = component.validarFormulario();

      expect(result).toBeFalsy();
    });

    it('debe retornar false cuando ambos formularios son inválidos', () => {
      const mockRepresentanteLegal = {
        validarFormularioRepresentante: jest.fn().mockReturnValue(false)
      };
      const mockEnlaceOperativo = {
        validarFormulario: jest.fn().mockReturnValue(false),
        enlaceOperativoDataForm: {
          invalid: true,
          markAllAsTouched: jest.fn()
        }
      };

      component.representanteLegalComponent = mockRepresentanteLegal as any;
      component.enlaceOperativoComponent = mockEnlaceOperativo as any;

      const result = component.validarFormulario();

      expect(result).toBeFalsy();
      expect(mockRepresentanteLegal.validarFormularioRepresentante).toHaveBeenCalled();
      expect(mockEnlaceOperativo.validarFormulario).toHaveBeenCalled();
      expect(mockEnlaceOperativo.enlaceOperativoDataForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('debe validar la secuencia correcta de validaciones', () => {
      const callOrder: string[] = [];
      const mockRepresentanteLegal = {
        validarFormularioRepresentante: jest.fn().mockImplementation(() => {
          callOrder.push('representante-validar');
          return true;
        })
      };
      const mockEnlaceOperativo = {
        validarFormulario: jest.fn().mockImplementation(() => {
          callOrder.push('enlace-validar');
          return true;
        }),
        enlaceOperativoDataForm: {
          invalid: false,
          markAllAsTouched: jest.fn().mockImplementation(() => {
            callOrder.push('enlace-markAllAsTouched');
          })
        }
      };

      component.representanteLegalComponent = mockRepresentanteLegal as any;
      component.enlaceOperativoComponent = mockEnlaceOperativo as any;

      component.validarFormulario();

      expect(callOrder).toEqual(['representante-validar', 'enlace-validar']);
    });

    it('debe continuar validando enlace operativo aunque representante legal sea inválido', () => {
      const mockRepresentanteLegal = {
        validarFormularioRepresentante: jest.fn().mockReturnValue(false)
      };
      const mockEnlaceOperativo = {
        validarFormulario: jest.fn().mockReturnValue(true),
        enlaceOperativoDataForm: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      };

      component.representanteLegalComponent = mockRepresentanteLegal as any;
      component.enlaceOperativoComponent = mockEnlaceOperativo as any;

      const result = component.validarFormulario();

      expect(result).toBeFalsy();
      expect(mockRepresentanteLegal.validarFormularioRepresentante).toHaveBeenCalled();
      expect(mockEnlaceOperativo.validarFormulario).toHaveBeenCalled();
    });

    it('debe manejar el caso cuando enlace operativo tiene datos válidos pero formulario inválido', () => {
      const mockRepresentanteLegal = {
        validarFormularioRepresentante: jest.fn().mockReturnValue(true)
      };
      const mockEnlaceOperativo = {
        validarFormulario: jest.fn().mockReturnValue(true),
        enlaceOperativoDataForm: {
          invalid: true,
          markAllAsTouched: jest.fn()
        }
      };

      component.representanteLegalComponent = mockRepresentanteLegal as any;
      component.enlaceOperativoComponent = mockEnlaceOperativo as any;

      const result = component.validarFormulario();

      expect(result).toBeFalsy();
      expect(mockEnlaceOperativo.validarFormulario).toHaveBeenCalled();
      expect(mockEnlaceOperativo.enlaceOperativoDataForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('debe inicializar isValid como true y cambiarlo según las validaciones', () => {
      const mockRepresentanteLegal = {
        validarFormularioRepresentante: jest.fn().mockReturnValue(true)
      };
      const mockEnlaceOperativo = {
        validarFormulario: jest.fn().mockReturnValue(true),
        enlaceOperativoDataForm: {
          invalid: false,
          markAllAsTouched: jest.fn()
        }
      };

      component.representanteLegalComponent = mockRepresentanteLegal as any;
      component.enlaceOperativoComponent = mockEnlaceOperativo as any;

      const result = component.validarFormulario();

      expect(result).toBeTruthy();
    });
  });

  describe('Integración de Componentes', () => {
    it('debe tener todos los componentes hijo disponibles después de la inicialización', () => {
      fixture.detectChanges();

      expect(component.representanteLegalComponent).toBeDefined();
      expect(component.enlaceOperativoComponent).toBeDefined();
    });

    it('debe poder acceder a los métodos de los componentes hijo', () => {
      fixture.detectChanges();

      expect(typeof component.representanteLegalComponent?.validarFormularioRepresentante).toBe('function');
      expect(typeof component.enlaceOperativoComponent?.validarFormulario).toBe('function');
    });
  });
});
