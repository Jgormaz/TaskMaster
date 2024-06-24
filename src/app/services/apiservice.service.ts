import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable, catchError, map, of, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  apiURL = "https://jsonplaceholder.typicode.com";

  constructor(private alertController: AlertController, private toastController: ToastController, private http: HttpClient) { }

  getUsuarios():Observable<any>{
    return this.http.get(this.apiURL + '/users/').pipe(retry(3));

  }

  getUsuarioPorUsername(username: string): Observable<any> {
    return this.getUsuarios().pipe(
      map(users => users.find((user: { username: string; }) => user.username.toLowerCase() === username.toLowerCase())),
      catchError(err => {
        console.error('Error en getUsuarioPorUsername:', err);
        return of(null);  // emite 'null' si hay un error
      })
    );
  }

  async presentToast(msj: string){
    const toast = await this.toastController.create({
      message: msj,
      duration: 3000,
      icon: 'globe'
    });

    await toast.present();
  }

  async presentAlert(msj: string){
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msj,
      buttons: ['OK']
    });
    
    await alert.present();
  }
}
