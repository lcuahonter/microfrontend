import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartidasDeLaMercanciaComponent } from './partidas-de-la-mercancia.component';
import { SolicitudProrrogaService } from '../../services/solicitudProrroga/solicitud-prorroga.service';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('PartidasDeLaMercanciaComponent', () => {
  let component: PartidasDeLaMercanciaComponent;
  let fixture: ComponentFixture<PartidasDeLaMercanciaComponent>;
  let mockService: jest.Mocked<SolicitudProrrogaService>;

  beforeEach(async () => {
    mockService = {
      obtenerTablaDatos: jest.fn().mockReturnValue(of({ data: [] })),
      obtenerPartidasFormDatos: jest.fn().mockReturnValue(of({ data: [] })),
      obtenerPartidasTablaDatos: jest.fn().mockReturnValue(of({ data: [] }))
    } as unknown as jest.Mocked<SolicitudProrrogaService>;

    await TestBed.configureTestingModule({
      imports: [
        PartidasDeLaMercanciaComponent,
        CommonModule,
        TituloComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: SolicitudProrrogaService, useValue: mockService },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PartidasDeLaMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario de partidas en ngOnInit', () => {
    expect(component.partidas).toBeDefined();
    expect(component.partidas.get('usoEspecificoMercancia')).toBeTruthy();
    expect(component.partidas.get('justificacionBeneficio')).toBeTruthy();
    expect(component.partidas.get('observaciones')).toBeTruthy();
    expect(component.partidas.get('representacionFederal')).toBeTruthy();
  });

  it('debe limpiar los observables al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
