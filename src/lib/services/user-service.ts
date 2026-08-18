import { mockUsers } from "@/lib/mock-data/users";
import type { User } from "@/types";

export function findUserByEmail(email: string): User | undefined {
  return mockUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

export function validateCredentials(
  email: string,
  password: string,
): Omit<User, "password"> | null {
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
