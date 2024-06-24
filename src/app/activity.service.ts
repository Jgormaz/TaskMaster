

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
  
@Injectable({
  providedIn: 'root'
})
export class ActivityService {  //Esta clase se reemplazó por BdserviceService
    activities = [
    { date: '2024-06-03T08:00:00', categoria: 'Personal', subtareas: 'preparar|comer', description: 'Desayunar', color: '#4CAF50', done: true },
    { date: '2024-06-03T09:00:00', categoria: 'Trabajo', subtareas: 'sin subtareas',description: 'Reunión de equipo', color: '#2196F3', done: true },
    { date: '2024-06-03T13:00:00', categoria: 'Personal', subtareas: 'preparar|comer',description: 'Almuerzo', color: '#4CAF50', done: false },
    { date: '2024-06-03T18:00:00', categoria: 'Estudios', subtareas: 'pp|app|test',description: 'Prueba App Móviles', color: '#F44336', done: false },
    // Añade más actividades aquí
  ];

  // crea un nuevo Subject que emite el valor de "activities"
  private activitiesUpdated = new Subject<Activity[]>();

  constructor() { }

  getActivities() {
    // emite el valor actual de "activities"
    this.activitiesUpdated.next([...this.activities]);
  }

  getActivityUpdateListener() {
    // retorna el observable para suscribirse fuera del servicio
    return this.activitiesUpdated.asObservable();
  }

  // Agrega un método para agregar una actividad y luego emite el nuevo valor de "activities"
  addActivity(activity: Activity) {
    this.activities.push(activity);
    this.activitiesUpdated.next([...this.activities]);
  }

  getActivity(i: number): Activity {
    if (i === -1) {
      return this.activities[this.activities.length - 1];
    }
    return this.activities[i];
}
}


export interface SubTask {
  titulo: string;
}

export interface Activity {
  date: string;
  categoria: string;
  subtareas: string;
  description: string;
  color: string;
  done: boolean;
}