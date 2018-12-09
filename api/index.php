<?php
$range = $_POST['range'];
function generateRandomDataRange($range) {
    echo "[\n";
    for ($i = 0; $i < $range; $i++) {
        echo "{\n";
        echo "                \"period\" : \"" . $i . "\",\n";
        echo "                \"temperature\" : \"" . rand(0,5000) . "\",\n";
        echo "                \"humidity\" : \"" . rand(0,5000) . "\",\n";
        echo "                \"consumption\" : \"" . rand(0,5000) . "\"\n";
        if ($i != ($range - 1)) {
                echo "            },\n";
        } else {
                echo "            }]\n";
        }
    }
}
function generateRandomData() {
	$range = "7";
	    echo "[\n";
	    for ($i = 0; $i < $range; $i++) {
	        echo "{\n";
	        echo "                \"period\" : \"" . $i . "\",\n";
	        echo "                \"temperature\" : \"" . rand(0,5000) . "\",\n";
	        echo "                \"humidity\" : \"" . rand(0,5000) . "\",\n";
	        echo "                \"consumption\" : \"" . rand(0,5000) . "\"\n";
		if ($i != ($range - 1) ) {
			echo "            },\n";
		} else {
			echo "            }]\n";
		}
	    }
	}
if (isset($range)) {
        generateRandomDataRange($range);
} else {
	generateRandomData();
}
?>
