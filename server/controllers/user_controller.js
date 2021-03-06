let mongoose = require('mongoose');
let User = mongoose.model('User');

module.exports = {
    login: function(req, res){
        User.findOne({email:req.body.email}).exec(function(err, user){
            if(user){
                req.session.user = user._id
                return res.json(user)
            } else{
                return res.json(err)
            }

        })
    },

    register: function(req, res){
        var newUser = new User(req.body);
        newUser.save(function(err, user){
            if(err){
                return res.json(err)
            } else {
                req.session.user = user._id
                return res.json(user)
            }
        })
    },


    current: (req, res) => {
        if(!req.session.user){
            res.redirect('/')
        } else {
            return res.json(req.session.user)
        }
    },

    logout: (req, res)=> {
        req.session.destroy();
        res.redirect('/')
    },

}
