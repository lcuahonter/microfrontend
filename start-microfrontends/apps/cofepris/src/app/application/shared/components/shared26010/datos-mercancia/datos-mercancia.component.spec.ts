// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosMercanciaComponent } from './datos-mercancia.component';
import { FormBuilder } from '@angular/forms';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockDatosSolicitudService {
  obtenerRespuestaPorUrl = jest.fn().mockReturnValue(observableOf({}));
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('DatosMercanciaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosMercanciaComponent, HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService },
        Location
      ]
    }).overrideComponent(DatosMercanciaComponent, {

      set: { providers: [{ provide: DatosSolicitudService, useClass: MockDatosSolicitudService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(DatosMercanciaComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.validarElementos = jest.fn();
    component.crearMercanciaForm = jest.fn();
    component.crossListRequirdos = jest.fn();
    component.ngOnInit();
    expect(component.validarElementos).toHaveBeenCalled();
    expect(component.crearMercanciaForm).toHaveBeenCalled();
    expect(component.crossListRequirdos).toHaveBeenCalled();
  });

  it('should run #crossListRequirdos()', async () => {
    component.elementosRequirdos = component.elementosRequirdos || {};
    component.elementosRequirdos.includes = jest.fn();
    component.paisDeOriginLabel = component.paisDeOriginLabel || {};
    component.paisDeOriginLabel.derecha = 'derecha';
    component.paisDeProcedenciaLabel = component.paisDeProcedenciaLabel || {};
    component.paisDeProcedenciaLabel.derecha = 'derecha';
    component.usoEspesificoLabel = component.usoEspesificoLabel || {};
    component.usoEspesificoLabel.derecha = 'derecha';
    component.crossListRequirdos();
    expect(component.elementosRequirdos.includes).toHaveBeenCalled();
  });

  it('should run #validarElementos() for case 260102', async () => {
    component.idProcedimiento = 260102;
    component.validarElementos();
    expect(component.elementosNoValidos).toEqual([
      'denominacionDistintiva',
      'denominacionComun',
      'formaFarmaceutica',
      'estadoFisico',
      'presentacion',
      'numeroRegistroSanitario',
      'fechaCaducidad',
    ]);
    expect(component.elementosAnadidos).toEqual([
      'marca',
      'especifique',
      'claveDeLos',
      'fechaDeFabricacio',
      'fechaDeCaducidad',
    ]);
  });

  it('should run #validarElementos() for case 260208', async () => {
    component.idProcedimiento = 260208;
    component.validarElementos();
    expect(component.elementosNoValidos).toEqual(['numeroRegistroSanitario', 'fechaCaducidad']);
    expect(component.elementosAnadidos).toEqual(['especifique']);
    expect(component.elementosDeshabilitados).toEqual(['descripcionFraccion', 'cantidadUmt']);
  });

  it('should run #validarElementos() for case 260209', async () => {
    component.idProcedimiento = 260209;
    component.validarElementos();
    expect(component.elementosNoValidos).toEqual(['numeroRegistroSanitario', 'fechaCaducidad']);
    expect(component.elementosAnadidos).toEqual(['especifique']);
    expect(component.elementosDeshabilitados).toEqual(['descripcionFraccion', 'cantidadUmt']);
  });

  it('should run #validarElementos() for case 260207', async () => {
    component.idProcedimiento = 260207;
    component.validarElementos();
    expect(component.elementosAnadidos).toEqual(['especifique']);
    expect(component.elementosDeshabilitados).toEqual(['descripcionFraccion', 'cantidadUmt']);
  });

  it('should run #validarElementos() for case 260219', async () => {
    component.idProcedimiento = 260219;
    component.validarElementos();
    expect(component.elementosAnadidos).toEqual(['especifique', 'especifiqueForma', 'especifiqueEstado']);
    expect(component.elementosDeshabilitados).toEqual(['descripcionFraccion', 'cantidadUmt']);
  });

  it('should run #validarElementos() for case 260201', async () => {
    component.idProcedimiento = 260201;
    component.validarElementos();
    expect(component.elementosDeshabilitados).toEqual(['descripcionFraccion', 'cantidadUmt']);
    expect(component.elementosRequirdos).toEqual(['paisDeOrigen', 'paisDeProcedencia', 'usoEspecífico']);
  });

  it('should run #validarElementos() for default case with detalleMercancia', async () => {
    component.idProcedimiento = 999999;
    component.detalleMercancia = true;
    component.validarElementos();
    expect(component.elementosNoValidos).toEqual(['denominacionDistintiva', 'formaFarmaceutica']);
  });

  it('should run #modificarClave() with empty claveLista', async () => {
    component.claveLista = [];
    component.modificarClave();
    // Should return early due to empty claveLista
  });

  it('should run #modificarClave() with data', async () => {
    component.claveLista = [{ clave: 'test-clave', fabricacion: '2023-01-01', caducidad: '2024-01-01' }];
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.get = jest.fn().mockReturnValue({
      value: 'test-value'
    });
    component.claveConfig = {
      datos: [
        { clave: 'test-clave', fabricacion: 'old-fab', caducidad: 'old-cad' },
        { clave: 'other-clave', fabricacion: 'other-fab', caducidad: 'other-cad' }
      ]
    };
    
    component.modificarClave();
    
    expect(component.mercanciaForm.get).toHaveBeenCalled();
    expect(component.claveConfig.datos[0]).toEqual({
      clave: 'test-value',
      fabricacion: 'test-value',
      caducidad: 'test-value'
    });
  });

  it('should run #claveListaFn()', async () => {
    const mockClave = 'test-clave';
    const mockEvent = [{ clave: mockClave }];
    
    component.claveConfig = component.claveConfig || {};
    component.claveConfig.datos = [
      {
        clave: mockClave,
        fabricacion: '2023-01-01',
        caducidad: '2024-01-01'
      }
    ];
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.patchValue = jest.fn();
    
    component.claveListaFn(mockEvent);
    
    expect(component.mercanciaForm.patchValue).toHaveBeenCalled();
    expect(component.mercanciaForm.patchValue).toHaveBeenCalledWith({
      claveDeLos: mockClave,
      fechaDeFabricacio: '2023-01-01',
      fechaDeCaducidad: '2024-01-01'
    });
  });

  it('should run #agregarClave() with empty values', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.get = jest.fn().mockReturnValue({
      value: ''
    });
    component.mercanciaForm.patchValue = jest.fn();
    component.claveConfig = { datos: [] };
    
    component.agregarClave();
    
    expect(component.mercanciaForm.get).toHaveBeenCalled();
    expect(component.mercanciaForm.patchValue).not.toHaveBeenCalled();
    expect(component.claveConfig.datos.length).toBe(0);
  });

  it('should run #agregarClave() with valid values', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.get = jest.fn().mockReturnValue({
      value: 'test-value'
    });
    component.mercanciaForm.patchValue = jest.fn();
    component.claveConfig = { datos: [] };
    
    component.agregarClave();
    
    expect(component.mercanciaForm.get).toHaveBeenCalled();
    expect(component.mercanciaForm.patchValue).toHaveBeenCalledWith({
      claveDeLos: '',
      fechaDeFabricacio: '',
      fechaDeCaducidad: '',
    });
    expect(component.claveConfig.datos.length).toBe(1);
    expect(component.claveConfig.datos[0]).toEqual({
      clave: 'test-value',
      fabricacion: 'test-value',
      caducidad: 'test-value'
    });
  });

  it('should run #eliminarClave() with empty claveLista', async () => {
    component.claveLista = [];
    component.claveConfig = { datos: [{ clave: 'test' }] };
    
    component.eliminarClave();
    
    expect(component.claveConfig.datos.length).toBe(1);
  });

  it('should run #eliminarClave() with data', async () => {
    component.claveLista = [{ clave: 'test-clave' }];
    component.claveConfig = {
      datos: [
        { clave: 'test-clave', fabricacion: 'fab1', caducidad: 'cad1' },
        { clave: 'keep-clave', fabricacion: 'fab2', caducidad: 'cad2' }
      ]
    };
    
    component.eliminarClave();
    
    expect(component.claveConfig.datos.length).toBe(1);
    expect(component.claveConfig.datos[0].clave).toBe('keep-clave');
  });

  it('should run #crearMercanciaForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      addControl: function() {},
      contains: function() {},
      removeControl: function() {}
    });
    component.obtenerValor = jest.fn();
    component.elementosDeshabilitados = component.elementosDeshabilitados || {};
    component.elementosDeshabilitados.includes = jest.fn();
    component.elementosNoValidos = component.elementosNoValidos || {};
    component.elementosAnadidos = component.elementosAnadidos || {};
    component.crearMercanciaForm();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.obtenerValor).toHaveBeenCalled();
    expect(component.elementosDeshabilitados.includes).toHaveBeenCalled();
  });

  it('should run #obtenerValor()', async () => {
    component.mercanciaFormState = component.mercanciaFormState || {};
    component.mercanciaFormState.field = 'field';
    component.obtenerValor({});

  });

  it('should run #isValid()', async () => {

    component.isValid({
      controls: {
        campo: {
          errors: {},
          touched: {}
        }
      },
      errors: {},
      touched: {}
    }, {});

  });

  it('should run #paisDeOriginSeleccionadasChange()', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.patchValue = jest.fn();
    component.paisDeOriginSeleccionadasChange({});
    expect(component.mercanciaForm.patchValue).toHaveBeenCalled();
  });

  it('should run #paisDeProcedenciaSeleccionadasChange()', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.patchValue = jest.fn();
    component.paisDeProcedenciaSeleccionadasChange({});
    expect(component.mercanciaForm.patchValue).toHaveBeenCalled();
  });

  it('should run #usoEspesificoSeleccionadasChange()', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.get = jest.fn().mockReturnValue({
      setValue: function() {}
    });
    component.usoEspesificoSeleccionadasChange({});
    expect(component.mercanciaForm.get).toHaveBeenCalled();
  });

  it('should run #mostrarColapsable()', async () => {

    component.mostrarColapsable({});

  });

  it('should run #agregarMercancia()', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.getRawValue = jest.fn().mockReturnValue({
      cantidadUMT: {},
      unidadMedidaTarifa: {},
      cantidadUMC: {},
      unidadMedidaComercializacion: {},
      usoEspecifico: {},
      paisProcedencia: {},
      paisOrigen: {}
    });
    component.mercanciaForm.get = jest.fn().mockReturnValue({
      value: {
        0: {}
      }
    });
    component.mercanciaSeleccionado = component.mercanciaSeleccionado || {};
    component.mercanciaSeleccionado.emit = jest.fn();
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.agregarMercancia();
    expect(component.mercanciaForm.getRawValue).toHaveBeenCalled();
    expect(component.mercanciaForm.get).toHaveBeenCalled();
    expect(component.mercanciaSeleccionado.emit).toHaveBeenCalled();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #limpiarMercancia()', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.reset = jest.fn();
    component.limpiarMercancia();
    expect(component.mercanciaForm.reset).toHaveBeenCalled();
  });

  it('should run #cancelar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.cancelar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #agregarMercanciaSellecion()', async () => {
    component.agregarMercanciaDatos = component.agregarMercanciaDatos || {};
    component.agregarMercanciaDatos.emit = jest.fn();
    component.agregarMercanciaSellecion({});
    expect(component.agregarMercanciaDatos.emit).toHaveBeenCalled();
  });

  it('should run #eliminarMercancia()', async () => {
    component.eliminarMercanciaDatos = component.eliminarMercanciaDatos || {};
    component.eliminarMercanciaDatos.emit = jest.fn();
    component.eliminarMercancia({});
    expect(component.eliminarMercanciaDatos.emit).toHaveBeenCalled();
  });

  it('should run #cambiarFraccionArancelaria()', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.get = jest.fn().mockReturnValue({
      setValue: function() {},
      disabled: {}
    });
    component.cambiarFraccionArancelaria();
    expect(component.mercanciaForm.get).toHaveBeenCalled();
  });

  it('should run constructor with service calls', async () => {
    const mockService = {
      obtenerRespuestaPorUrl: jest.fn()
    };
    
    const testComponent = new DatosMercanciaComponent(
      new FormBuilder(),
      mockService as any,
      {} as any
    );
    
    expect(mockService.obtenerRespuestaPorUrl).toHaveBeenCalledTimes(6);
    expect(mockService.obtenerRespuestaPorUrl).toHaveBeenCalledWith(
      testComponent,
      'clasificacionProductoDatos',
      '/cofepris/mercanciaClasificacionProducto.json'
    );
  });



  it('should run #obtenerValor() with datoSeleccionado', async () => {
    component.datoSeleccionado = { 
      clasificacionProducto: 'test-value',
      tipoProducto: 'test-tipo'
    } as any;
    component.mercanciaFormState = {} as any;
    
    const result = component.obtenerValor('clasificacionProducto');
    expect(result).toBe('test-value');
  });

  it('should run #obtenerValor() with mercanciaFormState', async () => {
    component.datoSeleccionado = null as any;
    component.mercanciaFormState = { 
      clasificacionProducto: 'form-value',
      tipoProducto: 'form-tipo'
    } as any;
    
    const result = component.obtenerValor('clasificacionProducto');
    expect(result).toBe('form-value');
  });

  it('should run #isValid() with FormControl', async () => {
    const mockFormControl = {
      errors: { required: true },
      touched: true
    } as any;
    
    const result = component.isValid(mockFormControl);
    expect(result).toBe(true);
  });

  it('should run #isValid() with no errors', async () => {
    const mockFormControl = {
      errors: null,
      touched: true
    } as any;
    
    const result = component.isValid(mockFormControl);
    expect(result).toBe(null);
  });

  it('should run #mostrarColapsable() with orden 1', async () => {
    component.paisDeOriginColapsable = false;
    component.mostrarColapsable(1);
    expect(component.paisDeOriginColapsable).toBe(true);
  });

  it('should run #mostrarColapsable() with orden 2', async () => {
    component.paisDeProcedenciaColapsable = false;
    component.mostrarColapsable(2);
    expect(component.paisDeProcedenciaColapsable).toBe(true);
  });

  it('should run #mostrarColapsable() with orden 3', async () => {
    component.usoEspesificoColapsable = false;
    component.mostrarColapsable(3);
    expect(component.usoEspesificoColapsable).toBe(true);
  });

  it('should run #mostrarColapsable() with invalid orden', async () => {
    const initialState1 = component.paisDeOriginColapsable;
    const initialState2 = component.paisDeProcedenciaColapsable;
    const initialState3 = component.usoEspesificoColapsable;
    
    component.mostrarColapsable(999);
    
    expect(component.paisDeOriginColapsable).toBe(initialState1);
    expect(component.paisDeProcedenciaColapsable).toBe(initialState2);
    expect(component.usoEspesificoColapsable).toBe(initialState3);
  });

  it('should run #cambiarFraccionArancelaria() with disabled cantidadUmt', async () => {
    component.mercanciaForm = {
      get: jest.fn().mockImplementation((field) => {
        if (field === 'fraccionArancelaria') {
          return { value: 'test-fraccion' };
        }
        if (field === 'cantidadUmt') {
          return { disabled: true, setValue: jest.fn() };
        }
        if (field === 'descripcionFraccion') {
          return { setValue: jest.fn() };
        }
        return null;
      })
    } as any;
    
    component.cambiarFraccionArancelaria();
    
    expect(component.mercanciaForm.get).toHaveBeenCalledWith('fraccionArancelaria');
    expect(component.mercanciaForm.get).toHaveBeenCalledWith('cantidadUmt');
    expect(component.mercanciaForm.get).toHaveBeenCalledWith('descripcionFraccion');
  });

  it('should run #cambiarFraccionArancelaria() with enabled cantidadUmt', async () => {
    component.mercanciaForm = {
      get: jest.fn().mockImplementation((field) => {
        if (field === 'fraccionArancelaria') {
          return { value: 'test-fraccion' };
        }
        if (field === 'cantidadUmt') {
          return { disabled: false, setValue: jest.fn() };
        }
        return null;
      })
    } as any;
    
    component.cambiarFraccionArancelaria();
    
    expect(component.mercanciaForm.get).toHaveBeenCalledWith('fraccionArancelaria');
    expect(component.mercanciaForm.get).toHaveBeenCalledWith('cantidadUmt');
  });

  it('should run #cambiarFraccionArancelaria() without fraccionArancelaria', async () => {
    component.mercanciaForm = {
      get: jest.fn().mockReturnValue(null)
    } as any;
    
    component.cambiarFraccionArancelaria();
    
    expect(component.mercanciaForm.get).toHaveBeenCalledWith('fraccionArancelaria');
  });

  it('should run #crearMercanciaForm() with elementosNoValidos', async () => {
    component.fb = {
      group: jest.fn().mockReturnValue({
        addControl: jest.fn(),
        contains: jest.fn().mockReturnValue(true),
        removeControl: jest.fn()
      })
    } as any;
    component.obtenerValor = jest.fn().mockReturnValue('test-value');
    component.elementosDeshabilitados = [];
    component.elementosNoValidos = ['denominacionDistintiva'];
    component.elementosAnadidos = [];
    component.detalleMercancia = false;
    
    component.crearMercanciaForm();
    
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.mercanciaForm.removeControl).toHaveBeenCalledWith('denominacionDistintiva', { emitEvent: false });
  });

  it('should run #crearMercanciaForm() with elementosAnadidos', async () => {
    component.fb = {
      group: jest.fn().mockReturnValue({
        addControl: jest.fn(),
        contains: jest.fn().mockReturnValue(false),
        removeControl: jest.fn()
      })
    } as any;
    component.obtenerValor = jest.fn().mockReturnValue('test-value');
    component.elementosDeshabilitados = [];
    component.elementosNoValidos = [];
    component.elementosAnadidos = ['marca'];
    component.detalleMercancia = false;
    
    component.crearMercanciaForm();
    
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.mercanciaForm.addControl).toHaveBeenCalled();
  });

  it('should run #crearMercanciaForm() with detalleMercancia true', async () => {
    component.fb = {
      group: jest.fn().mockReturnValue({
        addControl: jest.fn(),
        contains: jest.fn().mockReturnValue(true),
        removeControl: jest.fn()
      })
    } as any;
    component.obtenerValor = jest.fn().mockReturnValue('test-value');
    component.elementosDeshabilitados = [];
    // The condition checks elementosNoValidos.length, so we need at least one element
    component.elementosNoValidos = ['someElement'];
    component.elementosAnadidos = [];
    component.detalleMercancia = true;
    
    component.crearMercanciaForm();
    
    expect(component.fb.group).toHaveBeenCalled();
    // With detalleMercancia = true and elementosNoValidos.length > 0, 
    // both formaFarmaceutica and denominacionDistintiva should be removed
    expect(component.mercanciaForm.removeControl).toHaveBeenCalledWith('formaFarmaceutica', { emitEvent: false });
    expect(component.mercanciaForm.removeControl).toHaveBeenCalledWith('denominacionDistintiva', { emitEvent: false });
  });

  it('should run #claveListaFn() with empty claveLista', async () => {
    const mockEvent: any[] = [];
    component.mercanciaForm = {
      patchValue: jest.fn()
    } as any;
    
    component.claveListaFn(mockEvent);
    
    expect(component.claveLista).toEqual([]);
    expect(component.mercanciaForm.patchValue).not.toHaveBeenCalled();
  });

  it('should run #crossListRequirdos() with all required elements', async () => {
    component.elementosRequirdos = ['paisDeOrigen', 'paisDeProcedencia', 'usoEspecífico'];
    
    component.crossListRequirdos();
    
    expect(component.paisDeOriginLabel.derecha).toBe('País(es) seleccionado(s)*');
    expect(component.paisDeProcedenciaLabel.derecha).toBe('País(es) seleccionado(s)*');
    expect(component.usoEspesificoLabel.derecha).toBe('País(es) seleccionado(s)*');
  });

  it('should run #crossListRequirdos() with no required elements', async () => {
    component.elementosRequirdos = [];
    
    component.crossListRequirdos();
    
    expect(component.paisDeOriginLabel.derecha).toBe('País(es) seleccionado(s)');
    expect(component.paisDeProcedenciaLabel.derecha).toBe('País(es) seleccionado(s)');
    expect(component.usoEspesificoLabel.derecha).toBe('País(es) seleccionado(s)');
  });

});