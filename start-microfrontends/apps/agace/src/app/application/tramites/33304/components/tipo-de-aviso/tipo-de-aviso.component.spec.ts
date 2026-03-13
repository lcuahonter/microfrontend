import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { TipoDeAvisoComponent } from './tipo-de-aviso.component';
import { Solicitud33304Store } from '../../estados/solicitud33304Store';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('TipoDeAvisoComponent', () => {
  let component: TipoDeAvisoComponent;
  let fixture: ComponentFixture<TipoDeAvisoComponent>;
  let solicitud33304StoreMock: any;
  let solicitud33304QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    solicitud33304StoreMock = {
      actualizarEstado: jest.fn(),
    };

    solicitud33304QueryMock = {
      selectSolicitud$: of({
        cambioDocumentoUsoGoce: true,
        fusionEscisionEmpresas: false,
        reestructuracion: true,
        transportistas: false,
        BAJO_MANIFIESTO: true,
      }),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [TipoDeAvisoComponent],
      providers: [
        FormBuilder,
        { provide: Solicitud33304Store, useValue: solicitud33304StoreMock },
        { provide: Solicitud33304Query, useValue: solicitud33304QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();
  });

  it('debería crear', () => {
    fixture = TestBed.createComponent(TipoDeAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con los valores del estado', () => {
    fixture = TestBed.createComponent(TipoDeAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.formularioTipoDeAviso.value).toEqual({
      cambioDocumentoUsoGoce: true,
      fusionEscisionEmpresas: false,
      reestructuracion: true,
      transportistas: false,
      BAJO_MANIFIESTO: true,
    });
  });

  it('debería actualizar el estado en la tienda cuando se cambia un valor del formulario', () => {
    fixture = TestBed.createComponent(TipoDeAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.formularioTipoDeAviso.get('cambioDocumentoUsoGoce')?.setValue(false);
    component.setValoresStore(component.formularioTipoDeAviso, 'cambioDocumentoUsoGoce');

    expect(solicitud33304StoreMock.actualizarEstado).toHaveBeenCalledWith({
      cambioDocumentoUsoGoce: false,
    });
  });

  it('debería emitir un valor en destroyNotifier$ al destruir el componente', () => {
    fixture = TestBed.createComponent(TipoDeAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
  });
});
