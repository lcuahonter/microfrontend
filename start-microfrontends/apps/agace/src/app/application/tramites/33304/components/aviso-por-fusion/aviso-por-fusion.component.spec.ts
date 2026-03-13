import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoPorFusionComponent } from './aviso-por-fusion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Solicitud33304Store } from '../../estados/solicitud33304Store';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { InputFechaComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component } from '@angular/core';


@Component({
  selector: 'app-datos-empresas-fusionadas',
  standalone: true,
  template: ''
})
class MockDatosEmpresasFusionadasComponent {}

describe('AvisoPorFusionComponent', () => {
  let component: AvisoPorFusionComponent;
  let fixture: ComponentFixture<AvisoPorFusionComponent>;
  let solicitudStoreMock: any;
  let solicitudQueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    solicitudStoreMock = {
      actualizarEstado: jest.fn(),
    };

    solicitudQueryMock = {
      selectSolicitud$: of({}),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        InputFechaComponent,
        InputRadioComponent,
        TituloComponent,
        AvisoPorFusionComponent,               
        MockDatosEmpresasFusionadasComponent    
      ],
      providers: [
        { provide: Solicitud33304Store, useValue: solicitudStoreMock },
        { provide: Solicitud33304Query, useValue: solicitudQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisoPorFusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores del store', () => {
    expect(component.formularioAvisoFusion).toBeDefined();
    expect(component.formularioAvisoFusion.get('avisoDeOperacion')?.value).toBe('');
  });

  it('debería actualizar el store cuando se llama setValoresStore()', () => {
    component.formularioAvisoFusion.get('rfc')?.setValue('TEST-RFC');
    component.setValoresStore(component.formularioAvisoFusion, 'rfc');
    expect(solicitudStoreMock.actualizarEstado).toHaveBeenCalledWith({ rfc: 'TEST-RFC' });
  });

  it('debería actualizar la fecha correctamente', () => {
    component.actualizarFecha('2025-06-15', 'fechaFusioneEfecto');
    expect(component.formularioAvisoFusion.get('fechaFusioneEfecto')?.value).toBe('2025-06-15');
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
