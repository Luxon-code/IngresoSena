import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { Ingreso } from '../modelos/ingreso.model';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  constructor(private firestore: AngularFirestore) { }

  registrar(ingreso:Ingreso):Promise<any>{
    return this.firestore.collection('ingresos').add(ingreso);
  }

  listar(){
    return this.firestore.collection('ingresos').snapshotChanges();
  }

  obtenerIngreso(identificacion:string){
    return this.firestore.collection('ingresos').ref.where('identificacion','==',identificacion);
  }

  actualizar(ingreso:Ingreso){
    this.firestore.doc('ingresos/'+ingreso._id).update(ingreso);
  }

  eliminar(id:string){
    this.firestore.doc('ingresos/'+id).delete ();
  }
}
