import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { ModificacionMercanciaModeloComponent } from './modificacion-mercancia-modelo.component';
import { MercanciaTablaDatos } from '../../models/modificacion-descripcion.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';

describe('ModificacionMercanciaModeloComponent', () => {
  let component: ModificacionMercanciaModeloComponent;
  let fixture: any;

  const mockMercancias: MercanciaTablaDatos[] = [
    { descripcionSolicitada: 'desc1' } as MercanciaTablaDatos,
    { descripcionSolicitada: 'desc2' } as MercanciaTablaDatos,
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificacionMercanciaModeloComponent, HttpClientTestingModule, CommonModule, TituloComponent, ReactiveFormsModule],
      providers: [UntypedFormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificacionMercanciaModeloComponent);
    component = fixture.componentInstance;
    component.mercanciaSeleccionadas = [...mockMercancias];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.mercanciaFormularioModelo).toBeDefined();
    expect(
      component.mercanciaFormularioModelo.get('descipcionSolicitada')
    ).toBeDefined();
  });

  it('should patch form value on ngOnChanges if mercanciaSeleccionadas has items', () => {
    const changes = {
      mercanciaSeleccionadas: {
        currentValue: [...mockMercancias],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    };
    component.ngOnChanges(changes);
    expect(
      component.mercanciaFormularioModelo.get('descipcionSolicitada')?.value
    ).toBe(mockMercancias[0].descripcionSolicitada);
  });

  it('should not patch form value on ngOnChanges if mercanciaSeleccionadas is empty', () => {
    component.mercanciaSeleccionadas = [];
    const changes = {
      mercanciaSeleccionadas: {
        currentValue: [],
        previousValue: mockMercancias,
        firstChange: false,
        isFirstChange: () => false,
      },
    };
    component.ngOnChanges(changes);
    expect(
      component.mercanciaFormularioModelo.get('descipcionSolicitada')?.value
    ).toBe('');
  });

  it('should modify all selected mercancias and emit event', () => {
    const emitSpy = jest.spyOn(component.emitMercanciaSeleccionadas, 'emit');
    component.mercanciaFormularioModelo
      .get('descipcionSolicitada')
      ?.setValue('nueva descripcion');
    component.modificarMercanciaSeleccionadas();
    expect(
      component.mercanciaSeleccionadas.every(
        (m) => m.descripcionSolicitada === 'nueva descripcion'
      )
    ).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(component.mercanciaSeleccionadas);
  });

  it('should not emit if descipcionSolicitada is empty', () => {
    const emitSpy = jest.spyOn(component.emitMercanciaSeleccionadas, 'emit');
    component.mercanciaFormularioModelo
      .get('descipcionSolicitada')
      ?.setValue('');
    component.modificarMercanciaSeleccionadas();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should clear mercanciaSeleccionadas and reset form on cancelarMercanciaSeleccionadas', () => {
    component.mercanciaFormularioModelo
      .get('descipcionSolicitada')
      ?.setValue('algo');
    component.cancelarMercanciaSeleccionadas();
    expect(component.mercanciaSeleccionadas.length).toBe(0);
    expect(
      component.mercanciaFormularioModelo.get('descipcionSolicitada')?.value
    ).toBeNull();
  });
});
