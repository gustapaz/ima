import ClientBoot from "./client-boot";
export default function Home() {
  return (
    <>
      <a className="skip" href="#lab">
        Ir para o campo de combinações
      </a>
      <header>
        <a href="/" className="brand">
          ÍMÃ<sup>® NÃO REGISTRADO</sup>
        </a>
        <a href="#principle">O princípio ↙</a>
        <a href="/api-docs.html">Por dentro ↗</a>
      </header>
      <main>
        <section className="magnetic-intro">
          <canvas id="field" aria-hidden="true" />
          <div className="intro-index">
            <span>ATRAÇÃO NÃO É ACASO.</span>
            <span>UM EXPERIMENTO EM COMPLEMENTARIDADE</span>
          </div>
          <h1>
            <span>Boas ideias</span>
            <em>se atraem.</em>
          </h1>
          <div className="intro-bottom">
            <p>
              Talentos diferentes.
              <br />
              Uma composição que faz sentido.
            </p>
            <a href="#lab">
              Encontrar a outra metade <b>↘</b>
            </a>
            <span>
              DESIGN / CÓDIGO
              <br />
              MOVIMENTO / PESQUISA
            </span>
          </div>
          <div className="big-magnet" aria-hidden="true">
            <i />
            <i />
          </div>
        </section>
        <section id="lab">
          <div className="lab-heading">
            <span>CAMPO DE POSSIBILIDADES / 01</span>
            <h2>Quem encontra quem?</h2>
            <p>Perfis inventados. Combinações calculadas de verdade.</p>
          </div>
          <div id="app-root">
            <p>Preparando as possibilidades…</p>
          </div>
        </section>
        <section className="principle" id="principle">
          <div className="texture">
            <img
              src="/media/metal.webp"
              width="1400"
              height="933"
              loading="lazy"
              alt="Superfície metálica real com reflexos e textura abstrata"
            />
            <span>+ / −</span>
          </div>
          <div className="principle-copy">
            <span>O MELHOR CONJUNTO ≠ A SOMA DOS FAVORITOS</span>
            <h2>
              A diferença
              <br />é o que
              <br />
              <em>conecta.</em>
            </h2>
            <p>
              Escolher o par mais forte, um por vez, pode deixar o último sem
              uma boa conexão. Aqui, todas as composições possíveis são
              examinadas juntas.
            </p>
            <p>
              Priorize a soma ou proteja o par com a menor pontuação. Bloqueie
              encontros e descubra como uma escolha muda o conjunto.
            </p>
            <small>
              Não é uma avaliação de pessoas reais. Perfis e notas são
              inteiramente sintéticos.
            </small>
          </div>
        </section>
      </main>
      <footer>
        <strong>ÍMÃ</strong>
        <p>Uma experiência de Gustavo Paz.</p>
        <a href="https://github.com/gustapaz/ima">Código e créditos ↗</a>
        <small>Fotografia: Jonathan Borba / Pexels.</small>
        <button id="motion-toggle" aria-pressed="false">
          Pausar movimento
        </button>
      </footer>
      <ClientBoot />
    </>
  );
}
