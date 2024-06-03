import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  pages = [
    { title: 'Hoy', url: '/home', icon: 'home' },
    { title: 'Categorías', url: '/categorias', icon: 'folder' },
    { title: 'Añadir tarea', url: '/agregar', icon: 'calendar' },
    { title: 'Perfil', url: '/perfil', icon: 'person' },
  ];
  constructor() {}
}
