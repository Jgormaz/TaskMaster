import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../activity.service';
import { Activity } from '../activity.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  private activitiesSub: Subscription = new Subscription();

  actividad!: { date: string; categoria: string; subtareas: ({ titulo: string; test?: undefined; } | { test: string; titulo?: undefined; })[]; description: string; color: string; done: boolean; };
  // Datos de la actividad en duro
  activity = {
    id: 1,
    description: 'Estudiar para el examen',
    date: '2022-12-25T13:00:00',
    tasks: [
      { title: 'Leer los capítulos de 2 a 5' },
      { title: 'Resolver los ejercicios propuestos' },
      { title: 'Revisar resumen de contenidos' }
    ],
    category: 'Estudios',
    done: false,
    color: '#4caf50' // verdoso
  };

  activities = [
    { date: '2024-06-03T08:00:00', categoria: 'Personal', subtareas: [{ titulo: 'preparar' }, { titulo: 'comer' }], description: 'Desayunar', color: '#4CAF50', done: true },
    { date: '2024-06-03T09:00:00', categoria: 'Trabajo', subtareas: [{ titulo: 'sin subtareas' }], description: 'Reunión de equipo', color: '#2196F3', done: true },
    { date: '2024-06-03T13:00:00', categoria: 'Personal', subtareas: [{ titulo: 'preparar' }, { titulo: 'comer' }], description: 'Almuerzo', color: '#4CAF50', done: false },
    { date: '2024-06-03T18:00:00', categoria: 'Estudios', subtareas: [{ titulo: 'ppt' }, { titulo: 'app' }, { test: 'test' }], description: 'Prueba App Móviles', color: '#F44336', done: false },
    // Añade más actividades aquí
  ];

  categories = ['Trabajo', 'Estudios', 'Personal', 'Salud', 'Ocio'];



  constructor(private router: Router, private route: ActivatedRoute, private activityService: ActivityService, public navCtrl: NavController) {


  }

  ngOnInit() {


    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        let id = paramMap.get('id');
        if (id !== null) { // Agrega esta verificación
          this.actividad = this.activityService.getActivity(+id); 
        }
      } else {
        // Redirige a otra página si no hay un 'id' en los params.
      }
    });
    
  }



}



