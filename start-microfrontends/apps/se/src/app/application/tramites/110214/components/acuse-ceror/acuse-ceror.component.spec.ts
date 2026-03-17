import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcuseCerorComponent } from './acuse-ceror.component';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

describe('AcuseCerorComponent', () => {
  let component: AcuseCerorComponent;
  let fixture: ComponentFixture<AcuseCerorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TablaDinamicaComponent, AcuseCerorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcuseCerorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct table headers', () => {
    expect(component.acuseEncabezados).toEqual([
      { encabezado: 'No.', clave: expect.any(Function), orden: 1 },
      { encabezado: 'Documento', clave: expect.any(Function), orden: 2 },
    ]);
  });

  it('should have correct table data', () => {
    expect(component.acuseTablaDatos).toEqual([
      { id: 1, documento: 'Vista previa del Certificado de origen', descargar: '' },
    ]);
  });

  it('should have correct table actions', () => {
    expect(component.acciones).toBeDefined();
    expect(component.acciones.DESCARGAR).toBeDefined();
  });

  it('should render the table with correct data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tableHeader = compiled.querySelector('h3')?.textContent;
    expect(tableHeader).toContain('VISTA PREVIA CERTIFICADO DE ORIGEN');
  });
});