import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioMaritimoComponent } from './inicio.component';

describe('ConsultasCaatMaritimoComponent', () => {
  let component: InicioMaritimoComponent;
  let fixture: ComponentFixture<InicioMaritimoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioMaritimoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioMaritimoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
