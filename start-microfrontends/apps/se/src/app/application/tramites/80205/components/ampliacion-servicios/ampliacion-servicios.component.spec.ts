import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { AmpliacionServiciosComponent } from './ampliacion-servicios.component';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { AmpliacionServiciosQuery } from '../../estados/tramite80205.query';
import { AmpliacionServiciosStore } from '../../estados/tramite80205.store';
import { CatalogoServices, ConsultaioQuery } from '@ng-mf/data-access-user';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';

@Injectable()
class MockAmpliacionServiciosService {
  getDatos = jest.fn().mockReturnValue(observableOf({ infoServicios: {} }));
}

@Injectable()
class MockAmpliacionServiciosQuery {
  selectAduanaDeIngresoSelecion$ = observableOf({ id: 1, descripcion: 'Test' });
  selectInfoRegistro$ = observableOf({ seleccionaLaModalidad: '', folio: '', ano: '' });
  selectDatosImmex$ = observableOf([]);
  select = jest.fn().mockReturnValue(observableOf({ rfcEmpresa: '', numeroPrograma: '', tiempoPrograma: '' }));
}

@Injectable()
class MockAmpliacionServiciosStore {
  setFormValida = jest.fn();
  setInfoRegistro = jest.fn();
  setDatosImmex = jest.fn();
  setEmpresas = jest.fn();
  setAduanaDeIngresoSeleccion = jest.fn();
  setRfcEmpresa = jest.fn();
  setNumeroPrograma = jest.fn();
  setTiempoPrograma = jest.fn();
  datosAutorizados = jest.fn();
}

@Injectable()
class MockCatalogoServices {
  immexCatalogo = jest.fn().mockReturnValue(observableOf({ datos: [] }));
}

@Injectable()
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({ readonly: false });
}

@Injectable()
class MockServiciosService {
  postServiciosAutorizadosTabla = jest.fn().mockReturnValue(observableOf({ codigo: '00', datos: { servicioDtos: [] } }));
  postServiciosImmexTabla = jest.fn().mockReturnValue(observableOf({ codigo: '00', datos: [] }));
  postServiciosEmpresasNacionales = jest.fn().mockReturnValue(observableOf({ codigo: '00', datos: { empresasNacionales: [] } }));
}

@Injectable()
class MockNotificacionesService {
  showNotification = jest.fn();
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom: any;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value: any): any { return value; }
}

describe('AmpliacionServiciosComponent', () => {
  let component: AmpliacionServiciosComponent;
  let fixture: ComponentFixture<AmpliacionServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, AmpliacionServiciosComponent],
      declarations: [TranslatePipe, PhoneNumberPipe, SafeHtmlPipe, MyCustomDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: AmpliacionServiciosService, useClass: MockAmpliacionServiciosService },
        { provide: AmpliacionServiciosQuery, useClass: MockAmpliacionServiciosQuery },
        { provide: AmpliacionServiciosStore, useClass: MockAmpliacionServiciosStore },
        { provide: CatalogoServices, useClass: MockCatalogoServices },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery },
        { provide: ServiciosService, useClass: MockServiciosService },
        { provide: NotificacionesService, useClass: MockNotificacionesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AmpliacionServiciosComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
    expect(component.formulario).toBeDefined();
    expect(component.mercanciasSeleccionados).toEqual([]);
    expect(component.tablaDosSeleccionados).toEqual([]);
  });

  it('debería inicializar el estado del formulario', () => {
    jest.spyOn(component, 'guardarDatosFormulario');
    jest.spyOn(component, 'inicializarFormularioInfoRegistro');
    
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
    
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.inicializarFormularioInfoRegistro).toHaveBeenCalled();
  });

  it('debería inicializar el componente en ngOnInit', () => {
    jest.spyOn(component, 'obtenerIngresoSelectList');
    jest.spyOn(component, 'getDatos');
    jest.spyOn(component, 'inicializarEstadoFormulario');
    jest.spyOn(component, 'suscribirseADatosImmex');
    jest.spyOn(component, 'suscribirseADatos');
    jest.spyOn(component, 'suscribirseAFields');
    jest.spyOn(component, 'getTablaDatos');
    
    component.ngOnInit();
    
    expect(component.obtenerIngresoSelectList).toHaveBeenCalledWith('80205');
    expect(component.getDatos).toHaveBeenCalled();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.suscribirseADatosImmex).toHaveBeenCalled();
    expect(component.suscribirseADatos).toHaveBeenCalled();
    expect(component.suscribirseAFields).toHaveBeenCalled();
    expect(component.getTablaDatos).toHaveBeenCalled();
  });

  it('debería manejar cambios de campos', () => {
    const mockStore = TestBed.inject(AmpliacionServiciosStore);
    
    component.enCambioDeCampo('rfcEmpresa', 'TEST123');
    expect(mockStore.setRfcEmpresa).toHaveBeenCalledWith('TEST123');
    
    component.enCambioDeCampo('numeroPrograma', '12345');
    expect(mockStore.setNumeroPrograma).toHaveBeenCalledWith('12345');
    
    component.enCambioDeCampo('tiempoPrograma', '2024');
    expect(mockStore.setTiempoPrograma).toHaveBeenCalledWith('2024');
  });

  it('debería manejar ngOnDestroy', () => {
    const mockSubscription = {
      unsubscribe: jest.fn()
    };
    (component as any).subscription = mockSubscription;
    
    component.ngOnDestroy();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('debería cerrar el modal', () => {
    component.esHabilitarElDialogo = true;
    component.cerrarModal();
    expect(component.esHabilitarElDialogo).toBe(false);
  });

  it('debería cerrar el modal de eliminar y ejecutar eliminación cuando se confirma', () => {
    jest.spyOn(component, 'eliminarServiciosGrid');
    
    component.cerrarModalEliminar(true);
    expect(component.eliminarServiciosGrid).toHaveBeenCalled();
    expect(component.esEliminar).toBe(false);
    
    component.cerrarModalEliminar(false);
    expect(component.esEliminar).toBe(false);
  });

  it('debería cerrar el modal de agregar', () => {
    component.esAgregarDos = true;
    component.cerrarModalAgregar();
    expect(component.esAgregarDos).toBe(false);
  });

  it('debería cerrar el modal de eliminar dos y ejecutar eliminación cuando se confirma', () => {
    jest.spyOn(component, 'eliminarEmpresasNacionales');
    
    component.cerrarEliminarDos(true);
    expect(component.eliminarEmpresasNacionales).toHaveBeenCalled();
    expect(component.esEliminarDos).toBe(false);
    
    component.cerrarEliminarDos(false);
    expect(component.esEliminarDos).toBe(false);
  });

  it('debería cerrar notificación de no seleccionado', () => {
    component.rowNotSeleccionada = true;
    component.cerrarNotSeleccainda();
    expect(component.rowNotSeleccionada).toBe(false);
  });

  it('debería manejar suscripción de campos', () => {
    expect(component.rfcEmpresa).toBeDefined();
    expect(component.numeroPrograma).toBeDefined();
    expect(component.tiempoPrograma).toBeDefined();
  });

  it('debería inicializar formulario desde el store', () => {
    expect(component.formularioInfoRegistro).toBeDefined();
  });

  it('debería obtener datos del catálogo', () => {
    const mockService = TestBed.inject(CatalogoServices);
    component.obtenerIngresoSelectList('80205');
    expect(mockService.immexCatalogo).toHaveBeenCalledWith('80205');
  });

  it('debería guardar datos del formulario', () => {
    component.guardarDatosFormulario();
    expect(component.formularioInfoRegistro).toBeDefined();
  });

  it('debería manejar eliminación de grid de servicios', () => {
    component.datosImmex = [{ idServicio: '1', descripcion: 'Test' }] as any;
    component.domiciliosSeleccionados = [{ idServicio: '1' }] as any;
    
    const mockStore = TestBed.inject(AmpliacionServiciosStore);
    component.eliminarServiciosGrid();
    
    expect(mockStore.setDatosImmex).toHaveBeenCalled();
  });

  it('debería mostrar confirmación para agregar servicio', () => {
    component.doConfirmAgregar();
    expect(component.esHabilitarElDialogo).toBe(true);
    expect(component.nuevaNotificacion).toBeDefined();
  });

  it('debería mostrar confirmación para eliminar servicio', () => {
    component.domiciliosSeleccionados = [{ idServicio: '1' }] as any;
    component.doConfirmEliminar();
    expect(component.esEliminar).toBe(true);
  });

  it('debería manejar validación de agregar servicio', () => {
    component.rfcEmpresa = '';
    component.numeroPrograma = '';
    component.tiempoPrograma = '';
    component.domiciliosSeleccionados = [];
    component.autorizadosSeleccionados = [];
    
    component.doAgregarDos();
    expect(component.rowNotSeleccionada).toBe(true);
  });

  it('debería manejar validación de eliminación de empresa', () => {
    component.empresasSeleccionados = [];
    component.doEliminarDos();
    expect(component.noRowSelectedTablaC).toBe(true);
  });

  it('debería manejar adición de servicio', () => {
    component.serviciosImmexServId = '1';
    component.datosImmex = [];
    component.datosAutorizados = [{ idServicio: '1', descripcion: 'Test' }] as any;
    
    const event = new Event('click');
    jest.spyOn(event, 'stopPropagation');
    jest.spyOn(event, 'preventDefault');
    
    component.agregarServiciosAmpliacion(event);
    
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('debería manejar eliminación de empresa', () => {
    component.empresas = [{ descripcionServicio: 'Test Service' }] as any;
    component.empresasSeleccionados = [{ descripcionServicio: 'Test Service' }] as any;
    
    const mockStore = TestBed.inject(AmpliacionServiciosStore);
    component.eliminarEmpresasNacionales();
    
    expect(mockStore.setEmpresas).toHaveBeenCalled();
  });

  it('debería actualizar grid de empresas', () => {
    component.rfcEmpresa = 'TEST123';
    component.numeroPrograma = '12345';
    component.tiempoPrograma = '2024';
    component.domiciliosSeleccionados = [{ descripcionServicio: 'Test Service', id: 1 }] as any;
    
    const mockStore = TestBed.inject(AmpliacionServiciosStore);
    component.actualizaGridEmpresasNacionales();
    
    expect(mockStore.setEmpresas).toHaveBeenCalled();
  });

  it('debería manejar ngOnDestroy', () => {
    const mockSubscription = {
      unsubscribe: jest.fn()
    };
    (component as any).subscription = mockSubscription;
    
    component.ngOnDestroy();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('debería procesar datos del hijo', () => {
    component.formulario.patchValue({ entidadFederativa: '1' });
    component.aduanaDeIngreso = [{ clave: '1', descripcion: 'Test Aduana' }] as any;
    
    const mockStore = TestBed.inject(AmpliacionServiciosStore);
    component.procesarDatosDelHijo();
    
    expect(component.serviciosImmexServId).toBe('1');
    expect(mockStore.setAduanaDeIngresoSeleccion).toHaveBeenCalled();
  });

  it('debería seleccionar servicios', () => {
    const servicio = { idServicio: '1', descripcion: 'Test' } as any;
    component.seleccionarDomicilios(servicio);
    
    expect(component.domiciliosSeleccionados).toEqual([servicio]);
    expect(component.mercanciasSeleccionados).toEqual([1]);
  });

  it('debería seleccionar servicios autorizados', () => {
    const autorizado = { idServicio: '1', descripcion: 'Test' } as any;
    component.seleccionarAutorizados(autorizado);
    
    expect(component.autorizadosSeleccionados).toEqual([autorizado]);
    expect(component.tablaDosSeleccionados).toEqual([1]);
  });

  it('debería seleccionar empresas', () => {
    const empresa = { descripcionServicio: 'Test Company' } as any;
    component.seleccionarEmpresas(empresa);
    
    expect(component.empresasSeleccionados).toEqual([empresa]);
  });

  it('debería limpiar empresas seleccionadas cuando se pasa null', () => {
    component.empresasSeleccionados = [{ descripcionServicio: 'Test' } as any];
    component.seleccionarEmpresas(null as any);
    
    expect(component.empresasSeleccionados).toEqual([]);
  });

  it('debería limpiar servicios cuando se pasa null en seleccionarDomicilios', () => {
    component.domiciliosSeleccionados = [{ idServicio: '1' } as any];
    component.mercanciasSeleccionados = [1];
    
    component.seleccionarDomicilios(null as any);
    
    expect(component.domiciliosSeleccionados).toEqual([]);
    expect(component.mercanciasSeleccionados).toEqual([]);
  });

  it('debería limpiar autorizados cuando se pasa null en seleccionarAutorizados', () => {
    component.autorizadosSeleccionados = [{ idServicio: '1' } as any];
    component.tablaDosSeleccionados = [1];
    
    component.seleccionarAutorizados(null as any);
    
    expect(component.autorizadosSeleccionados).toEqual([]);
    expect(component.tablaDosSeleccionados).toEqual([]);
  });

  it('debería cerrar notificación de no hay fila seleccionada', () => {
    component.noRowSelected = true;
    component.cerrarNoRow();
    expect(component.noRowSelected).toBe(false);
  });

  it('debería cerrar notificación de no hay fila seleccionada en tabla C', () => {
    component.noRowSelectedTablaC = true;
    component.cerrarNoRowTablaC();
    expect(component.noRowSelectedTablaC).toBe(false);
  });

  it('debería mostrar modal de validación con mensaje personalizado', () => {
    const mensaje = 'Mensaje de prueba';
    component.formularioValidacionModal(mensaje);
    
    expect(component.rowNotSeleccionada).toBe(true);
    expect(component.nuevaNotificacion.mensaje).toBe(mensaje);
  });

  it('debería validar RFC en doAgregarDos', () => {
    component.rfcEmpresa = '';
    component.numeroPrograma = '123';
    component.tiempoPrograma = '2024';
    component.domiciliosSeleccionados = [{ idServicio: '1' } as any];
    
    jest.spyOn(component, 'formularioValidacionModal');
    
    component.doAgregarDos();
    
    expect(component.formularioValidacionModal).toHaveBeenCalledWith('Introduzca un RFC válido');
  });

  it('debería validar número de programa en doAgregarDos', () => {
    component.rfcEmpresa = 'TEST123';
    component.numeroPrograma = '';
    component.tiempoPrograma = '2024';
    component.domiciliosSeleccionados = [{ idServicio: '1' } as any];
    
    jest.spyOn(component, 'formularioValidacionModal');
    
    component.doAgregarDos();
    
    expect(component.formularioValidacionModal).toHaveBeenCalledWith('Introduzca un no. de Programa valido');
  });

  it('debería validar año en doAgregarDos', () => {
    component.rfcEmpresa = 'TEST123';
    component.numeroPrograma = '123';
    component.tiempoPrograma = '';
    component.domiciliosSeleccionados = [{ idServicio: '1' } as any];
    
    jest.spyOn(component, 'formularioValidacionModal');
    
    component.doAgregarDos();
    
    expect(component.formularioValidacionModal).toHaveBeenCalledWith('Introduzca un Año valido');
  });

  it('debería validar selección de servicios en doAgregarDos', () => {
    component.rfcEmpresa = 'TEST123';
    component.numeroPrograma = '123';
    component.tiempoPrograma = '2024';
    component.domiciliosSeleccionados = [];
    component.autorizadosSeleccionados = [];
    
    jest.spyOn(component, 'formularioValidacionModal');
    
    component.doAgregarDos();
    
    expect(component.formularioValidacionModal).toHaveBeenCalledWith('Debe seleccionar un Servicio.');
  });

  it('debería llamar actualizaGridEmpresasNacionales cuando validación pasa en doAgregarDos', () => {
    component.rfcEmpresa = 'TEST123';
    component.numeroPrograma = '123';
    component.tiempoPrograma = '2024';
    component.domiciliosSeleccionados = [{ idServicio: '1' } as any];
    
    jest.spyOn(component, 'actualizaGridEmpresasNacionales');
    
    component.doAgregarDos();
    
    expect(component.actualizaGridEmpresasNacionales).toHaveBeenCalled();
  });

  it('debería mostrar confirmación cuando no hay servicios seleccionados en doConfirmEliminar', () => {
    component.domiciliosSeleccionados = [];
    
    component.doConfirmEliminar();
    
    expect(component.noRowSelected).toBe(true);
    expect(component.nuevaNotificacion.mensaje).toBe('Debe seleccionar el Servicio que desea eliminar');
  });

  it('debería mostrar confirmación cuando servicios están seleccionados en doConfirmEliminar', () => {
    component.domiciliosSeleccionados = [{ idServicio: '1' } as any];
    
    component.doConfirmEliminar();
    
    expect(component.esEliminar).toBe(true);
    expect(component.nuevaNotificacion.mensaje).toBe('¿Esta seguro de eliminar el(los) servicio(s) seleccionado(s)?');
  });

  it('debería deshabilitar campos cuando formulario es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    
    component.guardarDatosFormulario();
    
    expect(component.campoDeshabilitar).toBe(true);
  });

  it('debería habilitar campos cuando formulario no es solo lectura', () => {
    component.esFormularioSoloLectura = false;
    
    component.guardarDatosFormulario();
    
    expect(component.campoDeshabilitar).toBe(false);
  });

  it('debería agregar servicio sin event en agregarServiciosAmpliacion', () => {
    component.serviciosImmexServId = '1';
    component.datosImmex = [];
    component.datosAutorizados = [{ idServicio: '1', descripcion: 'Test', claveServicio: '123' } as any];
    
    const mockService = TestBed.inject(ServiciosService);
    (mockService.postServiciosImmexTabla as jest.Mock).mockReturnValue(observableOf({
      codigo: '00',
      datos: [{ idServicio: 1, descripcion: 'Test Service', tipoServicio: 'TYPE', descripcionTipo: 'Test Type', claveServicio: '123' }]
    }));
    
    component.agregarServiciosAmpliacion();
    
    expect(mockService.postServiciosImmexTabla).toHaveBeenCalled();
  });

  it('debería manejar error en agregarServiciosAmpliacion cuando no hay serviciosImmexServId', () => {
    component.serviciosImmexServId = '';
    
    jest.spyOn(component, 'formularioValidacionModal');
    
    component.agregarServiciosAmpliacion();
    
    expect(component.formularioValidacionModal).toHaveBeenCalledWith('Debe elegir en la pestaña de servicios, el servicio que se realizará a las mercancías a capturar');
  });

  it('debería manejar servicio duplicado en agregarServiciosAmpliacion', () => {
    component.serviciosImmexServId = '1';
    component.datosImmex = [{ idServicio: '1', descripcion: 'Existing' } as any];
    
    jest.spyOn(component, 'doConfirmAgregar');
    
    component.agregarServiciosAmpliacion();
    
    expect(component.doConfirmAgregar).toHaveBeenCalled();
  });

  it('debería limpiar campos después de actualizar grid de empresas', () => {
    const mockService = TestBed.inject(ServiciosService);
    (mockService.postServiciosEmpresasNacionales as jest.Mock).mockReturnValue(observableOf({
      codigo: '00',
      datos: { empresasNacionales: [] }
    }));
    
    component.rfcEmpresa = 'TEST123';
    component.numeroPrograma = '123';
    component.tiempoPrograma = '2024';
    
    component.actualizaGridEmpresasNacionales();
    
    expect(component.rfcEmpresa).toBe('');
    expect(component.numeroPrograma).toBe('');
    expect(component.tiempoPrograma).toBe('');
  });
});