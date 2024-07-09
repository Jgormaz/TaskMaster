import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../activity.service';
//import { Activity } from '../activity.service';
//import { Subscription } from 'rxjs/internal/Subscription';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BdserviceService } from '../services/bdservice.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  //private activitiesSub: Subscription = new Subscription();
  //activities: Activity[] = [];
  dateValue: string = new Date().toISOString();
  descripcionTarea = '';

  constructor(private activityService: ActivityService, public navCtrl: NavController, private router: Router, private servicioBD: BdserviceService) { }

  ngOnInit() {
    /*this.activitiesSub = this.activityService.getActivityUpdateListener()
    .subscribe((activities: Activity[]) => {
      this.activities = activities;
    });
  this.activityService.getActivities();*/
  }

  ngOnDestroy() {
    //this.activitiesSub.unsubscribe();
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
      date: this.dateValue,
      categoria: this.categoriaSeleccionada,
      subtareas: this.tareaValores.join('|'),
      description: this.descripcionTarea,
      color: this.colorSeleccionado,
      done: false
    };
    console.log("Insertar tarea ...");
    console.log("Categoría ... [" + this.categoriaSeleccionada + "]");
    if (this.categoriaSeleccionada != "") {
      this.servicioBD.insertarActividad(nuevaTarea.date, nuevaTarea.categoria, nuevaTarea.subtareas, nuevaTarea.description, nuevaTarea.color, +nuevaTarea.done).then(newId => {
        // ahora 'newId' es el ID del nuevo registro insertado
        console.log("Tarea insertada " + newId);
        this.router.navigate(['/detalle', newId]);
      }).catch(error => {
        console.error('Error guardando actividad: ', error);

        // Mostrar error al usuario 
      });
    }
    else {
      this.router.navigate(['/detalle']);
    }
  }


}




