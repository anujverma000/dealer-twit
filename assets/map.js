var map

function initMap(){
    if(map){
        return;
    }
    var options = {
        element: document.getElementById('map-container'),
        scope: 'usa',
        responsive: true,
        fills: {
            BAD: '#ed143d',
            OKAY: '#ffa500',
            GOOD: '#006400',
            defaultFill: '#2A78C2'
        },
        geographyConfig: {	
            highlightFillColor: '#2A78C2',
            highlightBorderOpacity: 0,
            borderWidth: 0,
            borderOpacity: 0,
            borderColor: '#2A78C2',
            popupTemplate:""           
        }
    };

    map = new Datamap(options);
    map.addPlugin('fadingBubbles', fadingBubbles);
}

function drawBubbles(data) {
    data.forEach(function(datum, index) {
        setTimeout(function() {
            map.fadingBubbles([datum]);        
        }, 1000);
    });
}