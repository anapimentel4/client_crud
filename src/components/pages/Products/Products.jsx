import React, { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';


import Swal from 'sweetalert2';

import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const Products = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [productos, setProductos] = useState([]);
  const [productId, setProductId] = useState("");
  const [editar, setEditar] = useState(false);
  const [sku, setSku] = useState("")
  const [errorShown, setErrorShown] = useState(false);



  const editProduct = (val) => {
    setEditar(true);
    setProductName(val.productName);
    setPrice(val.price);
    setProductId(val.id);
    setSku(val.sku);
  };

  const eliminarProducto = async (product) => {
    try {
      const confirmResult = await MySwal.fire({
        title: "<strong>Eliminar el Producto</strong>",
        html: `¿Seguro que desea eliminar el Producto de: <strong>${product.productName}</strong>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
       // cancelbuttonTex2: 'would you like t'
      });

      if (confirmResult.isConfirmed) {
        await axios.delete(`http://localhost:3080/api/products/${product.id}`);

        MySwal.fire({
          title: "<strong>producto Eliminado con Éxito</strong>",
          html: `<i>El producto <strong>${product.productName}</strong> fue eliminado</i>`,
          icon: 'success',
          timer: 2000
        });

        obtenerProductos();
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);

      MySwal.fire({
        title: "<strong>Error al eliminar Producto</strong>",
        html: `<i>No se pudo eliminar el Producto<strong>${product.productName}</strong></i>`,
        icon: 'error',
        footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
      });
    }
  }

  const actualizarProducto = async () => {
    try {
      await axios.patch(`http://localhost:3080/api/products/${productId}`, {
        productName: productName,
        price: price,

      });

      MySwal.fire({
        title: "<strong>Producto Actualizado</strong>",
        icon: 'success',
        html: <i>Producto Actualizado satisfactoriamente</i>,
        timer: 2000
      });

      setProductName("");
      setPrice("");


      obtenerProductos();
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      MySwal.fire({
        icon: 'error',
        title: "Oops!!",
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message
      });
    }
  }

  const limpiarCampos = () => {
    setUserName("")
    setPassword("")
    setEditar(false)
  }

  const obtenerProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3080/api/products');
      const productsData = response.data;
      setProductos(productsData);
      // console.log(productsData)
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
    obtenerProductos();
  }, []);




  const agregarProducto = async () => {
    try {
      // Convertir el precio a un número
      const precioNumerico = parseFloat(price);

      if (isNaN(precioNumerico)) {
        MySwal.fire({
          icon: 'error',
          title: 'Oops!!',
          text: 'El precio debe ser un número válido.',
        });
        return;
      }

      const response = await axios.post('http://localhost:3080/api/products', {
        productName: productName, // Corregido a productname
        price: precioNumerico, // Usar el precio convertido
        sku: sku,
      });

      MySwal.fire({
        position: 'top-end',
        title: '<strong>Producto agregado!</strong>',
        icon: 'success',
        html: '<i>Producto agregado correctamente</i>',
        timer: 1000,
      });

      setProductName('');
      setPrice('');
      setSku('');


    } catch (error) {

      if (error.response && error.response.data && error.response.data.message) {
        MySwal.fire({
          icon: 'error',
          title: 'Oops!!',
          text: error.response.data.message.join(', '),
        });
      } else {
        MySwal.fire({
          icon: 'error',
          title: 'Oops!!',
          text: 'Ocurrió un error al agregar el producto. Intente nuevamente más tarde.',
        });
      }
    }
  };



  return (
    <div className='container'>
      <div className="card text-center">
        <div className="card-header">
          Gestion de Productos
        </div>
        <div className="card-body">


          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Productos</span>
            <input type="text"
              onChange={(event) => setProductName(event.target.value)}
              className="form-control" value={productName} placeholder="Ingrese el Producto" aria-label="Username" aria-describedby="basic-addon1" />
          </div>


          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Precio</span>
            <input type="number"
              onChange={(event) => setPrice(event.target.value)}

              className="form-control" value={price} placeholder="Ingrese el precio" aria-label="price" aria-describedby="basic-addon1" />
          </div>
        </div>


        <div className="card-footer text-body-secondary">
          {
            editar ?
              <div>
                <button className='btn btn-primary m-1' onClick={actualizarProducto}>Actualizar</button>
                <button className='btn btn-danger m-1' onClick={limpiarCampos}>Cancelar</button>

              </div>
              : <button className='btn btn-success' onClick={agregarProducto}>Agregar Producto</button>
          }
        </div> <hr />

        <table className="table table-striped-columns" >
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Sku</th>
              <th scope="col">Products</th>
              <th scope="col">Precio</th>

              <th scope="col"></th>

            </tr>
          </thead>


          <tbody>

            {productos.map((producto, index) => (
              <tr key={producto.id}>
                <th scope="row">{index + 1}</th>
                <td>{producto.sku}</td>
                <td>{producto.productName}</td>
                <td>{producto.price}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => editProduct(producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => eliminarProducto(producto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </div>
  )


}
export default Products;