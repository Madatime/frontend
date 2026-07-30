const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1/";

//MÉTODO HELPER PARA OBTENER LAS CABECERAS CON JWT
const getHeaders = ()=>{
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if(token){
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Método principal para manejar respuestas
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error en la petición");
    }

    // Cuando el backend responde 204 No Content, no hay JSON que convertir
    if (response.status === 204) {
        return null;
    }

    return await response.json();
};

//METODO PRINCIPAL DE PETICIONES

export const apiService = {

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
        },

        getUserRole: () => {
            return localStorage.getItem('rol');
        },

        getUserName: () => {
            return localStorage.getItem('nombre') || localStorage.getItem('username');
        },

    //METODO DE REGISTRO
    registro: async (userData) => {
        const response = await fetch(API_URL+'auth/registro',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData),
    });

    return await handleResponse(response);
    },

    //METODO DE LOGIN
    login: async(username, password) => {
        const response = await fetch(API_URL + 'auth/login' ,{
            method: 'POST',
            headers:{'Content-Type' : 'application/json'},
            body: JSON.stringify({username, password}),
        });
        const data = await handleResponse(response);
        if(data.token){
            localStorage.setItem('token', data.token),
            localStorage.setItem('username', data.username),
            localStorage.setItem('nombre', data.nombre),
            localStorage.setItem('rol', data.rol)
        }
        return data;
    },

    //METODO DE LOGOUT
    logout: () =>{
        localStorage.removeItem('token'),
        localStorage.removeItem('username'),
        localStorage.removeItem('nombre'),
        localStorage.removeItem('rol'),
        localStorage.removeItem('role')
    },



    // ---------------------------------------------------------
    // PRODUCTOS
    // ---------------------------------------------------------
    getProductos: async () => {
        const response = await fetch(
            API_URL + "productos"
        );
        return await handleResponse(response);
    },

    getProducto: async (id) => {
        const response = await fetch(
            API_URL + "productos/" + id
        );
        return await handleResponse(response);
    },

    crearProducto: async (producto) => {
        const response = await fetch(
            API_URL + "productos",
            {
                method: "POST",
                body: JSON.stringify(producto),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarProducto: async (id, producto) => {
        const response = await fetch(
            API_URL + "productos/" + id,
            {
                method: "PUT",
                body: JSON.stringify(producto),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarProducto: async (id) => {
        const response = await fetch(
            API_URL + "productos/" + id,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },


    // ---------------------------------------------------------
    // CATEGORÍAS
    // ---------------------------------------------------------
    getCategorias: async () => {
        const response = await fetch(
            API_URL + "categorias/"
        ); 
        return await handleResponse(response);
    }, 
 
    getCategoria: async (id) => {
        const response = await fetch(
            API_URL + "categorias/" + id
        );
        return await handleResponse(response);
    },

    crearCategoria: async (categoria) => {
        const response = await fetch(
            API_URL + "categorias/",
            {
                method: "POST",
                body: JSON.stringify(categoria),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarCategoria: async (id, categoria) => {
        const response = await fetch(
            API_URL + "categorias/" + id,
            {
                method: "PUT",
                body: JSON.stringify(categoria),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarCategoria: async (id) => {
        const response = await fetch(
            API_URL + "categorias/" + id,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },


    // ---------------------------------------------------------
    // CLIENTES
    // ---------------------------------------------------------
    getClientes: async () => {
        const response = await fetch(
            API_URL + "cliente/",
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    getCliente: async (id) => {
        const response = await fetch(
            API_URL + "cliente/" + id,
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    getPerfilCliente: async () => {
        const response = await fetch(
            API_URL + "cliente/perfil",
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    actualizarPerfilCliente: async (cliente) => {
        const response = await fetch(
            API_URL + "cliente/perfil",
            {
                method: "PUT",
                body: JSON.stringify(cliente),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    getPerfilAdministrador: async () => {
        const response = await fetch(
            API_URL + "usuario/perfil",
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    actualizarPerfilAdministrador: async (usuario) => {
        const response = await fetch(
            API_URL + "usuario/perfil",
            {
                method: "PUT",
                body: JSON.stringify(usuario),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    registrarUsuarioAdmin: async (usuario) => {
        const response = await fetch(
            API_URL + "usuario/registro",
            {
                method: "POST",
                body: JSON.stringify(usuario),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    crearCliente: async (cliente) => {
        const response = await fetch(
            API_URL + "cliente/",
            {
                method: "POST",
                body: JSON.stringify(cliente),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarCliente: async (id, cliente) => {
        const response = await fetch(
            API_URL + "cliente/" + id,
            {
                method: "PUT",
                body: JSON.stringify(cliente),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarCliente: async (id) => {
        const response = await fetch(
            API_URL + "cliente/" + id,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },


    // ---------------------------------------------------------
    // PROVEEDORES
    // ---------------------------------------------------------
    getProveedores: async () => {
        const response = await fetch(
            API_URL + "proveedor/",
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    getProveedor: async (id) => {
        const response = await fetch(
            API_URL + "proveedor/" + id,
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    crearProveedor: async (proveedor) => {
        const response = await fetch(
            API_URL + "proveedor/",
            {
                method: "POST",
                body: JSON.stringify(proveedor),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarProveedor: async (id, proveedor) => {
        const response = await fetch(
            API_URL + "proveedor/" + id,
            {
                method: "PUT",
                body: JSON.stringify(proveedor),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarProveedor: async (id) => {
        const response = await fetch(
            API_URL + "proveedor/" + id,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },


    // ---------------------------------------------------------
    // VENTAS
    // ---------------------------------------------------------
    procesarVenta: async (venta) => {
        const response = await fetch(
            API_URL + "venta/",
            {
                method: "POST",
                body: JSON.stringify(venta),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    getMisCompras: async () => {
        const response = await fetch(
            API_URL + "venta/mis-compras",
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    getVentas: async () => {
        const response = await fetch(
            API_URL + "venta/",
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    getVenta: async (id) => {
        const response = await fetch(
            API_URL + "venta/" + id,
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    crearVenta: async (venta) => {
        const response = await fetch(
            API_URL + "venta/admin",
            {
                method: "POST",
                body: JSON.stringify(venta),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarVenta: async (id, venta) => {
        const response = await fetch(
            API_URL + "venta/" + id,
            {
                method: "PUT",
                body: JSON.stringify(venta),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarVenta: async (id) => {
        const response = await fetch(
            API_URL + "venta/" + id,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },


    // ---------------------------------------------------------
    // DETALLE VENTAS
    // ---------------------------------------------------------
    getDetalleVentas: async () => {
        const response = await fetch(
            API_URL + "detalleVenta/",
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    getDetalleVenta: async (id) => {
        const response = await fetch(
            API_URL + "detalleVenta/" + id,
            { headers: getHeaders() }
        );
        return await handleResponse(response);
    },

    crearDetalleVenta: async (detalleVenta) => {
        const response = await fetch(
            API_URL + "detalleVenta/",
            {
                method: "POST",
                body: JSON.stringify(detalleVenta),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    actualizarDetalleVenta: async (id, detalleVenta) => {
        const response = await fetch(
            API_URL + "detalleVenta/" + id,
            {
                method: "PUT",
                body: JSON.stringify(detalleVenta),
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    eliminarDetalleVenta: async (id) => {
        const response = await fetch(
            API_URL + "detalleVenta/" + id,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );
        return await handleResponse(response);
    },

    crearIntencionPago: async (idVenta) => {
        const response = await fetch(API_URL + "pagos/crear-intencion", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ idVenta, moneda: "mxn" })
        });
        return await handleResponse(response);
    },

    confirmarPagoVenta: async (idVenta) => {
        const response = await fetch(API_URL + "pagos/confirmar-pago/" + idVenta, {
            method: "POST",
            headers: getHeaders()
        });
        return await handleResponse(response);
    }
 
}; 
