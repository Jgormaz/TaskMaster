import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../activity.service';
//import { Activity } from '../activity.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavController } from '@ionic/angular';
import { Actividad, BdserviceService } from '../services/bdservice.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  private activitiesSub: Subscription = new Subscription();

  //actividad!: { id: string; fecha: string; categoria: string; subtareas: string; descripcion: string; color: string; done: boolean; };
  actividad: Actividad =
    {
      id: '',
      fecha: '',
      categoria: '',
      subtareas: '',
      descripcion: '',
      color: '',
      done: false
    }
  listaSubtareas: string[] = [];

  categories = ['Trabajo', 'Estudios', 'Personal', 'Salud', 'Ocio'];



  constructor(private router: Router, private route: ActivatedRoute, private activityService: ActivityService, public navCtrl: NavController, private servicioBD: BdserviceService) {


  }


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        const id = Number(paramMap.get('id'));
        console.log("Detalle " + id);
        if (id) {
          this.servicioBD.getActividadPorId(id).subscribe({
            next: actividadFromDB => {
              this.actividad = actividadFromDB;
              console.log("Actividad " + actividadFromDB);
              this.listaSubtareas = this.actividad.subtareas.split('|');
              console.log("Subtareas " + this.listaSubtareas);
            },
            error: err => {
              console.error('Error obteniendo la actividad: ', err);
            }
          });
        }
      } else {
        // Redirige a otra página si no hay un 'id' en los params, o llena los campos en duro.
        this.actividad = {
          id: '0',
          descripcion: 'Desayuno',
          categoria: 'Personal',
          color: '#4CAF50',
          subtareas: '',
          done: false,
          fecha: new Date().toLocaleDateString() // usa la fecha actual, o cualquier otra que prefieras
          // Agrega todos los campos adicionales que pueda necesitar tu actividad.
        };
        this.listaSubtareas = [];
      }
    });
  }

  actualizarActividad() {
    // if (this.actividad.done) { // Si actividad.done es true, actualiza la base de datos
    this.servicioBD.modificarActividad(this.actividad.id, this.actividad.fecha, this.actividad.categoria, this.actividad.subtareas, this.actividad.descripcion, this.actividad.color, +this.actividad.done).then(() => {
      console.log("Actividad actualizada exitosamente");
    }).catch(error => {
      console.error('Error actualizando actividad: ', error);
    });
    //}
  }

}



