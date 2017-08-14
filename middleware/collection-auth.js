const Collection = require('../models/collection.js');


function authorizeCampaign(req, res, next) {
    Collection.findById(req.params.id, (err, collection) => {
        // If there's an error, forward it
        if (err) {
            return next(err);
        }
        // If there is no campaign, return a 404
        if (!collection) {
            return next(new Error('404'));
        }
        // If the collection belongs to the user, next()
        if (collection.belongsTo(req.user)) {
            return next();
        } else {
            return res.redirect(`/collections/${collection._id}`);
        }
/*         if (campaign._creator.equals(req.user._id)) {
            return next();
        } else {
            // Otherwise, redirect
            return res.redirect(`/campaigns/${campaign._id}`);
        } */
    });
}

/**
 * We should use res.locals over req when the data will only be used in the view.
 */
function checkOwnership(req, res, next){
  Collection.findById(req.params.id, (err, collection) => {
    if (err){ return next(err); }
    if (!collection){ return next(new Error('404')); }

    if (collection.belongsTo(req.user)){
      res.locals.collectionIsCurrentUsers = true;
    } else {
      res.locals.collectionIsCurrentUsers = false;
    }
    return next();
  });
}

module.exports = {
  authorizeCampaign,
  checkOwnership
};