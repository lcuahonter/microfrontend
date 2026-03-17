import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';
import { DatosMercanciaEstupefacientesComponent } from './datos-mercancia-estupefacientes.component';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';

class MockDatosSolicitudService {
  obtenerRespuestaPorUrl(ctx: any, propName: string, _url: string) {
    (ctx as any)[propName] = [
      { id: '1', nombre: 'A' },
      { id: '2', nombre: 'B' },
    ];
  }
}

describe('DatosMercanciaEstupefacientesComponent (Jest, español)', () => {
  let fixture: ComponentFixture<DatosMercanciaEstupefacientesComponent>;
  let component: DatosMercanciaEstupefacientesComponent;

  const locationMock = { back: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, DatosMercanciaEstupefacientesComponent],
      providers: [{ provide: Location, useValue: locationMock }],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DatosMercanciaEstupefacientesComponent, {
        set: {
          providers: [{ provide: DatosSolicitudService, useClass: MockDatosSolicitudService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaEstupefacientesComponent);
    component = fixture.componentInstance;

    component.mercanciaFormState = {
      clasificacionProducto: '',
      especificarClasificacionProducto: '',
      marcaComercialDenominacion: '',
      denominacionCumonInternacional: '',
      tipoProducto: '',
      formaFarmaceutica: '',
      estadoFisico: '',
      fraccionArancelaria: '',
      descripcionFraccion: '',
      cantidadUmtValor: '',
      cantidadUmt: '',
      cantidadUmcValor: '',
      cantidadUmc: '',
      numeroCAS: '',
      cantidadDeLotes: '',
      kgPorLote: '',
      paisDeDestino: '',
      paisDeProcedencia: '',
      detallarUsoEspecifico: '',
      numeroDePiezasAFabricar: '',
      descripcionNumeroDePiezas: '',
      presentacion: '',
      numeroRegistroSanitario: '',
      usoEspecifico: '',
      paisOrigen: '',
    };
  });

  const initForm = () => component.crearMercanciaForm();

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe invocar crearMercanciaForm', () => {
    const spy = jest.spyOn(component, 'crearMercanciaForm');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.mercanciaForm).toBeDefined();
  });

  it('debe inicializar el formulario con valores por defecto', () => {
    initForm();
    expect(component.mercanciaForm.value).toEqual({
      clasificacionProducto: '',
      especificarClasificacionProducto: '',
      denominacionCumonInternacional: '',
      marcaComercialDenominación: '',
      tipoProducto: '',
      formaFarmaceutica: '',
      estadoFisico: '',
      fraccionArancelaria: '',
      descripcionFraccion: '',
      cantidadUmtValor: '',
      cantidadUmt: '',
      cantidadUmcValor: '',
      cantidadUmc: '',
      numeroCAS: '',
      cantidadDeLotes: '',
      kgPorLote: '',
      paisDeDestino: '101',
      paisDeProcedencia: '',
      detallarUsoEspecifico: '',
      nummeroDePiezasAFabricar: '',
      descripcionNumeroDePiezas: '',
      numeroRegistroSanitario: '',
      presentacion: '',
      usoEspecifico: '',
      paisOrigen: '',
    });
  });

  it('isValid debe reportar errores correctamente (FormGroup + control y FormControl)', () => {
    initForm();

    const fg = component.mercanciaForm as FormGroup;

    const ctrlGrupo = fg.get('clasificacionProducto')!;
    ctrlGrupo.markAsTouched();
    ctrlGrupo.setErrors({ required: true });
    expect(component.isValid(fg, 'clasificacionProducto')).toBeTruthy();

    ctrlGrupo.setErrors(null);
    expect(component.isValid(fg, 'clasificacionProducto')).toBeFalsy();

    const ctrlSolo = fg.get('cantidadUmtValor')!;
    ctrlSolo.markAsTouched();
    ctrlSolo.setErrors({ required: true });
    expect(component.isValid(ctrlSolo)).toBeTruthy();
  });

  it('paisDeOriginSeleccionadasChange debe actualizar lista y control del formulario', () => {
    initForm();
    component.paisDeOriginSeleccionadasChange(['MX', 'US']);
    expect(component.seleccionadasPaisDeOriginDatos).toEqual(['MX', 'US']);
    expect(component.mercanciaForm.get('paisOrigen')?.value).toBe('MX');

    component.paisDeOriginSeleccionadasChange([]);
    expect(component.seleccionadasPaisDeOriginDatos).toEqual(['MX', 'US']);
  });

  it('formaFarmaceuticaSeleccionadasChange debe actualizar lista y control', () => {
    initForm();
    component.formaFarmaceuticaSeleccionadasChange(['Tableta', 'Jarabe']);
    expect(component.seleccionadasFormaFormaceuticaDatos).toEqual(['Tableta', 'Jarabe']);
    expect(component.mercanciaForm.get('formaFarmaceutica')?.value).toBe('Tableta');

    component.formaFarmaceuticaSeleccionadasChange([]);
    expect(component.seleccionadasFormaFormaceuticaDatos).toEqual(['Tableta', 'Jarabe']);
  });

  it('usoEspesificoSeleccionadasChange debe actualizar lista y control', () => {
    initForm();
    component.usoEspesificoSeleccionadasChange(['Humano', 'Veterinario']);
    expect(component.seleccionadasUsoEspesificoDatos).toEqual(['Humano', 'Veterinario']);
    expect(component.mercanciaForm.get('usoEspecifico')?.value).toBe('Humano');

    component.usoEspesificoSeleccionadasChange([]);
    expect(component.seleccionadasUsoEspesificoDatos).toEqual(['Humano', 'Veterinario']);
  });

  it('mostrarColapsable debe alternar los flags correctos', () => {
    expect(component.formFormaceuticaColapsable).toBe(false);
    expect(component.paisDeOriginColapsable).toBe(false);
    expect(component.usoEspesificoColapsable).toBe(false);

    component.mostrarColapsable(1);
    expect(component.formFormaceuticaColapsable).toBe(true);

    component.mostrarColapsable(2);
    expect(component.paisDeOriginColapsable).toBe(true);

    component.mostrarColapsable(3);
    expect(component.usoEspesificoColapsable).toBe(true);

    component.mostrarColapsable(1);
    expect(component.formFormaceuticaColapsable).toBe(false);
  });

  it('agregarMercancia debe emitir y volver atrás', () => {
    initForm();
    const spy = jest.spyOn(component.mercanciaSeleccionado, 'emit');
    component.agregarMercancia();
    expect(spy).toHaveBeenCalledWith(component.mercanciaForm.value);
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('limpiarMercancia debe resetear el formulario', () => {
    initForm();
    component.mercanciaForm.patchValue({
      clasificacionProducto: 'X',
      presentacion: 'P',
    });
    component.limpiarMercancia();
    expect(component.mercanciaForm.get('clasificacionProducto')?.value).toBeNull();
    expect(component.mercanciaForm.get('presentacion')?.value).toBeNull();
  });

  it('cancelar debe volver atrás', () => {
    component.cancelar();
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('agregarMercanciaSellecion debe emitir agregarMercanciaDatos', () => {
    const spy = jest.spyOn(component.agregarMercanciaDatos, 'emit');
    const payload = { presentacion: 'X' } as any;
    component.agregarMercanciaSellecion(payload);
    expect(spy).toHaveBeenCalledWith(payload);
  });

  it('eliminarMercancia debe emitir eliminarMercanciaDatos', () => {
    const spy = jest.spyOn(component.eliminarMercanciaDatos, 'emit');
    const payload = [{ a: 1 }] as any;
    component.eliminarMercancia(payload);
    expect(spy).toHaveBeenCalledWith(payload);
  });

  it('agregarDetalleMercancia NO debe agregar cuando todos los campos están vacíos', () => {
    initForm();
    component.mercanciaForm.patchValue({
      presentacion: '',
      nummeroDePiezasAFabricar: '',
      descripcionNumeroDePiezas: '',
      numeroRegistroSanitario: '',
    });
    component.agregarDetalleMercancia();
    expect(component.detalleMercanciaDatos.length).toBe(0);
  });

  it('agregarDetalleMercancia debe agregar cuando al menos un campo tiene valor', () => {
    initForm();
    component.mercanciaForm.patchValue({
      presentacion: 'Caja 10u',
      nummeroDePiezasAFabricar: '',
      descripcionNumeroDePiezas: '',
      numeroRegistroSanitario: '',
    });
    component.agregarDetalleMercancia();
    expect(component.detalleMercanciaDatos.length).toBe(1);
    expect(component.detalleMercanciaDatos[0]).toEqual({
      presentacion: 'Caja 10u',
      numeroDePiezasAFabricar: '',
      descripcionNumeroDePiezas: '',
      numeroRegistroSanitario: '',
    });
  });

  it('eliminarDetalleMercancia debe limpiar cuando hay una sola coincidencia (rama VALOR=true)', () => {
    component.detalleMercanciaDatos = [
      { numeroRegistroSanitario: 'ABC', presentacion: 'X', numeroDePiezasAFabricar: '', descripcionNumeroDePiezas: '' },
    ] as any;
    component.tablaMercanciasLista = [{ numeroRegistroSanitario: 'ABC' }] as any;
    component.eliminarDetalleMercancia();
    expect(component.detalleMercanciaDatos).toEqual([]);
  });

  it('eliminarDetalleMercancia debe filtrar cuando no es el caso único (rama VALOR=false)', () => {
    component.detalleMercanciaDatos = [
      { numeroRegistroSanitario: 'ABC' } as any,
      { numeroRegistroSanitario: 'DEF' } as any,
      { numeroRegistroSanitario: 'GHI' } as any,
    ];
    component.tablaMercanciasLista = [
      { numeroRegistroSanitario: 'DEF' } as any,
      { numeroRegistroSanitario: 'GHI' } as any,
    ];
    component.eliminarDetalleMercancia();
    expect(component.detalleMercanciaDatos.map(d => d.numeroRegistroSanitario)).toEqual(['DEF', 'GHI']);
  });

  it('helpers de clave: agregarClave solo agrega con todos los campos; eliminarClave elimina; modificarClave actualiza; claveListaFn parchea form', () => {
    initForm();

    component.agregarClave();
    expect(component.claveConfig.datos.length).toBe(0);

    component.mercanciaForm.patchValue({
      claveDeLos: 'CLV-1',
      fechaDeFabricacio: '2025-01-01',
      fechaDeCaducidad: '2026-01-01',
    });
    component.agregarClave();
    expect(component.claveConfig.datos.length).toBe(1);
    expect(component.claveConfig.datos[0]).toEqual({
      clave: 'CLV-1',
      fabricacion: '2025-01-01',
      caducidad: '2026-01-01',
    });
    expect(component.mercanciaForm.get('claveDeLos')?.value).toBe('');
    expect(component.mercanciaForm.get('fechaDeFabricacio')?.value).toBe('');
    expect(component.mercanciaForm.get('fechaDeCaducidad')?.value).toBe('');

    component.mercanciaForm.patchValue({
      claveDeLos: 'CLV-2',
      fechaDeFabricacio: '2025-02-02',
      fechaDeCaducidad: '2026-02-02',
    });
    component.agregarClave();
    expect(component.claveConfig.datos.length).toBe(2);

    component.claveListaFn([{ clave: 'CLV-2', fabricacion: '', caducidad: '' } as any]);
    expect(component.mercanciaForm.get('claveDeLos')?.value).toBe('CLV-2');
    expect(component.mercanciaForm.get('fechaDeFabricacio')?.value).toBe('2025-02-02');
    expect(component.mercanciaForm.get('fechaDeCaducidad')?.value).toBe('2026-02-02');

    component.mercanciaForm.patchValue({
      claveDeLos: 'CLV-NEW',
      fechaDeFabricacio: '2030-03-03',
      fechaDeCaducidad: '2031-03-03',
    });
    component.claveLista = [{ clave: 'CLV-1' } as any];
    component.modificarClave();
    expect(component.claveConfig.datos.find(d => d.clave === 'CLV-NEW')).toBeTruthy();

    component.claveLista = [{ clave: 'CLV-2' } as any, { clave: 'CLV-NEW' } as any];
    component.eliminarClave();
    expect(component.claveConfig.datos.length).toBe(0);
  });

  it('botones de CrossList deben invocar agregar/quitar con parámetros correctos', () => {
    const fake0 = { agregar: jest.fn(), quitar: jest.fn() };
    const fake1 = { agregar: jest.fn(), quitar: jest.fn() };
    const fake2 = { agregar: jest.fn(), quitar: jest.fn() };
    (component as any).crossList = { toArray: () => [fake0, fake1, fake2] };

    component.paisDeProcedenciaBotons[0].funcion(); 
    expect(fake0.agregar).toHaveBeenCalledWith('t');

    component.paisDeProcedenciaBotons[1].funcion(); 
    expect(fake0.agregar).toHaveBeenCalledWith('');

    component.paisDeProcedenciaBotons[2].funcion(); 
    expect(fake0.quitar).toHaveBeenCalledWith('');

    component.paisDeProcedenciaBotons[3].funcion();
    expect(fake0.quitar).toHaveBeenCalledWith('t');

    component.paisDeProcedenciaBotonsDos[0].funcion();
    expect(fake1.agregar).toHaveBeenCalledWith('t');
    component.paisDeProcedenciaBotonsDos[1].funcion();
    expect(fake1.agregar).toHaveBeenCalledWith('');
    component.paisDeProcedenciaBotonsDos[2].funcion();
    expect(fake1.quitar).toHaveBeenCalledWith('');
    component.paisDeProcedenciaBotonsDos[3].funcion();
    expect(fake1.quitar).toHaveBeenCalledWith('t');

    component.paisDeProcedenciaBotonsTres[0].funcion();
    expect(fake2.agregar).toHaveBeenCalledWith('t');
    component.paisDeProcedenciaBotonsTres[1].funcion();
    expect(fake2.agregar).toHaveBeenCalledWith('');
    component.paisDeProcedenciaBotonsTres[2].funcion();
    expect(fake2.quitar).toHaveBeenCalledWith('');
    component.paisDeProcedenciaBotonsTres[3].funcion();
    expect(fake2.quitar).toHaveBeenCalledWith('t');
  });
});
