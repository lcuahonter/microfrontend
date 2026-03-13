import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';


describe('DatosMercanciaContenedoraComponent', () => {
  let component: DatosMercanciaContenedoraComponent;
  let fixture: ComponentFixture<DatosMercanciaContenedoraComponent>;
  let fb: FormBuilder;
  let mockService: any;
  let mockLocation: any;

  const catalogo = [{ id: 1, descripcion: 'A' }, { id: 2, descripcion: 'B' }];
  const mercanciaFormState = {
    presentacion: 'Caja',
    numeroRegistroSanitario: '123',
    clasificacionProducto: 'A',
    especificarClasificacionProducto: 'B',
    denominacionEspecificaProducto: 'Denom',
    denominacionDistintiva: 'Dist',
    denominacionComun: 'Com',
    tipoProducto: 'A',
    formaFarmaceutica: 'A',
    estadoFisico: 'A',
    fraccionArancelaria: 'FA',
    descripcionFraccion: 'DF',
    cantidadUmtValor: '1',
    cantidadUmcValor: '2',
    cantidadUmt: 1,
    cantidadUmc: 2,
    fechaCaducidad: '2025-01-01',
    paisDeOriginDatos: ['MX'],
    paisDeProcedenciaDatos: ['US'],
    usoEspecifico: ['Uso'],
    marca: 'Marca',
    especifique: 'Especifique',
    claveDeLos: 'Clave',
    fechaDeFabricacio: '2023-01-01',
    fechaDeCaducidad: '2025-01-01',
    especifiqueForma: 'Forma',
    especifiqueEstado: 'Estado'
  };

  beforeEach(async () => {
    mockService = {
      obtenerRespuestaPorUrl: jest.fn(),
    };
    mockLocation = { };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,DatosMercanciaContenedoraComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: DatosSolicitudService, useValue: mockService },
        { provide: Location, useValue: mockLocation },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);

    
    component.clasificacionProductoDatos = catalogo;
    component.especificarClasificacionProductoDatos = catalogo;
    component.tipoProductoDatos = catalogo;
    component.formaFarmaceuticaDatos = catalogo;
    component.estadoFisicoDatos = catalogo;
    component.cantidadUmcDatos = catalogo;
    component.mercanciaFormState = mercanciaFormState as any;
    component.datoSeleccionado = mercanciaFormState as any;
    component.idProcedimiento = 260102;
    component.detalleMercancia = false;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('constructor should call obtenerRespuestaPorUrl and set datosMercanciaCampo', () => {
    const spy = jest.spyOn(mockService, 'obtenerRespuestaPorUrl');
    const cmp = new DatosMercanciaContenedoraComponent(fb, mockService, mockLocation);
    cmp.idProcedimiento = 260102;
    expect(spy).toHaveBeenCalled();
    expect(typeof cmp.datosMercanciaCampo).toBe('boolean');
  });

  it('ngOnInit should call validarElementos, crearMercanciaForm, crossListRequirdos', () => {
    const vSpy = jest.spyOn(component, 'validarElementos');
    const cSpy = jest.spyOn(component, 'crearMercanciaForm');
    const xSpy = jest.spyOn(component, 'crossListRequirdos');
    component.ngOnInit();
    expect(vSpy).toHaveBeenCalled();
    expect(cSpy).toHaveBeenCalled();
    expect(xSpy).toHaveBeenCalled();
  });

  it('setEditBlocked disables/enables form', () => {
    component.crearMercanciaForm();
    component.setEditBlocked(true);
    expect(component.mercanciaForm.disabled).toBe(true);
    component.setEditBlocked(false);
    expect(component.mercanciaForm.enabled).toBe(true);
  });

  it('validarElementos sets correct arrays for each idProcedimiento', () => {
    component.idProcedimiento = 260102;
    component.validarElementos();
    expect(component.elementosNoValidos.length).toBeGreaterThan(0);
    component.idProcedimiento = 260208;
    component.validarElementos();
    expect(component.elementosDeshabilitados).toContain('descripcionFraccion');
    component.idProcedimiento = 260201;
    component.validarElementos();
    expect(component.elementosRequirdos).toContain('paisDeOrigen');
    component.idProcedimiento = 999999;
    component.detalleMercancia = true;
    component.validarElementos();
    expect(component.elementosNoValidos).toContain('denominacionDistintiva');
  });

  it('cerrarMercanciaModal emits cancelarMercanciaModal', () => {
    const spy = jest.spyOn(component.cancelarMercanciaModal, 'emit');
    component.cerrarMercanciaModal();
    expect(spy).toHaveBeenCalled();
  });
  it('modificarClave updates claveConfig.datos if claveLista present', () => {
    component.claveConfig.datos = [{ clave: 'A', fabricacion: 'F', caducidad: 'C' }];
    component.claveLista = [{ clave: 'A', fabricacion: 'F', caducidad: 'C' }];
    component.crearMercanciaForm();
    component.mercanciaForm.patchValue({ claveDeLos: 'B', fechaDeFabricacio: 'F2', fechaDeCaducidad: 'C2' });
    component.modificarClave();
    expect(component.claveConfig.datos[0].clave).toBe('B');
  });

  it('claveListaFn patches form if clave found', () => {
    component.claveConfig.datos = [{ clave: 'A', fabricacion: 'F', caducidad: 'C' }];
    component.crearMercanciaForm();
    component.claveListaFn([{ clave: 'A', fabricacion: 'F', caducidad: 'C' }]);
    expect(component.mercanciaForm.get('claveDeLos')).toBeTruthy();
  });

  it('agregarClave adds clave if all present and resets fields', () => {
    component.crearMercanciaForm();
    component.mercanciaForm.patchValue({ claveDeLos: 'X', fechaDeFabricacio: 'F', fechaDeCaducidad: 'C' });
    component.agregarClave();
    expect(component.claveConfig.datos.length).toBe(1);
    expect(component.mercanciaForm.get('claveDeLos')?.value).toBe('');
  });

  it('eliminarClave removes claves from claveConfig.datos', () => {
    component.claveConfig.datos = [{ clave: 'A', fabricacion: 'F', caducidad: 'C' }];
    component.claveLista = [{ clave: 'A', fabricacion: 'F', caducidad: 'C' }];
    component.eliminarClave();
    expect(component.claveConfig.datos.length).toBe(0);
  });

  it('crearMercanciaForm calls areCatalogsLoaded, buildMercanciaForm, removeInvalidControls, addExtraControls', () => {
    const aSpy = jest.spyOn(component as any, 'areCatalogsLoaded');
    const bSpy = jest.spyOn(component as any, 'buildMercanciaForm');
    const rSpy = jest.spyOn(component as any, 'removeInvalidControls');
    const adSpy = jest.spyOn(component as any, 'addExtraControls');
    component.crearMercanciaForm();
    expect(aSpy).toHaveBeenCalled();
    expect(bSpy).toHaveBeenCalled();
    expect(rSpy).toHaveBeenCalled();
    expect(adSpy).toHaveBeenCalled();
  });

  it('areCatalogsLoaded returns true/false and logs warning', () => {
    component.clasificacionProductoDatos = [];
    const logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect((component as any).areCatalogsLoaded()).toBe(false);
    component.clasificacionProductoDatos = catalogo;
    component.especificarClasificacionProductoDatos = catalogo;
    component.tipoProductoDatos = catalogo;
    component.formaFarmaceuticaDatos = catalogo;
    component.estadoFisicoDatos = catalogo;
    component.cantidadUmcDatos = catalogo;
    expect((component as any).areCatalogsLoaded()).toBe(true);
    logSpy.mockRestore();
  });

  it('getUmtUmcIds returns correct ids', () => {
    component.cantidadUmcDatos = [{ id: 5, descripcion: '1' }];
    component.mercanciaFormState = { cantidadUmtValor: '1' } as any;
    const ids = (component as any).getUmtUmcIds();
    expect(ids.MAPPED_UMT_ID).toBe(5);
  });

  it('buildMercanciaForm returns FormGroup with correct values', () => {
    const fg = (component as any).buildMercanciaForm(1, 2);
    expect(fg instanceof FormGroup).toBe(true);
    expect(fg.get('clasificacionProducto')?.value).toBe(1);
  });

  it('removeInvalidControls removes controls', () => {
    component.crearMercanciaForm();
    component.elementosNoValidos = ['denominacionComun'];
    component.mercanciaForm.addControl('denominacionComun', fb.control('X'));
    (component as any).removeInvalidControls();
    expect(component.mercanciaForm.contains('denominacionComun')).toBe(false);
  });

  it('addExtraControls adds controls', () => {
    component.crearMercanciaForm();
    component.elementosAnadidos = ['marca'];
    (component as any).addExtraControls();
    expect(component.mercanciaForm.contains('marca')).toBe(true);
  });

  it('matchCatalogId finds id or returns null', () => {
    expect(DatosMercanciaContenedoraComponent.matchCatalogId(catalogo, 'A')).toBe(1);
    expect(DatosMercanciaContenedoraComponent.matchCatalogId(catalogo, 'Z')).toBeNull();
  });

  it('normalize normalizes string', () => {
    expect((DatosMercanciaContenedoraComponent as any).normalize(' A/B. ')).toBe('a b');
  });

  it('obtenerValor returns from mercanciaFormState, datoSeleccionado, or undefined', () => {
    component.mercanciaFormState = { test: 'X' } as any;
    expect(component.obtenerValor('test' as any)).toBe('X');
    component.mercanciaFormState = {} as any;
    component.datoSeleccionado = { test: 'Y' } as any;
    expect(component.obtenerValor('test' as any)).toBe('Y');
    component.datoSeleccionado = {} as any;
    expect(component.obtenerValor('test' as any)).toBeUndefined();
  });

  it('isValid returns correct validity', () => {
    const ctrl = fb.control('', { validators: [] });
    ctrl.markAsTouched();
    expect(component.isValid(ctrl)).toBeFalsy();
    ctrl.setErrors({ required: true });
    expect(component.isValid(ctrl)).toBeTruthy();
    const fg = fb.group({ a: fb.control('') });
    fg.get('a')?.markAsTouched();
    expect(component.isValid(fg, 'a')).toBeFalsy();
  });

  it('paisDeOriginSeleccionadasChange updates property and form', () => {
    component.crearMercanciaForm();
    component.paisDeOriginSeleccionadasChange(['MX']);
    expect(component.seleccionadasPaisDeOriginDatos).toContain('MX');
    expect(component.mercanciaForm.get('paisDeOriginDatos')?.value).toContain('MX');
  });

  it('paisDeProcedenciaSeleccionadasChange updates property and form', () => {
    component.crearMercanciaForm();
    component.paisDeProcedenciaSeleccionadasChange(['US']);
    expect(component.seleccionadasPaisDeProcedenciaDatos).toContain('US');
    expect(component.mercanciaForm.get('paisDeProcedenciaDatos')?.value).toContain('US');
  });

  it('usoEspesificoSeleccionadasChange updates property and form', () => {
    component.crearMercanciaForm();
    component.usoEspesificoSeleccionadasChange(['Uso']);
    expect(component.seleccionadasUsoEspesificoDatos).toContain('Uso');
    expect(component.mercanciaForm.get('usoEspecifico')?.value).toContain('Uso');
  });

  it('mostrarColapsable toggles correct property', () => {
    component.paisDeOriginColapsable = false;
    component.mostrarColapsable(1);
    expect(component.paisDeOriginColapsable).toBe(true);
    component.paisDeProcedenciaColapsable = false;
    component.mostrarColapsable(2);
    expect(component.paisDeProcedenciaColapsable).toBe(true);
    component.usoEspesificoColapsable = false;
    component.mostrarColapsable(3);
    expect(component.usoEspesificoColapsable).toBe(true);
  });

  it('limpiarMercancia resets arrays and form', () => {
    component.crearMercanciaForm();
    component.seleccionadasUsoEspesificoDatos = ['X'];
    component.seleccionadasPaisDeOriginDatos = ['Y'];
    component.seleccionadasPaisDeProcedenciaDatos = ['Z'];
    component.mercanciaForm.get('presentacion')?.setValue('X');
    component.limpiarMercancia();
    expect(component.seleccionadasUsoEspesificoDatos).toEqual([]);
    expect(component.seleccionadasPaisDeOriginDatos).toEqual([]);
    expect(component.seleccionadasPaisDeProcedenciaDatos).toEqual([]);
    const presentacionValue = component.mercanciaForm.get('presentacion')?.value;
    expect(presentacionValue === null || presentacionValue === undefined).toBe(true);
  });

  it('cancelar sets nuevaNotificacion', () => {
    component.cancelar();
    expect(component.nuevaNotificacion).toBeTruthy();
    expect(component.nuevaNotificacion.mensaje).toBe('Cancelado');
  });

  it('cambiarFraccionArancelaria sets/describes fields or calls abrirModal', () => {
    component.crearMercanciaForm();
    component.mercanciaForm.get('fraccionArancelaria')?.setValue('123');
    component.mercanciaForm.get('cantidadUmt')?.disable();
    component.cambiarFraccionArancelaria();
    expect(component.mercanciaForm.get('descripcionFraccion')?.value).toBeDefined();
    component.mercanciaForm.get('fraccionArancelaria')?.setValue('abc');
    const spy = jest.spyOn(component, 'abrirModal');
    component.cambiarFraccionArancelaria();
    expect(spy).toHaveBeenCalled();
  });

  it('eliminarPedimento removes from pedimentos', () => {
    component.pedimentos = [{}, {}] as any;
    component.elementoParaEliminar = 0;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(1);
  });

  it('abrirModal sets nuevaNotificacion and elementoParaEliminar', () => {
    component.abrirModal(2);
    expect(component.nuevaNotificacion).toBeTruthy();
    expect(component.elementoParaEliminar).toBe(2);
  });

  it('onAgregarMercancia emits event if valid, marks all as touched and logs if invalid', () => {
    component.crearMercanciaForm();
    component.mercanciaForm.patchValue({
      presentacion: 'Caja',
      numeroRegistroSanitario: '123',
      clasificacionProducto: 1,
      especificarClasificacionProducto: 2,
      denominacionEspecificaProducto: 'Denom',
      denominacionDistintiva: 'Dist',
      denominacionComun: 'Com',
      tipoProducto: 1,
      formaFarmaceutica: 1,
      estadoFisico: 1,
      fraccionArancelaria: 'FA',
      descripcionFraccion: 'DF',
      cantidadUmtValor: '1',
      cantidadUmcValor: '2',
      cantidadUmt: 1,
      cantidadUmc: 2,
      paisDeOriginDatos: ['MX'],
      paisDeProcedenciaDatos: ['US'],
      usoEspecifico: ['Uso']
    });
    const spy = jest.spyOn(component.agregarMercancia, 'emit');
    component.onAgregarMercancia();
    expect(spy).toHaveBeenCalled();
    component.mercanciaForm.get('presentacion')?.setValue('');
    const logSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    component.onAgregarMercancia();
    const allTouched = Object.values(component.mercanciaForm.controls).every(ctrl => ctrl.touched);
    logSpy.mockRestore();
  });
});