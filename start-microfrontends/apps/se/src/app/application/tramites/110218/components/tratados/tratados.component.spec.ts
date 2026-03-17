import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TratadosComponent } from './tratados.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TratadosComponent', () => {
  let component: TratadosComponent;
  let fixture: ComponentFixture<TratadosComponent>;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      gettratados: jest.fn().mockReturnValue(of({
        tratadoAcuerdo: 'TLC',
        paisBloque: 'Asia',
        paisdeOrigen: 'Japón',
        paisDestino: 'México',
        fechadeExpedicion: '2025-01-01',
        fechadeVencimiento: '2025-04-03'
      }))
    };

    await TestBed.configureTestingModule({
      imports: [TratadosComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CertificadoTecnicoJaponService, useValue: mockService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TratadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores por defecto', () => {
    expect(component.detallesdeltransporte.get('fechadeExpedicion')?.value).toBe('2025-01-01');
    expect(component.detallesdeltransporte.get('fechadeVencimiento')?.value).toBe('2025-04-03');
    expect(component.detallesdeltransporte.get('tratadoAcuerdo')?.disabled).toBe(true);
  });

  it('debería actualizar los valores del formulario desde obtenerDatosDeTabla', () => {
    component.obtenerDatosDeTabla();
    expect(mockService.gettratados).toHaveBeenCalled();
    expect(component.detallesdeltransporte.get('tratadoAcuerdo')?.value).toBe('TLC');
    expect(component.detallesdeltransporte.get('paisBloque')?.value).toBe('Asia');
    expect(component.detallesdeltransporte.get('paisdeOrigen')?.value).toBe('Japón');
    expect(component.detallesdeltransporte.get('paisDestino')?.value).toBe('México');
    expect(component.detallesdeltransporte.get('fechadeExpedicion')?.value).toBe('2025-01-01');
    expect(component.detallesdeltransporte.get('fechadeVencimiento')?.value).toBe('2025-04-03');
  });

  it('debería actualizar fechadeVencimiento en cambioFechaFinal', () => {
    component.cambioFechaFinal('2025-04-03');
    expect(component.detallesdeltransporte.get('fechadeVencimiento')?.value).toBe('2025-04-03');
  });

  it('debería limpiar destroyed$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});