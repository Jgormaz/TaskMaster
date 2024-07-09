import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class BdserviceService {

  public database!: SQLiteObject;
  private useSQLite = true;
  private readonly actividadTableName = "actividad";
  listaActividad = new BehaviorSubject<Actividad[]>([]);
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // private readonly actividadTableName = "actividad";

  tablaActividad: string = "CREATE TABLE IF NOT EXISTS actividad (id_actividad INTEGER PRIMARY KEY autoincrement, fecha DATE, categoria VARCHAR(40) NOT NULL, subtareas TEXT NOT NULL, descripcion TEXT NOT NULL, color TEXT NOT NULL, done INTEGER);";

  //listaActividad = new BehaviorSubject([]);

  constructor(private alertController: AlertController, private toastController: ToastController, private sqLite: SQLite, private platform: Platform, private storage: Storage) {

    //this.limpiarBD();  //Sólo se descomenta para limpiar los registros de la BD

    this.platform.ready().then(() => {
      if (this.useSQLite) {
        this.initSQLite();
      } else {
        this.initLocalStorage();
      }
      
    });

  }

  private async initSQLite() {
    console.log("Creando base de datos");
    this.platform.ready().then(() => {
      this.sqLite.create({
        name: 'bdactividad.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        console.log("A crear tablas");
        this.crearTablas();
      }

      ).catch(e => {
        this.presentAlert("Error al crear DB");
      })
    })
  }

  private async initLocalStorage() {
    await this.storage.create();
    console.log("Storage creado");
    this.isDBReady.next(true);
    this.buscarActividad();
  }

  async presentToast(msj: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 3000,
      icon: 'globe'
    });

    await toast.present();
  }

  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msj,
      buttons: ['OK']
    });

    await alert.present();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  fetchActividad(): Observable<Actividad[]> {
    console.log("fetch actividad");
    return this.listaActividad.asObservable();
  }

  async crearTablas() {
    console.log("Crear tablas");
    try {
      await this.database.executeSql(this.tablaActividad, []);
      this.isDBReady.next(true);
      console.log("Ejecutando Crear tablas");
    } catch (e) {
      console.log("Error al Crear tablas");
      this.presentAlert("Error al crear tabla " + e);
    }
    //this.limpiarBD();
    this.buscarActividad();
  }

  getActividadPorId(id: number): Observable<Actividad> {
    if (this.useSQLite) {
      return from(this.database.executeSql('SELECT * FROM actividad WHERE id_actividad = ?', [id])
        .then(data => {
          console.log("getActividadPorId " + data.rows.length);
          if (data.rows.length > 0) {
            const item = data.rows.item(0);
            console.log("getActividadPorId " + item.color);
            const actividad: Actividad = {
              id: item.id_actividad,
              fecha: item.fecha,
              categoria: item.categoria,
              subtareas: item.subtareas,
              descripcion: item.descripcion,
              color: item.color,
              done: Boolean(item.done)
            };
            console.log("getActividadPorId " + actividad);
            return actividad;
          } else {
            console.log(`Actividad con id ${id} no encontrada.`);
            throw new Error(`Actividad con id ${id} no encontrada.`);
          }
        }));
    } else {
      return from(this.storage.get(this.actividadTableName).then((activities: Actividad[]) => {
        const actividad = activities.find(activity => activity.id.toString() === id.toString());
        if (actividad) {
          return actividad;
        } else {
          throw new Error(`Actividad con id ${id} no encontrada.`);
        }
      }));
    }
  }

  buscarActividad(): Promise<void> {
    console.log("buscarActividad");
    if (this.useSQLite) {
      return this.database.executeSql(`SELECT * FROM ${this.actividadTableName}`, []).then(res => {
        let items: Actividad[] = [];
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id_actividad.toString(),
            fecha: res.rows.item(i).fecha,
            categoria: res.rows.item(i).categoria,
            subtareas: res.rows.item(i).subtareas,
            descripcion: res.rows.item(i).descripcion,
            color: res.rows.item(i).color,
            done: Boolean(res.rows.item(i).done)
          });
        }
        this.listaActividad.next(items);
      });
    } else {
      console.log("buscarActividad storage");
      return this.storage.get(this.actividadTableName).then(activityList => {
        if (activityList) {
          this.listaActividad.next(activityList);
          console.log("Contenido de activityList: ", JSON.stringify(activityList, null, 2))
        }
      });
    }
  }


  insertarActividad(fecha: any, categoria: any, subtareas: any, descripcion: any, color: any, done: any): Promise<number> {
    if (this.useSQLite) {
      let data = [fecha, categoria, subtareas, descripcion, color, done];
      return this.database.executeSql('INSERT INTO actividad(fecha, categoria, subtareas, descripcion, color, done) VALUES (?, ?, ?, ?, ?, ?)', data)
        .then(() => {
          this.buscarActividad();
          // Obtiene el último id insertado en SQLite
          return this.database.executeSql('SELECT last_insert_rowid() as id', [])
            .then(data => {
              const newId = data.rows.item(0).id; // obtenemos el nuevo id
              return Number(newId);  // retornamos el nuevo ID
          });
        });
    } else {
      let newId = Date.now(); // generamos el nuevo ID basado en el timestamp
      return this.storage.get(this.actividadTableName).then((activities: Actividad[]) => {
        activities = activities || [];
        activities.push({ id: newId.toString(), fecha, categoria, subtareas, descripcion, color, done }); // convertimos el id a string
        return this.storage.set(this.actividadTableName, activities)
          .then(() => {
            this.buscarActividad();
            return newId;  // retornamos el nuevo ID
          });
      });
    }
  }

  modificarActividad(id: any, fecha: any, categoria: any, subtareas: any, descripcion: any, color: any, done: any): Promise<void> {
    if (this.useSQLite) {
      let data = [fecha, categoria, subtareas, descripcion, color, done, id];
      return this.database.executeSql('UPDATE actividad SET fecha=?, categoria=?, subtareas=?, descripcion=?, color=?, done=? WHERE id_actividad=?', data).then(res => {
        this.buscarActividad();
      });
    } else {
      return this.storage.get(this.actividadTableName).then((activities: Actividad[]) => {
        activities = activities || [];
        let index = activities.findIndex(activity => activity.id.toString() === id.toString());
        if (index >= 0) {
          activities[index] = { id, fecha, categoria, subtareas, descripcion, color, done };
          return this.storage.set(this.actividadTableName, activities).then(() => {
            this.buscarActividad();
          });
        } else {
          return Promise.resolve(); // Cuando la actividad no se encuentra, retornamos una promesa resuelta
        }
      });
    }
  }

  eliminarActividad(id: any): Promise<void> {
    if (this.useSQLite) {
      return this.database.executeSql(`DELETE FROM ${this.actividadTableName} WHERE id_actividad = ?`, [id])
        .then(_ => {
          this.buscarActividad();
        });
    } else {
      return this.storage.get(this.actividadTableName).then((activities: Actividad[]) => {
        activities = activities || [];
        this.storage.set(this.actividadTableName, activities.filter((activity: Actividad) => activity.id.toString() !== id.toString()));
        this.buscarActividad();
      });
    }
  }

  limpiarBD(): Promise<void> {
    if (this.useSQLite) {
      return this.database.executeSql(`DELETE FROM ${this.actividadTableName}`)
        .then(_ => {
          console.log("BD limpia");
          this.buscarActividad();
        });
        
    } else {
      return this.storage.remove(this.actividadTableName)
        .then(_ => {
          console.log("Storage limpio");
          this.buscarActividad();
        });
    }
  }



}


export interface Actividad {
  id: string;
  fecha: string;
  categoria: string;
  subtareas: string;
  descripcion: string;
  color: string;
  done: boolean;
}
