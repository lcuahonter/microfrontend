import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelInmuebleComponent } from './datos-del-inmueble.component';
import { FormBuilder } from '@angular/forms';
import { DatosDelInmueble104Store } from '../../../../core/estados/tramites/tramite104.store';
import { DatosDelInmueble104Query } from '../../../../core/queries/tramite104.query';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosDelInmuebleComponent', () => {
  let componente: DatosDelInmuebleComponent;
  let fixture: ComponentFixture<DatosDelInmuebleComponent>;
  let formularioTienda: DatosDelInmueble104Store;
  let formularioConsulta: DatosDelInmueble104Query;

  const FORMULARIO_EXPORTACION = { tipoPrograma: '1', folioAutorizacion: '12345' };
  const FORMULARIO_DIRECCION = { calle: 'Main St', numeroExterior: '100' };

  beforeEach(async () => {
    formularioTienda = {
      setFomentoExportacion: jest.fn(),
      setDireccion: jest.fn()
    } as Partial<DatosDelInmueble104Store> as DatosDelInmueble104Store;

    formularioConsulta = {
      fomentoExportacion$: of(FORMULARIO_EXPORTACION),
      direccion$: of(FORMULARIO_DIRECCION)
    } as Partial<DatosDelInmueble104Query> as DatosDelInmueble104Query;

    await TestBed.configureTestingModule({
      imports: [DatosDelInmuebleComponent, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: DatosDelInmueble104Store, useValue: formularioTienda },
        { provide: DatosDelInmueble104Query, useValue: formularioConsulta }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelInmuebleComponent);
    componente = fixture.componentInstance;
    
    componente['consultaState'] = {
    procedureId: 'ABC123',
    parameter: 'param',
    department: 'dep',
    folioTramite: 'FT-001',
    tipoDeTramite: 'tipo',
    estadoDeTramite: 'estado',
    readonly: false,
    create: true,
    update: true,
    consultaioSolicitante: null
  };


    fixture.detectChanges();
  });

  it('debería crear el componente', (): void => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar los formularios correctamente', (): void => {
    expect(componente.fomentoExportacionForm).toBeDefined();
    expect(componente.formularioDireccion).toBeDefined();
  });

  it('debería establecer los valores de Akita en los formularios', (): void => {
    expect(componente.fomentoExportacionForm.value).toEqual(FORMULARIO_EXPORTACION);
    expect(componente.formularioDireccion.value.calle).toBe('Main St');
  });

  it('debería emitir el evento cerrarClicado al llamar cerrarModal', (): void => {
    jest.spyOn(componente.cerrarClicado, 'emit');
    componente.cerrarModal();
    expect(componente.cerrarClicado.emit).toHaveBeenCalled();
  });

  it('debería actualizar la tienda Akita cuando los valores del formulario cambien', (): void => {
    componente.fomentoExportacionForm.patchValue({ tipoPrograma: '2' });
    expect(formularioTienda.setFomentoExportacion).toHaveBeenCalledWith({ tipoPrograma: '2', folioAutorizacion: '12345' });

    componente.formularioDireccion.patchValue({ calle: 'New Street' });
    expect(formularioTienda.setDireccion).toHaveBeenCalledWith(expect.objectContaining({ calle: 'New Street' }));
  });
});
