const { getAllCrypto, createCrypto, getCryptoById, buyCrypto, checkIfUserHasBoughtTheCrypto, deleteCrypto, editCrypto } = require('../managers/cryptoManager');
const { mustBeAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelper');
const generateOptions = require('../utils/generateOptions');

const router = require('express').Router();

router.get('/catalog', async (req, res) => {
    try {
        const crypto = await getAllCrypto().lean();
        const hasCrypto = crypto.length > 0;
        res.status(302).render('crypto/catalog', { hasCrypto, crypto });
    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/create', mustBeAuth, (req, res) => {
    const options = generateOptions();
    res.status(302).render('crypto/create', { options });
});

router.post('/create', mustBeAuth, async (req, res) => {
    const name = req.body.name?.trim();
    const image = req.body.image?.trim();
    const price = req.body.price
    const description = req.body.description?.trim();
    const paymentMethod = req.body.paymentMethod?.trim();

    const owner = req.user._id;

    try {
        await createCrypto(name, image, price, description, paymentMethod, owner);
        res.redirect('/crypto/catalog');
    }
    catch (err) {
        const error = getErrorMessage(err);
        const options = generateOptions(paymentMethod);
        res.status(400).render('crypto/create', { error, name, image, options, price, description, paymentMethod });
    }
});

router.get('/:cryptoId/details', async (req, res) => {
    try {
        const cryptoId = req.params.cryptoId;
        const crypto = await getCryptoById(cryptoId).lean();
        if (!crypto) {
            throw new Error();
        }

        const loggedUser = req.user?._id;

        const isOwner = loggedUser && crypto.owner == loggedUser;
        const notOwner = !isOwner;
        const hasBought = notOwner && checkIfUserHasBoughtTheCrypto(crypto, loggedUser);

        res.status(302).render('crypto/details', { crypto, loggedUser, isOwner, notOwner, hasBought, });
    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/:cryptoId/buy', mustBeAuth, async (req, res) => {
    try {
        const cryptoId = req.params.cryptoId;
        const loggedUser = req.user._id;

        const crypto = await getCryptoById(cryptoId);
        if (!crypto || crypto.owner == loggedUser) {
            throw new Error();
        }
        if (checkIfUserHasBoughtTheCrypto(crypto, loggedUser)) {
            throw new Error();
        }

        await buyCrypto(cryptoId, loggedUser);
        res.redirect(`/crypto/${cryptoId}/details`);

    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/:cryptoId/delete', mustBeAuth, async (req, res) => {
    try {
        const cryptoId = req.params.cryptoId;
        const loggedUser = req.user._id;

        const crypto = await getCryptoById(cryptoId);
        if (!crypto || crypto.owner != loggedUser) {
            throw new Error();
        }

        await deleteCrypto(cryptoId);
        res.redirect('/crypto/catalog');
    } catch (err) {
        res.status(404).render('404');
    }
});

router.get('/:cryptoId/edit', mustBeAuth, async (req, res) => {
    try {
        const cryptoId = req.params.cryptoId;
        const loggedUser = req.user._id;

        const crypto = await getCryptoById(cryptoId).lean();
        if (!crypto || crypto.owner != loggedUser) {
            throw new Error();
        }
        const options = generateOptions(crypto.paymentMethod);
        res.status(302).render('crypto/edit',{crypto,options});
    } catch (err) {
        res.status(404).render('404');
    }
});

router.post('/:cryptoId/edit',mustBeAuth,async(req,res)=>{
    const name = req.body.name?.trim();
    const image = req.body.image?.trim();
    const price = req.body.price
    const description = req.body.description?.trim();
    const paymentMethod = req.body.paymentMethod?.trim();

    const crypto ={
        name,
        image,
        price,
        description,
        paymentMethod
    }
    
    try {
        const cryptoId = req.params.cryptoId;
        const loggedUser = req.user._id;
        
        const crypto = await getCryptoById(cryptoId).lean();
        if (!crypto || crypto.owner != loggedUser) {
            throw new Error();
        }
        await editCrypto(cryptoId,name,image,price,description,paymentMethod);
        res.redirect(`/crypto/${cryptoId}/details`);
    } catch (err) {
        const error = getErrorMessage(err);
        const options = generateOptions(crypto.paymentMethod);
        res.status(400).render('crypto/edit',{error,crypto,options});
    }
});


module.exports = router;