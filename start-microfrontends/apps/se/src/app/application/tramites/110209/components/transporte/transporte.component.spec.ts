import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransporteComponent } from './transporte.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite110209Store } from '../../estados/stores/tramite110209.store';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { TransporteService } from '../../services/transporte/transporte.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const MEDIO_DE_TRANSPORTE = 'medioDeTransporte';
const RUTA_COMPLETA = 'rutaCompleta';
const PUERTO_DE_EMBARQUE = 'puertoDeEmbarque';
const PUERTO_DE_DESEMBARQUE = 'puertoDeDesembarque';

describe('TransporteComponent', () => {
  let component: TransporteComponent;
  let fixture: ComponentFixture<TransporteComponent>;
  let storeMock: any;
  let queryMock: any;
  let serviceMock: any;

  beforeEach(async () => {
    storeMock = {
      setTramite110209: jest.fn()
    };

    queryMock = {
      selectTramite110209$: of({
        [MEDIO_DE_TRANSPORTE]: 'Aéreo',
        [RUTA_COMPLETA]: 'Ruta 1',
        [PUERTO_DE_EMBARQUE]: 'Puerto A',
        [PUERTO_DE_DESEMBARQUE]: 'Puerto B'
      })
    };

    serviceMock = {
      getMedioDeTransporte: jest.fn().mockReturnValue(of([
        { id: 1, descripcion: 'Aéreo' },
        { id: 2, descripcion: 'Marítimo' }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TransporteComponent,HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: Tramite110209Store, useValue: storeMock },
        { provide: Tramite110209Query, useValue: queryMock },
        { provide: TransporteService, useValue: serviceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario correctamente', () => {
    expect(component.transporteForm).toBeDefined();
    expect(component.transporteForm.get(MEDIO_DE_TRANSPORTE)).toBeDefined();
    expect(component.transporteForm.get(RUTA_COMPLETA)).toBeDefined();
    expect(component.transporteForm.get(PUERTO_DE_EMBARQUE)).toBeDefined();
    expect(component.transporteForm.get(PUERTO_DE_DESEMBARQUE)).toBeDefined();
  });

  it('debe asignar valores del store al formulario en getValoresStore', () => {
    component.getValoresStore();
    expect(component.transporteForm.get(MEDIO_DE_TRANSPORTE)?.value).toBe('Aéreo');
    expect(component.transporteForm.get(RUTA_COMPLETA)?.value).toBe('Ruta 1');
    expect(component.transporteForm.get(PUERTO_DE_EMBARQUE)?.value).toBe('Puerto A');
    expect(component.transporteForm.get(PUERTO_DE_DESEMBARQUE)?.value).toBe('Puerto B');
  });

  it('debe actualizar el store al llamar setValoresStore', () => {
    component.transporteForm.get(RUTA_COMPLETA)?.setValue('Nueva Ruta');
    component.setValoresStore(component.transporteForm, RUTA_COMPLETA);
    expect(storeMock.setTramite110209).toHaveBeenCalledWith({ [RUTA_COMPLETA]: 'Nueva Ruta' });
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const NEXT_SPY = jest.spyOn(component['destroyed$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});