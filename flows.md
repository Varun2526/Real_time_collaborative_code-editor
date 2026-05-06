### jwt flow 
🔹 Login
1. user logs in
2. backend verifies credentials
3. generate JWT → { userId }
4. send token
🔹 Protected route
1. frontend sends token
2. backend verifies token
3. extract userId
4. fetch user from DB

note : we store jwt {userid} because 
            ❌Why NOT email?
            Email can change
            Slightly bigger payload
            Not needed for DB queries
            ❌ Why NOT provider?
            Not required for authentication
            Adds unnecessary complexity
            You can always fetch it from DB


### flow for register 
What Register Should Do (Logic First)
1. Get data (username, email, password)
2. Validate input
3. Check if user already exists
4. Hash password (bcrypt)
5. Create user in DB
6. Generate JWT
7. Send token (cookie + response)

### flow for login
1. Get email + password
2. Find user by email
3. If not found → error
4. Compare password (bcrypt.compare)
5. If wrong → error
6. Generate JWT
7. Send cookie
8. Send response

### flow for logout []

1. Clear cookie (set to empty, expires immediately)
2. Send response (optional message)

####  flow What createRoom should do

1. verify user (middleware)
2. generate unique roomId
3. create room in DB
4. owner = logged-in user
5. return room data

note : for the sharable link (roomid) we can generate a unique roomId using a library like `uuid` instead of using the database ID. This way, we can keep the roomId separate from the database and avoid exposing internal IDs. The flow would be:



### flow for get my rooms
1. user must be logged in (verifyToken)
2. get userId from req.user
3. find all rooms where owner = userId
4. return list of rooms


### flow for join room

    User clicks Join
        ↓
    Frontend sends request
        ↓
    Backend validates everything
        ↓
    Add user to pendingRequests
        ↓
    Notify moderators/owner
        ↓
    Moderator approves/rejects
        ↓
    User becomes member







### Flow for the chat controller(messaging between users in the same room)

User opens room
    ↓
GET /chat/:roomId  (controller)
    ↓
Messages loaded
    ↓
Socket connects
    ↓
User sends message
    ↓
Socket event → server
    ↓
Save in DB
    ↓
Broadcast to room
    ↓
All users update UI instantly

