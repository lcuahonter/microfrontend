import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { AlertComponent } from '@ng-mf/data-access-user';

describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let fixture: ComponentFixture<TercerosRelacionadosComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockActivatedRoute = {} as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [CommonModule, TablaDinamicaComponent, AlertComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values for input properties', () => {
    expect(component.destinatarioFinalTablaDatos).toEqual([]);
    expect(component.proveedorTablaDatos).toEqual([]);
  });

  it('should have correct default table configurations', () => {
    expect(component.destinoFinalTablaConfiguracion.tipoSeleccionTabla).toBe(
      'CHECKBOX'
    );
    expect(component.dproveedorTablaConfiguracion.tipoSeleccionTabla).toBe(
      'CHECKBOX'
    );
  });
});
