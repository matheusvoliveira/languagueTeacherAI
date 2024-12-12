import React from "react";
import { useNavigate } from "react-router-dom";
import './home.css';

const LanguageSelection = () => {
  const navigate = useNavigate();

  const handleLanguageClick = (language) => {
    // Redirects to the respective chat page based on the language
    navigate(`/chat-${language}`);
  };

  return (
    <div className="language-selection">
      <h2>Escolha o seu idioma</h2>
      <p>Selecione seu idioma preferido para começar</p>
      <div className="languages">
        <div className="language-card" onClick={() => handleLanguageClick("english")}>
          <img src="https://flagcdn.com/w160/us.png" alt="Inglês" />
          <h3>Inglês</h3>
          <p>Idioma global dos negócios e tecnologia</p>
          <p>Mais de 1452M de falantes no mundo</p>
        </div>
        {/* Mudei o Português para o segundo lugar */}
        <div className="language-card" onClick={() => handleLanguageClick("portuguese")}>
          <img src="https://flagcdn.com/w160/br.png" alt="Português" />
          <h3>Português</h3>
          <p>Idioma da poesia e bossa nova</p>
          <p>Mais de 220M de falantes no mundo</p>
        </div>
        <div className="language-card" onClick={() => handleLanguageClick("spanish")}>
          <img src="https://flagcdn.com/w160/es.png" alt="Espanhol" />
          <h3>Espanhol</h3>
          <p>Rica herança cultural e influência mundial</p>
          <p>Mais de 548M de falantes no mundo</p>
        </div>
        <div className="language-card" onClick={() => handleLanguageClick("japanese")}>
          <img src="https://flagcdn.com/w160/jp.png" alt="Japonês" />
          <h3>Japonês</h3>
          <p>Idioma da inovação e tradição</p>
          <p>Mais de 125M de falantes no mundo</p>
        </div>
        <div className="language-card" onClick={() => handleLanguageClick("mandarin")}>
          <img src="https://flagcdn.com/w160/cn.png" alt="Mandarim" />
          <h3>Mandarim</h3>
          <p>O idioma mais falado no mundo</p>
          <p>Mais de 1118M de falantes no mundo</p>
        </div>
        <div className="language-card" onClick={() => handleLanguageClick("italian")}>
          <img src="https://flagcdn.com/w160/it.png" alt="Italiano" />
          <h3>Italiano</h3>
          <p>Idioma da arte, cultura e culinária</p>
          <p>Mais de 67M de falantes no mundo</p>
        </div>
        <div className="language-card" onClick={() => handleLanguageClick("korean")}>
          <img src="https://flagcdn.com/w160/kr.png" alt="Coreano" />
          <h3>Coreano</h3>
          <p>Idioma do K-pop e cultura moderna</p>
          <p>Mais de 80M de falantes no mundo</p>
        </div>
        <div className="language-card" onClick={() => handleLanguageClick("arabic")}>
          <img src="https://flagcdn.com/w160/ae.png" alt="Árabe" />
          <h3>Árabe</h3>
          <p>Idioma clássico com rica tradição literária</p>
          <p>Mais de 467M de falantes no mundo</p>
        </div>
        <div className="language-card" onClick={() => handleLanguageClick("french")}>
          <img src="https://flagcdn.com/w160/fr.png" alt="Francês" />
          <h3>Francês</h3>
          <p>Idioma da diplomacia e artes</p>
          <p>Mais de 280M de falantes no mundo</p>
        </div>
        <div className="language-card" onClick={() => handleLanguageClick("german")}>
          <img src="https://flagcdn.com/w160/de.png" alt="Alemão" />
          <h3>Alemão</h3>
          <p>Idioma da filosofia e inovação</p>
          <p>Mais de 95M de falantes no mundo</p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
