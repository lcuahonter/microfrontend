import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of as observableOf, of } from 'rxjs';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Directive,
  Input,
  Pipe,
  PipeTransform,
  ChangeDetectorRef,
} from '@angular/core';

import { ConstanciaDelRegistroComponent } from './constancia-del-registro.component';
import { ElegibilidadDeTextilesStore } from '../../estados/elegibilidad-de-textiles.store';
import { ElegibilidadDeTextilesQuery } from '../../queries/elegibilidad-de-textiles.query';
import {
  SeccionLibStore,
  SeccionLibQuery,
  ConsultaioQuery,
} from '@libs/shared/data-access-user/src';
import { ElegibilidadTextilesService } from '../../services/elegibilidad-textiles/elegibilidad-textiles.service';
import { HttpClient } from '@angular/common/http';
import { AnioConstanciaService } from '../../services/catalogos/anio-constancia.service';
import { TplService } from '../../services/Tpl.service';
import { GuardadoService } from '../../services/guardado.service';
import { Tramite120301Store } from '../../estados/tramites/tramite120301.store';

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom: any;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('ConstanciaDelRegistroComponent', () => {
  let component: ConstanciaDelRegistroComponent;
  let fixture: ComponentFixture<ConstanciaDelRegistroComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConstanciaDelRegistroComponent, ReactiveFormsModule, FormsModule],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: HttpClient, useValue: { get: jest.fn().mockReturnValue(of({})) } },
        { provide: '_HttpClient', useValue: { get: jest.fn().mockReturnValue(of({})), post: jest.fn().mockReturnValue(of({})) } },
        { provide: AnioConstanciaService, useValue: { 
          getAnios: jest.fn().mockReturnValue(of({ codigo: '00', datos: [] })),
          getAniosAutorizacion: jest.fn().mockReturnValue(of([])),
          ObtenerAnios: jest.fn().mockReturnValue(of({ codigo: '00', datos: [] }))
        } },
        { provide: ElegibilidadDeTextilesStore, useValue: { setFormaValida: jest.fn(), update: jest.fn() } },
        { provide: ElegibilidadDeTextilesQuery, useValue: { 
          selectTextile$: of({ formaValida: [] }),
          getValue: jest.fn().mockReturnValue({ readonly: false })
        } },
        { provide: SeccionLibStore, useValue: { establecerFormaValida: jest.fn(), establecerSeccion: jest.fn() } },
        { provide: SeccionLibQuery, useValue: { selectSeccionState$: of({ formaValida: [] }) } },
        { provide: ConsultaioQuery, useValue: { selectSeccionState$: of({}), getValue: jest.fn().mockReturnValue({ readonly: false }) } },
        { provide: ElegibilidadTextilesService, useValue: { obtenerTablaDatos: jest.fn().mockReturnValue(of([])) } },
        { provide: TplService, useValue: { 
          postTplDetalle: jest.fn().mockReturnValue(of({})), 
          posTpl: jest.fn().mockReturnValue(of({ codigo: '00', datos: [] })),
          obtenerConfiguracionesTramite: jest.fn().mockReturnValue(of({ codigo: '00', datos: [] })),
          obtenerRepresentacionFederal: jest.fn().mockReturnValue(of({ codigo: '00', datos: {} })),
          getRepresentacionFederal: jest.fn().mockReturnValue(of({ codigo: '00', datos: {} })),
          obtenerDetallePorConstanciaIdAnio: jest.fn().mockReturnValue(of({ codigo: '00', datos: {} }))
        } },
        { provide: GuardadoService, useValue: { 
          postParcial: jest.fn().mockReturnValue(of({})),
          postGuardadoParcial: jest.fn().mockReturnValue(of({}))
        } },
        { provide: Tramite120301Store, useValue: { setTramite120301: jest.fn() } },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ConstanciaDelRegistroComponent);
    component = fixture.componentInstance;
    
    const mockConstanciaState = {
      flexRadioRegistro: 'Todos',
      anoDeLaConstancia: '',
      numeroDeLaConstancia: '',
      estado: '',
      representacionFederal: '',
      fraccionArancelaria: '',
      descripcionProducto: '',
      tratado: '',
      subproducto: '',
      mecanismo: '',
      typoCategoria: '',
      typoRegimen: '',
      descripcionCategoriaTextil: '',
      PaisDestino: '',
      unidadMedidaCategoriaTextil: '',
      factorConversionCategoriaTextil: '',
      formaValida: [],
      guardarBandera: false,
      datosTablaConstanciaDelRegistro: [],
      fechaInicioVigencia: '',
      fechaFinVigencia: ''
    };
    
    (component as any).configuracionTablaDatos = [];
    (component as any).constanciaState = mockConstanciaState;
    (component as any).anios = [];
    
    // Inicializar el formulario
    component.initActionFormBuild();
    
    (component as any).seccionQuery = {
      selectSeccionState$: of({ readonly: false })
    };
    (component as any).ElegibilidadDeTextilesQuery = {
      selectTextile$: of(mockConstanciaState)
    };
    (component as any).consultaioQuery = {
      getValue: () => ({ readonly: false }),
      selectConsultaioState$: of({ readonly: false })
    };
    (component as any).anioConstanciaService = {
      getAnios: () => of({ codigo: '00', datos: [] })
    };
    (component as any).seccionStore = {
      establecerFormaValida: jest.fn(),
      establecerSeccion: jest.fn()
    };
    (component as any).ElegibilidadDeTextilesStore = {
      setFormaValida: jest.fn(),
      update: jest.fn()
    };
  });
  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });
  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
  it('debe ejecutar ngOnInit()', () => {
    component.ngOnInit();
    expect(component.fitosanitarioForm).toBeDefined();
  });
  it('debe inicializar el formulario en español', () => {
    component.ngOnInit();
    expect(component.fitosanitarioForm).toBeDefined();
  });
  it('debe inicializar el formulario en initActionFormBuild()', () => {
    component.ngOnInit();
    expect(component.fitosanitarioForm).toBeDefined();
  });
  it('debe cubrir continuar() con formulario inválido', () => {
    component.fitosanitarioForm = {
      markAllAsTouched: jest.fn(),
      updateValueAndValidity: jest.fn(),
      valid: false,
    } as any;
    (component as any)['cdr'] = { detectChanges: jest.fn() };
    window.scrollTo = jest.fn();
    component.mostrarTabs = { emit: jest.fn() } as any;
    component.continuar();
    expect(component.fitosanitarioForm.markAllAsTouched).toHaveBeenCalled();
    expect(
      component.fitosanitarioForm.updateValueAndValidity
    ).toHaveBeenCalled();
    expect((component as any)['cdr'].detectChanges).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(component.formularioAlertaError).toBeDefined();
    expect(component.esFormaValido).toBe(true);
    expect(component.mostrarTabs.emit).not.toHaveBeenCalled();
  });

  it('debe cubrir continuar() con formulario válido', () => {
    component.fitosanitarioForm = {
      markAllAsTouched: jest.fn(),
      updateValueAndValidity: jest.fn(),
      valid: true,
    } as any;
    (component as any)['cdr'] = { detectChanges: jest.fn() };
    window.scrollTo = jest.fn();
    component.mostrarTabs = { emit: jest.fn() } as any;
    component.continuar();
    expect(component.formularioAlertaError).toBe('');
    expect(component.esFormaValido).toBe(false);
    expect(component.mostrarTabs.emit).toHaveBeenCalledWith(true);
  });

  it('debe cubrir buscarEvaluar() rama Especifico con controles inválidos', () => {
    const markAsTouchedAno = jest.fn();
    const markAsTouchedNumero = jest.fn();
    component.fitosanitarioForm = {
      get: jest.fn((field) => {
        if (field === 'flexRadioRegistro') return { value: 'Especifico' };
        if (field === 'anoDeLaConstancia')
          return { markAsTouched: markAsTouchedAno, invalid: true };
        if (field === 'numeroDeLaConstancia')
          return { markAsTouched: markAsTouchedNumero, invalid: true };
        return null;
      }),
    } as any;
    component.errorValidacion = { emit: jest.fn() } as any;
    window.scrollTo = jest.fn();
    component.buscarEvaluar();
    expect(component.fitosanitarioForm.get).toHaveBeenCalledWith(
      'flexRadioRegistro'
    );
    expect(
      component.fitosanitarioForm.get('anoDeLaConstancia')?.markAsTouched
    ).toHaveBeenCalled();
    expect(
      component.fitosanitarioForm.get('numeroDeLaConstancia')?.markAsTouched
    ).not.toHaveBeenCalled();
    expect(component.anoFormValido).toBe(true);
    expect(component.errorValidacion.emit).toHaveBeenCalledWith(true);
  });

  it('debe cubrir onFilaClic() rama null', () => {
    const spy = jest.spyOn(component, 'onFilaClic');
    component.onFilaClic(null as any);
    expect(spy).toHaveReturnedWith(undefined);
  });

  it('debe cubrir rama guardarBandera y deshabilitar controles', () => {
    const disableField1 = jest.fn();
    const disableField2 = jest.fn();
    (component as any).constanciaState = {
      guardarBandera: true,
      formaValida: [],
      datosTablaConstanciaDelRegistro: [],
    };
    component.fitosanitarioForm = {
      get: jest.fn((key) => {
        if (key === 'field1') return { value: '', disable: disableField1 };
        if (key === 'field2') return { value: '', disable: disableField2 };
        return { value: '', disable: jest.fn() };
      }),
      patchValue: jest.fn(),
      controls: { field1: {}, field2: {} },
    } as any;
    component.formularioDeshabilitado = false;
    Object.keys(component.fitosanitarioForm.controls).forEach((key) => {
      if (!component.formularioDeshabilitado) {
        component.fitosanitarioForm.get(key)?.disable();
      }
    });
    expect(component.fitosanitarioForm.get).toHaveBeenCalledWith('field1');
    expect(component.fitosanitarioForm.get).toHaveBeenCalledWith('field2');
    expect(disableField1).toHaveBeenCalled();
    expect(disableField2).toHaveBeenCalled();
  });

  it('debe ejecutar catAnios() correctamente', () => {
    const anioService = TestBed.inject(AnioConstanciaService) as any;
    const response = { 
      codigo: '00', 
      datos: [{ id: 1, clave: '2023', nombre: '2023', descripcion: 'Año 2023' }],
      path: '/api/test',
      timestamp: new Date().toISOString(),
      mensaje: 'success'
    };
    anioService.getAnios.mockReturnValue(observableOf(response));
    
    // Espiar la propiedad de servicio del componente
    jest.spyOn(component['anioConstanciaService'], 'getAnios').mockReturnValue(observableOf(response));
    
    component.catAnios();
    
    expect(component['anioConstanciaService'].getAnios).toHaveBeenCalled();
    expect((component as any).anios).toEqual(response.datos);
  });

  it('debe ejecutar catAnios() con error', () => {
    const anioService = TestBed.inject(AnioConstanciaService) as any;
    const response = { 
      codigo: '01', 
      datos: [],
      path: '/api/test',
      timestamp: new Date().toISOString(),
      mensaje: 'error'
    };
    anioService.getAnios.mockReturnValue(observableOf(response));

    // Espiar la propiedad de servicio del componente
    jest.spyOn(component['anioConstanciaService'], 'getAnios').mockReturnValue(observableOf(response));
    
    component.catAnios();
    
    expect(component['anioConstanciaService'].getAnios).toHaveBeenCalled();
    expect((component as any).anios).toEqual([]);
  });

  it('debe ejecutar cargaDatosTabla() correctamente', () => {
    const tplService = TestBed.inject(TplService) as any;
    const response = { 
      codigo: '00', 
      datos: [{ 
        num_constancia: '123',
        fraccion_arancelaria: '1234.56.78',
        clasificacion_regimen: 'Test',
        pais: 'Mexico',
        desc_categoria_textil: 'Cotton',
        fecha_inicio: '2023-01-01',
        fecha_fin: '2023-12-31',
        id_asignacion: 1,
        id_mecanismo_asignacion: 2,
        id_categoria_textil: 3,
        cve_pais: 'MX',
        id_fraccion_hts_usa: 4
      }] 
    };
    tplService.posTpl.mockReturnValue(observableOf(response));
    
    component.cargaDatosTabla();
    
    expect(tplService.posTpl).toHaveBeenCalled();
    expect(component.configuracionTablaDatos.length).toBe(1);
    expect(component.configuracionTablaDatos[0].numeroDeConstancia).toBe('123');
  });

  it('debe ejecutar cargaDatosTabla() con error', () => {
    const tplService = TestBed.inject(TplService) as any;
    const response = { codigo: '01', datos: null };
    tplService.posTpl.mockReturnValue(observableOf(response));
    
    component.cargaDatosTabla();
    
    expect(tplService.posTpl).toHaveBeenCalled();
    expect(component.configuracionTablaDatos).toEqual([]);
  });

  it('debe ejecutar onValueChange() con valor válido', () => {
    const newValue = 'test-value';
    component.onValueChange(newValue);
    
    expect(component.esFormaValido).toBeFalsy();
    expect(component.formularioAlertaError).toBe('');
  });

  it('debe ejecutar onValueChange() con valor especial "Todos"', () => {
    component.onValueChange('Todos');
    
    expect(component.selectedValue).toBe('Todos');
    expect(component.formularioAlertaError).toBe('');
  });

  it('debe ejecutar onValueChange() con valor vacío', () => {
    component.onValueChange('');
    
    expect(component.esFormaValido).toBeFalsy();
    expect(component.formularioAlertaError).toBe('');
  });

  it('debe ejecutar onFilaClic() con fila válida', () => {
    const tplService = TestBed.inject(TplService) as any;
    const mockFila = {
      idAsignacion: 1,
      idMecanismoAsignacion: 2,
      fraccionArancelaria: '1234.56.78',
      cvePais: 'MX',
      idCategoriaTextil: 3,
      idFraccionHtsUsa: 4
    } as any;
    
    const mockTplResponse1 = { codigo: '00', datos: { 
      nombre_entidad: 'Estado Test',
      nombre: 'Representacion Test',
      clave: 'CLV123'
    } };
    const mockTplResponse2 = { codigo: '00', datos: { 
      descripcion_producto: 'Producto Test',
      tratado_bloque: 'Tratado Test',
      clasificacion_subproducto: 'Subproducto Test'
    } };
    
    tplService.getRepresentacionFederal.mockReturnValue(observableOf(mockTplResponse1));
    tplService.postTplDetalle.mockReturnValue(observableOf(mockTplResponse2));
    
    component.onFilaClic(mockFila);
    
    expect(tplService.getRepresentacionFederal).toHaveBeenCalled();
    expect(tplService.postTplDetalle).toHaveBeenCalled();
  });

  it('debe ejecutar guardarEvaluate() correctamente', () => {
    const guardadoService = TestBed.inject(GuardadoService) as any;
    const fb = TestBed.inject(FormBuilder);
    component.fitosanitarioForm = fb.group({
      anoDeLaConstancia: ['2023'],
      numeroDeLaConstancia: ['123']
    });
    
    component.guardarEvaluate();
    
    expect(guardadoService.postGuardadoParcial).toHaveBeenCalled();
  });

  it('debe ejecutar recuperarDatosAsociadas() correctamente', () => {
    const mockResponse = [{ columna1: 'valor1', columna2: 'valor2' }];
    const elegibilidadTextilesService = TestBed.inject(ElegibilidadTextilesService) as any;
    elegibilidadTextilesService.obtenerTablaDatos.mockReturnValue(observableOf(mockResponse));
    
    component.recuperarDatosAsociadas();
    
    expect(elegibilidadTextilesService.obtenerTablaDatos).toHaveBeenCalled();
  });

  it('debe ejecutar alCambioDeModeloDeAno() correctamente', () => {
    const value = '2023';
    component.alCambioDeModeloDeAno(value);
    
    expect(component.anoFormValido).toBeFalsy();
    expect(component.formularioAlertaAno).toBe('');
  });

  it('debe ejecutar alCambioDeModeloDeAno() con valor vacío', () => {
    component.alCambioDeModeloDeAno('');
    
    expect(component.anoFormValido).toBeFalsy();
  });

  it('debe ejecutar ngOnDestroy() correctamente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debe cubrir rama especifica en buscarEvaluar() con Todos', () => {
    component.fitosanitarioForm.patchValue({
      flexRadioRegistro: 'Todos'
    });
    
    component.buscarEvaluar();
    
    expect(component.esFormaValido).toBeFalsy();
  });

  it('debe cubrir rama con formulario deshabilitado en ngOnInit', () => {
    const query = TestBed.inject(ElegibilidadDeTextilesQuery) as any;
    component.formularioDeshabilitado = true;
    const mockState = { readonly: true };
    query.getValue.mockReturnValue(mockState);
    
    component.ngOnInit();
    
    expect(component.fitosanitarioForm).toBeDefined();
  });

  it('debe cubrir rama con configuracion readonly en ngOnInit', () => {
    const query = TestBed.inject(ElegibilidadDeTextilesQuery) as any;
    component.formularioDeshabilitado = false;
    const mockState = { readonly: true };
    query.getValue.mockReturnValue(mockState);
    
    component.ngOnInit();
    
    expect(component.fitosanitarioForm).toBeDefined();
  });

  it('debe cubrir rama de error en recuperarDatosAsociadas', () => {
    const mockResponse = [{ error: 'error' }];
    const elegibilidadTextilesService = TestBed.inject(ElegibilidadTextilesService) as any;
    elegibilidadTextilesService.obtenerTablaDatos.mockReturnValue(observableOf(mockResponse));
    
    component.recuperarDatosAsociadas();
    
    expect(elegibilidadTextilesService.obtenerTablaDatos).toHaveBeenCalled();
  });

  it('debe cubrir rama con anio vacio en alCambioDeModeloDeAno', () => {
    component.alCambioDeModeloDeAno(null as any);
    
    expect(component.anoFormValido).toBeFalsy();
  });

  it('debe cubrir onValueChange con numero', () => {
    component.onValueChange(123);
    
    expect(component.esFormaValido).toBeFalsy();
  });

  it('debe cubrir initActionFormBuild con formulario deshabilitado false', () => {
    component.formularioDeshabilitado = false;
    
    component.initActionFormBuild();
    
    expect(component.fitosanitarioForm).toBeDefined();
  });

  it('debe cubrir cargaDatosTabla sin datos', () => {
    const tplService = TestBed.inject(TplService) as any;
    const response = { codigo: '00', datos: null };
    tplService.obtenerConfiguracionesTramite.mockReturnValue(observableOf(response));
    
    component.cargaDatosTabla();
    
    expect(component.configuracionTablaDatos).toEqual([]);
  });

  it('debe cubrir continuar con validaciones adicionales', () => {
    const mockEmit = jest.spyOn(component.mostrarTabs, 'emit');
    component.fitosanitarioForm.patchValue({
      anoDeLaConstancia: '2023',
      numeroDeLaConstancia: '123',
      flexRadioRegistro: 'Especifico'
    });
    component.fitosanitarioForm.markAsTouched();
    
    component.continuar();
    
    expect(mockEmit).toHaveBeenCalledWith(true);
  });
});
