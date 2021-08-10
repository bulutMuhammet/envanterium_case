const { Console } = require('console');
var {MongoClient} = require('mongodb');
var url = "mongodb+srv://mbulut:notimportant@bulut.czwqd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";   

fs = require('fs');

async function location_barcode_amount(){
    const client = await MongoClient.connect(url, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });

    const db = client.db('mydb');
    
    var counts = await db.collection("counts").find({}, { projection: {_id:0, locationCode: 1, completedCounts:{contents:1} }}).toArray()
    var txt = 'location;barcode;amount\n'
    counts.forEach(count =>{
        var contents_arr =  count.completedCounts[0].contents 
        contents_arr.forEach(content => {
            txt += `${count.locationCode};${content.barcode};${content.amount}\n`
            
            
        });
    })
    fs.writeFile('location_barcode_amount.txt', txt, function (err) {
        if (err) return console.log(err);
        
    });

    client.close();
}

async function barcode_amount(){
    const client = await MongoClient.connect(url, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });

    const db = client.db('mydb');
    

    var counts = await db.collection("counts").find({}, { projection: {_id:0, locationCode: 1, completedCounts:{contents:1} }}).toArray()
    var txt = 'barcode;amount\n'
    counts.forEach(count =>{
        var contents_arr =  count.completedCounts[0].contents 

        contents_arr.forEach(content => {
            txt += `${content.barcode};${content.amount}\n`
        });
    })
    fs.writeFile('barcode_amount.txt', txt, function (err) {
        if (err) return console.log(err);
        
    });
    client.close();
}

// I tried to handle the query operations in javascript, this is probably not a good way at all but I don't know much about aggregation operations in mongodb  
async function aggregated_report(){
    const client = await MongoClient.connect(url, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });

    const db = client.db('mydb');

    var counts = await db.collection("counts").find({}, { projection: {_id:0, locationCode: 1, completedCounts:{contents:1} }}).toArray()
    var masters = await db.collection("master").find({}).toArray()
    
    var txt = 'location;barcode;amount;sku;urun adi\n'
    counts.forEach(count =>{
        var contents_arr =  count.completedCounts[0].contents 
        contents_arr.forEach(content =>{
            masters.forEach(master =>{
                if(content.barcode == master.barcode){
                    txt+=`${count.locationCode};${content.barcode};${content.amount};${master.sku};${master['urun adi']}\n`
                }
            })
        })
        
    })

    fs.writeFile('aggregated_report.txt', txt, function (err) {
        if (err) return console.log(err);
        
    });
   

    client.close();
}


// use what you need

// location_barcode_amount()
// barcode_amount()
// aggregated_report()
