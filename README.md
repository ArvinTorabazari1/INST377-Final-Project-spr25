# INST377-Final-Project-spr25

# README
## Title: Stock Genius 
## Project Description: **Stock Genius** is a stock watchlist web application designed for beginner investors. It simplifies historical stock market data visualization, making it easier for users to track performance and learn essential financial metrics. The application includes features such as:

- Search Stock Feature using text or voice command
- Ability to add and remove stocks from the watchlist
- Watchlist personalized per browser
- Recently searched stock history using supabase database. List consists of all stocks that any user of the application has searched.
- Color-coded stock data
- Interactive and color-coded line charts

## Target Browsers: 
- Chrome
- Safari 
### Everything in Microsoft Edge and Firefox works EXCEPT annyang.

## Libraries used:
- Chart.js
- Annyang

## External API Used 
**Link to API Documentation: https://twelvedata.com/docs**

# Developer Manual 
## Installation 
### **Clone GitHub Repo to your Device**
### Dependencies 
- npm @install supabase/supabase-js: Installs supabase
- .env file with SUPABASE_KEY and SUPABASE_URL
- npm install express: installs express which allows us to easily add files to appliation
- npm install dotenv: loads environment variables from .env
- npm install body-parser: converts post data to JSON

## Run application on server
### To run the application on a server, open the integrated terminal and run npm start
### To view the application running on the server, navigate to inst-377-final-project-spr25.vercel.app

## Testing
### No tests scripts were written however, you can test file locally by going to localhost:3000 and navigating through the application as you would if it were run on a server. 

## Endpoints
- '/': Home page
- '/stocks': Stocks page with chart
- '/about': About Page
- '/help': Help Page

## API for Server Application
- POST /recentlySearchedStock: Adds a new entry to the recently searched stocks database.
- GET /recentlySearchedStocks: Retrieves the list of recently searched stocks from supabase database

## Known Bugs/Limitations
- Does not validate the stock ticker actually exists
- API key not in secrets, as this is a school project with a free API key, it was not neccesary to hide the API key. However, if an API key were to be purchased and this application is used by multipe users, this would be a HUGE security risk. 
- Firefox does not accept the use of Annyang, to fix this bug, I made it so it alerts when the browser isnt supporting Annyang. 
- Microsoft Edge allows listening from Annyang, however, does not properly understand and store the speech input. For some reason, it does not come up with the alert and redirects you to an empty stocks page
- When an incorrect stock is inputted into the form, it redirects to the stock page, however, does not populate the chart or stock data.
- Limited to 800 API calls per day, and 8 Per minute. 
- Supabase automatically pauses database after 7 days with free version. Either upgrade supabase subscription or find another provider. 

## Road Map for Future 
- Purchase API allows real-time stock data and make the stock data update dynamically.
- Hide the API by putting it in the .env file once API is purchased. 
- Add options to change the range of the chart
- Research New libraries that work with edge and firefox
- Add stock ticker validation
- Research for API's that provide info on data such as: Market Cap, EPS, Dividends, etc. 
- Add the ability to switch from line chart to candlestick chart 
- Make the watchlist entries clickable so they redirect you to the stocks page with that specific stock. 
- Make it more accessible for individuals using mobile devices like iPhones and Androids.