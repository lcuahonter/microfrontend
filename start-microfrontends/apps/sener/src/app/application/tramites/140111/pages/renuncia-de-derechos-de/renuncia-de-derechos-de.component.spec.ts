import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenunciaDeDerechosDeComponent } from './renuncia-de-derechos-de.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('RenunciaDeDerechosDeComponent', () => {
  let component: RenunciaDeDerechosDeComponent;
  let fixture: ComponentFixture<RenunciaDeDerechosDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenunciaDeDerechosDeComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RenunciaDeDerechosDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });
});
