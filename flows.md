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

