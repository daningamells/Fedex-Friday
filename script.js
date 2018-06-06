$.ajax({
    url: "https://raw.githubusercontent.com/daningamells/random-quote-v2/master/GlobalFirePower.csv",
    async: false,
    success: function(csvd) {
        data = $.csv.toObjects(csvd);
    },
    dataType: "text",
    complete: function() {
        // call a function on complete
    }
});

//var csvImport = data
/*Header in default file:
country ISO3 Rank Total Population Manpower Available Fit-for-Service	Reaching Military Age	Total Military Personnel	Active Personnel	Reserve Personnel	Total Aircraft Strength	Fighter Aircraft	Attack Aircraft	Transport Aircraft	Trainer Aircraft	Total Helicopter Strength	Attack Helicopters	Combat Tanks	Armored Fighting Vehicles	Self-Propelled Artillery	Towed Artillery	Rocket Projectors	Total Naval Assets	Aircraft Carriers	Frigates	Destroyers	Corvettes	Submarines	Patrol Craft	Mine Warfare Vessels	Production (bbl/dy)	Consumption (bbl/dy)	Proven Reserves (bbl)	Labor Force	Merchant Marine Strength	Major Ports / Terminals	Roadway Coverage (km)	Railway Coverage (km)	Serivecable Airports	Defense Budget	External Debt	Foreign Exchange / Gold	Purchasing Power Parity	Square Land Area (km)	Coastline (km)	Shared Borders (km)	Waterways (km)
*/
//modifiers
//manpower
var actPersonel_Mod = 0.65; 
var resPersonel_Mod = 0.35; 
var man_Mod = 0.3;
//air
var totAir_Mod = 0.7;
var totHel_Mod = 0.3;
var air_Mod = 0.25;
//land
var tanks_Mod = 0.4;
var armor_Mod = 0.2;
var spArt_Mod = 0.15;
var towArt_Mod = 0.1;
var rock_Mod = 0.15;
var land_Mod = 0.3;
//sea
var airCar_Mod = 0.1;
var ships_Mod = 0.5;
var subs_Mod = 0.2;
var local_Mod = 0.1;
var sea_Mod = 0.15;
//support
var finance_Mod = 0.6;
var labour_Mod = 0.4;
//summary
var mil_Mod = 0.9;
var sup_Mod = 0.1;

var newData = [];
var cdata = {};

function index(name, column) {
    var score = [];
    for (i = 0; i < data.length; i++) {
        var columnScore = parseInt(data[i][column]);
        score.push(columnScore);
    }

    for (i = 0; i < data.length; i++) {

        var highScore = Math.max(...score);
        columnScore = parseInt(data[i][column]);
        var indexScore = columnScore / highScore * 100;
        var country = data[i].Country;

        if (typeof newData[i] == "undefined") {
            newData.push({
                Country: data[i]["Country"],
                [name]: indexScore
            });
        } else {

            newData[i][name] = indexScore;

        }

    }
    var score = [];
};

//gives miltary score
function rawScore() {
    //Manpower = 1 & 2
    //Airpower = 3 & 4
    //Army = 5, 6, 7, 8 , 9
    //Navel = 10, 11, 12, 13
    //var scores[8][sel.length];
    //loop through each row to get the score for each section
    for(var row = 0; row < newData.length; row++)
    {
        //Military Scores
        newData[row]["Personnel Score"] = actPersonel_Mod * newData[row]['Active Personnel'] + resPersonel_Mod * newData[row]['Reserve Personnel'];
        newData[row]["Air Score"]  = totAir_Mod * newData[row]['Total Aircraft Strength'] + totHel_Mod * newData[row]['Total Helicopter Strength'];
        newData[row]["Land Score"] = tanks_Mod * newData[row]['Combat Tanks'] + armor_Mod * newData[row]['Armored Fighting Vehicles'] + spArt_Mod * newData[row]['Self-Propelled Artillery'] + towArt_Mod * newData[row]['Towed Artillery'] + rock_Mod * newData[row]['Rocket Projectors'];
        newData[row]["Naval Score"] = airCar_Mod * newData[row]['Aircraft Carriers'] + ships_Mod * (newData[row]['Frigates'] + newData[row]['Corvettes'] + newData[row]['Destroyers']) + subs_Mod * newData[row]['Submarines'] + local_Mod * (newData[row]['Patrol Craft'] + newData[row]['Mine Warfare Vessels']);
        newData[row]["Military Score"] = man_Mod * newData[row]["Personnel Score"] + air_Mod * newData[row]["Air Score"] + land_Mod * newData[row]["Land Score"] + sea_Mod *  newData[row]["Naval Score"];  //Total Military Score
        //Support Score
        newData[row]["Support Score"] = /*finance_Mod * indexResults.[14].[row] + labour_Mod * */newData[row]["Labor Force"];
        //Combined Score
        newData[row]["Total Score"] = mil_Mod * newData[row]["Military Score"] + sup_Mod * newData[row]["Support Score"];
    }

    //return scores;

}

//Indexing
index('Active Personnel', 'Active Personnel');
index('Reserve Personnel', 'Reserve Personnel');
index('Total Aircraft Strength', 'Total Aircraft Strength');
index('Total Helicopter Strength', 'Total Helicopter Strength');
index('Combat Tanks', 'Combat Tanks');
index('Armored Fighting Vehicles', 'Armored Fighting Vehicles');
index('Towed Artillery', 'Towed Artillery');
index('Rocket Projectors', 'Rocket Projectors');
index('Self-Propelled Artillery', 'Self-Propelled Artillery');
index('Aircraft Carriers', 'Aircraft Carriers');
index('Frigates', 'Frigates');
index('Destroyers', 'Destroyers');
index('Corvettes', 'Corvettes');
index('Submarines', 'Submarines');
index('Patrol Craft', 'Patrol Craft');
index('Mine Warfare Vessels', 'Mine Warfare Vessels');
index('Labor Force', 'Labor Force');
rawScore();

function testFight() {
    fight([{
        Country: 'Russia',
        Team: 'A'
    }, {
        Country: 'China',
        Team: 'D'
    }, {
        Country: 'Japan',
        Team: 'D'
    }]);
}

function fight(teams) {
    var teamA = {
        'Personnel Score': 0,
        'Air Score': 0,
        'Land Score': 0,
        'Naval Score': 0,
        'Military Score': 0,
        'Support Score': 0,
        'Total Score': 0
    };
    var teamD = {
        'Personnel Score': 0,
        'Air Score': 0,
        'Land Score': 0,
        'Naval Score': 0,
        'Military Score': 0,
        'Support Score': 0,
        'Total Score': 0
    };
    for (var i = 0; i < teams.length; i++) {
        for (var j = 0; j < newData.length; j++) {
            if (teams[i].Country == newData[j].Country) {
                if (teams[i].Team == 'A') {
                    console.log(teams[i].Country);
                    teamA['Personnel Score'] += newData[j]['Personnel Score'];
                    teamA['Air Score'] += newData[j]['Air Score'];
                    teamA['Land Score'] += newData[j]['Land Score'];
                    teamA['Naval Score'] += newData[j]['Naval Score'];
                    teamA['Military Score'] += newData[j]['Military Score'];
                    teamA['Support Score'] += newData[j]['Support Score'];
                    teamA['Total Score'] += newData[j]['Total Score'];
                    console.log('Team A Score: ' + teamA['Total Score']);

                } else {
                    console.log(teams[i].Country);
                    teamD['Personnel Score'] += newData[j]['Personnel Score'];
                    teamD['Air Score'] += newData[j]['Air Score'];
                    teamD['Land Score'] += newData[j]['Land Score'];
                    teamD['Naval Score'] += newData[j]['Naval Score'];
                    teamD['Military Score'] += newData[j]['Military Score'];
                    teamD['Support Score'] += newData[j]['Support Score'];
                    teamD['Total Score'] += newData[j]['Total Score'];
                    console.log('Team D Score: ' + teamD['Total Score']);
                }
            }
        }
    }
    if (teamA['Total Score'] > teamD['Total Score']) {
        alert('Attackers are Victorious!');
    } else if (teamA['Total Score'] < teamD['Total Score']) {
        alert('Defenders are Victorious!');
    } else {
        alert('It is a draw!');
    }
}

$(function() {
    for (i = 0; i < data.length; i++) {
        var countryCode = data[i].ISO3;
        var newCountryCode = getCountryISO2(countryCode);
        var totalScore = newData[i]['Total Score'].toFixed(0).toString();
        cdata[newCountryCode] = totalScore;

    }
    $('#world-map').vectorMap({

        map: 'world_mill',
        backgroundColor: '#36b55c',
        regionsSelectable: true,
        color: '#dfdfdd',
        hoverOpacity: 0,
        selectedColor: '#5f8b98',

        series: {
            //this is the object for passing country/region data into
            regions: [{
                //define the range of color values
                scale: ['#DEEBF7', '#08519C'],
                //define the function that maps data to color range
                normalizeFunction: 'linear',
                //define the coloration method
                attribute: 'fill',
                //define the array of country data
                values: cdata,
                legend: {
                    vertical: true,
                    title: 'Military Score'

                }
            }]
        },

        onRegionClick: function(event, code) {
            var map = $('#world-map').vectorMap('get', 'mapObject');
            var regionName = map.getRegionName(code);
            console.log(regionName);

        },

        onRegionTipShow: function(e, el, code) {
            el.html(el.html() + ' (Score - ' + cdata[code] + ')');
        }

    });

});
