import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificacionComponent } from './modificacion.component';
import { CatalogosService } from '../../service/catalogos.service';
import { of } from 'rxjs';
import { Renderer2 } from '@angular/core';
import { PlantasComponent } from '../../../../shared/components/plantas/plantas.component';
import { SectorComponent } from '../../../../shared/components/sector/sector.component';
import { ProducirMercanciasComponent } from '../../../../shared/components/producir-mercancias/producir-mercancias.component';
import { ProductorIndirectoComponent } from '../../../../shared/components/productor-indirecto/productor-indirecto.component';

describe('ModificacionComponent', () => {
  let component: ModificacionComponent;
  let fixture: ComponentFixture<ModificacionComponent>;
  let mockCatalogosService: jest.Mocked<CatalogosService>;
  let mockRenderer: Renderer2;

  beforeEach(async () => {
    mockCatalogosService = {
      obtenerTablaLista: jest.fn().mockReturnValue(of([])),
      obtenerTablaListaBaja: jest.fn().mockReturnValue(of([])),
      obtenerTablaPlantas: jest.fn().mockReturnValue(of([])),
      obtenerTablaSector: jest.fn().mockReturnValue(of([])),
      obtenerTablaMercancia: jest.fn().mockReturnValue(of([])),
      obtenerTablaProductor: jest.fn().mockReturnValue(of([])),
      obtenerListaSectores: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<CatalogosService>;

    mockRenderer = {
      listen: jest.fn(),
    } as unknown as Renderer2;

    await TestBed.configureTestingModule({
      imports: [ModificacionComponent, PlantasComponent, SectorComponent, ProducirMercanciasComponent, ProductorIndirectoComponent],
      providers: [
        { provide: CatalogosService, useValue: mockCatalogosService },
        { provide: Renderer2, useValue: mockRenderer },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle onFilaClic for Activar button', () => {
    const mockEvent = { row: {}, column: '' };

  component.isBaja = true; 
  component.onFilaClic(mockEvent);
  expect(component.isBaja).toBe(true); 
});

  it('should clean up subscriptions on destroy', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});