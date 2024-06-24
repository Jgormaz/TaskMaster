import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { ActivityService } from '../activity.service';
//import { Activity } from '../activity.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Actividad, BdserviceService } from '../services/bdservice.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {


  progress = [
    { category: 'Trabajo', value: 0.5, color: '#2196F3' }, // Azul
    { category: 'Estudios', value: 0.7, color: '#F44336' }, // Rojo
    { category: 'Personal', value: 0.3, color: '#4CAF50' }, // Verde
    // Agrega más categorías aquí 
  ];

  arregloActividad: any = [{
    id: '',
    fecha: '',
    categoria: '',
    subtareas: '',
    descripcion: '',
    color: '',
    done: 0

  }]


  private activitiesSub: Subscription = new Subscription();

  activities: Actividad[] = [];

  constructor(private menuController: MenuController, private router: Router, private activityService: ActivityService, public navCtrl: NavController, private servicioBD: BdserviceService) { }


  calcOffset(value: number) {
    return 440 - (value * 440);
  }

  irADetalles(id: string) {
    this.router.navigate(['/detalle', id]);
  }

  ngOnInit() {
    this.servicioBD.dbState().subscribe(res =>{
      if(res){
        this.servicioBD.fetchActividad().subscribe(item =>{
          this.activities = item;
          console.log("actividad " + item);
        })
      }
    });
  }

  ngOnDestroy() {
  }

  actualizarActividad(activity: Actividad) {
    this.servicioBD.modificarActividad(activity.id, activity.fecha, activity.categoria, activity.subtareas, activity.descripcion, activity.color, +activity.done).then(() => {
      console.log("Actividad actualizada exitosamente");
    }).catch(error => {
      console.error('Error actualizando actividad: ', error);
    });
  }


}
