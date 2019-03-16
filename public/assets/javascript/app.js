$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAtiM8ykyB5bJ1ObRUcb21xNGYkmAQskb4",
        authDomain: "projectone-10330.firebaseapp.com",
        databaseURL: "https://projectone-10330.firebaseio.com",
        projectId: "projectone-10330",
        storageBucket: "projectone-10330.appspot.com",
        messagingSenderId: "156042357943"
      };
      firebase.initializeApp(config);

    // Capture Button Click
    $("#add-search").on("click", function(event) {
        // Don't refresh the page!
        event.preventDefault();
        $(`#job-info`).empty();
        
        // Captures the values users selected in the form
        let category = $(`#category-input`).val();
        console.log(category);
        let jobType = $(`#job-type-input`).val();
        console.log(jobType);
        
        // Create AJAX call based on user input
        let queryURL = `https://authenticjobs.com/api/?api_key=25915f6b6bd9671779f4cb0d43be8b66&format=json&method=aj.jobs.search&category=${category}&type=${jobType}&perpage=30`;

        $.ajax({
            url: queryURL,
            method: `GET`

        }).then(function(response) {
            console.log(response);
            if(response.listings.listing.length === 0) {

                $(`#exampleModal`).modal(`toggle`);
            } else {
            for(let i = 0; i < response.listings.listing.length; i++) {
                let taglineObj = response.listings.listing[i].company.tagline;
                let tagline;
                    if(taglineObj === undefined) {
                        tagline = `<em>None listed</em>`;
                         
                    } else {
                        tagline = taglineObj;
                    }

                let locationObj = response.listings.listing[i].company.location;
                let locationObjName = response.listings.listing[i].company.location.name
                let location;
                    if(locationObj === undefined) {
                        location = `<em>Multiple locations available</em>`;
                        jobButton = `<button class="bg-info text-white specific-job" id="no-location" data-toggle="modal" data-target="#noLocationModal" url="${response.listings.listing[i].apply_url}">Find Out More!</button>`;
                    } else if(locationObjName == `Anywhere, "Canada Preferred"` || locationObjName == `Anywhere in the US` || locationObjName == `Indianapolis preferred` || locationObjName == `Anywhere in the UK`) {
                        location = response.listings.listing[i].company.location.name;
                        jobButton = `<button class="bg-info text-white specific-job" id="no-location" data-toggle="modal" data-target="#noLocationModal" url="${response.listings.listing[i].apply_url}">Find Out More!</button>`;
                    } else {
                        location = response.listings.listing[i].company.location.name;
                        jobButton = `<button class="bg-info text-white specific-job" id="${response.listings.listing[i].company.location.name}" data-toggle="modal" data-target="#specificModal" lat="${response.listings.listing[i].company.location.lat}" lng="${response.listings.listing[i].company.location.lng}" url="${response.listings.listing[i].apply_url}">Find Out More!</button>`;
                    }
                    
            let dataRow = `<tr><td>${response.listings.listing[i].company.name}</td><td>${location}</td><td>${response.listings.listing[i].title}</td><td>${response.listings.listing[i].type.name}</td><td>${tagline}</td><td>${jobButton}</td></tr>`;
            
            $(`#job-info`).append(dataRow);
            }
        } 
    });

    }); // Closes on-click function

    // Capture 'more info' button click
    $("#job-info").on("click", ('.specific-job'), function(event) {
        // Don't refresh the page!
        event.preventDefault();
        $(`#localMap`).empty();
        $(`#meetUps`).empty();

        let city = $(this).attr(`id`);
        console.log(city);
        
        if(city === `no-location`) {
            let applyURL = $(this).attr(`url`);
            console.log(applyURL);
            $(`#noLocationModal`).modal(`toggle`);
            $(`#genericURL`).attr(`href`, applyURL);

        } else {
            let latPointer = $(this).attr('lat');
            let lngPointer = $(this).attr(`lng`);
            let applyURL = $(this).attr(`url`);

            $(`#specificModal`).modal(`toggle`);

            let image = $(`<img class="map" src='https://maps.googleapis.com/maps/api/staticmap?center=${city}&markers=color:red%7C${latPointer},${lngPointer}&zoom=11&size=400x150&maptype=roadmap&key=AIzaSyCPpsNM_ZFTCJH9aNrS-mWO4D8t_FHDh4k'>`);

            $(`#localMap`).append(image);
            $(`#city-name`).text(city);
            $(`#specificURL`).attr(`href`, applyURL);

            // Create AJAX call based on user input
            let meetURL = `https://api.meetup.com/find/groups?location=${city}&radius=0.5&category=34&order=distance&offset=0&page=15&format=json&key=753e255f6c517b7a17724b111556155`;

            $.ajax({
                url: meetURL,
                method: `GET`

            }).then(function(response) {
                console.log(response);

            for(let j = 0; j < response.length; j++) {
                let groupName = response[j].name;
                let groupURL = response[j].link;
                console.log(groupName);
                console.log(groupURL);

                let nameDiv = $(`<a href='${groupURL}' target='_blank'>${groupName}<br></a>`);
                $(`#meetUps`).append(nameDiv);
                
                }

            });
        }

     }); // Closes 'more info' on-click function




     // Capture 'apply later' button click
     $(document).on("click", ('#apply-later'), function(event) {
        // Don't refresh the page!
        event.preventDefault();

        let saveURL = $(`#specificURL`).attr('href');
        console.log(saveURL);

        // Create a variable to reference the database
        const database = firebase.database();

        //Provides initial data to Firebase database
        database.ref().push({
            URL: saveURL,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        }); // Closes database.ref.push function

     }); // Closes 'apply later' on-click function
    
    
    

}); // Closes 'document ready' function