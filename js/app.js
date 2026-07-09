document.getElementById('search-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const input = document.getElementById('country-input');
    const countryName = input.value.trim();
    const errorMessage = document.getElementById('error-message');
    const countryCard = document.getElementById('country-card');
    const loader = document.getElementById('loader');
    
    // Reyalize netwayaj anvan rechèch la
    errorMessage.textContent = "";
    countryCard.innerHTML = "";
    input.removeAttribute('aria-invalid');
    
    if (countryName === "") {
        input.setAttribute('aria-invalid', 'true');
        errorMessage.textContent = "Veuillez saisir le nom d'un pays.";
        return;
    }
    
    // Afiche loader a
    loader.classList.remove('hidden');
    
    try {
        // N ap itilize yon lyen API sekou ki pi estab v3.1
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Pays non trouvé. Vérifiez l'orthographe (Ex: Haiti, Canada).");
            } else {
                throw new Error("Erreur du serveur. Veuillez réessayer plus tard.");
            }
        }
        
        const data = await response.json();
        const country = data[0];
        
        // Ekstraksyon done yo an sekirite
        const flagUrl = country.flags.png;
        const nameFr = country.translations.fra ? country.translations.fra.common : country.name.common;
        const capital = country.capital ? country.capital[0] : "N/A";
        const population = country.population.toLocaleString();
        const region = country.region;
        
        // Devise
        let currencies = "N/A";
        if (country.currencies) {
            currencies = Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ');
        }
        
        // Langues
        let languages = "N/A";
        if (country.languages) {
            languages = Object.values(country.languages).join(', ');
        }
        
        // Konstwi kat la san faye XSS (Aksesibilite ak Sekirite)
        countryCard.innerHTML = `
            <div class="country-card">
                <img src="${flagUrl}" alt="Drapeau de ${nameFr}" class="flag">
                <h2>${nameFr}</h2>
                <div class="country-details">
                    <p><strong>Capitale :</strong> <span id="det-capital"></span></p>
                    <p><strong>Population :</strong> <span id="det-pop"></span></p>
                    <p><strong>Région :</strong> <span id="det-reg"></span></p>
                    <p><strong>Devise(s) :</strong> <span id="det-dev"></span></p>
                    <p><strong>Langue(s) :</strong> <span id="det-lang"></span></p>
                </div>
            </div>
        `;
        
        // Sekirize tèks yo pou evite piki kòd (XSS)
        document.getElementById('det-capital').textContent = capital;
        document.getElementById('det-pop').textContent = population;
        document.getElementById('det-reg').textContent = region;
        document.getElementById('det-dev').textContent = currencies;
        document.getElementById('det-lang').textContent = languages;
        
    } catch (error) {
        input.setAttribute('aria-invalid', 'true');
        // Si se yon erè rezo oswa API a ki bloke
        if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
            errorMessage.textContent = "Erreur de connexion à l'API. Veuillez réessayer.";
        } else {
            errorMessage.textContent = error.message;
        }
    } finally {
        // Kache loader a nan fen a
        loader.classList.add('hidden');
    }
});