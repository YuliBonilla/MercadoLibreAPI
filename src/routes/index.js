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
    var promise1 = new Promise((resolve, reject) => {
        fetch(
            "https://api.mercadolibre.com/items/" + req.params.id
        )
            .then((response) => response.json())
            .then((dataJson) => {
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
                        "description": ""
                    }
                }

                resolve({ "error": false, data: detailItem })
            }).catch((e) => {
                console.log('error', e);
                reject({ "error": true })
            })
    });

    var promise2 = new Promise((resolve, reject) => {
        fetch(
            "https://api.mercadolibre.com/items/" + req.params.id + "/description"
        )
            .then((response) => response.json())
            .then((dataJson) => {
                let descriptionItem = dataJson.plain_text
                resolve({ "error": "false", data: descriptionItem })
            }).catch((e) => {
                console.log('error', e);
                reject({ "error": true })
            })
    });

    Promise.all([promise1, promise2])
        .then(results => {
            let dataFormated = results[0]
            dataFormated.data.item.description = results[1].data
            res.json({ data: dataFormated });
        }).catch((e) => {
            res.status(500).json({ error: e })
        }
        );
});

module.exports = router;
