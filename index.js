const express = require("express");
const app = express();
//create a server with http
const http = require("http").Server(app);
const axios = require("axios");
const bodyParser = require("body-parser");

//middelewares
require("dotenv").config();
app.set("view engine", "ejs");
// app.use(express.bodyParser());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
//create a port
const port = 3000;

//Variables
let currArr = [
  {
    name: String,
    value: String,
  },
];
let cryArr = [];
let exchData = {
  currToCry: {
    value: 0.0,
    amount: 0.0,
    currency: "USD",
    crypto: "BTC",

  },
  cryToCurr: {
    value: 0.0,
    currency: "USD",
    crypto: "BTC",
    amount: 0.0,
  },
};

//create a route
app.get("/", function (req, res) {
  res.render("index", { title: "Home", path: "pages/home" });
});

//news page
app.get("/news", async function (req, res) {
    try {
        let news = await getNewsList();
        console.log(news);
        res.render("index", {
            news: news,
            title: "News",
            path: "pages/news",
        });
    } catch (error) {
        console.log(error);
        res.render("error/400", {
            title: "Error",
            path: "pages/error",
            error: error,
        });
    }
});


//create a '/exchange' route
app.get("/exchange", async function (req, res) {
  try {
    let cryList = await getCryptoList();
    for (let key in cryList.data.Data) {
      cryArr.push(key);
    }
    let currList = await getCurrList();
    for (let key in currList) {
      currArr.push({ value: key, name: currList[key] });
    }

    res.render("index", {
      cryList: cryArr,
      currList: currArr,
      exchData: exchData,
      title: "Exchange",
      path: "pages/xchange",
    });
  } catch (error) {
    console.log(error);
    res.render("error/400", {
      title: "Error",
      path: "pages/error",
      error: error,
    });
  }
  //render the data to the exchange.ejs file
});

//app post to curr_to_cry
app.post("/curr_to_cry", async function (req, res, next) {
  //get the data from the form
  let curr = req.body.curr;
  let cry = req.body.cry;
  let amount = req.body.amount;
  try {
    let output = await exchangeCrypto(cry, curr);
    let ratio = output.data[cry];
    console.log(ratio);
    exchData.currToCry.value = ratio * amount;
    exchData.currToCry.crypto = cry;
    exchData.currToCry.currency = curr;
    exchData.currToCry.amount = amount;
  } catch (error) {
    console.log(error);
    res.render("error/400", {
      title: "Error",
      path: "pages/error",
      error: error,
    });
  }
  res.render("index", {
    cryList: cryArr,
    currList: currArr,
    exchData: exchData,
    title: "Exchange",
    path: "pages/xchange",
  });
});

//crypto to currency
app.post("/cry_to_curr", async function (req, res, next) {
  //get the data from the form
  let cry = req.body.cry;
  let curr = req.body.curr;
  let amount = req.body.amount;
  try {
    let output = await exchangeCrypto(curr, cry);
    let ratio = output.data[curr];
    exchData.cryToCurr.value = ratio / amount;
    exchData.cryToCurr.currency = curr;
    exchData.cryToCurr.crypto = cry;
    exchData.cryToCurr.amount = amount;
  } catch (error) {
    console.log(error);
    res.render("error/400", {
      title: "Error",
      path: "pages/error",
      error: error,
    });
  }
  //render the data to the exchange.ejs file
  res.render("index", {
    cryList: cryArr,
    currList: currArr,
    exchData: exchData,
    title: "Exchange",
    path: "pages/xchange",
  });
});

//create an async function to get the crypto prices from the api
async function getCurrList() {
  try {
    //https://api.apilayer.com/exchangerates_data/symbols
    //add apikey in headers
    let URL = "https://api.apilayer.com/exchangerates_data/symbols";
    let currList = await axios.get(URL, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        apikey: process.env.CURR_API_KEY,
      },
    });
    // console.log(currList);
    return currList.data.symbols;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function exchangeCrypto(cry, curr) {
  let URL =
    "https://min-api.cryptocompare.com/data/price?fsym=" +
    curr +
    "&tsyms=" +
    cry +
    "&api_key=" +
    process.env.CRY_API_KEY;
  try {
    let exchData = await axios.get(URL);
    return exchData;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getCryptoList() {
  //https://min-api.cryptocompare.com/data/blockchain/list
  let URL =
    "https://min-api.cryptocompare.com/data/blockchain/list?api_key=" +
    process.env.CRY_API_KEY;
  try {
    //get the data from the api
    let cryptoList = await axios.get(URL);
    // console.log(cryptoList);
    return cryptoList;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getNewsList() {
    let URL = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=" + process.env.CRY_API_KEY;
    try {
        let newsList = await axios.get(URL);
        return newsList.data.Data;
        } catch (error) {
        console.log(error);
        return error;
        }
}


//listen to the port
http.listen(port, () => {
  console.log("listening on *:" + port);
});
