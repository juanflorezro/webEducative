
function Login() {
    return (
        <div className="cx-login-wrapper">

            <div className="cx-login-overlay"></div>

            <div className="cx-login-container">

                <div className="cx-login-left" style={{textAlign: "center"}}>

                    <div className="cx-login-brand">
                        <h1>JAIME MELENDEZ SAMBRANO</h1>
                        <span></span>
                    </div>

                    <div className="cx-login-content">

                        <h2>
                          
                        </h2>

                        <p>
                            Bienvenido a un espacio dedicado al conocimiento, la investigación y el desarrollo integral de estudiantes comprometidos con la excelencia.
                        </p>

                    </div>

                </div>

                <div className="cx-login-right">

                    <div className="cx-login-card">

                        <div className="cx-login-header">
                            <h3>Iniciar Sesión</h3>
                            <span>Ingresa tus credenciales</span>
                        </div>

                        <form className="cx-login-form">

                            <div className="cx-input-group">
                                <label>Correo electrónico</label>
                                <input
                                    type="email"
                                    placeholder="example@company.com"
                                />
                            </div>

                            <div className="cx-input-group">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="cx-login-options">

                                <label className="cx-remember">
                                    <input type="checkbox" />
                                    Recordarme
                                </label>

                                <a href="/forgot-password">
                                    ¿Olvidaste tu contraseña?
                                </a>

                            </div>

                            <button type="submit" className="cx-login-btn">
                                Acceder
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Login
