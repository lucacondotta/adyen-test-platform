module.exports = (router) => {
  router.get('/', async (req, res, next) => {
    res.render('pages/index', { title: 'Adyen Test Platform', pageTitle: 'Adyen Test Platform'});
  });
};
