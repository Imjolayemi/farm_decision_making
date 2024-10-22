<?php
try {
  include "connect_db.php";


  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $sql = "INSERT INTO user_info (first_name, last_name, e_mail, password)
  VALUES ('$fname', '$lname', '$mail', '$passwrd')";
  // use exec() because no results are returned
  $conn->exec($sql);
  echo "New record created successfully";
} catch(PDOException $e) {
  echo $sql . "<br>" . $e->getMessage();
}

?>