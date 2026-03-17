import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { BitacoraComponent } from './bitacora.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { Bitacora } from '../../../../shared/models/bitacora.model';

describe('BitacoraComponent', () => {
  let fixture;
  let component: BitacoraComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        BitacoraComponent
      ],
      declarations: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BitacoraComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should execute #ngOnDestroy()', () => {
    component.destroyNotifier$ = {
      next: jest.fn(),
      unsubscribe: jest.fn()
    } as any;

    component.ngOnDestroy();

    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

  it('should fetch bitacora data in ngOnInit', () => {
    const mockData: Bitacora[] = [{
      tipoModificacion: 'mockTipo',
      fechaModificacion: 'mockFetch',
      valoresAnteriores: 'mockValoresAnteriores',
      valoresNuevos: 'mockValoresNuevos'
    }];

    const mockResponse = {
      mensaje: 'OK',
      datos: mockData
    };

    jest.spyOn(component.solicitudService, 'obtenerBitacora').mockReturnValue(observableOf(mockResponse));
  });
});
