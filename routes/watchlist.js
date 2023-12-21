const express = require("express");
const router = express.Router();
const Watchlist = require("../models/coin")
const fetchUser = require("../middleware/fetchUser");

router.get("/getAllCoins", fetchUser, async (req,res) => {
    try {
        const coins = await Watchlist.find({user: req.user.id})
        res.send(coins);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

router.post("/addCoin", fetchUser, async (req,res) => {

    try {
        const {id, coin} = req.body;
        const coinInw = await Watchlist.findOne({user: req.user.id, coin: coin})
        if(coinInw){
            return res.send("Coin Already Added to WatchList")
        }        
        const newCoin = new Watchlist({
             id, coin ,user: req.user.id
        })
        const saveCoin = await newCoin.save(); 
        res.json(saveCoin);        
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

router.delete("/removeCoin/:id", fetchUser, async (req,res) => {
    try {
        let Coin = await Watchlist.findById(req.params.id)
        
        if(!Coin){return res.status(404).send("Not Found")}
        if(Coin.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }

        Coin = await Watchlist.findByIdAndDelete(req.params.id)
        res.json({"Sucess": "Coin has been deleted",Coin: Coin.coin})


    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

module.exports = router