import { useState } from "react";

function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    

    return (
        <>
            <header>
                <div className="header">

                    {/* TOP HEADER */}
                    <div className="header_to d_none">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 col-sm-6">
                                    <ul className="lan">
                                        <li>
                                            <img src="/images/330508.png" alt="flag" />
                                        </li>
                                    </ul>
                                    <form action="#">
                                        <div className="select-box"></div>
                                    </form>
                                </div>

                                <div className="col-md-6 col-sm-6">
                                    <ul className="social_icon1">
                                        <li>Sigueme</li>
                                        <li><a href="/"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                                        <li><a href="/"><i className="fa fa-twitter"></i></a></li>
                                        <li><a href="/"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
                                        <li><a href="/"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE HEADER */}
                    <div className="header_midil">
                        <div className="container">
                            <div className="row d_flex">
                                <div className="col-md-4 col-sm-4 d_none">
                                    <ul className="conta_icon">
                                        <li>
                                            <a href="tel:+011234567890">
                                                <i className="fa fa-phone" aria-hidden="true"></i>
                                                +3001236548
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="col-md-4 col-sm-4">
                                    <a className="logo" href="/">
                                        <h5>JAIME MELÉNDEZ SAMBRANO</h5>
                                    </a>
                                </div>

                                <div className="col-md-4 col-sm-4 d_none">
                                    <ul className="conta_icon" style={{ marginLeft: "60%" }}>
                                        <li>
                                            <a href="mailto:demo@gmail.com">
                                                <i className="fa fa-envelope" aria-hidden="true"></i>
                                                demo@gmail.com
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NAVBAR */}
                    <div className="header_bo">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-9 col-sm-7">

                                    <nav className="navigation navbar navbar-expand-md navbar-dark">

                                        {/* Botón hamburguesa — ahora controlado por React */}
                                        <button
                                            className="navbar-toggler"
                                            type="button"
                                            aria-label="Toggle navigation"
                                            aria-expanded={isOpen}
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            <span className="navbar-toggler-icon"></span>
                                        </button>

                                        {/* Se agrega "show" cuando isOpen es true */}
                                        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
                                            <ul className="navbar-nav me-auto">
                                                <li className="nav-item ">
                                                    <a className="nav-link" href="/" onClick={() => setIsOpen(false)}>
                                                        Inicio
                                                    </a>
                                                </li>
                                                <li className="nav-item ">
                                                    <a className="nav-link" href="/servicios" onClick={() => setIsOpen(false)}>
                                                        Servicios
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link" href="/about" onClick={() => setIsOpen(false)}>
                                                        Sobre Nosotros
                                                    </a>
                                                </li>
                                            </ul>

                                            <ul className="sign" >
                                                <li>
                                                    <a className="sign_btn" href="/login" onClick={() => setIsOpen(false)} style={{marginBottom: "100px"}}>
                                                        Ingresar
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>

                                    </nav>

                                </div>

                                <div className="col-md-3 col-sm-5 d_none"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </header>
        </>
    );
}

export default Nav;