import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosComponent } from './terceros.component';
import {
  TituloComponent,
  TablaDinamicaComponent,
  AlertComponent,
} from '@libs/shared/data-access-user/src';
import { SanidadService } from '../../service/sanidad.service';
import {
  CONFIGURATION_TABLA_DESTINATARIO,
  CONFIGURATION_TABLA_EXPORTADOR,
  MENSAJE_TABLA_OBLIGATORIA,
} from '../../enum/sanidad.enum';

describe('TercerosComponent', () => {
  let component: TercerosComponent;
  let fixture: ComponentFixture<TercerosComponent>;
  let sanidadService: SanidadService;

  const mockExportador = [
    {
      nombreDenominacionORazonSocial: 'Exportador 1',
      telefono: '1234567890',
      correoElectronico: 'exportador1@test.com',
      domicilio: 'Domicilio 1',
      pais: 'México',
    },
  ];

  const mockDestinatario = [
    {
      nombreDenominacionORazonSocial: 'Destinatario 1',
      telefono: '0987654321',
      correoElectronico: 'destinatario1@test.com',
      calle: 'Calle 1',
      numeroExterior: '123',
      numeroInterior: 'A',
      pais: 'México',
      colonia: 'Colonia 1',
      municipioOAlcaldia: 'Municipio 1',
      entidadFederativa: 'Estado 1',
      codigoPostal: '12345',
    },
  ];

  const sanidadServiceMock = {
    inicializaDatosExportador: jest.fn(),
    inicializaDatosDestinatario: jest.fn(),
    exportador: mockExportador,
    destinatario: mockDestinatario,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TercerosComponent],
      imports: [TituloComponent, TablaDinamicaComponent, AlertComponent],
      providers: [{ provide: SanidadService, useValue: sanidadServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TercerosComponent);
    component = fixture.componentInstance;
    sanidadService = TestBed.inject(SanidadService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct TEXTOS value', () => {
    expect(component.TEXTOS).toBe(MENSAJE_TABLA_OBLIGATORIA);
  });

  it('should initialize exportador list correctly', () => {
    expect(sanidadService.inicializaDatosExportador).toHaveBeenCalled();
    expect(component.sanidadService.exportador).toEqual(mockExportador);
    expect(component.sanidadService.exportador.length).toBeGreaterThan(0);
  });

  it('should initialize destinatario list correctly', () => {
    expect(sanidadService.inicializaDatosDestinatario).toHaveBeenCalled();
    expect(component.sanidadService.destinatario).toEqual(mockDestinatario);
    expect(component.sanidadService.destinatario.length).toBeGreaterThan(0);
  });

  it('should have the correct configuracionTabla for exportador', () => {
    expect(component.configuracionTabla).toEqual(
      CONFIGURATION_TABLA_EXPORTADOR
    );
    expect(component.configuracionTabla.length).toBe(5); // Adjust based on the actual length
    expect(component.configuracionTabla[0].encabezado).toBe(
      'Nombre/denominación o razón social'
    );
    expect(component.configuracionTabla[1].encabezado).toBe('Teléfono');
    expect(component.configuracionTabla[2].encabezado).toBe(
      'Correo electrónico'
    );
    expect(component.configuracionTabla[3].encabezado).toBe('Domicilio');
    expect(component.configuracionTabla[4].encabezado).toBe('País');
  });

  it('should have the correct configuracionTablaDatos for destinatario', () => {
    expect(component.configuracionTablaDatos).toEqual(
      CONFIGURATION_TABLA_DESTINATARIO
    );
    expect(component.configuracionTablaDatos.length).toBe(11); // Adjust based on the actual length
    expect(component.configuracionTablaDatos[0].encabezado).toBe(
      'Nombre/denominación o razón social'
    );
    expect(component.configuracionTablaDatos[1].encabezado).toBe('Teléfono');
    expect(component.configuracionTablaDatos[2].encabezado).toBe(
      'Correo electrónico'
    );
    expect(component.configuracionTablaDatos[3].encabezado).toBe('Calle');
    expect(component.configuracionTablaDatos[4].encabezado).toBe(
      'Número exterior'
    );
  });

  it('should display the exportador table correctly', () => {
    const tableRows = fixture.nativeElement.querySelectorAll(
      '.exportador-table-row'
    );
    expect(tableRows.length).toBe(mockExportador.length);
  });

  it('should display the destinatario table correctly', () => {
    const tableRows = fixture.nativeElement.querySelectorAll(
      '.destinatario-table-row'
    );
    expect(tableRows.length).toBe(mockDestinatario.length);
  });

  it('should have esFormularioSoloLectura default to false', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should have all required keys in exportador column configuration', () => {
    const keys = ['encabezado', 'clave', 'orden'];
    component.configuracionTabla.forEach((col) => {
      keys.forEach((key) => {
        expect(col.hasOwnProperty(key)).toBe(true);
      });
    });
  });

  it('should have all required keys in destinatario column configuration', () => {
    const keys = ['encabezado', 'clave', 'orden'];
    component.configuracionTablaDatos.forEach((col) => {
      keys.forEach((key) => {
        expect(col.hasOwnProperty(key)).toBe(true);
      });
    });
  });

  it('should inject SanidadService', () => {
    expect(component.sanidadService).toBeDefined();
  });

  it('should clean up on destroy', () => {
    // If you have a destroy Subject, spy on it
    if ((component as any).destroyNotifier$) {
      const destroySpy = jest.spyOn(
        (component as any).destroyNotifier$,
        'next'
      );
      const completeSpy = jest.spyOn(
        (component as any).destroyNotifier$,
        'complete'
      );
      component.ngOnDestroy();
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    }
  });
});
