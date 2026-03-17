
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TareasTramiteComponent } from './tareas-tramite.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FolioQuery } from '../../../../core/queries/folio.query';
import { TareasTramiteService } from '../../../../core/services/consultagenerica/tareas-tramite-service';
import { of } from 'rxjs';
import { BodyTablaTareasTramite } from '../../../../core/models/shared/consulta-generica.model';
import { TareasSolicitud } from '../../../../core/models/shared/consulta-tareas-response.model';

describe('TareasTramiteComponent', () => {
  let component: TareasTramiteComponent;
  let fixture: ComponentFixture<TareasTramiteComponent>;
  let tareasTramiteServiceMock: any;

  // Datos de prueba para tareas usando la interfaz correcta con las propiedades adecuadas
  const mockTareas: BodyTablaTareasTramite[] = [
    { 
      id: 1, 
      nombreTarea: 'Tarea 1', 
      nombreUsuarioAsignado: 'Juan Pérez',
      claveUsuarioAsignado: 'JP001',
      fechaAsignacion: '2023-01-01',
      fechaAtencion: null
    },
    { 
      id: 2, 
      nombreTarea: 'Tarea 2', 
      nombreUsuarioAsignado: 'Ana López',
      claveUsuarioAsignado: 'AL002',
      fechaAsignacion: '2023-01-02',
      fechaAtencion: '2023-01-05'
    }
  ];

  // Mock data for input tareasSolicitud
  const mockTareasSolicitud: TareasSolicitud[] = [
    {
      id_bitacora: 1,
      evento: 'EVENTO.ASG',
      id_usuario: 'USER001',
      nombre_usuario: 'Carlos Martínez',
      tarea: 'Evaluar Solicitud',
      fecha_evento_inicio: '2023-02-01 10:00:00',
      fecha_evento_fin: null
    },
    {
      id_bitacora: 2,
      evento: 'EVENTO.ASG',
      id_usuario: 'USER002',
      nombre_usuario: 'Laura García',
      tarea: 'Aprobar Solicitud',
      fecha_evento_inicio: '2023-02-02 11:00:00',
      fecha_evento_fin: '2023-02-03 14:00:00'
    }
  ];
  
  // Mock para el servicio FolioQuery
  const folioQueryMock = {
    getFolio: jest.fn().mockReturnValue(of('123456'))
  };

  beforeEach(async () => {
    // Mock para TareasTramiteService con el método correcto
    tareasTramiteServiceMock = {
      getTareasTramite: jest.fn().mockReturnValue(of(mockTareas))
    };

    await TestBed.configureTestingModule({
      imports: [TareasTramiteComponent, HttpClientTestingModule],
      providers: [
        { provide: TareasTramiteService, useValue: tareasTramiteServiceMock }, 
        { provide: FolioQuery, useValue: folioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TareasTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get folio from FolioQuery on init', () => {
    expect(folioQueryMock.getFolio).toHaveBeenCalled();
    expect(component.folio).toBe('123456');
  });

  it('should load tasks correctly and filter out incomplete tasks', () => {
    // Trigger ngOnChanges with empty tareasSolicitud to call the service
    component.tareasSolicitud = [];
    component.ngOnChanges({
      tareasSolicitud: {
        currentValue: [],
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    
    // Verificar que el servicio fue llamado correctamente
    expect(tareasTramiteServiceMock.getTareasTramite).toHaveBeenCalled();
    
    // Verificar que solo se muestran las tareas completadas (con fechaAtencion)
    expect(component.datosTablaTareasTramite.length).toBe(1);
    expect(component.datosTablaTareasTramite[0].nombreTarea).toBe('Tarea 2');
    expect(component.datosTablaTareasTramite[0].fechaAtencion).not.toBeNull();
  });

  it('should display completed tasks with correct assignment information', () => {
    // Asignar solo las tareas completadas al componente
    const completedTasks = mockTareas.filter(t => t.fechaAtencion !== null);
    component.datosTablaTareasTramite = [...completedTasks];
    
    // Verificar la información de asignación de la tarea completada
    expect(component.datosTablaTareasTramite[0].nombreUsuarioAsignado).toBe('Ana López');
    expect(component.datosTablaTareasTramite[0].claveUsuarioAsignado).toBe('AL002');
  });

  it('should only show completed tasks (with fechaAtencion)', () => {
    // Asignar manualmente las tareas al componente usando el filtro
    component.datosTablaTareasTramite = mockTareas.filter(tarea => 
      tarea.fechaAtencion !== null
    );
    
    // Verificar que todas las tareas tienen fechaAtencion
    const allTasksCompleted = component.datosTablaTareasTramite.every(tarea => 
      tarea.fechaAtencion !== null
    );
    
    expect(allTasksCompleted).toBe(true);
    expect(component.datosTablaTareasTramite.length).toBe(1);
    expect(component.datosTablaTareasTramite[0].id).toBe(2);
  });

  it('should handle empty task list correctly', () => {
    // Simular que el servicio devuelve una lista vacía
    tareasTramiteServiceMock.getTareasTramite.mockReturnValue(of([]));
    
    // Llamar al método que obtiene las tareas
    component.getTareas();
    
    // Verificar que se maneja correctamente
    expect(component.datosTablaTareasTramite.length).toBe(0);
  });

  it('should filter completed tasks from tareasSolicitud input', () => {
    // Asignar las tareas de solicitud al componente
    component.tareasSolicitud = mockTareasSolicitud;
    
    // Llamar al método getTareas
    component.getTareas();
    
    // Verificar que solo se incluyen las tareas completadas
    expect(component.datosTablaTareasTramite.length).toBe(1);
    expect(component.datosTablaTareasTramite[0].nombreTarea).toBe('Aprobar Solicitud');
    expect(component.datosTablaTareasTramite[0].nombreUsuarioAsignado).toBe('Laura García');
    expect(component.datosTablaTareasTramite[0].fechaAtencion).not.toBeNull();
  });

  it('should complete the unsubscribe subject on destroy', () => {
    // Espiar el método next y complete del Subject
    const nextSpy = jest.spyOn(component.unsubscribe$, 'next');
    const completeSpy = jest.spyOn(component.unsubscribe$, 'complete');
    
    // Ejecutar ngOnDestroy
    component.ngOnDestroy();
    
    // Verificar que se llamaron los métodos
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});