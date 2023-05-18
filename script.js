setTimeout(() => {
    let div = document.getElementsByClassName("wide-toolbar js-wide-toolbar")[0]
    let buttonJSON = document.createElement("button")
    buttonJSON.style="background-color: rgba(0,0,0,0); border: none;"
    buttonJSON.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/136/136525.png" height=50><br><p onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';">Export to JSON</p>'
    buttonJSON.addEventListener("click", () => {
        exportScore('json')
    })
    let buttonCSV = document.createElement("button")

    buttonCSV.style="background-color: rgba(0,0,0,0); border: none;"
    buttonCSV.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/136/136534.png" height=50><br><p onmouseover="this.style.textDecoration=\'underline\';" onmouseout="this.style.textDecoration=\'none\';">Export to CSV</p>'
    buttonCSV.addEventListener("click", () => {
        exportScore('csv')
    })
    

    div.appendChild(buttonJSON)
    div.appendChild(buttonCSV)
}, 500)

function exportScore(format){
    fetch('https://svi-gijzegem.smartschool.be/results/api/v1/evaluations/?pageNumber=1&itemsOnPage=300').then((res) => {
            return res.json()
        }).then((data) => {
            let tests = []
            data.forEach(el => {
                const id = el["identifier"]
                if (el["type"]=="normal"){
                    score = el["graphic"]["description"].replace(",", ".").split("/")
                    let n = parseFloat(score[0])
                    let d = parseFloat(score[1])
                    tests.push({"name": el["name"], "scoreN": n, "scoreD": d, "percentage": el["graphic"]["value"], "teacher": el["gradebookOwner"]["name"]["startingWithFirstName"], "published": el["availabilityDate"], "course": el["courses"][0]["name"]})
                }
                
            });
            //Download
            var element = document.createElement('a');
            if (format=='json'){
                element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tests)));
            }
            else if (format=='csv'){
                let csv = "Name,ScoreN,ScoreD,Percentage,Teacher,Published,Course"
                tests.forEach(el => {
                    csv=csv+`\n"${el["name"]}",${el["scoreN"]},${el["scoreD"]},${el["percentage"]},"${el['teacher']}",${el['published']},"${el['course']}"`;
                });
                element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(csv));
            }
            
            
            element.setAttribute('download', "skore."+format);
        
            element.style.display = 'none';
            document.body.appendChild(element);
        
            element.click();
        
            document.body.removeChild(element);
        }).catch((err) => { console.error(err) });
}