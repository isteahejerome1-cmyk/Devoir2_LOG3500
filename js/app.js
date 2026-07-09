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
    
    // Konvèti non yo pou API a pi fasil jwenn yo
    let searchName = countryName;
    if (countryName === "haiti" || countryName === "ayiti") searchName = "haiti";
    if (countryName === "canada") searchName = "canada";
    if (countryName === "france") searchName = "france";
    
    try {
        // N ap pase nan yon lòt lyen API (Sèvè sa a pa bloke nan rezo Ayiti yo)
        const response = await fetch(`https://openconcepts-api.onrender.com/countries/${searchName}`);
        
        if (!response.ok) {
            throw new Error("Pays non trouvé. Vérifiez l'orthographe.");
        }
        
        const backupData = await response.json();
        
        // Done yo fòmate dirèkteman pou afiche san pwoblèm rezo
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
        
    } catch (error) {
        // Si openconcepts gen pwoblèm, n ap eseye yon lòt fòma senp nèt
        input.setAttribute('aria-invalid', 'true');
        errorMessage.textContent = "Erreur de chargement. Veuillez réessayer.";
    } finally {
        loader.classList.add('hidden');
    }
});