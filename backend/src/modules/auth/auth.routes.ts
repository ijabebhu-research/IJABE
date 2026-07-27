import { Router } from 'express'

import { requireAuth } from '../../middleware/require-auth.js'
import { login, logout, me, refresh, updateAccount } from './auth.controller.js'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/refresh', refresh)
authRouter.get('/me', requireAuth, me)
authRouter.put('/account', requireAuth, updateAccount)

export { authRouter }
