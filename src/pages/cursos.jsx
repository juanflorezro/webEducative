import { useNavigate } from "react-router-dom";
function Cursos() {

  const navigate = useNavigate();
    return (
        <>
            <div
                id="service"
                className="service"
                style={{
                    background: `
            radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%),
            radial-gradient(circle at bottom right, #2563eb 0%, transparent 30%),
            #020617
        `
                }}
            >

                <div className="container">

                    <div className="row">

                        <div className="col-md-7">

                            <div className="titlepage" >

                                <h2 style={{color: "white"}}>
                                    <strong className="yellow">
                                        Service
                                    </strong>

                                    <br />

                                    Accede a contenidos educativos diseñados para fortalecer conocimientos.
                                </h2>

                            </div>

                        </div>

                    </div>

                    <div className="row">

                        {/* SERVICE 1 */}
                        <div className="col-md-4 col-sm-6" >

                            <div className="service_box" onClick={() => navigate("/calculofuncionlineal")}
        style={{ cursor: "pointer" }}>

                                <img
                                    src="/images/service_icon1.png"
                                    alt="Digital Marketing"
                                />

                                <h2>
                                    Cálculo de Intersección Linea.
                                </h2>

                                <p>
                                    Calcule las rectas de dos funciones lineales Ej: Y = X - 1 con grafica.
                                </p>

                            </div>

                        </div>

                        {/* SERVICE 2 */}
                        <div className="col-md-4 col-sm-6">

                            <div className="service_box" onClick={() => navigate("/examen")}
        style={{ cursor: "pointer" }}>

                                <img
                                    src="/images/service_icon2.png"
                                    alt="Financial Planning"
                                />

                                <h2>
                                    Encuesta sociodemográfica
                                </h2>

                                <p>
                                    Tu voz y contexto son importantes para nosotros
                                </p>

                            </div>

                        </div>

                        

                      

                    </div>

                </div>

            </div>
        </>
    )
}

export default Cursos