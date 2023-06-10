const { getAllCrypto, createCrypto } = require('../managers/cryptoManager');
const { mustBeAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelper');
const generateOptions = require('../utils/generateOptions');

const router = require('express').Router();

router.get('/catalog',async(req,res)=>{
    try{
        const crypto = await getAllCrypto().lean();
        console.log(crypto)
        const hasCrypto = crypto.length>0;
        res.status(302).render('crypto/catalog',{hasCrypto,crypto});
    }catch(err){
        res.status(404).render('404');
    }
});

router.get('/create',mustBeAuth,(req,res)=>{
    const options = generateOptions();
    res.status(302).render('crypto/create',{options});
});

router.post('/create',mustBeAuth,async(req,res)=>{
    const name = req.body.name?.trim();
    const image = req.body.image?.trim();
    const price = req.body.price
    const description = req.body.description?.trim();
    const paymentMethod = req.body.paymentMethod?.trim();

    const owner = req.user._id;
    
    try{
        await createCrypto(name,image,price,description,paymentMethod,owner);
        res.redirect('/crypto/catalog');      
    }
    catch(err){
        const error = getErrorMessage(err);
        const options = generateOptions(paymentMethod);
        res.status(400).render('crypto/create',{error,name,image,options,price,description,paymentMethod});
    }
});


module.exports = router;