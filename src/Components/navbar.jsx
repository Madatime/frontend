import { apiService } from '../services/apiService';
import { ShoppingCart, LogOut, User, ListOrdered, ShoppingBag } from 'lucide-react';

export const Navbar = ({vistaActual, setVistaActual, user, 
    onLogout, carCount, openCart}) => {
    const handleLogout = () => {
        apiService.logout();
        onLogout();
        setVistaActual('catalogo');
    };


const isClient = user && user.rol === 'ROLE_CLIENTE';
const isAdmin = user && user.rol === 'ROLE_ADMIN';
return (
    <nav className="sticky top-0 z-50 bg-violet-100/90 text-slate-800 border-b border-violet-200/80 shadow-sm backdrop-blur-xl">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 xl:px-8 2xl:px-10">
            <div className="flex items-center justify-between min-h-[4.5rem] py-2 gap-4">
                {/* Logo y links */}
                <div className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer group" 
                onClick={() => setVistaActual('catalogo')}>
                    <span className="w-10 h-10 rounded-xl bg-white/70 border border-violet-200 shadow-sm flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
                        <ShoppingBag className="h-6 w-6 text-violet-600" />
                    </span>
                    <span className="hidden sm:inline font-extrabold text-xl tracking-tight text-violet-700">Aliviababa</span>
                </div>
                {/* Links de navegación */}
                <div className="nav-actions flex items-center gap-1 sm:gap-2 overflow-x-auto">
                    <button onClick={() => setVistaActual('catalogo')}
                    className={`hidden sm:block px-3.5 py-2.5 rounded-xl text-sm font-medium
                        transition-colors hover:bg-white/70 
                    ${vistaActual === 'catalogo' ? 
                    'bg-white font-bold text-violet-700 shadow-sm ring-1 ring-violet-200/60' : ''}`}>
                        Catalogo
                    </button>

                    {/*Botones para clientes*/}
                    {isClient && (
                        <>
                        <button onClick={() => setVistaActual('cliente-dashboard')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all 
                        duration-200 hover:bg-white/70 
                        ${vistaActual === 'cliente-dashboard' ? 
                        'bg-white font-bold text-violet-700 shadow-sm' : ''}`}>
                            <ListOrdered className="w-4 h-4"/>
                            Mi Cuenta
                        </button>
                        </>
                    )}
                    {/*Botones para admin*/}
                    {isAdmin && (
                        <>
                        <button onClick={() => setVistaActual('admin-dashboard')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm
                        font-medium transition-all duration-200 hover:bg-white/70
                        ${vistaActual === 'admin-dashboard' ? 
                        'bg-white font-bold text-violet-700 shadow-sm' : ''}`}>
                            <ListOrdered className="w-4 h-4"/>
                            Admin Panel
                        </button>
                        </>
                    )}

                    {/* Botón de carrito y loggeo */}
                    {!isAdmin && (
                        <button
                            onClick={openCart}
                            className="relative p-2 rounded-full hover:bg-white/80 transition-colors cursor-pointer group"
                            title="Abrir carrito"
                            aria-label={`Abrir carrito con ${carCount} productos`}
                        >
                            <ShoppingCart className="w-6 h-6 text-violet-700 group-hover:text-violet-800" />
                            {carCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs min-w-5 h-5 px-1 flex items-center justify-center font-bold border border-white">
                                    {carCount}
                                </span>
                            )}
                        </button>
                    )}

                    {user ? (<>
                        <div
                            className="flex items-center gap-2 bg-white/75
                            px-3 py-2 rounded-xl border border-violet-200 shadow-sm
                            w-auto sm:w-52"
                        >
                            <div
                                className="w-8 h-8 rounded-full bg-violet-600
        flex items-center justify-center flex-shrink-0"
                            >
                                <User className="w-4 h-4 text-white" />
                            </div>

                            <div className="hidden sm:block leading-tight overflow-hidden">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    {user.nombre}
                                </p>

                                <p className="text-[11px] text-slate-500 truncate">
                                    {user.username}
                                </p>

                                <p className="text-[10px] text-violet-600">
                                    {isAdmin ? "Administrador" : "Cliente"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full hover:bg-red-100 hover:text-red-700 
                            transition-colors cursor-pointer"
                            title="Cerrar Sesión">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </>
                    ):(<>
                        <button onClick={() => setVistaActual('login')}
                        className="px-2 sm:px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap
                        transition-colors hover:bg-white/70">
                            Iniciar Sesión
                        </button>
                        <button onClick={() => setVistaActual('registro')}
                        className="px-2 sm:px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap
                        bg-violet-600 text-white shadow-sm hover:bg-violet-700">
                            Registrarse
                        </button>
                    </>
                    )}



                </div>    

            </div>
        </div>
    </nav>

);

};
