import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarCorreoElectronicoComponent } from './modificar-correo-electronico.component';

describe('ModificarCorreoElectronicoComponent', () => {
  let component: ModificarCorreoElectronicoComponent;
  let fixture: ComponentFixture<ModificarCorreoElectronicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarCorreoElectronicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarCorreoElectronicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
