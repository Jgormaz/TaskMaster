import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { BehaviorSubject } from 'rxjs';
import { BdserviceService } from '../services/bdservice.service';
import { ApiserviceService } from '../services/apiservice.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mockBdserviceService: { buscarActividad: { and: { returnValue: (arg0: BehaviorSubject<{ id: string; fecha: string; categoria: string; subtareas: string; descripcion: string; color: string; done: boolean; }[]>) => void; }; }; modificarActividad: any; }, mockApiserviceService;

  beforeEach(async () => {
    mockBdserviceService = jasmine.createSpyObj(['buscarActividad', 'modificarActividad']);
    mockApiserviceService = jasmine.createSpyObj(['getUsuarioPorUsername']);

    await TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [ IonicModule.forRoot() ],
      providers: [
        { provide: BdserviceService, useValue: mockBdserviceService },
        { provide: ApiserviceService, useValue: mockApiserviceService }
        // Agrega aquí si tienes otros proveedores necesarios
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockBdserviceService.buscarActividad.and.returnValue(
      new BehaviorSubject(
        [
          { id: '1', fecha: 'Fecha 1', categoria: 'Categoria 1', subtareas: 'Subtareas 1', descripcion: 'Descripcion 1', color: 'Color 1', done: true }, 
          { id: '2', fecha: 'Fecha 2', categoria: 'Categoria 2', subtareas: 'Subtareas 2', descripcion: 'Descripcion 2', color: 'Color 2', done: false }
        ]
      )
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch activities on init', () => {
    component.ngOnInit();
    expect(component.activities.length).toBe(2);
  });

  it('should update activity when actualizarActividad is called', () => {
    let sampleActivity = { id: '1', fecha: 'Fecha 1', categoria: 'Categoria 1', subtareas: 'Subtareas 1', descripcion: 'Descripcion 1', color: 'Color 1', done: true };
    component.actualizarActividad(sampleActivity);
    expect(mockBdserviceService.modificarActividad).toHaveBeenCalledWith(sampleActivity);
  });
});
