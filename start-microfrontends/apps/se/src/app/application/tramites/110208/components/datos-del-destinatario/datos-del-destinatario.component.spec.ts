import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelDestinatarioComponent } from './datos-del-destinatario.component';

describe('DatosDelDestinatarioComponent', () => {
  let component: DatosDelDestinatarioComponent;
  let fixture: ComponentFixture<DatosDelDestinatarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosDelDestinatarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelDestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
