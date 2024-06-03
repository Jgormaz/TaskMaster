import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../activity.service';
import { Activity } from '../activity.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  private activitiesSub: Subscription = new Subscription();
  activities: Activity[] = [];
  dateValue: string = new Date().toISOString();
  descripcionTarea = '';

  constructor(private activityService: ActivityService, public navCtrl: NavController, private router: Router) { }

  ngOnInit() {
    this.activitiesSub = this.activityService.getActivityUpdateListener()
    .subscribe((activities: Activity[]) => {
      this.activities = activities;
    });
  this.activityService.getActivities();
  }

  ngOnDestroy() {
    this.activitiesSub.unsubscribe();
  }

  categorias = [
    { nombre: 'Trabajo', color: '#2196F3' },
    { nombre: 'Estudios', color: '#F44336' },
    { nombre: 'Personal', color: '#4CAF50' },
    // definir todas las categorías y sus colores aquí...
  ];

  categoriaSeleccionada = '';
  colorSeleccionado = '';


  manejarCambioDeCategoria(event: { detail: { value: string; }; }) {
    const categoriaSeleccionada = this.categorias.find(c => c.nombre === event.detail.value);
    if (categoriaSeleccionada) {
      this.colorSeleccionado = categoriaSeleccionada.color;
      this.categoriaSeleccionada = categoriaSeleccionada.nombre;
    }
  }

  tareas: string[] = [''];  
  tareaValores: string[] = [''];

  agregarTarea() {
    this.tareas.push('');
    this.tareaValores.push('');
  }

  obtenerTareasConcatenadas() {
    return this.tareaValores.join(' | ');
  }

  actualizarTarea(index: number, value: string) {
    this.tareaValores[index] = value;
  }

  guardarTareas() {
    this.tareas = [...this.tareaValores];
  }

  agregarNuevaTarea() {
    let nuevaTarea = {
      date: this.dateValue,  // asegúrate de que esto esté en el formato correcto
      categoria: this.categoriaSeleccionada,  // usa el valor que estás guardando de tu ion-select
      subtareas: this.tareas.map(tarea => ({ titulo: tarea })),  // suponiendo que 'tareas' es un array de strings y convertimos cada Tarea en un objeto {titulo: string}
      description: this.descripcionTarea,
      color: this.colorSeleccionado,
      done: false  // puedes ajustar esto como necesites
      
    };
    this.router.navigate(['/detalle', -1]);
    this.activityService.activities.push(nuevaTarea);
  }
}




