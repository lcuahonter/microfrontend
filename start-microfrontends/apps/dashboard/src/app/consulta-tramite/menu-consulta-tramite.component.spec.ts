import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuConsultaTramiteComponent } from './menu-consulta-tramite.component';
import { ConsultaTramiteComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';


describe('ConsultaTramiteComponent', () => {
  let component: MenuConsultaTramiteComponent;
  let fixture: ComponentFixture<MenuConsultaTramiteComponent>;

  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      declarations: [  ],
      imports: [CommonModule, ConsultaTramiteComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuConsultaTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Se crea componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('se actualiza y llama al método numeroDeProcedimiento ', () => {
    const evento = { campo: 'numeroDeProcedimiento', valor: '12345' };
    component.selectedDepartamentoObj.numeroDeProcedimiento = '';
    component.procedureNumero(evento);
    expect(component.selectedDepartamentoObj.numeroDeProcedimiento).toBe('12345');
  });

  it('debe inicializar bandejaTablaDatos como un arreglo vacío', () => {
    expect(Array.isArray(component.bandejaTablaDatos)).toBe(true);
    expect(component.bandejaTablaDatos.length).toBe(0);
  });

it('debe llamar a ngOnDestroy sin errores', () => {
  expect(() => component.ngOnDestroy()).not.toThrow();
});

});
