var {MongoClient} = require('mongodb');
const fs = require('fs');


var url = "mongodb+srv://mbulut:notimportant@bulut.czwqd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";    

var counts, master;

fs.readFile("inputs/counts.json", (err, data) => {
  if (err) throw err;
    counts = JSON.parse(data);
});

fs.readFile("inputs/master.json", (err, data) => {
  if (err) throw err;
    master = JSON.parse(data);
});


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");  
 
  insertMany("counts", counts, db, dbo)
  insertMany("master", master, db, dbo)
  
});




function insertMany(name, obj, db, dbo){
    dbo.collection(name).insertMany(obj, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
}