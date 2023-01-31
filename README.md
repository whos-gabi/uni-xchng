# Universal Exchange
## About
This project representa a web app made with **Bootstrap, Express and Node js**.
It has an introductory home page:
<img width="1436" alt="image" src="https://user-images.githubusercontent.com/56652297/215905058-0ccaead9-9f1e-4052-a501-440c38d31719.png">

as well as the currency exchange page:
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/56652297/215906294-08cda64b-376f-42b6-afb6-4f3b58dc0318.png">

also, as a feature, it has a news page:
<img width="1440" alt="image" src="https://user-images.githubusercontent.com/56652297/215906508-84c8ee1a-b136-4f94-b7fe-be91560f2140.png">

###  Used API's

- [Api Crypto](https://min-api.cryptocompare.com/documentation)
- [Api Currency](https://apilayer.com/marketplace/exchangerates_data-api)

## Get it Runnin'

**Firstly make sure you got node installed**

Start by clonning the repo:
>git clone https://github.com/whos-gabi/uni-xchng

Then install the node modules using:
>npm i

Next, create a `.env` file and make sure you fill in the API keys from the above:
```
#crypto key
CRY_API_KEY = "xxxxxxx"
#currency key
CURR_API_KEY = 'xxxxxxx'
```
Now, save it and lets run it:
>node index.js

Thats it, you can acess it now on `http://localhost:3000`


