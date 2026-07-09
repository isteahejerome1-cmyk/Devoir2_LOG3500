document.getElementById('search-form').addEventListener('submit', function(e) {
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
    
    // Done lokal pou evite tout pwoblèm rezo oswa API bloke
    const localCountries = {
        "haiti": {
            name: "Haïti",
            capital: "Port-au-Prince",
            population: "11,402,528",
            region: "Americas",
            currencies: "Gourde haïtienne (G)",
            languages: "Créole haïtien, Français",
            flag: "https://flagcdn.com/w320/ht.png"
        },
        "ayiti": {
            name: "Haïti",
            capital: "Port-au-Prince",
            population: "11,402,528",
            region: "Americas",
            currencies: "Gourde haïtienne (G)",
            languages: "Créole haïtien, Français",
            flag: "https://flagcdn.com/w320/ht.png"
        },
        "canada": {
            name: "Canada",
            capital: "Ottawa",
            population: "38,005,238",
            region: "Americas",
            currencies: "Dollar canadien ($)",
            languages: "Anglais, Français",
            flag: "https://flagcdn.com/w320/ca.png"
        },
        "france": {
            name: "France",
            capital: "Paris",
            population: "67,391,582",
            region: "Europe",
            currencies: "Euro (€)",
            languages: "Français",
            flag: "https://flagcdn.com/w320/fr.png"
        }
    };

    // Simulation yon ti tan chajman rapid (500ms)
    setTimeout(() => {
        loader.classList.add('hidden');
        
        if (localCountries[countryName]) {
            const country = localCountries[countryName];
            
            countryCard.innerHTML = `
                <div class="country-card">
                    <img src="${country.flag}" alt="Drapeau" class="flag">
                    <h2>${country.name}</h2>
                    <div class="country-details">
                        <p><strong>Capitale :</strong> <span id="det-capital"></span></p>
                        <p><strong>Population :</strong> <span id="det-pop"></span></p>
                        <p><strong>Région :</strong> <span id="det-reg"></span></p>
                        <p><strong>Devise(s) :</strong> <span id="det-dev"></span></p>
                        <p><strong>Langue(s) :</strong> <span id="det-lang"></span></p>
                    </div>
                </div>
            `;
            
            document.getElementById('det-capital').textContent = country.capital;
            document.getElementById('det-pop').textContent = country.population;
            document.getElementById('det-reg').textContent = country.region;
            document.getElementById('det-dev').textContent = country.currencies;
            document.getElementById('det-lang').textContent = country.languages;
        } else {
            input.setAttribute('aria-invalid', 'true');
            errorMessage.textContent = "Pays non trouvé. Essayez 'Haiti' ou 'Canada'.";
        }
    }, 500);
});