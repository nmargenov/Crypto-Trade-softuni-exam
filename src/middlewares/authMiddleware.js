const { SECRET } = require("../config/config");
const { verify } = require("../lib/jwt");

exports.auth = async(req,res,next)=>{
    const token = req.cookies['auth'];
    
    if(token){
        try{
            const decodedToken = await verify(token,SECRET);

            req.user = decodedToken;
            res.locals.isLogged = true;
            res.locals.user = decodedToken;

            next();
        }catch(err){
            res.clearCookie('auth');
            
            res.redirect('/login');
        }
    }else{
        next();
    }
};

exports.mustBeAuth = (req,res,next)=>{
    if(!req.user){
        return res.redirect('/login');
    }
    next();
};

exports.mustBeGuest = (req,res,next)=>{
    if(req.user){
        return res.redirect('/');
    }
    next();
}