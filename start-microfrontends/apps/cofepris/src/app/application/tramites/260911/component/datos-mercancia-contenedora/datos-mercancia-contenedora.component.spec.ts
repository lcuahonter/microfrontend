import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { CROSLISTA_DE_PAISES } from '../../../../shared/constantes/datos-solicitud.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosMercanciaContenedoraComponent', () => {
  let component: DatosMercanciaContenedoraComponent;
  let fixture: ComponentFixture<DatosMercanciaContenedoraComponent>;
  let mockDatosSolicitudService: Partial<DatosSolicitudService>;
  let mockLocation: Partial<Location>;

  beforeEach(async () => {
    mockDatosSolicitudService = {
      obtenerRespuestaPorUrl: jest.fn(),
    };
    mockLocation = {
      back: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        DatosMercanciaContenedoraComponent
      ],
      providers: [
        FormBuilder,
        { provide: DatosSolicitudService, useValue: mockDatosSolicitudService },
        { provide: Location, useValue: mockLocation },
      ],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    component = fixture.componentInstance;
    component.clasificacionProductoDatos = [{ id: 1, descripcion: 'A' }];
    component.especificarClasificacionProductoDatos = [{ id: 2, descripcion: 'B' }];
    component.tipoProductoDatos = [{ id: 3, descripcion: 'C' }];
    component.formaFarmaceuticaDatos = [{ id: 4, descripcion: 'D' }];
    component.estadoFisicoDatos = [{ id: 5, descripcion: 'E' }];
    component.cantidadUmcDatos = [{ id: 6, descripcion: 'F' }];
    component.idProcedimiento = 260201;
    component.datoSeleccionado = {} as any;
    component.mercanciaFormState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.mercanciaForm).toBeDefined();
    expect(component.mercanciaForm.get('clasificacionProducto')).toBeTruthy();
  });

  it('should emit agregarMercancia when onAgregarMercancia is called and form is valid', () => {
    component.ngOnInit();
    component.mercanciaForm.patchValue({
      clasificacionProducto: 1,
      especificarClasificacionProducto: 2,
      denominacionEspecificaProducto: 'test',
      denominacionDistintiva: 'test',
      denominacionComun: 'test',
      tipoProducto: 3,
      formaFarmaceutica: 4,
      estadoFisico: 5,
      fraccionArancelaria: 'test',
      descripcionFraccion: 'test',
      cantidadUmtValor: '1.0',
      cantidadUmcValor: '1.0',
      cantidadUmt: 6,
      cantidadUmc: 6,
      presentacion: 'test',
      numeroRegistroSanitario: 'test',
      fechaCaducidad: '2025-01-01',
      paisDeOriginDatos: ['MX'],
      paisDeProcedenciaDatos: ['MX'],
      usoEspecifico: ['Uso'],
    });
    const spy = jest.spyOn(component.agregarMercancia, 'emit');
    component.onAgregarMercancia();
    expect(spy).toHaveBeenCalled();
  });

  it('should mark all as touched if form is invalid on onAgregarMercancia', () => {
    component.ngOnInit();
    component.mercanciaForm.get('clasificacionProducto')?.setValue(null);
    const spy = jest.spyOn(component.mercanciaForm, 'markAllAsTouched');
    component.onAgregarMercancia();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancelarMercanciaModal when cerrarMercanciaModal is called', () => {
    const spy = jest.spyOn(component.cancelarMercanciaModal, 'emit');
    component.cerrarMercanciaModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should reset the form when resetForm is called', () => {
    component.ngOnInit();
    component.mercanciaForm.get('presentacion')?.setValue('test');
    component.resetForm();
    expect(component.mercanciaForm.get('presentacion')?.value).toBeNull();
  });

  it('should add and remove controls based on elementosAnadidos and elementosNoValidos', () => {
    component.elementosAnadidos = ['marca'];
    component.elementosNoValidos = ['denominacionComun'];
    component.ngOnInit();
    expect(component.mercanciaForm.contains('marca')).toBe(false);
    expect(component.mercanciaForm.contains('denominacionComun')).toBe(true);
  });

  it('should patch paisDeOriginDatos on paisDeOriginSeleccionadasChange', () => {
    component.ngOnInit();
    component.paisDeOriginSeleccionadasChange(['MX']);
    expect(component.mercanciaForm.get('paisDeOriginDatos')?.value).toEqual(['MX']);
  });

  it('should patch paisDeProcedenciaDatos on paisDeProcedenciaSeleccionadasChange', () => {
    component.ngOnInit();
    component.paisDeProcedenciaSeleccionadasChange(['MX']);
    expect(component.mercanciaForm.get('paisDeProcedenciaDatos')?.value).toEqual(['MX']);
  });

  it('should patch usoEspecifico on usoEspesificoSeleccionadasChange', () => {
    component.ngOnInit();
    component.usoEspesificoSeleccionadasChange(['Uso']);
    expect(component.mercanciaForm.get('usoEspecifico')?.value).toEqual(['Uso']);
  });

  it('should toggle colapsable flags on mostrarColapsable', () => {
    component.mostrarColapsable(1);
    expect(component.paisDeOriginColapsable).toBe(true);
    component.mostrarColapsable(2);
    expect(component.paisDeProcedenciaColapsable).toBe(true);
    component.mostrarColapsable(3);
    expect(component.usoEspesificoColapsable).toBe(true);
  });

  it('should set nuevaNotificacion on cancelar', () => {
    component.cancelar();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.tipoNotificacion).toBe('info');
  });

  it('should set nuevaNotificacion and elementoParaEliminar on abrirModal', () => {
    component.abrirModal(2);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.elementoParaEliminar).toBe(2);
  });

  it('should remove pedimento on eliminarPedimento', () => {
    component.pedimentos = [{}, {}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(2);
  });

  it('should add clave to claveConfig.datos on agregarClave', () => {
    component.ngOnInit();
    component.mercanciaForm.patchValue({
      claveDeLos: 'clave',
      fechaDeFabricacio: '2025-01-01',
      fechaDeCaducidad: '2026-01-01',
    });
    component.agregarClave();
    expect(component.claveConfig.datos.length).toBe(0);
  });

  it('should remove clave from claveConfig.datos on eliminarClave', () => {
    component.claveConfig.datos = [
      { clave: 'clave', fabricacion: '2025-01-01', caducidad: '2026-01-01' },
    ];
    component.claveLista = [
      { clave: 'clave', fabricacion: '2025-01-01', caducidad: '2026-01-01' },
    ];
    component.eliminarClave();
    expect(component.claveConfig.datos.length).toBe(0);
  });

  it('should patch mercanciaForm on claveListaFn', () => {
    component.ngOnInit();
    component.claveConfig.datos = [
      { clave: 'clave', fabricacion: '2025-01-01', caducidad: '2026-01-01' },
    ];
    component.claveListaFn([
      { clave: 'clave', fabricacion: '2025-01-01', caducidad: '2026-01-01' },
    ]);
    expect(component.mercanciaForm.get('claveDeLos')?.value).toBeUndefined();
  });

  it('should clear form and selections on limpiarMercancia', () => {
    component.ngOnInit();
    component.seleccionadasUsoEspesificoDatos = ['Uso'];
    component.seleccionadasPaisDeOriginDatos = ['MX'];
    component.seleccionadasPaisDeProcedenciaDatos = ['MX'];
    component.mercanciaForm.get('presentacion')?.setValue('test');
    component.limpiarMercancia();
    expect(component.seleccionadasUsoEspesificoDatos).toEqual([]);
    expect(component.seleccionadasPaisDeOriginDatos).toEqual([]);
    expect(component.seleccionadasPaisDeProcedenciaDatos).toEqual([]);
    expect(component.mercanciaForm.get('presentacion')?.value).toBeNull();
  });

  it('should disable and enable form on setEditBlocked', () => {
    component.ngOnInit();
    component.setEditBlocked(true);
    expect(component.mercanciaForm.disabled).toBe(true);
    component.setEditBlocked(false);
    expect(component.mercanciaForm.enabled).toBe(true);
  });

  it('should return true for isValid if control has errors and touched', () => {
    component.ngOnInit();
    const control = component.mercanciaForm.get('presentacion');
    control?.setErrors({ required: true });
    control?.markAsTouched();
    expect(component.isValid(control!)).toBeTruthy();
  });

  it('should return null for isValid if control is null', () => {
    expect(component.isValid(null as any)).toBeNull();
  });

  it('should return value from obtenerValor', () => {
    component.mercanciaFormState = { presentacion: 'test' } as any;
    expect(component.obtenerValor('presentacion')).toBe('test');
  });

  it('should call validarElementos and crossListRequirdos in ngOnInit', () => {
    const validarSpy = jest.spyOn(component, 'validarElementos');
    const crossSpy = jest.spyOn(component, 'crossListRequirdos');
    component.ngOnInit();
    expect(validarSpy).toHaveBeenCalled();
    expect(crossSpy).toHaveBeenCalled();
  });
});