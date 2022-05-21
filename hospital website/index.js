var express = require("express")
var ejs=require('ejs');
var mongoose = require("mongoose")
var upload=require('express-fileupload')
let port=5000;

const app = express();

let filename="";
let names="";
let datadocs="";

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(upload())



mongoose.connect('mongodb://localhost:27017/testDB',{ useNewUrlParser: true,useUnifiedTopology: true });

mongoose.connection.on('connected',()=>{
console.log("mongoDB connected");
})




let testSchema={
    name:String,
    Code:String,
    Age:String,
    Diagnosis:String,
    Datein:String,
    Dateout:String,
    Medications:String,
    TreatmentPlans:String,
    filename:String,
    ProgressNote:String,
    BillDate:String

}

let testmodel=mongoose.model('user',testSchema)


app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/',(req,res)=>{
    res.render('index')
});

app.get('/gallery',(req,res)=>{
    res.render('gallery')
})

app.get('/contact',(req,res)=>{
    res.render('contact')
})


app.post('/register',(req,res)=>{
    var name = req.body.name;
    var Code = req.body.Code;
    var Age = req.body.Age;
    var Diagnosis = req.body.Diagnosis;
    var Datein = req.body.Datein;
    var Dateout = req.body.Dateout;
    var Medications = req.body.Medications;
    var TreatmentPlans = req.body.TreatmentPlans;
    
    var ProgressNote = req.body.ProgressNote;
    var BillDate = req.body.BillDate;

    let file=req.files.image;
    filename=file.name;
    console.log(filename);
    file.mv('./public/uploads/'+filename,(err)=>{
        if(!err){
            console.log("file uploaded sucessfully");
        }else{
            console.log(err);
        }
    })

     datadocs = new testmodel({
        name: name,
        Code : Code,
        Age: Age,
        Diagnosis : Diagnosis,
        Datein: Datein,
        Dateout : Dateout,
        Medications: Medications,
        TreatmentPlans : TreatmentPlans,
        filename: filename,
        ProgressNote : ProgressNote,
        BillDate : BillDate
    })

    datadocs.save();


    res.redirect('/table');
})


app.get('/table',(req,res)=>{
    testmodel.find({},(err,found)=>{
        if(!err){
            res.render('table1',{data:found})
        }else{
            console.log(err);
        }
    
})




})

app.post('/table',(req,res)=>{
    let dele=req.body.checkbox;
    testmodel.findByIdAndDelete(dele,(err)=>{
        if(!err){
            console.log("deleted sucessfully");
            res.redirect('/table');
        }else{
            console.log(err);
        }
    })
})



app.listen(port,(res)=>{
    console.log(`server runs on port ${port}`);
})