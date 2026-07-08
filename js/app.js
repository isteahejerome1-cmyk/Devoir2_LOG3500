// Deklarasyon eleman nan DOM lan
const form = document.getElementById('search-form');
const input = document.getElementById('country-input');
const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loader');
const countryCard = document.getElementById('country-card');

// Koute lè itilizatè a soumèt fòm nan
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Anpeche paj la rechaje
    
    const countryName = input.value.trim(); // Netwaye espas vid yo
    
    // 1. Validasyon pou jaden ki vid (Aksesibilite - A11y)
    if (countryName === '') {
        input.setAttribute('aria-invalid', 'true');
        errorMessage.textContent = "Veuillez saisir un nom de pays valide.";
        input.setAttribute('aria-describedby', 'error-message');
        return;
    }
    
    // Reyisyalizasyon zòn yo anvan requête a kòmanse
    resetErrors();
    showLoader(true);
    countryCard.innerHTML = ''; 

    try {
        // 2. Apèl API a ak fetch ak metòd async/await
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        // Jere si peyi a pa jwenn (Erreur 404)
        if (!response.ok) {
            throw new Error('404');
        }
        
        const data = await response.json();
        // Nou voye premye Peyi ki nan tablo a pou afiche
        displayCountry(data[0]); 
        
    } catch (error) {
        // 3. Jere erè yo selon sitiyasyon an (Sekirite ak rezo)
        if (error.message === '404') {
            errorMessage.textContent = "Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.";
        } else {
            errorMessage.textContent = "Connexion impossible. Veuillez vérifier votre accès à internet.";
        }
    } finally {
        // Toujou kache loader a nan fen an
        showLoader(false);
    }
});

// Koute lè itilizatè a ap tape pou n retire eta erè a otomatikman
input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
        resetErrors();
    }
});

// Fonksyon pou afiche done yo san danje (Sécurité DOM kont faille XSS)
function displayCountry(country) {
    const name = country.name.common;
    const capital = country.capital ? country.capital[0] : 'N/A';
    
    // Fòmate popilasyon an ak espas (Ex: 11 402 533)
    const population = new Intl.NumberFormat('fr-FR').format(country.population);
    
    const region = country.region;
    const flagSvg = country.flags.svg;
    const flagAlt = country.flags.alt || `Drapeau officiel de ${name}`;

    // Ekstrè Monnen (currencies)
    let currencyText = 'N/A';
    if (country.currencies) {
        const currencyKey = Object.keys(country.currencies)[0];
        const currencyObj = country.currencies[currencyKey];
        currencyText = `${currencyObj.name} (${currencyObj.symbol || currencyKey})`;
    }

    // Ekstrè Lang yo (languages)
    const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';

    // Kreyasyon estrikti kat la
    countryCard.innerHTML = `
        <div class="card-container">
            <div class="flag-box">
                <img id="country-flag" src="" alt="">
            </div>
            <div class="info-box">
                <h2 id="country-name"></h2>
                <p><strong>Nom:</strong> <span id="info-nom"></span></p>
                <p><strong>Capitale:</strong> <span id="info-capital"></span></p>
                <p><strong>Population:</strong> <span id="info-pop"></span></p>
                <p><strong>Région:</strong> <span id="info-region"></span></p>
                <p><strong>Devise:</strong> <span id="info-currency"></span></p>
                <p><strong>Langues:</strong> <span id="info-lang"></span></p>
            </div>
        </div>
    `;

    // Sekirizasyon pwen yo ak textContent (Obligatwa kont faille XSS)
    const imgEl = document.getElementById('country-flag');
    imgEl.src = flagSvg;
    imgEl.alt = flagAlt;

    document.getElementById('country-name').textContent = name;
    document.getElementById('info-nom').textContent = name;
    document.getElementById('info-capital').textContent = capital;
    document.getElementById('info-pop').textContent = population;
    document.getElementById('info-region').textContent = region;
    document.getElementById('info-currency').textContent = currencyText;
    document.getElementById('info-lang').textContent = languages;
}

function showLoader(isLoading) {
    if (isLoading) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

function resetErrors() {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    errorMessage.textContent = '';
}