// Local variables as I will need them for displaying ticker price change percent change on the recently 
let selectedTicker = "";
let selectedPrice = "";
let selectedPriceChange = "";
let selectedPercentChange = "";

function toggleAnnyang() {
  if (!annyang) {
    alert("Voice Recognition Not Avaiable On This Browser :(");
    return;
  } 

  const micIcon = document.getElementById('micIcon');

  if (annyang.isListening()) {
    annyang.abort();
    annyang.removeCommands();
    micIcon.src = "https://static-00.iconduck.com/assets.00/muted-icon-488x512-mg67knnq.png";
  } else {
    const commands = {
      'search *stock': function(stock) {
        document.getElementById('stockTicker').value = stock.toUpperCase();
        redirectToChartPage();
      }
    };

    annyang.removeCommands();
    annyang.addCommands(commands);
    annyang.start();
    micIcon.src = "micOn.png";
  }
}


//Function for Loading Recently Searched Stock List called when chart test html page loaded
async function loadRecentlySearchedStock() {
  await fetch (`${window.location.href}recentlySearchedStocks`)
  .then((result) => result.json())
  .then((resultJson) => {
    const table = document.getElementById('recentlySearchedListDisplay');
    
    const lastFifteen = resultJson.slice(-15).reverse();

    lastFifteen.forEach((searchedStock) => {
      const stockTableRow = document.createElement('tr');
      const stockTableTicker = document.createElement('td');
      const stockTableNumTimesSearched = document.createElement('td');

      stockTableTicker.innerHTML = searchedStock.recently_searched_stock; 
      stockTableNumTimesSearched.innerHTML = searchedStock.num_times_stock_searched;

      stockTableRow.appendChild(stockTableTicker);
      stockTableRow.appendChild(stockTableNumTimesSearched);

      table.appendChild(stockTableRow);

    })

  })
}

//function for setting the stock from the form into local storage and redirecting to chart page, called when form is submitted
function redirectToChartPage() {
  const stockSelected = document.getElementById("stockTicker").value.toUpperCase();
  if (!stockSelected) {
    alert("Please enter a stock ticker.");
    return;
  }
  localStorage.setItem("selectedStock", stockSelected);
  location.href = "/stocks";
}

//function for gathering the stock searched for the form and using that stock searched to fetch the API. Called when populate chart is, populate chart is called when the chart test page is loaded
function loadStockAPI() {
    const stockSelected = localStorage.getItem("selectedStock");
    console.log("Selected stock:", stockSelected);
    return fetch(`https://api.twelvedata.com/time_series?symbol=${stockSelected}&interval=1day&apikey=f0655d8fc0114490b952887f5f12b51e`)
    .then((result) =>
    result.json()
    );
}

//function for populating the chart, getting values from API, and changing UI based on those values. Global variables are also set in this function. Called when chart page loads
async function populateChart() {
    const data = await loadStockAPI();
    console.log(data)

    // Getting all dates from API 
    const allDates = data.values.map(date => date.datetime).reverse();
    console.log("dates", allDates);
    
    // Getting all prices from API
    const allClosingPrices = data.values.map(closingPrice => closingPrice.close).reverse();
    console.log("closing price", allClosingPrices);

    // Getting most recent price from API
    const mostRecentClosingPrice = parseFloat(data.values[0].close).toFixed(2);
    console.log("Most Recent Price:", mostRecentClosingPrice);

    // Getting previous days price from API
    const previousDaysClosingPrice = parseFloat(data.values[1].close).toFixed(2);
    console.log("Previous Days Closing Price:", previousDaysClosingPrice);

    //Getting the change 
    priceChange = Number((mostRecentClosingPrice - previousDaysClosingPrice).toFixed(2));
    console.log("Price Change:" ,priceChange);

    //Getting the percent change 
    const percentChange = Number((((mostRecentClosingPrice - previousDaysClosingPrice) / previousDaysClosingPrice) * 100).toFixed(2));
    console.log("Percent Change:", percentChange);

    //Getting the High of the day 
    const highOfDay = Number(data.values[0].high).toFixed(2);
    console.log("High of the Day: ", highOfDay);

    //Getting the Low of the day
    const lowOfDay = Number(data.values[0].low).toFixed(2);
    console.log("Low of the Candle: ", lowOfDay);

    //Getting the Open of the day
    const openOfDay = Number(data.values[0].open).toFixed(2);
    console.log("Open of the Candle: ", openOfDay);

    //Getting stock symbol from API 
    const stockSymbol = data.meta.symbol;
    console.log("Stock Symbol:", stockSymbol);

    // Setting the Local variables
    selectedTicker = stockSymbol;
    selectedPrice = mostRecentClosingPrice;
    selectedPriceChange = priceChange; 
    selectedPercentChange = percentChange;

    await fetch('/recentlySearchedStock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recently_searched_stock: selectedTicker })
    });

    const key = `watchlist ${selectedTicker}`;
    const status = localStorage.getItem(key);
    const button = document.getElementById("favoritesButton");
    
    if (status === 'enabled') {
      button.querySelector('img').src = 'starImage.png';
    } else {
      button.querySelector('img').src = 'https://static-00.iconduck.com/assets.00/favorites-icon-2048x1960-yopz8vek.png';
    }

   
    document.getElementById("chartPriceDisplay").innerHTML = `Current Price: $${mostRecentClosingPrice}`;
    document.getElementById("chartTickerDisplay").innerHTML += ` Symbol: $${stockSymbol}`;
    document.getElementById("priceChangeDisplay").innerHTML += ` Price Change: ${priceChange}`;
    document.getElementById("percentChangeDisplay").innerHTML += ` Percent Change: ${percentChange}%`;
    document.getElementById("openDisplay").innerHTML += ` Open of Day : ${openOfDay}`;
    document.getElementById("lowDisplay").innerHTML += ` Low of Day: ${lowOfDay}`;
    document.getElementById("highDisplay").innerHTML += ` High of Day: ${highOfDay}`;
    

    let lineColor;
    if (priceChange < 0) {
      lineColor = 'red';
      document.getElementById("chartPriceDisplay").style.color = 'red';
      document.getElementById("priceChangeDisplay").style.color = 'red';
      document.getElementById("percentChangeDisplay").style.color = 'red';
      document.getElementById("chartTickerDisplay").style.color = 'red';
      document.getElementById("openDisplay").style.color = 'red';
      document.getElementById("lowDisplay").style.color = 'red';
      document.getElementById("highDisplay").style.color = 'red';


    } else if (priceChange > 0){
      lineColor = '#00ff00';
      document.getElementById("chartPriceDisplay").style.color = '#00ff00';
      document.getElementById("priceChangeDisplay").style.color = '#00ff00';
      document.getElementById("percentChangeDisplay").style.color = '#00ff00';
      document.getElementById("chartTickerDisplay").style.color = '#00ff00';
      document.getElementById("openDisplay").style.color = '#00ff00';
      document.getElementById("lowDisplay").style.color = '#00ff00';
      document.getElementById("highDisplay").style.color = '#00ff00';
    } else {
      lineColor = 'grey';
      document.getElementById("chartPriceDisplay").style.color = 'grey';
      document.getElementById("priceChangeDisplay").style.color = 'grey';
      document.getElementById("percentChangeDisplay").style.color = 'grey';
      document.getElementById("chartTickerDisplay").style.color = 'grey';
      document.getElementById("openDisplay").style.color = 'grey';
      document.getElementById("lowDisplay").style.color = 'grey';
      document.getElementById("highDisplay").style.color = 'grey';
    }

    
    const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: allDates,
      datasets: [{
        label: 'Closing Price USD',
        data: allClosingPrices,
        borderColor: lineColor,
        borderWidth: 1,
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

//function for setting favorites, called when the favorites button is clicked on
function favorites() {
  const key = `watchlist ${selectedTicker}`;
  const status = localStorage.getItem(key);
  const button = document.getElementById("favoritesButton");

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  const matches = watchlist.filter(stock => stock.ticker === selectedTicker);

  if (status === null || status === 'disabled') {
    localStorage.setItem(key, 'enabled');
    button.querySelector('img').src = 'starImage.png';

    if (matches.length === 0) {
      const stock = {
        ticker: selectedTicker,
        price: selectedPrice,
        priceChange: selectedPriceChange,
        percentChange: selectedPercentChange
      };

      watchlist.push(stock);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));

      const tableBody = document.getElementById("watchlistBody");
      if (tableBody) {
        const row = document.createElement("tr");

        const tickerItem = document.createElement("td");
        tickerItem.textContent = selectedTicker;

        const priceItem = document.createElement("td");
        priceItem.textContent = selectedPrice;

        const priceChangeItem = document.createElement("td");
        priceChangeItem.textContent = selectedPriceChange;

        const percentChangeItem = document.createElement("td");
        percentChangeItem.textContent = selectedPercentChange;

        row.appendChild(tickerItem);
        row.appendChild(priceItem);
        row.appendChild(priceChangeItem);
        row.appendChild(percentChangeItem);

        tableBody.appendChild(row);
      }
    }

  } else {
    localStorage.setItem(key, 'disabled');
    button.querySelector('img').src = 'https://static-00.iconduck.com/assets.00/favorites-icon-2048x1960-yopz8vek.png'

    watchlist = watchlist.filter(stock => stock.ticker !== selectedTicker);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    const tableBody = document.getElementById("watchlistBody");
    if (tableBody) {
      const rows = Array.from(tableBody.getElementsByTagName("tr"));
      rows.forEach(row => {
        const cell = row.cells[0];
        if (cell && cell.textContent === selectedTicker) {
          tableBody.removeChild(row);
        }
      });
    }
  }
}


//function for displaying watchlist, called when home page is loaded
function displayWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const tableBody = document.getElementById("watchlistBody");
  if(!tableBody) return; 

  tableBody.innerHTML = "";
  
  watchlist.forEach(stock => {
    const row = document.createElement("tr");

    const tickerCell = document.createElement("td"); 
    tickerCell.textContent = stock.ticker;
    row.appendChild(tickerCell);

    const priceCell = document.createElement("td"); 
    priceCell.textContent = stock.price;
    row.appendChild(priceCell);

    const changeCell = document.createElement("td");
    changeCell.textContent = stock.priceChange;
    row.appendChild(changeCell);

    const percentCell = document.createElement("td");
    percentCell.textContent = `${stock.percentChange} %`;
    row.appendChild(percentCell);

    tableBody.appendChild(row);
  })
}


//logic for calling functions onload 
window.onload = function () {
  const url = window.location.pathname;

  if (url.match("/stocks")) {
      populateChart(); 
  }

  if (url.match("/") ) {
      displayWatchlist();
      loadRecentlySearchedStock();
  } 
};