import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProveedoresComponent } from './proveedores.component';
import { ProveedoresService } from '../../core/service/informacion/agace-acna/proveedores.Service';
import { Proveedores } from '../../core/models/informacion/agace-acna/proveedores/response/proveedores-response';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('ProveedoresComponent', () => {
  let component: ProveedoresComponent;
  let fixture: ComponentFixture<ProveedoresComponent>;
  let proveedoresService: any;

  const mockProveedores: Proveedores[] = [
    {
      rfc: 'ABC123456DEF',
      razon_social: 'Empresa Test S.A.',
      rfc_industria: 'XYZ987654ABC',
      razon_social_industria: 'Industria Automotriz Test',
      domicilio_fiscal: 'Calle Principal #123',
      norma: 'NOM-001',
      programa_inmex: 'INMEX001',
      programa_prosec: 'PROSEC001',
      aduanas: 'Aduana 1, Aduana 2',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-31'
    }
  ];

  beforeEach(async () => {
    const proveedoresServiceSpy = jasmine.createSpyObj('ProveedoresService', [
      'obtenerDatosProveedores'
    ]);

    await TestBed.configureTestingModule({
      imports: [ProveedoresComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: ProveedoresService, useValue: proveedoresServiceSpy }
      ]
    }).compileComponents();

    proveedoresService = TestBed.inject(ProveedoresService);
    fixture = TestBed.createComponent(ProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con el campo rfc vacío', () => {
    expect(component.FormBusquedaProveedores).toBeDefined();
    expect(component.FormBusquedaProveedores.get('rfc')?.value).toBe('');
  });

  it('debería validar que el campo rfc es requerido', () => {
    const rfcControl = component.FormBusquedaProveedores.get('rfc');
    
    rfcControl?.setValue('');
    expect(rfcControl?.valid).toBe(false);
    expect(rfcControl?.hasError('required')).toBe(true);

    rfcControl?.setValue('ABC123456DEF');
    expect(rfcControl?.valid).toBe(true);
  });

  it('debería mostrar alerta cuando el formulario es inválido al buscar', () => {
    component.FormBusquedaProveedores.get('rfc')?.setValue('');
    component.obtenerDatosDelProveedor();

    expect(component.alertaVisible).toBe(true);
    expect(component.mensajeAlerta).toContain('Debe proporcionar RFC');
  });

  it('debería llamar al servicio y obtener datos cuando el formulario es válido', () => {
    const mockResponse = { datos: mockProveedores };
    proveedoresService.obtenerDatosProveedores.and.returnValue(of(mockResponse));

    component.FormBusquedaProveedores.get('rfc')?.setValue('ABC123456DEF');
    component.obtenerDatosDelProveedor();

    expect(proveedoresService.obtenerDatosProveedores).toHaveBeenCalled();
    expect(component.datosProveedores).toEqual(mockProveedores);
    expect(component.alertaVisible).toBe(false);
  });

  it('debería limpiar el campo rfc al llamar limpiarInput', () => {
    component.FormBusquedaProveedores.get('rfc')?.setValue('ABC123456DEF');
    component.limpiarInput();

    expect(component.FormBusquedaProveedores.get('rfc')?.value).toBe('');
  });

  it('debería tener configuración de tabla con 11 columnas', () => {
    expect(component.configuracionTabla.length).toBe(11);
    expect(component.configuracionTabla[0].encabezado).toBe('RFC Proveedor');
    expect(component.configuracionTabla[1].encabezado).toContain('Razón Social');
  });

  it('debería generar alerta de error con formato HTML correcto', () => {
    const mensajes = ['Error 1', 'Error 2'];
    const resultado = ProveedoresComponent.generarAlertaDeError(mensajes);

    expect(resultado).toContain('<li>Error 1</li>');
    expect(resultado).toContain('<li>Error 2</li>');
    expect(resultado).toContain('Corrija los siguientes errores');
  });

  it('debería obtener el control rfc del formulario', () => {
    const rfcControl = component.rfc;
    expect(rfcControl).toBeDefined();
    expect(rfcControl).toBe(component.FormBusquedaProveedores.get('rfc'));
  });

  it('debería completar el subject destroy$ al destruir el componente', () => {
    spyOn(component['destroy$'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['destroy$'].unsubscribe).toHaveBeenCalled();
  });

  it('debería exportar a Excel cuando existe la tabla', () => {
    const mockTable = document.createElement('table');
    mockTable.id = 'tablaProveedores';
    document.body.appendChild(mockTable);

    spyOn(document, 'getElementById').and.returnValue(mockTable);
    spyOn(URL, 'createObjectURL').and.returnValue('blob:mock-url');
    spyOn(URL, 'revokeObjectURL');

    component.exportarExcel();

    expect(document.getElementById).toHaveBeenCalledWith('tablaProveedores');
    expect(URL.createObjectURL).toHaveBeenCalled();

    document.body.removeChild(mockTable);
  });

  it('debería manejar el caso cuando no existe la tabla al exportar', () => {
    spyOn(document, 'getElementById').and.returnValue(null);
    spyOn(console, 'warn');

    component.exportarExcel();

    expect(console.warn).toHaveBeenCalledWith('No se encontró la tabla');
  });
});