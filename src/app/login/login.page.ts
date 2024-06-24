import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username!: string;

  constructor(private alertController: AlertController, private toastController: ToastController, private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  ingresar() {
    this.login();
    this.router.navigate(['/home']);
  }
  
  irAInscripcion() {
    this.router.navigate(['/inscripcion']);
  }

  login() {
    this.auth.setUser(this.username);
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
