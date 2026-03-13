// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Input, Output } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { HttpClientModule } from '@angular/common/http';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ScianDataService } from '../../services/scian-data.service';
import { CatalogoServices } from '@libs/shared/data-access-user/src';

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockDatosSolicitudService {
  obtenerRespuestaPorUrl = jest.fn();
  buscarRepresentantePorRfc = jest.fn().mockReturnValue(observableOf({
    codigo: '00',
    datos: {
      nombre: 'Test Nombre',
      apellidoPaterno: 'Test Apellido Paterno',
      apellidoMaterno: 'Test Apellido Materno'
    }
  }));
}

@Injectable()
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({
    readonly: false
  });
}

@Injectable()
class MockScianDataService {
  updateScianData = jest.fn();
}

@Injectable()
class MockCatalogoServices {
  estadosCatalogo = jest.fn().mockReturnValue(observableOf({
    datos: []
  }));
}

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
 beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DatosDeLaSolicitudComponent,
        CommonModule,
        TituloComponent,
        CatalogoSelectComponent,
        TablaDinamicaComponent,
        AlertComponent,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {},
            },
          },
        },
        {
          provide: Router,
          useClass: MockRouter,
        },
        {
          provide: DatosSolicitudService,
          useClass: MockDatosSolicitudService,
        },
        {
          provide: ConsultaioQuery,
          useClass: MockConsultaioQuery,
        },
        {
          provide: ScianDataService,
          useClass: MockScianDataService,
        },
        {
          provide: CatalogoServices,
          useClass: MockCatalogoServices,
        },
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ],
    }).compileComponents();
   fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    
    // Set up all required input properties
    component.idProcedimiento = 260103;
    component.datosSolicitudFormState = {
      rfcSanitario: '',
      denominacionRazon: '',
      correoElectronico: '',
      codigoPostal: '',
      estado: '',
      municipioAlcaldia: '',
      localidad: '',
      colonia: '',
      calleYNumero: '',
      calle: '',
      lada: '',
      telefono: '',
      aviso: '',
      licenciaSanitaria: '',
      regimen: '',
      adunasDeEntradas: '',
      aeropuerto: false,
      aeropuertoDos: false,
      publico: '',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      regimenLaMercancia: '',
      aduana: '',
      mercancias: [],
      manifesto: '',
      manifiestosCasillaDeVerificacion: false
    };
    
    component.scianConfig = {
      datos: [],
      titulo: 'Test SCIAN',
      columnas: []
    };
    
    component.tablaMercanciasConfig = {
      datos: [],
      titulo: 'Test Mercancías',
      columnas: []
    };
    
    component.opcionConfig = {
      datos: [],
      titulo: 'Test Opciones',
      columnas: []
    };
    
    component.mercanciaFormState = {
      clasificacionProducto: '',
      descripcionMercancia: '',
      paisOrigen: '',
      fabricante: '',
      tipoEnvase: '',
      materialEnvase: '',
      capacidad: '',
      unidadMedida: '',
      cantidad: 0,
      unidadComercial: '',
      pesoNeto: 0,
      pesoBruto: 0,
      valorComercial: 0,
      incoterm: '',
      fraccionArancelaria: '',
      nico: '',
      tigie: '',
      cuentaPedimento: '',
      marca: '',
      modelo: '',
      numeroSerie: '',
      uso: ''
    };
    
    component.opcionesColapsableState = false;
    component.elementosAnadidos = [];
    component.elementosRequeridos = [];
    component.tablaAcciones = [];
    
    fixture.detectChanges();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.crearDatosSolicitudForm = jest.fn();
    component.actualizarDatosFormularioSolicitud = jest.fn();
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.valueChanges = observableOf({});
    component.datosSolicitudForm.getRawValue = jest.fn();
    component.datasolicituActualizar = component.datasolicituActualizar || {};
    component.datasolicituActualizar.emit = jest.fn();
    component.ngOnInit();
    expect(component.crearDatosSolicitudForm).toHaveBeenCalled();
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

  it('should run #buscarRepresentanteRfc()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.datosSolicitudForm.patchValue = jest.fn();
    component.abrirRfcModal = jest.fn();
    component.buscarRepresentanteRfc();
  
  });

  it('should emit scianSeleccionado when eliminarScian is called', () => {
    jest.spyOn(component.scianSeleccionado, 'emit');
    component.scianConfig = { datos: [{ clave: '123' }] } as any;
    component.scianLista = [{ clave: '123' }] as any;
    component.eliminarScian();
  });

  it('should run #aceptar()', async () => {

    component.aceptar();

  });

  it('should run #eliminarMercancias()', async () => {
    component.tablaMercanciasLista = [
      {
        "clasificacionProducto": "test"
      }
    ] as any;
    component.tablaMercanciasConfig = {
      datos: [
        {
          "clasificacionProducto": "test"
        },
        {
          "clasificacionProducto": "other"
        }
      ]
    } as any;
    component.mercanciasSeleccionado = component.mercanciasSeleccionado || {};
    component.mercanciasSeleccionado.emit = jest.fn();
    component.eliminarMercancias();
    expect(component.mercanciasSeleccionado.emit).toHaveBeenCalled();
  });

  it('should show alert when eliminarMercancias is called with empty list', async () => {
    component.tablaMercanciasLista = [];
    component.eliminarMercancias();
    expect(component.mostrarAlerta).toBe(true);
  });

  it('should run #eliminarMercancias() without mercanciasSeleccionado', async () => {
    component.tablaMercanciasLista = [
      {
        "clasificacionProducto": "test"
      }
    ] as any;
    component.tablaMercanciasConfig = {
      datos: [
        {
          "clasificacionProducto": "test"
        }
      ]
    } as any;
    component.mercanciasSeleccionado = null as any;
    component.eliminarMercancias();
    expect(component.tablaMercanciasConfig.datos).toHaveLength(0);
  });

  it('should run #irAAcciones()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.irAAcciones({});
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #agregarScian()', async () => {
    component.scianConfig = component.scianConfig || {};
    component.scianConfig.datos = {
      concat: function() {}
    };
    component.scianSeleccionado = component.scianSeleccionado || {};
    component.scianSeleccionado.emit = jest.fn();
    component.irAAcciones = jest.fn();
    component.agregarScian();
    expect(component.scianSeleccionado.emit).toHaveBeenCalled();
    expect(component.irAAcciones).toHaveBeenCalled();
  });

  it('should run #agregarMercancias()', async () => {
    component.tablaMercanciasConfig = component.tablaMercanciasConfig || {};
    component.tablaMercanciasConfig.datos = {
      concat: function() {}
    };
    component.mercanciasSeleccionado = component.mercanciasSeleccionado || {};
    component.mercanciasSeleccionado.emit = jest.fn();
    component.irAAcciones = jest.fn();
    component.agregarMercancias();
    expect(component.mercanciasSeleccionado.emit).toHaveBeenCalled();
    expect(component.irAAcciones).toHaveBeenCalled();
  });

  it('should run #modificarDatos()', async () => {
    component.tablaMercanciasLista = component.tablaMercanciasLista || {};
    component.datosDeTablaSeleccionados = component.datosDeTablaSeleccionados || {};
    component.datosDeTablaSeleccionados.emit = jest.fn();
    component.irAAcciones = jest.fn();
    component.modificarDatos();
  });

  it('should run #mostrarColapsable()', async () => {
    component.datosDeTablaSeleccionados = component.datosDeTablaSeleccionados || {};
    component.datosDeTablaSeleccionados.emit = jest.fn();
    component.mostrarColapsable({});
  });

  it('should run #cambioDeEstado()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      setValue: function() {}
    });
    component.cambioDeEstado({});
  });

  it('should run #esCampoRequerido()', async () => {
    component.elementosRequeridos = component.elementosRequeridos || {};
    component.elementosRequeridos.includes = jest.fn();
    component.esCampoRequerido({});
  });

  it('should run #mostrarCamposDelProcedimiento()', async () => {
    component.elementosAnadidos = component.elementosAnadidos || {};
    component.elementosAnadidos.includes = jest.fn();
    component.mostrarCamposDelProcedimiento({});
  });

  it('should run #cambioAviso()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      updateValueAndValidity: function() {},
      setValidators: function() {},
      enable: function() {},
      disable: function() {},
      clearValidators: function() {}
    });
    component.cambioAviso({
      target: {
        checked: {}
      }
    });
  });

  it('should run #cambioLicenciaSanitaria()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      enable: function() {},
      disable: function() {}
    });
    component.cambioLicenciaSanitaria({
      target: {
        value: {}
      }
    });
  });

  it('should run #cambireCorreoElectronico()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      setValue: function() {},
      value: {}
    });
    component.cambireCorreoElectronico();
  });

  it('should run #abrirModal()', async () => {
    component.alternarControlesDeFormulario = jest.fn();
    component.abrirModal();
  });

  it('should run #eliminarModal()', async () => {
    component.scianLista = component.scianLista || {};
    component.eliminarModal();

  });

  it('should run #getEliminarScianModal()', async () => {
    component.eliminarScian = jest.fn();
    component.nuevaNotificacion = component.nuevaNotificacion || {};
    component.nuevaNotificacion.cerrar = 'cerrar';
    component.getEliminarScianModal({});
  });

  it('should run #controlYaDeshabilitado()', async () => {

    component.controlYaDeshabilitado({});

  });

  it('should run #alternarControlesDeFormulario()', async () => {
    component.datosSolicitudForm = component.datosSolicitudForm || {};
    component.datosSolicitudForm.controls = 'controls';
    component.datosSolicitudForm.get = jest.fn().mockReturnValue({
      disable: function() {},
      enable: function() {}
    });
    component.controlYaDeshabilitado = jest.fn();
    component.alternarControlesDeFormulario({});
  });

  it('should run #abrirRfcModal()', async () => {

    component.abrirRfcModal();

  });

  it('should run #eliminarPedimento()', async () => {
    component.pedimentos = component.pedimentos || {};
    component.pedimentos.splice = jest.fn();
    component.eliminarPedimento({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

  it('should handle constructor service calls', async () => {
    const mockDatosSolicitudService = {
      obtenerRespuestaPorUrl: jest.fn()
    };
    
    const testComponent = new DatosDeLaSolicitudComponent(
      component.fb,
      component.router,
      component.activatedRoute,
      mockDatosSolicitudService as any
    );
    
    expect(mockDatosSolicitudService.obtenerRespuestaPorUrl).toHaveBeenCalledTimes(5);
  });

  it('should run #crearDatosSolicitudForm() with formularioDeshabilitado true', async () => {
    component.formularioDeshabilitado = true;
    component.elementosRequeridos = ['rfcSanitario', 'denominacionRazon'];
    component.idProcedimiento = 260103;
    component.ngOnInit();
    expect(component.datosSolicitudForm.disabled).toBe(true);
  });

  it('should handle cambioDeEstado with specific procedure', async () => {
    component.idProcedimiento = 260301;
    component.datosSolicitudForm = component.fb.group({
      municipioAlcaldia: ['']
    });
    
    const event = { clave: '101', descripcion: 'Test' };
    component.cambioDeEstado(event);
    
    expect(component.datosSolicitudForm.get('municipioAlcaldia')?.value).toBe('DISTITO FEDERAL');
  });

  it('should handle cambioDeEstado with null event', async () => {
    component.idProcedimiento = 260301;
    component.datosSolicitudForm = component.fb.group({
      municipioAlcaldia: ['']
    });
    
    component.cambioDeEstado(null as any);
    expect(component.datosSolicitudForm.get('municipioAlcaldia')?.value).toBe('');
  });

  it('should handle cambireCorreoElectronico with correct procedure and values', async () => {
    component.idProcedimiento = 260103;
    component.datosSolicitudForm = component.fb.group({
      correoElectronico: ['test@email.com'],
      denominacionRazon: ['Test Company'],
      codigoPostal: [''],
      estado: [''],
      municipioAlcaldia: [''],
      localidad: [''],
      colonia: ['']
    });
    
    component.cambireCorreoElectronico();
    
    expect(component.datosSolicitudForm.get('codigoPostal')?.value).toBe(95270);
    expect(component.datosSolicitudForm.get('estado')?.value).toBe('101');
    expect(component.datosSolicitudForm.get('municipioAlcaldia')?.value).toBe('ALVARADO');
  });

  it('should handle cambireCorreoElectronico with empty values', async () => {
    component.idProcedimiento = 260103;
    component.datosSolicitudForm = component.fb.group({
      correoElectronico: [''],
      denominacionRazon: [''],
      codigoPostal: ['12345'],
      estado: [''],
      municipioAlcaldia: [''],
      localidad: [''],
      colonia: ['']
    });
    
    component.cambireCorreoElectronico();
    
    expect(component.datosSolicitudForm.get('codigoPostal')?.value).toBe('12345');
  });

  it('should handle modificarDatos with empty tablaMercanciasLista', async () => {
    component.tablaMercanciasLista = [];
    component.modificarDatos();
    expect(component.mostrarAlerta).toBe(true);
  });

  it('should handle modificarDatos with data', async () => {
    component.tablaMercanciasLista = [{ clasificacionProducto: 'test' }] as any;
    component.scianLista = [{ clave: 'test' }] as any;
    component.opcionLista = [{ opcion: 'test' }] as any;
    component.opcionesColapsable = true;
    component.datosDeTablaSeleccionados = { emit: jest.fn() } as any;
    component.irAAcciones = jest.fn();
    
    component.modificarDatos();
    
    expect(component.datosDeTablaSeleccionados.emit).toHaveBeenCalledWith({
      scianSeleccionados: component.scianLista,
      mercanciasSeleccionados: component.tablaMercanciasLista,
      opcionSeleccionados: component.opcionLista,
      opcionesColapsableState: component.opcionesColapsable,
    });
  });

  it('should handle mostrarColapsable with orden !== 1', async () => {
    component.datosDeTablaSeleccionados = { emit: jest.fn() } as any;
    component.mostrarColapsable(2);
    expect(component.datosDeTablaSeleccionados.emit).not.toHaveBeenCalled();
  });

  it('should handle mostrarColapsable with orden === 1', async () => {
    component.opcionesColapsable = false;
    component.scianLista = [];
    component.tablaMercanciasLista = [];
    component.opcionLista = [];
    component.datosDeTablaSeleccionados = { emit: jest.fn() } as any;
    
    component.mostrarColapsable(1);
    
    expect(component.opcionesColapsable).toBe(true);
    expect(component.datosDeTablaSeleccionados.emit).toHaveBeenCalled();
  });

  it('should handle esCampoRequerido with undefined elementosRequeridos', async () => {
    component.elementosRequeridos = undefined as any;
    const result = component.esCampoRequerido('test');
    expect(result).toBe(false);
  });

  it('should handle mostrarCamposDelProcedimiento with undefined elementosAnadidos', async () => {
    component.elementosAnadidos = undefined as any;
    const result = component.mostrarCamposDelProcedimiento('test');
    expect(result).toBe(false);
  });

  it('should handle cambioAviso with checked false', async () => {
    component.datosSolicitudForm = component.fb.group({
      licenciaSanitaria: [{ value: '', disabled: true }]
    });
    
    const mockEvent = {
      target: { checked: false }
    } as any;
    
    component.cambioAviso(mockEvent);
    
    const control = component.datosSolicitudForm.get('licenciaSanitaria');
    expect(control?.enabled).toBe(true);
  });

  it('should handle cambioLicenciaSanitaria with value', async () => {
    component.datosSolicitudForm = component.fb.group({
      aviso: ['']
    });
    
    const mockEvent = {
      target: { value: 'test' }
    } as any;
    
    component.cambioLicenciaSanitaria(mockEvent);
    
    expect(component.datosSolicitudForm.get('aviso')?.disabled).toBe(true);
  });

  it('should handle cambioLicenciaSanitaria without value', async () => {
    component.datosSolicitudForm = component.fb.group({
      aviso: [{ value: '', disabled: true }]
    });
    
    const mockEvent = {
      target: { value: '' }
    } as any;
    
    component.cambioLicenciaSanitaria(mockEvent);
    
    expect(component.datosSolicitudForm.get('aviso')?.enabled).toBe(true);
  });

  it('should handle abrirModal with parameter', async () => {
    component.alternarControlesDeFormulario = jest.fn();
    component.abrirModal(5);
    expect(component.elementoParaEliminar).toBe(5);
    expect(component.alternarControlesDeFormulario).toHaveBeenCalledWith(true);
  });

  it('should handle eliminarModal with empty scianLista', async () => {
    component.scianLista = [];
    component.eliminarModal();
    expect(component.mostrarAlerta).toBe(true);
  });

  it('should handle eliminarModal with data', async () => {
    component.scianLista = [{ clave: 'test' }] as any;
    component.eliminarModal();
    expect(component.nuevaNotificacionEliminar).toBeDefined();
    expect(component.nuevaNotificacionEliminar.mensaje).toContain('eliminar los registros');
  });

  it('should handle getEliminarScianModal with borrar true', async () => {
    component.eliminarScian = jest.fn();
    component.nuevaNotificacion = { cerrar: true } as any;
    
    component.getEliminarScianModal(true);
    
    expect(component.eliminarScian).toHaveBeenCalled();
    expect(component.nuevaNotificacion.cerrar).toBe(false);
  });

  it('should handle getEliminarScianModal with borrar false', async () => {
    component.eliminarScian = jest.fn();
    component.nuevaNotificacion = { cerrar: true } as any;
    
    component.getEliminarScianModal(false);
    
    expect(component.eliminarScian).not.toHaveBeenCalled();
    expect(component.nuevaNotificacion.cerrar).toBe(true);
  });

  it('should handle controlYaDeshabilitado with specific fields and procedures', async () => {
    component.idProcedimiento = 260301; // Assuming this is in the disable arrays
    
    expect(component.controlYaDeshabilitado('apellidoPaterno')).toBe(false);
    expect(component.controlYaDeshabilitado('apellidoMaterno')).toBe(false);
    expect(component.controlYaDeshabilitado('representanteNombre')).toBe(false);
    expect(component.controlYaDeshabilitado('otherField')).toBe(true);
  });

  it('should handle alternarControlesDeFormulario with enable true', async () => {
    component.datosSolicitudForm = component.fb.group({
      rfcSanitario: [''],
      denominacionRazon: ['']
    });
    component.controlYaDeshabilitado = jest.fn().mockReturnValue(true);
    
    component.alternarControlesDeFormulario(true);
    
    expect(component.controlYaDeshabilitado).toHaveBeenCalled();
  });

  it('should handle alternarControlesDeFormulario with enable false', async () => {
    component.datosSolicitudForm = component.fb.group({
      rfcSanitario: [''],
      denominacionRazon: ['']
    });
    
    component.alternarControlesDeFormulario(false);
    
    expect(component.datosSolicitudForm.get('rfcSanitario')?.disabled).toBe(true);
    expect(component.datosSolicitudForm.get('denominacionRazon')?.disabled).toBe(true);
  });

  it('should handle eliminarPedimento with borrar true', async () => {
    component.pedimentos = [{ id: 1 }, { id: 2 }, { id: 3 }] as any;
    component.elementoParaEliminar = 1;
    
    component.eliminarPedimento(true);
    
    expect(component.pedimentos).toHaveLength(2);
    expect(component.pedimentos[1]).toEqual({ id: 3 });
  });

  it('should handle eliminarPedimento with borrar false', async () => {
    component.pedimentos = [{ id: 1 }, { id: 2 }, { id: 3 }] as any;
    component.elementoParaEliminar = 1;
    
    component.eliminarPedimento(false);
    
    expect(component.pedimentos).toHaveLength(3);
  });

  it('should handle buscarRepresentanteRfc without RFC', async () => {
    component.datosSolicitudForm = component.fb.group({
      representanteRfc: ['']
    });
    component.abrirRfcModal = jest.fn();
    
    component.buscarRepresentanteRfc();
    
    expect(component.abrirRfcModal).toHaveBeenCalled();
  });

  it('should handle abrirRfcModal', async () => {
    component.abrirRfcModal();
    
    expect(component.mostrarRfcAlerta).toBe(true);
    expect(component.nuevaNotificacion.mensaje).toBe('Debe ingresar el RFC.');
  });

  it('should handle crearDatosSolicitudForm with empty datosSolicitudFormState', async () => {
    component.datosSolicitudFormState = {
      rfcSanitario: '',
      denominacionRazon: '',
      correoElectronico: '',
      codigoPostal: '',
      estado: '',
      municipioAlcaldia: '',
      localidad: '',
      colonia: '',
      calle: '',
      lada: '',
      telefono: '',
      aviso: '',
      licenciaSanitaria: '',
      regimen: '',
      adunasDeEntradas: '',
      aeropuerto: false,
      publico: '',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
    };
    component.idProcedimiento = 999;
    component.mostrarNotificacion = true;
    component.alternarControlesDeFormulario = jest.fn();
    
    component.crearDatosSolicitudForm();
    
    expect(component.alternarControlesDeFormulario).toHaveBeenCalledWith(false);
  });

  it('should handle actualizarDatosFormularioSolicitud with undefined elementosRequeridos', async () => {
    component.elementosRequeridos = undefined as any;
    component.datosSolicitudForm = component.fb.group({
      rfcSanitario: ['']
    });
    
    component.actualizarDatosFormularioSolicitud();
    // Should not throw error
    expect(component.datosSolicitudForm).toBeDefined();
  });

  it('should handle eliminarScian without scianSeleccionado', async () => {
    component.scianConfig = {
      datos: [{ clave: 'test1' }, { clave: 'test2' }]
    } as any;
    component.scianLista = [{ clave: 'test1' }] as any;
    component.scianSeleccionado = null as any;
    
    component.eliminarScian();
    
    expect(component.scianConfig.datos).toHaveLength(1);
    expect(component.scianConfig.datos[0].clave).toBe('test2');
  });

  it('should handle agregarScian without scianSeleccionado', async () => {
    component.scianConfig = { datos: [] } as any;
    component.scianLista = [{ clave: 'test' }] as any;
    component.scianSeleccionado = null as any;
    component.irAAcciones = jest.fn();
    
    component.agregarScian();
    
    expect(component.scianConfig.datos).toHaveLength(1);
    expect(component.irAAcciones).toHaveBeenCalledWith('../scian-selecion');
  });

  it('should handle agregarMercancias without mercanciasSeleccionado', async () => {
    component.tablaMercanciasConfig = { datos: [] } as any;
    component.tablaMercanciasLista = [{ clasificacionProducto: 'test' }] as any;
    component.mercanciasSeleccionado = null as any;
    component.irAAcciones = jest.fn();
    
    component.agregarMercancias();
    
    expect(component.tablaMercanciasConfig.datos).toHaveLength(1);
    expect(component.irAAcciones).toHaveBeenCalledWith('../mercancia-datos');
  });

});