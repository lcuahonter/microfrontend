import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import {
  CatalogoSelectComponent,
  InputFechaComponent,
  InputRadioComponent,
  ConsultaioQuery,
  TituloComponent
} from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { Solocitud220503Service } from '../../services/service220503.service';

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let mockService: any;
  let mockQuery: any;

  const mockCatalogo = [{ id: 1, descripcion: 'Banco1' }];
  const mockFormularioPago = {
    exentoPago: 'Si',
    justificacion: '',
    claveReferencia: '',
    cadenaDependencia: '',
    banco: '',
    llavePago: '',
    fechaPago: '',
    importePago: ''
  };

  beforeEach(async () => {
    mockService = {
      obtenerDatos: jest.fn().mockReturnValue(of({ formularioPago: mockFormularioPago })),
      obtenerDetallesDelCatalogo: jest.fn().mockReturnValue(of({ data: mockCatalogo })),
      actualizarFormaValida: jest.fn(),
      actualizarFormularioPago: jest.fn()
    };

    mockQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        PagoDeDerechosComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        CatalogoSelectComponent,
        InputRadioComponent,
        InputFechaComponent,
        TituloComponent,
        CommonModule
      ],
      providers: [
        { provide: Solocitud220503Service, useValue: mockService },
        { provide: ConsultaioQuery, useValue: mockQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
