$.ajax({
    url: "https://raw.githubusercontent.com/daningamells/random-quote-v2/master/GlobalFirePower.csv",
    async: false,
    success: function (csvd) {
        data = $.csv.toObjects(csvd);
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});


var csvImport = data
/*Header in default file:
country ISO3 Rank Total Population Manpower Available Fit-for-Service	Reaching Military Age	Total Military Personnel	Active Personnel	Reserve Personnel	Total Aircraft Strength	Fighter Aircraft	Attack Aircraft	Transport Aircraft	Trainer Aircraft	Total Helicopter Strength	Attack Helicopters	Combat Tanks	Armored Fighting Vehicles	Self-Propelled Artillery	Towed Artillery	Rocket Projectors	Total Naval Assets	Aircraft Carriers	Frigates	Destroyers	Corvettes	Submarines	Patrol Craft	Mine Warfare Vessels	Production (bbl/dy)	Consumption (bbl/dy)	Proven Reserves (bbl)	Labor Force	Merchant Marine Strength	Major Ports / Terminals	Roadway Coverage (km)	Railway Coverage (km)	Serivecable Airports	Defense Budget	External Debt	Foreign Exchange / Gold	Purchasing Power Parity	Square Land Area (km)	Coastline (km)	Shared Borders (km)	Waterways (km)
*/
//modifiers
//manpower
var actPersonel_Mod = 0.5;
var resPersonel_Mod = 0.5;
var man_Mod = 0.25;
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
var land_Mod = 0.25;
//sea
var airCar_Mod = 0.15;
var ships_Mod = 0.45;
var subs_Mod = 0.2;
var local_Mod = 0.1;
var sea_Mod = 0.25;
//support
var finance_Mod = 0.6;
var labour_Mod = 0.4;
//summary
var mil_Mod = 0.6;
var sup_Mod = 0.4;


//position 0 is country name

function importCSV()
{
	//makes dummy data
}

//takes an array of countries selected and ranks each column accordingly
function indexSelection(sel)
{
	var selData = pullData(sel);
	var indexResults[16][sel.length];
	//loops through and index each column
	for(var col = 0; col < selData[0].length; col++)
	{
		var max_value = 0;
		//gets max value
		for (var row = 0; row < selData.length; row++)
		{
			//sets max value on 0th case
			if(row == 0)
			{
				max_value = selData[col][row];
			}
			else
			{
				//checks if new vale is larger
				if(selData[col][row] > max_value)
				{
          //fixed my code so you don't need to change this bit as discussed.
					max_value = selData[col][row];
				}
			}
		}
    //Gets index out of 100
  	for (var row = 0; row < selData.length; row++)
  	{
  		indexResults[col][row] = (selData[col][row] / max_value) * 100
  	}
	}
	return indexResults;
}

//combines list data with new data
function pullData(sel)
{
	var results[16][sel.length]
	var length = sel.length;
	for(var i = 0; i < length; i++)
	{
		//checks for a country match. I need to make an error for the case that it can't find it.
		var counter = 0;
		while(sel[i] != importCSV[counter][0] && counter < 1000)
		{
			counter++;
		}
		//might need to loop though all the loops
		results[i] = importCSV[counter];
	}
	return results;
}

//gives miltary score
function rawScore(sel)
{
	var indexResults[16][sel.length] = indexSelection(sel);
	//Manpower = 1 & 2
	//Airpower = 3 & 4
	//Army = 5, 6, 7, 8 , 9
	//Navel = 10, 11, 12, 13
	var scores[8][sel.length];
	//loop through each row to get the score for each section
	for(var row = 0; row < indexResults.[0].length; row++)
	{
		//Country Name
		score[0].[row] = indexResults.[0].[row];
		//Military Scores
		score[1].[row] = actPersonel_Mod * indexResults.[1].[row] + resPersonel_Mod * indexResults.[2].[row];
		score[2].[row] = totAir_Mod * indexResults.[3].[row] + totHel_Mod * indexResults.[4].[row];
		score[3].[row] = tanks_Mod * indexResults.[5].[row] + armor_Mod * indexResults.[6].[row] + spArt_Mod * indexResults.[7].[row] + towArt_Mod * indexResults.[8].[row] + rock_Mod * indexResults.[9].[row];
		score[4].[row] = airCar_Mod * indexResults.[10].[row] + ships_Mod * indexResults.[11].[row] + subs_Mod * indexResults.[12].[row] + local_Mod * indexResults.[13].[row];
		score[5].[row] = man_Mod * score[1].row + air_Mod * score[2].row + land_Mod * score[3].row + sea_Mod *  score[4].row  //Total Military Score
		//Support Score
		score[6].[row] = finance_Mod * indexResults.[14].[row] + labour_Mod * indexResults.[15].[row];
		//Combined Score
		score[7].[row] = mil_Mod * score[5].row + sup_Mod * score[6].row
	}

	return scores;

}

//Make a github and tell me how to get there on whatapp (email won't work while I am away)
