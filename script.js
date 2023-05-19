setInterval(() => { checkButtons() }, 500) // Each interval, check wether the buttons need to be loaded

function setButtons() {
    // Locate destination Div
    let div = document.getElementsByClassName("wide-toolbar js-wide-toolbar")[0]

    // Set Export to JSON Button
    let buttonJSON = document.createElement("button")
    buttonJSON.className = "skore-exporter"
    buttonJSON.style = "background-color: rgba(0,0,0,0); border: none;"
    buttonJSON.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/136/136525.png" height=50><br><p onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';">Export to JSON</p>'
    buttonJSON.addEventListener("click", () => {
        exportScore('json')
    })
    // Set Export to CSV Button
    let buttonCSV = document.createElement("button")
    buttonCSV.className = "skore-exporter"
    buttonCSV.style = "background-color: rgba(0,0,0,0); border: none;"
    buttonCSV.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/136/136534.png" height=50><br><p onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';">Export to CSV</p>'
    buttonCSV.addEventListener("click", () => {
        exportScore('csv')
    })

    // Append buttons to the div
    div.appendChild(buttonJSON)
    div.appendChild(buttonCSV)
}

function checkButtons() {
    // If the buttons are gone and we're on the right page, place the buttons
    if (document.getElementsByClassName("skore-exporter").length == 0 && window.location["href"].includes("/results/main/results")) {
        setButtons()
    }
}

function exportScore(format) {
    // Get tests from api
    fetch('https://svi-gijzegem.smartschool.be/results/api/v1/evaluations/?pageNumber=1&itemsOnPage=300').then((res) => {
        return res.json()
    }).then((data) => {
        // Get course filter
        let courseFilter = document.getElementsByClassName("btn dropdown-button js-course-dropdown")[0].textContent

        // Get period filter
        let periodFilter = document.getElementsByClassName("btn dropdown-button js-period-dropdown")[0].textContent

        // For each test in api-return, create a new test in tests-array with right values
        let tests = []
        data.forEach(el => {
            // Check wether test is in filter
            if ((courseFilter == "Alle vakken" || courseFilter.includes(el["courses"][0]["name"])) && (periodFilter=="Alle periodes" || periodFilter.includes(el["period"]["name"]))) {
                const id = el["identifier"]
                if (el["type"] == "normal") {
                    score = el["graphic"]["description"].replace(",", ".").split("/")
                    let n = parseFloat(score[0])
                    let d = parseFloat(score[1])
                    tests.push({ "name": el["name"], "scoreN": n, "scoreD": d, "percentage": el["graphic"]["value"], "teacher": el["gradebookOwner"]["name"]["startingWithFirstName"], "published": el["availabilityDate"], "course": el["courses"][0]["name"], "period": el["period"]["name"] })
                }
            }

        });
        // Create link that downloads the file when clicked
        var element = document.createElement('a');

        // Set link destination to the JSON file
        if (format == 'json') {
            element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tests)));
        }
        // Set link destination to the CSV file
        else if (format == 'csv') {
            // Generate CSV
            let csv = "Name,ScoreN,ScoreD,Percentage,Teacher,Published,Course,Period"
            tests.forEach(el => {
                csv = csv + `\n"${el["name"]}",${el["scoreN"]},${el["scoreD"]},${el["percentage"]},"${el['teacher']}",${el['published']},"${el['course']}","${el['period']}"`;
            });
            element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(csv));
        }

        // Set download name
        element.setAttribute('download', "skore." + format);

        // Add the link to the DOM
        element.style.display = 'none';
        document.body.appendChild(element);

        // Click the link and remove it from the DOM
        element.click();
        document.body.removeChild(element);

    }).catch((err) => { console.error(err) });
}