const express = require("express");
const { auth } = require("../middlewares/auth");
const { ToysModel, validateJoi } = require("../models/toysModel");
const router = express.Router();

router.get("/", async (req, res) => {
    //http://localhost:3001/toys?page=3&perPage=5
    //http://localhost:3001/toys?perPage=10
    let perPage = req.query.perPage ? Math.min(req.query.perPage, 10) : 5;
    //http://localhost:3001/toys?page=1
    let page = req.query.page - 1 || 0;
    //http://localhost:3001/toys?perPage=5&sort=price
    let sort = req.query.sort || "price";
    //http://localhost:3001/toys?sort=price&reverse=yes
    let reverse = req.query.reverse == "yes" ? 1 : -1;
    try {
        let data = await ToysModel
            .find({}) // filter by price range
            .limit(perPage) // limits of toys per page
            .skip(page * perPage) // skips of toys per page
            .sort({ [sort]: reverse }); // sorts by price
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});

// finding toys by price range
// http://localhost:3001/toys/prices?min=60&max=200
router.get("/prices", async (req, res) => {
    let minPrice = req.query.min ? Number(req.query.min) : 0;
    let maxPrice = req.query.max ? Number(req.query.max) : Number.MAX_SAFE_INTEGER;
    try {
        let data = await ToysModel.find({ price: { $gte: minPrice, $lte: maxPrice } });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});


//finds a single toy by its id
//http://localhost:3001/toys/single/63f6ae74ab0242c78f84179b
//http://localhost:3001/toys/single/63f73e9640ed9de8da8a3d8d
router.get("/single/:id", async (req, res) => {
    try {
        let data = await ToysModel.findById(req.params.id);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});

// toys/search?s=superman
//http://localhost:3001/toys/search?s=superman
//http://localhost:3001/toys/search?s=car
//http://localhost:3001/toys/search?s=ninja
router.get("/search", async (req, res) => {
    try {
        let search = req.query.s;
        let searchExp = new RegExp(search, "i");
        let data = await ToysModel.find({
            $or: [{ name: searchExp }, { info: searchExp }]
        }).limit(20);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
});

//http://localhost:3001/toys/category/lego
//http://localhost:3001/toys/category/ninja%20turtles
//http://localhost:3001/toys/category/cars
router.get("/category/:catName", async (req, res) => {
    try {
        const catName = req.params.catName;
        const catExp = new RegExp(catName, "i");
        const data = await ToysModel.find({
            $or: [{ category: catExp }, { category: catName }]
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An Error Has Occured While Fetching Toys Entries By Category." });
    }
});

router.post("/", auth, async (req, res) => {
    let validBody = validateJoi(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let toys = new ToysModel(req.body);
        toys.user_id = req.tokenData._id;
        await toys.save();
        res.json(toys)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:idEdit", auth, async (req, res) => {
    let validBody = validateJoi(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let idEdit = req.params.idEdit;
        let data;
        if (req.tokenData.role == "admin") {
            data = await ToysModel.updateOne({ _id: idEdit }, req.body);
        }
        else {
            data = await ToysModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body);
        }
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.delete("/:idDel", auth, async (req, res) => {
    try {
        let idDel = req.params.idDel;
        let data;
        if (req.tokenData.role == "admin") {
            data = await ToysModel.deleteOne({ _id: idDel });
        }
        else {
            data = await ToysModel.deleteOne({ _id: idDel, user_id: req.tokenData._id });
        }
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


module.exports = router;