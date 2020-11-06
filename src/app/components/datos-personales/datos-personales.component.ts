import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Shared } from 'src/app/app.component';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  
  @Output() cambiarVisualizacion: EventEmitter<Shared>
  datosPersonalesGroup: FormGroup;
  fileUpload: File;

  /**
   * Constructor del componente
   */
  constructor(
    private formBuilder: FormBuilder,
    private datosPersonalesService : DatosPersonalesService
  ) {
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared());
    this.datosPersonalesForm();
  }

  /**
   * Método de inicialización del componente
   */
  ngOnInit(): void {
    
  }

  subirImagenServer(files) {
    this.fileUpload = files;

    let formData = new FormData();
    formData.append("imagen", this.fileUpload[0], this.fileUpload[0].name);

    this.datosPersonalesService.setSubirImagenPerfil(formData).toPromise().then(respuesta => {
      console.log(respuesta);
    });
  }

  datosPersonalesForm() {
    this.datosPersonalesGroup = this.formBuilder.group({
      nombre: [''],
      apellidos: [''],
      puesto: [''],
      nacimiento: [''],
      telefono: [''],
      email: [''],
      direccion: [''],
      poblacion: [''],
      provincia: [''],
      codigoPostal: [''],
      descripcionBreve: [''],
      descripcionSobreMi: ['']
    });
  }

}
