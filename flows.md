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

#### flow What createRoom should do

1. verify user (middleware)
2. get data (title, description, language, visibility)
3. validate input (title required, valid visibility)
4. generate unique roomId (using `uuid`)
5. create room in DB (owner = logged-in user)
6. return room data

note : for the sharable link (roomid) we can generate a unique roomId using a library like `uuid` instead of using the database ID. This way, we can keep the roomId separate from the database and avoid exposing internal IDs.



### flow for get my rooms
1. user must be logged in (verifyToken)
2. get userId from req.user
3. find all rooms where owner = userId
4. return list of rooms


### flow for global search rooms
1. get search query (`q`)
2. set base filter (only `public` rooms)
3. if query exists, apply full-text search (`$text`)
4. fetch rooms and return list

### flow for join room

    User clicks Join
        ↓
    Frontend sends request
        ↓
    Backend validates (room exists, not member, not pending, room not full)
        ↓
    Is room public?
      ├── YES ──> Add directly as member
      └── NO ───> Add user to pendingRequests
                        ↓
                  Notify moderators/owner
                        ↓
                  Moderator approves/rejects
                        ↓
                  User becomes member (if approved)

### Flow for the chat controller (messaging between users in the same room)

            User opens room
                ↓
            GET /chat/:roomId  (controller)
                ↓
            Backend validates room exists & user is member
                ↓
            Backend fetches messages using internal room `_id`
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

### flow for code controller (fetching/saving code)
1. verify user (middleware)
2. get `roomId`
3. fetch room & validate user is a member
4. GET: return `code` and `language`
5. PUT: validate input and `language` (must be allowed), update `code` and `language`, save room

### flow for advanced room management

**Promote to Moderator (Owner only)**
1. verify user (middleware)
2. check if requester is the `owner`
3. check if target user is a member
4. change target user role to `moderator`
5. save room

**Demote Moderator (Owner only)**
1. verify user (middleware)
2. check if requester is the `owner`
3. check if target user is currently a `moderator`
4. change target user role to `member`
5. save room

**Transfer Ownership (Owner only)**
1. verify user (middleware)
2. check if requester is the `owner`
3. check if target user is a member
4. change target user role to `owner`
5. change requester role to `moderator`
6. save room

**Update Room Settings (Owner or Moderator)**
1. verify user (middleware)
2. check if requester is `owner` or `moderator`
3. update allowed fields (`title`, `description`, `visibility`, `allowGuests`, `maxUsers`)
4. save room

**Delete Room (Owner only)**
1. verify user (middleware)
2. check if requester is the `owner`
3. delete all associated messages (`MessageModel.deleteMany`)
4. delete the room (`Room.deleteOne`)
