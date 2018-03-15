var http = require('http')

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:')

db.serialize(function () {
  db.run('CREATE TABLE Vegetables (Name TEXT, Price INTEGER, Color TEXT)')
})


const server = http.createServer((req, res) => {

	if (req.method === 'GET') {

		if (req.url === '/vegetables/vegetable'){
			var q = 'SELECT * FROM Vegetables where name = \'' + req.headers.name + '\''
			db.all(q, [], (err, rows) => {
		 		if (err) {
		    		throw err;
		  		}

			res.setHeader('Content-Type', 'application/json');
			if (rows.length === 0) {
	 			res.writeHead(404, { 'Content-Type': 'application/json' });
	  			res.end(JSON.stringify('Not found'));
			} else {
				res.writeHead(200, { 'Content-Type': 'application/json' });
	  			res.end(JSON.stringify(rows));
			}
			});
		} else 	if (req.url === '/vegetables') {
			var q = 'SELECT * FROM Vegetables'
			db.all(q, [], (err, rows) => {
		 		if (err) {
		    		throw err;
		  		}
			if (rows.length === 0) {
	 			res.writeHead(404, { 'Content-Type': 'application/json' });
	  			res.end(JSON.stringify('No vegetables founded'));
			} else {
				res.writeHead(200, { 'Content-Type': 'application/json' });
	  			res.end(JSON.stringify(rows));
			}
			});
		} else {
			res.setHeader('Content-Type', 'application/json');
 			res.writeHead(404, { 'Content-Type': 'application/json' });
  			res.end('Not found');
		}
	
	} else {
		let body = [];
		req.on('data', (chunk) => {
	  	body.push(chunk);
		}).on('end', () => {
	 	body = JSON.parse(Buffer.concat(body).toString());

	 	if (req.method === 'POST' && req.url === '/vegetables/create') {
	 		var stmt = db.prepare('INSERT INTO Vegetables VALUES (?,?,?)')
			stmt.run(body.name, body.price, body.color);
			stmt.finalize()
			res.setHeader('Content-Type', 'text/html');
 			res.writeHead(201, { 'Content-Type': 'text/html' });
  			res.end('Vegetable added');
	 	} else if (req.method === "PUT"  && req.url === '/vegetables/update') {
	 		console.log('put method')
	 		db.run('UPDATE Vegetables set Name = \'' + body.name + '\', Price = ' + body.price + ', Color = \'' + body.color  + '\' WHERE Name = \'' + body.name + '\'')
			res.setHeader('Content-Type', 'text/html');
 			res.writeHead(204, { 'Content-Type': 'text/html' });
  			res.end('Vegetable updated');
	 	} else if (req.method === "DELETE") {
	 		if (req.url === '/vegetables/delete/name'){
		 		db.run('DELETE  FROM Vegetables WHERE Name = \'' + req.headers.name + '\'')
				res.setHeader('Content-Type', 'text/html');
	 			res.writeHead(200, { 'Content-Type': 'text/html' });
	  			res.end('Vegetable deleted');
	 		} else if (req.url === '/vegetables/delete'){
	 			db.run('DELETE  FROM Vegetables')
				res.setHeader('Content-Type', 'text/html');
	 			res.writeHead(200, { 'Content-Type': 'text/html' });
	  			res.end('Vegetables deleted');
	 		}
	 	}

	 	})
	 }
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen({
	host: 'localhost',
	port: 5000
}, function(){
	console.log('listening at port 5000')
});