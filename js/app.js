document.getElementById('search-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const input = document.getElementById('country-input');
    const countryName = input.value.trim();
    const errorMessage = document.getElementById('error-message');
    const countryCard = document.getElementById('country-card');
    const loader = document.getElementById('loader');
    
    // Netwaye zòn yo anvan rechèch la kòmanse
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
        // URL sa a pi senp epi li evite tout pwoblèm bloke nan navigatè a
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
        
        if (!response.ok) {
            throw new Error("Pays non trouvé. Vérifiez l'orthographe (Ex: Haiti, Canada).");
        }
        
        const data = await response.json();
        const country = data[0];
        
        // Ekstre done yo an sekirite
        const flagUrl = country.flags.png;
        const nameFr = country.translations.fra ? country.translations.fra.common : country.name.common;
        const capital = country.capital ? country.capital[0] : "N/A";
        const population = country.population.toLocaleString();
        const region = country.region;
        
        // Rekipere deviz la
        let currencies = "N/A";
        if (country.currencies) {
            currencies = Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ');
        }
        
        // Rekipere lang yo
        let languages = "N/A";
        if (country.languages) {
            languages = Object.values(country.languages).join(', ');
        }
        
        // Konstwi estrikti kat HTML la
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
        
        // Mete tèks yo an sekirite pou evite piki kòd (XSS)
        document.getElementById('det-capital').textContent = capital;
        document.getElementById('det-pop').textContent = population;
        document.getElementById('det-reg').textContent = region;
        document.getElementById('det-dev').textContent = currencies;
        document.getElementById('det-lang').textContent = languages;
        
    } catch (error) {
        input.setAttribute('aria-invalid', 'true');
        // Si se yon pwoblèm rezo oswa si navigatè a bloke requete a
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            errorMessage.textContent = "Erreur de connexion à l'API. Veuillez vérifier votre réseau.";
        } else {
            errorMessage.textContent = error.message;
        }
    } finally {
        // Toujou kache loader a lè n fini
        loader.classList.add('hidden');
    }
});