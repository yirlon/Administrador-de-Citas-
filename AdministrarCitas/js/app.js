//Selectores de etiquetas
const mascotaInput = document.querySelector("#mascota")
const propietarioInput = document.querySelector("#propietario")
const telefonoInput = document.querySelector("#telefono")
const fechaInput = document.querySelector("#fecha")
const horaInput = document.querySelector("#hora")
const sintomasInput = document.querySelector("#sintomas")
const formulario = document.querySelector('#nueva-cita') 
const contenedorCitas = document.querySelector("#citas")  

let editando;
//Objeto global
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}
function eventos(){
    mascotaInput.addEventListener("input",datosCitas)
    propietarioInput.addEventListener("input",datosCitas)
    telefonoInput.addEventListener("input",datosCitas)
    fechaInput.addEventListener("input",datosCitas)
    horaInput.addEventListener("input", datosCitas)
    sintomasInput.addEventListener("input", datosCitas)
    formulario.addEventListener("submit", nuevaCita)
}
eventos()
//Clase para la funcionalidad
class Clientes {
    constructor(){
        this.citas = [] 
    }
    agregarCliente( cita ){ 
        this.citas = [...this.citas, cita] 
    }
    editarCita( citaActualizada ){
         this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id) 
    }
}
//Clase Interfaz de Usuario
class Ui {
    mostrarError(mensaje, tipo){
        const duplicado = document.querySelector(".duplicado")
        if (!duplicado){
        const contenido = document.querySelector('#contenido')
        const mensajeAviso = document.createElement('div')
        mensajeAviso.classList.add("text-center", "alert", 'd-block', 'col-12', 'duplicado')
        mensajeAviso.textContent = mensaje
        if (tipo === 'error'){
            mensajeAviso.classList.add('alert-danger')
        }else{
            mensajeAviso.classList.add('alert-success')
        }
        contenido.insertBefore(mensajeAviso, document.querySelector('.agregar-cita'))
        setTimeout( () =>{
            mensajeAviso.remove()
        }, 2000)
        }
    }
    imprimirCliente( {citas} ){  
        this.limpiarHtml() 
        citas.forEach(element => { 
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = element
            const divCita = document.createElement('div') 
            divCita.classList.add("cita", "p-3")
            divCita.dataset.id = id
            const mascotaParrafo = document.createElement('h2'); 
            mascotaParrafo.classList.add("card-title", "font-weight-bolder")
            mascotaParrafo.textContent = mascota   
            const propietarioParrafo = document.createElement("p")
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder"> Propietario: ${ propietario }</span>`
            const telefonoParrafo = document.createElement("p")
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: ${ telefono }</span>`
            const fechaParrafo = document.createElement("p")
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: ${ fecha }</span>`
            const horaParrafo = document.createElement("p")
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: ${ hora }</span>`
            const sintomaParrafo = document.createElement("p")
            sintomaParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: ${ sintomas }</span>`
            //añadir botón de eliminar dinámicamente
            const btnEliminar = document.createElement("button") 
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar';
   
            btnEliminar.onclick =()=>eliminarCita(id)
            const btnEditar = document.createElement("button") 
            btnEditar.classList.add("btn", "btn-info")
            btnEditar.innerHTML = 'Editar';

            //añadir botón de editar dinámicamente
            btnEditar.onclick = () => cargarEdicion(element)
            divCita.appendChild(mascotaParrafo)
            divCita.appendChild(propietarioParrafo)
            divCita.appendChild(telefonoParrafo)
            divCita.appendChild(fechaParrafo)
            divCita.appendChild(horaParrafo)
            divCita.appendChild(sintomaParrafo)
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)
            contenedorCitas.appendChild(divCita) 
        });         
    }
    //Evitar duplicados
    limpiarHtml(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)

        }
    }
}
//instancias de clases
const administrarCitas = new Clientes()  
const ui = new Ui() 

function datosCitas(e){
    citaObj[e.target.name] = e.target.value                                             
}
function nuevaCita(e){
    e.preventDefault();
    const vacio = !Object.values(citaObj).every(cita => cita !=='');
    if ( vacio ){
        ui.mostrarError("Todos los campos se requieren", "error");
        return;
    }
    if (editando){
        administrarCitas.editarCita({...citaObj}) 
        ui.mostrarError("Edición hecha correctamente", "success")
        formulario.querySelector('button[type="submit"]').textContent = "Crear Cita"
        editando = false 
    }else{   
            citaObj.id = Date.now()
            administrarCitas.agregarCliente( {...citaObj} ) 
            ui.mostrarError("Agregado correctamente", "success") 
    }
    ui.imprimirCliente(administrarCitas);
    formulario.reset()
    reiniciarObjeto()
}
function reiniciarObjeto(){
    citaObj.mascota = '' 
    citaObj.propietario = ''
    citaObj.telefono = ''
    citaObj.hora = ''
    citaObj.fecha = ''
    citaObj.sintomas = ''
}
function eliminarCita(id){
    administrarCitas.eliminarCita(id);
    ui.mostrarError("La Cita se eliminó correctamente", "success")
    ui.imprimirCliente( administrarCitas ) 
}
function cargarEdicion(cita){  
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita
    //Escribir HTML
    mascotaInput.value = mascota
    propietarioInput.value = propietario
    telefonoInput.value = telefono
    fechaInput.value = fecha
    horaInput.value = hora
    sintomasInput.value = sintomas
    //cambiar valor editando
    editando = true
    //cambia el boton en edición
    formulario.querySelector('button[type="submit"]').textContent = "Guardar cambios"  
    //LLenar objeto
    citaObj.mascota = mascota
    citaObj.propietario = propietario
    citaObj.telefono = telefono
    citaObj.hora = hora
    citaObj.fecha = fecha
    citaObj.sintomas = sintomas
    citaObj.id = id
}


 























