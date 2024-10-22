
    // Define the species options for each crop
    const cropSpeciesOptions = {
        'Maize': ['Pop Corn', 'Flint Corn', 'Sweet Corn'],
        'Wheat': ['Durum Wheat', 'Bread Wheat', 'Emmer'],
        'Rice': ['Basmati', 'Jasmine', 'Arborio'],
        'Sorghum': ['Sweet Sorghum', 'Grain Sorghum', 'Forage Sorghum']
    };

    // Function to update the crop species dropdown based on the selected crop type
    document.getElementById('cropType').addEventListener('change', function() {
        const cropType = this.value;
        const cropSpecieSelect = document.getElementById('cropSpecie');

        // Clear the current options
        cropSpecieSelect.innerHTML = '<option data-display="Select">Choose...</option>';

        // Add the new species options based on the selected crop type
        if (cropSpeciesOptions[cropType]) {
            cropSpeciesOptions[cropType].forEach(function(specie) {
                const option = document.createElement('option');
                option.value = specie;
                option.textContent = specie;
                cropSpecieSelect.appendChild(option);
            });
        }
    });




    // Function to toggle the popup visibility
    function togglePopup() {
        const popup = document.getElementById('commentPopup');
        if (popup.style.display === 'block') {
            popup.style.display = 'none';
        } else {
            popup.style.display = 'block';
        }
    }

    // Add event listener to the feedback button to open the popup
    document.getElementById('feedbackButton').addEventListener('click', togglePopup);

    // Function to handle comment submission
    function submitComment() {
        const commentText = document.getElementById('commentText').value;

        if (commentText.trim() === '') {
            alert('Please enter a message.');
            return;
        }

        // Here you can send the comment to the server or store it
        // For now, we'll just display it in an alert
        alert('Thank you for your feedback: ' + commentText);

        // Clear the textarea after submission
        document.getElementById('commentText').value = '';

        // Close the popup
        togglePopup();
    }