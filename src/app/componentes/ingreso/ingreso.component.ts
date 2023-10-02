import { Component,OnInit } from '@angular/core';
import { FormGroup,Validators,FormControl } from '@angular/forms';
import { IngresoService } from 'src/app/servicios/ingreso.service';
import { Ingreso } from 'src/app/modelos/ingreso.model';
import { Location } from '@angular/common';
import swal from'sweetalert2';
@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {
  public frmIngreso!:FormGroup;
  public identificacion:string='';
  public id!:string;
  listaIngresos:any[] = [];
  constructor(private location:Location,
    private _ingresoService:IngresoService,){
    }

  registrar(frmIngresoValue:any){
    if(this.frmIngreso.valid){
      const ingreso:Ingreso = {
        identificacion: frmIngresoValue.txtIdentificacion,
        nombre: frmIngresoValue.txtNombre,
        tipo: frmIngresoValue.cbTipo,
        fechaHoraIngreso: new Date(),
        marcaComputador:frmIngresoValue.cbMarca,
        serialComputador: frmIngresoValue.txtSerial,
        fechaHoraSalida: new Date(),
        estado: 'Ingreso',
      }
      this._ingresoService.registrar(ingreso).then(
        (resultado)=>{
          console.log(resultado);
          swal.fire({
            title: 'Registrar Ingreso',
            text: "Se ha registrado el ingreso correctamente",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ok',
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload()
              this.frmIngreso.reset()
            }
          })
        },error=>{
          console.log(error);
          swal.fire("Registrar Ingreso","Problemas al registrar el ingreso","error")
        }
      )
    }else{
      swal.fire("Registrar Ingreso","Faltan Datos","warning")
    }
  }

  consultarPorIdentificacion(){
    this.identificacion = this.frmIngreso.value.txtIdentificacion;
    console.log(this.identificacion); 
    this._ingresoService.obtenerIngreso(this.identificacion).get().then(
      resultado => {
        if(!resultado.empty){
          resultado.forEach((doc) => {
            console.log(doc.id,"=>",doc.data());
            this.id = doc.id;
            this.frmIngreso.get("txtNombre")?.setValue(doc.get("nombre"))
            this.frmIngreso.get("txtSerial")?.setValue(doc.get("serialComputador"))
            this.frmIngreso.get("cbTipo")?.setValue(doc.get("tipo"))
            this.frmIngreso.get("cbMarca")?.setValue(doc.get("marcaComputador"))
          });
        }else{
          swal.fire("Consultar","No hay registro con esa identificacion","warning")
        }
      },error=>{
        console.log(error);
      }
    )
  }
  eliminar(){
    if(!this.identificacion){
      swal.fire("Eliminar","primero consulte para eliminar","warning")
    }else{
      swal.fire({
        title: 'Eliminar',
        text: "Esta seguro que quiere elminar el ingreso",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this._ingresoService.eliminar(this.id)
          swal.fire({
            title: 'Eliminar',
            text: "Ingreso Eliminado",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ok',
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload()
              this.frmIngreso.reset()
              this.identificacion = ""
            }
          })
        }
      })
    }
  }

  actualizar(frmIngresoValue:any){
    if(!this.identificacion){
      swal.fire("Actualizar","primero consulte para actualizar","warning")
    }else{
      if(this.frmIngreso.valid){
        const ingreso:Ingreso = {
          _id: this.id,
          identificacion: frmIngresoValue.txtIdentificacion,
          nombre: frmIngresoValue.txtNombre,
          tipo: frmIngresoValue.cbTipo,
          fechaHoraIngreso: new Date(),
          marcaComputador:frmIngresoValue.cbMarca,
          serialComputador: frmIngresoValue.txtSerial,
          fechaHoraSalida: new Date(),
          estado: 'Ingreso',
        }
        this._ingresoService.actualizar(ingreso)
        swal.fire({
          title: 'Actualizar',
          text: "Ingreso Actualizado",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'ok',
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload()
            this.identificacion = ""
          }
        })
      }else{
        swal.fire("Actualizar Ingreso","Faltan Datos","warning")
      }
    }
  }
   listar(){
      this._ingresoService.listar().subscribe((result) =>{
        result.forEach(doc => {
          console.log(doc.payload.doc.data())
          this.listaIngresos.push(doc.payload.doc.data())
        });
      })
   }
  ngOnInit(): void {
    this.listar()
    this.frmIngreso = new FormGroup({
      txtIdentificacion:new FormControl('',[Validators.required]),
      txtNombre:new FormControl('',[Validators.required,Validators.maxLength(60)]),
      txtSerial:new FormControl('',[Validators.required]),
      cbTipo:new FormControl('',[Validators.required]),
      cbMarca:new FormControl('',[Validators.required]),
    });
  }
}
