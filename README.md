# childmiles-server

Message for future me:
- Postman
All endpoints are stored at collection childMilles!!! Hope it would be useful for future!

- Secret Information
HTTPS files like **server.cert** and **server.key** or **config.js** file or docker files (**Dockerfile, init-mongo.js, docker-compose.yml and .dockerignore**) are stored at my **Drive: Credentials/ChildMiles**

- Docker commands you can use:
```docker-compose up```  <br />
```docker-compose up --build```  <br />
```docker-compose down```  <br />
```docker image rm --force childmiles-server_app```  <br />
Acessing mongo bash:
```docker exec -it childmiles-mongo mongo  -u 'xxx' -p 'xxx'```
Some commands I used developing this API
```show dbs
use <DB name>
db.dropDatabase();
show collections
db.<collection name>.drop();```

To create a home http certification, use this command:
```openssl req -nodes -new -x509 -keyout server.key -out server.cert``` at the folder level at index.js file. After look at index.js changes!!!
