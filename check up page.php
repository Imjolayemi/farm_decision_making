<?php

// openWeatherMap 9e3d1e02f89e5455b1a0e61cca97f497
// weatherapi ce359819af5548d899f165835242908
$error = ''; // Initialize the $error variable
$weatherResult = null; // Initialize the $weatherResult variable
$decisions = []; // Initialize the decisions array

if(array_key_exists('submit', $_POST) || array_key_exists('sbt', $_POST))
{
    if(empty($_POST['demo']))
    {
        $error = 'Sorry, your input field is empty';
    }
    else
    {
        $apiData = file_get_contents('https://api.openweathermap.org/data/2.5/weather?q='. $_POST['demo'] .'&appid=9e3d1e02f89e5455b1a0e61cca97f497');
        $weatherResult = json_decode($apiData, true);

        // Extract necessary data from form fields
        $fieldData = [
            'soilType' => $_POST['soilType'],
            'fieldSize' => $_POST['fieldSize'],
            'topography' => $_POST['topography'],
            'waterSource' => $_POST['waterSource'],
            'plantingDate' => $_POST['plantingDate'],
            'soilDepth' => $_POST['soilDepth'],
            'cropType' => $_POST['cropType']
        ];

        // Call makeDecision function to get decisions
        $decisions = makeDecision($weatherResult, $fieldData);
    }
}

// Function to make planting decisions based on weather and field data
function makeDecision($weatherResult, $fieldData) {
    $decisions = [];
    
    // Weather Data Evaluation
    $temperature = $weatherResult['main']['temp'] - 273.15; // Convert to Celsius
    $humidity = $weatherResult['main']['humidity'];
    $weatherCondition = $weatherResult['weather'][0]['main'];

    // Analyze Field Data
    $soilType = $fieldData['soilType'];
    $cropType = $fieldData['cropType'];
    $plantingDate = $fieldData['plantingDate'];
    $fieldSize = $fieldData['fieldSize'];
    $waterSource = $fieldData['waterSource'];

    // Decision Logic

    // 1. Soil Type and Crop Compatibility
    if ($cropType == 'Maize' && $soilType != 'Loamy') {
        $decisions[] = "Maize grows best in loamy soil. Consider improving soil conditions.";
    }

    // 2. Weather Condition for Planting
    if ($temperature < 10) {
        $decisions[] = "The current temperature ({$temperature}°C) is too cold for planting maize.";
    } elseif ($temperature > 30) {
        $decisions[] = "The temperature is too high. Consider waiting for cooler weather.";
    } else {
        $decisions[] = "The temperature is suitable for planting.";
    }

    // 3. Humidity
    if ($humidity > 70) {
        $decisions[] = "High humidity may lead to fungal infections. Take preventive measures.";
    }

    // 4. Water Source Evaluation
    if ($waterSource == 'Rainfed' && $weatherCondition != 'Rain') {
        $decisions[] = "Rainfed fields may suffer from drought. Consider irrigation.";
    }

    // 5. Planting Date
    $currentDate = date('Y-m-d');
    if (strtotime($plantingDate) > strtotime($currentDate)) {
        $decisions[] = "Planting date is in the future. Ensure you plant on time.";
    } else {
        $decisions[] = "The planting date is suitable.";
    }

    return $decisions;
}
?>

<!-- HTML Part -->
<div class="comment-section">
    <h2>Decision Result</h2>
    <div class="comment-form">
        <textarea name="comment" rows="5" placeholder="Your Decision Result will be shown here..."><?php 
            // Display the decisions inside the textarea
            if (!empty($decisions)) {
                echo implode("\n", $decisions); // Convert the array to a readable format
            }
        ?></textarea>
        <button type="submit" class="btn hvr-hover"><i class="fa fa-paper-plane"></i> Submit</button>
    </div>
</div>





function makeDecision($weatherResult, $fieldData) {
    $decisions = [];
    
    // Weather Data Evaluation
    $temperature = $weatherResult['main']['temp'] - 273.15; // Convert to Celsius
    $humidity = $weatherResult['main']['humidity'];
    $weatherCondition = $weatherResult['weather'][0]['main'];
    $windSpeed = $weatherResult['wind']['speed'];
    $precipitation = isset($weatherResult['rain']['1h']) ? $weatherResult['rain']['1h'] : 0;

    // Analyze Field Data
    $soilType = $fieldData['soilType'];
    $cropType = $fieldData['cropType'];
    $cropSpecies = $fieldData['cropSpecies']; // If user provides crop species
    $plantingDate = $fieldData['plantingDate'];
    $fieldSize = $fieldData['fieldSize'];
    $waterSource = $fieldData['waterSource'];
    $soilDepth = $fieldData['soilDepth'];
    $topography = $fieldData['topography'];

    // Best Practices and Guidelines for the Crop
    $decisions[] = "Here are the best practices for planting and maintaining {$cropType} ({$cropSpecies} if applicable):";

    if ($cropType == 'Maize') {
        // Best conditions for maize
        $decisions[] = "1. **Soil**: Maize thrives in **loamy soil** with good drainage. Soil pH should be between 5.5 and 7.5.";
        $decisions[] = "2. **Temperature**: Optimal temperature for maize growth is between **18°C and 27°C**.";
        $decisions[] = "3. **Soil Depth**: Ensure that soil depth is at least **30 cm** for proper root development.";
        $decisions[] = "4. **Spacing**: Plant seeds **25-30 cm apart**, with rows spaced about **75-90 cm apart**.";
        $decisions[] = "5. **Planting**: The best time to plant maize is after the last frost when the soil is warm. Ensure that planting depth is about **5 cm**.";
        $decisions[] = "6. **Irrigation**: Maize requires **regular watering**, especially during flowering and grain filling stages. Avoid waterlogging by ensuring proper drainage.";
        $decisions[] = "7. **Fertilization**: Apply nitrogen-based fertilizers at planting and during the growth stages to boost yield.";
        $decisions[] = "8. **Pest Control**: Consider using **organic or chemical fumigants** to control pests, especially during the early stages.";
        $decisions[] = "9. **Land Preparation**: Prepare the land by **tilling** to improve soil aeration and remove weeds.";
        $decisions[] = "10. **Harvesting**: Maize is typically ready for harvest **100-120 days after planting** depending on the variety. Harvest when kernels are fully matured and dry.";
    } else {
        $decisions[] = "Please research the best practices for planting {$cropType}.";
    }

    // Decision Logic Based on Input Data
    $currentDate = date('Y-m-d');
    
    // 1. Soil Type and Compatibility
    if ($cropType == 'Maize' && $soilType != 'Loamy') {
        $decisions[] = "Maize grows best in loamy soil. Consider improving soil conditions with organic matter or compost.";
    }

    // 2. Weather Condition for Planting
    if ($temperature < 10) {
        $decisions[] = "The current temperature ({$temperature}°C) is too cold for planting {$cropType}. Consider waiting for warmer weather.";
    } elseif ($temperature > 30) {
        $decisions[] = "The temperature is too high ({$temperature}°C). Maize prefers temperatures below 30°C. Consider waiting for cooler weather.";
    } else {
        $decisions[] = "The temperature is suitable for planting.";
    }

    // 3. Humidity and Fungal Risks
    if ($humidity > 70) {
        $decisions[] = "High humidity levels ({$humidity}%) may promote fungal infections. Consider applying **fungicide** to prevent diseases.";
    }

    // 4. Water Source and Irrigation Recommendations
    if ($waterSource == 'Rainfed' && $precipitation < 5) {
        $decisions[] = "Rainfed fields may suffer from drought with low precipitation ({$precipitation}mm). Consider irrigation to maintain soil moisture.";
    } elseif ($waterSource == 'Irrigated') {
        $decisions[] = "Maintain regular irrigation schedules to keep soil moisture at optimal levels.";
    }

    // 5. Planting Date
    if (strtotime($plantingDate) > strtotime($currentDate)) {
        $decisions[] = "Planting date is in the future ({$plantingDate}). Ensure you plant on time.";
    } else {
        $decisions[] = "The planting date is suitable.";
    }

    // 6. Tillage and Land Preparation
    $decisions[] = "Land preparation should include **tillage** to break up compacted soil and remove weeds. Consider using a plow or disc harrow.";

    // 7. Irrigation Schedule and Methods
    $decisions[] = "Irrigation should be done every **7-10 days** during dry periods. Use **drip irrigation** for efficient water use.";

    // 8. Fumigation and Pest Control
    $decisions[] = "Consider fumigating fields with **pest-specific fumigants** to control common maize pests such as **stem borers** and **armyworms**.";

    // 9. Crop Spacing and Population
    $decisions[] = "Ensure proper crop spacing (25-30 cm between plants) to allow air circulation and reduce competition for nutrients.";

    // 10. Harvest Timing and Storage
    $decisions[] = "Harvest the crop when it reaches full maturity. For maize, the optimal time is when the husks are dry and the kernels harden. Ensure proper storage to prevent post-harvest losses.";

    return $decisions;
}


