import { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import './css/Login.css';
import sevenbrains from "../../public/img/sevenbrains.png";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Aquí podrías implementar la lógica de autenticación
        console.log(`Username: ${username}, Password: ${password}`);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login">
            <div className="login-container">
                <div className="login-logo">
                    <img src={sevenbrains} alt="Logo" />
                </div>
                <h2 className="login-name">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <FaIcons.FaUser className="input-icon" />
                        <input
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <FaIcons.FaLock className="input-icon" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <FaIcons.FaEye
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        <FaIcons.FaSignInAlt className="login-btn-icon" />
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
