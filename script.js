document.addEventListener('DOMContentLoaded', () => {

    //BSN VALIDATIE
    const bsnInput = document.querySelector('#bsn-input');
    const bsnError = document.querySelector('#bsn-error');

    // De functie voor de officiële Elfproef
    function isGeldigBSN(bsn) {
        if (bsn.length !== 9) return false;

        let sum = 0;
        // Vermenigvuldig de eerste 8 cijfers met aflopende getallen (9 t/m 2)
        for (let i = 0; i < 8; i++) {
            sum += parseInt(bsn.charAt(i)) * (9 - i);
        }
        // Het laatste (9e) cijfer vermenigvuldig je met -1
        sum += parseInt(bsn.charAt(8)) * -1;

        // Als de uitkomst deelbaar is door 11, is het een geldig BSN
        return sum % 11 === 0;
    } //Met behulp van Gemini

    // Controleer pas als de gebruiker het veld verlaat
    bsnInput.addEventListener('blur', () => {
        const waarde = bsnInput.value;

        if (waarde === '') {
            bsnError.style.display = 'none';
            bsnInput.setCustomValidity('');
        } else if (!/^\d+$/.test(waarde)) {
            bsnError.textContent = 'Een BSN mag alleen uit cijfers bestaan.';
            bsnError.style.display = 'block';
            bsnInput.setCustomValidity('Alleen cijfers toegestaan');
        } else if (waarde.length !== 9) {
            bsnError.textContent = 'Een BSN moet precies 9 cijfers lang zijn.';
            bsnError.style.display = 'block';
            bsnInput.setCustomValidity('Moet 9 cijfers zijn');
        } else if (!isGeldigBSN(waarde)) {
            bsnError.textContent = 'Dit is geen geldig BSN.';
            bsnError.style.display = 'block';
            bsnInput.setCustomValidity('Ongeldig BSN');
        } else {
            // Alles is goed!
            bsnError.style.display = 'none';
            bsnInput.setCustomValidity('');
        }
    });

    //Als je weer gaat typen gaat de foutmelding weg
    bsnInput.addEventListener('input', () => {
        bsnError.style.display = 'none';
        bsnInput.setCustomValidity('');
    });


    // Luister naar elke verandering in het hele formulier
    document.querySelector('form').addEventListener('change', () => {

        // We wachten heel even (10 milliseconden) zodat jouw CSS de tijd 
        // heeft om het blokje op 'display: none' te zetten
        setTimeout(() => {
            const alleExtraStappen = document.querySelectorAll('.extra-stap');

            alleExtraStappen.forEach(stap => {
                // Controleer of de browser het element heeft verborgen via jouw CSS
                if (window.getComputedStyle(stap).display === 'none') {

                    // Reset alle tekst, datum en nummer velden die erin zitten
                    stap.querySelectorAll('input[type="text"], input[type="date"], input[type="number"]').forEach(input => {
                        input.value = '';
                    });

                    // Vink alle radiobuttons in het verborgen blokje uit
                    stap.querySelectorAll('input[type="radio"]').forEach(radio => {
                        radio.checked = false;
                    });
                }
            });
        }, 10);
    });


    const stap1 = document.querySelector('#stap-1');
    const stap2 = document.querySelector('#stap-2');
    const btnVolgende = document.querySelector('#btn-volgende');
    const btnTerug = document.querySelector('#btn-terug');

    //VOLGENDE BUTTON
    if (btnVolgende) {
        btnVolgende.addEventListener('click', () => {
            const inputsStap1 = stap1.querySelectorAll('input');
            let allesGeldig = true;

            inputsStap1.forEach(input => {
                const isZichtbaar = input.offsetWidth > 0 && input.offsetHeight > 0;
                // Alleen zichtbare velden valideren
                if (isZichtbaar && !input.checkValidity()) {
                    allesGeldig = false;
                    input.reportValidity(); // Laat zien welk veld fout is
                }
            });


            // allesGeldig = true; 

            if (allesGeldig) {
                stap1.style.display = 'none';
                stap2.style.display = 'block';
                window.scrollTo(0, 0);
            }
        });
    }

    
    if (btnTerug) {
        btnTerug.addEventListener('click', () => {
            stap2.style.display = 'none';
            stap1.style.display = 'block';
        });
    }


   
    //GEMACHTIGDE KEUZE
   
    const radiosGemachtigde = document.querySelectorAll('input[name="gemachtigde_keuze"]');
    const inputBsn = document.querySelector('#input-bsn');
    const inputBecon = document.querySelector('#input-becon');
    const inputProtocol = document.querySelector('#input-protocol');

    radiosGemachtigde.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // 1. Verwijder eerst de verplichting van alle velden
            inputBsn.removeAttribute('required');
            inputBecon.removeAttribute('required');
            inputProtocol.removeAttribute('required');

            // 2. Zet de verplichting alléén op de keuze die zojuist is aangeklikt
            if (e.target.value === 'bsn') inputBsn.setAttribute('required', 'true');
            if (e.target.value === 'becon') inputBecon.setAttribute('required', 'true');
            if (e.target.value === 'protocol') inputProtocol.setAttribute('required', 'true');
        });
    });

    // Functie om required weg te halen bij onzichtbare velden
    function updateRequiredFields() {
        const alleInputs = document.querySelectorAll('input');

        alleInputs.forEach(input => {
            // Check of het veld (of de fieldset waar het in zit) verborgen is
            const isZichtbaar = input.offsetWidth > 0 && input.offsetHeight > 0;

            if (!isZichtbaar) {
                // Als het onzichtbaar is, mag het nooit 'required' zijn voor de browser
                if (input.hasAttribute('required')) {
                    input.setAttribute('data-was-required', 'true');
                    input.removeAttribute('required');
                }
            } else {
                // Als het weer zichtbaar wordt, zetten we 'required' terug als dat er eerst op stond
                if (input.getAttribute('data-was-required') === 'true') {
                    input.setAttribute('required', 'required');
                }
            }
        }); 
    }

    // Voer dit uit elke keer als er iets verandert in het formulier
    document.querySelector('form').addEventListener('change', updateRequiredFields);
    // En voer het uit als je op knoppen klikt
    document.querySelector('#btn-volgende')?.addEventListener('click', () => {
        setTimeout(updateRequiredFields, 50);
    });
});