const { Router } = require("express");
const fetch = require("node-fetch");
const router = Router();

router.get("/", (req, res) => {
    fetch(
        "https://api.mercadolibre.com/sites/MLA/search?q=" + req.query.q
    )
        .then((response) => response.json())
        .then((dataJson) => {
            let categories = []
            if (dataJson.hasOwnProperty("categories")) {
                categories = dataJson.categories.map((item) => {
                    return (item.name)
                })
            }
            let dataProducts = dataJson.results.map((item) => {
                return {
                    "id": item.id,
                    "title": item.title,
                    "price": {
                        "currency": item.currency_id,
                        "amount": item.price,
                        "decimals": '00'
                    },
                    "picture": item.thumbnail,
                    "condition": item.condition,
                    "free_shipping": item.shipping.free_shipping
                }
            })
            let dataFormated = {
                "author": {
                    "name": "Yuli",
                    "lastname": "Bonilla"
                },
                "categories": categories,
                "items": dataProducts
            }
            res.json({ data: dataFormated });
        }).catch((e) => {
            console.log('error', e);
            res.status(500).json({ error: e })
        })
});

router.get("/detailItem/:id", (req, res) => {
    fetch(
        "https://api.mercadolibre.com/items/" + req.params.id
    )
        .then((response) => response.json())
        .then((dataJson) => {
            console.log('datajson', dataJson)
            let detailItem = {
                "author": {
                    "name": "Yuli", "lastname": "Bonilla"
                },
                "item": {
                    "id": dataJson.id,
                    "title": dataJson.title,
                    "price": {
                        "currency": dataJson.currency_id,
                        "amount": dataJson.price,
                        "decimals": '0'
                    },
                    "picture": dataJson.pictures,
                    "condition": dataJson.condition,
                    "free_shipping": dataJson.shipping.free_shipping,
                    "sold_quantity": dataJson.sold_quantity,
                    "description": "String"
                }
            }

            res.json({ data: detailItem });
        }).catch((e) => {
            console.log('error', e);
            res.status(500).json({ error: e })
        })
});

module.exports = router;
