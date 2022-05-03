# Adventuresy Backend

Backend for Adventuresy App(app.adventuresy.in) built on top of `Express JS` alongwith `PostgreSQL` database. Currently working on a service which will use `Socket.io` for discussion rooms for the adventurers/travellers.


<!-- GETTING STARTED -->
## Getting Started

To run this app locally on your PC, follow the instructions given below:

### Prerequisites

1. You must be having Node 14 or higher installed on your PC.
2. You must install PostgreSQL locally or use a deployed one having the config variables.
3. For OAuth, you need to make a Google Cloud Platform(it's free :)) account and setup OAuth configurations(can follow a article or Youtube video).

### Installation

1. Get the following API keys/secrets/config variables:
 * PostgreSQL DB secrets/config variables.
 * JWT and Cookie Secret(for Authorization)
 * NODE_ENV('development' or 'production')
 * PORT(keep it >1000 :))
 * GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET(get it from Credentials in GCP)

2. Clone the repo
   ```sh
   git clone https://github.com/bishalpandit/adventuresy-apis.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create a .env file in root folder and write your Secret keys/tokens listed above.
   ```js
   const KEY = KEY_VALUE;
   ```


<!-- USAGE EXAMPLES -->
## Usage

You may make your own Postman collection by checking the routes folder in src and test the API endpoints(). But you don't need to as I've done it to make
things quicker for  you. Import the postman collection via this link ```https://www.getpostman.com/collections/2d1f774e250dfc6bd1b5``` in your Postman and start testing them.

To run this, use ```npm run start``` and for more configuration details, check out the package.json file.

### RoadMap
[&check;] 1. Authentication and Authorization. </br>
[.] 2. Recommendations based on User Logs. </br>
[.] 2. AdvenSpaces - Discussion Rooms for Adventurers. </br>
[.] 3. Adventure Partner Finder.

### Possible Improvement Plans
1. Shifting to Typescript for better error checking.
2. Improve the SQL queries(most possibly by rewiring the table relations)

### Bugs
None rn :)
