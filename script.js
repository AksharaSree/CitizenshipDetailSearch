async function search(searchType) {
    let searchInput = document.getElementById('txtSearchName');
    let name = searchInput.value.trim();
    if (searchType == "basic")
        document.getElementsByClassName('advance-search')[0].style = "display:none;";

    try {

        if (name != "") {
            document.getElementById('name-required-msg').style.display = "none";
            document.getElementById('loader').style.display = "block";

            const data = await fetch(`https://api.nationalize.io/?name=${name}`, { method: "GET" });
            const user = await data.json();


            if (user.country.length > 0) {

                let countryHtml = `  <div class="col-12">
                    <h4 title="Name"> ${user.name} - Citizenship Details </h4>
                        </div>                    
                    <div class="col-12">
                    <div class="row">`;

                let citizenshipDetail = "";
                user.country.forEach(ctzp => {

                    citizenshipDetail = `<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12 card">                    
                                    <h4 class="country-code">${ctzp.country_id}</h4>
                                    <label class="lbl-prob" title="Prob. of Citizenship">  ${ctzp.probability} </label>
                                </div>`;
                    countryHtml = countryHtml + citizenshipDetail;
                });

                countryHtml = countryHtml + `</div>                                
                    </div>
                    
                    <div class="col-12">
                        <div class="row">
                            <div class="col-12">
                                <canvas id="myChart" style="width:100%;max-width:600px"></canvas>
                            </div>
                        </div>
                 </div>`;

                document.getElementsByClassName('search-results')[0].innerHTML = countryHtml;
                document.getElementsByClassName('search-results')[0].style = "display:block;";

                const countryCodes = user.country.map(cn => cn.country_id);
                const probability = user.country.map(cn => cn.probability);
                displayChart(countryCodes, probability);

            }
            else {
                //Display Error Message
                var errorMessageDiv = displayErrorMessage('No country details found for the given user');


                let countryHtml = `  <div class="col-12">
                                <h4 title="Name">  ${user.name} - Citizenship Details</h4>
                        </div>                    
                    <div class="col-12">
                    <div class="row">  <div class="col-12"> ${errorMessageDiv} </div>
                    </div>                                
                    </div>`;

                document.getElementsByClassName('search-results')[0].innerHTML = countryHtml;
                document.getElementsByClassName('search-results')[0].style = "display:block;";
            }         
            document.getElementById('loader').style.display = "none";
        }
        else
        {
            document.getElementById('name-required-msg').style.display = "block";
        }

    }
    catch (err) {
        //  console.log(err);
        var errorMessageDiv = displayErrorMessage('Something went wrong!!! Please try again later.');

        let countryHtml = `  
            <div class="col-12">
            <div class="row">  <div class="col-12"> ${errorMessageDiv} </div>
            </div>                                
            </div>`;
        document.getElementsByClassName('search-results')[0].innerHTML = countryHtml;
        document.getElementsByClassName('search-results')[0].style = "display:block;";
        document.getElementById('loader').style.display = "none";
    }


}


function displayErrorMessage(message) {
    return `<div class="row no-gutters">
    <div class="col-12 m-auto">
       <div class="alert alert-danger fade show" role="alert">   
          <p>${message}</p>
       </div>
    </div>
 </div>`;
}


function displayChart(countryCodes, probability) {

    var xValues = countryCodes;
    var yValues = probability;
    var barColors = [
        "#b91d47",
        "#00aba9",
        "#2b5797",
        "#e8c3b9",
        "#1e7145"
    ];

    new Chart("myChart", {
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: "Probability Details"
            }
        }
    });
}

function reset(){
    hideAdvanceSearch();
    document.getElementsByClassName('search-results')[0].innerHTML = "";
    document.getElementsByClassName('search-results')[0].style = "display:none;";
    document.getElementById('txtSearchName').value='';
    document.getElementById('name-required-msg').style.display = "none";
 
}


function onPageLoad() {

    const divContianer = document.createElement('div');
    divContianer.className = "container";
    divContianer.innerHTML = `    
   
    <div class="search-container">

    <div class="row">
       <div class="col-12">
        <h3> Citizenship Details Search<h3>
       </div>           
    </div>

    <div class="row basic-search">
       <div class="col-6 form-group">  
            <div class="input-group pl-0">
                <input class="form-control my-0 py-1" type="text" id="txtSearchName" maxlength="50" placeholder="Enter Name..."  title="Name" aria-label="Search">
                <div class="input-group-append" onclick="search('basic');">
                    <span class="input-group-text"><i class="fa fa-search text-grey" aria-hidden="true"></i></span>
                </div>
            </div>
            <div class="name-required" id="name-required-msg">
            Please enter name..
            </div>
       </div>           
       
        <div class="col-6 btn-container">         
            <button class="btn btn-success" onclick="showAdvanceSearch();"> Advance Search </button>
            <button class="btn btn-secondary" onclick="reset();"> Reset </button>
        </div> 
    </div>
    <div class="row advance-search">

        <div class="col-12">

            <div class="row">
                <div class="col-12">
                    <h4>Search Fields</h4>
                </div>
            </div>

        <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div class="form-group">
                    <label for="Type">Type:</label>
                    <input type="text" title="Type" id="txtType" value="" maxlength="30" placeholder="Enter Type..." class="form-control">
                </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div class="form-group">
                    <label for="usr">Title:</label>
                    <input type="text" class="form-control" id="txtTitle" maxlength="30" value="" placeholder="Enter Title...">
                </div>

            </div>
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div class="form-group">
                    <label for="usr">Year:</label>
                    <input type="text" class="form-control" id="txtYear" maxlength="4" value="" name="year" oninput="getNumbersInput();" placeholder="Enter Year...">
                </div>
            </div>
        </div>

        <div class="row advance-search-btns">
                <div class="col-12">
                    <button id="btnCancel" onclick="hideAdvanceSearch();" class="btn btn-secondary">Cancel</button>
                    <button id="btnApplySearch" class="btn btn-success" >Apply</button>
                </div>
            </div>

        </div>
    </div> 
    <div class="row search-results">
    </div>
 </div>`;

    const divLoader = document.createElement('div');
    divLoader.id = "loader";
    divLoader.classList = "center";
    divLoader.style.display = "none";
    divLoader.innerHTML = `<i class="fa fa-spinner fa-spin"></i>`;
    document.body.append(divLoader);
    document.body.append(divContianer);
}


function getNumbersInput() {
    let inputYeer = document.getElementById('txtYear');
    inputYeer.value = inputYeer.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
}


function showAdvanceSearch() {
    clearBasicSearch();
    document.getElementsByClassName('search-results')[0].style = "display:none;";
    document.getElementsByClassName('advance-search')[0].style = "display:block";
}

function hideAdvanceSearch() {
    clearAdvanceSearch();
    document.getElementsByClassName('advance-search')[0].style = "display:none";

}

function clearAdvanceSearch() {
    document.getElementById('txtType').value = '';
    document.getElementById('txtTitle').value = '';
    document.getElementById('txtYear').value = '';
}

function clearBasicSearch() {
    document.getElementById('txtSearchName').value = '';
    document.getElementsByClassName('search-results')[0].style = "display:none;";
    document.getElementById('name-required-msg').style.display = "none";
}

