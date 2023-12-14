module.exports = loggedInCheckPoint = (req, res, next) => {
    if(req.authorized){
      res.redirect('/keepMeLoggedIn')
    }
    else {
      next()}
  }