# Streamviewer

Streamviewer allows you to view topyoutube live streaming and interact with other viewer in real time.
The functionality is described in details
[here](https://gist.github.com/osamakhn/aeed06830fbafa2ff9fd31a8326fec0d):

#### Technical Design, Assumption and Considerations

- ##### Frontend (Client)
  - Following are some of key modules developed to handle different responsibility:
    - core: Containing mainly singleton services and single-use components
    - shared: Consisting mainly shared resources (e.g. common components, directives and pipes)
    - home: Handles the main landing area after login
    - login: Handles mainly authentication (Allows login using Google)
    - stream: Handles all live streaming related functionality including viewing, live chat, stats, message history, etc.
  - In order to handle the live chat, a websocket is being used both on client and server side. websocket integration is allowing to fetch and post new messages on server side.
    It's completely real time and no polling is done from client side. Server is notifying the client when new chat message is posted on any stream.
  - To get different stats, an api is used. The api allows to get stats and sort them.
  - A chat history in streaming page allows you to view all the messages (kind of archive) and allows to filter
    by the user.
- ##### Backend (Server)
  - Following are some of key modules developed to handle different responsibility:
    - common: Contains the shared services e.g. YoutubeAPI integration client
    - api: Mainly contains/handles the routing for different APIs
    - main: This is main module. This is containing data model definition for live chat messages along with having different apis defined into it.
  - [Django Rest Framework](https://www.django-rest-framework.org/) is used to provide rest api support.
  - [Django All Auth](https://github.com/pennersr/django-allauth) and [Django Rest Auth](https://django-rest-auth.readthedocs.io/en/latest/) is used to handle authentication using google account as well as post login, JWT based data access.
  - There are mainly three rest APIs developed.
    - [/api/youtube/livestream/](http://sv.nikhilnavadiya.in/api/youtube/livestream/) - Gets the top livestreams from youtube
    - [/api/youtube/stats/](http://sv.nikhilnavadiya.in/api/youtube/stats/) - Stats and analysis api for live streaming. Returns the stats including sender and total number of messages sent
      for given stream.
    - [/api/youtube/stream-chat/](http://sv.nikhilnavadiya.in/api/youtube/stream-chat/) - Gets all the chat messages for give stream. Allows to filter by sender (user)

#### How to setup frontend:

Frontend is build using angular(v7). I used a known boilerplate named [ngX-Rocket](https://github.com/ngx-rocket/generator-ngx-rocket) in order to setup the project structure quickly. ngX-Rocket allows to start project in seconds.

Follow below steps to quickly start with frontend:

- Go to project folder (frontend) and install dependencies:

```bash
npm install
```

- In src/environments/environment.ts and environment.prod.ts - add google developer key against googleDeveloperKey setting.
- Launch development server, and open `localhost:4200` in your browser:

```bash
npm start
```

For more detailed guideline, refer to [ngX-Rocket](https://github.com/ngx-rocket/generator-ngx-rocket) documentation.

#### How to setup server (backend):

Server side (backend) is build using django. I used [django-cookiecutter](https://github.com/pydanny/cookiecutter-django/) boilerplate to quickly start with it.

Follow below steps to quickly start with backend:

- Install python3.6, pip3, virtualenv, etc
- Create and activate virtual env
- Go to project folder (server) and install dependencies:

```bash
pip install -r requirements/local.txt
```

- Create mysql database.
- Create file named ".env" and specify the database url along with google developer key(oauth2 client), etc.

```bash
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/NAME
GOOGLE_DEVELOPER_KEY=
```

- Run migration to create tables.

```bash
 python manage.py migrate
```

- Launch development server, and open `localhost:8000` in your browser:

```bash
python manage.py runserver
```
