import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of as observableOf, throwError, Subject } from 'rxjs';

import { PasoDosComponent } from './paso-dos.component';
import { CATALOGOS_ID, Catalogo, CatalogosService, TEXTOS, Usuario } from '@ng-mf/data-access-user';

@Injectable()
class MockCatalogosService {
  getCatalogo = jest.fn();
}

describe('PasoDosComponent - Pruebas Integrales', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;
  let mockCatalogosService: MockCatalogosService;

  const mockCatalogos: Catalogo[] = [
    {
      id: 1,
      descripcion: 'Primer documento'
    },
    {
      id: 2,
      descripcion: 'Segundo documento'
    }
  ];

  const mockUsuario: Usuario = {
    id: 123,
    nombre: 'Test User',
    email: 'test@example.com',
    rfc: 'TEST123456789'
  } as unknown as Usuario;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoDosComponent],
      imports: [HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: CatalogosService, useClass: MockCatalogosService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    
    mockCatalogosService = TestBed.inject(CatalogosService) as any;

    // Configurar inputs necesarios
    component.cargaArchivosEvento = new EventEmitter<void>();
    component.regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();
    component.idTipoTRamite = '80206';
    component.datosUsuario = mockUsuario;

    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.destroyed$) {
      component.destroyed$.next();
      component.destroyed$.complete();
    }
    fixture.destroy();
    jest.clearAllMocks();
  });

  it('debería crear el componente correctamente y inicializar propiedades por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.TEXTOS).toBeDefined();
    expect(component.TEXTOS).toBe(TEXTOS);
    expect(component.infoAlert).toBe('alert-info');
    expect(component.catalogoDocumentos).toEqual([]);
    expect(component.documentosSeleccionados).toEqual([]);
    expect(component.cargaRealizada).toBe(false);
    expect(component.destroyed$).toBeInstanceOf(Subject);
    expect(component.reenviarEvento).toBeInstanceOf(EventEmitter);
    expect(component.reenviarRegresarSeccion).toBeInstanceOf(EventEmitter);
  });

  it('debería inicializar correctamente los EventEmitters en el constructor', () => {
    const nuevoComponente = new PasoDosComponent(mockCatalogosService as any);
    
    expect(nuevoComponente.reenviarEvento).toBeInstanceOf(EventEmitter);
    expect(nuevoComponente.reenviarRegresarSeccion).toBeInstanceOf(EventEmitter);
    expect(nuevoComponente.destroyed$).toBeInstanceOf(Subject);
    expect(nuevoComponente.destroyed$.closed).toBe(false);
  });

  it('debería ejecutar ngOnInit y suscribirse al evento cargaArchivosEvento correctamente', () => {
    const spyReenviarEmit = jest.spyOn(component.reenviarEvento, 'emit');
    
    component.ngOnInit();
    
    // Simular emisión del evento cargaArchivosEvento
    component.cargaArchivosEvento.emit();
    
    expect(spyReenviarEmit).toHaveBeenCalled();
  });

  it('debería manejar múltiples emisiones del evento cargaArchivosEvento', () => {
    const spyReenviarEmit = jest.spyOn(component.reenviarEvento, 'emit');
    
    component.ngOnInit();
    
    // Simular múltiples emisiones
    component.cargaArchivosEvento.emit();
    component.cargaArchivosEvento.emit();
    component.cargaArchivosEvento.emit();
    
  });

  it('debería obtener tipos de documentos exitosamente cuando el servicio retorna datos', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(observableOf(mockCatalogos));
    
    component.getTiposDocumentos();
    
    expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    expect(component.catalogoDocumentos).toEqual(mockCatalogos);
  });

  it('debería manejar respuesta vacía cuando getTiposDocumentos no retorna datos', () => {
    mockCatalogosService.getCatalogo.mockReturnValue(observableOf([]));
    
    component.catalogoDocumentos = []; // Estado inicial
    component.getTiposDocumentos();
    
    expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    expect(component.catalogoDocumentos).toEqual([]);
  });

  it('debería mantener catálogos existentes cuando el servicio retorna array vacío', () => {
    const catalogosIniciales = [...mockCatalogos];
    component.catalogoDocumentos = catalogosIniciales;
    
    mockCatalogosService.getCatalogo.mockReturnValue(observableOf([]));
    component.getTiposDocumentos();
    
    expect(component.catalogoDocumentos).toEqual(catalogosIniciales);
  });

  it('debería manejar error en getTiposDocumentos cuando el servicio falla', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockCatalogosService.getCatalogo.mockReturnValue(throwError('Error del servicio'));
    
    component.catalogoDocumentos = [];
    component.getTiposDocumentos();
    
    expect(mockCatalogosService.getCatalogo).toHaveBeenCalledWith(CATALOGOS_ID.CAT_TIPO_DOCUMENTO);
    expect(component.catalogoDocumentos).toEqual([]);
    
    consoleSpy.mockRestore();
  });

  it('debería actualizar estado y emitir evento cuando documentosCargados recibe true', () => {
    const spyReenviarCargaRealizada = jest.spyOn(component.reenviarCargaRealizada, 'emit');
    
    component.documentosCargados(true);
    
    expect(component.cargaRealizada).toBe(true);
    expect(spyReenviarCargaRealizada).toHaveBeenCalledWith(true);
  });

  it('debería actualizar estado y emitir evento cuando documentosCargados recibe false', () => {
    const spyReenviarCargaRealizada = jest.spyOn(component.reenviarCargaRealizada, 'emit');
    
    component.cargaRealizada = true; // Estado inicial
    component.documentosCargados(false);
    
    expect(component.cargaRealizada).toBe(false);
    expect(spyReenviarCargaRealizada).toHaveBeenCalledWith(false);
  });

  it('debería manejar múltiples cambios de estado en documentosCargados', () => {
    const spyReenviarCargaRealizada = jest.spyOn(component.reenviarCargaRealizada, 'emit');
    
    // Cambio a true
    component.documentosCargados(true);
    expect(component.cargaRealizada).toBe(true);
    expect(spyReenviarCargaRealizada).toHaveBeenCalledWith(true);
    
    // Cambio a false
    component.documentosCargados(false);
    expect(component.cargaRealizada).toBe(false);
    expect(spyReenviarCargaRealizada).toHaveBeenCalledWith(false);
    
    // Nuevo cambio a true
    component.documentosCargados(true);
    expect(component.cargaRealizada).toBe(true);
    
    expect(spyReenviarCargaRealizada).toHaveBeenCalledTimes(3);
  });

  it('debería emitir evento correctamente cuando manejarEventoCargaDocumento recibe true', () => {
    const spyReenviarEventoCarga = jest.spyOn(component.reenviarEventoCarga, 'emit');
    
    component.manejarEventoCargaDocumento(true);
    
    expect(spyReenviarEventoCarga).toHaveBeenCalledWith(true);
  });

  it('debería emitir evento correctamente cuando manejarEventoCargaDocumento recibe false', () => {
    const spyReenviarEventoCarga = jest.spyOn(component.reenviarEventoCarga, 'emit');
    
    component.manejarEventoCargaDocumento(false);
    
    expect(spyReenviarEventoCarga).toHaveBeenCalledWith(false);
  });

  it('debería manejar múltiples llamadas a manejarEventoCargaDocumento', () => {
    const spyReenviarEventoCarga = jest.spyOn(component.reenviarEventoCarga, 'emit');
    
    component.manejarEventoCargaDocumento(true);
    component.manejarEventoCargaDocumento(false);
    component.manejarEventoCargaDocumento(true);
    
    expect(spyReenviarEventoCarga).toHaveBeenNthCalledWith(1, true);
    expect(spyReenviarEventoCarga).toHaveBeenNthCalledWith(2, false);
    expect(spyReenviarEventoCarga).toHaveBeenNthCalledWith(3, true);
    expect(spyReenviarEventoCarga).toHaveBeenCalledTimes(3);
  });

  it('debería ejecutar ngOnDestroy y limpiar suscripciones correctamente', () => {
    const nextSpy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería cancelar suscripciones cuando se llama ngOnDestroy', () => {
    const spyReenviarEmit = jest.spyOn(component.reenviarEvento, 'emit');
    
    component.ngOnInit();
    
    // Verificar que la suscripción funciona antes de destruir
    component.cargaArchivosEvento.emit();
    
    // Destruir el componente
    component.ngOnDestroy();
    
    // Verificar que no se ejecuta después de destruir
    component.cargaArchivosEvento.emit();
    expect(spyReenviarEmit).toHaveBeenCalledTimes(1); // No debería incrementar
  });

  it('debería mantener la integridad de los datos del usuario durante el ciclo de vida', () => {
    expect(component.datosUsuario).toEqual(mockUsuario);
    
    // Simular operaciones que podrían modificar el estado
    component.documentosCargados(true);
    component.manejarEventoCargaDocumento(false);
    
    // Verificar que los datos del usuario no cambiaron
    expect(component.datosUsuario).toEqual(mockUsuario);
  });

  it('debería mantener la integridad del tipo de trámite durante las operaciones', () => {
    expect(component.idTipoTRamite).toBe('80206');
    
    // Simular operaciones
    component.documentosCargados(true);
    component.manejarEventoCargaDocumento(true);
    
    expect(component.idTipoTRamite).toBe('80206');
  });

  it('debería manejar correctamente la inicialización con inputs requeridos', () => {
    // Verificar que los inputs se configuraron correctamente
    expect(component.cargaArchivosEvento).toBeInstanceOf(EventEmitter);
    expect(component.regresarSeccionCargarDocumentoEvento).toBeInstanceOf(EventEmitter);
    expect(component.idTipoTRamite).toBeDefined();
    expect(component.datosUsuario).toBeDefined();
  });

  it('debería manejar estados intermedios correctamente durante la carga de documentos', () => {
    const spyReenviarCargaRealizada = jest.spyOn(component.reenviarCargaRealizada, 'emit');
    
    // Estado inicial
    expect(component.cargaRealizada).toBe(false);
    
    // Iniciar proceso de carga
    component.manejarEventoCargaDocumento(true);
    expect(component.cargaRealizada).toBe(false); // No cambia hasta que se complete
    
    // Completar carga exitosamente
    component.documentosCargados(true);
    expect(component.cargaRealizada).toBe(true);
    expect(spyReenviarCargaRealizada).toHaveBeenCalledWith(true);
    
    // Reiniciar proceso
    component.documentosCargados(false);
    expect(component.cargaRealizada).toBe(false);
    expect(spyReenviarCargaRealizada).toHaveBeenCalledWith(false);
  });

  it('debería ejecutar el flujo completo de carga de documentos correctamente', () => {
    const spyReenviarEvento = jest.spyOn(component.reenviarEvento, 'emit');
    const spyReenviarEventoCarga = jest.spyOn(component.reenviarEventoCarga, 'emit');
    const spyReenviarCargaRealizada = jest.spyOn(component.reenviarCargaRealizada, 'emit');
    
    mockCatalogosService.getCatalogo.mockReturnValue(observableOf(mockCatalogos));
    
    // Inicializar componente
    component.ngOnInit();
    
    // Obtener catálogos de documentos
    component.getTiposDocumentos();
    expect(component.catalogoDocumentos).toEqual(mockCatalogos);
    
    // Activar evento de carga
    component.cargaArchivosEvento.emit();
    expect(spyReenviarEvento).toHaveBeenCalled();
    
    // Manejar disponibilidad de documentos
    component.manejarEventoCargaDocumento(true);
    expect(spyReenviarEventoCarga).toHaveBeenCalledWith(true);
    
    // Completar carga de documentos
    component.documentosCargados(true);
    expect(spyReenviarCargaRealizada).toHaveBeenCalledWith(true);
    expect(component.cargaRealizada).toBe(true);
  });

  it('debería limpiar correctamente todos los recursos en ngOnDestroy', () => {
    // Inicializar suscripciones
    component.ngOnInit();
    
    // Verificar estado antes de destruir
    expect(component.destroyed$.closed).toBe(false);
    
    // Destruir componente
    const nextSpy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    
    component.ngOnDestroy();
    
    // Verificar limpieza
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});