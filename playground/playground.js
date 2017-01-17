const express = require('express');
const app = express();
const router = express.Router();




// route
router.route("/xyz")
    .get(function (req, res, next) {
                    res.status(200).send("OK-Router");
    });

app.get('/xyz', function(req,res,next){
    res.send('OK');
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 401;
    err.url = (req) ? req.url : '';
    next(err);
});


app.listen(3000);

