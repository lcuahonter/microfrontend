import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoDosComponent } from './paso-dos.component';
import { ToastrModule } from 'ngx-toastr';

describe('Componente PasoDos', () => {
  let componente: PasoDosComponent;
  let fixture: ComponentFixture<PasoDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoDosComponent, ToastrModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoDosComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(componente).toBeTruthy();
  });
});
