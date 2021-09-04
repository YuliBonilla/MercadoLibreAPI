const { Router } = require("express");
const  fetch  = require("node-fetch");
const router = Router();

router.get("/", (req, res) => {
  fetch(
    "https://api.mercadolibre.com/sites/MLA/search?q="+ req.query.q
  )
    .then((response) =>  response.json())
    .then((dataJson) => {
        let dataProducts = dataJson.results.map((item) => {
            return {
                "id": item.id,
                "title": item.title,
                "price": {
                    "currency": item.currency_id,
                    "amount": item.price ,
                    "decimals": '00'
                },
                "picture": item.thumbnail,
                "condition": item.condition,
                "free_shipping": item.shipping.free_shipping
            }
        })
        let dataFormated= {
            "author": {
                "name": "Yuli",
                "lastname": "Bonilla"
            },
            "categories":[],//mapear filters y sacar el name para esta parte
            "items": dataProducts
        } 
        res.json({ data: dataFormated });
    }).catch((e) => {
        console.log('error', e);
        res.status(500).json({error: e})
    })
});

module.exports = router;
