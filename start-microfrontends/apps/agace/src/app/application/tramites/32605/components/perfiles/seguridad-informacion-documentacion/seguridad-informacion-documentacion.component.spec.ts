import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadInformacionDocumentacionComponent } from './seguridad-informacion-documentacion.component';

describe('SeguridadInformacionDocumentacionComponent', () => {
  let component: SeguridadInformacionDocumentacionComponent;
  let fixture: ComponentFixture<SeguridadInformacionDocumentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguridadInformacionDocumentacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguridadInformacionDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });
});
