jest.mock('@libs/shared/theme/assets/json/221602/realizar.json', () => ({
  __esModule: true,
  default: {
    exportador: [
      {
        nombreDenominacionORazonSocial: 'dfdfsd',
        telefono: '---',
        correoElectronico: '---',
        domicilio: 'dfgdfgfd',
        pais: 'BELICE'
      }
    ],
    destinatario: [
      {
        nombreDenominacionORazonSocial: 'ADVICS MANUFACTURING MEXICO S DE R.L. DE C.V.',
        telefono: '555-3456789',
        correoElectronico: 'nose@gmail.com',
        calle: 'Av. Cazcanes',
        numeroExterior: '2210',
        numeroInterior: '',
        pais: 'MEXICO (ESTADOS UNIDOS MEXICANOS)',
        colonia: 'COLINAS DE LAGOS',
        municipioOAlcaldia: 'LAGOS DE MORENO',
        entidadFederativa: 'JALISCO',
        codigoPostal: '47515'
      }
    ],
    pais: [
      { id: 'MEX', descripcion: 'MÉXICO' }
    ],
    estado: [
      { id: 'JAL', descripcion: 'Jalisco' },
      { id: 'CDMX', descripcion: 'Ciudad de México' }
    ],
    municipio: [
      { id: 'LAGOS', descripcion: 'Lagos de Moreno' }
    ],
    colonia: [
      { id: 'COLINAS', descripcion: 'Colinas de Lagos' }
    ]
  }
}), { virtual: true });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosComponent } from './terceros.component';
import { TituloComponent, TablaDinamicaComponent, AlertComponent } from '@libs/shared/data-access-user/src';
import realizar from '@libs/shared/theme/assets/json/221602/realizar.json';
import { MENSAJE_TABLA_OBLIGATORIA } from '@libs/shared/data-access-user/src/core/models/221602/mercancia.model';


const mockExportador =realizar.exportador;
const mockDestinatario = realizar.destinatario;

describe('TercerosComponent', () => {
  let component: TercerosComponent;
  let fixture: ComponentFixture<TercerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports : [TercerosComponent, TituloComponent, TablaDinamicaComponent, AlertComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct TEXTOS value', () => {
    expect(component.TEXTOS).toBe(MENSAJE_TABLA_OBLIGATORIA);
  });

  it('should initialize exportador list correctly', () => {
    expect(component.exportador).toEqual(mockExportador);
    expect(component.exportador.length).toBeGreaterThan(0); 
  });

  it('should initialize destinatario list correctly', () => {
    expect(component.destinatario).toEqual(mockDestinatario);
    expect(component.destinatario.length).toBeGreaterThan(0);
  });

  it('should have the correct configuracionTabla for exportador', () => {
    expect(component.configuracionTabla.length).toBe(5);
    expect(component.configuracionTabla[0].encabezado).toBe('Nombre/denominación o razón social');
    expect(component.configuracionTabla[1].encabezado).toBe('Teléfono');
    expect(component.configuracionTabla[2].encabezado).toBe('Correo electrónico');
    expect(component.configuracionTabla[3].encabezado).toBe('Domicilio');
  });

  it('should have the correct configuracionTablaDatos for destinatario', () => {
    expect(component.configuracionTablaDatos.length).toBe(11);
    expect(component.configuracionTablaDatos[0].encabezado).toBe('Nombre/denominación o razón social');
    expect(component.configuracionTablaDatos[1].encabezado).toBe('Teléfono');
    expect(component.configuracionTablaDatos[2].encabezado).toBe('Correo electrónico');
    expect(component.configuracionTablaDatos[3].encabezado).toBe('Calle');
    expect(component.configuracionTablaDatos[4].encabezado).toBe('Número exterior');
  });

  it('should display the exportador table correctly', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('.exportador-table-row');
    expect(tableRows.length).toBe(0); 
  });

  it('should display the destinatario table correctly', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('.destinatario-table-row');
    expect(tableRows.length).toBe(0); 
  });

 

});
