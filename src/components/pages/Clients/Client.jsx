import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

//import './client.css'
import axios from 'axios';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal)


export const Client = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [editar, setEditar] = useState(false);
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [errorShown, setErrorShown] = useState(false);




  const agregarCliente = async () => {

    if (!nombre || !email) {
      Swal.fire({
        icon: 'error',
        title: 'Por favor, complete todos los campos',
        text: 'Los campos no pueden estar vacíos',
      });
      return;
    }
    if (!validator.isEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo electrónico inválido',
        text: 'El formato del correo electrónico es incorrecto'
      });
      return;
    }

    const clienteData = {
      name: nombre,
      email: email,
    };
    if (username && password) {
      clienteData.profiles = [
        {
          username: username,
          password: password,
        },
      ];
    }

    try {
      await axios.post('http://localhost:3080/api/clients', clienteData);

      MySwal.fire({
        position: 'top-end',
        title: "<strong>Registro exitoso!</strong>",
        icon: 'success',
        html: `<i>Cliente <strong>${nombre}</strong> fue registrado satisfactoriamente</i>`,
        timer: 5000,
      });
      // Limpiar el campos
      setNombre('');
      setEmail('');
      setUsername(''); 
      setPassword(''); 


      obtenerClientes();
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: "Oops!!",
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente mas tarde" : JSON.parse(JSON.stringify(error)).message,
      });
    }
  };

  const limpiarCampos = () => {
    setEmail("")
    setNombre("")
    setEditar(false)
  }
  const eliminarCliente = async (val) => {
    try {
      const clientName = val.name
      const confirmResult = await MySwal.fire({
        title: "<strong>Eliminar Cliente</strong>",
        html: `¿Seguro que desea eliminar a: <strong>${clientName}</strong>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      })
      if (confirmResult.isConfirmed) {
        await axios.delete(`http://localhost:3080/api/clients/${val.id}`);
        MySwal.fire({
          title: "<strong>Cliente Eliminado con Éxito</strong>",
          html: `<i>El cliente <strong>${val.name}</strong> fue eliminado</i>`,
          icon: 'success',
          timer: 2000
        });
        obtenerClientes();
      }
    } catch (error) {

      MySwal.fire({
        title: "<strong>Error al eliminar el cliente</strong>",
        html: `<i>No se pudo eliminar el cliente <strong>${val.name}</strong></i>`,
        icon: 'error',
        footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente mas tarte" : JSON.parse(JSON.stringify(error)).message
      });
    }
  }


  useEffect(() => {
    obtenerClientes();
  }, []);


  const actualizarCliente = async () => {

    if (!id || !nombre || !email) {
      Swal.fire({
        icon: 'error',
        title: 'Por favor, complete todos los campos',
        text: 'Los campos no pueden estar vacíos',
      });
      return;
    }

    try {

      await axios.patch(`http://localhost:3080/api/clients/${id}`, {
        name: nombre,
        email: email,
      });

      MySwal.fire({
        title: "<strong>Actualizado!</strong>",
        icon: 'success',
        html: <i>` Cliente <strong>{nombre}</strong> actualizado satisfactoriamente `</i>,
        timer: 2000
      });
      setNombre("");
      setEmail("");
      obtenerClientes()
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: "Oops!!",
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente mas tarte" : JSON.parse(JSON.stringify(error)).message
      });
    }
  }

  const editClient = (val) => {
    setEditar(true);


    setNombre(val.name);
    setEmail(val.email);
    setId(val.id);
  }


  const obtenerClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3080/api/clients');
      const clientesData = response.data;
      setClientes(clientesData);
      setErrorShown(false);

    } catch (error) {
      if (!errorShown) {
        Swal.fire({
          icon: 'error',
          title: 'Oops!!',
          text:
            JSON.parse(JSON.stringify(error)).message === 'Network Error'
              ? 'Intente más tarde'
              : JSON.parse(JSON.stringify(error)).message,
        });
        setErrorShown(true);
      }
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);
//TODO: CREATE A DIFERENT MODL EDIT 

  return (
    <div className='container'>
      <div className="card text-center">
        <div className="card-header">
          Gestion de Clientes
        </div>
        <div className="card-body">


          <div className="input-group mb-3">
            <span className="input-group-text blue-label" id="basic-addon1" >Nombre</span>
            <input type="text" id="nombre"
              onChange={(event) => setNombre(event.target.value)}
              className="form-control" value={nombre} placeholder="Ingrese Nombre Cliente" aria-label="Username" aria-describedby="basic-addon1" />
          </div>


          <div className="input-group mb-3">
            <span className="input-group-text blue-label" id="basic-addon1">Email</span>
            <input type="email"
              onChange={(event) => setEmail(event.target.value)}

              className="form-control" value={email} placeholder="Ingrese Email Cliente" aria-label="Username" aria-describedby="basic-addon1" />
          </div>


          {mostrarFormulario && (
            <div>
              <div className="input-group mb-3 ">
                <span className="input-group-text blue-label" id="basic-addon1">
                  Nombre de Usuario
                </span>
                <input
                  type="text"
                  onChange={(event) => setUsername(event.target.value)}
                  value={username}
                  className="form-control"
                  placeholder="Ingrese Nombre de Usuario"
                  aria-label="Nombre de Usuario"
                  aria-describedby="basic-addon1"
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text blue-label" id="basic-addon1">
                  Contraseña
                </span>
                <input
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                  className="form-control "
                  placeholder="Ingrese Contraseña"
                  aria-label="Contraseña"
                  aria-describedby="basic-addon1"
                />

              </div>
            </div>

          )}
        </div>
        <div className="card-footer text-body-secondary" >
          {
            editar ? (
              <div>
                <button id="ed" className='btn btn-primary m-1' onClick={actualizarCliente} style={{ marginRight: '20px' }}>Actualizar</button>
                <button id="cancel" className='btn btn-danger m-1' onClick={limpiarCampos} style={{ marginRight: '10px' }}>Cancelar</button>
              </div>
            ) : (
              <button id="submit" className='btn btn-success' onClick={agregarCliente} style={{ marginRight: '10px' }}>Agregar Cliente</button>
            )}

          {editar ? null : (
            <button className="btn btn-primary" onClick={() => setMostrarFormulario(true)}> Agregar Perfil</button>
          )}

        </div> <hr />




        <table className="table table-striped-columns" >
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Email</th>
              <th scope="col"></th>

            </tr>
          </thead>
          <tbody>

            {clientes.map((cliente, index) => {
              return <tr key={cliente.id}>
                <th>{index + 1}</th>
                <td>{cliente.name}</td>
                <td>{cliente.email}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button"
                      onClick={() => {
                        editClient(cliente)
                        navigate(`/client/${cliente.id}/edit`)
                      }}
                      className="btn btn-primary">
                       
                        Edit
                        
                        </button>
                    <button type="button" onClick={() => eliminarCliente(cliente)}
                      className="btn btn-danger">Delete</button>
                  </div>
                </td>
              </tr>

            })
            }



          </tbody>

        </table>
      </div>
    </div>
  )
}

export default Client;