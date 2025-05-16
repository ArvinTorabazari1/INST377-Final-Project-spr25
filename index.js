const supabaseClient = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
const supabaseUrl=process.env.SUPABASE_URL;
const supabaseKey= process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
    res.sendFile('public/INST377-Project-Home-Page.html', { root: __dirname });
  });

  app.get('/stocks', (req, res) => {
    res.sendFile('public/INST377-Chart-Test.html', { root: __dirname });
  });

  app.get('/help', (req, res) => {
    res.sendFile('public/INST377-Project-Help-Page.html', { root: __dirname });
  });

  app.get('/about', (req, res) => {
    res.sendFile('public/INST377-Project-About-Page.html', { root: __dirname });
  });

app.get('/recentlySearchedStocks', async(req, res) => {
    console.log('Attempting to GET all recently searched stocks');
    const { data, error } = await supabase.from('recentlySearchedStock').select();

    if (error) {
        console.log('Error');
        res.send(error);
      } else {
        res.send(data);
      }
})

app.post('/recentlySearchedStock', async(req,res) => {
    console.log('Adding Stock');
    console.log(req.body);
    const num_times_searched = req.body.num_times_stock_searched;
    const recentlySearchedStock = req.body.recently_searched_stock;

    
    const { data, error } = await supabase
    .from('recentlySearchedStock')
    .insert({
      recently_searched_stock: recentlySearchedStock,
      num_times_stock_searched: num_times_searched
    })
    .select();


    
    if (error) {
        console.log('Error');
        res.send(error);
      } else {
        res.send(data);
      }
})

app.listen(port, () => {
    console.log('APP IS ALIVEEE');
});