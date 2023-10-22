import React, { useEffect, useState } from 'react';
import './profile.css';
import axios from 'axios';



import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal)

export const Profile = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [editar, setEditar] = useState(false)
  const [profiles, setProfiles] = useState([]);
  const [editing, setEditing] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [errorShown, setErrorShown] = useState(false);



  const obtenerPerfiles = async () => {
    try {
      const response = await axios.get('http://localhost:3080/api/profile');
      const profilesData = response.data;
      setProfiles(profilesData);
      setErrorShown(false); // Restablecer el estado del error
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
        setErrorShown(true); // Establecer el estado del error a true
      }
    }
  };

  useEffect(() => {
    obtenerPerfiles();
  }, []); // Usar un efecto para cargar los perfiles al montar el componente


  const agregarPerfil = async () => {
    if (!userName || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Por favor, complete todos los campos',
        text: 'Los campos no pueden estar vacíos',
      });
      return;
    }
    try {
      const response = await axios.post('http://localhost:3080/api/profile', {
        username: userName,
        password: password,
      });

      MySwal.fire({
        position: 'top-end',
        title: "<strong>Registro exitoso!</strong>",
        icon: 'success',
        html: <i>` Perfil agregado correctamente `</i>,
        timer: 2000
      });

      setUserName("");
      setPassword("");

      obtenerPerfiles();
    } catch (error) {
      console.error('Error al agregar el perfil:', error);

      if (error.response && error.response.data && error.response.data.message) {

        MySwal.fire({
          icon: 'error',
          title: "Oops!!",
          text: error.response.data.message.join(', '),
        });
      } else {

        MySwal.fire({
          icon: 'error',
          title: "Oops!!",
          text: "Ocurrió un error al agregar el perfil. Intente nuevamente más tarde.",
        });
      }
    }
  }

  const limpiarCampos = () => {
    setUserName("")
    setPassword("")
    setEditar(false)
  }
  const eliminarPerfil = async (profile) => {
    try {
      const confirmResult = await MySwal.fire({
        title: "<strong>Eliminar el Perfil</strong>",
        html: `¿Seguro que desea eliminar el perfil de: <strong>${profile.username}</strong>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      });

      if (confirmResult.isConfirmed) {
        await axios.delete(`http://localhost:3080/api/profile/${profile.id}`);

        MySwal.fire({
          title: "<strong>Perfil Eliminado con Éxito</strong>",
          html: `<i>El perfil <strong>${profile.username}</strong> fue eliminado</i>`,
          icon: 'success',
          timer: 2000
        });

        obtenerPerfiles();
      }
    } catch (error) {
      console.error('Error al eliminar el perfil:', error);

      MySwal.fire({
        title: "<strong>Error al eliminar el perfil</strong>",
        html: `<i>No se pudo eliminar el perfil <strong>${profile.userName}</strong></i>`,
        icon: 'error',
        footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
      });
    }
  }

  const editarPerfil = (profile) => {
    setEditar(true)
    setEditing(true);
    setProfileId(profile.id);
    setUserName(profile.username);
    setPassword(profile.password);
  }

  const actualizarPerfil = async () => {
    try {
      await axios.patch(`http://localhost:3080/api/profile/${profileId}`, {
        username: userName,
        password: password,
      });

      MySwal.fire({
        title: "<strong>Perfil Actualizado</strong>",
        icon: 'success',
        html: <i>Perfil actualizado satisfactoriamente</i>,
        timer: 2000
      });

      setUserName("");
      setPassword("");
      setEditing(false);
      obtenerPerfiles();
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      MySwal.fire({
        icon: 'error',
        title: "Oops!!",
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
      });
    }
  }


  return (
    <div className='container'>
      <div className="card text-center">
        <div className="card-header">
          Gestion de Perfiles
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">User Name</span>
            <input
              type="text"
              onChange={(event) => setUserName(event.target.value)}
              className="form-control"
              value={userName}
              placeholder="Ingrese Nombre del Perfil"
              aria-label="User Name"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Password</span>
            <input
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              className="form-control"
              value={password}
              placeholder="Ingrese la Contraseña"
              aria-label="Password"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>

        <div className="card-footer text-body-secondary">
          {editing ? (
            <div>
              <button className='btn btn-primary m-1' onClick={actualizarPerfil}>Actualizar</button>
              <button className='btn btn-danger m-1' onClick={limpiarCampos}>Cancelar</button>
            </div>
          ) : (
            <button className='btn btn-success' onClick={agregarPerfil}>Agregar Perfil</button>
          )}
        </div>

        <hr />

        <table className="table table-striped-columns">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Contraseña</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, index) => (
              <tr key={profile.id}>
                <th>{index + 1}</th>
                <td>{profile.username}</td>
                <td>{profile.password}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <button
                      type="button"
                      onClick={() => editarPerfil(profile)}
                      className="btn btn-primary"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarPerfil(profile)}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Profile;