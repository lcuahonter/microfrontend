import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { TEXTOS } from '@ng-mf/data-access-user';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ng-titulo',
  template: '',
  standalone: true,
})
class MockTituloComponent {
  @Input() titulo: string = '';
}

@Component({
  selector: 'ng-alert',
  template: '',
  standalone: true,
})
class MockAlertComponent {
  @Input() CONTENIDO: any;
}

@Component({
  selector: 'anexar-documentos',
  template: '',
  standalone: true,
})
class MockAnexarDocumentosComponent {}


describe('PasoDosComponent', () => {
  let component: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoDosComponent], // Real component (standalone)
    })
      .overrideComponent(PasoDosComponent, {
        set: {
          imports: [
            MockTituloComponent,
            MockAlertComponent,
            MockAnexarDocumentosComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have TEXTOS property set to imported TEXTOS', () => {
    expect(component.TEXTOS).toEqual(TEXTOS);
  });
});
