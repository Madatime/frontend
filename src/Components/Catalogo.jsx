import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Search, Filter, ShoppingCart, Info, AlertTriangle } from 'lucide-react';

export const Catalogo = ({ user, AddToCart }) => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carga, setCarga] = useState(true);
    const [error, setError] = useState('');

    //filtros 
    const [searchQuery, setSearchQuery] = useState('');
    const [selecionCategoria, setSelecionCategoria] = useState('Todos');

    useEffect(() => {
        const cargaDatosCatalogo = async () => {
            setCarga(true);
            try {
                const datosProductos = await apiService.getProductos();
                setProductos(datosProductos);
                const datosCategorias = await apiService.getCategorias();
                setCategorias(datosCategorias);
            } catch (err) {
                setError('Error en el servidor backend..' + err);
            } finally {
                setCarga(false);
            }
        }; 
        cargaDatosCatalogo();
    }, []);

    //AGREGAR AL CARRITO
    const handleAddToCart = (producto) => {
        if (user?.rol === 'ROLE_ADMIN') {
            alert('Los administradores no pueden agregar productos al carrito.');
            return;
        }
        AddToCart(producto);
    };

    const filtroProductos = productos.filter((producto) => {
        const busqueda =
            producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (producto.descripcion
                && producto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

        const busquedaCategorias =
            selecionCategoria === 'Todos' ||
            (producto.categoria && producto.categoria.nombre === selecionCategoria);

        return busqueda && busquedaCategorias;

    });

    if (carga) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                <p className="text-gray-500 mt-4 font-medium">Cargando productos....</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">


            {/* Banner Principal */}
            <div className="bg-gradient-to-br from-violet-200 via-purple-100 to-fuchsia-100 rounded-3xl p-8 mb-8 text-slate-900 border border-violet-200/80 shadow-[0_18px_45px_-25px_rgba(49,65,90,0.45)] relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Catálogo de Productos</h1>
                    <p className="mt-2 text-slate-600 text-sm sm:text-base">
                        Explora las mejores ofertas, productos de calidad y envíos garantizados directamente por nuestros proveedores.
                    </p>
                </div>
                <div className="absolute right-0 bottom-0 top-0 text-violet-700 opacity-10 flex items-center justify-center p-8">
                    <ShoppingCart className="w-64 h-64" />
                </div>
            </div>

            {error && (
                <div className="bg-violet-50 text-violet-800 p-4 rounded-xl flex items-start gap-2.5 border border-violet-200 text-sm mb-6">
                    <Info className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold">Aviso del Servidor:</span> {error}. Mostrando interfaz local. Asegúrate de iniciar la API en Spring Boot.
                    </div>
                </div>
            )}

            {/* Buscador y Contenido */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filtros Lateral (Sidebar) */}
                <div className="w-full md:w-1/4 flex-shrink-0 space-y-6 md:sticky md:top-24 md:self-start">
                    {/* Tarjeta de Búsqueda */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_8px_25px_-18px_rgba(15,23,42,0.45)] space-y-3">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Search className="w-4 h-4 text-violet-500" /> Buscar Producto
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Escribe nombre o descripción..."
                                className="w-full p-3 pl-4 rounded-xl border border-gray-300 focus:outline-none text-sm text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Tarjeta de Categorías */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_8px_25px_-18px_rgba(15,23,42,0.45)] space-y-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Filter className="w-4 h-4 text-violet-500" /> Categorías
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            <button
                                onClick={() => setSelecionCategoria('Todos')}
                                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                    selecionCategoria === 'Todos'
                                        ? 'bg-violet-50 text-violet-700 font-bold ring-1 ring-violet-100'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Todas las categorías
                            </button>
                            {categorias.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelecionCategoria(cat.nombre)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                        selecionCategoria === cat.nombre
                                            ? 'bg-violet-50 text-violet-700 font-bold ring-1 ring-violet-100'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {cat.nombre}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cuadrícula de Productos */}
                <div className="w-full md:w-3/4">
                    {filtroProductos.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                            <AlertTriangle className="w-12 h-12 text-violet-300 mx-auto mb-4" />
                            <h3 className="font-bold text-lg text-gray-800">No se encontraron productos</h3>
                            <p className="text-gray-500 text-sm mt-1">Prueba a modificar los filtros o los términos de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtroProductos.map((producto) => {
                                const defaultImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300";
                                const isOutOfStock = producto.stock <= 0;
                                const isAdmin = user?.rol === 'ROLE_ADMIN';

                                return (
                                    <div
                                        key={producto.id}
                                        className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.6)] overflow-hidden flex flex-col group hover:shadow-[0_18px_38px_-22px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Imagen con zoom effect */}
                                        <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                                            <img
                                                src={producto.imagenUrl || defaultImage}
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src = defaultImage;
                                                }}
                                            />
                                            {/* Categoría Badge */}
                                            {producto.categoria && (
                                                <span className="absolute top-3 left-3 bg-violet-700/90 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                                                    {producto.categoria.nombre}
                                                </span>
                                            )}
                                        </div>

                                        {/* Cuerpo */}
                                        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                            <div className="space-y-2">
                                                {/* Proveedor */}
                                                {producto.proveedor && (
                                                    <div className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                                                        <i className="fa-solid fa-truck text-violet-400"></i> {producto.proveedor.nombreEmpresa}
                                                    </div>
                                                )}
                                                <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-violet-600 transition-colors">
                                                    {producto.nombre}
                                                </h3>
                                                <p className="text-gray-500 text-xs line-clamp-2 h-8">
                                                    {producto.descripcion || 'Sin descripción disponible.'}
                                                </p>
                                            </div>

                                            {/* Precio y Stock */}
                                            <div className="pt-2">
                                                <div className="flex justify-between items-baseline">
                                                    <span className="font-extrabold text-xl text-slate-900">
                                                        ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                                    </span>
                                                    <span className={`text-xs font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                                        {isOutOfStock ? 'Sin stock' : `Disponibles: ${producto.stock}`}
                                                    </span>
                                                </div>

                                                {/* Botón Comprar */}
                                                <button
                                                    onClick={() => handleAddToCart(producto)}
                                                    disabled={isOutOfStock || isAdmin}
                                                    className={`w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-xs shadow-sm transition-all duration-200 cursor-pointer ${
                                                        isOutOfStock || isAdmin
                                                            ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'
                                                            : 'bg-violet-600 hover:bg-violet-700 text-white hover:shadow-md'
                                                    }`}
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    {isAdmin ? 'Disponible para clientes' : 'Añadir al carrito'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );

};
