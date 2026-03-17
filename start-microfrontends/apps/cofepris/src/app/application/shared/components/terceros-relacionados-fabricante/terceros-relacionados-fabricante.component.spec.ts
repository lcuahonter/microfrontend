import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosFabricanteComponent } from './terceros-relacionados-fabricante.component';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component';
import { AlertComponent, Fabricante, Otros, TituloComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { FABRICANTE_TABLA, OTROS_TABLA } from '../../constantes/terceros-relacionados-fabricante.enum';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

describe('TercerosRelacionadosFabricanteComponent', () => {
  let component: TercerosRelacionadosFabricanteComponent;
  let fixture: ComponentFixture<TercerosRelacionadosFabricanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaDinamicaComponent, AlertComponent, TituloComponent],
      imports: [CommonModule,TercerosRelacionadosFabricanteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosFabricanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate correct configuration for tables', () => {
    const generatedConfig: ConfiguracionColumna<Fabricante>[] = component.generateConfiguracionTabla(FABRICANTE_TABLA);
    
    expect(Array.isArray(generatedConfig)).toBeTruthy();
    
    generatedConfig.forEach(config => {
      expect(config).toHaveProperty('encabezado');
      expect(config).toHaveProperty('clave');
      expect(config).toHaveProperty('orden');
    });
  });

  it('should initialize with correct table data', () => {
    expect(component.fabricanteTablaDatos).toEqual([]);
    expect(component.facturadorTablaDatos).toEqual([]);
    expect(component.otrosTablaDatos).toEqual([]);
  });

  it('should set correct selection type for checkboxes', () => {
    expect(component.checkbox).toBe(TablaSeleccion.CHECKBOX);
  });

  it('should generate configuration for "Otros" table correctly', () => {
    const generatedConfigOtros: ConfiguracionColumna<Otros>[] = component.generateConfiguracionTabla(OTROS_TABLA);
    
    expect(Array.isArray(generatedConfigOtros)).toBeTruthy();
    
    generatedConfigOtros.forEach(config => {
      expect(config).toHaveProperty('encabezado');
      expect(config).toHaveProperty('clave');
      expect(config).toHaveProperty('orden');
    });
  });
});
