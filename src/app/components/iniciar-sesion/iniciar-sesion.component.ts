import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Shared } from 'src/app/app.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { salt } from 'src/environments/environment';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
// esto es para dectectar el tipo de dispositivo que se ha usado para entrar = import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./iniciar-sesion.component.css'],
})
export class IniciarSesionComponent implements OnInit {
  deviceInfo = null;

  registroUsuario: FormGroup;
  inicioSesionFormGroup: FormGroup;
  recargarPagina = window.location.reload;
  @ViewChild('content', { static: true }) content : ElementRef;
  @Output() cambiarVisualizacion: EventEmitter<Shared>
  // Referencia para cuando se vaya a enviar pass por post encriptada ==> pass = bcrypt.hashSync("Hola soy yo", salt);
  /**
   * REFERENCIA PARA LA DOBLE AUTENTICACIÓN (Introducir más adelante)
   *  this.deviceInfo = this.deviceService.getDeviceInfo();
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      const isDesktopDevice = this.deviceService.isDesktop();
   */

   /**
    * Constructor del componente
    * @param usuarioService servicio necesario para el uso de token, en caso de tenerlo, redirigir al panel en caso de no tenerlo se sigue con el proceso
    * @param modalService necesario para iniciar el modal del registro del usuario
    * @param config configuración del modal
    * @param formBuilder necesario para el formulario reactivo
    * @param toastService servicio para la creación de una notificación en caso de registro de usuario
    * @param router necesario para hacer la redirección en caso de token válido
    */
  constructor(
    private usuarioService: UsuarioService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    // esto es para dectectar el tipo de dispositivo que se ha usado para entrar = private deviceService: DeviceDetectorService
    private router : Router
    ) {
    this.usuarioService.getUserToken() != null ? this.router.navigateByUrl('/datos-personales') : null;
    this.cambiarVisualizacion = new EventEmitter();
    this.cambiarVisualizacion.emit(new Shared())
    config.backdrop = 'static'; 
    config.keyboard = false;

    this.createForm();
    this.authForm();
  }

  /**
   * Se inicia el componente preguntando si existe el usuario, si no existe salta el modal para el registro del mismo
   */
  ngOnInit(): void {
    this.usuarioService.getExisteUsuario().toPromise().then(data => {
      if (data[0].response != null) {
        this.modalService.open(this.content, { centered: true })
      }
    });

  }

  /**
   * Método para establecer los parámetros del formulario reactivo del registro del usuario
   */
  createForm() {
    this.registroUsuario = this.formBuilder.group({
      nombre: [''],
      pass: [''],
      email: ['']
    });
  }

  /**
   * Método para conectar los parámetros del formulario de inicio de sesion
   */
  authForm() {
    this.inicioSesionFormGroup = this.formBuilder.group({
      userName : [''],
      pass : ['']
    });
  }

  /**
   * Método para el registro del usuario
   */
  registrarUsuario() {
    var formNombre = document.getElementById('formularioRegistro').children[0].children[0].children[0].children[0];
    var formPass = document.getElementById('formularioRegistro').children[0].children[0].children[1].children[0];
    var formEmail = document.getElementById('formularioRegistro').children[0].children[0].children[2].children[0];
    var valido = true;
    // Comprobación email y la pass que sea fuerte

    if (this.registroUsuario.value.nombre.trim() == '') {
      formNombre.classList.add('is-invalid');
      valido = false;
    } else {
      formNombre.classList.remove('is-invalid');
      formNombre.classList.add('border-formulario');
    }

    if (this.registroUsuario.value.pass.trim() == '' || this.registroUsuario.value.pass.length < 4) {
      formPass.classList.add('is-invalid');
      valido = false;
    } else {
      formPass.classList.remove('is-invalid');
      formPass.classList.add('border-formulario');
      this.registroUsuario.value.pass = bcrypt.hashSync(this.registroUsuario.value.pass, salt);
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(this.registroUsuario.value.email)) {
      formEmail.classList.add('is-invalid');
      valido = false;
    } else {
      formEmail.classList.remove('is-invalid');
      formEmail.classList.add('border-formulario');
    }

    if (valido) {
      this.usuarioService.getExisteUsuario().toPromise().then(data => {
        if (data[0].response != null) {
          this.usuarioService.setCreateUsuario(this.registroUsuario.value)
          .toPromise()
          .then(res => {
            if (res['response'] != null) {
              this.toastService.showSuccess(res['response'], 5000);
            } else {
              this.toastService.showDanger(res['errResponse'], 5000);
            }
          }).then(() => {
            window.location.reload();
          })
          .catch(err => {
            console.log(err)
          });
        } else {
          this.toastService.showDanger("Ya existe un usuario, bórrelo y podrá registrarse de nuevo.", 5000);
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      })
    }
  }

  /**
   * Método para el login de usuario
   */
  logIn() {
    var loginIdError = document.getElementById('logInId');
    var userName = document.getElementById('username');
    var pass = document.getElementById('passWord');
    var valido = true;

    if (this.inicioSesionFormGroup.value.userName.trim() == '') {
      userName.classList.add('is-invalid');
      valido = false;
    } else {
      userName.classList.remove('is-invalid');
      userName.classList.add('border-formulario');
    }

    if (this.inicioSesionFormGroup.value.pass.trim() == '') {
      pass.classList.add('is-invalid');
      valido = false;
    } else {
      pass.classList.remove('is-invalid');
      pass.classList.add('border-formulario');
    }

    if (valido) {
      this.usuarioService.setLogIn().toPromise().then(credenciales => {
        bcrypt.compare(this.inicioSesionFormGroup.value.pass, credenciales[0]['pass'], function(err, result) {
          if (err != null) {
            loginIdError.classList.add('is-invalid');
          }

          if (result) {
            localStorage.setItem('user-token', credenciales[0]['token']);
            window.location.href = ('#/datos-personales');
          } else {
            loginIdError.classList.add('is-invalid');
          }
        });
      })
    }
  }
}
