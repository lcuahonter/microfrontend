import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { RegistroParaLaComponent } from './registro-para-la.component';
import { Tramite301Store } from '../../../../core/estados/tramites/tramite301.store';
import { Tramite301Query } from '../../../../core/queries/tramite301.query';

describe('RegistroParaLaComponent', () => {
  let component: RegistroParaLaComponent;
  let fixture: ComponentFixture<RegistroParaLaComponent>;
  let store: Tramite301Store;
  let query: Tramite301Query;

  const mockSolicitudState = {
    registro: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroParaLaComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        {
          provide: Tramite301Store,
          useValue: {
            setRegistro: jest.fn(),
          },
        },
        {
          provide: Tramite301Query,
          useValue: {
            selectSolicitud$: of(mockSolicitudState),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroParaLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); 
  });

  it('should initialize the component and set default values', () => {
    expect(component.indice).toBe(1);
    expect(component.registroOptions).toEqual([
      { id: 1, descripcion: 'Si' },
      { id: 2, descripcion: 'No' },
    ]);
    expect(component.pasos).toEqual([]);
    expect(component.datosPasos.nroPasos).toBe(0); 
  });

  it('should call getRegistro() during ngOnInit()', () => {
    const spy = jest.spyOn(component, 'getRegistro');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set TEXTOS constants correctly', () => {
    expect(component.TEXTOS).toBeTruthy(); 
  });

});