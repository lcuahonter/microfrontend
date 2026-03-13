import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesDelTransporteComponent } from './detalles-del-transporte.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DetallesDelTransporteService } from '../../services/detalls-de-transporte/detalles-del-transporte.service';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const TRATADO = 'Tratado X';
const PAIS_O_BLOQUE = 'Bloque Y';
const PAIS_O_ORIGIN = 'País Origen';
const PAIS_O_DESTINO = 'País Destino';
const FECHA_DE_EXPEDICION = '01/01/2024';
const FECHA_DE_VENCIMIENTO = '01/01/2025';

describe('DetallesDelTransporteComponent', () => {
  let component: DetallesDelTransporteComponent;
  let fixture: ComponentFixture<DetallesDelTransporteComponent>;
  let serviceMock: any;
  let mockTramite110209Query: any;
  let mockTramite110209Store: any;

  beforeEach(async () => {
    serviceMock = {
      getMedioDeTransporte: jest.fn().mockReturnValue(of({
        tratado: TRATADO,
        paisOBloque: PAIS_O_BLOQUE,
        paisOOrigin: PAIS_O_ORIGIN,
        paisODestino: PAIS_O_DESTINO,
        fechaDeExpedicion: FECHA_DE_EXPEDICION,
        fechaDeVencimiento: FECHA_DE_VENCIMIENTO
      }))
    };

    mockTramite110209Query = {
      selectTramite110209$: of({
        tratadoAcuerdo: TRATADO,
        paisBloque: PAIS_O_BLOQUE,
        paisOrigen: PAIS_O_ORIGIN,
        fechaExpedicion: '2024-01-01T00:00:00.000Z',
        fechaVencimiento: '2025-01-01T00:00:00.000Z'
      })
    };

    mockTramite110209Store = {
      setTramite110209: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DetallesDelTransporteComponent],
      providers: [
        FormBuilder,
        { provide: DetallesDelTransporteService, useValue: serviceMock },
        { provide: Tramite110209Query, useValue: mockTramite110209Query },
        { provide: Tramite110209Store, useValue: mockTramite110209Store }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesDelTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario correctamente desde el store', () => {
    expect(component.detallesDelTransporteForm).toBeDefined();
    expect(component.detallesDelTransporteForm.get('tratado')).toBeDefined();
    expect(component.detallesDelTransporteForm.get('fechaDeExpedicion')).toBeDefined();
    expect(component.formularioCargado).toBe(true);
  });

  it('ngOnInit debe llamar a getMedioDeTransporte', () => {
    const SPY = jest.spyOn(component, 'getMedioDeTransporte');
    component.ngOnInit();
    expect(SPY).toHaveBeenCalled();
  });

  it('getMedioDeTransporte debe llenar el formulario con los datos del store', () => {
    // Reset component to test method independently
    component.detallesDelTransporteForm = undefined as any;
    component.formularioCargado = false;

    component.getMedioDeTransporte();
    
    // Verify form is created and populated from store data
    expect(component.detallesDelTransporteForm).toBeDefined();
    expect(component.detallesDelTransporteForm.get('tratado')?.value).toBe(TRATADO);
    expect(component.detallesDelTransporteForm.get('paisOBloque')?.value).toBe(PAIS_O_BLOQUE);
    expect(component.detallesDelTransporteForm.get('paisOOrigin')?.value).toBe(PAIS_O_ORIGIN);
    expect(component.detallesDelTransporteForm.get('paisODestino')?.value).toBe(PAIS_O_BLOQUE);
    expect(component.detallesDelTransporteForm.get('fechaDeExpedicion')?.value).toBe(FECHA_DE_EXPEDICION);
    expect(component.detallesDelTransporteForm.get('fechaDeVencimiento')?.value).toBe(FECHA_DE_VENCIMIENTO);
    expect(component.formularioCargado).toBe(true);
    expect(component.detallesDelTransporteForm.disabled).toBe(true);
  });

  it('getMedioDeTransporte debe actualizar formulario existente con patchValue cuando ya existe', () => {
    // Ensure form exists first
    component.getMedioDeTransporte();
    
    // Create new mock data
    const newMockData = {
      tratadoAcuerdo: 'Nuevo Tratado',
      paisBloque: 'Nuevo Bloque',
      paisOrigen: 'Nuevo Origen',
      fechaExpedicion: '2024-06-01T00:00:00.000Z',
      fechaVencimiento: '2025-06-01T00:00:00.000Z'
    };

    // Update mock to return new data
    mockTramite110209Query.selectTramite110209$ = of(newMockData);
    
    // Call method again - should use patchValue path
    component.getMedioDeTransporte();
    
    expect(component.detallesDelTransporteForm.get('tratado')?.value).toBe('Nuevo Tratado');
    expect(component.detallesDelTransporteForm.get('paisOBloque')?.value).toBe('Nuevo Bloque');
    expect(component.detallesDelTransporteForm.get('paisOOrigin')?.value).toBe('Nuevo Origen');
    expect(component.formularioCargado).toBe(true);
    expect(component.detallesDelTransporteForm.disabled).toBe(true);
  });

  it('debe suscribirse al store correctamente', () => {
    const subscribeSpy = jest.spyOn(mockTramite110209Query.selectTramite110209$, 'subscribe');
    component.getMedioDeTransporte();
    expect(subscribeSpy).toHaveBeenCalled();
  });

  it('debe establecer formularioCargado en true después de cargar datos', () => {
    component.formularioCargado = false;
    component.getMedioDeTransporte();
    expect(component.formularioCargado).toBe(true);
  });

  it('ngOnDestroy debe completar el subject destroyed$', () => {
    const NEXT_SPY = jest.spyOn(component['destroyed$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});