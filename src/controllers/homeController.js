const { getAllCrypto } = require('../managers/cryptoManager');
const generateOptions = require('../utils/generateOptions');

const router = require('express').Router();

router.get(['/','/index'],(req,res)=>{
    res.status(302).render('home');
});

router.get('/search',async(req,res)=>{
    const paymentMethod = req.query.paymentMethod
    const options = generateOptions(paymentMethod);
    
    const search = req.query.search?.trim();
    
    try{
        let crypto = await getAllCrypto().lean();
        if(search){
            crypto = crypto.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
        }
        if(paymentMethod){
            crypto = crypto.filter(c=>c.paymentMethod == paymentMethod);
        }
        const hasCrypto = crypto.length>0;
        res.status(302).render('search',{options,hasCrypto,crypto,search});
    }catch(err){
        res.status(404).render('404');
    }
});
module.exports = router;