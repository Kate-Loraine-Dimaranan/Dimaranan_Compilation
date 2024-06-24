function loadCVContent() {
    fetch('cv.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('content-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading CV:', error));
}
