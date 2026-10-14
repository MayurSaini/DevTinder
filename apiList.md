Dev Tinder Apis

Auth Router
POST /signup
POST /login
POST /logout

Profile Router
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

connectionRequestRouter
POST /request/send/integrated/:userId
POST /reques/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

userRouter
GET /connections
GET /request/received
GET /feed - Gets you the feed or the profile of other users


skip = (page - 1) * limit



