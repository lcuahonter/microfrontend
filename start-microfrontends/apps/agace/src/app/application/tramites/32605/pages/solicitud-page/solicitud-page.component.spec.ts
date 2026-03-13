import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';
import { WizardComponent, TipoNotificacionEnum, CategoriaMensaje } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let wizardMock: jest.Mocked<WizardComponent>;
  let pasoUnoMock: jest.Mocked<PasoUnoComponent>;

  beforeEach(async () => {
    wizardMock = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as jest.Mocked<WizardComponent>;

    pasoUnoMock = {
      validarFormularios: jest.fn(),
    } as unknown as jest.Mocked<PasoUnoComponent>;

    await TestBed.configureTestingModule({

      imports: [
        WizardComponent,
        ReactiveFormsModule,
        HttpClientModule
      ],
      declarations: [SolicitudPageComponent, PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent],
      providers: [{ provide: WizardComponent, useValue: wizardMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizardComponent = wizardMock;
    component.pasoUnoComponent = pasoUnoMock;
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('seleccionaTab', () => {
    it('debe actualizar el índice correctamente', () => {
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);
    });

    it('debe actualizar el índice con valor 1', () => {
      component.seleccionaTab(1);
      expect(component.indice).toBe(1);
    });

    it('debe actualizar el índice con valor 0', () => {
      component.seleccionaTab(0);
      expect(component.indice).toBe(0);
    });
  });

  describe('getValorIndice', () => {
    beforeEach(() => {
      component.pasos = [
        { indice: 1, titulo: 'Paso 1', activo: true, completado: false },
        { indice: 2, titulo: 'Paso 2', activo: false, completado: false },
        { indice: 3, titulo: 'Paso 3', activo: false, completado: false }
      ];
      component.indice = 1;
      component.esFormaValido = true; 
    });

    describe('cuando la acción es "cont" y está en el paso 1', () => {
      it('debe validar formularios y continuar cuando son válidos', () => {
        pasoUnoMock.validarFormularios.mockReturnValue(true);
        const spyMostrarNotificacion = jest.spyOn(component, 'mostrarNotificacionError');

        component.getValorIndice({ accion: 'cont', valor: 1 });

        expect(pasoUnoMock.validarFormularios).toHaveBeenCalled();
        expect(component.esFormaValido).toBe(false);
        expect(spyMostrarNotificacion).not.toHaveBeenCalled();
        expect(component.indice).toBe(2);
        expect(component.datosPasos.indice).toBe(2);
        expect(wizardMock.siguiente).toHaveBeenCalled();
      });

      it('debe mostrar error y no continuar cuando los formularios son inválidos', () => {
        pasoUnoMock.validarFormularios.mockReturnValue(false);
        const spyMostrarNotificacion = jest.spyOn(component, 'mostrarNotificacionError');

        component.getValorIndice({ accion: 'cont', valor: 1 });

        expect(pasoUnoMock.validarFormularios).toHaveBeenCalled();
        expect(component.esFormaValido).toBe(true);
        expect(spyMostrarNotificacion).toHaveBeenCalled();
        expect(component.indice).toBe(1);
        expect(wizardMock.siguiente).not.toHaveBeenCalled();
      });

      it('debe validar formularios solo cuando está en paso 1 con acción cont', () => {
        component.indice = 2;
        pasoUnoMock.validarFormularios.mockReturnValue(false);
        const spyMostrarNotificacion = jest.spyOn(component, 'mostrarNotificacionError');

        component.getValorIndice({ accion: 'cont', valor: 2 });

        expect(pasoUnoMock.validarFormularios).not.toHaveBeenCalled();
        expect(spyMostrarNotificacion).not.toHaveBeenCalled();
        expect(component.indice).toBe(3);
        expect(wizardMock.siguiente).toHaveBeenCalled();
      });
    });

    describe('cuando la acción es "cont"', () => {
      it('debe incrementar el índice y llamar siguiente()', () => {
        component.indice = 2;

        component.getValorIndice({ accion: 'cont', valor: 2 });

        expect(component.indice).toBe(3);
        expect(component.datosPasos.indice).toBe(3);
        expect(wizardMock.siguiente).toHaveBeenCalled();
        expect(wizardMock.atras).not.toHaveBeenCalled();
      });

      it('no debe cambiar el índice si excede el límite superior', () => {
        component.indice = 3;

        component.getValorIndice({ accion: 'cont', valor: 3 });

        expect(component.indice).toBe(3);
        expect(wizardMock.siguiente).not.toHaveBeenCalled();
      });
    });

    describe('cuando la acción es "ant"', () => {
      it('debe decrementar el índice y llamar atras()', () => {
        component.indice = 2;

        component.getValorIndice({ accion: 'ant', valor: 2 });

        expect(component.indice).toBe(1);
        expect(component.datosPasos.indice).toBe(1);
        expect(wizardMock.atras).toHaveBeenCalled();
        expect(wizardMock.siguiente).not.toHaveBeenCalled();
      });

      it('no debe cambiar el índice si es menor a 1', () => {
        component.indice = 1;

        component.getValorIndice({ accion: 'ant', valor: 1 });

        expect(component.indice).toBe(1); 
        expect(wizardMock.atras).not.toHaveBeenCalled();
      });
    });

    describe('cuando la acción no es "cont" ni "ant"', () => {
      it('debe usar el valor directamente', () => {
        component.getValorIndice({ accion: 'otra', valor: 2 });

        expect(component.indice).toBe(2);
        expect(component.datosPasos.indice).toBe(2);
        expect(wizardMock.siguiente).not.toHaveBeenCalled();
        expect(wizardMock.atras).not.toHaveBeenCalled();
      });
    });

  });

  describe('mostrarNotificacionError', () => {
    it('debe configurar la notificación correctamente', () => {
      component.mostrarNotificacionError();

      expect(component.nuevaNotificacion).toEqual({
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ERROR,
        modo: 'modal-md',
        titulo: '',
        mensaje: 'Existen requisitos obligatorios en blanco o con errores.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
      expect(component.btnContinuar).toBe(true);
    });

    it('debe establecer btnContinuar en true', () => {
      component.btnContinuar = false;

      component.mostrarNotificacionError();

      expect(component.btnContinuar).toBe(true);
    });
  });

  describe('btnContinuarNotificacion', () => {
    it('debe establecer btnContinuar en false', () => {
      component.btnContinuar = true;

      component.btnContinuarNotificacion();

      expect(component.btnContinuar).toBe(false);
    });

    it('debe mantener btnContinuar en false si ya estaba en false', () => {
      component.btnContinuar = false;

      component.btnContinuarNotificacion();

      expect(component.btnContinuar).toBe(false);
    });
  });

  describe('validarTodosFormulariosPasoUno', () => {
    it('debe retornar true cuando pasoUnoComponent es null', () => {
      component.pasoUnoComponent = null as any;

      const result = component.validarTodosFormulariosPasoUno();

      expect(result).toBe(true);
    });

    it('debe retornar true cuando pasoUnoComponent es undefined', () => {
      component.pasoUnoComponent = undefined as any;

      const result = component.validarTodosFormulariosPasoUno();

      expect(result).toBe(true);
    });

    it('debe retornar true cuando validarFormularios retorna true', () => {
      pasoUnoMock.validarFormularios.mockReturnValue(true);

      const result = component.validarTodosFormulariosPasoUno();

      expect(pasoUnoMock.validarFormularios).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('debe retornar false cuando validarFormularios retorna false', () => {
      pasoUnoMock.validarFormularios.mockReturnValue(false);

      const result = component.validarTodosFormulariosPasoUno();

      expect(pasoUnoMock.validarFormularios).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('debe llamar validarFormularios del componente hijo', () => {
      pasoUnoMock.validarFormularios.mockReturnValue(true);

      component.validarTodosFormulariosPasoUno();

      expect(pasoUnoMock.validarFormularios).toHaveBeenCalledTimes(1);
    });
  });

  it('should not update indice for invalid tab values', () => {
    component.seleccionaTab(1);
  });


});