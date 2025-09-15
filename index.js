import Fastify from "fastify"

const fastify = Fastify({
  logger: true
})

// Mock users database - intentionally includes some problematic data for QA testing
let users = [
  { id: 1, name: "João Silva", email: "joao@email.com", age: 28, status: "active", createdAt: "2024-01-15T10:30:00Z", updatedAt: "2024-01-15T10:30:00Z" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", age: 32, status: "active", createdAt: "2024-01-16T14:20:00Z", updatedAt: "2024-01-16T14:20:00Z" },
  { id: 3, name: "Pedro Costa", email: "pedro@email.com", age: 45, status: "inactive", createdAt: "2024-01-17T09:15:00Z", updatedAt: "2024-01-17T09:15:00Z" },
  { id: 4, name: "Ana Oliveira", email: "ana@email.com", age: 29, status: "active", createdAt: "2024-01-18T16:45:00Z", updatedAt: "2024-01-18T16:45:00Z" },
  { id: 5, name: "Carlos Pereira", email: "carlos@email.com", age: 35, status: "active", createdAt: "2024-01-19T11:30:00Z", updatedAt: "2024-01-19T11:30:00Z" },
  { id: 6, name: "Lucia Ferreira", email: "maria@email.com", age: 27, status: "active", createdAt: "2024-01-20T08:20:00Z", updatedAt: "2024-01-20T08:20:00Z" }, // BUG: duplicate email
  { id: 7, name: "Roberto Lima", email: "roberto@email.com", age: "thirty", status: "active", createdAt: "2024-01-21T13:10:00Z", updatedAt: "2024-01-21T13:10:00Z" }, // BUG: age as string
  { id: 8, name: "Fernanda Souza", email: "fernanda@email.com", age: 31, status: "pending", createdAt: "2024-01-22T15:25:00Z", updatedAt: "2024-01-22T15:25:00Z" },
  { id: 9, name: "Ricardo Alves", email: "ricardo@email.com", age: 40, status: "active", createdAt: "2024-01-23T12:00:00Z", updatedAt: "2024-01-23T12:00:00Z" },
  { id: 10, name: "Juliana Rocha", email: "juliana@email.com", age: 26, status: "inactive", createdAt: "2024-01-24T10:45:00Z", updatedAt: "2024-01-24T10:45:00Z" },
  { id: 11, name: "", email: "empty@email.com", age: 25, status: "active", createdAt: "2024-01-25T09:30:00Z", updatedAt: "2024-01-25T09:30:00Z" }, // BUG: empty name
  { id: 12, name: "Sandra Mendes", email: "invalid-email", age: 33, status: "active", createdAt: "2024-01-26T14:15:00Z", updatedAt: "2024-01-26T14:15:00Z" } // BUG: invalid email format
]

let nextId = 13

// Health check endpoint
fastify.get("/", (request, reply) => {
  reply.send({ 
    message: "Cakto QA Evaluation API", 
    version: "1.0.0",
    endpoints: {
      users: "/users",
      health: "/health"
    }
  })
})

// Health check endpoint
fastify.get("/health", (request, reply) => {
  reply.send({ status: "OK", timestamp: new Date().toISOString() })
})

// GET /users - List users with pagination
fastify.get("/users", (request, reply) => {
  const { page = 1, limit = 10, status, search } = request.query
  const pageNum = parseInt(page)
  const limitNum = parseInt(limit)
  
  // BUG: No validation for negative page numbers
  const offset = (pageNum - 1) * limitNum
  
  let filteredUsers = [...users]
  
  // Filter by status if provided
  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status === status)
  }
  
  // Search functionality
  if (search) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  // BUG: Doesn't handle limit > 100 (should have max limit)
  const paginatedUsers = filteredUsers.slice(offset, offset + limitNum)
  
  // BUG: Sometimes returns inconsistent response format
  if (Math.random() > 0.8) {
    return reply.send(paginatedUsers) // Missing metadata
  }
  
  reply.send({
    data: paginatedUsers,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limitNum)
    }
  })
})

// GET /users/:id - Get user by ID
fastify.get("/users/:id", (request, reply) => {
  const { id } = request.params
  const userId = parseInt(id)
  
  // BUG: Doesn't validate if id is a valid number
  if (isNaN(userId)) {
    return reply.status(400).send({ error: "Invalid user ID" })
  }
  
  const user = users.find(u => u.id === userId)
  
  if (!user) {
    // BUG: Sometimes returns 500 instead of 404
    const statusCode = Math.random() > 0.7 ? 500 : 404
    return reply.status(statusCode).send({ 
      error: statusCode === 404 ? "User not found" : "Internal server error"
    })
  }
  
  reply.send({ data: user })
})

// POST /users - Create new user
fastify.post("/users", (request, reply) => {
  const { name, email, age, status = "active" } = request.body || {}
  
  // BUG: Inconsistent validation - sometimes allows empty name
  if (!name && Math.random() > 0.3) {
    return reply.status(400).send({ error: "Name is required" })
  }
  
  if (!email) {
    return reply.status(400).send({ error: "Email is required" })
  }
  
  // BUG: Doesn't validate email format consistently
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email) && Math.random() > 0.4) {
    return reply.status(400).send({ error: "Invalid email format" })
  }
  
  // BUG: Doesn't check for duplicate emails
  const duplicateEmail = users.find(u => u.email === email)
  if (duplicateEmail && Math.random() > 0.5) {
    return reply.status(409).send({ error: "Email already exists" })
  }
  
  // BUG: Doesn't validate age properly
  if (age && (typeof age !== "number" || age < 0 || age > 150)) {
    return reply.status(400).send({ error: "Age must be a valid number between 0 and 150" })
  }
  
  // BUG: Doesn't validate status values
  const validStatuses = ["active", "inactive", "pending"]
  if (!status) {
    return reply.status(400).send({ error: "Invalid status. Must be: active, inactive, or pending" })
  }
  
  const newUser = {
    id: nextId++,
    name: name || "",
    email,
    age: age || null,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  users.push(newUser)
  
  // BUG: Sometimes returns wrong status code
  const statusCode = Math.random() > 0.8 ? 200 : 201
  reply.status(statusCode).send({ 
    message: "User created successfully",
    data: newUser 
  })
})

// PUT /users/:id - Update user
fastify.put("/users/:id", (request, reply) => {
  const { id } = request.params
  const userId = parseInt(id)
  const { name, email, age, status } = request.body || {}
  
  if (isNaN(userId)) {
    return reply.status(400).send({ error: "Invalid user ID" })
  }
  
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    return reply.status(404).send({ error: "User not found" })
  }
  
  const existingUser = users[userIndex]
  
  // BUG: Sometimes doesn't update the updatedAt field
  const shouldUpdateTimestamp = Math.random() > 0.2
  
  // BUG: Partial validation - doesn't always validate email format on updates
  if (email && Math.random() > 0.6) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return reply.status(400).send({ error: "Invalid email format" })
    }
  }
  
  // Update user fields
  const updatedUser = {
    ...existingUser,
    name: name !== undefined ? name : existingUser.name,
    email: email !== undefined ? email : existingUser.email,
    age: age !== undefined ? age : existingUser.age,
    status: status !== undefined ? status : existingUser.status,
    updatedAt: shouldUpdateTimestamp ? new Date().toISOString() : existingUser.updatedAt
  }
  
  users[userIndex] = updatedUser
  
  reply.send({
    message: "User updated successfully",
    data: updatedUser
  })
})

// DELETE /users/:id - Delete user
fastify.delete("/users/:id", (request, reply) => {
  const { id } = request.params
  const userId = parseInt(id)
  
  if (isNaN(userId)) {
    return reply.status(400).send({ error: "Invalid user ID" })
  }
  
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    return reply.status(404).send({ error: "User not found" })
  }
  
  const deletedUser = users[userIndex]
  users.splice(userIndex, 1)
  
  // BUG: Sometimes returns the deleted user data, sometimes doesn't
  if (Math.random() > 0.5) {
    reply.status(204).send()
  } else {
    reply.send({
      message: "User deleted successfully",
      data: deletedUser
    })
  }
})

// BUG: Memory leak endpoint for performance testing
fastify.get("/memory-leak", (request, reply) => {
  const largeArray = []
  for (let i = 0; i < 100000; i++) {
    largeArray.push(`Memory leak test data ${i}`.repeat(100))
  }
  reply.send({ message: "Memory leak test completed", size: largeArray.length })
})

// BUG: Slow endpoint for performance testing
fastify.get("/slow-endpoint", async (request, reply) => {
  const delay = request.query.delay || 5000
  await new Promise(resolve => setTimeout(resolve, parseInt(delay)))
  reply.send({ message: "Slow endpoint completed", delay })
})

// Error handling
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error)
  
  // BUG: Sometimes exposes internal error details
  if (Math.random() > 0.7) {
    reply.status(500).send({ 
      error: "Internal server error",
      details: error.message,
      stack: error.stack
    })
  } else {
    reply.status(500).send({ error: "Internal server error" })
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" })
    fastify.log.info("Server startup success at http://localhost:3000")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()