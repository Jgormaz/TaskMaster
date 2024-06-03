import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.page.html',
  styleUrls: ['./inscripcion.page.scss'],
})
export class InscripcionPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  continuar() {
    this.router.navigate(['/home']);
  }
  
  irALogin() {
    this.router.navigate(['/login']);
  }

}
