<?php
$error = ''; // Initialize the $error variable
$weatherResult = null; // Initialize the $weatherResult variable

if(array_key_exists('submit', $_POST) || array_key_exists('sbt', $_POST)) // Handle both 'submit' and 'sbt'
{
    // Check if the weather form (cityBox) was submitted
    if (!empty($_POST['cityBox'])) {
        $apiData = file_get_contents('https://api.openweathermap.org/data/2.5/weather?q='. $_POST['cityBox'] .'&appid=9e3d1e02f89e5455b1a0e61cca97f497');

        // Assuming $weatherResult contains the decoded JSON response from the API
        $weatherResult = json_decode($apiData, true);

        // Extracting the data
        $cityName = $weatherResult['name'];  // City name
        $country = $weatherResult['sys']['country'];  // Country code
        
        $temperatureInKelvin = $weatherResult['main']['temp'];  // Temperature in Kelvin
        $temperature = $temperatureInKelvin - 273.15;  // Convert to Celsius

        $weatherCondition = $weatherResult['weather'][0]['main'];  // Main weather condition
        $weatherDescription = $weatherResult['weather'][0]['description'];  // Detailed weather description
        $humidity = $weatherResult['main']['humidity'];  // Humidity percentage
        $windSpeed = $weatherResult['wind']['speed'];  // Wind speed in m/s
        $windDirection = $weatherResult['wind']['deg'];  // Wind direction in degrees
        $cloudCover = $weatherResult['clouds']['all'];  // Cloud cover percentage
        $pressure = $weatherResult['main']['pressure'];  // Atmospheric pressure in hPa
        $visibility = $weatherResult['visibility'];  // Visibility in meters
        $sunrise = date('H:i:s', $weatherResult['sys']['sunrise']);  // Sunrise time (converted to a readable format)
        $sunset = date('H:i:s', $weatherResult['sys']['sunset']);  // Sunset time (converted to a readable format)
    }

    // Handle field data submission
    if (isset($_POST['sbt'])) {
        $demo = $_POST['demo'];
        $soilType = $_POST['soilType'];
        $fieldSize = $_POST['fieldSize'];
        $topography = $_POST['topography'];
        $waterSource = $_POST['waterSource'];
        $plantingDate = $_POST['plantingDate'];
        $soilDepth = $_POST['soilDepth'];
        $cropType = $_POST['cropType'];

        // Output the demo and field data
        echo "<p>Good To Go {$demo}</p>";
        echo "<h3>Field Data:</h3>";
        echo "Soil Type: " . $soilType . "<br>";
        echo "Field Size: " . $fieldSize . "<br>";
        echo "Topography: " . $topography . "<br>";
        echo "Water Source: " . $waterSource . "<br>";
        echo "Planting Date: " . $plantingDate . "<br>";
        echo "Soil Depth: " . $soilDepth . "<br>";
        echo "Crop Type: " . $cropType . "<br>";
    }

    // Display weather data if available
    if ($weatherResult) {
        echo '<div class="alert alert-light" role="alert"><pre>';
        echo "Temperature: " . $temperature . "°C<br>";
        echo "Weather Condition: " . $weatherCondition . "<br>";
        echo "Weather Description: " . $weatherDescription . "<br>";
        echo "Humidity: " . $humidity . "%<br>";
        echo "Wind Speed: " . $windSpeed . " m/s<br>";
        echo "Wind Direction: " . $windDirection . "°<br>";
        echo "Cloud Cover: " . $cloudCover . "%<br>";
        echo "Pressure: " . $pressure . " hPa<br>";
        echo "Visibility: " . $visibility . " meters<br>";
        echo "Sunrise: " . $sunrise . "<br>";
        echo "Sunset: " . $sunset . "<br>";
        echo "City: " . $cityName . "<br>";
        echo "Country: " . $country . "<br><br>";
        echo '</pre></div>';
    }
}
?>






