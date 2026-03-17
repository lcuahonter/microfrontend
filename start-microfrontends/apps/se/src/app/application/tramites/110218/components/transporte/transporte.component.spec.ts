import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransporteComponent } from './transporte.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite110218Store } from '../../estados/tramites/tramite110218.store';
import { Tramite110218Query } from '../../estados/queries/tramite110218.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TransporteComponent', () => {
  let component: TransporteComponent;
  let fixture: ComponentFixture<TransporteComponent>;
  let mockStore: any;
  let mockQuery: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockStore = {
      setTramite110218State: jest.fn()
    };
    mockQuery = {
      selectTramite110218State$: of({
        puertodeEmbarque: 'Yokohama',
        puertodeDesembarque: 'Manzanillo',
        puertodeTransito: 'Honolulu',
        nombredelaEmbarcacion: 'Nippon Maru',
        numerodeVuelo: '12345'
      })
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [TransporteComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite110218Store, useValue: mockStore },
        { provide: Tramite110218Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores de estadoSeleccionado', () => {
    component.estadoSeleccionado = {
      puertodeEmbarque: 'Kobe',
      puertodeDesembarque: 'Lázaro Cárdenas',
      puertodeTransito: 'San Diego',
      nombredelaEmbarcacion: 'Yamato',
      numerodeVuelo: '67890'
    } as any;
    component.inicializarFormulario();
    expect(component.detallestransporte.get('puertodeEmbarque')?.value).toBe('Kobe');
    expect(component.detallestransporte.get('puertodeDesembarque')?.value).toBe('Lázaro Cárdenas');
    expect(component.detallestransporte.get('puertodeTransito')?.value).toBe('San Diego');
    expect(component.detallestransporte.get('nombredelaEmbarcacion')?.value).toBe('Yamato');
    expect(component.detallestransporte.get('numerodeVuelo')?.value).toBe('67890');
  });

  it('debería habilitar el formulario si esSoloLectura es falso', () => {
    component.inicializarFormulario();
    component.esSoloLectura = false;
    component.habilitarDeshabilitarFormulario();
    expect(component.detallestransporte.enabled).toBe(true);
  });

  it('debería deshabilitar el formulario si esSoloLectura es verdadero', () => {
    component.inicializarFormulario();
    component.esSoloLectura = true;
    component.habilitarDeshabilitarFormulario();
    expect(component.detallestransporte.disabled).toBe(true);
  });

  it('debería actualizar el store con setValorStore', () => {
    component.inicializarFormulario();
    component.detallestransporte.get('puertodeEmbarque')?.setValue('Nagoya');
    component.setValorStore(component.detallestransporte, 'puertodeEmbarque');
    expect(mockStore.setTramite110218State).toHaveBeenCalledWith({ puertodeEmbarque: 'Nagoya' });
  });

  it('debería actualizar estadoSeleccionado al llamar getValorStore', () => {
    component.getValorStore();
    expect(component.estadoSeleccionado).toEqual(expect.objectContaining({
      puertodeEmbarque: 'Yokohama',
      puertodeDesembarque: 'Manzanillo'
    }));
  });

  it('debería limpiar destroyed$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});