import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DatosComunesComponent } from './datos-comunes.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tramite32615Store } from '../../../../estados/tramites/tramite32615.store';
import { Tramite32615Query } from '../../../../estados/queries/tramite32615.query';
import { RecintoFiscalizadoService } from '../../services/recinto-fiscalizado.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ALERTA_COM, OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/32615/datos-comunes.enum';

describe('DatosComunesComponent', () => {
  let component: DatosComunesComponent;
  let fixture: ComponentFixture<DatosComunesComponent>;
  let mockStore: Partial<Tramite32615Store>;
  let mockQuery: Partial<Tramite32615Query>;
  let mockService: Partial<RecintoFiscalizadoService>;

  beforeEach(async () => {
    mockStore = {
      setSectorProductivo: jest.fn(),
      setServicio: jest.fn(),
      setSolicitudDeInspeccion: jest.fn(),
      // Agregar otros métodos del store según sea necesario
    };

    mockQuery = {
      selectSolicitud$: of({
        sectorProductivo: '',
        servicio: '',
        preOperativo: '',
        solicitudDeInspeccion: '',
        indiqueAutorizo: '',
        senaleCuentaEmpleados: '',
        bimestre: '',
        numeroDeEmpleados: '',
        cumpleConLaObligacion: '',
        acreditaRealizar: '',
        senaleSiAlMomento: '',
        rfc: '',
        numeroDeEmpleadosForma: '',
        bimestreForma: '',
        acreditaCumplir: '',
        fraccionVI: '',
        cuartoParrafoDelCff: '',
        novenoParrafoDelCff: '',
        digitalesEstanVigentes: '',
        ultimosDoceMeses: '',
        prestacionDeServicios: '',
        instalacionesPrincipales: '',
        municipioAlcaldia: '',
        tipoDeInstalcion: '',
        procesoProductivo: '',
        acreditacionDelUso: '',
        prefilMensajeria: '',
        articuloDelCff: '',
        exportadoresSectorial: '',
        archivoNacionales: '',
        proveedores: '',
        solicitudDeCertificacion: '',
        controlInventarios: '',
        nombreDelSistema: '',
        lugarDeRadicacion: '',
        previstas: '',
        delCffLasReglas: '',
        enSeCaracter: '',
        obligadoTributar: '',
        nacionalidad: '',
        conformidad: '',
        esquemaIntegralCertificacion: '',
        modificadasRevocadas: ''
      }),
    };

    mockService = {
      obtenerTablaDatos: jest.fn().mockReturnValue(of({ data: [{}] })),
      obtenerInstalacionesPrincipalesTablaDatos: jest.fn().mockReturnValue(of({ data: [{}] })),
      obtenerInventariosTablaDatos: jest.fn().mockReturnValue(of({ data: [{}] })),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, DatosComunesComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Tramite32615Store, useValue: mockStore },
        { provide: Tramite32615Query, useValue: mockQuery },
        { provide: RecintoFiscalizadoService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores por defecto', () => {
    expect(component.datosComunesForma).toBeDefined();
    expect(component.tablaModalForma).toBeDefined();
    expect(component.tablaDosModalForma).toBeDefined();
    expect(component.miembroDeLaEmpresa).toBeDefined();
  });

  it('debería cargar datos de catálogo', () => {
    expect(component.sectorProductivoAgace.length).toBeGreaterThan(0);
    expect(component.serviciosAgace.length).toBeGreaterThan(0);
  });

  it('debería establecer constantes de alerta', () => {
    expect(component.alerta).toEqual(ALERTA_COM);
    expect(component.opcionDeBotonDeRadio).toEqual(OPCIONES_DE_BOTON_DE_RADIO);
  });

  it('debería llamar a los métodos del servicio para cargar datos de tabla', () => {
    component.obtenerTablaDatos();
    component.obtenerInstalacionesPrincipalesTablaDatos();
    component.obtenerInventariosTablaDatos();

    expect(mockService.obtenerTablaDatos).toHaveBeenCalled();
    expect(mockService.obtenerInstalacionesPrincipalesTablaDatos).toHaveBeenCalled();
    expect(mockService.obtenerInventariosTablaDatos).toHaveBeenCalled();
  });

  it('debería actualizar valores en el store cuando cambia el formulario', () => {
    const testValue = 'test-value';
    component.datosComunesForma.get('sectorProductivo')?.setValue(testValue);
    
    expect(mockStore.setSectorProductivo).toHaveBeenCalledWith(testValue);
  });

  it('debería mostrar/ocultar campos según la selección de botones de radio', () => {
    // Probar campo senaleCuentaEmpleados
    component.datosComunesForma.get('senaleCuentaEmpleados')?.setValue('1');
    expect(component.showSenaleCuentaEmpleados).toBe(true);
    
    component.datosComunesForma.get('senaleCuentaEmpleados')?.setValue('0');
    expect(component.showSenaleCuentaEmpleados).toBe(false);

    // Probar campo senaleSiAlMomento
    component.datosComunesForma.get('senaleSiAlMomento')?.setValue('1');
    expect(component.showSenaleSiAlMomento).toBe(true);
    
    component.datosComunesForma.get('senaleSiAlMomento')?.setValue('0');
    expect(component.showSenaleSiAlMomento).toBe(false);
  });

  it('debería limpiar servicio cuando cambia sectorProductivo y viceversa', () => {
    component.datosComunesForma.get('sectorProductivo')?.setValue('test');
    expect(mockStore.setServicio).toHaveBeenCalledWith('');
    
    component.datosComunesForma.get('servicio')?.setValue('test');
    expect(mockStore.setSectorProductivo).toHaveBeenCalledWith('');
  });

  it('debería abrir modal de confirmación cuando se cumplen ciertas condiciones', () => {
    component.openConfirmModal = jest.fn();
    
    // Probar con un campo que debería activar el modal
    component.setValoresStore(component.datosComunesForma, 'solicitudDeInspeccion', 'setSolicitudDeInspeccion', true, 0);
    expect(component.openConfirmModal).toHaveBeenCalled();
  });

  it('debería manejar la validación del formulario', () => {
    const camposRequeridos = [
      'solicitudDeInspeccion',
      'indiqueAutorizo',
      'senaleCuentaEmpleados',
      // Agregar otros campos requeridos
    ];

    camposRequeridos.forEach(campo => {
      const control = component.datosComunesForma.get(campo);
      control?.setValue('');
      expect(control?.valid).toBeFalsy();
      control?.setValue('valor-valido');
      expect(control?.valid).toBeTruthy();
    });
  });

  it('debería deshabilitar controles del formulario en modo solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    
    Object.keys(component.datosComunesForma.controls).forEach(key => {
      expect(component.datosComunesForma.get(key)?.disabled).toBeTruthy();
    });
  });

  it('debería crear datos de tabla cuando se acepta el modal', () => {
    component.crearTablaDatos();
    expect(component.mercanciasTablaDatos.length).toBe(1);
    
    component.crearTablaDosDatos();
    expect(component.instalacionesPrincipalesTablaDatos.length).toBe(1);
  });

  it('debería abrir y cerrar modales', () => {
    // Mock de instancias de modal
    component.confirmInstance = { show: jest.fn(), hide: jest.fn() } as any;
    component.tablaInstance = { show: jest.fn(), hide: jest.fn() } as any;
    component.instalacionesPrincipalesTablaInstance = { show: jest.fn(), hide: jest.fn() } as any;
    component.miembroDeLaEmpresaInstance = { show: jest.fn(), hide: jest.fn() } as any;
    
    component.openConfirmModal();
    expect(component.confirmInstance.show).toHaveBeenCalled();
    
    component.closeConfirmModal();
    expect(component.confirmInstance.hide).toHaveBeenCalled();
    
    // Probar otros modales de manera similar
  });

  it('debería limpiar recursos al destruir el componente', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería renderizar campos requeridos con asterisco', () => {
    const etiquetasRequeridas = fixture.debugElement.queryAll(By.css('.danger'));
    expect(etiquetasRequeridas.length).toBeGreaterThan(0);
  });

  it('debería actualizar el flag changed al cambiar valores', () => {
    const initialChanged = component.changed;
    component.enCambioDeValor();
    expect(component.changed).toBe(!initialChanged);
  });
});