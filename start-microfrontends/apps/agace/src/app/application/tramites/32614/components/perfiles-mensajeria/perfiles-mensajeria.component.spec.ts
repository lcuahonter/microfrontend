import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { of } from "rxjs";
import { PerfilesMensajeriaComponent } from "./perfiles-mensajeria.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

// Mocks de dependencias
const mockTramite32614Store = {
  setDomicilio: jest.fn(),
  setAntiguedad: jest.fn(),
  setProductos: jest.fn(),
  setEmbarquesExp: jest.fn(),
  setEmbarquesImp: jest.fn(),
  setEmpleados: jest.fn(),
  setSuperficie: jest.fn(),
  setNombre: jest.fn(),
  setCategoria: jest.fn(),
  setVigencia: jest.fn(),
  setNombre2: jest.fn(),
  setCategoria2: jest.fn(),
  setVigenciaDos: jest.fn(),
  setNombre3: jest.fn(),
  setCategoria3: jest.fn(),
  setVigenciaTres: jest.fn(),
};
const mockTramite32614Query = {
  selectSolicitud$: of({
    domicilio: 'Calle 123',
    antiguedad: 5,
    productos: 10,
    embarquesExp: 2,
    embarquesImp: 3,
    empleados: 20,
    superficie: 100,
    nombre: 'Cert1',
    categoria: 'Cat1',
    vigencia: '2024-01-01',
    nombre2: 'Cert2',
    categoria2: 'Cat2',
    vigencia2: '2025-01-01',
    nombre3: 'Cert3',
    categoria3: 'Cat3',
    vigencia3: '2026-01-01',
  }),
};
const mockConsultaioQuery = {
  selectConsultaioState$: of({ readonly: false }),
};

describe('PerfilesMensajeriaComponent', () => {
  let component: PerfilesMensajeriaComponent;
  let fixture: ComponentFixture<PerfilesMensajeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilesMensajeriaComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: 'Tramite32614PerfilesMensajeriaStore', useValue: mockTramite32614Store },
        { provide: 'Tramite32614PerfilesMensajeriaQuery', useValue: mockTramite32614Query },
        { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
      ],
    })
      .overrideComponent(PerfilesMensajeriaComponent, {
        set: {
          providers: [
            { provide: FormBuilder, useValue: new FormBuilder() },
            { provide: 'Tramite32614PerfilesMensajeriaStore', useValue: mockTramite32614Store },
            { provide: 'Tramite32614PerfilesMensajeriaQuery', useValue: mockTramite32614Query },
            { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PerfilesMensajeriaComponent);
    component = fixture.componentInstance;
    // Inyectar dependencias manualmente
    (component as any).tramite32614Store = mockTramite32614Store;
    (component as any).tramite32614Query = mockTramite32614Query;
    (component as any).consultaioQuery = mockConsultaioQuery;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe alternar la visibilidad de la sección de contenido general', () => {
    expect(component.mostrarContenido).toBe(false);
    component.alternarContenido();
    expect(component.mostrarContenido).toBe(true);
  });

  it('debe alternar la visibilidad de la sección de seguridad física', () => {
    expect(component.mostrarSeguridad).toBe(false);
    component.alternarSeguridad();
    expect(component.mostrarSeguridad).toBe(true);
  });

  it('debe alternar la visibilidad de la sección de controles de acceso físico', () => {
    expect(component.mostrarAccesoFisico).toBe(false);
    component.alternarAccesoFisico();
    expect(component.mostrarAccesoFisico).toBe(true);
  });

  it('debe alternar la visibilidad de la sección de socios comerciales', () => {
    expect(component.mostrarSociosComeciales).toBe(false);
    component.alternarSociosComerciales();
    expect(component.mostrarSociosComeciales).toBe(true);
  });

  it('debe alternar la visibilidad de la sección de seguridad de procesos', () => {
    expect(component.mostrarSeguridadProcesos).toBe(false);
    component.alternarSeguridadProcesos();
    expect(component.mostrarSeguridadProcesos).toBe(true);
  });

  it('debe alternar la visibilidad de la sección de seguridad de los vehículos', () => {
    expect(component.mostrarSeguridadVehiculos).toBe(false);
    component.alternarSeguridadVehiculos();
    expect(component.mostrarSeguridadVehiculos).toBe(true);
  });

  it('debe alternar la visibilidad de la sección de seguridad del personal', () => {
    expect(component.mostrarSeguridadPersonal).toBe(false);
    component.alternarSeguridadPersonal();
    expect(component.mostrarSeguridadPersonal).toBe(true);
  });

  it('debe alternar la visibilidad de la sección de seguridad de la información', () => {
    expect(component.mostrarSeguridadInformacion).toBe(false);
    component.alternarSeguridadInformacion();
    expect(component.mostrarSeguridadInformacion).toBe(true);
  });

  it('debe alternar la visibilidad de la sección de capacitación en seguridad', () => {
    expect(component.mostrarCapacitacionSeguridad).toBe(false);
    component.alternarCapacitacionSeguridad();
    expect(component.mostrarCapacitacionSeguridad).toBe(true);
  });

  it('debe alternar la visibilidad de la sección de manejo e investigación de incidentes', () => {
    expect(component.mostrarManejoInvestigacion).toBe(false);
    component.alternarManejoInvestigacion();
    expect(component.mostrarManejoInvestigacion).toBe(true);
  });

  it('debe actualizar el valor de antigüedad en el store', () => {
    component.profileForm = new FormBuilder().group({ antiguedad: [10] });
    component.actualizarAntiguedad();
    expect(mockTramite32614Store.setAntiguedad).toHaveBeenCalledWith(10);
  });

  it('debe actualizar el valor de productos en el store', () => {
    // Arrange: Se crea un formulario con el campo productos
    component.profileForm = new FormBuilder().group({ productos: [15] });
    // Act: Se llama al método que actualiza productos
    component.actualizarProductos();
    // Assert: Se espera que el método del store haya sido llamado con el valor correcto
    expect(mockTramite32614Store.setProductos).toHaveBeenCalledWith(15);
  });
});