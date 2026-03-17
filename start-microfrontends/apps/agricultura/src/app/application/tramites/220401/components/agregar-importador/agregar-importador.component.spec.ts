import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarImportadorComponent } from './agregar-importador.component';

describe('AgregarImportadorComponent', () => {
  let component: AgregarImportadorComponent;
  let fixture: ComponentFixture<AgregarImportadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarImportadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarImportadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('ngOnInit debe llamar a getPais y asignar el arreglo pais', () => {
    const spy = jest.spyOn(component, 'getPais');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.pais).toEqual([
      { id: 1, descripcion: 'Opción 1' },
      { id: 2, descripcion: 'Opción 1' },
    ]);
  });

  it('getPais debe asignar correctamente el arreglo pais', () => {
    component.pais = [];
    component.getPais();
    expect(component.pais.length).toBe(2);
    expect(component.pais[0].descripcion).toBe('Opción 1');
  });

  it('inputChecked("fisica") debe poner fisica en true y moral en false', () => {
    component.fisica = false;
    component.moral = true;
    component.inputChecked('fisica');
    expect(component.fisica).toBe(true);
    expect(component.moral).toBe(false);
  });

  it('inputChecked("moral") debe poner moral en true y fisica en false', () => {
    component.fisica = true;
    component.moral = false;
    component.inputChecked('moral');
    expect(component.fisica).toBe(false);
    expect(component.moral).toBe(true);
  });
});
