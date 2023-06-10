const router = require('express').Router();

router.get(['/','/index'],(req,res)=>{
    res.status(302).render('home');
});

module.exports = router;