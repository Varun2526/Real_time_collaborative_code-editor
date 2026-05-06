
# Room Controller API Use Cases

# 1. CREATE ROOM

## Endpoint

POST `/api/rooms/create`

---

## Purpose

Creates a new collaborative coding room.

The logged-in user automatically becomes:
- owner
- first member of the room

---

## Example Flow

```txt
User logs in
    ↓
Creates room
    ↓
Backend generates unique roomId
    ↓
User added as owner
    ↓
Room saved in database
````

---

## Example Database Entry

```js
Room {
    roomId: "abcd1234",

    members: [
        {
            user: "abc123",
            role: "owner"
        }
    ]
}
```

---

## Success Response

```json
{
  "message": "Room created successfully",
  "payload": {}
}
```

---

# 2. GET MY ROOMS

## Endpoint

GET `/api/rooms/my-rooms`

---

## Purpose

Returns all rooms where current user is:

* owner
* moderator
* member

---

## Example Flow

```txt
User logs in
    ↓
Requests own rooms
    ↓
Backend finds all rooms containing userId
    ↓
Returns room list
```

---

## Example Query

```js
Room.find({
   "members.user": userId
})
```

---

## Success Response

```json
{
  "message": "Rooms fetched successfully",
  "payload": []
}
```

---

# 3. GET ROOM BY ID

## Endpoint

GET `/api/rooms/:roomId`

---

## Purpose

Fetches room details.

Only accessible by approved room members.

---

## Example Flow

```txt
User opens room link
    ↓
Backend checks:
    - room exists?
    - user is member?
    ↓
Returns room details
```

---

## Access Rules

Allowed:

* owner
* moderator
* member

Denied:

* random users
* pending users

---

## Success Response

```json
{
  "message": "Room fetched successfully",
  "payload": {}
}
```

---

# 4. REQUEST JOIN ROOM

## Endpoint

POST `/api/rooms/:roomId/request-join`

---

## Purpose

Allows a user to request access to a room.

---

## Example Flow

```txt
User opens shared room link
    ↓
User clicks request join
    ↓
Backend validates:
    - room exists
    - not already member
    - not already pending
    - room not full
    ↓
Adds user to pendingRequests
```

---

## Public Room Case

```txt
If room is public:
    user joins directly
```

---

## Private Room Case

```txt
If room is private:
    user added to pendingRequests
```

---

## Example Database Update

```js
pendingRequests: [
    "abc123"
]
```

---

## Success Response

```json
{
  "message": "Join request sent successfully"
}
```

---

# 5. GET PENDING REQUESTS

## Endpoint

GET `/api/rooms/:roomId/pending`

---

## Purpose

Returns all pending join requests.

Only accessible by:

* owner
* moderator

---

## Example Flow

```txt
Moderator opens pending requests
    ↓
Backend validates role
    ↓
Returns pending users
```

---

## Example Response

```json
{
  "message": "Pending requests fetched successfully",

  "payload": [
    {
      "_id": "abc123",
      "username": "Varun",
      "email": "varun@mail.com"
    }
  ]
}
```

---

# 6. APPROVE JOIN REQUEST

## Endpoint

POST `/api/rooms/:roomId/approve/:userId`

---

## Purpose

Approves pending join request.

User becomes room member.

---

## Example Flow

```txt
Moderator clicks approve
    ↓
Backend validates:
    - room exists
    - moderator access
    - request pending
    - room not full
    ↓
User removed from pendingRequests
    ↓
User added to members
```

---

## Example Database Update

Before:

```js
pendingRequests: [
    "abc123"
]
```

After:

```js
members: [
    {
        user: "abc123",
        role: "member"
    }
]
```

---

## Success Response

```json
{
  "message": "Join request approved successfully"
}
```

---

# 7. REJECT JOIN REQUEST

## Endpoint

POST `/api/rooms/:roomId/reject/:userId`

---

## Purpose

Rejects pending join request.

User is removed from pendingRequests.

---

## Example Flow

```txt
Moderator clicks reject
    ↓
Backend validates:
    - room exists
    - moderator access
    - request pending
    ↓
Request removed
```

---

## Example Database Update

Before:

```js
pendingRequests: [
    "abc123"
]
```

After:

```js
pendingRequests: []
```

---

## Success Response

```json
{
  "message": "Join request rejected successfully"
}
```

---

# Future APIs

These are planned future room features.

---

## Leave Room

POST `/api/rooms/:roomId/leave`

Allows user to leave room voluntarily.

---

## Remove Member

DELETE `/api/rooms/:roomId/members/:userId`

Moderator/owner removes member.

---

## Promote Moderator

PATCH `/api/rooms/:roomId/promote/:userId`

Owner promotes member → moderator.

---

## Demote Moderator

PATCH `/api/rooms/:roomId/demote/:userId`

Moderator becomes normal member.

---

## Transfer Ownership

PATCH `/api/rooms/:roomId/transfer-ownership/:userId`

Transfers owner role to another user.

---

## Update Room Settings

PATCH `/api/rooms/:roomId/settings`

Updates:

* privacy
* max users
* guest access

---

## Delete Room

DELETE `/api/rooms/:roomId`

Deletes room permanently.

Only owner allowed.

---

```
```
