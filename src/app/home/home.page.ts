import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { ActivityService } from '../activity.service';
import { Activity } from '../activity.service';
import { Subscription } from 'rxjs/internal/Subscription';

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

  private activitiesSub: Subscription = new Subscription();

  activities: Activity[] = [];

  constructor(private menuController: MenuController, private router: Router, private activityService: ActivityService, public navCtrl: NavController) { }


  calcOffset(value: number) {
    return 440 - (value * 440);
  }

  irADetalles(id: number) {
    this.router.navigate(['/detalle', id]);
  }


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

}
