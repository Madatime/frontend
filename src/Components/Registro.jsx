import { useState } from 'react';
import { UserPlus, User, Mail, Lock, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

export const Registro = ({ onRegisterSuccess, onGoToLogin }) => {

    const [nombre, setNombre] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('ROLE_CLIENTE');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const payload = {
            username,
            email,
            password,
            nombre,
            rol: rol,
            direccion: rol === 'ROLE_CLIENTE' ? direccion : null,
            telefono: rol === 'ROLE_CLIENTE' ? telefono : null,
        };

        try {
            await apiService.registro(payload);
            setSuccess('Registro completado con éxito! Redirigiendo al inicio de sesión...');
            setTimeout(() => {
                onRegisterSuccess();
            }, 2000);
        } catch (err) {
            setError(err.message || 'Error al completar el registro. Intenta con otro correo.');
        } finally {
            setLoading(false);
        }
    }; 

    return (
        <div className="max-w-lg w-full mx-auto my-12 bg-white
        rounded-2xl shadow-xl overflow-hidden border border-gray-100">

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-2.5 border border-red-200 text-sm">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-2.5 border border-green-200 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{success}</span>
                    </div>
                )}

                {/* NOMBRE */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            placeholder="Ingresa tu nombre"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300
                            rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                </div>

                {/* USERNAME */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <div className="relative">
                        <UserPlus className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required                            
                            placeholder="Ingresa tu username"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300
                            rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                </div>

                {/* CORREO */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                         type="email"
                         name="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         required
                         placeholder="Ingresa tu correo"
                         className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="password"
                            value={password}
                            required
                            minLength={6}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña, Minimo 6 Caracteres"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300
                            rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                </div>

                {/* Rol Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol de usuario
                    </label>
                    <select
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300
                        rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="ROLE_CLIENTE">Cliente</option>
                        <option value="ROLE_ADMIN">Administrador</option>
                    </select>
                </div>

                {rol === 'ROLE_CLIENTE' && (
                    <>
                {/* TELEFONO */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono de contacto
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    placeholder="Ingresa tu teléfono"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300
                                    rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                        </div>

                {/* DIRECCION */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dirección
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="direccion"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    placeholder="Ingresa tu dirección"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300
                                    rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white
                    font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5"/>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
                {/* IR AL LOGIN */}                
                <div className='text-center text-sm text-gray-500 border-t border-gray-100-pt-5'>
                ¿Ya tienes una cuenta? {' '}
                <button 
                type='button'
                onClick={onGoToLogin}
                className= "text-violet-600 font-bold hover:underline">
                  Inicia Sesión
                </button>
                </div>
            </form>

        </div>
    );
};
