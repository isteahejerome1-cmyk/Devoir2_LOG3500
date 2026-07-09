document.getElementById('search-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const input = document.getElementById('country-input');
    let countryName = input.value.trim().toLowerCase();
    const errorMessage = document.getElementById('error-message');
    const countryCard = document.getElementById('country-card');
    const loader = document.getElementById('loader');
    
    errorMessage.textContent = "";
    countryCard.innerHTML = "";
    input.removeAttribute('aria-invalid');
    
    if (countryName === "") {
        input.setAttribute('aria-invalid', 'true');
        errorMessage.textContent = "Veuillez saisir le nom d'un pays.";
        return;
    }
    
    loader.classList.remove('hidden');
    
    // Ti koreksyon pou non peyi yo an fransè/anglè pou API sekou a
    if (countryName === "haiti" || countryName === "ayiti") countryName = "haiti";
    if (countryName === "canada") countryName = "canada";
    if (countryName === "france") countryName = "france";
    
    try {
        // N ap itilize yon lòt API (openconcepts) ki pi lejè epi ki pa gen pwoblèm bloke rezo
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
        
        if (!response.ok) {
            throw new Error("Pays non trouvé. Vérifiez l'orthographe.");
        }
        
        const data = await response.json();
        const country = data[0];
        
        const flagUrl = country.flags.png;
        const nameFr = country.translations.fra ? country.translations.fra.common : country.name.common;
        const capital = country.capital ? country.capital[0] : "N/A";
        const population = country.population.toLocaleString();
        const region = country.region;
        
        let currencies = "N/A";
        if (country.currencies) {
            currencies = Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ');
        }
        
        let languages = "N/A";
        if (country.languages) {
            languages = Object.values(country.languages).join(', ');
        }
        
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
        
        document.getElementById('det-capital').textContent = capital;
        document.getElementById('det-pop').textContent = population;
        document.getElementById('det-reg').textContent = region;
        document.getElementById('det-dev').textContent = currencies;
        document.getElementById('det-lang').textContent = languages;
        
    } catch (error) {
        // Si premye API a bay erè rezo toujou, n ap kontakte dezyèm API sekou a dirèkteman san pèdi tan
        try {
            const backupResponse = await fetch(`https://openconcepts-api.onrender.com/countries/${countryName}`).catch(() => null);
            if (backupResponse && backupResponse.ok) {
                const backupData = await backupResponse.json();
                
                // Done yo fòmate pou API sekou a
                countryCard.innerHTML = `
                    <div class="country-card">
                        <img src="https://flagcdn.com/w320/${backupData.id.toLowerCase()}.png" alt="Drapeau" class="flag">
                        <h2>${backupData.name}</h2>
                        <div class="country-details">
                            <p><strong>Capitale :</strong> <span>${backupData.capital || 'N/A'}</span></p>
                            <p><strong>Région :</strong> <span>${backupData.region || 'N/A'}</span></p>
                            <p><strong>Code Pays :</strong> <span>${backupData.id}</span></p>
                        </div>
                    </div>
                `;
                return;
            }
        } catch (e) {
            // Si dezyèm lan echwe tou
        }

        input.setAttribute('aria-invalid', 'true');
        errorMessage.textContent = "Erreur de connexion à l'API. Veuillez vérifier votre réseau.";
    } finally {
        loader.classList.add('hidden');
    }
});