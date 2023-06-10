const router = require('express').Router();

const homeController = require("./controllers/homeController");
const userController = require("./controllers/userController");
const cryptoController = require("./controllers/cryptoController");

router.use(homeController);
router.use(userController);
router.use('/crypto',cryptoController);

router.get('*',(req,res)=>{
    res.status(404).render('404');
});

module.exports = router;