import { JwtPayload } from 'jsonwebtoken'

/**
 * Extracts the userId from the decoded JWT token.
 * @param token - The decoded JWT token as JwtPayload.
 * @returns The userId as a string.
 * @throws
 */
export const extractUserIdFromToken = (token: JwtPayload): string => {
  if (typeof token === 'object' && token !== null && 'userId' in token) {
    return token.userId as string
  }
  throw new Error('Invalid token structure: userId not found')
}
