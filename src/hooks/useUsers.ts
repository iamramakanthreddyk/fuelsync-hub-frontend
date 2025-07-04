/**
 * React Query hooks for user management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import type { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest, ResetPasswordRequest } from '@/api/api-contract';

/**
 * Hook to fetch all users for the current tenant
 * @returns Query result with users data
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getUsers(),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to fetch a user by ID
 * @param userId User ID
 * @returns Query result with user data
 */
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getUser(userId),
    enabled: !!userId,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to create a user
 * @returns Mutation result for creating a user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

/**
 * Hook to update a user
 * @returns Mutation result for updating a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    },
  });
};

/**
 * Hook to delete a user
 * @returns Mutation result for deleting a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

/**
 * Hook to change user password
 * @returns Mutation result for changing password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ChangePasswordRequest }) =>
      usersApi.changePassword(userId, data),
  });
};

/**
 * Hook to reset user password
 * @returns Mutation result for resetting password
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ResetPasswordRequest }) =>
      usersApi.resetPassword(userId, data),
  });
};