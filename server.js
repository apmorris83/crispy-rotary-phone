const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
const fs = require('fs');

let info;
const data = fs.readFile('public/bills.json',(err,data) => {
    if (err) throw err;
    info = JSON.parse(data);
});

app.get('/', (req,res) => res.render('pages/index',{data:JSON.stringify(info)}));
app.get('/:section/:row/:month/:amount',(req,res) => {
    info.forEach(section => {
        if(section.name === req.params.section){
            return section.rows.forEach(row => {
                if(row.name === req.params.row){
                    return row.amounts[req.params.month] += Number(req.params.amount);
                }
            })
        }
    });
    const data = JSON.stringify(info);
    fs.writeFile('public/bills.json', data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    res.redirect('/');
});
app.listen(3000);