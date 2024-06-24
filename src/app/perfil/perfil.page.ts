import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../services/apiservice.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CameraSource } from '@capacitor/camera/dist/esm/definitions';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  user: any = {};
  username: string | null = null;
  private sub?: Subscription;

  imageSource: any;

  constructor(private alertController: AlertController, private toastController: ToastController, private api: ApiserviceService, private auth: AuthService, public navCtrl: NavController) { }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });
    this.imageSource = image.webPath;
    this.auth.setImageSource(this.imageSource);
  }

    ngOnInit() {
      this.sub = this.auth.getUser().subscribe(username => {
        this.username = username;
        if (this.username) {
          this.loadUser(); 
        }
      });
      this.auth.imageSource$.subscribe(image => {
        this.imageSource = image; 
      });
    }
  
    loadUser() {
      console.log('LoadUser ' + this.username);
    
      if (this.username) {
        var usuarioObservable = this.api.getUsuarioPorUsername(this.username);
        console.log('LoadUser ' + usuarioObservable);
        usuarioObservable.subscribe({
          next: (usuario) => {
            this.user = usuario;
            console.log('LoadUser next' + this.user);
          },
          error: (error) => {
            console.error('Error obteniendo el usuario: ', error);
          }
        });
      }
    }
  
    ngOnDestroy() {
      this.sub?.unsubscribe();
    }

  async presentToast(msj: string){
    const toast = await this.toastController.create({
      message: msj,
      duration: 9000,
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



