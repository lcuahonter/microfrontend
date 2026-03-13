import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalFuncionesComponent } from './modal-funciones.component';

describe('ModalFuncionesComponent', () => {
  let component: ModalFuncionesComponent;
  let fixture: ComponentFixture<ModalFuncionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFuncionesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFuncionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
