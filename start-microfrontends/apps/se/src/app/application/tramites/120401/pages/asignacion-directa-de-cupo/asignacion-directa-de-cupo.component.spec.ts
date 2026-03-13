// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsignacionDirectaDeCupoComponent } from './asignacion-directa-de-cupo.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('AsignacionDirectaDeCupoComponent', () => {
  describe('getValorIndice full branch coverage', () => {
    beforeEach(() => {
      component.pantallasPasos = [1,2,3];
      component.datosPasos = { indice: 1 };
      component.wizardService = { cambio_indice: jest.fn() };
      component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() };
      component.shouldNavigate$ = jest.fn();
      component.consultaState = { readonly: false };
    });

    it('should handle shouldNavigate$ returns false (cont branch)', (done) => {
      component.indice = 1;
      component.datosComponent = {
        asignacionComponent: {
          representacionFederalComponent: { validarFormulario: jest.fn().mockReturnValue(true) },
          seleccionDelCupoComponent: { cantidadSolicitadaComponent: { validarFormulario: jest.fn().mockReturnValue(true) } }
        }
      };
      component.shouldNavigate$ = jest.fn().mockReturnValue({
        subscribe: (fn) => fn(false)
      });
      component.getValorIndice({ valor: 1, accion: 'cont' });
      setTimeout(() => {
        expect(component.indice).toBe(1);
        expect(component.datosPasos.indice).toBe(1);
        done();
      }, 0);
    });

    it('should handle shouldNavigate$ returns true (cont branch)', (done) => {
      component.indice = 1;
      component.datosComponent = {
        asignacionComponent: {
          representacionFederalComponent: { validarFormulario: jest.fn().mockReturnValue(true) },
          seleccionDelCupoComponent: { cantidadSolicitadaComponent: { validarFormulario: jest.fn().mockReturnValue(true) } }
        }
      };
      component.shouldNavigate$ = jest.fn().mockReturnValue({
        subscribe: (fn) => fn(true)
      });
      component.getValorIndice({ valor: 1, accion: 'cont' });
      setTimeout(() => {
        expect(component.indice).toBe(2);
        expect(component.datosPasos.indice).toBe(2);
        expect(component.wizardService.cambio_indice).toHaveBeenCalledWith(2);
        expect(component.wizardComponent.siguiente).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should handle else branch (accion not cont)', () => {
      component.indice = 2;
      component.getValorIndice({ valor: 2, accion: 'ant' });
      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('should handle NEXT_INDEX calculation for custom accion', () => {
      component.indice = 2;
      component.getValorIndice({ valor: 2, accion: 'custom' });
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });
  });
  it('should return true from shouldNavigate$', (done) => {
    const mockData = { test: 'data' };
    const mockObservable = {
      pipe: function() {
        return {
          subscribe: function(fn) { fn(mockData); }
        };
      }
    };
    component.service = {
      getAllState: jest.fn().mockReturnValue(mockObservable)
    };
    component.guardar = jest.fn().mockReturnValue({
      pipe: function() {
        return {
          subscribe: function(fn) { fn('saved'); }
        };
      }
    });
    const obs = component.__proto__.shouldNavigate$.call(component);
    obs.subscribe((result) => {
      expect(result).toBe(true);
      expect(component.service.getAllState).toHaveBeenCalled();
      expect(component.guardar).toHaveBeenCalledWith(mockData);
      done();
    });
  });
  it('should call guardar and set guardarIdSolicitud and store', (done) => {
    const mockResponse = { datos: { id_solicitud: 999 } };
    component.service = {
      obtenerGuardarSolicitud: jest.fn().mockReturnValue({
        pipe: function() {
          return {
            subscribe: function(fn) {
              fn(mockResponse);
              done();
            }
          };
        }
      })
    };
    component.tramite120401Store = { setIdSolicitud: jest.fn() };
    const data = { entidad: 'E', representacion: 'R', regimen: 'REG', tratado: 'TRA', nombreProducto: 'P', nombreSubproducto: 'SP', datos: [], cantidadSolicitada: 1 };
    component.guardar(data).subscribe(() => {
      expect(component.tramite120401Store.setIdSolicitud).toHaveBeenCalledWith(999);
      expect(component.guardarIdSolicitud).toBe(999);
    });
  });

  it('should run validarPasoActual for all branches', () => {
    component.indice = 1;
    component.validarPasoUno = jest.fn().mockReturnValue('uno');
    expect(component.__proto__.validarPasoActual.call(component)).toBe('uno');
    component.indice = 2;
    component.validarPasoDos = jest.fn().mockReturnValue('dos');
    expect(component.__proto__.validarPasoActual.call(component)).toBe('dos');
    component.indice = 3;
    component.validarPasoTres = jest.fn().mockReturnValue('tres');
    expect(component.__proto__.validarPasoActual.call(component)).toBe('tres');
    component.indice = 99;
    expect(component.__proto__.validarPasoActual.call(component)).toBe(true);
  });

  it('should run validarPasoUno and set mensajeValidacion on invalid', () => {
    component.verificarCamposObligatoriosPaso1 = jest.fn().mockReturnValue({ valido: false, camposFaltantes: ['f'] });
    expect(component.__proto__.validarPasoUno.call(component)).toBe(false);
    expect(component.mensajeValidacion).toContain('La Solicitud ha quedado registrada');
    component.verificarCamposObligatoriosPaso1 = jest.fn().mockReturnValue({ valido: true, camposFaltantes: [] });
    expect(component.__proto__.validarPasoUno.call(component)).toBe(true);
  });

  it('should run validarPasoDos and set mensajeValidacion on invalid', () => {
    component.verificarCamposObligatoriosPaso2 = jest.fn().mockReturnValue({ valido: false, camposFaltantes: ['f'] });
    expect(component.__proto__.validarPasoDos.call(component)).toBe(false);
    expect(component.mensajeValidacion).toContain('Para continuar es necesario completar');
    component.verificarCamposObligatoriosPaso2 = jest.fn().mockReturnValue({ valido: true, camposFaltantes: [] });
    expect(component.__proto__.validarPasoDos.call(component)).toBe(true);
  });

  it('should run validarPasoTres and set mensajeValidacion on invalid', () => {
    component.verificarCamposObligatoriosPaso3 = jest.fn().mockReturnValue({ valido: false, camposFaltantes: ['f'] });
    expect(component.__proto__.validarPasoTres.call(component)).toBe(false);
    expect(component.mensajeValidacion).toContain('Para continuar es necesario completar');
    component.verificarCamposObligatoriosPaso3 = jest.fn().mockReturnValue({ valido: true, camposFaltantes: [] });
    expect(component.__proto__.validarPasoTres.call(component)).toBe(true);
  });

  it('should run verificarCamposObligatoriosPaso1 and return expected object', () => {
    const result = component.__proto__.verificarCamposObligatoriosPaso1.call(component);
    expect(result.valido).toBe(false);
    expect(result.camposFaltantes).toContain('Campos obligatorios');
  });

  it('should run verificarCamposObligatoriosPaso2 and return expected object', () => {
    document.body.innerHTML = '<input name="campoEjemploPaso2" value="">';
    const result = component.__proto__.verificarCamposObligatoriosPaso2.call(component);
    expect(result.valido).toBe(false);
    expect(result.camposFaltantes).toContain('Campo requerido del paso 2');
    document.body.innerHTML = '<input name="campoEjemploPaso2" value="filled">';
    const result2 = component.__proto__.verificarCamposObligatoriosPaso2.call(component);
    expect(result2.valido).toBe(true);
    document.body.innerHTML = '';
  });

  it('should run verificarCamposObligatoriosPaso3 and return expected object', () => {
    document.body.innerHTML = '<input name="campoEjemploPaso3" value="">';
    const result = component.__proto__.verificarCamposObligatoriosPaso3.call(component);
    expect(result.valido).toBe(false);
    expect(result.camposFaltantes).toContain('Campo requerido del paso 3');
    document.body.innerHTML = '<input name="campoEjemploPaso3" value="filled">';
    const result2 = component.__proto__.verificarCamposObligatoriosPaso3.call(component);
    expect(result2.valido).toBe(true);
    document.body.innerHTML = '';
  });

  it('should run obtenerValorCampo and return value or null', () => {
    document.body.innerHTML = '<input name="campoTest" value="abc">';
    expect(component.__proto__.obtenerValorCampo.call(component, 'campoTest')).toBe('abc');
    document.body.innerHTML = '';
    expect(component.__proto__.obtenerValorCampo.call(component, 'campoTest')).toBeNull();
  });
  let fixture: ComponentFixture<AsignacionDirectaDeCupoComponent>;
  let component: AsignacionDirectaDeCupoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule,HttpClientModule],
      declarations: [
        AsignacionDirectaDeCupoComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      providers: [
        provideHttpClient()
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AsignacionDirectaDeCupoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

    it('should return correct TEXTOS_FIRMAR string', () => {
      component.guardarIdSolicitud = 12345;
      expect(component.TEXTOS_FIRMAR).toContain('[12345]');
    });

    it('should have correct formErrorAlert HTML', () => {
      expect(component.formErrorAlert).toContain('¡Error de registro!');
      expect(component.formErrorAlert).toContain('Faltan campos por capturar');
    });

    it('should show validation message and auto-close', (done) => {
      component.mostrarMensajeConAutoClose = component.__proto__.mostrarMensajeConAutoClose;
      component.cerrarMensajeValidacion = jest.fn();
      component.mostrarMensajeConAutoClose();
      expect(component.mostrarMensajeValidacion).toBe(true);
      setTimeout(() => {
        expect(component.cerrarMensajeValidacion).toHaveBeenCalled();
        done();
      }, 5100);
    });

    it('should set consultaState on ngOnInit', () => {
      const mockState = { readonly: true };
      component.consultaQuery = {
        selectConsultaioState$: {
          pipe: () => ({ subscribe: (fn) => fn(mockState) })
        }
      };
      component.ngOnInit();
      expect(component.consultaState).toBe(mockState);
    });

    it('should clear timeout on ngOnDestroy', () => {
      component.timeoutId = setTimeout(() => {}, 1000);
      component.ngOnDestroy();
      expect(component.timeoutId).toBeNull();
    });

    describe('getValorIndice validation logic', () => {
      beforeEach(() => {
        component.pantallasPasos = [1,2,3];
        component.indice = 1;
        component.datosComponent = {
          asignacionComponent: {
            representacionFederalComponent: { validarFormulario: jest.fn() },
            seleccionDelCupoComponent: { cantidadSolicitadaComponent: { validarFormulario: jest.fn() } }
          }
        };
      });

      it('should set esFormaValido true if representacionFederalComponent.validarFormulario returns false', () => {
        component.datosComponent.asignacionComponent.representacionFederalComponent.validarFormulario.mockReturnValue(false);
        component.datosComponent.asignacionComponent.seleccionDelCupoComponent.cantidadSolicitadaComponent.validarFormulario.mockReturnValue(true);
        component.esFormaValido = false;
        component.getValorIndice({ valor: 1, accion: 'cont' });
        expect(component.esFormaValido).toBe(true);
      });

      it('should set esFormaValido true if cantidadSolicitadaComponent.validarFormulario returns false', () => {
        component.datosComponent.asignacionComponent.representacionFederalComponent.validarFormulario.mockReturnValue(true);
        component.datosComponent.asignacionComponent.seleccionDelCupoComponent.cantidadSolicitadaComponent.validarFormulario.mockReturnValue(false);
        component.esFormaValido = false;
        component.getValorIndice({ valor: 1, accion: 'cont' });
        expect(component.esFormaValido).toBe(true);
      });
    });

    it('should run #anterior() and update indices', () => {
      component.wizardComponent = { atras: jest.fn(), indiceActual: 2 };
      component.datosPasos = { indice: 0 };
      component.anterior();
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.indice).toBe(3);
      expect(component.datosPasos.indice).toBe(3);
    });

    it('should run #siguiente() and update indices', () => {
      component.wizardComponent = { siguiente: jest.fn(), indiceActual: 1 };
      component.datosPasos = { indice: 0 };
      component.siguiente();
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
    });

    it('should run #cargaRealizada() and update seccionCargarDocumentos', () => {
      component.seccionCargarDocumentos = true;
      component.cargaRealizada(true);
      expect(component.seccionCargarDocumentos).toBe(false);
      component.cargaRealizada(false);
      expect(component.seccionCargarDocumentos).toBe(true);
    });

    it('should run #onClickCargaArchivos() and emit event', () => {
      component.cargarArchivosEvento = { emit: jest.fn() };
      component.onClickCargaArchivos();
      expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
    });

    it('should run #manejaEventoCargaDocumentos() and update activarBotonCargaArchivos', () => {
      component.activarBotonCargaArchivos = false;
      component.manejaEventoCargaDocumentos(true);
      expect(component.activarBotonCargaArchivos).toBe(true);
      component.manejaEventoCargaDocumentos(false);
      expect(component.activarBotonCargaArchivos).toBe(false);
    });

    it('should run #onCargaEnProgreso() and update cargaEnProgreso', () => {
      component.cargaEnProgreso = false;
      component.onCargaEnProgreso(true);
      expect(component.cargaEnProgreso).toBe(true);
      component.onCargaEnProgreso(false);
      expect(component.cargaEnProgreso).toBe(false);
    });

    it('should run #cerrarMensajeValidacion() and reset validation state', () => {
      component.mostrarMensajeValidacion = true;
      component.mensajeValidacion = 'error';
      component.timeoutId = setTimeout(() => {}, 1000);
      component.cerrarMensajeValidacion();
      expect(component.mostrarMensajeValidacion).toBe(false);
      expect(component.mensajeValidacion).toBe('');
      expect(component.timeoutId).toBeNull();
    });

    describe('#getValorIndice edge cases', () => {
      beforeEach(() => {
        component.wizardComponent = {
          siguiente: jest.fn(),
          atras: jest.fn()
        };
      });

      it('should not update indice if valor is negative', () => {
        const event = { valor: -1, accion: 'cont' };
        component.indice = 1;
        component.getValorIndice(event);
        expect(component.indice).toBe(1);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });

      it('should not update indice if valor is greater than pantallasPasos.length', () => {
        component.pantallasPasos = [1,2,3];
        const event = { valor: 10, accion: 'cont' };
        component.indice = 1;
        component.getValorIndice(event);
        expect(component.indice).toBe(1);
        expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
        expect(component.wizardComponent.atras).not.toHaveBeenCalled();
      });
    });

  describe('#getValorIndice', () => {
    beforeEach(() => {
      component.wizardComponent = {
        siguiente: jest.fn(),
        atras: jest.fn()
      };
    });

    it('should call siguiente if accion is "cont" and valor is valid', () => {
      const event = { valor: 2, accion: 'cont' };
      component.getValorIndice(event);
      expect(component.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should call atras if accion is not "cont" and valor is valid', () => {
      const event = { valor: 3, accion: 'back' };
      component.getValorIndice(event);
      expect(component.indice).toBe(3);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    });

    it('should not call anything if valor is 0 (invalid)', () => {
      const event = { valor: 0, accion: 'cont' };
      component.getValorIndice(event);
      expect(component.indice).not.toBe(0);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });

    it('should not call anything if valor is 5 (out of range)', () => {
      const event = { valor: 5, accion: 'cont' };
      component.getValorIndice(event);
      expect(component.indice).not.toBe(5);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
      expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    });
  });

});
