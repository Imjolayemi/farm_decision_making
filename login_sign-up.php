<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['register'])) {
        $fname = $_POST['fname'];
        $mail = $_POST['mail'];
        $lname = $_POST['lname'];
        $passwrd = $_POST['password'];

        // including the insert to table page
        include "insert_to_tb.php";

        if ($fname && $lname && $passwrd && $mail) {
            echo '<p class="error-message">You Are Now Successfully Registered.</p>';
        } else {
            echo '<p class="error-message">Invalid username or password.</p>';
        }
    }

    if (isset($_POST['login'])) {
        $mail0 = $_POST['mail0'];
        $passwrd0 = $_POST['password0'];

        if ($mail0 && $passwrd0) {
            header("Location:fetchLocationData.php");
            exit();
        } else {
            echo '<p class="error-message">Invalid email or password.</p>';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FARM WISE TECHNOLOGY</title>
    <link rel="shortcut icon" href="images/favicon.png" type="image/x-icon">
    <link rel="apple-touch-icon" href="images/favicon.png">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
    <link rel="stylesheet" href="css/custom.css">
</head>
<body>
    <form action="login_sign-up.php" method="post" enctype="multipart/form-data">
        <header class="main-header1">
            <nav class="navbar1 navbar-expand-lg navbar-light bg-light navbar-default bootsnav">
                <div class="container1">
                    <div class="navbar-header1">
                        <img src="images/Group_9.png" class="logo1" alt="">
                    </div>
                </div>
            </nav>
        </header>

        <div class="cart-box-main">
            <div class="container">
                <div class="row new-account-login">
                    <div class="col-sm-6 col-lg-6 mb-3">
                        <div class="title-left">
                            <h3>Account Login</h3>
                        </div>
                        <h5><a data-toggle="collapse" href="#formLogin" role="button" aria-expanded="false">Click here to Login</a></h5>
                        <form class="mt-3 collapse review-form-box" id="formLogin">
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="InputEmail" class="mb-0">Email Address</label>
                                    <input type="email" class="form-control" id="InputEmail" name="mail0" placeholder="Enter Email" required>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="InputPassword" class="mb-0">Password</label>
                                    <input type="password" class="form-control" id="InputPassword" name="password0" placeholder="Password" required>
                                </div>
                            </div>
                            <input type="submit" class="btn hvr-hover" name="login" value="Login">
                        </form>
                    </div>
                    <div class="col-sm-6 col-lg-6 mb-3">
                        <div class="title-left">
                            <h3>Create New Account</h3>
                        </div>
                        <h5><a data-toggle="collapse" href="#formRegister" role="button" aria-expanded="false">Click here to Register</a></h5>
                        <form class="mt-3 collapse review-form-box" id="formRegister">
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="InputName" class="mb-0">First Name</label>
                                    <input type="text" class="form-control" id="InputName" name="fname" placeholder="First Name" required>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="InputLastname" class="mb-0">Last Name</label>
                                    <input type="text" class="form-control" id="InputLastname" name="lname" placeholder="Last Name" required>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="InputEmail1" class="mb-0">Email Address</label>
                                    <input type="email" class="form-control" id="InputEmail1" name="mail" placeholder="Enter Email" required>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="InputPassword1" class="mb-0">Password</label>
                                    <input type="password" class="form-control" id="InputPassword1" name="password" placeholder="Password" required>
                                </div>
                            </div>
                            <input type="submit" class="btn hvr-hover" name="register" value="Register">
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <script src="js/jquery-3.2.1.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/jquery.superslides.min.js"></script>
    <script src="js/bootstrap-select.js"></script>
    <script src="js/inewsticker.js"></script>
    <script src="js/bootsnav.js"></script>
    <script src="js/images-loded.min.js"></script>
    <script src="js/isotope.min.js"></script>
    <script src="js/owl.carousel.min.js"></script>
    <script src="js/baguetteBox.min.js"></script>
    <script src="js/form-validator.min.js"></script>
    <script src="js/contact-form-script.js"></script>
    <script src="js/custom.js"></script>
</body>
</html>
