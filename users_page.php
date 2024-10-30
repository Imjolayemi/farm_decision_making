<?php
    include "connect_db.php";
    $apiKey = "9e3d1e02f89e5455b1a0e61cca97f497"; // Replace with your OpenWeatherMap API key

// Check if latitude and longitude are set in the query string
if (isset($_GET['lat']) && isset($_GET['lon'])) {
    $lat = $_GET['lat'];
    $lon = $_GET['lon'];

    // Fetch weather data using the latitude and longitude
    $apiUrl = "http://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lon}&appid={$apiKey}";
    $weatherData = file_get_contents($apiUrl);
    $weather = json_decode($weatherData, true);

    
    $temperatureCelsius1 = $weather['main']['temp'] - 273.15; // Convert temperature from Kelvin to Celsius
    $description1 = $weather['weather'][0]['description'];
    $humidity1 = $weather['main']['humidity']; // Humidity percentage
    $city1 = $weather['name']; // Get the city name based on coordinates
    $country1 = $weather['sys']['country'];  // Country code
    $weatherCondition1 = $weather['weather'][0]['main'];  // Main weather condition
    $windSpeed1 = $weather['wind']['speed'];  // Wind speed in m/s
    $windDirection1 = $weather['wind']['deg'];  // Wind direction in degrees
    $cloudCover1 = $weather['clouds']['all'];  // Cloud cover percentage
    $pressure1 = $weather['main']['pressure'];  // Atmospheric pressure in hPa
    $visibility1 = $weather['visibility'];  // Visibility in meters

    $timezone1 = new DateTimeZone('Africa/Lagos'); // Set your timezone
    $sunrise1 = (new DateTime("@{$weather['sys']['sunrise']}"))->setTimezone($timezone1)->format('H:i:s');  // Sunrise time (converted to a readable format)
    $sunset1 = (new DateTime("@{$weather['sys']['sunset']}"))->setTimezone($timezone1)->format('H:i:s');  // Sunset time (converted to a readable format)


    // Get the current date
    $currentDate = date('Y-m-d H:i:s'); // This will get the date in 'YYYY-MM-DD HH:MM:SS' format

} else {
    echo "Location data not available.";
}


// openWeatherMap 9e3d1e02f89e5455b1a0e61cca97f497
// weatherapi ce359819af5548d899f165835242908
$error = ''; // Initialize the $error variable
$weatherResult = null; // Initialize the $weatherResult variable


if(array_key_exists('submit', $_POST) || array_key_exists('sbt', $_POST))
{
    // if(empty($_POST['cityBox']) || empty($_POST['demo'])) // Check if the cityBox input is empty
    if(empty($_POST['demo']))
    {
        $error = 'Sorry, your input field is empty';
    }
    else
    {

        // Check if the form is submitted
        if (isset($_POST['demo'])) {
            $city = $_POST['demo'];
            // $apiKey = '9e3d1e02f89e5455b1a0e61cca97f497';  // Replace with your OpenWeatherMap API key
            $apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' . $city . '&appid=' . $apiKey;

            // Fetch Weather Data with Error Handling
            $apiData = @file_get_contents($apiUrl);

            if ($apiData === FALSE) {
                // Error fetching the data (e.g., invalid API request)
                $error = 'Error fetching weather data (Region not available. Please check the city and country name).';
                
            } else {
                $weatherResult = json_decode($apiData, true);

                // Check if city exists in the API response
                if ($weatherResult['cod'] == 200) {
                    // City is valid, extract data
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


                    $timezone = new DateTimeZone('Africa/Lagos'); // Set your timezone
                    $sunrise = (new DateTime("@{$weatherResult['sys']['sunrise']}"))->setTimezone($timezone)->format('H:i:s');
                    $sunset = (new DateTime("@{$weatherResult['sys']['sunset']}"))->setTimezone($timezone)->format('H:i:s');


                    $soilType = $_POST['soilType'];
                    $fieldSize = $_POST['fieldSize'];
                    $topography = $_POST['topography'];
                    $waterSource = $_POST['waterSource'];
                    $plantingDate = $_POST['plantingDate'];
                    $soilDepth = $_POST['soilDepth'];
                    $cropType = $_POST['cropType'];
                    $cropSpecie = $_POST['cropSpecie'];
            
            
            
                     // Extract necessary data from form fields
                     $fieldData = [
                        'soilType' => $_POST['soilType'],
                        'fieldSize' => $_POST['fieldSize'],
                        'topography' => $_POST['topography'],
                        'waterSource' => $_POST['waterSource'],
                        'plantingDate' => $_POST['plantingDate'],
                        'soilDepth' => $_POST['soilDepth'],
                        'cropType' => $_POST['cropType'],
                        'cropSpecie' => $_POST['cropSpecie']
                    ];
            
                    // Call makeDecision function to get decisions
                    $decisions = makeDecision($weatherResult, $fieldData);

                    // SQL statement with placeholders
                    $sql = "INSERT INTO weather_and_field_data (city, country, temperature, weather_condition, weather_description, humidity, wind_speed, wind_direction, cloud_cover, pressure, visibility, sunrise, sunset, soil_type, field_size, topography, water_source, planting_date, soil_depth, crop_type, crop_specie)
                            VALUES (:city, :country, :temperature, :weatherCondition, :weatherDescription, :humidity, :windSpeed, :windDirection, :cloudCover, :pressure, :visibility, :sunrise, :sunset, :soilType, :fieldSize, :topography, :waterSource, :plantingDate, :soilDepth, :cropType, :cropSpecie)";

                    // Prepare statement
                    $stmt = $conn->prepare($sql);

                    // Bind parameters
                    $stmt->bindParam(':city', $cityName);
                    $stmt->bindParam(':country', $country);
                    $stmt->bindParam(':temperature', $temperature);
                    $stmt->bindParam(':weatherCondition', $weatherCondition);
                    $stmt->bindParam(':weatherDescription', $weatherDescription);
                    $stmt->bindParam(':humidity', $humidity);
                    $stmt->bindParam(':windSpeed', $windSpeed);
                    $stmt->bindParam(':windDirection', $windDirection);
                    $stmt->bindParam(':cloudCover', $cloudCover);
                    $stmt->bindParam(':pressure', $pressure);
                    $stmt->bindParam(':visibility', $visibility);
                    $stmt->bindParam(':sunrise', $sunrise);
                    $stmt->bindParam(':sunset', $sunset);
                    $stmt->bindParam(':soilType', $soilType);
                    $stmt->bindParam(':fieldSize', $fieldSize);
                    $stmt->bindParam(':topography', $topography);
                    $stmt->bindParam(':waterSource', $waterSource);
                    $stmt->bindParam(':plantingDate', $plantingDate);
                    $stmt->bindParam(':soilDepth', $soilDepth);
                    $stmt->bindParam(':cropType', $cropType);
                    $stmt->bindParam(':cropSpecie', $cropSpecie);

                    // Execute the prepared statement
                    if ($stmt->execute()) {
                        echo "<script>alert('Data inserted successfully!');</script>";
                    } else {
                        echo "<script>alert('Error inserting data.');</script>";
                    }

                } else {
                    // City or country not found
                    echo "Region not available. Please check the city and country name.";
                }
            }
        }

    }


    
}


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
        $cropSpecies = $fieldData['cropSpecie'];; // If user provides crop species
        $plantingDate = $fieldData['plantingDate'];
        $fieldSize = $fieldData['fieldSize'];
        $waterSource = $fieldData['waterSource'];
        $soilDepth = $fieldData['soilDepth'];
        $topography = $fieldData['topography'];


        // Define ideal conditions for maize
        $idealConditions = [
            'cropType' => 'Maize',
            'minTemp' => 18,
            'maxTemp' => 27,
            'minHumidity' => 40,
            'maxHumidity' => 70,
        ];
    
        // Best Practices and Guidelines for the Crop
        $decisions[] = "Here are the best practices for planting and maintaining {$cropType} ({$cropSpecies} if applicable):";
    
        if ($cropType == 'Maize') {
            // Best conditions for maize
            $decisions[] = "1. Soil: Maize thrives in loamy soil with good drainage. Soil pH should be between 5.5 and 7.5.";
            $decisions[] = "2. Temperature: Optimal temperature for maize growth is between 18°C and 27°C.";
            $decisions[] = "3. Soil Depth: Ensure that soil depth is at least 30 cm for proper root development.";
            $decisions[] = "4. Spacing: Plant seeds 25-30 cm apart, with rows spaced about 75-90 cm apart.";
            $decisions[] = "5. Planting: The best time to plant maize is after the last frost when the soil is warm. Ensure that planting depth is about 5 cm.";
            $decisions[] = "6. Irrigation: Maize requires regular watering, especially during flowering and grain filling stages. Avoid waterlogging by ensuring proper drainage.";
            $decisions[] = "7. Fertilization: Apply nitrogen-based fertilizers at planting and during the growth stages to boost yield.";
            $decisions[] = "8. Pest Control: Consider using organic or chemical fumigants to control pests, especially during the early stages.";
            $decisions[] = "9. Land Preparation: Prepare the land by tilling to improve soil aeration and remove weeds.";
            $decisions[] = "10. Harvesting: Maize is typically ready for harvest 100-120 days after planting depending on the variety. Harvest when kernels are fully matured and dry.";


            // Compare weather conditions with ideal conditions
            $currentWeatherDecisions = compareWeather($weatherResult, $idealConditions);
            foreach ($currentWeatherDecisions as $decision) {
                $decisions[] = $decision;
            }
            
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
            $decisions[] = "High humidity levels ({$humidity}%) may promote fungal infections. Consider applying fungicide to prevent diseases.";
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
        $decisions[] = "Land preparation should include tillage to break up compacted soil and remove weeds. Consider using a plow or disc harrow.";
    
        // 7. Irrigation Schedule and Methods
        $decisions[] = "Irrigation should be done every 7-10 days during dry periods. Use drip irrigation for efficient water use.";
    
        // 8. Fumigation and Pest Control
        $decisions[] = "Consider fumigating fields with pest-specific fumigants to control common maize pests such as stem borers and armyworms.";
    
        // 9. Crop Spacing and Population
        $decisions[] = "Ensure proper crop spacing (25-30 cm between plants) to allow air circulation and reduce competition for nutrients.";
    
        // 10. Harvest Timing and Storage
        $decisions[] = "Harvest the crop when it reaches full maturity. For maize, the optimal time is when the husks are dry and the kernels harden. Ensure proper storage to prevent post-harvest losses.";
    
        return $decisions;
    }
    

    // Compare weather conditions
    function compareWeather($weatherResult, $idealConditions) {
        $currentTemp = $weatherResult['main']['temp'] - 273.15; // Current temp in Celsius
        $currentHumidity = $weatherResult['main']['humidity'];
        
        $decision = [];

        // Compare temperature
        if ($currentTemp < $idealConditions['minTemp']) {
            $decision[] = "The current temperature is too low for {$idealConditions['cropType']}. Consider protecting crops from frost.";
        } elseif ($currentTemp > $idealConditions['maxTemp']) {
            $decision[] = "The current temperature is too high. You may need to irrigate to prevent heat stress.";
        } else {
            $decision[] = "The temperature is suitable for {$idealConditions['cropType']}.";
        }

        // Compare humidity
        if ($currentHumidity < $idealConditions['minHumidity']) {
            $decision[] = "Humidity is too low for optimal crop growth. Ensure sufficient irrigation.";
        } elseif ($currentHumidity > $idealConditions['maxHumidity']) {
            $decision[] = "High humidity can cause fungal issues. Consider applying fungicides.";
        }

        return $decision;
    }
?>



<!DOCTYPE html>
<html lang="en">
<!-- Basic -->

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- Mobile Metas -->
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Site Metas -->
    <title>FARM WISE TECHNOLOGY</title>
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Site Icons -->
    <link rel="shortcut icon" href="images/favicon.png" type="image/x-icon">
    <link rel="apple-touch-icon" href="images/favicon.png.png">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <!-- Site CSS -->
    <link rel="stylesheet" href="css/style.css">
    <!-- Responsive CSS -->
    <link rel="stylesheet" href="css/responsive.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/custom.css">
    
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>
    <!-- <form action="" method="post" enctype="multipart/form-data"> -->
        <!-- Start Main Top -->
        <header class="main-header">
            <!-- Start Navigation -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light navbar-default bootsnav">
                <div class="container">
                    <!-- Start Header Navigation -->
                    <div class="navbar-header">
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-menu" aria-controls="navbars-rs-food" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="fa fa-bars"></i>
                    </button>
                        <a class="navbar-brand" href="index.html"><img src="images/Group_9.png" class="logo" alt=""></a>
                    </div>
                    <!-- End Header Navigation -->

                    <!-- Start Atribute Navigation -->
                    <div class="attr-nav">
                        <ul>
                            <li class="search"><a href="#"><i class="fa fa-search"></i></a></li>
                            <li class="side-menu"><a href="#">
                            <i class="fa fa-leaf"></i>
                                <span class="badge"></span>
                                <strong>My Profile</strong>
                        </a></li>
                        </ul>
                    </div>
                    <!-- End Atribute Navigation -->
                </div>
                <!-- Start Side Menu -->
                <div class="side">
                    <a href="#" class="close-side"><i class="fa fa-times"></i></a>
                    <li class="cart-box">
                        <ul class="cart-list">
                            <li>
                                <h6>First Name</h6>
                            </li>
                            <li>
                                <h6>Last Name</h6>
                            </li>
                            <li>
                                <h6>E-mail</h6>
                            </li>
                            <li class="total">
                                <a href="index.php" class="btn btn-default hvr-hover btn-cart">LOG-OUT</a>
                                <!-- <span class="float-right"><strong>Total</strong></span> -->
                            </li>
                        </ul>
                    </li>
                </div>
                <!-- End Side Menu -->
            </nav>
            <!-- End Navigation -->
        </header>
        <!-- End Main Top -->

        <!-- Start Top Search -->
        <div class="top-search">
            <div class="container">
                <div class="input-group">
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                    <input type="text" class="form-control" placeholder="Search">
                    <span class="input-group-addon close-search"><i class="fa fa-times"></i></span>
                </div>
            </div>
        </div>
        <!-- End Top Search -->


        <!-- Start of weather conditon -->
        <div class="globalWeatherContainer">
            <h1>Search Global Weather</h1>
            <form action="" method="post" enctype="multipart/form-data">
                <label for="city">Enter Your City Here</label>
                <p>
                    <input type="text" name="cityBox" id="cityBox" class="cityBox" placeholder="City Name">
                </p>
                <button type="submit" name="submit" class="btn btn-success">Submit Now</button>

                <div class="output">
                    <?php 
                        if ($error) {
                            echo '<div class="alert alert-danger" role="alert">' . $error . '</div>';
                        }

                        if ($weatherResult) {
                            echo '<div class="alert alert-light" role="alert"><pre>';
                            // print_r($weatherResult);
                            // Displaying the extracted data
                            echo "Temperature: " . $temperature . " K<br>";
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
                            echo "Country: " . $country . "<br>"; 
                            echo "Today's Date: " . $currentDate . "<br><br>";
                            
                            // Output the demo and field data
                            echo "<h3>Field Data:</h3>";
                            echo "Soil Type: " . $soilType . "<br>";
                            echo "Field Size: " . $fieldSize . "<br>";
                            echo "Topography: " . $topography . "<br>";
                            echo "Water Source: " . $waterSource . "<br>";
                            echo "Planting Date: " . $plantingDate . "<br>";
                            echo "Soil Depth: " . $soilDepth . "<br>";
                            echo "Crop Type: " . $cropType . "<br>";
                            echo "Crop Specie: " . $cropSpecie . "<br><br>";

                            echo '</pre></div>';
                        }
                    ?>
                </div>
            </form>
        </div>
        <!-- End of Weather Condition -->
        
        <!-- Start Cart  -->
        <div class="cart-box-main">

            <div class="container">
                <div class="row new-account-login">
                    <div class="col-sm-6 col-lg-6 mb-3">
                    <form action="" method="post" enctype="multipart/form-data">
                        <div class="title-left">
                            <h3>Field Data</h3>
                        </div>
                        <h5><a data-toggle="collapse" href="#formLogin" role="button" aria-expanded="false">Click here to fill Field Data</a></h5>
                        <div class="mt-3 collapse review-form-box" id="formLogin">
                            <!-- <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="InputEmail" class="mb-0">Email Address</label>
                                    <input type="email" class="form-control" id="InputEmail" placeholder="Enter Email"> </div>
                                <div class="form-group col-md-6">
                                    <label for="InputPassword" class="mb-0">Password</label>
                                    <input type="password" class="form-control" id="InputPassword" placeholder="Password"> </div>
                            </div> -->

                            <input type="text" class="form-control" id="firstName" name="demo" placeholder="Enter Your City Name"required>
                            
                                <div class="row">
                                    <div class="col-md-5 mb-3">
                                        <label for="soilType">Soil Type *</label>
                                        <select class="wide w-100" id="country" name="soilType">
                                            <option value="Choose..." data-display="Select">Choose...</option>
                                            <option value="Loamy">Loamy</option>
                                            <option value="Clay">Clay</option>
                                            <option value="Sandy">Sandy</option>
                                            <option value="Silty">Silty</option>
                                            <option value="Peaty">Peaty</option>
                                        </select>
                                        <div class="invalid-feedback"> Soil Type is required. </div>
                                    </div>

                                    <div class="col-md-6 mb-3">
                                        <label for="fieldSize">Field Size (in hecteres) *</label>
                                        <input type="number" class="form-control" id="fieldSize" name="fieldSize" placeholder="" value="" required>
                                        <div class="invalid-feedback"> Valid Field Size is required. </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="topography">Topography *</label>
                                        <!-- <input type="text" class="form-control" id="username" name="topography" placeholder="" required> -->
                                        <select id="topography" name="topography"  class="form-control" required>
                                            <option value="Choose..." data-display="Select">Choose...</option>
                                            <option value="Flat">Flat</option>
                                            <option value="Hilly">Hilly</option>
                                            <option value="Mountainous">Mountainous</option>
                                        </select>
                                        <div class="invalid-feedback" style="width: 100%;"> Your Topography is required. </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="waterSource">Water Source *</label>
                                        <!-- <input type="text" class="form-control" id="email" name="waterSource" placeholder="" required> -->
                                        <select id="waterSource" name="waterSource" class="form-control" required>
                                            <option value="Choose..." data-display="Select">Choose...</option>
                                            <option value="Rainfed">Rainfed</option>
                                            <option value="Irrigated">Irrigated</option>
                                        </select>
                                        <div class="invalid-feedback"> Your Water Source is required. </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="plantingDate">Planting Date *</label>
                                        <input type="date" class="form-control" id="plantingDate" name="plantingDate" placeholder="" required>
                                        <!-- <input type="date" id="plantingDate" name="plantingDate" required> -->
                                        <div class="invalid-feedback"> Please enter your Planting Date. </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="soilDepth">Soil Depth (in cm): *</label>
                                        <input type="number" id="soilDepth" name="soilDepth" placeholder="Enter soil depth" class="form-control" required>
                                        <div class="invalid-feedback"> Please enter your Soil Depth. </div>
                                    </div>
                                </div>

                                    
                                <div class="row">
                                    <div class="col-md-5 mb-3">
                                    <label for="cropType">Crop Type: *</label>
                                    <select class="wide w-100" id="cropType" name="cropType" required>
                                        <option value="Choose..." data-display="Select">Choose...</option>
                                        <option value="Maize">Maize</option>
                                        <option value="Wheat">Wheat</option>
                                        <option value="Rice">Rice</option>
                                        <option value="Sorghum">Sorghum</option>
                                    </select>
                                        <div class="invalid-feedback"> Please select a Crop Type. </div>
                                    </div>

                                    <!-- <div class="col-md-4 mb-3">
                                        <label for="state">Crop Specie *</label>
                                        <select class="wide w-100" id="state">
                                        <option data-display="Select">Choose...</option>
                                        <option>Pop Corn</option>
                                    </select>
                                        <div class="invalid-feedback">Please select a Crop Specie. </div>
                                    </div> -->

                                    <div class="col-md-4 mb-3"> 
                                        <!-- Crop Species Dropdown -->
                                        <label for="cropSpecie">Crop Specie *</label>
                                        <select class="wide w-100" id="cropSpecie" name="cropSpecie" required>
                                            <option data-display="Select">Choose...</option>
                                        </select>
                                        <div class="invalid-feedback">Please select a Crop Specie.</div>
                                    </div>
                                </div>

                            <!-- <button type="submit" name="sbt" class="btn hvr-hover">Submit</button> -->
                            <input type="submit" class="btn hvr-hover" name="sbt" value="Submit">
                        </div>
                    </form>
                    </div>
                    
                    <div class="col-sm-6 col-lg-6 mb-3">
                        <div class="title-left">
                            <h3>Previous Decisions</h3>
                        </div>
                        <h5><a data-toggle="collapse" href="#formRegister" role="button" aria-expanded="false">Click here for previous Decisions</a></h5>
                        <form class="mt-3 collapse review-form-box" id="formRegister">
                            <!-- <div class="form-row">
                                <textarea name="comment" rows="5" placeholder="Your Decision Result will be shown here...">
                                    
                                </textarea>
                            </div> -->

                            <div class="comment-section">
                                <h2>Previous Decisions</h2>
                                <div class="comment-form">
                                    <textarea name="comment" rows="5" placeholder="Your Previous Decisions Result will be shown here..."></textarea>
                                </div>
                            </div>
                            
                        </form>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6 col-lg-6 mb-3">
                        <div class="checkout-address">

                            <div class="title-left">
                                <!-- <h3>Decision Result</h3> -->
                            </div>


                            <div class="comment-section">
                                <h2>Decision Result</h2>
                                <div class="comment-form">
                                    <form action="" method="post" enctype="multipart/form-data">
                                        <div name="comment" rows="5" placeholder="Your Decision Result will be shown here...">
                    
                                            <?php 
                                                if ($error) {
                                                    echo '<div class="alert alert-danger" role="alert">' . $error . '</div>';
                                                }

                                                // if ($weatherResult) {
                                                //     echo '<div class="alert alert-light" role="alert"><pre>';

                                                //     if (!empty($decisions)) {
                                                //         echo implode("\n", $decisions); // Convert the array to a readable format
                                                //     }

                                                //     echo '</pre></div>';
                                                // }



                                                if ($weatherResult) {
                                                    echo '<div class="alert alert-light" role="alert"><pre>';
                                                    
                                                    if (!empty($decisions)) {
                                                        echo implode("\n", $decisions); // Convert the array to a readable format
                                                
                                                        // Assuming you have the $weatherDataId available from the previous insert
                                                        $weatherDataId = $conn->lastInsertId(); // Get the last inserted ID from weather_data table
                                                
                                                        // Prepare SQL statement to insert decisions
                                                        $sql = "INSERT INTO decisions (weather_and_field_data_id, decision_text) VALUES (:weather_and_field_data_id, :decision_text)";
                                                
                                                        // Prepare the statement
                                                        $stmt = $conn->prepare($sql);
                                                
                                                        // Bind parameters and execute for each decision
                                                        foreach ($decisions as $decision) {
                                                            $stmt->bindParam(':weather_and_field_data_id', $weatherDataId);
                                                            $stmt->bindParam(':decision_text', $decision);
                                                            $stmt->execute();
                                                        }
                                                
                                                        echo "Decisions saved successfully!";
                                                    }
                                                
                                                    echo '</pre></div>';
                                                }
                                                
                                            ?>
    
                                        </div>
                                        <!-- <button type="submit" class="btn hvr-hover"><i class="fa fa-paper-plane"></i> Submit</button> -->
                                        <input type="submit" class="btn hvr-hover" name="sbt" value="Submit">
                                    </form>
                                </div>
                            </div>

                            <div class="title-left">
                                <h3>Water Source</h3>
                            </div>

                            <div class="rounded p-2 bg-light">
                                This is the origin of the water used for irrigation on the farm, such as rainwater, wells, rivers, or lakes.This helps to provide tailored irrigation schedules and water management strategies to ensure crops receive adequate water supply
                            </div>

                            <div class="title-left">
                                <h3>Topography</h3>
                            </div>

                            <div class="rounded p-2 bg-light">
                                This is the physical characteristics of the farm's landscape, including its elevation, slope, and contour. This helps in assessing water drainage patterns, erosion risks, and suitable planting areas, leading to better land use and crop placement decisions.
                            </div>

                            <div class="title-left">
                                <h3>Soil Depth</h3>
                            </div>

                            <div class="rounded p-2 bg-light">
                                This is the thickness of the soil layer available for root growth, typically measured in centimeters or inches.This helps to recommend suitable crops and planting methods, ensuring optimal root development and nutrient uptake.
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-6 mb-3">
                        <div class="row">
                            <div class="col-md-12 col-lg-12">
                                <div class="order-box">
                                    <div class="title-left">
                                        <h3>Soil Type</h3>
                                    </div>
                                    <div class="rounded p-2 bg-light">
                                    This is the classification of soil based on its physical and chemical properties, such as sandy, clayey, loamy, or silty soil. This helps to recommend suitable crops, soil amendments, and fertilization plans to enhance soil health and crop productivity.
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 col-lg-12">
                                <div class="order-box">
                                    <div class="title-left">
                                        <h3>Farm Size</h3>
                                    </div>
                                    <div class="rounded p-2 bg-light">
                                    The total area of the farm, typically measured in hectares or acres.
                                    This helps to calculate the appropriate planting density, resource requirements, and overall crop management strategies.
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 col-lg-12">
                                <div class="order-box">
                                    <div class="title-left">
                                        <h3>Planting Date</h3>
                                    </div>
                                    <div class="rounded p-2 bg-light">
                                    This is the specific date or time period when crops are sown or transplanted into the field. This helps to provide timely agricultural advice, including optimal harvesting times, pest control schedules, and irrigation plans. The app uses this information along with weather forecasts to optimize planting times for maximum yield and minimize the risk of crop damage due to adverse weather conditions.
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-12 col-lg-12">
                                <div class="order-box">
                                    <div class="title-left">
                                        <h3>Crop Type</h3>
                                    </div>
                                    <div class="rounded p-2 bg-light">
                                    This is the general category of crops grown on the farm, such as grains, vegetables, fruits, or legumes. This helps to provide specific cultivation guidelines, pest management strategies, and yield predictions tailored to the chosen category.
                                    </div>
                                </div>
                            </div>


                            <div class="col-md-12 col-lg-12">
                                <div class="order-box">
                                    <div class="title-left">
                                        <h3>Crop Specie</h3>
                                    </div>
                                    <div class="rounded p-2 bg-light">
                                    This is the specific variety or species of the crop within the chosen crop type, such as maize, wheat, tomatoes, or apples. This helps to offer precise recommendations on planting dates, soil requirements, and pest control measures specific to that species.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <!-- End Cart -->

        <!-- current environment weather information widget -->

        <div id="weatherWidget">
            <h3>Day-Day Weather Condition in <?php echo htmlspecialchars($city1); ?></h3>
            <p>
                <?php 
                    // Build the output string
                    $output = "Condition: " . ucfirst($description1) . "<br>" .
                            "Temperature: " . round($temperatureCelsius1, 1) . "°C<br>" .
                            "Humidity: " . $humidity1 . "%<br>" .
                            "Weather Condition: " . $weatherCondition1 . "<br>" .
                            "Wind Speed: " . $windSpeed1 . " m/s<br>" .
                            "Wind Direction: " . $windDirection1 . "°<br>" .
                            "Cloud Cover: " . $cloudCover1 . "%<br>" .
                            "Pressure: " . $pressure1 . " hPa<br>" .
                            "Visibility: " . $visibility1 . " meters<br>" .
                            "Sunrise: " . $sunrise1 . "<br>" .
                            "Sunset: " . $sunset1 . "<br>" .
                            "Country: " . $country1 . "<br>" .
                            "<b> Today's Date: " . $currentDate . "<b>";

                    // Echo the complete output
                    echo $output;
                ?>
            </p>
        </div>

        <!-- end of current environment weather information widget -->

        <!-- Floating Button -->
        <button id="feedbackButton">
            <i class="fa fa-paper-plane"></i> Give Feedback
        </button>

        <!-- Comment Popup -->
        <div id="commentPopup">
            <div id="commentPopupHeader">
                <span>Leave a Comment</span>
                <span class="closePopup" onclick="togglePopup()">&times;</span>
            </div>
            <div id="commentPopupBody">
                <textarea id="commentText" placeholder="Your message..."></textarea>
                <button onclick="submitComment()">Submit</button>
            </div>
        </div>


        <a href="#" id="back-to-top" title="Back to top" style="display: none;">&uarr;</a>
    <!-- </form> -->

        <!-- ALL JS FILES -->
        <script src="js/jquery-3.2.1.min.js"></script>
        <script src="js/popper.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/script.js"></script>
        <!-- ALL PLUGINS -->
        <script src="js/jquery.superslides.min.js"></script>
        <script src="js/bootstrap-select.js"></script>
        <script src="js/inewsticker.js"></script>
        <script src="js/bootsnav.js."></script>
        <script src="js/images-loded.min.js"></script>
        <script src="js/isotope.min.js"></script>
        <script src="js/owl.carousel.min.js"></script>
        <script src="js/baguetteBox.min.js"></script>
        <script src="js/form-validator.min.js"></script>
        <script src="js/contact-form-script.js"></script>
        <script src="js/custom.js"></script>
        <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script> -->
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy" crossorigin="anonymous"></script>
</body>

</html>