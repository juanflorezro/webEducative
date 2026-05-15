function Index () {

    return(
        <>
             <section className="banner_main" style={{
                    background: `
            radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%),
            radial-gradient(circle at bottom right, #2563eb 0%, transparent 30%),
            #020617
        `
                }}>

                <div className="container">

                    <div className="row align-items-center">

                        <div className="col-md-7 col-lg-7">

                            <div className="text-bg" style={{color: "white"}}>

                                <h1>
                                    Aprender hoy <br />
                                    es liderar mañana.
                                </h1>

                                <span>
                                    
                                </span>

                                <p>
                                    Transformamos el aprendizaje en una experiencia accesible, dinámica y enfocada en el futuro. Descubre contenidos diseñados para potenciar tus habilidades y alcanzar tus metas académicas y profesionales.
                                </p>

                                <a href="/about">
                                    Sobre Nosotros
                                </a>

                            </div>

                        </div>

                        <div className="col-md-5 col-lg-5">

                            <div className="ban_img">

                                <figure>
                                    <img
                                        src="/images/ba_ing.png"
                                        alt="Banner"
                                    />
                                </figure>

                            </div>

                        </div>

                    </div>

                </div>

            </section>
        </>
    )

}

export default Index