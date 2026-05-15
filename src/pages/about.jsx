function About() {
    return (
        <>
            <div id="about" className="about"  style={{
                    background: `
            radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%),
            radial-gradient(circle at bottom right, #2563eb 0%, transparent 30%),
            #020617
        `
                }} >

                <div className="container-fluid" >

                    <div className="row"> 

                        {/* LEFT CONTENT */}
                        <div className="col-md-12 col-lg-7" >

                            <div className="about_box">

                                <div className="titlepage" >

                                    <h2 style={{color: "white"}}>
                                        <strong className="yellow">
                                            Sobre Nosotros
                                        </strong>

                                        <br />

                                        JAIME MELENDEZ SAMBRANO
                                    </h2>

                                </div>

                                <h3 style={{color: "white"}}>
                                    Somos una plataforma educativa enfocada en el aprendizaje moderno, diseñada para ayudar a estudiantes, profesionales y emprendedores a desarrollar nuevas habilidades y fortalecer sus conocimientos en diferentes áreas.
                                </h3>

                                <span style={{color: "white"}}>
                                    “Conocimiento sin límites.”
                                    <br />
                                    
“Desarrolla nuevas habilidades con cursos modernos y formación de calidad.”
                                </span>

                                

                                

                                <a
                                    className="read_morea"
                                    href="/login"
                                >
                                    Inicia Gratis
                                    <i
                                        className="fa fa-angle-right"
                                        aria-hidden="true"
                                    ></i>

                                </a>

                            </div>

                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="col-md-12 col-lg-5">

                            <div className="about_img">

                                <figure>

                                    <img
                                        src="/images/about_img2.jpg"
                                        alt="About"
                                    />

                                </figure>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

export default About